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

#[derive(Deserialize, Serialize, Debug)]
pub struct GpsTrackingPacket {
    pub latitude: f32,
    pub longitude: f32,
    pub altitude: f32,
    pub satellites_tracked: u8,
}
