import React from "react";
import GPSCard from "../components/GPSCard";
import LineGraph from "../components/LineGraph";
import Gauge from "../components/BatteryGauge";
import BatteryGauge from "../components/BatteryGauge";

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

const dashboard = () => {
  return (
    <div className="flex flex-wrap">
      <GPSCard
        fix_state={true}
        latitude={0}
        longitude={0}
        altitude={0}
        satellites_tracked={0}
      />
      <LineGraph
        title="Barometric altitude"
        unit="metres"
        dataArray={dataArray}
      />
      <BatteryGauge value={3.2} />
    </div>
  );
};

export default dashboard;
