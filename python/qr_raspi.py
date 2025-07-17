import cv2
import time
import requests as req
import json
import serial
from pyzbar.pyzbar import decode

arduino = serial.Serial(port='COM4', baudrate=9600, timeout=.1)
carro=73 #  M 110
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
            return res.json()
        
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
        arduino.write(data.encode())
        print(f"Enviado al arduino: {data}") 
        while arduino.in_waiting <= 0:
            continue
        data = arduino.readline().decode('utf-8').strip() 
    except Exception as err:
        print("error: data={data}")
        print(err)

capture = cv2.VideoCapture(0)
qrDetector = cv2.QRCodeDetector()

while capture.isOpened():
    ret, frame = capture.read()
    cv2.imshow("webcam", frame) 
    
    if cv2.waitKey(1) == ord("q"):
        break

    try:
        # data, bbox, rectifiedImage = qrDetector.detectAndDecode(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)) --> opencv qr decode
        decoded=decode(frame)
        data = decoded[0].data.decode("utf-8") if decoded else "" # pyzbar qr decode
    except:
        data=[]
    
    try:
        userQr=int(data)
        print("qr detected: " + str(userQr))
        enviarSerial("registrando usuario\n")
        while arduino.in_waiting == 0:
            continue
        userRfid = arduino.readline().decode('utf-8').strip()
        print(sendRequestRfidAsignment(userQr, userRfid))

    except Exception as err:
        if len(data) > 0:  
            print(f"QR Code detected: {data}")
            enviarSerial(traducirArduino(sendRequestQR(data)))
            time.sleep(2)  
        
        time.sleep(0.01)
        if arduino.in_waiting > 0:
            data = arduino.readline().decode('utf-8').strip() 
            print(f"RFID leído: {data}")
            rfidResponse = sendRequestRFID(data)
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
capture.release()
cv2.destroyAllWindows()
