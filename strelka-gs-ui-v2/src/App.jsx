import "./App.css";

// Hooks
import { useWebsocket } from "./hooks/useWebsocket";
import { useMqtt } from "./hooks/useMqtt"
import { useState } from "react";

// Components
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/nav/Navbar";
import { NavLink } from "react-router-dom";
import Controls from "./components/controls/Controls";

// Pages
import Home from "./pages/Home";
import Input from "./pages/Input";
import Map from "./pages/Map";

function App() {
  // Websocket data
  const [websocketRef, status, replayStatus] = useWebsocket(
    "ws://localhost:33845/websocket",
    false
  );

  // // Mqtt data
  // const [mqttRef, status] = useMqtt(
  //   'mqtt://localhost:9001',
  //   true
  // )

  // Current pageS
  return (
    <div id="App">
      <Navbar version={status.version} org={status.org} status={status.status}>
        <NavLink
          className={({ isActive }) => (isActive ? "link-active" : "link")}
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          to="/Input"
          className={({ isActive }) => (isActive ? "link-active" : "link")}
        >
          Input
        </NavLink>
        <NavLink to="/Map"
        className={({ isActive }) => (isActive ? "link-active" : "link")}
        >Map</NavLink>
      </Navbar>

      <Controls websocketRef={websocketRef} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Input" element={<Input />} />
        <Route path="/Map" element={<Map />} />
      </Routes>

      <div id="footer">Developed by Angus McLennan</div>
    </div>
  );
}

export default App;
