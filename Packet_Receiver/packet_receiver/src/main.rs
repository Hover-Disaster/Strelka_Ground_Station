use binread::{io::Cursor, BinRead, BinReaderExt};
use data_structures::{
    Accel1StateRes, Accel2StateRes, Baro1StateRes, Baro2StateRes, BatVolRes, ContinuityRes,
    FireDrogueRes, FireMainRes, FlashStateRes, Gps1StateRes, Gps2StateRes, GpsTrackingConfigRes,
    GpsTrackingPacket, Gyro1StateRes, Gyro2StateRes, Mag1StateRes, Mag2StateRes,
};
use rumqttc::{Client, MqttOptions, QoS};
use serde::{Deserialize, Serialize};
use std::thread;
use std::{env, process, time::Duration};
use std::{error::Error, fmt::format};

use serialport;
pub mod data_structures;
pub mod definitions;

const RECEIVER_HARDWARE_ID: u32 = 0x00;
// TODO: Change to real ID
const SENDER_HARDWARE_ID: u32 = 0x00;

struct PacketDecoder {
    sender_id: u32,
    mqtt_client: Client,
    mqtt_connection: rumqttc::Connection,
    broker_address: String,
    client_id: String,
    port: u16,
}

impl PacketDecoder {
    /*
    TODO:
    - Check list of valid sender IDs
    - Return meaningful values when erroring out
     */
    fn new(broker_address: String, port: u16, client_id: String) -> Self {
        let mut mqttoptions = MqttOptions::new(client_id.clone(), broker_address.clone(), port);
        mqttoptions.set_keep_alive(Duration::from_secs(5));
        // mqttoptions.set_credentials("kicsensor", "");

        let (mut mqtt_client, mut connection) = Client::new(mqttoptions, 10);

        return PacketDecoder {
            sender_id: 0x00,
            mqtt_client: mqtt_client,
            mqtt_connection: connection,
            broker_address: broker_address.to_string(),
            port: port,
            client_id: client_id,
        };
    }
    fn handle_packet(&mut self, packet: &Vec<u8>) {
        // Check header bytes
        let identifier = u16::from_le_bytes([packet[0], packet[1]]);
        self.sender_id = u32::from_le_bytes(packet[2..6].try_into().unwrap());
        let receiver_id = u32::from_le_bytes(packet[6..10].try_into().unwrap());
        if receiver_id != RECEIVER_HARDWARE_ID {
            eprintln!("Receiver id does not match receiver hardware id");
            return;
        }
        // TODO: Check a file containing all valid sender IDs
        else if self.sender_id != SENDER_HARDWARE_ID {
            eprintln!("Sender id does not match sender hardware id");
            return;
        }
        if let Some(payload_length) = self.get_payload_length(identifier) {
        } else {
            // TODO return meaningful error message
            println!("Unknown message identifier");
            return;
        }
        let crc_vector = self.u8_array_to_u32_array(&packet[..packet.len() - 4]);
        let calcualted_crc32: u32 = self.crc_stm32(&crc_vector);
        let received_crc32: u32 =
            u32::from_le_bytes(packet[packet.len() - 4..packet.len()].try_into().unwrap());
        if calcualted_crc32 != received_crc32 {
            // TODO: Handle error when CRCs do not match
            eprintln!("Received CRC32 does not match calcualted CRC32");
            // return;
        }
        println!("Decode a packet");
        self.decode_packet(identifier, &packet[10..packet.len() - 4]);
    }

    fn get_payload_length(&mut self, identifier: u16) -> Option<usize> {
        match identifier {
            definitions::BAT_VOL_REQ => Some(definitions::BAT_VOL_REQ_PKT_LEN as usize),
            definitions::BAT_VOL_RES => Some(definitions::BAT_VOL_RES_PKT_LEN as usize),
            definitions::CONTINUITY_REQ => Some(definitions::CONTINUITY_REQ_PKT_LEN as usize),
            definitions::CONTINUITY_RES => Some(definitions::CONTINUITY_RES_PKT_LEN as usize),
            definitions::FIRE_DROGUE_REQ => Some(definitions::FIRE_DROGUE_REQ_PKT_LEN as usize),
            definitions::FIRE_DROGUE_RES => Some(definitions::FIRE_DROGUE_RES_PKT_LEN as usize),
            definitions::FIRE_MAIN_REQ => Some(definitions::FIRE_MAIN_REQ_PKT_LEN as usize),
            definitions::FIRE_MAIN_RES => Some(definitions::FIRE_MAIN_RES_PKT_LEN as usize),
            definitions::GPS1_STATE_REQ => Some(definitions::GPS1_STATE_REQ_PKT_LEN as usize),
            definitions::GPS1_STATE_RES => Some(definitions::GPS1_STATE_RES_PKT_LEN as usize),
            definitions::GPS2_STATE_REQ => Some(definitions::GPS2_STATE_REQ_PKT_LEN as usize),
            definitions::GPS2_STATE_RES => Some(definitions::GPS2_STATE_RES_PKT_LEN as usize),
            definitions::ACCEL1_STATE_REQ => Some(definitions::ACCEL1_STATE_REQ_PKT_LEN as usize),
            definitions::ACCEL1_STATE_RES => Some(definitions::ACCEL1_STATE_RES_PKT_LEN as usize),
            definitions::ACCEL2_STATE_REQ => Some(definitions::ACCEL2_STATE_REQ_PKT_LEN as usize),
            definitions::ACCEL2_STATE_RES => Some(definitions::ACCEL2_STATE_RES_PKT_LEN as usize),
            definitions::GYRO1_STATE_REQ => Some(definitions::GYRO1_STATE_REQ_PKT_LEN as usize),
            definitions::GYRO1_STATE_RES => Some(definitions::GYRO1_STATE_RES_PKT_LEN as usize),
            definitions::GYRO2_STATE_REQ => Some(definitions::GYRO2_STATE_REQ_PKT_LEN as usize),
            definitions::GYRO2_STATE_RES => Some(definitions::GYRO2_STATE_RES_PKT_LEN as usize),
            definitions::MAG1_STATE_REQ => Some(definitions::MAG1_STATE_REQ_PKT_LEN as usize),
            definitions::MAG1_STATE_RES => Some(definitions::MAG1_STATE_RES_PKT_LEN as usize),
            definitions::MAG2_STATE_REQ => Some(definitions::MAG2_STATE_REQ_PKT_LEN as usize),
            definitions::MAG2_STATE_RES => Some(definitions::MAG2_STATE_RES_PKT_LEN as usize),
            definitions::BARO1_STATE_REQ => Some(definitions::BARO1_STATE_REQ_PKT_LEN as usize),
            definitions::BARO1_STATE_RES => Some(definitions::BARO1_STATE_RES_PKT_LEN as usize),
            definitions::BARO2_STATE_REQ => Some(definitions::BARO2_STATE_REQ_PKT_LEN as usize),
            definitions::BARO2_STATE_RES => Some(definitions::BARO2_STATE_RES_PKT_LEN as usize),
            definitions::FLASH_MEMORY_STATE_REQ => {
                Some(definitions::FLASH_MEMORY_STATE_REQ_PKT_LEN as usize)
            }
            definitions::FLASH_MEMORY_STATE_RES => {
                Some(definitions::FLASH_MEMORY_STATE_RES_PKT_LEN as usize)
            }
            definitions::FLASH_MEMORY_CONFIG_SET => {
                Some(definitions::FLASH_MEMORY_CONFIG_SET_PKT_LEN as usize)
            }
            definitions::GPS_TRACKING_CONFIG_REQ => {
                Some(definitions::GPS_TRACKING_CONFIG_RES_PKT_LEN as usize)
            }
            definitions::GPS_TRACKING_CONFIG_RES => {
                Some(definitions::GPS_TRACKING_CONFIG_SET_PKT_LEN as usize)
            }
            definitions::GPS_TRACKING_CONFIG_SET => {
                Some(definitions::GPS_TRACKING_PACKET_PKT_LEN as usize)
            }
            definitions::GPS_TRACKING_PACKET => {
                Some(definitions::GPS_TRACKING_PACKET_PKT_LEN as usize)
            }

            _ => None, // Handle unknown identifier
        }
    }

    fn decode_packet(&mut self, identifier: u16, payload: &[u8]) {
        let mut mqtt_topic = format!("Strelka_{}", self.sender_id);
        let mut mqtt_payload = String::new();

        match identifier {
            definitions::BAT_VOL_RES => {
                let bat_vol_res: BatVolRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/BatVol", mqtt_topic);
                mqtt_payload = serde_json::to_string(&bat_vol_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::CONTINUITY_RES => {
                let continuity_res: ContinuityRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/Continuity", mqtt_topic);
                mqtt_payload = serde_json::to_string(&continuity_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::FIRE_DROGUE_RES => {
                let fire_drogue_res: FireDrogueRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/FireDrogue", mqtt_topic);
                mqtt_payload = serde_json::to_string(&fire_drogue_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::FIRE_MAIN_RES => {
                let fire_main_res: FireMainRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/FireMain", mqtt_topic);
                mqtt_payload = serde_json::to_string(&fire_main_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::GPS1_STATE_RES => {
                let gps1_state_res: Gps1StateRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/Gps1State", mqtt_topic);
                mqtt_payload = serde_json::to_string(&gps1_state_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::GPS2_STATE_RES => {
                let gps2_state_res: Gps2StateRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/Gps2State", mqtt_topic);
                mqtt_payload = serde_json::to_string(&gps2_state_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::ACCEL1_STATE_RES => {
                let accel1_state_res: Accel1StateRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/Accel1State", mqtt_topic);
                mqtt_payload = serde_json::to_string(&accel1_state_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::ACCEL2_STATE_RES => {
                let accel2_state_res: Accel2StateRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/Accel2State", mqtt_topic);
                mqtt_payload = serde_json::to_string(&accel2_state_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::GYRO1_STATE_RES => {
                let gyro1_state_res: Gyro1StateRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/Gyro1State", mqtt_topic);
                mqtt_payload = serde_json::to_string(&gyro1_state_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::GYRO2_STATE_RES => {
                let gyro2_state_res: Gyro2StateRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/Gyro2State", mqtt_topic);
                mqtt_payload = serde_json::to_string(&gyro2_state_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::MAG1_STATE_RES => {
                let mag1_state_res: Mag1StateRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/Mag1State", mqtt_topic);
                mqtt_payload = serde_json::to_string(&mag1_state_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::MAG2_STATE_RES => {
                let mag2_state_res: Mag2StateRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/Mag2State", mqtt_topic);
                mqtt_payload = serde_json::to_string(&mag2_state_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::BARO1_STATE_RES => {
                let baro1_state_res: Baro1StateRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/Baro1State", mqtt_topic);
                mqtt_payload = serde_json::to_string(&baro1_state_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::BARO2_STATE_RES => {
                let baro2_state_res: Baro2StateRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/Baro2State", mqtt_topic);
                mqtt_payload = serde_json::to_string(&baro2_state_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::FLASH_MEMORY_STATE_RES => {
                let flash_memory_state_res: FlashStateRes = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/FlashState", mqtt_topic);
                mqtt_payload = serde_json::to_string(&flash_memory_state_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::GPS_TRACKING_CONFIG_RES => {
                let gps_tracking_config_res: GpsTrackingConfigRes =
                    bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/GpsTrackingConfig", mqtt_topic);
                mqtt_payload = serde_json::to_string(&gps_tracking_config_res)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::GPS_TRACKING_PACKET => {
                let gps_tracking_packet: GpsTrackingPacket = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/GpsTrackingPacket", mqtt_topic);
                mqtt_payload = serde_json::to_string(&gps_tracking_packet)
                    .expect("Failed to serialize to JSON packet");
            }
            _ => {}
        }

        println!(
            "Identifier: {}\nTopic: {}\nPayload: {}",
            identifier, mqtt_topic, mqtt_payload
        );
        self.mqtt_client
            .publish(mqtt_topic, QoS::AtLeastOnce, false, mqtt_payload);
    }

    fn crc_stm32(&mut self, data: &[u32]) -> u32 {
        let mut crc: u32 = 0xFFFFFFFF;

        for &data_point in data {
            crc = (crc ^ data_point) & 0xFFFFFFFF;
            for _ in 0..32 {
                if crc & 0x80000000 != 0 {
                    crc = ((crc << 1) & 0xFFFFFFFF) ^ 0x04C11DB7;
                } else {
                    crc = (crc << 1) & 0xFFFFFFFF;
                }
            }
        }

        crc & 0xFFFFFFFF
    }

    fn u8_array_to_u32_array(&mut self, array: &[u8]) -> Vec<u32> {
        let mut u32_array: Vec<u32> = Vec::with_capacity(array.len() / 4);

        for value in array {
            u32_array.push(*value as u32);
        }

        u32_array
    }
}

fn main() {
    /* USB COM Port Settings */
    let baud_rate = 9600;
    let com_port = "COM8";

    /* MQTT Settings */
    let broker_address = "192.168.0.11";
    let mqtt_port = 1883;
    let client_id = "test";
    let mut decoder: PacketDecoder =
        PacketDecoder::new(broker_address.to_owned(), mqtt_port, client_id.to_owned());

    let ports = serialport::available_ports().expect("Error: No COM ports available");
    println!("{:#?}", ports);
    // Iterate over the ports and check if any matches the Arduino's characteristics
    for port in ports {
        println!("Port names: {}", port.port_name.to_lowercase());
        // if port.port_name.to_lowercase().contains("usb") && port.port_type.is_usb_serial() {
        //     return Some(port.port_name);
        // }
    }

    let mut port = serialport::new(com_port, baud_rate)
        .timeout(Duration::from_millis(1))
        .open()
        .expect("Failed to open port");

    // loop {
    //     let bytes_available = port.bytes_to_read().unwrap();
    //     if bytes_available > 0 {
    //         let mut serial_buf: Vec<u8> = vec![0; bytes_available as usize];
    //         let bytes_read = port.read(&mut serial_buf).unwrap();
    //         decoder.handle_packet(&serial_buff.to_vec());
    //     }
    // }
}
