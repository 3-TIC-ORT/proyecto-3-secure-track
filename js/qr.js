const text = document.getElementById("text")    
const res = sessionStorage.getItem("correctKey")
const qr = document.getElementById("qr");
const timerDisplay = document.getElementById("time");
const result = await response.json();
const modalMessage = document.getElementById("modal-message")

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
        modalMessage.innerText = `Se termino tu timepo, por favor selecciona nuevamente tus preferencias :)`;
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



window.onload = function () {
    let fiveMinutes = 3;
    startTimer(fiveMinutes, timerDisplay, onTimerFinish);
};

let img = document.createElement("img")
img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(JSON.parse(res).tokenId)}`
qr.appendChild(img)
text.innerText = `El slot para el retiro es el ${JSON.parse(res).slot}`