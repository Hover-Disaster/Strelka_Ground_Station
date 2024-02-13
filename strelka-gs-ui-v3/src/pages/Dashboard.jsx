import React from "react";
import { useState, useEffect } from "react";
import GPSCard from "../components/GPSCard";
import LineGraph from "../components/LineGraph";
import Gauge from "../components/BatteryGauge";
import BatteryGauge from "../components/BatteryGauge";
import { useSystemState } from "../hooks/systemState";
import { mqttRef } from "../AppContent";
import { upstreamTopics } from "../hooks/mqttTopics";
import RocketRender from "../components/RocketRender";

const Dashboard = () => {
  const { systemState, updateSystemState } = useSystemState();

  return (
    <div className="flex flex-wrap">
      <GPSCard
        fix_state={systemState.gps1_good}
        latitude={systemState.gps1_latitude}
        longitude={systemState.gps1_longitude}
        altitude={systemState.gps1_altitude}
        satellites_tracked={systemState.gps1_satellites_tracked}
      />
      <LineGraph
        title="Barometric altitude"
        unit="metres"
        dataArray={systemState.baro1_altitude_timeseries}
      />
      <BatteryGauge
        value={systemState.battery_voltage ? systemState.battery_voltage : 0}
      />
      <div className="p-6 min-w-0 min-w-full sm:min-w-[10rem] md:min-w-[15rem] lg:min-w-[20rem] xl:min-w-[25rem]">
        <a className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-600 ">
          <div>
            {/* Dogue e-match state */}
            <div>
              <p className="flex-shrink-0 flex-grow-0 mr-4 font-normal text-gray-700 dark:text-gray-200">
                Dogue e-match state:{" "}
                <span
                  className={
                    systemState.drogue_ematch_state === 0
                      ? "text-red-500"
                      : systemState.drogue_ematch_state === 1
                      ? "text-red-500"
                      : systemState.drogue_ematch_state === 2
                      ? "text-green-500"
                      : systemState.drogue_ematch_state === 3
                      ? "text-red-500"
                      : "text-gray-500"
                  }
                >
                  {systemState.drogue_ematch_state === 0
                    ? "Open circuit"
                    : systemState.drogue_ematch_state === 1
                    ? "Short circuit"
                    : systemState.drogue_ematch_state === 2
                    ? "Good"
                    : systemState.drogue_ematch_state === 3
                    ? "E-match error"
                    : "Unknown State"}
                </span>
              </p>
            </div>

            {/* Main e-match state */}
            <div>
              <p className="flex-shrink-0 flex-grow-0 mr-4 font-normal text-gray-700 dark:text-gray-200">
                Main e-match state:{" "}
                <span
                  className={
                    systemState.main_ematch_state === 0
                      ? "text-red-500"
                      : systemState.main_ematch_state === 1
                      ? "text-red-500"
                      : systemState.main_ematch_state === 2
                      ? "text-green-500"
                      : systemState.main_ematch_state === 3
                      ? "text-red-500"
                      : "text-gray-500"
                  }
                >
                  {systemState.main_ematch_state === 0
                    ? "Open circuit"
                    : systemState.main_ematch_state === 1
                    ? "Short circuit"
                    : systemState.main_ematch_state === 2
                    ? "Good"
                    : systemState.main_ematch_state === 3
                    ? "E-match error"
                    : "Unknown State"}
                </span>
              </p>
            </div>
          </div>
        </a>
      </div>
      <div className="p-6 min-w-0 min-w-full sm:min-w-[10rem] md:min-w-[15rem] lg:min-w-[20rem] xl:min-w-[25rem]">
        <a className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-600 ">
          <p className="font-bold text-xl text-gray-700 dark:text-gray-200">
            Checklist
          </p>
          <div className="flex items-center">
            <p className="mr-4 mt-2 text-gray-500 dark:text-gray-400">
              Main continuity
            </p>
            <div className="flex-grow"></div>
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full ${
                systemState.main_ematch_state === 2
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
          </div>
          <div className="flex items-center">
            <p className="mr-4 mt-2 text-gray-500 dark:text-gray-400">
              Drogue continuity
            </p>
            <div className="flex-grow"></div>
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full ${
                systemState.drogue_ematch_state === 2
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
          </div>
          <div className="flex items-center">
            <p className="mr-4 mt-2 text-gray-500 dark:text-gray-400">
              GPS 1 state
            </p>
            <div className="flex-grow"></div>
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full ${
                systemState.gps1_good === 1 ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
          <div className="flex items-center">
            <p className="mr-4 mt-2 text-gray-500 dark:text-gray-400">
              Accelerometer 1 state
            </p>
            <div className="flex-grow"></div>
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full ${
                systemState.acc1_good === 1 ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
          <div className="flex items-center">
            <p className="mr-4 mt-2 text-gray-500 dark:text-gray-400">
              Accelerometer 2 state
            </p>
            <div className="flex-grow"></div>
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full ${
                systemState.acc2_good === 1 ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
          <div className="flex items-center">
            <p className="mr-4 mt-2 text-gray-500 dark:text-gray-400">
              Gyroscope 1 state
            </p>
            <div className="flex-grow"></div>
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full ${
                systemState.gyro1_good === 1 ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
          <div className="flex items-center">
            <p className="mr-4 mt-2 text-gray-500 dark:text-gray-400">
              Gyroscope 2 state
            </p>
            <div className="flex-grow"></div>
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full ${
                systemState.gyro2_good === 1 ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
          <div className="flex items-center">
            <p className="mr-4 mt-2 text-gray-500 dark:text-gray-400">
              Magnetometer 1 state
            </p>
            <div className="flex-grow"></div>
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full ${
                systemState.mag1_good === 1 ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
          <div className="flex items-center">
            <p className="mr-4 mt-2 text-gray-500 dark:text-gray-400">
              Barometer 1 state
            </p>
            <div className="flex-grow"></div>
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full ${
                systemState.baro1_good === 1 ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
          <div className="flex items-center">
            <p className="mr-4 mt-2 text-gray-500 dark:text-gray-400">
              Flash memory state
            </p>
            <div className="flex-grow"></div>
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full ${
                systemState.flash_good === 1 ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
          </div>
        </a>
      </div>
      <RocketRender></RocketRender>
    </div>
  );
};

export default Dashboard;
