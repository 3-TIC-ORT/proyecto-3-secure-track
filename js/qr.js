    const text = document.getElementById("text");
    const res = sessionStorage.getItem("correctKey");
    const user = sessionStorage.getItem("userId");
    const qr = document.getElementById("qr");
    const timerDisplay = document.getElementById("time");
    const finalizar = document.getElementById("finalizar");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("closeModal");
    const modalMessage = document.getElementById("modal-message");
    const loadingScreen = document.getElementById("loadingScreen");

    const parsedRes = res ? JSON.parse(res) : null;

    // Place the rest of your JavaScript code here...
 

finalizar.addEventListener("click", async () => {
    console.log(parsedRes.tokenId)
    try {
        let data = await fetch(`https://secure-track-db.vercel.app/verificar`, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: parsedRes.tokenId }) 
        });

       let info = await data.json()
       if (info.verificado) {
        location.href = "./selectorItems.html"
       }else{
        document.getElementById("error").innerText = "El qr no ha sido utilizado"
       }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

closeModal.addEventListener("click", closeModalHandler);

function closeModalHandler() {
    modal.style.display = "none";
}

function startTimer(duration, display, callback) {
    let timer = duration, minutes, seconds;
    let interval = setInterval(function () {
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.innerText =   "El QR estará disponible por " + minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            callback();
        }
    }, 1000);
}

async function onTimerFinish() {
   
    modalMessage.textContent = "Se ha acabado tu tiempo, por favor vuelve a seleccionar";
    modal.style.display = "block"; 
}

async function onTimer() {
    try {
        loadingScreen.style.display = "flex";

        let data = await fetch("https://secure-track-db.vercel.app/computers/time", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: parsedRes?.tokenId })
        });

        loadingScreen.style.display = "none";

        if (data.status === 200) {
            let horario = await data.json();
            console.log(horario);

            let hola = document.getElementById("hola");
            hola.innerText = `El QR estará disponible por`    

            startTimer(300 - horario.time, hola, () => {
                onTimerFinish();
            });
        } else {
                location.href = "../selectorItems.html";
            
        }
    } catch (error) {
        console.error("Error in onTimer:", error);
        loadingScreen.style.display = "none";
    }
}

if (!user) {
    location.href = "../accesodenegado.html";
}

window.onload = async function () {
    try {
        loadingScreen.style.display = "flex";

        let img = document.createElement("img");
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(parsedRes?.tokenId)}`;
        qr.appendChild(img);

        text.innerText = `El slot para el retiro es el ${parsedRes?.slots}`;
        onTimer();
    } catch (error) {
        console.error("Error on window load:", error);
    } finally {
        loadingScreen.style.display = "none";
    }
};


