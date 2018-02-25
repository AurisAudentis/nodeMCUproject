  int x[] = {0,0,0};


void setup() {
  // put your setup code here, to run once:
  x[1] += 1;
  Serial.begin(9600);
  }

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println(x[1]);
  Serial.println(x[0]);
  delay(1000);
  x[1] += 1;
}
