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
  let [dataStreamingToggleSwitchState, setDataStreamingToggleSwitchState] =
    useState(true);
  const { systemState, updateSystemState } = useSystemState();
  const [streamFreq, setStreamFreq] = useState();

  // Function to handle the toggle event
  const handleDataStreamingSwitchToggle = () => {
    updateSystemState({
      packet_type_0_enable: !systemState.packet_type_0_enable,
      streamFrequency: parseFloat(5),
    });
    // Publish topic to command sensor to enable streaming
    let payload = {};
    payload.packet_type_0_enable = systemState.packet_type_0_enable;
    if (systemState.streamFrequency == null) {
      payload.packet_type_0_stream_frequency = 1;
    } else {
      // If not null, parse and assign the value
      payload.packet_type_0_stream_frequency = parseFloat(
        systemState.streamFrequency
      );
    }
    payload.packet_type_1_enable = false;
    payload.packet_type_1_stream_frequency = 0;
    payload.packet_type_2_enable = false;
    payload.packet_type_2_stream_frequency = 0;
    payload.packet_type_3_enable = false;
    payload.packet_type_3_stream_frequency = 0;
    payload.packet_type_4_enable = false;
    payload.packet_type_4_stream_frequency = 0;
    payload.packet_type_5_enable = false;
    payload.packet_type_5_stream_frequency = 0;
    payload.packet_type_6_enable = false;
    payload.packet_type_6_stream_frequency = 0;
    payload.packet_type_7_enable = false;
    payload.packet_type_7_stream_frequency = 0;

    mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/StreamPacketConfigSet",
      JSON.stringify(payload)
    );
  };

  const handleGPSTrackingSwitchToggle = () => {
    updateSystemState({
      tracking_enabled: !systemState.tracking_enabled,
      chirpFrequency: 1,
    });
    let payload = {};
    payload.tracking_enabled = systemState.tracking_enabled;
    payload.chirp_frequency = 1;
    mqttRef.current.publish(
      "Node_" + systemState.nodeID + "/GpsTrackingConfigSet",
      JSON.stringify(payload)
    );
  };

  return (
    <div className="p-6 min-w-0 min-w-full sm:min-w-[10rem] md:min-w-[15rem] lg:min-w-[20rem] xl:min-w-[25rem]">
      <a className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-500">
        <table className="w-full">
          <tbody>
            <tr>
              <label
                className="flex inline-block pl-[0.15rem] hover:cursor-pointer"
                htmlFor="gpsTrackingSwitch"
              >
                <td colSpan="2">
                  <p className="flex-shrink-0 flex-grow-0 mr-4 font-normal text-gray-700 dark:text-gray-400">
                    Enable GPS tracking
                  </p>
                </td>
                <td>
                  <input
                    className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-blue-500 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-blue-500 dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                    type="checkbox"
                    role="switch"
                    id="gpsTrackingSwitch"
                    checked={systemState.tracking_enabled}
                    onChange={handleGPSTrackingSwitchToggle}
                  />
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
                    Enable data streaming
                  </p>
                </td>
                <td>
                  <input
                    className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-blue-500 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-blue-500 dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                    type="checkbox"
                    role="switch"
                    id="streamPacketSwitch"
                    checked={systemState.packet_type_0_enable}
                    onChange={handleDataStreamingSwitchToggle}
                  />
                </td>
              </label>
            </tr>
          </tbody>
        </table>
      </a>
    </div>
  );
};

export default Control;
