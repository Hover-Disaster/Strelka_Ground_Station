#include <SPI.h>
#include <LoRa.h>


void setup() {
  Serial.begin(9600);
  while (!Serial);
  while (!LoRa.begin(915E6)) {
  }
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
    byte readByte = Serial.parseInt();
    Serial.println(readByte);
    LoRa.beginPacket();
    LoRa.write(readByte);
    LoRa.endPacket(false);
    }
}
