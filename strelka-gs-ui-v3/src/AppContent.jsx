import logo from "./logo.svg";
import "./App.css";
import { Fragment, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Dashboard from "./pages/Dashboard";
import Control from "./pages/Control";
import Map from "./pages/Map";
import { Configuration } from "./pages/Configuration";
import ConnectionStatus from "./components/ConnectionStatus";
import { useSystemState } from "./hooks/systemState";
import { useMqtt } from "./hooks/useMqtt";

var mqttRef, status;
export { mqttRef, status };

// My strelka id is 537093200

const navigation = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Configuration", href: "/configuration", current: false },
  { name: "Control", href: "/control", current: false },
  { name: "Map", href: "/map", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const formatLastSeen = (lastSeen) => {
  if (lastSeen < 60) {
    return `${Math.floor(lastSeen)}s ago`;
  } else if (lastSeen < 3600) {
    const minutes = Math.floor(lastSeen / 60);
    return `${minutes}m ago`;
  } else if (lastSeen < 86400) {
    const hours = Math.floor(lastSeen / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(lastSeen / 86400);
    return `${days}d ago`;
  }
};

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const padZero = (num) => (num < 10 ? `0${num}` : `${num}`);

  const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(
    remainingSeconds
  )}`;
  return formattedTime;
}

export function AppContent() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { systemState, updateSystemState } = useSystemState();

  // Connect to mqtt address
  [mqttRef, status] = useMqtt("mqtt://" + systemState.mqttIP + ":9001", true);
  systemState.mqttConnected = status.status.connection_status.connected;

  useEffect(() => {
    for (const item of navigation) {
      if (item.href === currentPath) {
        item.current = true;
      } else {
        item.current = false;
      }
    }
    // Refresh variables from local storage
    const localStorageData = localStorage.getItem("systemState");
    if (localStorageData) {
      try {
        const parsedData = JSON.parse(localStorageData);
        // Update systemState with the data from local storage
        updateSystemState(parsedData);
      } catch (error) {
        console.error("Error parsing local storage data:", error);
      }
    }
  }, [currentPath, navigation]);

  return (
    <div id="App">
      <div className="bg-gray-100 dark:bg-slate-800 p-4">
        <Disclosure as="nav" className="bg-gray-100 dark:bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                  <div className="flex-shrink-0 items-center">
                    <div className="block dark:hidden">
                      <img
                        className="h-16 w-auto"
                        src={"/images/HPR_logo_light.png"}
                        alt="Strelka Ground Station"
                      />
                    </div>
                    <div className="hidden dark:block">
                      <img
                        className="h-16 w-auto"
                        src={"/images/HPR_logo.png"}
                        alt="Strelka Ground Station"
                      />
                    </div>
                  </div>

                  {/* Mobile menu button */}
                  <div className="ml-auto sm:hidden">
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-1 items-center justify-start sm:items-stretch sm:justify-start">
                    <div className="p-4 flex justify-center items-center">
                      <ConnectionStatus
                        isConnected={systemState.mqttConnected}
                      />
                    </div>
                    <div className="items-center justify-center flex sm:ml-2">
                      <div className="hidden sm:flex space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "bg-gray-300 dark:bg-gray-600 dark:text-gray-300 text-gray-600 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="ml-6 mt-4 flex-shrink-0 flex-grow-0 mr-4 font-normal justify-start dark:text-gray-400">
                    Node ID{" "}
                    <span
                      className={
                        systemState.nodeID ? "text-green-500" : "text-red-500"
                      }
                    >
                      {systemState.nodeID ? systemState.nodeID : "Not selected"}
                    </span>
                  </p>
                  <p className="ml-6 mt-4 flex-shrink-0 flex-grow-0 mr-4 font-normal justify-start dark:text-gray-400">
                    Device up time{" "}
                    <span
                      className={
                        systemState.timestamp
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {systemState.timestamp
                        ? formatDuration(systemState.timestamp / 1000)
                        : "No data"}
                    </span>
                  </p>
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <div className="flex flex-row">
          <p className="ml-6 mt-4 flex-shrink-0 flex-grow-0 mr-4 font-normal text-gray-700 dark:text-gray-400">
            Last seen{" "}
            {isNaN(new Date().getTime() - systemState.lastPacketTime)
              ? "never"
              : formatLastSeen(
                  (new Date().getTime() - systemState.lastPacketTime) / 1000
                )}
          </p>
          <p className="ml-6 mt-4 flex-shrink-0 flex-grow-0 mr-4 font-normal dark:text-gray-400">
            Data streaming{" "}
            <span
              className={
                systemState.stream_packet_type_enabled == 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {systemState.stream_packet_type_enabled == 0
                ? "enabled"
                : "disabled"}
            </span>
          </p>
        </div>
        {/* Bottom of header section */}
        <div className="border-b border-gray-300 my-4" />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/control" element={<Control />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </div>
    </div>
  );
}
