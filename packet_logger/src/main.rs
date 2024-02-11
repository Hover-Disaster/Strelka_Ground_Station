use binread::{io::Cursor, BinRead, BinReaderExt};
use bytes::{Buf, Bytes};
use chrono::Local;
use mqtt::Packet;
use rumqttc::{AsyncClient, Event, EventLoop, Incoming, MqttOptions, QoS, SubscribeFilter};
use serde::{Deserialize, Serialize};
use serde_json::{from_slice, from_str, to_string};
use std::error::Error;
use std::fs::{self, File, OpenOptions};
use std::io::{self, Write};
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use tokio::time::{sleep, Duration};
use tokio::{task, time};

async fn event_loop(mut eventloop: EventLoop, folder_path: PathBuf) {
    loop {
        match eventloop.poll().await {
            Ok(event) => {
                match &event {
                    rumqttc::Event::Incoming(packet) => match packet {
                        rumqttc::Packet::Connect(_) => {}
                        rumqttc::Packet::ConnAck(_) => {}
                        rumqttc::Packet::Publish(incoming_packet) => {
                            let topic = incoming_packet.topic.clone();
                            let topic_fields: Vec<&str> = topic.split('/').collect();
                            let filename = format!("{}.json", topic);
                            // Create a file inside the folder
                            let file_path = folder_path.join(filename);
                            let path: &Path = file_path.as_ref();
                            println!("Path: {:#?}", path);
                            // Attempt to create a directory for this node
                            let dir = folder_path.join(topic_fields[0]);
                            match fs::create_dir(&dir) {
                                Ok(_) => println!("Directory created successfully!"),
                                Err(e) => {
                                    eprintln!("Error creating directory: {}", e);
                                    // Handle the error here
                                }
                            }
                            // Set permissions for the directory
                            let mut permissions = fs::metadata(&dir).unwrap().permissions();
                            permissions.set_readonly(false); // Set read permission
                            fs::set_permissions(&dir, permissions).unwrap();

                            // Open the file with options to append data to it
                            match OpenOptions::new()
                                .create(true) // Create the file if it doesn't exist
                                .append(true) // Append data to the end of the file
                                .open(path)
                            {
                                Ok(mut file) => {
                                    // Append content to the file
                                    writeln!(file, "{:?}", incoming_packet.payload).unwrap();
                                    file.flush().unwrap();
                                }
                                Err(err) => {
                                    eprintln!("Error opening file: {}", err);
                                }
                            };
                        }
                        _ => {}
                    },
                    rumqttc::Event::Outgoing(outgoing_packet) => {}
                }
                // println!("Received = {:?}", event);
            }
            Err(err) => {
                eprintln!("Error: {}", err);
            }
        }
    }
}

#[tokio::main]
async fn main() {
    // Get the current date and time as a formatted string
    let datetime_string = Local::now().format("%Y-%m-%d_%H-%M-%S").to_string();

    // Create the folder name
    let folder_name = format!("./data_{}", datetime_string);

    // Create the folder if it doesn't exist
    let mut folder_path = PathBuf::new();
    folder_path.push(&folder_name);
    if !folder_path.exists() {
        fs::create_dir(&folder_path).expect("Failed to create directory");
    }

    /* MQTT Settings */
    let broker_address = "localhost";
    let mqtt_port = 1883;
    let client_id = "lora_receiver";

    // Establish MQTT connection
    let mut mqttoptions = MqttOptions::new(client_id, broker_address, mqtt_port);
    mqttoptions.set_keep_alive(Duration::from_secs(5));

    let (mut client, mut eventloop) = AsyncClient::new(mqttoptions, 10);

    // Spawn async event loop to handle MQTT events
    println!("Spawning event loop");
    tokio::spawn(event_loop(eventloop, folder_path));

    match client.subscribe("#", QoS::AtMostOnce).await {
        Ok(()) => {
            println!("Subscribed to {}", "all topics");
        }
        Err(err) => {
            eprintln!("Error subscribing to {}: {}", "all topics", err);
        }
    }

    loop {}
}
