# Strelka_Ground_Station
This repository contains code which establishes a ground station for Strelka.

The ground station is divided into two sections:
1. Packet receiver<br />
   The packet receiver interfaces with the radio hardware to receive bytes, decoding and checking CRCs. The data is then transmitted over an MQTT topic for display on the user front end.<br />
   The packet receiver code is intended to be generic enough to be used in a range of applications. To interface with the packet receiver, a MQTT server must established and the packet receiver must be configured to subscribe to its topics. 
3. Visualiser<br />
   The visualiser is a server running the Mosquitto MQTT client and the front end graphical interface. 
