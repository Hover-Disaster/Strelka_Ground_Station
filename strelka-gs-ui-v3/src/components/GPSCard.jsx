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
      <a className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-500">
        <table className="w-full">
          <tbody>
            <tr>
              <td colSpan="2">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  GPS State
                </h5>
              </td>
            </tr>
            <tr>
              <td className="font-normal text-gray-700 dark:text-gray-400">
                GPS Fix:
              </td>
              <td>
                <div
                  className={`w-6 h-6 rounded-full ${fixStatusLEDColor}`}
                ></div>
              </td>
            </tr>
            <tr>
              <td className="font-normal text-gray-700 dark:text-gray-400">
                Latitude:
              </td>
              <td>{latitude}</td>
            </tr>
            <tr>
              <td className="font-normal text-gray-700 dark:text-gray-400">
                Longitude:
              </td>
              <td>{longitude}</td>
            </tr>
            <tr>
              <td className="font-normal text-gray-700 dark:text-gray-400">
                Altitude:
              </td>
              <td>{altitude} m</td>
            </tr>
            <tr>
              <td className="font-normal text-gray-700 dark:text-gray-400">
                Satellites tracked:
              </td>
              <td>{satellites_tracked}</td>
            </tr>
          </tbody>
        </table>
      </a>
    </div>
  );
}
