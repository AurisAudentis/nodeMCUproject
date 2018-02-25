//producer
int OutPin = D1;
int shortDelay = 1;
int longDelay = 5;
int id = 234;

void setup() {
  pinMode(OutPin, OUTPUT);
  Serial.begin(9600);

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

void loop() {
  sendBit(id);

}

