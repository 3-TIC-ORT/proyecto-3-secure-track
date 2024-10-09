#include<Servo.h>
#include <List.hpp>
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
#include<SPI.h>
#include<MFRC522.h>

#define RFID_RST_PIN 49
#define RFID_SS_PIN 53
#define maxValores 5
#define ledSlot1 34
#define ledSlot2 36
#define btnSlot1 31
#define btnSlot2 33
#define btnGral1 22
#define btnGral2 24
#define buzzer 48
#define electroIman 41

LiquidCrystal_I2C lcd(0x27,20,4);
MFRC522 rfid(RFID_SS_PIN,RFID_RST_PIN);

Servo servoSlot1;
Servo servoSlot2;

List<String> inputList;
int timeStart;
String uidString="";

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  lcd.init();
  lcd.begin(16,2);
  lcd.backlight();
  lcd.setCursor(0,0);
  SPI.begin();
  rfid.PCD_Init();
  servoSlot1.attach(2);
  servoSlot2.attach(3);
  servoSlot1.write(0);
  servoSlot2.write(0);
  pinMode(ledSlot1, OUTPUT);
  pinMode(ledSlot2, OUTPUT);
  pinMode(btnSlot1, INPUT_PULLUP);
  pinMode(btnSlot2, INPUT_PULLUP);
  pinMode(btnGral1, INPUT_PULLUP);
  pinMode(btnGral2, INPUT_PULLUP);
  pinMode(buzzer, OUTPUT);
  pinMode(electroIman, OUTPUT);
  lcd.print("andando");
} 

List<String> listTranslate(String input){
  List<String> lista;
  String temp="";
  for(int i=0;i<input.length();i++){
    if(input[i]=="," && temp==""){
      continue;
    }else if(input[i]==","){
      lista.add(temp);
      temp="";
    }else{
      temp+=String(input[i]);
    }
  }
  lcd.print(lista[0]);
  return lista;
}

// pasarle a la funcion true es para abrir y false para cerrar

void slot1(bool state){
  if(state){
    servoSlot1.write(90);
    digitalWrite(ledSlot1, HIGH);
    lcd.clear();
    lcd.print("slot 1 abierto");
  }else{
    servoSlot1.write(0);
    digitalWrite(ledSlot1, LOW);
    lcd.clear();
    lcd.print("slot 1 cerrado");
  }
}
void slot2(bool state){
  if(state){
    servoSlot2.write(90);
    digitalWrite(ledSlot2, HIGH);
    lcd.clear();
    lcd.print("slot 2 abierto");
  }else{
    servoSlot2.write(0);
    digitalWrite(ledSlot2, LOW);
    lcd.clear();
    lcd.print("slot 2 cerrado");
  }
}

void general(bool state){
  if(state){
    digitalWrite(electroIman, HIGH);
  }else{
    digitalWrite(electroIman, LOW);
  }
}
void loop() {
  // put your main code here, to run repeatedly:
  if(Serial.available()>0){
    String input=Serial.readString();
    if(input=="error"){
      lcd.clear();
      lcd.print("error");
    }else{
      general(true);
      inputList=listTranslate(input);
      if(inputList[0]=="0"){
        bool state=digitalRead(btnGral1);
        switch(inputList[1].toInt()){
            case 1:
              slot1(true);
              while(digitalRead(btnSlot1)){}
              timeStart=millis();
              slot1(false);
              while(digitalRead(btnGral1)==state){
                lcd.clear();
                lcd.print("cerrar la puerta");
                if(timeStart+120000<=millis()){
                  digitalWrite(buzzer, HIGH);
                }else{
                  digitalWrite(buzzer, LOW);
                }
              }
              general(false);
              digitalWrite(buzzer, LOW);
              lcd.clear();
              break;
            case 2:
              slot2(true);
              while(digitalRead(btnSlot2)){
                
              }
              timeStart=millis();
              slot2(false);
              while(digitalRead(btnGral2) || digitalRead(btnGral1)){
                lcd.clear();
                lcd.print("cerrar la puerta");
                if(timeStart+120000<=millis()){
                  digitalWrite(buzzer, HIGH);
                }else{
                  digitalWrite(buzzer, LOW);
                }
              }
              general(false);
              digitalWrite(buzzer, LOW);
              lcd.clear();
              break;
          }
      }else if(inputList[0]=="2"){ // retiro
        general(true);
        inputList.remove(0);
        if(inputList[0].toInt()==1){
          slot1(true);
        }if(inputList[1].toInt()==2){
          slot2(true);
        }
        timeStart=millis();
        while(!((digitalRead(btnSlot1)==HIGH || inputList[0].toInt()==0) && (digitalRead(btnSlot2)==HIGH || inputList[1].toInt()==0))){
          
        }
        digitalWrite(buzzer, LOW);
        slot1(false);
        slot2(false);
        while(digitalRead(btnGral1) || digitalRead(btnGral2)){
          lcd.clear();
          lcd.print("cerrar la puerta");
          if(timeStart+120000<=millis()){
            digitalWrite(buzzer, HIGH);
          }else{
            digitalWrite(buzzer, LOW);
          }
        }
        general(false);
        lcd.clear();
      }else if(inputList[0]=="1"){ // devolucion
        lcd.clear();
        lcd.print("acerque la computadora al sensor");
        general(true);
        if(rfid.PICC_IsNewCardPresent()){
        if(rfid.PICC_ReadCardSerial()){
          String uidString="";
          for (byte i = 0; i < rfid.uid.size; i++) {
            uidString += String(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
            uidString += String(rfid.uid.uidByte[i], HEX);
          }
          for(int i=0; i<inputList.getSize();i++){
            if(inputList[i]==uidString){
              switch(i+1){
                case 1:
                  slot1(true);
                  lcd.clear();
                  lcd.print("guardar en slot 1");
                  while(digitalRead(btnSlot1)){

                  }
                  slot1(false);
                  lcd.clear();
                  break;
                case 2:
                  slot2(true);
                  lcd.clear();
                  lcd.print("guardar en slot 2");
                  while(digitalRead(btnSlot2)){

                  }
                  slot2(false);
                  lcd.clear();
                  break;
              }
            }
          }
          lcd.clear();
          lcd.print("cerrar la puerta porfavor");
          timeStart=millis(); 
          while(digitalRead(btnGral1) && digitalRead(btnGral2)){
            if(timeStart+120000==millis()){
              digitalWrite(buzzer, HIGH);
            }else{
              digitalWrite(buzzer, LOW);
            }
          }
          digitalWrite(buzzer, LOW);
          general(false);
          lcd.clear();
        }
      }
      }else{
        lcd.clear();
        lcd.print("error");
        for(int i=0; i<10;i++){
          digitalWrite(buzzer, HIGH);
          delay(250);
          digitalWrite(buzzer, LOW);
          delay(500);
        digitalWrite(buzzer, LOW);
        lcd.clear();
        }
      }
    }
  }
  Serial.print("done");
  lcd.clear();
}

// 0,1, --> se abre el slot 1 y se espera a que se presione el fin de carrera
// 1,c9d8aa48,0, --> se abre el slot 1 cunado acerco el rfid y espera a que se presione el fc
// 2,0,1, --> se abre el slot 2 y se espera a que se deje de presionar el fc