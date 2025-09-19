import cv2
import time
import requests as req
import serial
import serial.tools.list_ports
from pyzbar.pyzbar import decode
import numpy as np
import qrcode
from PIL import Image

# ---------------- DETECCIÓN DE PUERTO ----------------
arduino = None
arduino_port = None

def detectarPuertoArduino():
    """
    Detecta el puerto serie donde está conectado el Arduino.
    Retorna el nombre del puerto (ej: 'COM4' o '/dev/ttyUSB0') o None si no lo encuentra.
    """
    puertos = serial.tools.list_ports.comports()
    for puerto in puertos:
        desc = puerto.description.lower()
        if "arduino" in desc or "ch340" in desc or "usb serial" in desc:
            print(f"[INFO] Arduino detectado en {puerto.device}")
            return puerto.device
    print("[WARN] No se detectó Arduino automáticamente")
    return None

def conectarArduino():
    """Intenta conectar/reconectar el Arduino en cualquier puerto disponible"""
    global arduino, arduino_port
    if arduino and arduino.is_open:
        return arduino
    
    # Buscar un puerto válido siempre
    nuevo_puerto = detectarPuertoArduino()
    if not nuevo_puerto:
        arduino_port = None
        arduino = None
        return None
    
    # Si cambió de puerto, actualizamos
    if nuevo_puerto != arduino_port:
        print(f"[INFO] Arduino movido de {arduino_port} a {nuevo_puerto}")
        arduino_port = nuevo_puerto

    try:
        arduino = serial.Serial(port=arduino_port, baudrate=9600, timeout=0.1)
        time.sleep(2)  # tiempo para que Arduino reinicie
        arduino.reset_input_buffer()
        print(f"[INFO] Arduino conectado en {arduino_port}")
    except Exception as e:
        print(f"[WARN] No se pudo abrir {arduino_port}: {e}")
        arduino = None
    
    return arduino

def leerDesdeArduino():
    """Lee una línea del Arduino, reintentando tras reconexión"""
    global arduino
    if not conectarArduino():
        return None
    try:
        if arduino.in_waiting > 0:
            return arduino.readline().decode("utf-8").strip()
    except Exception as e:
        print(f"[ERROR lectura Arduino] {e}")
        try:
            arduino.close()
        except:
            pass
        arduino = None
    return None

# ---------------- VARIABLES ----------------
carro = 92  # L211

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
    global arduino
    if not conectarArduino():
        print("[ERROR] Arduino no disponible")
        return
    try:
        arduino.write(data.encode())
        print(f"[SERIAL OUT] {data}")
    except Exception as err:
        print(f"[ERROR enviarSerial] {err}")
        try:
            arduino.close()
        except:
            pass
        arduino = None  # fuerza reconexión

# ---------------- CONFIGURAR CÁMARA ----------------
capture = cv2.VideoCapture(1)
capture.set(cv2.CAP_PROP_FRAME_WIDTH, 1920)
capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 1080)

cv2.namedWindow("webcam", cv2.WINDOW_NORMAL)
cv2.setWindowProperty("webcam", cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

# ---------------- GENERAR QR ----------------
qr_img = qrcode.make("https://secure-track.vercel.app")
qr_img = qr_img.resize((400, 400)) 
qr_np = np.array(qr_img.convert("RGB"))[:, :, ::-1]

# ---------------- LOOP PRINCIPAL ----------------
while True:
    try:
        ret, frame = capture.read()
        if not ret:
            print("[ERROR] No se pudo leer frame de la cámara")
            time.sleep(0.5)
            continue

        conectarArduino()  # reconectar si hace falta

        # Fondo blanco
        screen_h, screen_w = 1080, 1920
        display = np.ones((screen_h, screen_w, 3), dtype=np.uint8) * 255

        color_black = (30, 30, 30)
        color_blue = (255, 99, 37)

        cv2.putText(display, "Secure", (100, 300),
                    cv2.FONT_HERSHEY_SIMPLEX, 3, color_black, 4, cv2.LINE_AA)
        cv2.putText(display, "Track", (100, 400),
                    cv2.FONT_HERSHEY_SIMPLEX, 3, color_blue, 4, cv2.LINE_AA)

        cv2.rectangle(display, (100, 500), (600, 580), color_blue, -1)  
        cv2.putText(display, "secure-track.vercel.app", (120, 555),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

        qr_y, qr_x = 620, 100
        h_qr, w_qr = qr_np.shape[:2]
        display[qr_y:qr_y+h_qr, qr_x:qr_x+w_qr] = qr_np

        cam_size = 700
        frame_resized = cv2.resize(frame, (cam_size, cam_size))

        mask = np.zeros((cam_size, cam_size), dtype=np.uint8)
        cv2.rectangle(mask, (0, 0), (cam_size, cam_size), 255, -1)
        mask = cv2.GaussianBlur(mask, (15, 15), 10)

        frame_bgr = frame_resized.copy()
        for c in range(3):
            frame_bgr[:, :, c] = cv2.bitwise_and(frame_resized[:, :, c], mask)

        border_thickness = 5
        frame_with_border = cv2.copyMakeBorder(
            frame_bgr, border_thickness, border_thickness,
            border_thickness, border_thickness,
            cv2.BORDER_CONSTANT, value=(30, 30, 30)
        )

        h_fb, w_fb = frame_with_border.shape[:2]
        y_offset = (screen_h - h_fb) // 2
        x_offset = screen_w - w_fb - 100
        display[y_offset:y_offset+h_fb, x_offset:x_offset+w_fb] = frame_with_border

        cv2.imshow("webcam", display)

        if cv2.waitKey(1) == ord("q"):
            break

        # --- Lectura QR ---
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
            # --- Lectura RFID desde Arduino ---
            rfid_data = leerDesdeArduino()
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
        print(f"[ERROR LOOP PRINCIPAL] {e}")
        time.sleep(0.5)

# ---------------- LIBERAR RECURSOS ----------------
capture.release()
cv2.destroyAllWindows()
