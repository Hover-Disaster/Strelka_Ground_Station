import React from "react";
import { useState } from "react";
import { TEChart } from "tw-elements-react";

export default function LineGraph({ title, unit, dataArray }) {
  return (
    <div className="p-6 min-w-0 min-w-full sm:min-w-[20rem] md:min-w-[30rem] lg:min-w-[40rem] xl:min-w-[50rem]">
      <a
        href="#"
        className="block max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-500"
      >
        <TEChart
          type="scatter"
          data={{
            datasets: [
              {
                borderColor: "#4285F4",
                backgroundColor: "rgba(66, 133, 244, 0.5)",
                label: title,
                data: dataArray,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                display: false,
                text: title,
              },
            },
            scales: {
              x: {
                type: "linear",
                position: "bottom",
                scaleLabel: {
                  labelString: "Time (s)",
                  display: true,
                },
              },
              y: {
                type: "linear",
                scaleLabel: {
                  labelString: unit,
                  display: true,
                },
              },
            },
          }}
          darkOptions={{
            plugins: {
              title: {
                display: true,
                text: title,
                color: "#fff",
              },
              legend: {
                labels: {
                  color: "#fff",
                },
              },
            },
            scales: {
              x: {
                type: "linear",
                position: "bottom",
                scaleLabel: {
                  labelString: "Time (s)",
                  display: true,
                },
                ticks: {
                  color: "#fff",
                },
                grid: {
                  color: "#555",
                },
              },
              y: {
                type: "linear",
                scaleLabel: {
                  labelString: unit,
                  display: true,
                },
                ticks: {
                  color: "#fff",
                },
                grid: {
                  color: "#555",
                },
              },
            },
          }}
        />
      </a>
    </div>
  );
}
