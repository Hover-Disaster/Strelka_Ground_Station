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

  return (
    <div className="flex flex-wrap">
      <GPSCard
        fix_state={systemState.gps1_good}
        latitude={
          systemState.gps1_latitude?.[systemState.gps1_latitude?.length - 1]
        }
        longitude={
          systemState.gps1_longitude?.[systemState.gps1_longitude?.length - 1]
        }
        altitude={
          systemState.gps1_altitude?.[systemState.gps1_altitude?.length - 1]
        }
        satellites_tracked={systemState.gps1_satellites_tracked}
      />
      <LineGraph
        title="Barometric altitude"
        unit="metres"
        dataArray={dataArray}
      />
      <BatteryGauge
        value={systemState.battery_voltage ? systemState.battery_voltage : 0}
      />
    </div>
  );
};

export default Dashboard;
