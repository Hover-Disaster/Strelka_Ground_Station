// Writes the previous "n" data packets to local storage for retrieval
const STORAGE_KEY = "telemetry";
let resolution = 20; // Show 20 historical data points by default

/**
 * Sets the number of historical data points to be recorded in the local storage buffer
 * @author Matteo Golin <matteo.golin@gmail.com>
 * @param {number} new_res
 */
export function set_resolution(new_res) {
  resolution = new_res;
}

/**
 * Reads the telemetry data from local storage
 * @author Matteo Golin <matteo.golin@gmail.com>
 * @returns Telemetry data in JSON format
 */
export function read_telemetry(key) {
  let data = JSON.parse(localStorage.getItem(key));
  data = data ? data : {};
  return data;
}

/**
 * Shifts the buffer array to remove old data, making room for new data
 * @author Matteo Golin <matteo.golin@gmail.com>
 * @param {JSON} new_data The new data of the key being written to
 * @param {Array} prev_buffer The array of previous buffer data
 */
function shift_array(new_data, prev_buffer) {
  // Write the new data if it's not a duplicate (duplicate confirmed by comparing mission times)
  const latest_index = prev_buffer.length - 1;

  if (
    latest_index === -1 ||
    prev_buffer[latest_index].mission_time !== new_data.mission_time
  ) {
    prev_buffer.push(new_data);
  }

  if (prev_buffer.length > resolution) {
    prev_buffer.shift(); // Remove oldest data when there's an overflow
  }
}

/**
 * Writes the most recent data to the local storage buffer
 * @author Matteo Golin <matteo.golin@gmail.com>
 * @param {JSON} recent_data
 */
export function write_telemetry(recent_data) {
  let key = recent_data.topic;
  let payload = recent_data.payload;
  // Get existing data
  let historic_telem = read_telemetry(key);

  // What sections to write to

  if (recent_data === undefined) {
    return;
  }

  // Ensure that key exists in historical buffer
  let buffer;
  if (Object.keys(historic_telem).length != 0) {
    buffer = historic_telem; // Read the last buffer data
  } else {
    buffer = [];
  }
  shift_array(payload, buffer); // Add new data to buffer
  
  // Once all historical data has been updated, overwrite localStorage copy
  console.log("Writing buffer: "+buffer);
  localStorage.setItem(key, JSON.stringify(buffer));
  window.dispatchEvent(new Event("storage")); // Signal that new data was written
}

/**
 * Clears the local storage buffer of historical data
 */
export function clear_telemetry() {
  localStorage.removeItem(STORAGE_KEY);
}
