    let text = document.getElementById("text")    
    let res = localStorage.getItem("correctKey")

    let qr = document.getElementById("qr");
    let timerDisplay = document.getElementById("time");

    // Función para manejar el temporizador
    function startTimer(duration, display, callback) {
        let timer = duration, minutes, seconds;
        let interval = setInterval(function () {
            minutes = Math.floor(timer / 60);
            seconds = timer % 60;

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(interval);
                callback(); // Ejecutar la función cuando el tiempo llegue a 0
            }
        }, 1000);
    }

    // Función que se ejecuta cuando el temporizador termina
    async function onTimerFinish() {
        try {
            const response = await fetch(
                `https://secure-track-db.vercel.app/computers/delete`,
                {
                    method: "DELETE",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token: JSON.parse(res).tokenId,
                    }),
                }
            );
            const result = await response.json();
            let modalMessage = document.getElementById("modal-message")
            modalMessage.innerText = `El tiempo ha terminado. Respuesta: ${result.message}`;
            modal.style.display = "flex"; 
        } catch (error) {
            modalMessage.innerText = `Error: ${error.message}`;
            modal.style.display = "flex"; 
        }
    }
document.getElementById("close-btn").addEventListener("click", closeModal)
    function closeModal() {
        modal.style.display = "none";
    }


    // Iniciar el temporizador con 5 minutos
    window.onload = function () {
        let fiveMinutes = 5;
        startTimer(fiveMinutes, timerDisplay, onTimerFinish);
    };
    
    let img = document.createElement("img")
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(JSON.parse(res).tokenId)}`
    qr.appendChild(img)
    text.innerText = `El slot para el retiro es el ${JSON.parse(res).slot}`
