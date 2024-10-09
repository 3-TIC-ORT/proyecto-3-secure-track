import cv2
import time
import requests as req
import json
import serial


arduino = serial.Serial(port='COM5', baudrate=9600, timeout=.1)


def sendRequestQR(data):
    payload={
        "TOKEN":data,
        "CARRO_ID":7
    }
    try:        
        res=req.put("https://secure-track-db.vercel.app/computers/withdrawal",json=payload, headers={'content-type': 'application/json'})
        if res.status_code==200:
            return res.json()
        else:
            return {
                "type":"error"
                }
    except Exception as e:
        return {
                "type":"error"
                }


def sendRequestRFID(data):
    payload={
        "RFID":data,
        "CARRO_ID":7
    }
    try:        
        res=req.put("https://secure-track-db.vercel.app/computers/withdrawal",json=payload, headers={'content-type': 'application/json'})
        if res.status_code==200:
            return res.json()
        else:
            return {
                "type":"error"
                }
    except Exception as e:
        return {
                "type":"error"
                }


def enviarArduino(data):
    if data["type"]=="error":
        return "error"
    if data["type"]=="unico":
        res=["0"]+data["slots"]
    elif data["type"]=="devMultiple":
        res=["1"]+data["slots"]
    elif data["type"]=="retMultiple":
        res=["2"]+data["slots"]
    return (",".join(res)+",")


def enviarSerial(data):
    arduino.write(data.encode())
    printf"data sended ${data}"
    recived=arduino.readLine()
    while(recived==""):
        continue
    if(recived=="done"):
        print("done")

capture = cv2.VideoCapture(0)
qrDetector = cv2.QRCodeDetector()
while capture.isOpened():
    ret, frame = capture.read()
    cv2.imshow("webcam", frame)
    if cv2.waitKey(1) == ord("q"):
        break
    data, bbox, rectifiedImage = qrDetector.detectAndDecode(frame)
    if len(data) > 0:
        print(f"QR Code detected: {data}")
        print(enviarSerial(enviarArduino(sendRequestQR(data))))
        time.sleep(2)
    time.sleep(0.02)
    if arduino.in_waiting > 0:
            data = arduino.readline().decode('utf-8').strip()  # Lee los datos y decodifica
            rfidResponse=sendRequestRFID(data)
            if(rfidResponse[valid]==True){
                enviarSerial(rfidResponse[slot])
            }else{
                enviarSerial("error")
            }
capture.release()
cv2.destroyAllWindows()