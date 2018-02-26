#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
 
const char* ssid = "OpenWifi";
const char* password = "discreteA";
int id = 0;
 
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  wifiSetup(); //This initializes the wifi connection, as well as server connection and identification.
  
}

void loop() {
  // put your main code here, to run repeatedly:
  sendMessage("Testing.", id-1); //This sends a message that contains "Testing." to the node with id-1. 0 is server.
  delay(30000);
  getMessages(); //This reads every outstanding message, and casts it to "handlemessage()". ---TEMPORARY : prints out message on serial handler.
}



//This performs the nessesary action when a message is found. Prints out said message.
     void handleMessage(String message){
      Serial.println(message);
      }





void wifiSetup(){
  //Connects to local wifi 
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
  
  //Establish connection to server
  id = getId();     //posts request to server, and receive an id --- TEMPORARY
  declareToServ();  //gives all info about the node to the server and registers
  Serial.print("Connection to server established! Connection id: ");
  Serial.println(id); 
  }


//This requests a temporary id from the server
int getId(){
  HTTPClient http;
  http.begin("http://maxiemgeldhof.com/node/id");
  http.addHeader("Content-Type", "plain/text");
  int httpCode = http.GET();
  int ident = atoi(http.getString().c_str());
  http.end();
  return ident;
  }

//This sends all relevant info to the server for registery
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

//This requests the server to post a message to 'toid'. 0 is server.
    void sendMessage(String message, int toid){
      HTTPClient http;
      char buffer [45];
      sprintf(buffer, "http://maxiemgeldhof.com/node/%d/message", id);
      http.begin(buffer);
      http.addHeader("Content-Type", "application/json");
      sprintf(buffer, "{\"id\":%d, \"message\":\"%s\"}", toid, message.c_str());
      int httpCode = http.POST(buffer);
      Serial.println(http.getString());
      http.end();
      }

//This looks up all messages registered in the server, and handles them with 'handlemessage()'
    void getMessages(){
      HTTPClient http;
      char buffer [45];
      sprintf(buffer, "http://maxiemgeldhof.com/node/%d/message", id);
      http.begin(buffer);
      http.addHeader("Content-Type", "plain/text");
      int httpCode = http.GET();
      while(httpCode != 204){
        handleMessage(http.getString());
        httpCode = http.GET();
        }
      http.end();
      }



