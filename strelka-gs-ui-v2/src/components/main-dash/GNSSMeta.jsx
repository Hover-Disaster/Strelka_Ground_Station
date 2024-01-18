import { useEffect, useRef, useState } from "react";
import "./GNSSMeta.css";
import { read_telemetry } from "../../utils/storage";
import { getCurrentNodeID } from "../../hooks/useStorage";

// Hooks
import { useStorage } from "../../hooks/useStorage";

// Components
import Satellite from "./Satellite";

export default function GNSSMeta({ className }) {
  let [currentLatitude, setCurrentLatitude] = useState([]);
  let [currentLongitude, setCurrentLongitude] = useState([]);
  let [currentAltitude, setCurrentAltitude] = useState([]);
  let [satsInView, setSatsInView] = useState([]);

  const get_metadata = (data) => {
    let gps_dat = {};
    gps_dat.lat = data[0].latitude;
    gps_dat.lng = data[0].longitude;
    gps_dat.alt = data[0].gps_altitude;
    gps_dat.sats_in_view = data[0].satellites_tracked;
    return gps_dat;
  };

  // Satellites in use
  const metadata = useStorage(get_metadata);
  // Only read from metadata if it isn't empy (i.e., isn't an empty array but an object)
  if (!Array.isArray(metadata)) {
    // Satellites in view
    let in_view = metadata.sats_in_view ?? "No satellites in view.";
    // Uncommenting these below should update the variables however, it causes an infinite render loop
    // Only update if changed
    if(in_view != satsInView) {
      setSatsInView(in_view);
    }
    if(metadata.lat != currentLatitude) {
      setCurrentLatitude(metadata.lat);
    }
    if(metadata.lng != currentLongitude) {
      setCurrentLongitude(metadata.lng);
    }
    if(metadata.alt != currentAltitude) {
      setCurrentAltitude(metadata.alt);
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        let current_node_id = getCurrentNodeID();
        if (current_node_id) {
          let historical_data = await read_telemetry("Node_" + getCurrentNodeID() + "/StreamPacketType0");
          console.log("Data fetched:", historical_data);
          setCurrentLatitude(historical_data[historical_data.length - 1].latitude);
          setCurrentLongitude(historical_data[historical_data.length - 1].longitude);
          setCurrentAltitude(historical_data[historical_data.length - 1].gps_altitude);
          setSatsInView(historical_data[historical_data.length - 1].satellites_tracked);
        }
      } catch (error) {
        console.error("Error fetching telemetry data:", error);
        // Handle error as needed, e.g., set default values or show an error message
      }
    };

    fetchData(); // Call the async function

    // Cleanup function (optional)
    return () => {
      console.log("Cleaning up...");
      // Any cleanup code if needed
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount


  return (
    <div className={className + " gnss"}>
      <div className="metadata">
        <h4>Satellites in View</h4>
        <div className="in-view">{satsInView}</div>
        <div className="current-latlngalt">
          <p>
            <strong>Latitude: </strong>
            {currentLatitude}
          </p>
          <p>
            <strong>Longitude: </strong>
            {currentLongitude}
          </p>
          <p>
            <strong>Altitude: </strong>
            {currentAltitude}m
          </p>
        </div>
      </div>
    </div>
  );
}
