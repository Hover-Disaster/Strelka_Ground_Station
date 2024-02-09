import React from "react";
import GaugeComponent from "react-gauge-component";

const BatteryGauge = ({ value }) => {
  return (
    <div className="p-6 min-w-0 min-w-full sm:min-w-[10rem] md:min-w-[15rem] lg:min-w-[20rem] xl:min-w-[25rem]">
      <a
        href="#"
        className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-500"
      >
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Battery Voltage
        </h5>
        <GaugeComponent
          type="semicircle"
          arc={{
            width: 0.2,
            padding: 0.005,
            cornerRadius: 1,
            // gradient: true,
            subArcs: [
              {
                limit: 3.6,
                color: "#EA4228",
                showTick: true,
                tooltip: {
                  text: "Battery voltage critically low",
                },
              },
              {
                limit: 3.7,
                color: "#F5CD19",
                showTick: true,
                tooltip: {
                  text: "Battery voltage low",
                },
              },
              {
                limit: 4,
                color: "#5BE12C",
                showTick: true,
                tooltip: {
                  text: "Battery voltage ok",
                },
              },
            ],
          }}
          pointer={{
            color: "#345243",
            length: 0.8,
            width: 15,
            // elastic: true,
          }}
          labels={{
            valueLabel: { formatTextValue: (value) => value + "V" },
            tickLabels: {
              type: "outer",
              valueConfig: {
                formatTextValue: (value) => value + "V",
                fontSize: 10,
              },
              ticks: [{ value: 3 }, { value: 3.5 }, { value: 4 }],
            },
          }}
          value={value}
          minValue={3.3}
          maxValue={4.2}
        />
      </a>
    </div>
  );
};

export default BatteryGauge;
