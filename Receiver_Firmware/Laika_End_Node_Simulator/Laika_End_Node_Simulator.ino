#include <SPI.h>
#include <LoRa.h>

// Lora module pins
const int csPin = 15;
const int resetPin = 16;
const int irqPin = 27;
const long frequency = 915E6;
SPIClass rfSPI(HSPI);

uint8_t dummy_Gps1StateRes[] = { /*identifier*/ 0x09, 0x00 /*identifier*/, /*sender ID*/ 0x00, 0x00, 0x00, 0x00 /*sender ID*/, /*receiver ID*/ 0x00, 0x00, 0x00, 0x00 /*receiver ID*/, /*Payload*/ 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01 /*Payload*/, /*CRC32*/ 0x11, 0x77, 0x23, 0x1D /*CRC32*/ };
uint8_t crc[] = { 0x11, 0x77, 0x23, 0x1D };

uint32_t last_send = 0;

void setup() {
  Serial.begin(115200);
  LoRa.setPins(csPin, resetPin, irqPin);
  LoRa.setSPI(rfSPI);
  while (!LoRa.begin(frequency)) {
    Serial.println("LoRa failed");
  }
  Serial.println("Starting");
}

void loop() {
  if (millis() - last_send > 10000) {
    last_send = millis();
    LoRa.beginPacket();
    for (int i = 0; i < sizeof(dummy_Gps1StateRes); i++) {
      LoRa.write(dummy_Gps1StateRes[i]);
    }
    LoRa.endPacket(false);
  }


  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    // delay(25);
    // read packet
    while (LoRa.available()) {
      Serial.print(LoRa.read());
    }
    Serial.println("");
  }
}
