import cv2
import time
import requests as req
import serial
from pyzbar.pyzbar import decode
from flask import Flask,request,jsonify
import numpy as np

app = Flask(__name__)

@app.route('/qr/detect/', methods=['POST'])
def detect():
    if 'imagen' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    imagen = request.files['imagen'].read()
    npimg = np.frombuffer(imagen, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    detector = cv2.QRCodeDetector()
    _, points, _ = detector.detectAndDecode(img)

    if points is not None:
        return jsonify({"detected": "true"}), 200
    else:
        return jsonify({"detected": "false"}), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5000, debug=True)


arduino = serial.Serial(port='/dev/tty.usbserial-1130', baudrate=9600, timeout=0.1)
carro=132 #  L211

def sendRequestQR(data):
    payload = {
        "token": data,
        "cartId": carro,
        "rfid":""
    }
    try:
        res = req.put("https://secure-track-db.vercel.app/computers/withdrawal", json=payload, headers={'content-type': 'application/json'})
        print(res.status_code)
        print(payload)
        if res.status_code == 200: 
            return res.json()
        else:
            return res.json()
    except Exception as e:
        print(e)

def sendRequestRFID(data):
    payload = {
        "rfid": data,
        "cartId": carro,
        "token":""

    }
    try:
        res = req.put("https://secure-track-db.vercel.app/computers/withdrawal", json=payload, headers={'content-type': 'application/json'})
        print(res.status_code)
        print(payload)
        if res.status_code == 200:
            return res.json() 
        else:
            return res.status_code
        
        
    except Exception as e:
        print(e)

def sendRequestRfidAsignment(userId, rfid):
    payload = {
        "rfid": rfid,
        "userId":userId

    }
    try:
        res = req.post("https://secure-track-db.vercel.app/users/register/rfid", json=payload, headers={'content-type': 'application/json'})
        print(res.status_code)
        print(payload)
        if res.status_code == 200:
            return res.json() 
        else:
            return res.json()
        
    except Exception as e:
        print(e)

def traducirArduino(data):
    try:
        if data["type"]=="error":
            res=["5"]+data["error"]
        if data["type"]=="unico":
            try:
                res=["0"]+data["slots"]
            except TypeError:
                res=["0"]+[data["slots"]]
        elif data["type"]=="multiple":
            res=["1"]+data["slots"]
        for i in range(len(res)):
            res[i]=str(res[i])
        print(",".join(res))
        return (",".join(res))
    except:
        print(data)


def enviarSerial(data):
    try:    
        arduino = serial.Serial(port='/dev/tty.usbserial-1130', baudrate=9600, timeout=0.1)
        arduino.write(data.encode())
        print(f"Enviado al arduino: {data}") 
        data = arduino.readline().decode('utf-8').strip() 
    except Exception as err:
        print(f"error: data={data}")
        print(err)

while True:
    time.sleep(0.01)
    if arduino.in_waiting > 0:
        data = arduino.readline().decode('utf-8').strip() 
        print(f"RFID leído: {data}")
        rfidResponse = sendRequestRFID(data)
        if type(rfidResponse)==int:
            print('imposible guardar una compu que esta dentro del carro')
            print(f"status code = {rfidResponse}")
            enviarSerial("error")
        else:
            try:
                if len(rfidResponse.get("slots"))>0:
                    enviarSerial(traducirArduino(rfidResponse))
                else:
                    enviarSerial("error") 
            except TypeError:
                if rfidResponse.get("slots")>0:
                    enviarSerial(traducirArduino(rfidResponse))
                else:
                    enviarSerial("error") 