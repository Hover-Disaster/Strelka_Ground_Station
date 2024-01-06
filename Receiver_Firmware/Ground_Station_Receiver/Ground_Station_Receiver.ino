#include <SPI.h>
#include <LoRa.h>


void setup() {
  Serial.begin(115200);
  while (!Serial);
  while (!LoRa.begin(915E6)) {
  }
  LoRa.setPreambleLength(8);
//  LoRa.setSignalBandwidth(500000);
}


void loop() {
  // try to parse packet
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    // read packet
    while (LoRa.available()) {
      Serial.write(LoRa.read());
    }
  }

  if (Serial.available() > 0) {
    delay(10);
    LoRa.beginPacket();
    
    while (Serial.available() > 0) {
      byte readByte = Serial.read();
      LoRa.write(readByte);      
    }
    
    LoRa.endPacket(false);
  }    
}
