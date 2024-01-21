import React from "react";
import { useState, useEffect } from "react";
import GPSCard from "../components/GPSCard";
import LineGraph from "../components/LineGraph";
import Gauge from "../components/BatteryGauge";
import BatteryGauge from "../components/BatteryGauge";
import { useSystemState } from "../hooks/systemState";
import { mqttRef } from "../AppContent";
import { upstreamTopics } from "../hooks/mqttTopics";

let dataArray = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 1,
    y: 50,
  },
  {
    x: 2,
    y: 150,
  },
  {
    x: 3,
    y: 250,
  },
];

const Dashboard = () => {
  const { systemState, updateSystemState } = useSystemState();
  // State to store the input value
  const [nodeID, setNodeID] = useState("");

  // Event handler to update the state when the user types
  const handleNodeIDInputChange = (e) => {
    setNodeID(e.target.value);
  };

  // Event handler for the button click
  const handleNodeIDInputSubmit = () => {
    updateSystemState({
      nodeID: parseInt(nodeID),
    });
    // Subscribe to all topics for this node
    upstreamTopics.forEach((subtopic) => {
      let subscribe_topic = "Node_" + nodeID + "/" + subtopic;
      mqttRef.current.subscribe(subscribe_topic, { qos: 0 });
      // Publish to current_node_ids topic to inform radio interface program of node ids to listen for
      let payload = {};
      payload.id_array = [parseInt(nodeID)];
      mqttRef.current.publish("current_node_ids", JSON.stringify(payload));
      console.log("Subscribing to " + subscribe_topic);
    });
  };
  const sleep = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

  const handleRefresh = async () => {
    let delayTime = 1000;
    console.log(
      "Getting data from lots of topics: " +
        "Node_" +
        systemState.nodeID +
        "/BatVolReq"
    );
    await mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/BatVolReq",
      ""
    );
    await sleep(delayTime);
    await mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/ContinuityReq",
      ""
    );
    await sleep(delayTime);
    await mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/Gps1StateReq",
      ""
    );
    await sleep(delayTime);
    await mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/Accel1StateReq",
      ""
    );
    await sleep(delayTime);
    await mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/Gyro1StateReq",
      ""
    );
    await sleep(delayTime);
    await mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/Mag1StateReq",
      ""
    );
    await sleep(delayTime);
    await mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/Baro1StateReq",
      ""
    );
    await sleep(delayTime);
    await mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/FlashMemoryStateReq",
      ""
    );
    await sleep(delayTime);
    await mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/GpsTrackingConfigReq",
      ""
    );
    await sleep(delayTime);
    await mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/StreamPacketConfigSet",
      ""
    );
    await sleep(delayTime);
  };

  return (
    <div className="flex flex-wrap">
      <div className="p-6 min-w-0 min-w-full sm:min-w-[10rem] md:min-w-[15rem] lg:min-w-[20rem] xl:min-w-[25rem]">
        <a className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-500">
          <form class="w-full max-w-sm">
            <div className="flex items-center border-b border-teal-500 py-2">
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-100 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="number"
                placeholder="Enter node ID"
                aria-label="node-id-input"
                onChange={handleNodeIDInputChange}
              ></input>
              <button
                className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                type="button"
                onClick={handleNodeIDInputSubmit}
              >
                Submit
              </button>
            </div>
          </form>
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button"
            onClick={handleRefresh}
          >
            Submit
          </button>
        </a>
      </div>
      <GPSCard
        fix_state={systemState.fix_state}
        latitude={systemState.latitude?.[systemState.latitude?.length - 1]}
        longitude={systemState.longitude?.[systemState.longitude?.length - 1]}
        altitude={systemState.altitude?.[systemState.altitude?.length - 1]}
        satellites_tracked={systemState.satellites_tracked}
      />
      <LineGraph
        title="Barometric altitude"
        unit="metres"
        dataArray={dataArray}
      />
      <BatteryGauge
        value={systemState.batteryVoltage ? systemState.batteryVoltage : 0}
      />
    </div>
  );
};

export default Dashboard;
