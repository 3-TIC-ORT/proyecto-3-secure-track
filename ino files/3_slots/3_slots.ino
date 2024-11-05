#include <Servo.h>
#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <SPI.h>
#include <MFRC522.h>

#define RFID_RST_PIN 49
#define RFID_SS_PIN 53
#define maxValores 5
#define ledSlot1 34
#define ledSlot2 36
#define ledSlot3 38 
#define btnSlot1 29
#define btnSlot2 31
#define btnSlot3 33
#define btnGral1 22
#define buzzer 48
#define electroIman 40
#define led_rojo 10
#define waitTime 5


LiquidCrystal_I2C lcd(0x27, 20, 4);
MFRC522 rfid(RFID_SS_PIN, RFID_RST_PIN);
Servo servoSlot1;
Servo servoSlot2;
Servo servoSlot3;

String inputList[5];
bool stateStart;
String uidString = "";
String serialString = "";
String listMsgLcd = "";

void listTranslate(String input, String outputArray[]) {
  String temp = "";
  int count = 0;
  for (int i = 0; i < input.length(); i++) {
    if (input[i] == ',') {
      if (count < 4) {
        outputArray[count] = temp;
        count++;
      }
      temp = "";
    } else {
      temp += input[i];
    }
  }
  if (temp != "" && count < 4) {
    outputArray[count] = temp;
  }
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  lcd.init();
  lcd.begin(16, 2);
  lcd.backlight();
  lcd.setCursor(0, 0);
  SPI.begin();
  rfid.PCD_Init();
  servoSlot1.attach(2);
  servoSlot2.attach(3);
  servoSlot3.attach(4);
  servoSlot1.write(0);
  servoSlot2.write(0);
  servoSlot3.write(0);
  pinMode(ledSlot1, OUTPUT);
  pinMode(ledSlot2, OUTPUT);
  pinMode(ledSlot3, OUTPUT);
  pinMode(btnSlot1, INPUT_PULLUP);
  pinMode(btnSlot2, INPUT_PULLUP);
  pinMode(btnSlot3, INPUT_PULLUP);
  pinMode(btnGral1, INPUT_PULLUP);
  pinMode(buzzer, OUTPUT);
  pinMode(electroIman, OUTPUT);
  lcd.print("podes escanear");
}

void buzzerFunc(bool state){
  if(state){
    analogWrite(buzzer, 0); // prendido
  }else{
    analogWrite(buzzer, 0);
  }
}

void slot1(bool state) {
  if (state) {
    servoSlot1.write(45);
    digitalWrite(ledSlot1, HIGH);
  } else {
    servoSlot1.write(0);
    digitalWrite(ledSlot1, LOW);
  }
}
void slot2(bool state) {
  if (state) {
    servoSlot2.write(45);
    digitalWrite(ledSlot2, HIGH);
  } else {
    servoSlot2.write(0);
    digitalWrite(ledSlot2, LOW);
  }
}
void slot3(bool state) {
  if (state) {
    servoSlot3.write(45);
    digitalWrite(ledSlot3, HIGH);
  } else {
    servoSlot3.write(0);
    digitalWrite(ledSlot3, LOW);
  }
}
void puertaGeneral(bool state) {
  if (state) {
    digitalWrite(electroIman, HIGH);
  } else {
    digitalWrite(electroIman, LOW);
  }
}


void unico(String lista[4], int timeStart) {
  switch (lista[1].toInt()) {
    case 1:
      stateStart = digitalRead(btnSlot1);
      slot1(true);
      puertaGeneral(true);
      lcd.clear();
      lcd.print("slot 1 abierto");
      while (stateStart == digitalRead(btnSlot1)) {
      }
      lcd.clear();
      lcd.print("por favor cierre la puerta");
      timeStart=millis();
      while (digitalRead(btnGral1)) {
        buzzerFunc(true);
      }
      
      buzzerFunc(false);
      puertaGeneral(false);
      break;
    case 2:
      stateStart = digitalRead(btnSlot2);
      slot2(true);
      puertaGeneral(true);
      lcd.clear();
      lcd.print("slot 2 abierto");
      while (stateStart == digitalRead(btnSlot2)) {
      }
      lcd.clear();
      lcd.print("por favor cierre la puerta");
      timeStart=millis();
      while (digitalRead(btnGral1)) {
        buzzerFunc(true);
      }
      
      buzzerFunc(false);
      puertaGeneral(false);
      break;
    case 3:
      stateStart = digitalRead(btnSlot3);
      slot3(true);
      puertaGeneral(true);
      lcd.clear();
      lcd.print("slot 3 abierto");
      while (stateStart == digitalRead(btnSlot3)) {
      }
      lcd.clear();
      lcd.print("por favor cierre la puerta");
      timeStart=millis();
      while (digitalRead(btnGral1)) {
        buzzerFunc(true);
      }
      buzzerFunc(false);
      puertaGeneral(false);
      break;
    default:
      lcd.clear();
      lcd.print("numero de slot no disponible");
      buzzerFunc(true);
      delay(1000);
      buzzerFunc(false);
      lcd.clear();
      break;
  }
  lcd.clear();
  buzzerFunc(false);
  puertaGeneral(false);
  lcd.print("podes escanear");
  slot1(false);
  slot2(false);
  slot3(false);
}

void multiple(String lista[4], int timeStart) {
  puertaGeneral(true);
  lcd.clear();
  lcd.setCursor(0, 0);
  listMsgLcd="";
  lcd.print("Slots:");
  if (lista[1].toInt() == 1) {
    slot1(true);
    listMsgLcd += "1 ";
  }
  if (lista[2].toInt() == 1) {
    slot2(true);
    listMsgLcd += "2 ";
  }
  if (lista[3].toInt() == 1) {
    slot3(true);
    listMsgLcd += "3 ";
  }
  lcd.print(listMsgLcd);
  
  // while(digitalRead(btnGral1)==LOW){

  // }
  bool stateBtn1=digitalRead(btnSlot1);
  bool stateBtn2=digitalRead(btnSlot2);
  bool stateBtn3=digitalRead(btnSlot3);
  while (true) {
    if(digitalRead(btnSlot1)!=stateBtn1 || lista[1]=="0"){
      if(digitalRead(btnSlot2)!=stateBtn2 || lista[2]=="0"){
        if(digitalRead(btnSlot3)!=stateBtn3 || lista[3]=="0"){
          break;
          
        }
      } 
    }
  }
  lcd.clear();
  lcd.print("por favor cierre la puerta");
  timeStart=millis();
  while (digitalRead(btnGral1)) {
    buzzerFunc(true);
  }
  buzzerFunc(false);
  lcd.clear();
  slot1(false);
  slot2(false);
  slot3(false);
  buzzerFunc(false);
  puertaGeneral(false);
  lcd.print("podes escanear");
}

void devolucion(String rfid, int timeStart) {
  String outputArray[5];
  Serial.println(rfid);
  lcd.clear();
  lcd.print("procesando ...");
  while (Serial.available() == 0) {
  }
  serialString = Serial.readStringUntil('\n');
  listTranslate(serialString, outputArray);
  if(outputArray[0]=="0"){
    unico(outputArray, 0);
  }else if(outputArray[0]=="1"){
    multiple(outputArray, 0);
  }

  lcd.clear();
  puertaGeneral(false);
  lcd.print("podes escanear");
  buzzerFunc(false);
  slot1(false);
  slot2(false);
  slot3(false);
}

void loop() {
  serialString="";
  for(int i=0;i<5;i++){
    inputList[i]="";
  }
  digitalWrite(led_rojo, HIGH);
  puertaGeneral(false);
  if (Serial.available() > 0) {
    serialString = Serial.readStringUntil('\n');
    listTranslate(serialString, inputList);
    if (inputList[0] == "0") {
      unico(inputList, 0);
    } else if (inputList[0] == "1") {
      multiple(inputList, 0);
    }else if(inputList[0]=="5"){
      lcd.print(inputList[1]);
      delay(3000);
      lcd.clear();
    }
  }
  if (rfid.PICC_IsNewCardPresent()) {
    if (rfid.PICC_ReadCardSerial()) {
      uidString = "";
      for (byte i = 0; i < rfid.uid.size; i++) {
        uidString += String(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
        uidString += String(rfid.uid.uidByte[i], HEX);
      }
      devolucion(uidString, 0);
      digitalWrite(led_rojo, LOW);
    }
  }
}
