import { mqttRef, status } from "../AppContent";
import { useSystemState } from "../hooks/systemState";
import { useState } from "react";
import { upstreamTopics } from "../hooks/mqttTopics";

export function Configuration() {
  const { systemState, updateSystemState } = useSystemState();
  const sleep = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));
  // State to store the input value
  const [nodeID, setNodeID] = useState("");
  const [mqttIP, setMqttIP] = useState("");
  const [validIPAddressInput, setValidIPAddressInput] = useState(true);

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

  // Event handler to update the state when the user types
  const handleMQTTIPInputChange = (e) => {
    setMqttIP(e.target.value);
  };

  // Event handler for the button click
  const handleMQTTIPInputSubmit = () => {
    if (isValidIpAddress(mqttIP.trim())) {
      updateSystemState({
        mqttIP: mqttIP.trim(),
      });
      setValidIPAddressInput(true);
      window.location.reload();
    } else {
      console.log("Invalid ip address input");
      setValidIPAddressInput(false);
    }
  };

  function isValidIpAddress(input) {
    if (input === "localhost") {
      return true;
    }
    // Regular expression for a valid IP address
    const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;

    // Check if the input matches the regex pattern
    if (!ipRegex.test(input)) {
      return false;
    }

    // Split the IP address into its octets
    const octets = input.split(".");

    // Check if each octet is a valid number between 0 and 255
    for (const octet of octets) {
      const numericValue = parseInt(octet, 10);
      if (isNaN(numericValue) || numericValue < 0 || numericValue > 255) {
        return false;
      }
    }

    // If all checks pass, the input is a valid IP address
    return true;
  }

  const handleRefresh = async () => {
    let delayTime = 500;
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
      "Node_" + systemState.nodeID + "/Accel2StateReq",
      ""
    );
    await sleep(delayTime);
    await mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/Gyro2StateReq",
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
      "Node_" + systemState.nodeID + "/StreamPacketConfigReq",
      ""
    );
    await sleep(delayTime);
  };

  return (
    <div className="flex flex-wrap">
      <div className="p-6 min-w-0 min-w-full sm:min-w-[10rem] md:min-w-[15rem] lg:min-w-[20rem] xl:min-w-[25rem]">
        <a className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-500">
          <p className="flex-shrink-0 flex-grow-0 mr-4 font-normal justify-start dark:text-gray-200">
            Node ID of target device
          </p>
          <form class="w-full max-w-sm">
            <div className="flex items-center border-b border-teal-500 py-2">
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-600 dark:text-gray-100 mr-3 py-1 px-2 leading-tight focus:outline-none"
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
        </a>
      </div>
      <div className="p-6 min-w-0 min-w-full sm:min-w-[10rem] md:min-w-[15rem] lg:min-w-[20rem] xl:min-w-[25rem]">
        <a className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-500">
          <p className="flex-shrink-0 flex-grow-0 mr-4 font-normal justify-start dark:text-gray-200">
            IP address of MQTT server{" "}
            {!validIPAddressInput && (
              <span className="text-red-500 italic">Invalid input</span>
            )}
          </p>
          <form class="w-full max-w-sm">
            <div className="flex items-center border-b border-teal-500 py-2">
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-600 dark:text-gray-100 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="Enter MQTT IP address"
                aria-label="mqtt-ip-input"
                onChange={handleMQTTIPInputChange}
              ></input>
              <button
                className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                type="button"
                onClick={handleMQTTIPInputSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </a>
      </div>
      <div className="p-6 min-w-0 min-w-full sm:min-w-[10rem] md:min-w-[15rem] lg:min-w-[20rem] xl:min-w-[25rem]">
        <a className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-500">
          <p className="flex-shrink-0 flex-grow-0 mr-4 font-normal justify-start dark:text-gray-200">
            Refresh state from downstream node
          </p>
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button"
            onClick={handleRefresh}
          >
            Refresh
          </button>
        </a>
      </div>
    </div>
  );
}
