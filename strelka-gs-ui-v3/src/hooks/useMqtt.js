import { useEffect, useState, useRef } from "react";
// import { write_telemetry } from "../utils/storage";
import { upstreamTopics, downstreamTopics } from "./mqttTopics";
import mqtt from 'mqtt';
import { useSystemState } from "./systemState";

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
    const { systemState, updateSystemState } = useSystemState();
  
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
        console.log('Connected to MQTT broker at ip address: '+systemState.mqttIP);
        updateSystemState({
          mqttConnected: true,
        });
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
            // Subscribe to all topics for this node
          upstreamTopics.forEach((subtopic) => {
            let subscribe_topic = "Node_" + systemState.nodeID + "/" + subtopic;
            mqttRef.current.subscribe(subscribe_topic, { qos: 0 });
            // Publish to current_node_ids topic to inform radio interface program of node ids to listen for
            console.log("Subscribing to " + subscribe_topic);
          });
          let payload = {};
          payload.id_array = [parseInt(systemState.nodeID)];
          mqttRef.current.publish("current_node_ids", JSON.stringify(payload));
    };

    const onMessage = (topic, payload) => {
        if(debug) {
            console.log("Received topic: "+topic+"\nData: "+payload);
        }

        let bufferSize = 30; // Adjust the size as needed
        
        // Handle incoming messages
        /*
          TODO:
          - Save incoming data to file
        */
        // const data = { ...receivedData, [topic]: payload.toString() };
        var json_payload = JSON.parse(payload.toString());
        let subtopic = topic.split('/')[1];
        for (const upstreamTopic of upstreamTopics) {
          if(subtopic == upstreamTopic) {
            // Add data to systemState field
            let timestamp = 0;
            for (const [key, value] of Object.entries(json_payload)) {
              updateSystemState({
                [key]: value,
              });
              if(key=="timestamp") {
                timestamp = value;
              }
            }   
            if(subtopic == "StreamPacketType0") {
              // Set data streaming enabled in system state
              updateSystemState({
                stream_packet_type_enabled: 0,
              });
              // Add time series data to time series arrays
              for (const [key, value] of Object.entries(json_payload)) {
                // Pull existing dataArray from systemState
                let existingDataArray = systemState[key+"_timeseries"] || [];
                if(!Array.isArray(existingDataArray)) {
                  existingDataArray = [];
                }
            
                existingDataArray.push({ x: timestamp / 1000, y: value });
                if(existingDataArray.length > bufferSize) {
                  existingDataArray.shift();
                }
                

                // Ensure the array size does not exceed bufferSize
                // const finalDataArray = newDataArray.slice(0, bufferSize);
              
                // Update systemState
                updateSystemState({
                  [key+"_timeseries"]: existingDataArray,
                });
              }
            }
          }
        }
        updateSystemState({
          lastPacketTime: new Date().getTime(),
        });
        // write_telemetry(json_data);
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