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
#define buzzer 48
#define electroIman 41

LiquidCrystal_I2C lcd(0x27,20,4);
MFRC522 rfid(RFID_SS_PIN,RFID_RST_PIN);
Servo servoSlot1;
Servo servoSlot2;


List<String> inputList;
int timeStart;
bool stateStart;
String uidString="";
String serialString="";
String listMsgLcd="";

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
  pinMode(ledSlot1, OUTPUT);
  pinMode(ledSlot2, OUTPUT);
  pinMode(btnSlot1, INPUT_PULLUP);
  pinMode(btnSlot2, INPUT_PULLUP);
  pinMode(btnGral1, INPUT_PULLUP);
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


void slot1(bool state){
  if(state){
    servoSlot1.write(90);
    digitalWrite(ledSlot1, HIGH);
  }else{
    servoSlot1.write(0);
    digitalWrite(ledSlot1, LOW);


  }
}
void slot2(bool state){
  if(state){
    servoSlot2.write(90);
    digitalWrite(ledSlot2, HIGH);
  }else{
    servoSlot2.write(0);
    digitalWrite(ledSlot2, LOW);
  }
}


void puertaGeneral(bool state){
  if(state){
    digitalWrite(electroIman, HIGH);
  }else{
    digitalWrite(electroIman, LOW);
  }
}


void unico(List<String> lista){
    switch(lista[1]){
        case 1:
            stateStart=digitalRead(btnSlot1);
            slot1(true);
            puertaGeneral(true);
            lcd.clear();
            lcd.print("slot 1 abierto");
            while(stateStart==digitalRead(btnSlot1)){

            }
            timeStart=millis();
            lcd.clear();
            lcd.print("por favor cierre la puerta");
            while(digitalRead(btnGral1)){
                if (millis()>timeStart+30000){
                    digitalWrite(buzzer, HIGH);
                }else{
                    digitalWrite(buzzer, LOW);
                }
            }
            puertaGeneral(false);
            break;
        case 2:
            stateStart=digitalRead(btnSlot2);
            slot2(true);
            puertaGeneral(true);
            lcd.clear();
            lcd.print("slot 2 abierto");
            while(stateStart==digitalRead(btnSlot2)){


            }
            timeStart=millis();
            lcd.clear();
            lcd.print("por favor cierre la puerta");
            while(digitalRead(btnGral1)){
                if (millis()>timeStart+30000){
                    digitalWrite(buzzer, HIGH);
                }else{
                    digitalWrite(buzzer, LOW);
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
    slot1(false);
    slot2(false);
}

void multiple(List<String> lista){
    puertaGeneral(true);
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Slots abiertos:");
    if(lista[1]==1){
      slot1(true);
      listMsgLcd+="1 ";
    }if(lista[2]==1){
      slot2(true);
      listMsgLcd+="2 ";
    }
    lcd.print(listMsgLcd);
    while((digitalRead(btnSlot1)==HIGH||lista[1]==1)||(digitalRead(btnSlot2)==HIGH||lista[2]==1)){
      
    }
    timeStart=millis();
    while(!(digitalRead(btnGral1))){
      if(timeStart+40000<=millis()){
        digitalWrite(buzzer, HIGH);
        lcd.print("por favor cierre la puerta")
      }
    }
    lcd.clear()
    slot1(false);
    slot2(false);
    digitalWrite(buzzer, LOW);
    puertaGeneral(false);
}

void devolucion(String rfid){
  Serial.print(rfid);
  while(Serial.available()==0){

  }
  serialString=Serial.readStringUntil('\n');
  // analizar la respuesta de back
}


void loop(){
  digitalWrite(led_rojo, HIGH);
  if(Serial.available()>0){
    serialString=Serial.readStringUntil('\n');
    inputList=listTranslate(serialString);
    if(inputList[0]=="0"){
      unico(inpuList);
    }else if(inputList[0]=="1"){
      multiple(inputList);
    }
  }if(rfid.PICC_IsNewCardPresent()){
    if(rfid.PICC_ReadCardSerial()){
      uidString="";
      for (byte i = 0; i < rfid.uid.size; i++) {
        uidString += String(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
        uidString += String(rfid.uid.uidByte[i], HEX);
      }
      devolucion(uidString);
  digitalWrite(led_rojo, LOW);
}
