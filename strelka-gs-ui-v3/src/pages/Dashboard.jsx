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
import { vec3, quat } from "gl-matrix";

const Dashboard = () => {
  const { systemState, updateSystemState } = useSystemState();

  const quaternionToEuler = (quaternion) => {
    const { x, y, z, w } = quaternion;

    const t0 = 2.0 * (w * x + y * z);
    const t1 = 1.0 - 2.0 * (x * x + y * y);
    const roll = Math.atan2(t0, t1);

    const t2 = 2.0 * (w * y - z * x);
    const pitch = Math.asin(Math.min(Math.max(t2, -1.0), 1.0));

    const t3 = 2.0 * (w * z + x * y);
    const t4 = 1.0 - 2.0 * (y * y + z * z);
    const yaw = Math.atan2(t3, t4);

    return {
      yaw: (yaw * 180.0) / Math.PI,
      pitch: (pitch * 180.0) / Math.PI,
      roll: (roll * 180.0) / Math.PI,
    };
  };

  const checkVehicleOrientation = (x, y, z, w) => {
    const targetVec = [0, 0, 1]; // Up in North East Down coordinates
    let quat_def = quat.fromValues(x, y, z, w);
    const quat_norm = Math.sqrt(x * x + y * y + z * z + w * w);
    quat_def = quat_def.map((component) => component / quat_norm);
    const targetVectorObj = vec3.fromValues(
      targetVec[0],
      targetVec[1],
      targetVec[2]
    );
    const targetVecInBody = vec3.create();
    // Rotate target vector intSo body frame using quaternion
    vec3.transformQuat(targetVecInBody, targetVec, quat_def);

    // Define a vector to represent the nose direction of the rocket in body coordinates
    const rocketVectorInBody = [1, 0, 0];

    const dotProduct = vec3.dot(targetVecInBody, rocketVectorInBody);
    const axisAngle = Math.acos(dotProduct);

    // Convert angle to degrees
    const degrees = (180 / Math.PI) * axisAngle;
    console.log(degrees);
    // Check if the angle is within 30 degrees of vertical
    return degrees <= 30 || degrees >= 150; // 180 - 30 = 150 for the opposite direction
  };

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
              Vehicle orientation
            </p>
            <div className="flex-grow"></div>
            <div
              className={`w-6 h-6 flex items-center justify-center rounded-full ${
                checkVehicleOrientation(
                  systemState.quaternion_q2,
                  systemState.quaternion_q3,
                  systemState.quaternion_q4,
                  systemState.quaternion_q1
                ) === true
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            ></div>
          </div>
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
