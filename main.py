import cv2
import time
import requests as req
import json

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
        print(sendRequest(data))
        time.sleep(2)
    time.sleep(0.002)
capture.release()
cv2.destroyAllWindows()
