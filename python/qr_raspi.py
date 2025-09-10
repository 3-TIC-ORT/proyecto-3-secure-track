import cv2
import time
import requests as req
import json
import serial
from pyzbar.pyzbar import decode
import numpy as np
import qrcode
from PIL import Image

# ---------------- PUERTO SERIAL ----------------
portWindows = "COM3"
portMac = "/dev/tty.usbserial-1130"

# Abrimos el puerto serial solo una vez
try:
    arduino = serial.Serial(port=portWindows, baudrate=9600, timeout=0.1)
except Exception as e:
    print(f"[ERROR] No se pudo abrir el puerto serial: {e}")
    arduino = None

carro = 132  # L211

# ---------------- FUNCIONES API ----------------
def sendRequestQR(data):
    payload = {"token": data, "cartId": carro, "rfid": ""}
    try:
        res = req.put(
            "https://secure-track-db.vercel.app/computers/withdrawal",
            json=payload,
            headers={"content-type": "application/json"},
            timeout=5
        )
        print(f"[API-QR] {res.status_code} -> {payload}")
        return res.json()
    except Exception as e:
        print(f"[ERROR API-QR] {e}")
        return {"type": "error", "error": ["api_qr"]}

def sendRequestRFID(data):
    payload = {"rfid": data, "cartId": carro, "token": ""}
    try:
        res = req.put(
            "https://secure-track-db.vercel.app/computers/withdrawal",
            json=payload,
            headers={"content-type": "application/json"},
            timeout=5
        )
        print(f"[API-RFID] {res.status_code} -> {payload}")
        if res.status_code == 200:
            return res.json()
        else:
            return {"type": "error", "error": [f"status_{res.status_code}"]}
    except Exception as e:
        print(f"[ERROR API-RFID] {e}")
        return {"type": "error", "error": ["api_rfid"]}

def sendRequestRfidAsignment(userId, rfid):
    payload = {"rfid": rfid, "userId": userId}
    try:
        res = req.post(
            "https://secure-track-db.vercel.app/users/register/rfid",
            json=payload,
            headers={"content-type": "application/json"},
            timeout=5
        )
        print(f"[API-RFID-ASSIGN] {res.status_code} -> {payload}")
        return res.json()
    except Exception as e:
        print(f"[ERROR API-RFID-ASSIGN] {e}")
        return {"type": "error", "error": ["api_assign"]}

# ---------------- FUNCIONES ARDUINO ----------------
def traducirArduino(data):
    try:
        if data.get("type") == "error":
            res = ["5"] + data.get("error", [])
        elif data.get("type") == "unico":
            slots = data.get("slots", [])
            if isinstance(slots, list):
                res = ["0"] + slots
            else:
                res = ["0", str(slots)]
        elif data.get("type") == "multiple":
            res = ["1"] + data.get("slots", [])
        else:
            res = ["5", "desconocido"]

        res = [str(x) for x in res]
        out = ",".join(res)
        print(f"[TRADUCIR] {out}")
        return out
    except Exception as e:
        print(f"[ERROR traducirArduino] {e} con data={data}")
        return "5,error"

def enviarSerial(data):
    if not arduino:
        print("[ERROR] Arduino no inicializado")
        return
    try:
        arduino.write(data.encode())
        print(f"[SERIAL OUT] {data}")
    except Exception as err:
        print(f"[ERROR enviarSerial] {err}")

# ---------------- CONFIGURAR CÁMARA ----------------
capture = cv2.VideoCapture(0)
capture.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)

# Ventana pantalla completa
cv2.namedWindow("webcam", cv2.WINDOW_NORMAL)
cv2.setWindowProperty("webcam", cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

# ---------------- GENERAR QR ----------------
qr_img = qrcode.make("https://secure-track.vercel.app")
qr_img = qr_img.resize((400, 400))  # tamaño del QR
qr_np = np.array(qr_img.convert("RGB"))[:, :, ::-1]  # PIL -> OpenCV BGR

# ---------------- LOOP PRINCIPAL ----------------
while True:
    try:
        ret, frame = capture.read()
        if not ret:
            print("[ERROR] No se pudo leer frame de la cámara")
            time.sleep(0.5)
            continue

        # Fondo blanco
        screen_h, screen_w = 1080, 1920
        display = np.ones((screen_h, screen_w, 3), dtype=np.uint8) * 255

        # Colores estilo web
        color_black = (30, 30, 30)      # Negro
        color_blue = (255, 99, 37)      # Azul (#2563EB exacto)

        # Texto principal - nombre del proyecto
        cv2.putText(display, "Secure", (100, 300),
                    cv2.FONT_HERSHEY_SIMPLEX, 3, color_black, 4, cv2.LINE_AA)
        cv2.putText(display, "Track", (100, 400),
                    cv2.FONT_HERSHEY_SIMPLEX, 3, color_blue, 4, cv2.LINE_AA)

        # Botón azul con el enlace
        cv2.rectangle(display, (100, 500), (600, 580), color_blue, -1)  
        cv2.putText(display, "secure-track.vercel.app", (120, 555),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

        # --- insertar el QR debajo del botón ---
        qr_y, qr_x = 620, 100
        h_qr, w_qr = qr_np.shape[:2]
        display[qr_y:qr_y+h_qr, qr_x:qr_x+w_qr] = qr_np

        # ---------- Cámara cuadrada con bordes redondeados + borde ----------
        cam_size = 700
        frame_resized = cv2.resize(frame, (cam_size, cam_size))

        # Crear máscara redondeada
        mask = np.zeros((cam_size, cam_size), dtype=np.uint8)
        cv2.rectangle(mask, (0, 0), (cam_size, cam_size), 255, -1)
        mask = cv2.GaussianBlur(mask, (15, 15), 10)

        # Aplicar máscara para redondear esquinas
        frame_bgr = frame_resized.copy()
        for c in range(3):
            frame_bgr[:, :, c] = cv2.bitwise_and(frame_resized[:, :, c], mask)

        # Agregar borde fino
        border_thickness = 5
        frame_with_border = cv2.copyMakeBorder(
            frame_bgr, border_thickness, border_thickness,
            border_thickness, border_thickness,
            cv2.BORDER_CONSTANT, value=(30, 30, 30)  # color del borde
        )

        # Posición de la cámara en pantalla
        h_fb, w_fb = frame_with_border.shape[:2]

        y_offset = (screen_h - h_fb) // 2
        x_offset = screen_w - w_fb - 100

        display[y_offset:y_offset+h_fb, x_offset:x_offset+w_fb] = frame_with_border


        # Mostrar pantalla
        cv2.imshow("webcam", display)

        if cv2.waitKey(1) == ord("q"):
            break

        # ------------------- DECODIFICAR QR -------------------
        try:
            decoded = decode(frame)
            data = decoded[0].data.decode("utf-8") if decoded else ""
        except Exception as e:
            print(f"[ERROR decode QR] {e}")
            data = ""

        if len(data) > 0:
            print(f"[QR DETECTADO] {data}")
            resp = sendRequestQR(data)
            enviarSerial(traducirArduino(resp))
            time.sleep(2)

        else:
            time.sleep(0.01)
            if arduino and arduino.in_waiting > 0:
                try:
                    rfid_data = arduino.readline().decode("utf-8").strip()
                    if rfid_data:
                        print(f"[RFID LEÍDO] {rfid_data}")
                        rfidResponse = sendRequestRFID(rfid_data)
                        try:
                            slots = rfidResponse.get("slots")
                            if slots and len(slots) > 0:
                                enviarSerial(traducirArduino(rfidResponse))
                            else:
                                enviarSerial("error")
                        except Exception:
                            try:
                                if rfidResponse.get("slots", 0) > 0:
                                    enviarSerial(traducirArduino(rfidResponse))
                                else:
                                    enviarSerial("error")
                            except Exception as e:
                                print(f"[ERROR procesando RFID] {e}")
                                enviarSerial("error")
                except Exception as e:
                    print(f"[ERROR lectura RFID] {e}")

    except Exception as e:
        print(f"[ERROR LOOP PRINCIPAL] {e}")
        time.sleep(0.5)

# ---------------- LIBERAR RECURSOS ----------------
capture.release()
cv2.destroyAllWindows()
