/*
    This file contains the topic names defined for the MQTT interface. These packet types are defined around the 
    protocol: https://github.com/Hover-Disaster/Strelka_Ground_Station_Packets
*/

export const upstreamTopics = [
    'BatVolRes',
    'ContinuityRes',
    'FireDrogueRes',
    'FireMainRes',
    'Gps1StateRes',
    'Gps2StateRes',
    'Accel1StateRes',
    'Accel2StateRes',
    'Gyro1StateRes',
    'Gyro2StateRes',
    'Mag1StateRes',
    'Mag2StateRes',
    'Baro1StateRes',
    'Baro2StateRes',
    'FlashStateRes',
    'GpsTrackingPacket',
    'GpsTrackingConfigRes',
    'StreamPacketType0',
    'StreamPacketType1',
    'StreamPacketType2',
    'StreamPacketType3',
    'StreamPacketType4',
    'StreamPacketType5',
    'StreamPacketType6',
    'StreamPacketType7',
    "StreamPacketConfigRes",
];

export const downstreamTopics = [
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
    "StreamPacketConfigReq"
]

// Good test script
// mosquitto_pub -h localhost -p 1883 -t Node_0/StreamPacketType0 -m '{"timestamp":1000000, "latitude":-37.873322, "longitude":145.049434, "gps_altitude":65, "satellites_tracked":15, "lin_acc_x":2, "lin_acc_y":0.5, "lin_acc_z":0.98, "lin_vel_x":1.2, "lin_vel_y":0.1, "lin_vel_z":0.34, "baro_altitude": 44.23, "ang_vel_x":0.22, "ang_vel_y":0.32, "ang_vel_z":0.01, "quaternion_q1":1.0, "quaternion_q2":0.0, "quaternion_q3":0.0, "quaternion_q4":0.0, "battery_voltage":3.34, "flight_state":1}'
