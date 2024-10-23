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
#define btnSlot1 29
#define btnSlot2 31
#define btnGral1 22
#define buzzer 48
#define electroIman 41
#define led_rojo 10
#define waitTime 5


LiquidCrystal_I2C lcd(0x27, 20, 4);
MFRC522 rfid(RFID_SS_PIN, RFID_RST_PIN);
Servo servoSlot1;
Servo servoSlot2;

String inputList[4];
bool stateStart;
String uidString = "";
String serialString = "";
String listMsgLcd = "";

void listTranslate(String input, String outputArray[]) {
  String temp = "";
  int count = 0;
  for (int i = 0; i < input.length(); i++) {
    if (input[i] == ',') {
      if (count < 3) {
        outputArray[count] = temp;
        count++;
      }
      temp = "";
    } else {
      temp += input[i];
    }
  }
  if (temp != "" && count < 3) {
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
  servoSlot1.write(0);
  servoSlot2.write(0);
  pinMode(ledSlot1, OUTPUT);
  pinMode(ledSlot2, OUTPUT);
  pinMode(led_rojo, OUTPUT);
  pinMode(btnSlot1, INPUT_PULLUP);
  pinMode(btnSlot2, INPUT_PULLUP);
  pinMode(btnGral1, INPUT_PULLUP);
  pinMode(buzzer, OUTPUT);
  pinMode(electroIman, OUTPUT);
  lcd.print("podes escanear");
}



void slot1(bool state) {
  if (state) {
    servoSlot1.write(90);
    digitalWrite(ledSlot1, HIGH);
  } else {
    servoSlot1.write(0);
    digitalWrite(ledSlot1, LOW);
  }
}
void slot2(bool state) {
  if (state) {
    servoSlot2.write(90);
    digitalWrite(ledSlot2, HIGH);
  } else {
    servoSlot2.write(0);
    digitalWrite(ledSlot2, LOW);
  }
}


void puertaGeneral(bool state) {
  if (state) {
    digitalWrite(electroIman, HIGH);
  } else {
    digitalWrite(electroIman, LOW);
  }
}


void unico(String lista[4]) {
  int timeStart;
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
        if (millis() - timeStart > 5000) {
          digitalWrite(buzzer, HIGH);
        }
      }
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
        if (millis() - timeStart > 5000) {
          digitalWrite(buzzer, HIGH);
        }
      }
      puertaGeneral(false);
      break;
    default:
      lcd.clear();
      lcd.print("numero de slot no disponible");
      digitalWrite(buzzer, HIGH);
      delay(1000);
      digitalWrite(buzzer, LOW);
      lcd.clear();
      break;
  }
  lcd.clear();
  digitalWrite(buzzer, LOW);
  puertaGeneral(false);
  lcd.print("podes escanear");
  slot1(false);
  slot2(false);
}

void multiple(String lista[4]) {
  int timeStart;
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
  lcd.print(listMsgLcd);
  while (true) {
    if(digitalRead(btnSlot1)==LOW || lista[1]=="0"){
      if(digitalRead(btnSlot2)==LOW || lista[2]=="0"){
        break;
      } 
    }
  }
  lcd.clear();
  lcd.print("por favor cierre la puerta");
  timeStart=millis();
      while (digitalRead(btnGral1)) {
        if (millis() - timeStart > 5000) {
          digitalWrite(buzzer, HIGH);
        }
      }
  lcd.clear();
  slot1(false);
  slot2(false);
  digitalWrite(buzzer, LOW);
  puertaGeneral(false);
  lcd.print("podes escanear");
}

void devolucion(String rfid) {
  int timeStart;
  Serial.println(rfid);
  lcd.clear();
  lcd.print("procesando ...");
  while (Serial.available() == 0) {
  }
  serialString = Serial.readStringUntil('\n');
  if (serialString == "1") {
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
        if (millis() - timeStart > 5000) {
          digitalWrite(buzzer, HIGH);
        }
      }
    puertaGeneral(false);
  } else if (serialString == "2") {
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
        if (millis() - timeStart > 5000) {
          digitalWrite(buzzer, HIGH);
        }
      }
    puertaGeneral(false);
  } else {
    lcd.print("computadora no reconozida");
    digitalWrite(buzzer, HIGH);
    delay(2000);
  }
  lcd.clear();
  puertaGeneral(false);
  lcd.print("podes escanear");
  digitalWrite(buzzer, LOW);
  slot1(false);
  slot2(false);
}


void loop() {
  serialString="";
  for(int i=0;i<4;i++){
    inputList[i]="";
  }
  digitalWrite(led_rojo, HIGH);
  puertaGeneral(false);
  if (Serial.available() > 0) {
    serialString = Serial.readStringUntil('\n');
    listTranslate(serialString, inputList);
    if (inputList[0] == "0") {
      unico(inputList);
    } else if (inputList[0] == "1") {
      multiple(inputList);
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
      devolucion(uidString);
      digitalWrite(led_rojo, LOW);
    }
  }
}
