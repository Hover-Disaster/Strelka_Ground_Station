use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct BatVolRes {
    pub battery_voltage: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct ContinuityRes {
    pub drogue_ematch_state: u8,
    pub main_ematch_state: u8,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct FireDrogueRes {
    pub fire_drogue_result: u8,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct FireMainRes {
    pub fire_main_result: u8,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct Gps1StateRes {
    pub gps1_good: u8,
    pub gps1_latitude: f32,
    pub gps1_longitude: f32,
    pub gps1_altitude: f32,
    pub gps1_satellites_tracked: u8,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct Gps2StateRes {
    pub gps2_good: u8,
    pub gps2_latitude: f32,
    pub gps2_longitude: f32,
    pub gps2_altitude: f32,
    pub gps2_satellites_tracked: u8,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct Accel1StateRes {
    pub acc1_good: u8,
    pub acc1X: f32,
    pub acc1Y: f32,
    pub acc1Z: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct Accel2StateRes {
    pub acc2_good: u8,
    pub acc2X: f32,
    pub acc2Y: f32,
    pub acc2Z: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct Gyro1StateRes {
    pub gyro1_good: u8,
    pub gyro1X: f32,
    pub gyro1Y: f32,
    pub gyro1Z: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct Gyro2StateRes {
    pub gyro2_good: u8,
    pub gyro2X: f32,
    pub gyro2Y: f32,
    pub gyro2Z: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct Mag1StateRes {
    pub mag1_good: u8,
    pub mag1X: f32,
    pub mag1Y: f32,
    pub mag1Z: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct Mag2StateRes {
    pub mag2_good: u8,
    pub mag2X: f32,
    pub mag2Y: f32,
    pub mag2Z: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct Baro1StateRes {
    pub baro1_good: u8,
    pub baro1_pressure: f32,
    pub baro1_temperature: f32,
    pub baro1_altitude: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct Baro2StateRes {
    pub baro2_good: u8,
    pub baro2_pressure: f32,
    pub baro2_temperature: f32,
    pub baro2_altitude: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct FlashStateRes {
    pub flash_good: u8,
    pub flash_write_speed: f32,
    pub available_flash_memory: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct FlashMemoryConfigSet {
    pub flash_logging_enabled: u8,
    pub flash_write_speed: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct GpsTrackingConfigRes {
    pub gps_tracking_enabled: u8,
    pub gps_tracking_chirp_frequency: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct GpsTrackingConfigSet {
    pub gps_tracking_enabled: u8,
    pub gps_tracking_chirp_frequency: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct GpsTrackingPacket {
    pub gps1_latitude: f32,
    pub gps1_longitude: f32,
    pub gps1_altitude: f32,
    pub gps1_satellites_tracked: u8,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct StreamPacketConfigSet {
    pub stream_packet_type_enabled: u8,
    pub packet_stream_frequency: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct StreamPacketType0 {
    pub timestamp: u32,
    pub gps1_latitude: f32,
    pub gps1_longitude: f32,
    pub gps1_altitude: f32,
    pub gps1_satellites_tracked: u8,
    pub acc1X: f32,
    pub acc1Y: f32,
    pub acc1Z: f32,
    pub velX: f32,
    pub velY: f32,
    pub velZ: f32,
    pub baro1_altitude: f32,
    pub gyro1X: f32,
    pub gyro1Y: f32,
    pub gyro1Z: f32,
    pub quaternion_q1: f32,
    pub quaternion_q2: f32,
    pub quaternion_q3: f32,
    pub quaternion_q4: f32,
    pub battery_voltage: f32,
    pub flight_state: u8,
    pub ambient_temperature: f32,
    pub available_flash_memory: f32,
    pub gps1_good: u8,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct StreamPacketType1;

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct StreamPacketType2;

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct StreamPacketType3;

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct StreamPacketType4;

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct StreamPacketType5;

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct StreamPacketType6;

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct StreamPacketType7;

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct StreamPacketConfigRes {
    pub stream_packet_type_enabled: u8,
    pub packet_stream_frequency: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct HeartBeatConfigPacketSet {
    pub heart_beat_enabled: u8,
    pub heart_beat_chirp_frequency: f32,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct HeartBeatPacket;

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct ArmDrogueReq {
    pub drogue_arm_state_set: u8,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct ArmMainReq {
    pub main_arm_state_set: u8,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct ArmMainRes {
    pub arm_main_state: u8,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct ArmDrogueRes {
    pub arm_drogue_state: u8,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct SystemStatePacketReq {
    pub state_packet_type: u8,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct SystemStatePacketType0Res {
    pub timestamp: u32,
    pub battery_voltage: f32,
    pub drogue_ematch_state: u8,
    pub main_ematch_state: u8,
    pub arm_drogue_state: u8,
    pub arm_main_state: u8,
    pub gps1_good: u8,
    pub gps1_latitude: f32,
    pub gps1_longitude: f32,
    pub gps1_satellites_tracked: u8,
    pub acc1_good: u8,
    pub acc1X: f32,
    pub acc1Y: f32,
    pub acc1Z: f32,
    pub acc2_good: u8,
    pub acc2X: f32,
    pub acc2Y: f32,
    pub acc2Z: f32,
    pub gyro1_good: u8,
    pub gyro1X: f32,
    pub gyro1Y: f32,
    pub gyro1Z: f32,
    pub gyro2_good: u8,
    pub gyro2X: f32,
    pub gyro2Y: f32,
    pub gyro2Z: f32,
    pub mag1_good: u8,
    pub mag1X: f32,
    pub mag1Y: f32,
    pub mag1Z: f32,
    pub baro1_good: u8,
    pub baro1_pressure: f32,
    pub baro1_temperature: f32,
    pub baro1_altitude: f32,
    pub flash_good: u8,
    pub flash_write_speed: f32,
    pub available_flash_memory: f32,
    pub gps_tracking_enabled: u8,
    pub gps_tracking_chirp_frequency: f32,
    pub stream_packet_type_enabled: u8,
    pub packet_stream_frequency: f32,
    pub heart_beat_enabled: u8,
    pub heart_beat_chirp_frequency: f32,
    pub flash_logging_enabled: u8,
    pub flight_state: u8,
}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct SystemStatePacketType1Res {}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct SystemStatePacketType2Res {}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct SystemStatePacketType3Res {}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct SystemStatePacketType4Res {}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct SystemStatePacketType5Res {}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct SystemStatePacketType6Res {}

#[derive(Deserialize, Serialize, Debug)]
#[repr(C)]
#[derive(Clone, Copy)]
pub struct SystemStatePacketType7Res {}

#[derive(Serialize, Deserialize, Debug)]
pub struct generic_packet {
    pub(crate) identifier: u16,
    pub(crate) protocol_version: u8,
    pub(crate) sender_id: u32,
    pub(crate) receiver_id: u32,
    // Note* No payload field included. This must be spliced in after serialisation of the struct
    pub(crate) crc32: u32,
}

pub(crate) static DOWNSTREAM_TOPICS: [&'static str; 25] = [
    "BatVolReq",
    "ContinuityReq",
    "FireDrogueReq",
    "FireMainReq",
    "Gps1StateReq",
    "Gps2StateReq",
    "Accel1StateReq",
    "Accel2StateReq",
    "Gyro1StateReq",
    "Gyro2StateReq",
    "Mag1StateReq",
    "Mag2StateReq",
    "Baro1StateReq",
    "Baro2StateReq",
    "FlashMemoryStateReq",
    "FlashMemoryConfigSet",
    "GpsTrackingConfigReq",
    "GpsTrackingConfigSet",
    "StreamPacketConfigSet",
    "StreamPacketConfigReq",
    "HeartBeatConfigPacketSet",
    "ArmDrogueReq",
    "ArmMainReq",
    "SystemStatePacketReq",
    "SystemRebootReq",
];
