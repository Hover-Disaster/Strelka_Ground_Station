use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub struct BatVolRes {
    pub battery_voltage: f32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct ContinuityRes {
    pub drogue_ematch_state: u8,
    pub main_ematch_state: u8,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct FireDrogueRes {
    pub result: u8,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct FireMainRes {
    pub result: u8,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Gps1StateRes {
    pub gps_good: u8,
    pub latitude: f32,
    pub longitude: f32,
    pub altitude: f32,
    pub satellites_tracked: u8,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Gps2StateRes {
    pub gps_good: u8,
    pub latitude: f32,
    pub longitude: f32,
    pub altitude: f32,
    pub satellites_tracked: u8,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Accel1StateRes {
    pub acc_good: u8,
    pub accX: f32,
    pub accY: f32,
    pub accZ: f32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Accel2StateRes {
    pub acc_good: u8,
    pub accX: f32,
    pub accY: f32,
    pub accZ: f32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Gyro1StateRes {
    pub gyro_good: u8,
    pub gyroX: f32,
    pub gyroY: f32,
    pub gyroZ: f32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Gyro2StateRes {
    pub gyro_good: u8,
    pub gyroX: f32,
    pub gyroY: f32,
    pub gyroZ: f32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Mag1StateRes {
    pub mag_good: u8,
    pub magX: f32,
    pub magY: f32,
    pub magZ: f32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Mag2StateRes {
    pub mag_good: u8,
    pub magX: f32,
    pub magY: f32,
    pub magZ: f32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Baro1StateRes {
    pub baro_good: u8,
    pub pressure: f32,
    pub temperature: f32,
    pub altitude: f32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct Baro2StateRes {
    pub baro_good: u8,
    pub pressure: f32,
    pub temperature: f32,
    pub altitude: f32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct FlashStateRes {
    pub flash_good: u8,
    pub write_speed: f32,
    pub available_space: f32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct FlashMemoryConfigSet {
    pub write_speed: f32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct GpsTrackingConfigRes {
    pub gps_good: u8,
    pub tracking_enabled: u8,
    pub chirp_frequency: f32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct GpsTrackingConfigSet {
    pub tracking_enabled: u8,
    pub chirp_frequency: f32,
}

#[derive(Deserialize, Serialize, Debug)]#[repr(align(1))]
pub struct GpsTrackingPacket {
    pub latitude: f32,
    pub longitude: f32,
    pub altitude: f32,
    pub satellites_tracked: u8,
}

#[derive(Deserialize, Serialize, Debug)]#[repr(align(1))]
pub struct StreamPacketConfigSet {
    pub packet_type_0_enable: u8,
    pub packet_type_0_stream_frequency: f32,
    pub packet_type_1_enable: u8,
    pub packet_type_1_stream_frequency: f32,
    pub packet_type_2_enable: u8,
    pub packet_type_2_stream_frequency: f32,
    pub packet_type_3_enable: u8,
    pub packet_type_3_stream_frequency: f32,
    pub packet_type_4_enable: u8,
    pub packet_type_4_stream_frequency: f32,
    pub packet_type_5_enable: u8,
    pub packet_type_5_stream_frequency: f32,
    pub packet_type_6_enable: u8,
    pub packet_type_6_stream_frequency: f32,
    pub packet_type_7_enable: u8,
    pub packet_type_7_stream_frequency: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
pub struct StreamPacketType0 {
    pub timestamp: u32,
    pub latitude: f32,
    pub longitude: f32,
    pub gps_altitude: f32,
    pub satellites_tracked: u8,
    pub lin_acc_x: f32,
    pub lin_acc_y: f32,
    pub lin_acc_z: f32,
    pub lin_vel_x: f32,
    pub lin_vel_y: f32,
    pub lin_vel_z: f32,
    pub baro_altitude: f32,
    pub ang_vel_x: f32,
    pub ang_vel_y: f32,
    pub ang_vel_z: f32,
    pub quaternion_q1: f32,
    pub quaternion_q2: f32,
    pub quaternion_q3: f32,
    pub quaternion_q4: f32,
    pub battery_voltage: f32,
    pub flight_state: u8,
    pub ambient_temperature: f32,
    pub available_flash_kb: f32,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct StreamPacketType1 {
    // Add fields as needed
}

#[derive(Deserialize, Serialize, Debug)]
pub struct StreamPacketType2 {
    // Add fields as needed
}

#[derive(Deserialize, Serialize, Debug)]
pub struct StreamPacketType3 {
    // Add fields as needed
}

#[derive(Deserialize, Serialize, Debug)]
pub struct StreamPacketType4 {
    // Add fields as needed
}

#[derive(Deserialize, Serialize, Debug)]
pub struct StreamPacketType5 {
    // Add fields as needed
}

#[derive(Deserialize, Serialize, Debug)]
pub struct StreamPacketType6 {
    // Add fields as needed
}

#[derive(Deserialize, Serialize, Debug)]
pub struct StreamPacketType7 {
    // Add fields as needed
}

#[derive(Serialize, Deserialize, Debug)]
pub struct generic_packet {
    pub(crate) identifier: u16,
    pub(crate) sender_id: u32,
    pub(crate) receiver_id: u32,
    // Note* No payload field included. This must be spliced in after serialisation of the struct
    pub(crate) crc32: u32,
}

pub(crate) static DOWNSTREAM_TOPICS: [&'static str; 19] = ["BatVolReq", "ContinuityReq", "FireDrogueReq", "FireMainReq", "Gps1StateReq", "Gps2StateReq", "Accel1StateReq", "Accel2StateReq", "Gyro1StateReq", "Gyro2StateReq", "Mag1StateReq", "Mag2StateReq", "Baro1StateReq", "Baro2StateReq", "FlashMemoryStateReq", "FlashMemoryConfigSet", "GpsTrackingConfigReq", "GpsTrackingConfigSet", "StreamPacketConfigSet"];