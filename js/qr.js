const text = document.getElementById("text");
const res = sessionStorage.getItem("correctKey");
const user = sessionStorage.getItem("userId");
const qr = document.getElementById("qr");
const timerDisplay = document.getElementById("time"); 
const parsedRes = JSON.parse(user);
const finalizar = document.getElementById("finalizar")
const modal= document.getElementById("modal")
const closeModal= document.getElementById("closeModal")


finalizar.addEventListener("click",async()=>{

    let data = await fetch(`https://secure-track-db.vercel.app/verificar`,{
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body:JSON.stringify({
            token: (JSON.parse(res).tokenId)
        })
     })

     if (await data.status === 200) {
        sessionStorage.removeItem("correctKey")
        if (sessionStorage.getItem("status") === "En proceso") {
            sessionStorage.setItem("status", "Retirada")
            
        }else{
            sessionStorage.setItem("status", "Devuelta")
        }
        location.href = "../selectorItems.html"
     }else{
        modal.style.display = "block"
     }
})
closeModal.addEventListener("click", close)

function close() {
    modal.style.display = "none";
}

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
            callback(); 
        }
    }, 1000);
}

function onTimerFinish() {
    alert("Se ha acabado tu tiempo, por favor vuelve a seleccionar");
    location.href = "../selectorItems.html"; 
}




async function onTimer() {
    loadingScreen.style.display = "flex";

let data = await fetch("https://secure-track-db.vercel.app/computers/time",
{
    method: "POST",
    mode: "cors",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        token: JSON.parse(res).tokenId,
    }),
}
)
loadingScreen.style.display = "none";

if ((await data).status === 200) {
    let horario = await data.json();
    console.log(horario)
    horario = 300 - horario.time
    startTimer(horario, timerDisplay, ()=>{onTimer(); location.href = "../selectorItems.html"});
}else if ((await data).status === 201) {
    

    let horario = await data.json();
    timer.innerText = horario
    
}else{
    if (parseInt(res.tokenId)=== null) {
          location.href = "../selectorItems.html"
    }
}

}

// Iniciar el temporizador con 5 minutos
window.onload = async function () {
if (!user) {
location.href = "../accesodenegado.html"
}
onTimer()
};

let img = document.createElement("img")
img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(JSON.parse(res).tokenId)}`
qr.appendChild(img)
text.innerText = `El slot para el retiro es el ${JSON.parse(res).slot}`


