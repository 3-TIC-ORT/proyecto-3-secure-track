#include<Servo.h>
#include <List.hpp>
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27,20,4);
Servo servoSlot1;
Servo servoSlot2;
Servo servoSlot3;
Servo servoSlot4;
#define maxValores 5
#define ledSlot1 34
#define ledSlot2 36
#define ledSlot3 38
#define ledSlot4 40
#define btnSlot1 31
#define btnSlot2 33
#define btnSlot3 35
#define btnSlot4 37
#define btnGral1 22
#define btnGral2 24
#define buzzer 48
#define electroIman 41
List<String> inputList;
int timeStart;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  lcd.init();
  lcd.begin(16,2);
  lcd.backlight();
  lcd.setCursor(0,0);
  servoSlot1.attach(2);
  servoSlot2.attach(3);
  servoSlot3.attach(4);
  servoSlot4.attach(5);
  pinMode(ledSlot1, OUTPUT);
  pinMode(ledSlot2, OUTPUT);
  pinMode(ledSlot3, OUTPUT);
  pinMode(ledSlot4, OUTPUT);
  pinMode(btnSlot1, INPUT_PULLUP);
  pinMode(btnSlot2, INPUT_PULLUP);
  pinMode(btnSlot3, INPUT_PULLUP);
  pinMode(btnSlot4, INPUT_PULLUP);
  pinMode(btnGral1, INPUT_PULLUP);
  pinMode(btnGral2, INPUT_PULLUP);
  pinMode(buzzer, OUTPUT);
  pinMode(electroIman, OUTPUT);
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
void slot3(bool state){
  if(state){
    servoSlot3.write(90);
    digitalWrite(ledSlot3, HIGH);
    lcd.clear();
    lcd.print("slot 3 abierto");
  }else{
    servoSlot3.write(0);
    digitalWrite(ledSlot3, LOW);
    lcd.clear();
    lcd.print("slot 3 cerrado");
  }
}
void slot4(bool state){
  if(state){
    servoSlot4.write(90);
    digitalWrite(ledSlot4, HIGH);
    lcd.clear();
    lcd.print("slot 4 abierto");
  }else{
    servoSlot4.write(0);
    digitalWrite(ledSlot4, LOW);
    lcd.clear();
    lcd.print("slot 4 cerrado");
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
      if(inputList[0]=="unico"){
        switch(inputList[1].toInt()){
            case 1:
              slot1(true);
              while(digitalRead(btnSlot1)){
                
              }
              timeStart=millis();
              slot1(false);
              while(digitalRead(btnGral1) || digitalRead(btnGral2)){
                lcd.clear();
                lcd.print("cerrar la puerta");
                if(timeStart+120000<=millis()){
                  digitalWrite(buzzer, HIGH);
                }else{
                  digitalWrite(buzzer, LOW);
                }
              }
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
              lcd.clear();
              break;
            case 3:
              slot3(true);
              while(digitalRead(btnSlot3)){
                
              }
              timeStart=millis();
              slot3(false);
              while(digitalRead(btnGral1) || digitalRead(btnGral2)){
                lcd.clear();
                lcd.print("cerrar la puerta");
                if(timeStart+120000<=millis()){
                  digitalWrite(buzzer, HIGH);
                }else{
                  digitalWrite(buzzer, LOW);
                }
              }
              lcd.clear();
              break;
            case 4:
              slot4(true);
              while(digitalRead(btnSlot4)){
                
              }
              timeStart=millis();
              slot4(false);
              while(digitalRead(btnGral1) || digitalRead(btnGral2)){
                lcd.clear();
                lcd.print("cerrar la puerta");
                if(timeStart+120000<=millis()){
                  digitalWrite(buzzer, HIGH);
                }else{
                  digitalWrite(buzzer, LOW);
                }
              }
              lcd.clear();
              break;
          }
      }else if(inputList[0]=="retMultiple"){

      }else if(inputList[0]=="devMultiple"){

      }else{
        lcd.clear();
        lcd.print("error");
        for(int i=0; i<10;i++){
          digitalWrite(buzzer, HIGH);
          delay(250);
          digitalWrite(buzzer, LOW);
          delay(500);
        }
        digitalWrite(buzzer, LOW);
        lcd.clear();
      }
    }
  }
}