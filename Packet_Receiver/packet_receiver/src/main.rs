use binread::{io::Cursor, BinRead, BinReaderExt};
use bytes::{Buf, Bytes};
use data_structures::{
    Accel1StateRes, Accel2StateRes, Baro1StateRes, Baro2StateRes, BatVolRes, ContinuityRes,
    FireDrogueRes, FireMainRes, FlashStateRes, Gps1StateRes, Gps2StateRes, GpsTrackingConfigRes,
    GpsTrackingConfigSet, GpsTrackingPacket, Gyro1StateRes, Gyro2StateRes, Mag1StateRes,
    Mag2StateRes, StreamPacketConfigSet, StreamPacketType0, StreamPacketType1, StreamPacketType2,
    StreamPacketType3, StreamPacketType4, StreamPacketType5, StreamPacketType6, StreamPacketType7,
};
use mqtt::Packet;
use rumqttc::{AsyncClient, Event, EventLoop, Incoming, MqttOptions, QoS};
use serde::{Deserialize, Serialize};
use serde_json::{from_slice, from_str, to_string};
use std::error::Error;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tokio::{task, time};

use serialport::{ClearBuffer, SerialPort, SerialPortType, UsbPortInfo};

pub mod data_structures;
pub mod definitions;

const RECEIVER_HARDWARE_ID: u32 = 0x00;
// TODO: Change to real ID
const SENDER_HARDWARE_ID: u32 = 0x00;

const MIN_PACKET_SIZE: usize = 13;

struct PacketHandler {
    pub current_node_ids: Vec<u32>,
    pub update_current_nodes: bool,
}

impl PacketHandler {
    /*
    TODO:
    - Check list of valid sender IDs
    - Return meaningful values when erroring out
     */
    fn new(current_node_ids: &Vec<u32>) -> Self {
        return PacketHandler {
            current_node_ids: Vec::new(),
            update_current_nodes: false,
        };
    }

    fn handle_downstream_packet(
        &mut self,
        topic: &String,
        payload: &Bytes,
    ) -> Result<Vec<u8>, String> {
        println!("Received packet from {}, {:#?}", topic, payload);
        // Extract receiver_id from topic
        let mut receiver_id = 0;
        // println!("Data received from topic: {:?}", topic.as_str());
        if topic.as_str() == "current_node_ids" {
            // Current node id array received
            #[derive(Debug, Deserialize)]
            struct incoming_data {
                id_array: Vec<u32>,
            }
            let payload_byte_str: Vec<u8> = payload.to_vec();
            let data_struct: incoming_data =
                serde_json::from_str(std::str::from_utf8(&payload_byte_str).unwrap()).unwrap();
            let new_ids = data_struct.id_array;
            // Add new ids to current node ids array
            for &new_element in &new_ids {
                if !self.current_node_ids.contains(&new_element) {
                    self.current_node_ids.push(new_element);
                    self.update_current_nodes = true;
                }
            }
        } else {
            let topic_fields: Vec<&str> = topic.split('/').collect(); // split into [Node_{receiver_id}, subtopic]
            if let Some(index) = topic_fields[0].find('_') {
                // Extract all characters after '_' and convert to receiver_id (u32)
                receiver_id = topic_fields[0][(index + 1)..].parse::<u32>().unwrap();
            } else {
                // Handle the case where '_' is not found
                eprintln!(
                    "No receiver_id found in incoming topic: {}",
                    topic_fields[0]
                );
            }
            // Construct generic packet struct for easy serialisation to bytes later
            let mut packet = data_structures::generic_packet {
                identifier: 0x00,
                sender_id: SENDER_HARDWARE_ID,
                receiver_id: receiver_id,
                crc32: 0, // Gateway ID
            };

            let mut encoded_bytes = Vec::new();
            let mut payload_bytes: Vec<u8> = Vec::new();
            match topic_fields[1] {
                "BatVolReq" => {
                    packet.identifier = definitions::BAT_VOL_REQ;
                }
                "ContinuityReq" => {
                    packet.identifier = definitions::CONTINUITY_REQ;
                }
                "FireDrogueReq" => {
                    packet.identifier = definitions::FIRE_DROGUE_REQ;
                }
                "FireMainReq" => {
                    packet.identifier = definitions::FIRE_MAIN_REQ;
                }
                "Gps1StateReq" => {
                    packet.identifier = definitions::GPS1_STATE_REQ;
                }
                "Gps2StateReq" => {
                    packet.identifier = definitions::GPS2_STATE_REQ;
                }
                "Accel1StateReq" => {
                    packet.identifier = definitions::ACCEL1_STATE_REQ;
                }
                "Accel2StateReq" => {
                    packet.identifier = definitions::ACCEL2_STATE_REQ;
                }
                "Gyro1StateReq" => {
                    packet.identifier = definitions::GYRO1_STATE_REQ;
                }
                "Gyro2StateReq" => {
                    packet.identifier = definitions::GYRO2_STATE_REQ;
                }
                "Mag1StateReq" => {
                    packet.identifier = definitions::MAG1_STATE_REQ;
                }
                "Mag2StateReq" => {
                    packet.identifier = definitions::MAG2_STATE_REQ;
                }
                "Baro1StateReq" => {
                    packet.identifier = definitions::BARO1_STATE_REQ;
                }
                "Baro2StateReq" => {
                    packet.identifier = definitions::BARO2_STATE_REQ;
                }
                "FlashMemoryStateReq" => {
                    packet.identifier = definitions::FLASH_MEMORY_STATE_REQ;
                }
                "FlashMemoryConfigSet" => {
                    packet.identifier = definitions::FLASH_MEMORY_CONFIG_SET;
                    // TODO: Add payload field into packet
                    // payload_bytes =
                }
                "GpsTrackingConfigReq" => {
                    packet.identifier = definitions::GPS_TRACKING_CONFIG_REQ;
                }
                "GpsTrackingConfigSet" => {
                    // Good test cmd for this packet: mosquitto_pub -h 192.168.0.11 -p 1883 -t Node_0/GpsTrackingConfigSet -m '{"chirp_frequency":1, "tracking_enabled":1}'
                    packet.identifier = definitions::GPS_TRACKING_CONFIG_SET;
                    // Unpack json payload bytes into struct
                    // Convert Bytes to Vec<u8>
                    let payload_byte_str: Vec<u8> = payload.to_vec();

                    // Parse the JSON string into your struct
                    match serde_json::from_slice::<GpsTrackingConfigSet>(&payload_byte_str) {
                        Ok(gps_tracking_payload) => {
                            // Successfully deserialized
                            // println!("{:?}", gps_tracking_payload);
                            payload_bytes = bincode::serialize(&gps_tracking_payload).unwrap();
                        }
                        Err(err) => {
                            eprintln!("Error deserializing JSON: {}", err);
                        }
                    }
                }
                "StreamPacketConfigSet" => {
                    packet.identifier = definitions::STREAM_PKT_CONFIG_SET;
                    let payload_byte_str: Vec<u8> = payload.to_vec();
                    // Parse the JSON string into your struct
                    match serde_json::from_slice::<StreamPacketConfigSet>(&payload_byte_str) {
                        Ok(stream_pkt_config_payload) => {
                            // Successfully deserialized
                            // println!("{:?}", stream_pkt_config_payload);
                            payload_bytes = bincode::serialize(&stream_pkt_config_payload).unwrap();
                        }
                        Err(err) => {
                            eprintln!("Error deserializing JSON: {}", err);
                        }
                    }
                }
                _ => {
                    eprintln!("Received packet from an unrecognised topic");
                }
            }

            // Serialise packet into byte array
            encoded_bytes = bincode::serialize(&packet).unwrap();
            if !payload_bytes.is_empty() {
                let payload_index_offset = 10;
                // Insert payload bytes into packet after receiver_id field
                for (i, b) in payload_bytes.iter().enumerate() {
                    encoded_bytes.insert(payload_index_offset + i, *b);
                }
            }
            // Calculate CRC
            let crc_array = self.u8_array_to_u32_array(&encoded_bytes[..&encoded_bytes.len() - 4]);
            let crc32_bytes: [u8; 4] = self.crc_stm32(&crc_array).to_le_bytes();
            let len = encoded_bytes.len();
            encoded_bytes[len - 4..].copy_from_slice(&crc32_bytes);
            println!("Sending payload bytes to LoRa: {:?}", encoded_bytes);
            return Ok(encoded_bytes);
        }
        return Ok(vec![]);
    }

    fn handle_upstream_packet(&mut self, packet: &Vec<u8>) -> Result<(String, String), String> {
        if packet.len() < MIN_PACKET_SIZE {
            return Err("Packet incomplete, dropped".to_string());
        }
        // Check header bytes
        let identifier = u16::from_le_bytes([packet[0], packet[1]]);
        let protocol_version: u8 = u8::from_le(packet[2]);
        let incoming_sender_id = u32::from_le_bytes(packet[3..7].try_into().unwrap());
        let receiver_id = u32::from_le_bytes(packet[7..11].try_into().unwrap());

        // Check CRCs match
        if let Some(payload_length) = self.get_payload_length(identifier) {
        } else {
            return Err("Unknown message identifier".to_string());
        }
        let crc_vector = self.u8_array_to_u32_array(&packet[..packet.len() - 4]);
        let calcualted_crc32: u32 = self.crc_stm32(&crc_vector);
        let received_crc32: u32 =
            u32::from_le_bytes(packet[packet.len() - 4..packet.len()].try_into().unwrap());
        if calcualted_crc32 != received_crc32 {
            return Err("Received CRC32 does not match calcualted CRC32".to_string());
        }

        if protocol_version != 0 {
            return Err("Unknown protocol version".to_string());
        }

        // Check if incoming node id is known
        if !self.current_node_ids.contains(&incoming_sender_id) {
            // If not, add it to the list
            self.current_node_ids.push(incoming_sender_id);
        }
        if receiver_id != RECEIVER_HARDWARE_ID {
            return Err("Receiver id does not match receiver hardware id".to_string());
        }
        return Ok(self.decode_packet(
            identifier,
            &packet[11..packet.len() - 4],
            incoming_sender_id,
        ));
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
            definitions::STREAM_PKT_CONFIG_SET => Some(definitions::STREAM_PKT_CONFIG_LEN as usize),
            definitions::STREAM_PACKET_TYPE_0 => {
                Some(definitions::STREAM_PACKET_TYPE_0_LEN as usize)
            }
            definitions::STREAM_PACKET_TYPE_1 => {
                Some(definitions::STREAM_PACKET_TYPE_1_LEN as usize)
            }
            definitions::STREAM_PACKET_TYPE_2 => {
                Some(definitions::STREAM_PACKET_TYPE_2_LEN as usize)
            }
            definitions::STREAM_PACKET_TYPE_3 => {
                Some(definitions::STREAM_PACKET_TYPE_3_LEN as usize)
            }
            definitions::STREAM_PACKET_TYPE_4 => {
                Some(definitions::STREAM_PACKET_TYPE_4_LEN as usize)
            }
            definitions::STREAM_PACKET_TYPE_5 => {
                Some(definitions::STREAM_PACKET_TYPE_5_LEN as usize)
            }
            definitions::STREAM_PACKET_TYPE_6 => {
                Some(definitions::STREAM_PACKET_TYPE_6_LEN as usize)
            }
            definitions::STREAM_PACKET_TYPE_7 => {
                Some(definitions::STREAM_PACKET_TYPE_7_LEN as usize)
            }

            _ => None, // Handle unknown identifier
        }
    }

    fn decode_packet(
        &mut self,
        identifier: u16,
        payload: &[u8],
        incoming_sender_id: u32,
    ) -> (String, String) {
        let mut mqtt_topic = format!("Node_{}", incoming_sender_id);
        let mut mqtt_payload: String = String::new();

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
            definitions::STREAM_PKT_CONFIG_SET => {
                let stream_packet_config: StreamPacketConfigSet =
                    bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/StreamPacketConfigSet", mqtt_topic);
                mqtt_payload = serde_json::to_string(&stream_packet_config)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::STREAM_PACKET_TYPE_0 => {
                let stream_packet_0: StreamPacketType0 = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/StreamPacketType0", mqtt_topic);
                mqtt_payload = serde_json::to_string(&stream_packet_0)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::STREAM_PACKET_TYPE_1 => {
                let stream_packet_1: StreamPacketType1 = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/StreamPacketType0", mqtt_topic);
                mqtt_payload = serde_json::to_string(&stream_packet_1)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::STREAM_PACKET_TYPE_2 => {
                let stream_packet_2: StreamPacketType2 = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/StreamPacketType0", mqtt_topic);
                mqtt_payload = serde_json::to_string(&stream_packet_2)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::STREAM_PACKET_TYPE_3 => {
                let stream_packet_3: StreamPacketType3 = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/StreamPacketType0", mqtt_topic);
                mqtt_payload = serde_json::to_string(&stream_packet_3)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::STREAM_PACKET_TYPE_4 => {
                let stream_packet_4: StreamPacketType4 = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/StreamPacketType0", mqtt_topic);
                mqtt_payload = serde_json::to_string(&stream_packet_4)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::STREAM_PACKET_TYPE_5 => {
                let stream_packet_5: StreamPacketType5 = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/StreamPacketType0", mqtt_topic);
                mqtt_payload = serde_json::to_string(&stream_packet_5)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::STREAM_PACKET_TYPE_6 => {
                let stream_packet_6: StreamPacketType6 = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/StreamPacketType0", mqtt_topic);
                mqtt_payload = serde_json::to_string(&stream_packet_6)
                    .expect("Failed to serialize to JSON packet");
            }
            definitions::STREAM_PACKET_TYPE_7 => {
                let stream_packet_7: StreamPacketType7 = bincode::deserialize(payload).unwrap();
                mqtt_topic = format!("{}/StreamPacketType0", mqtt_topic);
                mqtt_payload = serde_json::to_string(&stream_packet_7)
                    .expect("Failed to serialize to JSON packet");
            }
            _ => {
                eprintln!("Unable to match identifier: {}", identifier);
            }
        }

        println!(
            "Identifier: {}\nTopic: {}\nPayload: {}",
            identifier, mqtt_topic, mqtt_payload
        );

        return (mqtt_topic, mqtt_payload);
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

async fn event_loop(
    mut eventloop: EventLoop,
    port: Arc<Mutex<Box<dyn SerialPort>>>,
    packet_handler: Arc<Mutex<PacketHandler>>,
) {
    loop {
        match eventloop.poll().await {
            Ok(event) => {
                match &event {
                    rumqttc::Event::Incoming(packet) => {
                        match packet {
                            rumqttc::Packet::Connect(_) => {}
                            rumqttc::Packet::ConnAck(_) => {}
                            rumqttc::Packet::Publish(incoming_packet) => {
                                // Take mutex on asynchronous packet_handler struct
                                let mut locked_handler = packet_handler.lock().unwrap();
                                match locked_handler.handle_downstream_packet(
                                    &incoming_packet.topic,
                                    &incoming_packet.payload,
                                ) {
                                    Ok(encoded_bytes) => {
                                        // TODO: Transmit these encoded bytes over Serialport to the arduino
                                        let mut locked_port = port.lock().unwrap();
                                        let bytes_written =
                                            locked_port.write(&encoded_bytes).unwrap();
                                        println!("Written {} to USB", bytes_written);
                                    }
                                    Err(err) => {
                                        eprintln!("Error: {}", err);
                                    }
                                }
                            }
                            _ => {}
                        }
                    }
                    rumqttc::Event::Outgoing(outgoing_packet) => {}
                }
                // println!("Received = {:?}", event);
            }
            Err(err) => {
                eprintln!("Error: {}", err);
            }
        }
    }
}

async fn subscribe_topics(current_node_ids: Vec<u32>, client: &AsyncClient) {
    for node_id in &current_node_ids {
        for downstream_topic in &data_structures::DOWNSTREAM_TOPICS {
            let topic = format!("Node_{}/{}", node_id, downstream_topic);
            match client.subscribe(&topic, QoS::AtMostOnce).await {
                Ok(()) => {
                    println!("Subscribed to {}", topic);
                }
                Err(err) => {
                    eprintln!("Error subscribing to {}: {}", topic, err);
                }
            }
            time::sleep(Duration::from_millis(1)).await;
        }
    }
}

#[tokio::main]
async fn main() {
    /* Node Identification Settings */
    let current_node_ids = vec![];

    /* USB COM Port Settings */
    let baud_rate = 115200;
    let mut com_port = String::from("");

    /* MQTT Settings */
    let broker_address = "localhost";
    let mqtt_port = 1883;
    let client_id = "lora_receiver";
    let mut async_packet_handler = Arc::new(Mutex::new(PacketHandler::new(&current_node_ids)));
    let main_packet_handler = Arc::clone(&async_packet_handler);

    let ports = serialport::available_ports().expect("Error: No COM ports available");

    // Iterate over the ports and check if any matches the Arduino's characteristics
    for port in &ports {
        match &port.port_type {
            SerialPortType::UsbPort(usb_info) => {
                if usb_info
                    .manufacturer
                    .clone()
                    .unwrap()
                    .starts_with("Arduino")
                {
                    com_port = port.port_name.clone();
                }
            }
            SerialPortType::PciPort => {}
            SerialPortType::BluetoothPort => {}
            SerialPortType::Unknown => {}
        }
    }

    println!("Reading from {} port", com_port);

    let mut port = Arc::new(Mutex::new(
        serialport::new(com_port, baud_rate)
            .timeout(Duration::from_millis(20))
            .open()
            .expect("Failed to open port"),
    ));
    let async_port = Arc::clone(&port);

    // Establish MQTT connection
    let mut mqttoptions = MqttOptions::new(client_id, broker_address, mqtt_port);
    mqttoptions.set_keep_alive(Duration::from_secs(5));

    let (mut client, mut eventloop) = AsyncClient::new(mqttoptions, 10);

    // Spawn async event loop to handle MQTT events
    println!("Spawning event loop");
    tokio::spawn(event_loop(eventloop, port, async_packet_handler));

    // Subscribe to all relevent topics for known node IDs. This allows downstream packets to be forwarded to the nodes
    subscribe_topics(current_node_ids, &client).await;
    // Subscribe to topic that notifies program of node ids to subscribe to
    let sub_topic = "current_node_ids";
    match client.subscribe(sub_topic, QoS::AtMostOnce).await {
        Ok(()) => {
            // println!("Subscribed to {}", sub_topic);
        }
        Err(err) => {
            eprintln!("Error subscribing to {}: {}", sub_topic, err);
        }
    }

    loop {
        let mut bytes_available = 0;
        let mut locked_port = async_port.lock().unwrap();
        if locked_port.bytes_to_read().unwrap() > 0 {
            // Wait for all the bytes to slowly arrive over the USB
            let delay_time_ms = time::Duration::from_millis(25);
            time::sleep(delay_time_ms).await;

            bytes_available = locked_port.bytes_to_read().unwrap();
            let mut read_buffer: Vec<u8> = vec![0; bytes_available as usize];
            let bytes_read = locked_port.read_exact(&mut read_buffer).unwrap();
            println!("Bytes read: {}", bytes_available);
            // Take mutex on asynchronous packet handler
            let mut locked_handler = main_packet_handler.lock().unwrap();
            match locked_handler.handle_upstream_packet(&read_buffer.to_vec()) {
                Ok((mqtt_topic, mqtt_payload)) => {
                    let async_client = client.clone();
                    task::spawn(async move {
                        println!("Publishing to topic: {}", mqtt_topic);
                        async_client
                            .publish(
                                mqtt_topic.clone(),
                                QoS::AtLeastOnce,
                                false,
                                mqtt_payload.clone(),
                            )
                            .await
                            .unwrap();
                        time::sleep(Duration::from_millis(100)).await;
                    });
                }
                Err(err) => {
                    eprintln!("Error: {}", err);
                    // TODO: handle the error case
                }
            }
        } else {
            drop(locked_port);
        }
        let mut locked_handler = main_packet_handler.lock().unwrap();
        // Check if current nodes have changed
        if locked_handler.update_current_nodes {
            locked_handler.update_current_nodes = false;
            subscribe_topics(locked_handler.current_node_ids.clone(), &client).await;
            // println!("Subscribing to topcis: {:?}", locked_handler.current_node_ids);
        }
        drop(locked_handler);
    }
}
