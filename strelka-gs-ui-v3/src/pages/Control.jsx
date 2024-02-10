import React, { useState, useEffect } from "react";
import { useSystemState } from "../hooks/systemState";
import { mqttRef } from "../AppContent";

/*
    TODO:
    - Query last states of toggle switches from local storage so that they are in their correct positions
    - Transmit updated state of system after switches are toggled
    - Confirm state has been updated on rocket, if failed, toggle switch to previous state
*/
const Control = () => {
  const { systemState, updateSystemState } = useSystemState();
  const [streamFreq, setStreamFreq] = useState();

  // Function to handle the toggle event
  const handleDataStreamingSwitchToggle = () => {
    let payload = {};
    if (systemState.stream_packet_type_enabled === 0) {
      payload.stream_packet_type_enabled = 100;
    } else {
      payload.stream_packet_type_enabled = 0;
    }

    // Publish topic to command sensor to enable streaming
    if (systemState.packet_stream_frequency == null) {
      payload.packet_stream_frequency = 1;
    } else {
      // If not null, parse and assign the value
      payload.packet_stream_frequency = parseFloat(
        systemState.packet_stream_frequency
      );
    }
    console.log(
      "Publishing to StreamPacketConfigSet: " + JSON.stringify(payload)
    );
    mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/StreamPacketConfigSet",
      JSON.stringify(payload)
    );
  };

  const handleGPSTrackingSwitchToggle = () => {
    let payload = {};
    if (systemState.gps_tracking_enabled === 0) {
      payload.gps_tracking_enabled = 1;
    } else {
      payload.gps_tracking_enabled = 0;
    }
    payload.gps_tracking_chirp_frequency = 1;
    mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/GpsTrackingConfigSet",
      JSON.stringify(payload)
    );
  };

  const toggleArmDrogue = () => {
    let payload = {};
    if (systemState.arm_drogue_state == 0) {
      payload.drogue_arm_state_set = 1;
    } else {
      payload.drogue_arm_state_set = 0;
    }
    mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/ArmDrogueReq",
      JSON.stringify(payload)
    );
  };

  const toggleArmMain = () => {
    let payload = {};
    if (systemState.arm_main_state == 0) {
      payload.main_arm_state_set = 1;
    } else {
      payload.main_arm_state_set = 0;
    }
    mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/ArmMainReq",
      JSON.stringify(payload)
    );
  };

  const fireDrogue = () => {
    if (systemState.arm_drogue_state == 1) {
      mqttRef.current.publish(
        "Node_" + systemState.nodeID + "/FireDrogueReq",
        ""
      );
    }
  };

  const fireMain = () => {
    if (systemState.arm_main_state == 1) {
      mqttRef.current.publish(
        "Node_" + systemState.nodeID + "/FireMainReq",
        ""
      );
    }
  };

  const toggleFlashLogging = () => {
    let payload = {};
    if (systemState.flash_logging_enabled === 1) {
      payload.flash_logging_enabled = 0;
      payload.flash_write_speed = 20;
    }
    else {
      payload.flash_logging_enabled = 1;
      payload.flash_write_speed = 20;
    }
      mqttRef.current.publish(
        "Node_" + systemState.nodeID + "/FlashMemoryConfigSet",
        JSON.stringify(payload)
      );
  };

  return (
    <div className="p-6 min-w-0 min-w-full sm:min-w-[10rem] md:min-w-[15rem] lg:min-w-[20rem] xl:min-w-[25rem]">
      <a className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-600 ">
        <table className="w-full">
          <tbody>
            <tr>
              <label
                className="flex inline-block pl-[0.15rem] hover:cursor-pointer"
                htmlFor="gpsTrackingSwitch"
              >
                <td colSpan="2">
                  <p className="flex-shrink-0 flex-grow-0 mr-4 font-normal text-gray-700 dark:text-gray-400">
                    GPS tracking
                  </p>
                </td>
                <td>
                  <button
                    className={
                      "flex-shrink-0 border-4 text-sm py-1 px-2 rounded bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-white"
                    }
                    type="button"
                    onClick={handleGPSTrackingSwitchToggle}
                  >
                    {systemState.gps_tracking_enabled === 0
                      ? "Enable"
                      : "Disable"}
                  </button>
                </td>
              </label>
            </tr>
            <tr>
              <label
                className="flex inline-block pl-[0.15rem] hover:cursor-pointer"
                htmlFor="streamPacketSwitch"
              >
                <td colSpan="2">
                  <p className="flex-shrink-0 flex-grow-0 mr-4 font-normal text-gray-700 dark:text-gray-400">
                    Data streaming
                  </p>
                </td>
                <td>
                  <button
                    className={
                      "flex-shrink-0 border-4 text-sm py-1 px-2 rounded bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-white"
                    }
                    type="button"
                    onClick={handleDataStreamingSwitchToggle}
                  >
                    {systemState.stream_packet_type_enabled === 0
                      ? "Disable"
                      : "Enable"}
                  </button>
                </td>
              </label>
            </tr>
          </tbody>
        </table>
      </a>
      <div className="p-6 min-w-0 min-w-full sm:min-w-[10rem] md:min-w-[15rem] lg:min-w-[20rem] xl:min-w-[25rem]">
        <a className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-600 ">
          <p className="flex-shrink-0 flex-grow-0 mr-4 font-normal text-gray-700 dark:text-gray-400">
            <b>Deployment Testing</b>
          </p>
          <p className="flex-shrink-0 flex-grow-0 mr-4 font-normal text-gray-700 dark:text-gray-400">
            Drogue{" "}
            <span
              className={
                systemState.arm_drogue_state === 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {systemState.arm_drogue_state === 0 ? "DISARMED" : "ARMED"}
            </span>
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className={`flex-shrink-0 border-4 text-sm py-1 px-2 rounded ${
                systemState.arm_drogue_state === 0
                  ? "bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-white"
                  : "bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-white"
              }`}
              type="button"
              onClick={toggleArmDrogue}
            >
              {systemState.arm_drogue_state === 0 ? "Arm" : "Disarm"}
            </button>
            <div style={{ marginLeft: "100px" }}></div>
            <button
              className={`flex-shrink-0 border-4 text-sm py-1 px-2 rounded ${
                systemState.arm_drogue_state === 0
                  ? "bg-gray-500 border-gray-500 text-white"
                  : "bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-white"
              }`}
              type="button"
              onClick={fireDrogue}
            >
              FIRE DROGUE
            </button>
          </div>

          <p className="flex-shrink-0 flex-grow-0 mr-4 font-normal text-gray-700 dark:text-gray-400">
            Main{" "}
            <span
              className={
                systemState.arm_main_state === 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {systemState.arm_main_state === 0 ? "DISARMED" : "ARMED"}
            </span>
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className={`flex-shrink-0 border-4 text-sm py-1 px-2 rounded ${
                systemState.arm_main_state === 0
                  ? "bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-white"
                  : "bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-white"
              }`}
              type="button"
              onClick={toggleArmMain}
            >
              {systemState.arm_main_state === 0 ? "Arm" : "Disarm"}
            </button>
            <div style={{ marginLeft: "100px" }}></div>
            <button
              className={`flex-shrink-0 border-4 text-sm py-1 px-2 rounded ${
                systemState.arm_main_state === 0
                  ? "bg-gray-500 border-gray-500 text-white"
                  : "bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-white"
              }`}
              type="button"
              onClick={fireMain}
            >
              FIRE MAIN
            </button>
          </div>
        </a>
      </div>
      <div className="p-6 min-w-0 min-w-full sm:min-w-[10rem] md:min-w-[15rem] lg:min-w-[20rem] xl:min-w-[25rem]">
        <a className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-600 ">
          <p className="flex-shrink-0 flex-grow-0 mr-4 font-normal text-gray-700 dark:text-gray-400">
            <b>Flash Memory</b>
            <div style={{ marginLeft: "100px" }}></div>
            <button
              className={`flex-shrink-0 border-4 text-sm py-1 px-2 rounded ${
                systemState.flash_logging_enabled === 0
                  ? "bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-white"
                  : "bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-white"
              }`}
              type="button"
              onClick={toggleFlashLogging}
            >
              {systemState.flash_logging_enabled === 0 ? "Enable" : "Disable"}
            </button>
          </p>
        </a>
      </div>
    </div>
  );
};

export default Control;
