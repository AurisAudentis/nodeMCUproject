/*
 ESP8266 Blink by Simon Peter
 Blink the blue LED on the ESP-01 module
 This example code is in the public domain
 
 The blue LED on the ESP-01 module is connected to GPIO1 
 (which is also the TXD pin; so we cannot use Serial.print() at the same time)
 
 Note that this sketch uses LED_BUILTIN to find the pin with the internal LED
*/

void setup() {
  pinMode(D4, OUTPUT); 
    digitalWrite(D4, HIGH);  // Initialize the LED_BUILTIN pin as an output
  pinMode(1, OUTPUT);
  digitalWrite(1, HIGH);
}

// the loop function runs over and over again forever
void loop() {
             // Wait for two seconds (to demonstrate the active low LED)
  digitalWrite(1, LOW);
  digitalWrite(2, LOW);
}
