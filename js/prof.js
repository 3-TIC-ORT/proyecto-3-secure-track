// if (!sessionStorage.getItem("Prof-Key")) {
//     window.location.href = "../accesoDenegado.html";
// }


const selectMonta = document.getElementById("select-monta");
const selectLib = document.getElementById("select-libertador");
const classrooms = document.getElementById("classrooms");
const confirmButton = document.getElementById("confirmButton");
const returnButton = document.getElementById("returnButton");
const loadingScreen = document.getElementById("loadingScreen");
const botonM= document.getElementById("monta");
const botonL = document.getElementById("libertador");
const cantidad = document.getElementById("cantidad")

botonM.addEventListener("click", showMonta);
botonL.addEventListener("click", showLibertador);

function showMonta() {
    document.querySelector(".select-libertador").classList.add("disactive");
    selectMonta.style.display="flex";
    selectLib.style.display="none";
    classrooms.classList.add("disactive");
    confirmButton.style.display = "none";
    returnButton.style.display = "none";
    classrooms.innerHTML = "";
     botonL.style.background= ""
    botonM.style.background= "#cac8c8"

}
function showLibertador() {
    document.querySelector(".select-monta").classList.add("disactive");
    selectLib.style.display="flex";
    selectMonta.style.display="none";
    classrooms.classList.add("disactive");
    confirmButton.style.display = "none";
    returnButton.style.display = "none";
    classrooms.innerHTML = "";
botonM.style.background= ""
     botonL.style.background= "#cac8c8"
}

selectMonta.addEventListener("change", showClassroom);
selectLib.addEventListener("change", showClassroom);

function showClassroom() {
    classrooms.style.display="flex"
}


async function requestComputer() {
    console.log(
        JSON.stringify({
            userId: usuario,
            cartId: parseInt(classrooms.value),
        })
    );
    const response = await fetch(
        `https://secure-track-db.vercel.app/computers/request`,
        {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: usuario,
                cartId: parseInt(classrooms.value),
                quanti: cantidad.value
            }),
        }
    );
    

    const res = JSON.stringify(await response.json());
    console.log(await res);
    if (response.status == 200) {
        sessionStorage.setItem("correctKey", res);
        location.href = "../qr.html";
    }
}

async function returnComputer() {
    console.log(
        JSON.stringify({
            userId: usuario,
            cartId: parseInt(classrooms.value),
        })
    );
    const response = await fetch(
        `https://secure-track-db.vercel.app/computers/request-return`,
        {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: usuario,
                cartId: parseInt(classrooms.value),
            })
        }
    );

    const res = JSON.stringify(await response.json());
    if (response.status == 200) {
        sessionStorage.setItem("correctKey", res);
        location.href = "../qr.html";
    }
}

//hacer lo de selector pero mas prolijo 
//despues a partir de un post get pasarle un value del input
//