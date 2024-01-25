pub const BAT_VOL_REQ: u16 = 0x00;
pub const BAT_VOL_RES: u16 = 0x01;
pub const CONTINUITY_REQ: u16 = 0x02;
pub const CONTINUITY_RES: u16 = 0x03;
pub const FIRE_DROGUE_REQ: u16 = 0x04;
pub const FIRE_DROGUE_RES: u16 = 0x05;
pub const FIRE_MAIN_REQ: u16 = 0x06;
pub const FIRE_MAIN_RES: u16 = 0x07;
pub const GPS1_STATE_REQ: u16 = 0x08;
pub const GPS1_STATE_RES: u16 = 0x09;
pub const GPS2_STATE_REQ: u16 = 0x0A;
pub const GPS2_STATE_RES: u16 = 0x0B;
pub const ACCEL1_STATE_REQ: u16 = 0x0C;
pub const ACCEL1_STATE_RES: u16 = 0x0D;
pub const ACCEL2_STATE_REQ: u16 = 0x0E;
pub const ACCEL2_STATE_RES: u16 = 0x0F;
pub const GYRO1_STATE_REQ: u16 = 0x10;
pub const GYRO1_STATE_RES: u16 = 0x11;
pub const GYRO2_STATE_REQ: u16 = 0x12;
pub const GYRO2_STATE_RES: u16 = 0x13;
pub const MAG1_STATE_REQ: u16 = 0x14;
pub const MAG1_STATE_RES: u16 = 0x15;
pub const MAG2_STATE_REQ: u16 = 0x16;
pub const MAG2_STATE_RES: u16 = 0x17;
pub const BARO1_STATE_REQ: u16 = 0x18;
pub const BARO1_STATE_RES: u16 = 0x19;
pub const BARO2_STATE_REQ: u16 = 0x1A;
pub const BARO2_STATE_RES: u16 = 0x1B;
pub const FLASH_MEMORY_STATE_REQ: u16 = 0x1C;
pub const FLASH_MEMORY_STATE_RES: u16 = 0x1D;
pub const FLASH_MEMORY_CONFIG_SET: u16 = 0x1E;
pub const GPS_TRACKING_CONFIG_REQ: u16 = 0x1F;
pub const GPS_TRACKING_CONFIG_RES: u16 = 0x20;
pub const GPS_TRACKING_CONFIG_SET: u16 = 0x21;
pub const GPS_TRACKING_PACKET: u16 = 0x22;
pub const STREAM_PACKET_CONFIG_SET: u16 = 0x23;
pub const STREAM_PACKET_TYPE_0: u16 = 0x24;
pub const STREAM_PACKET_TYPE_1: u16 = 0x25;
pub const STREAM_PACKET_TYPE_2: u16 = 0x26;
pub const STREAM_PACKET_TYPE_3: u16 = 0x27;
pub const STREAM_PACKET_TYPE_4: u16 = 0x28;
pub const STREAM_PACKET_TYPE_5: u16 = 0x29;
pub const STREAM_PACKET_TYPE_6: u16 = 0x2A;
pub const STREAM_PACKET_TYPE_7: u16 = 0x2B;
pub const STREAM_PACKET_CONFIG_REQ: u16 = 0x2C;
pub const STREAM_PACKET_CONFIG_RES: u16 = 0x2D;
pub const HEART_BEAT_CONFIG_PACKET_SET: u16 = 0x2E;
pub const HEART_BEAT_PACKET: u16 = 0x2F;
pub const ARM_DROGUE_REQ: u16 = 0x30;
pub const ARM_MAIN_REQ: u16 = 0x31;
pub const ARM_MAIN_RES: u16 = 0x32;
pub const ARM_DROGUE_RES: u16 = 0x33;
pub const SYSTEM_STATE_PACKET_REQ: u16 = 0x34;
pub const SYSTEM_STATE_PACKET_TYPE_0_RES: u16 = 0x35;
pub const SYSTEM_STATE_PACKET_TYPE_1_RES: u16 = 0x36;
pub const SYSTEM_STATE_PACKET_TYPE_2_RES: u16 = 0x37;
pub const SYSTEM_STATE_PACKET_TYPE_3_RES: u16 = 0x38;
pub const SYSTEM_STATE_PACKET_TYPE_4_RES: u16 = 0x39;
pub const SYSTEM_STATE_PACKET_TYPE_5_RES: u16 = 0x3A;
pub const SYSTEM_STATE_PACKET_TYPE_6_RES: u16 = 0x3B;
pub const SYSTEM_STATE_PACKET_TYPE_7_RES: u16 = 0x3C;

pub const BAT_VOL_REQ_PACKET_LEN: u32 = 0x00;
pub const BAT_VOL_RES_PACKET_LEN: u32 = 0x04;
pub const CONTINUITY_REQ_PACKET_LEN: u32 = 0x00;
pub const CONTINUITY_RES_PACKET_LEN: u32 = 0x02;
pub const FIRE_DROGUE_REQ_PACKET_LEN: u32 = 0x00;
pub const FIRE_DROGUE_RES_PACKET_LEN: u32 = 0x01;
pub const FIRE_MAIN_REQ_PACKET_LEN: u32 = 0x00;
pub const FIRE_MAIN_RES_PACKET_LEN: u32 = 0x01;
pub const GPS1_STATE_REQ_PACKET_LEN: u32 = 0x00;
pub const GPS1_STATE_RES_PACKET_LEN: u32 = 0x0E;
pub const GPS2_STATE_REQ_PACKET_LEN: u32 = 0x00;
pub const GPS2_STATE_RES_PACKET_LEN: u32 = 0x0E;
pub const ACCEL1_STATE_REQ_PACKET_LEN: u32 = 0x00;
pub const ACCEL1_STATE_RES_PACKET_LEN: u32 = 0x0D;
pub const ACCEL2_STATE_REQ_PACKET_LEN: u32 = 0x00;
pub const ACCEL2_STATE_RES_PACKET_LEN: u32 = 0x0D;
pub const GYRO1_STATE_REQ_PACKET_LEN: u32 = 0x00;
pub const GYRO1_STATE_RES_PACKET_LEN: u32 = 0x0D;
pub const GYRO2_STATE_REQ_PACKET_LEN: u32 = 0x00;
pub const GYRO2_STATE_RES_PACKET_LEN: u32 = 0x0D;
pub const MAG1_STATE_REQ_PACKET_LEN: u32 = 0x00;
pub const MAG1_STATE_RES_PACKET_LEN: u32 = 0x0D;
pub const MAG2_STATE_REQ_PACKET_LEN: u32 = 0x00;
pub const MAG2_STATE_RES_PACKET_LEN: u32 = 0x0D;
pub const BARO1_STATE_REQ_PACKET_LEN: u32 = 0x00;
pub const BARO1_STATE_RES_PACKET_LEN: u32 = 0x0D;
pub const BARO2_STATE_REQ_PACKET_LEN: u32 = 0x00;
pub const BARO2_STATE_RES_PACKET_LEN: u32 = 0x0D;
pub const FLASH_MEMORY_STATE_REQ_PACKET_LEN: u32 = 0x00;
pub const FLASH_MEMORY_STATE_RES_PACKET_LEN: u32 = 0x05;
pub const FLASH_MEMORY_CONFIG_SET_PACKET_LEN: u32 = 0x00;
pub const GPS_TRACKING_CONFIG_RES_PACKET_LEN: u32 = 0x05;
pub const GPS_TRACKING_CONFIG_SET_PACKET_LEN: u32 = 0x04;
pub const GPS_TRACKING_PACKET_LEN: u32 = 0x0D;
pub const STREAM_PACKET_CONFIG_SET_LEN: u32 = 0x05;
pub const STREAM_PACKET_TYPE_0_LEN: u32 = 0x4E;
pub const STREAM_PACKET_TYPE_1_LEN: u32 = 0x00;
pub const STREAM_PACKET_TYPE_2_LEN: u32 = 0x00;
pub const STREAM_PACKET_TYPE_3_LEN: u32 = 0x00;
pub const STREAM_PACKET_TYPE_4_LEN: u32 = 0x00;
pub const STREAM_PACKET_TYPE_5_LEN: u32 = 0x00;
pub const STREAM_PACKET_TYPE_6_LEN: u32 = 0x00;
pub const STREAM_PACKET_TYPE_7_LEN: u32 = 0x00;
pub const STREAM_PACKET_CONFIG_REQ_LEN: u32 = 0x00;
pub const STREAM_PACKET_CONFIG_RES_LEN: u32 = STREAM_PACKET_CONFIG_SET_LEN;
pub const HEART_BEAT_CONFIG_PACKET_SET_LEN: u32 = 0x05;
pub const HEART_BEAT_PACKET_LEN: u32 = 0x00;
pub const ARM_DROGUE_REQ_LEN: u32 = 0x01;
pub const ARM_MAIN_REQ_LEN: u32 = 0x01;
pub const ARM_MAIN_RES_LEN: u32 = 0x01;
pub const ARM_DROGUE_RES_LEN: u32 = 0x01;
pub const SYSTEM_STATE_PACKET_REQ_LEN: u32 = 0x01;
pub const SYSTEM_STATE_PACKET_TYPE_0_RES_LEN: u32 = 0x80;
pub const SYSTEM_STATE_PACKET_TYPE_1_RES_LEN: u32 = 0x00;
pub const SYSTEM_STATE_PACKET_TYPE_2_RES_LEN: u32 = 0x00;
pub const SYSTEM_STATE_PACKET_TYPE_3_RES_LEN: u32 = 0x00;
pub const SYSTEM_STATE_PACKET_TYPE_4_RES_LEN: u32 = 0x00;
pub const SYSTEM_STATE_PACKET_TYPE_5_RES_LEN: u32 = 0x00;
pub const SYSTEM_STATE_PACKET_TYPE_6_RES_LEN: u32 = 0x00;
pub const SYSTEM_STATE_PACKET_TYPE_7_RES_LEN: u32 = 0x00;
