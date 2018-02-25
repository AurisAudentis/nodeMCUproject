#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
 
const char* ssid = "telenet-41E70";
const char* password = "bywJEv1FdXRT";
int id = 0;
 
void setup() {
  Serial.begin(115200);
  delay(10);
 
 
  // Connect to WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
 
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println(WiFi.localIP());
  id = getId();
  declareToServ();
  Serial.println(id);  
}
 
void loop() {
delay(30000);
 }


 int getId(){
  HTTPClient http;
  http.begin("http://maxiemgeldhof.com/node/id");
  http.addHeader("Content-Type", "plain/text");
  int httpCode = http.GET();
  int ident = atoi(http.getString().c_str());
  http.end();
  return ident;
  }

  void declareToServ(){
    HTTPClient http;
    char buffer [45];
    sprintf(buffer, "http://maxiemgeldhof.com/node/%d", id);
    http.begin(buffer);

    http.addHeader("Content-Type", "application/json");
    Serial.println(WiFi.localIP());
    sprintf(buffer, "{\"id\":%d, \"ipaddress\":\"%s\"}", id, WiFi.localIP().toString().c_str());
    int httpCode = http.POST(buffer);
    Serial.println(buffer);
  Serial.println(http.getString());
  http.end();
    }
 
