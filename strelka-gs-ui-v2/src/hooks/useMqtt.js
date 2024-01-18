import { useEffect, useState, useRef } from "react";
import { write_telemetry } from "../utils/storage";
import { upstreamTopics, downstreamTopics } from "./mqttTopics";
import mqtt from 'mqtt';

/**
 * Connects to a mqtt, subscribes to topics and receives incoming data
 * @author Angus McLennnan
 * @param {string} mqtt_address The URL address where the mqtt server is located
 * @param {boolean} debug Triggers data logging to console when true
 * @returns A reference to the current mqtt instance and two state variables; one with status info and the other with replay status info
 */
export function useMqtt(mqtt_address, debug = false) {

    const websocketRef = useRef(null);
    const mqttRef = useRef(null);
    const [waitingForReconnect, setWaitingForReconnect] = useState(null);
  
    // Define structure of status object with default values for before connection
    const [status, setStatus] = useState({
      version: "0.0.1",
      org: "Insert Org",
      status: {
        rocket: {
          mission_time: 0,
        },
        connection_status: {
          connected: false,
        },
      },
    });

    const onConnect = () => {
        console.log('Connected to MQTT broker');
        // Set connecton status to true
        setStatus((prevStatus) => ({
            ...prevStatus,
            status: {
              ...prevStatus.status,
              connection_status: {
                ...prevStatus.status.connection_status,
                connected: true,
              },
            },
          }));
    };

    const onMessage = (topic, payload) => {
        if(debug) {
            console.log("Received topic: "+topic+"\nData: "+payload);
        }
        
        // Handle incoming messages
        /*
          TODO:
          - Save incoming data to file
        */
        // const data = { ...receivedData, [topic]: payload.toString() };
        var json_payload = JSON.parse(payload.toString());
        var json_data = {};
        json_data.topic = topic;
        json_data.payload = json_payload;
        json_data.payload.mission_time = new Date().getTime();
        write_telemetry(json_data);
    };

    const onDisconnect = () => {
        console.log("Mqtt client disconnected");
    };

    const onClose = () => {
        if (waitingForReconnect) {
            return;
        }
        console.log("Disconnected from mqtt server");

        setWaitingForReconnect(true);
        setTimeout(() => setWaitingForReconnect(null), 2000);
    };
  
    // // Receiving data
    // const onMessage = (event) => {
    //   var data = JSON.parse(event.data); // Parse incoming data
    //   console.log(data);
  
    //   if (debug) {
    //     console.log(data); // Data logging on debug
    //   }
  
    //   // Only write non-empty packets
    //   if (data.version != undefined) {
    //     write_telemetry(data.telemetry); // Write to local storage
    //     setStatus((oldStatus) => {
    //       return {
    //         ...oldStatus,
    //         version: data.version,
    //         org: data.org,
    //         status: data.status,
    //       };
    //     });
    //     setReplayStatus((oldStatus) => {
    //       return {
    //         ...oldStatus,
    //         status: data.status.replay.state,
    //         mission_list: data.status.replay.mission_list,
    //         speed: data.status.replay.speed,
    //       };
    //     });
    //   }
    // };
  
    useEffect(() => {
      if (waitingForReconnect) {
        return;
      }

      if (!mqttRef.current) {
        // Define mqtt client
        const mqttClient = mqtt.connect(mqtt_address); // mqtt_address = 'mqtt://localhost:9001'
        mqttRef.current = mqttClient;
        
        mqttClient.on('connect', onConnect);
        mqttClient.on('message', onMessage);
        mqttClient.on('disconnect', onDisconnect);
        mqttClient.on('close', onClose);

        return () => {
            mqttRef.current = null;
            mqttClient.end();
        };
      }
    }, [waitingForReconnect]);
    return [mqttRef, status];
  }