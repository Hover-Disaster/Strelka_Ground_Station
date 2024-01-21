// ConnectionStatus.js

import React from "react";

const ConnectionStatus = ({ isConnected }) => {
  const statusClass = isConnected ? "bg-green-500" : "bg-red-500";
  const textClass = isConnected ? "text-green-800" : "text-red-800";

  return (
    <div
      className={`h-8 w-auto p-2 rounded-lg flex items-center ${statusClass} ${textClass} text-sm`}
    >
      {isConnected ? "Connected" : "Disconnected"}
    </div>
  );
};

export default ConnectionStatus;
