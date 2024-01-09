import React, { useState, useEffect } from 'react';
import BatteryGauge from 'react-battery-gauge'
import LEDIndicator from './LEDIndicator';
import mqtt from 'mqtt';
import './App.css';

const App = () => {
  const [client, setClient] = useState(null);
  const [idInput, setIdInput] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [subscribedTopics, setSubscribedTopics] = useState([]);
  const [receivedData, setReceivedData] = useState({});
  const [allIds, setAllIds] = useState([]);
  const [dataDisplay, setDataDisplay] = useState(false);
  const [batteryPercentage, setBatteryPercentage] = useState(10);
  const [accel1Good, setAccel1Good] = useState(false);

  useEffect(() => {
    // Connect to the MQTT broker
    const mqttClient = mqtt.connect('mqtt://localhost:9001');

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      setClient(mqttClient);
    });

    mqttClient.on('message', (topic, payload) => {
      // Handle incoming messages
      /*
        TODO:
        - Save incoming data to file
      */
      const data = { ...receivedData, [topic]: payload.toString() };
      setReceivedData(data);
    });

    /* 
      TODO:
      On selection of data page, display all most recent data to user
      Periodically refresh current data displayed
    */
    // Periodic refresh function
    const periodicRefresh = () => {
      console.log('Executing periodically!');
      // Periodically update data display fields
    };
    // Set up data display refresh interval 
    const intervalId = setInterval(periodicRefresh, 2000);

    return () => {
      // Disconnect from the MQTT broker when the component unmounts
      if (mqttClient) {
        mqttClient.end();
      }
      clearInterval(intervalId);
    };
  }, [receivedData]);

  const handleIdSubmit = () => {
    if (idInput) {
      const topicsToSubscribe = [
        'BatVol',
        'Continuity',
        'FireDrogue',
        'FireMain',
        'Gps1State',
        'Gps2State',
        'Accel1State',
        'Accel2State',
        'Gyro1State',
        'Gyro2State',
        'Mag1State',
        'Mag2State',
        'Baro1State',
        'Baro2State',
        'FlashMemoryState',
        'FlashMemoryConfig',
        'GpsTrackingConfig',
        'GpsTrackingPacket',
      ];
      const idTopic = `Node_${idInput}`;
      const topics = topicsToSubscribe.map((topic) => `${idTopic}/${topic}`);
      setSubscribedTopics(topics);
      setSelectedId(idInput);
      setIdInput('');

      // Update the list of all IDs
      setAllIds((prevIds) => Array.from(new Set([...prevIds, idInput])));
      subscribeToTopics(topics);
      setDataDisplay(false);
    }
  };

  const subscribeToTopics = (topics) => {
    if (client) {
      topics.forEach((topic) => {
        client.subscribe(topic);
        console.log(`Subscribed to topic: ${topic}`);
      });
    }
  };

  const handleReturnHome = () => {
    /*
      TODO:
      - Do not unsubscribe from topics not in view as the data will not be saved to file
    */
    // if (client && subscribedTopics.length > 0) {
    //   subscribedTopics.forEach((topic) => {
    //     client.unsubscribe(topic);
    //     console.log(`Unsubscribed from topic: ${topic}`);
    //   });
    //   setSubscribedTopics([]); 
    // }
    if (client && subscribedTopics.length > 0) {
      setDataDisplay(false);
    }
  };

  const handleDisplayPage = () => {
    if(selectedId !== "") {
      setDataDisplay(true);
    }
  };

  return (
    <div className="container">
      <h1>Strelka Ground Station</h1>
      <div className="input-container">
        {!dataDisplay && (
          <div>
            <div className="input-item">
              <label>
                Select ID:
                <select onChange={(e) => setSelectedId(e.target.value)}>
                  <option value="">-- Select an ID --</option>
                  {allIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
                <button onClick={handleDisplayPage}>Display Data</button>
              </label>
            </div>
            <div className="input-item">
              <label>
                Enter ID Number:
                <input
                  type="number"
                  placeholder="Enter ID Number"
                  value={idInput}
                  onChange={(e) => setIdInput(e.target.value)}
                />
              </label>
              <button onClick={handleIdSubmit}>Submit</button>
            </div>
          </div>
        )}
      </div>
      {dataDisplay && (
          <div> 
            <h2>Data for Node_{selectedId}</h2>
            <div className="message-container">
              {Object.entries(receivedData).map(([topic, data]) => (
                <div key={topic}>
                  <strong>{topic}:</strong> {data}
                </div>
              ))}
            </div>
            <BatteryGauge value={40} />
            <LEDIndicator isActive={accel1Good} activeColor="green" inactiveColor="red" text="Accel 1 Status" />
            <button onClick={handleReturnHome}>Home</button>
          </div>
        )}
    </div>
  );
};

export default App;
