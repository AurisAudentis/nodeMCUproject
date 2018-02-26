#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

//ID of this node. This will be sent.

//for wifi setup
const char* ssid = "OpenWifi";
const char* password = "discreteA";


//consumer
const byte interruptPin[] = {13,12,14,2,0,4,15,16}; //D7

int numberOfInterrupts = 0;
unsigned long now;
unsigned long previousTime[] = {0,0,0,0,0,0,0,0};
volatile byte oneCounter[] = {0,0,0,0,0,0,0,0};

int shortDelay = 1; //delay between "pings" (pings are 1's of a message)
int longDelay = 5; //delay between messages
int binaryCounter[] = {7,7,7,7,7,7,7,7}; //Counts the amount of bits
int idNumber[] = {0,0,0,0,0,0,0,0};
int tempIDNumber[] = {0,0,0,0,0,0,0,0};

//producer
int OutPin = D1;
int id = 234;

void setup() {

  Serial.begin(9600);   //init serial communication to arduino ide with baud rate 9600
  pinMode(interruptPin[0], INPUT); //set pin mode to input for interruptPin (13/D7)

  Serial.println("started"); //output "started" to serial communication
  //This sets up the wifi connection.
  delay(600);
  wifiSetup();

  //This sets up the listening ports on the pins.
  attachInterrupt(digitalPinToInterrupt(interruptPin[0]), callHandleInterrupt_01, FALLING); //call function "handleInterrupt" when the voltage at interruptPin approaches 0 after having been high
  attachInterrupt(digitalPinToInterrupt(interruptPin[1]), callHandleInterrupt_02, FALLING); //call function "handleInterrupt" when the voltage at interruptPin approaches 0 after having been high
  attachInterrupt(digitalPinToInterrupt(interruptPin[2]), callHandleInterrupt_03, FALLING); //call function "handleInterrupt" when the voltage at interruptPin approaches 0 after having been high
  attachInterrupt(digitalPinToInterrupt(interruptPin[3]), callHandleInterrupt_04, FALLING); //call function "handleInterrupt" when the voltage at interruptPin approaches 0 after having been high
  attachInterrupt(digitalPinToInterrupt(interruptPin[4]), callHandleInterrupt_05, FALLING); //call function "handleInterrupt" when the voltage at interruptPin approaches 0 after having been high
  attachInterrupt(digitalPinToInterrupt(interruptPin[5]), callHandleInterrupt_06, FALLING); //call function "handleInterrupt" when the voltage at interruptPin approaches 0 after having been high  
  /*attachInterrupt(digitalPinToInterrupt(interruptPin7), callHandleInterrupt_07, FALLING); //call function "handleInterrupt" when the voltage at interruptPin approaches 0 after having been high
  attachInterrupt(digitalPinToInterrupt(interruptPin8), callHandleInterrupt_08, FALLING); //call function "handleInterrupt" when the voltage at interruptPin approaches 0 after having been high
*/
  
}


void loop() {

  getMessages();
  sendBit(id);
  delay(400);
}

void callHandleInterrupt_01 ()
{
  handleInterrupt(1);
}
void callHandleInterrupt_02 ()
{
  handleInterrupt(2); // 
}
void callHandleInterrupt_03 ()
{
  handleInterrupt(3);
}
void callHandleInterrupt_04 ()
{
  handleInterrupt(4);
}
void callHandleInterrupt_05 ()
{
  handleInterrupt(5);
}
void callHandleInterrupt_06 ()
{
  handleInterrupt(6);
}
/*
void callHandleInterrupt_07 ()
{
  handleInterrupt(7);
}
void callHandleInterrupt_08 ()
{
  handleInterrupt(8);
} */


void handleInterrupt(int pinID) {  //method called upon interrupt  (when interruptPin falls)
  now = millis(); //get current time  (0 upon startup)

  //interruptCounter++;
  pinID -= 1;
  oneCounter[pinID]++;

  int diff = now - previousTime[pinID]; //calculate time diff

  if (diff >= longDelay) { //if this message comes later then longDelay milliseconds
    if (oneCounter[pinID] == 10) {
      binaryCounter[pinID] = 7;
      tempIDNumber[pinID] = 0;
    } else if (oneCounter[pinID] == 2) {
      tempIDNumber[pinID] += pow(2, binaryCounter[pinID]);
      binaryCounter[pinID]--;
    } else if (oneCounter[pinID] == 1) {
      binaryCounter[pinID]--;
    }



    if (binaryCounter[pinID] == 0) {
      idNumber[pinID] = tempIDNumber[pinID];
      Serial.print("idNumber: ");
      Serial.print(pinID);
      Serial.print("  :");
      Serial.println(idNumber[pinID]);


      binaryCounter[pinID] = 7;
      tempIDNumber[pinID] = 0;
    }



    oneCounter[pinID] = 0;

  }

previousTime[pinID] = now;
}


//This performs the nessesary action when a message is found. ----TODO: Prints out said message.
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
  declareToServ();  //gives all info about the node to the server and registers
  Serial.print("Connection to server established! Connection id: ");
  Serial.println(id); 
  }


//This requests a temporary id from the server
/*int getId(){
  HTTPClient http;
  http.begin("http://maxiemgeldhof.com/node/id");
  http.addHeader("Content-Type", "plain/text");
  int httpCode = http.GET();
  int ident = atoi(http.getString().c_str());
  http.end();
  return ident;
  }*/

//This sends all relevant info to the server for registery
  void declareToServ(){
    HTTPClient http;
    char buffer [55];
    sprintf(buffer, "http://maxiemgeldhof.com/node/%d", id);
    http.begin(buffer);

    http.addHeader("Content-Type", "application/json");
    Serial.println(WiFi.localIP());
    sprintf(buffer, "{\"id\":%d, \"surrounding\":[%d,%d,%d,%d,%d,%d,%d,%d]}", id, idNumber[0],idNumber[1],idNumber[2],idNumber[3],idNumber[4],idNumber[5],idNumber[6],idNumber[7]);
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

      void sendOne() {
  digitalWrite(OutPin, 1);
  delay(shortDelay);
  digitalWrite(OutPin, 0);
  delay(shortDelay);
}

void sendDigit(int digit) {
  for (int i = 0; i < digit; i++) {
    sendOne();
  }
  delay(longDelay);
}

void sendBit(int toSend) {
  for (int j = 7; j >= 0; j--) {
    if (toSend < pow(2, j))
    {
      sendDigit(1);
    }
    else
    {
      sendDigit(2);
      toSend -= pow(2, j);
    }
  Serial.println(j);
  Serial.println(toSend);
  }
  delay(longDelay);
  sendDigit(10);

}




