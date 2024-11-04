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
#define electroIman 41
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
  pinMode(led_rojo, OUTPUT);
  pinMode(btnSlot1, INPUT_PULLUP);
  pinMode(btnSlot2, INPUT_PULLUP);
  pinMode(btnSlot3, INPUT_PULLUP);
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
void slot3(bool state) {
  if (state) {
    servoSlot3.write(90);
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

void unico(String lista[5]) {
  int timeStart;
  switch (lista[1].toInt()) {
    case 1:
      stateStart = digitalRead(btnSlot1);
      slot1(true);
      puertaGeneral(true);
      lcd.clear();
      lcd.print("slot 1 abierto");
      while (stateStart == digitalRead(btnSlot1)) {}
      lcd.clear();
      lcd.print("por favor cierre la puerta");
      timeStart = millis();
      while (digitalRead(btnGral1)) {
        if (millis() - timeStart > 5000) {
          digitalWrite(buzzer, HIGH);
        } else { 
          digitalWrite(buzzer, LOW);
        }
      }
      digitalWrite(buzzer, LOW);
      puertaGeneral(false);
      break;
    case 2:
      stateStart = digitalRead(btnSlot2);
      slot2(true);
      puertaGeneral(true);
      lcd.clear();
      lcd.print("slot 2 abierto");
      while (stateStart == digitalRead(btnSlot2)) {}
      lcd.clear();
      lcd.print("por favor cierre la puerta");
      timeStart = millis();
      while (digitalRead(btnGral1)) {
        if (millis() - timeStart > 5000) {
          digitalWrite(buzzer, HIGH);
        } else { 
          digitalWrite(buzzer, LOW);
        }
      }
      digitalWrite(buzzer, LOW);
      puertaGeneral(false);
      break;
    case 3:
      stateStart = digitalRead(btnSlot3);
      slot3(true);
      puertaGeneral(true);
      lcd.clear();
      lcd.print("slot 3 abierto");
      while (stateStart == digitalRead(btnSlot3)) {}
      lcd.clear();
      lcd.print("por favor cierre la puerta");
      timeStart = millis();
      while (digitalRead(btnGral1)) {
        if (millis() - timeStart > 5000) {
          digitalWrite(buzzer, HIGH);
        } else { 
          digitalWrite(buzzer, LOW);
        }
      }
      digitalWrite(buzzer, LOW);
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
  slot3(false);
}

void multiple(String lista[5]) {
  int timeStart;
  puertaGeneral(true);
  lcd.clear();
  lcd.setCursor(0, 0);
  listMsgLcd = "";
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
  while (true) {
    if (digitalRead(btnSlot1) == LOW || lista[1] == "0") {
      if (digitalRead(btnSlot2) == LOW || lista[2] == "0") {
        if (digitalRead(btnSlot3) == LOW || lista[3] == "0") {
          break;
        }
      }
    }
  }
  lcd.clear();
  lcd.print("por favor cierre la puerta");
  timeStart = millis();
  while (digitalRead(btnGral1)) {
    if (millis() - timeStart > 5000) {
      digitalWrite(buzzer, HIGH);
    } else { 
      digitalWrite(buzzer, LOW);
    }
  }
  digitalWrite(buzzer, LOW);
  
  slot1(false);
  slot2(false);
  slot3(false);
  lcd.clear();
  digitalWrite(buzzer, LOW);
  puertaGeneral(false);
  lcd.print("podes escanear");
}

void devolucion(String rfid) {
  int timeStart;
  Serial.println(rfid);
  lcd.clear();
  lcd.print("procesando ...");
  while (Serial.available() == 0) {}
  serialString = Serial.readStringUntil('\n');
  if (serialString == "1") {
    stateStart = digitalRead(btnSlot1);
    slot1(true);
    puertaGeneral(true);
    lcd.clear();
    lcd.print("slot 1 abierto");
    while (stateStart == digitalRead(btnSlot1)) {}
    lcd.clear();
    lcd.print("por favor cierre la puerta");
    timeStart = millis();
    while (digitalRead(btnGral1)) {
      if (millis() - timeStart > 5000) {
        digitalWrite(buzzer, HIGH);
      } else { 
        digitalWrite(buzzer, LOW);
      }
    }
    digitalWrite(buzzer, LOW);
    puertaGeneral(false);
  } else if (serialString == "2") {
    stateStart = digitalRead(btnSlot2);
    slot2(true);
    puertaGeneral(true);
    lcd.clear();
    lcd.print("slot 2 abierto");
    while (stateStart == digitalRead(btnSlot2)) {}
    lcd.clear();
    lcd.print("por favor cierre la puerta");
    timeStart = millis();
    while (digitalRead(btnGral1)) {
        if (millis() - timeStart > 5000) {
        digitalWrite(buzzer, HIGH);
        } else { 
        digitalWrite(buzzer, LOW);
        }
    }
    digitalWrite(buzzer, LOW);
    puertaGeneral(false);
    } else if (serialString == "3") {
    stateStart = digitalRead(btnSlot3);
    slot3(true);
    puertaGeneral(true);
    lcd.clear();
    lcd.print("slot 3 abierto");
    while (stateStart == digitalRead(btnSlot3)) {}
    lcd.clear();
    lcd.print("por favor cierre la puerta");
    timeStart = millis();
    while (digitalRead(btnGral1)) {
      if (millis() - timeStart > 5000) {
        digitalWrite(buzzer, HIGH);
      } else { 
        digitalWrite(buzzer, LOW);
      }
    }
    digitalWrite(buzzer, LOW);
    puertaGeneral(false);
  } else {
    lcd.clear();
    lcd.print("no se encontro slot");
    digitalWrite(buzzer, HIGH);
    delay(1000);
    digitalWrite(buzzer, LOW);
  }
  lcd.clear();
  digitalWrite(buzzer, LOW);
  puertaGeneral(false);
  lcd.print("podes escanear");
  slot1(false);
  slot2(false);
  slot3(false);
}

void loop() {
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    uidString = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      uidString += String(rfid.uid.uidByte[i], HEX);
    }
    Serial.println(uidString);
    lcd.clear();
    lcd.print("procesando ...");
    while (Serial.available() == 0) {}
    serialString = Serial.readStringUntil('\n');
    listTranslate(serialString, inputList);
    if (inputList[0] == "u") {
      unico(inputList);
    } else if (inputList[0] == "m") {
      multiple(inputList);
    } else if (inputList[0] == "d") {
      devolucion(uidString);
    } else {
      lcd.clear();
      lcd.print("Accion no definida");
      digitalWrite(buzzer, HIGH);
      delay(1000);
      digitalWrite(buzzer, LOW);
      lcd.clear();
    }
    rfid.PICC_HaltA();
  }
}
