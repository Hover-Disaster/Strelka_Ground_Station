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
