import cv2
import time
import requests as req
import json
import serial

arduino = serial.Serial(port='COM10', baudrate=9600, timeout=.1)
carro=1
def sendRequestQR(data):
    payload = {
        "token": data,
        "cartId": carro
    }
    try:
        res = req.put("https://secure-track-db.vercel.app/computers/withdrawal", json=payload, headers={'content-type': 'application/json'})
        print(res.status_code)
        if res.status_code == 200: 
            return res.json()
        else:
            return {"type": "error"} 
    except Exception as e:
        print(f"Error en la petición QR: {e}")
        return {"type": "error"}

def sendRequestRFID(data):
    payload = {
        "rfid": data,
        "cartId": carro
    }
    try:
        res = req.put("https://secure-track-db.vercel.app/professor/return", json=payload, headers={'content-type': 'application/json'})
        print(res.status_code)
        if res.status_code == 200:
            return res.json() 
        else:
    except Exception as e:
        print(f"Error en la petición RFID: {e}")
        return {"type": "error"}

def traducirArduino(data):
    if data["type"]=="error":
        return "error"
    if data["type"]=="unico":
        res=["0"]+data["slots"]
    elif data["type"]=="multiple":
        res=["1"]+data["slots"]
    for i in range(len(res)):
        res[i]=str(res[i])
    print(",".join(res))
    return (",".join(res))

def enviarSerial(data):
    arduino.write(data.encode())
    print(f"Enviado al arduino: {data}") 

capture = cv2.VideoCapture(0)
qrDetector = cv2.QRCodeDetector()

while capture.isOpened():
    cv2.imshow("webcam", frame) 
    
    if cv2.waitKey(1) == ord("q"):
        break

    data, bbox, rectifiedImage = qrDetector.detectAndDecode(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY))
    if len(data) > 0:  
        print(f"QR Code detected: {data}")
        enviarSerial(traducirArduino(sendRequestQR(data)))
        time.sleep(2)  
    
    time.sleep(0.02)

    if arduino.in_waiting > 0:
        data = arduino.readline().decode('utf-8').strip() 
        print(f"RFID leído: {data}")
        rfidResponse = sendRequestRFID(data)
        if rfidResponse.get("valid", False): 
            enviarSerial(str(rfidResponse.get("slot", "error"))) 
        else:
            enviarSerial("error") 
capture.release()
cv2.destroyAllWindows()
