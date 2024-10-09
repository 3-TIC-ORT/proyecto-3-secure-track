const text = document.getElementById("text");
const user = sessionStorage.getItem("correctKey");
const qr = document.getElementById("qr");
const timerDisplay = document.getElementById("time"); 
const parsedRes = JSON.parse(user);
const finalizar = document.getElementById("finalizar")


finalizar.addEventListener("click",async()=>{
    let data = await fetch(`https://secure-track-db.vercel.app/verificar`,{
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body:{
            token: JSON.parse(user).tokenId
        }
     })

     if (await data.json().verificado) {
        location.href = "../selectorItems.html"
     }else{
        console.log("No")
     }
})

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




function iniciarQrTimer() {
    if (user) {
        const parsedRes = JSON.parse(user); 

        let img = document.createElement("img");
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(parsedRes.tokenId)}`;
        qr.appendChild(img);

        text.innerText = `El slot para el retiro es el ${parsedRes.slot}`;

        let tiempo = 3000; // segundos
        startTimer(tiempo, timerDisplay, onTimerFinish);
    } else {
        text.innerText = "No se ha encontrado un slot disponible.";
    }
}

window.onload = function () {
    iniciarQrTimer();}