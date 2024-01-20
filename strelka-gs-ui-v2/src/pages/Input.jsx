import React, { createContext, useState, useContext, useEffect } from 'react';
import { mqttRef, status } from '../App.jsx';
import { upstreamTopics } from '../hooks/mqttTopics.js';
import "./Input.css";
import { setCurrentNodeID, getCurrentNodeID, setCurrentNodeArray, getCurrentNodeArray } from '../hooks/useStorage.js';

export default function Input() {
  const [currentNodeID, setNodeID] = useState('');
  const [nodeArray, setNodeArray] = useState([]);

  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Function to handle input value change
  const handleInputChange = (event) => {
    setNodeID(event.target.value);
    setCurrentNodeID(event.target.value);
  };

  const submitNodeID = (event) => {
    event.preventDefault();

    if (currentNodeID != '') {
      setSelectedOption("Node_" + currentNodeID);
      // currentNodeID = selectedOption;

      // Add the current input value to the array
      setNodeArray([...nodeArray, currentNodeID]);
      setCurrentNodeArray([...nodeArray, currentNodeID]);

      // Subscribe to input value topics
      const topic = "Node_" + currentNodeID;
      console.log("Subscribing to all subtopics for " + topic);
      // Subscribe to all subtopics
      upstreamTopics.forEach((subtopic) => {
        let subscribe_topic = topic + "/" + subtopic;
        mqttRef.current.subscribe(subscribe_topic, { qos: 0 });
        // Publish to current_node_ids topic to inform radio interface program of node ids to listen for
        let payload = {};
        payload.id_array = [parseInt(currentNodeID,10)];
        mqttRef.current.publish("current_node_ids", JSON.stringify(payload));
      });
    }

    // Clear the input field after adding the value to the array
    setNodeID('')
  };

  useEffect(() => {
    // Get current node array from externally stored location
    setNodeArray(getCurrentNodeArray());
    // setSelectedOption(getCurrentNodeID());
  });

  return (
    <main id="input" className="page-input">
      <section id="input-fields">
        <div className="card">
          <form>
            <h3>Node ID Submission (Decimal)</h3>
            <input value={currentNodeID} onChange={handleInputChange} className="node-id-input" type="number" placeholder="Input Node ID" />
            <button className="node-id-submit" type="button" onClick={submitNodeID}>Submit</button>
          </form>
        </div>
      </section>
      <div className="node-id-display">
        <div className={"card"}>
          <div>
            <h3>Current Nodes</h3>
            <ul>
              {/* Render array elements */}
              {nodeArray.map((element, index) => (
                <li key={index}>{"Node_" + element}</li>
              ))}
            </ul>
          </div>
          <div>
            <label htmlFor="dropdown">Choose an option:</label>
            <select id="dropdown" value={selectedOption} onChange={handleSelectChange}>
              <option value="">Select an option</option>
              {nodeArray.map((option, index) => (
                <option key={index} value={"Node_" + option}>
                  {"Node_" + option}
                </option>
              ))}
            </select>

            {selectedOption && (
              <p>You selected: {selectedOption}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}