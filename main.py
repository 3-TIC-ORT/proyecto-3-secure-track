import cv2
import time
import requests as req
import json
import serial

arduino = serial.Serial(port='COM5', baudrate=9600, timeout=.1) 


def sendRequest(data):
    payload={
        "TOKEN":data,
        "CARRO_ID":7
    }
    try:        
        res=req.put("https://secure-track-db.vercel.app/computers/withdrawal",json=payload, headers={'content-type': 'application/json'})
        if res.status_code==200:
            return res.json()
        else:
            return res.status_code
    except Exception as e:
        return(e) 

def enviarArduino(data):
    if data["type"]=="unico":
        res=["0"]+data["slots"]
    elif data["type"]=="devMultiple":
        res=["1"]+data["slots"]
    elif data["type"]=="retMultiple":
        res=["2"]+data["slots"]
    return (",".join(res))

def enviarSerial(data):
    arduino.write(data.encode())

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
        print(enviarSerial(enviarArduino(sendRequest(data))))
        time.sleep(2)
    time.sleep(0.02)
capture.release()
cv2.destroyAllWindows()
