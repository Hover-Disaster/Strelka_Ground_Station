import React, { useEffect } from "react";
import { useState } from "react";

export default function GPSCard({
  fix_state,
  latitude,
  longitude,
  altitude,
  satellites_tracked,
}) {
  const [fixStatus, setFixStatus] = useState();
  const [fixStatusLEDColor, setFixStatusLEDColor] = useState("");
  useEffect(() => {
    const status = fix_state ? "bg-green-600" : "bg-red-600";
    setFixStatusLEDColor(status);
    return () => {};
  });
  return (
    <div className="p-6 min-w-0 min-w-full sm:min-w-[10rem] md:min-w-[15rem] lg:min-w-[20rem] xl:min-w-[25rem]">
      <a
        href="#"
        className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-500"
      >
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          GPS State
        </h5>
        <div className="flex">
          <p className="px-6 font-normal text-gray-700 dark:text-gray-400">
            GPS Fix:
          </p>
          <div className={`w-6 h-6 rounded-full ${fixStatusLEDColor}`}></div>
        </div>

        <p className="font-normal text-gray-700 dark:text-gray-400">
          Latitude: {latitude}
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Longitude: {longitude}
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Altitude: {altitude} m
        </p>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Satellites tracked: {satellites_tracked}
        </p>
      </a>
    </div>
  );
}
