import { getCarros } from "./repository.js";
let usuario = (sessionStorage.getItem("userId"));
let occupation = sessionStorage.getItem("occupation")
let estado = sessionStorage.getItem("status") || "Devuelta"
const confirmButton = document.getElementById("confirmButton");
const returnButton = document.getElementById("returnButton");
let response = await fetch(
    `https://secure-track-db.vercel.app/users/status`,
    {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: sessionStorage.getItem("userId"),
        }),
    }
);
const res = await response.json()
console.log(res.status);
if (response.status === 200) {
    sessionStorage.setItem("status", res.status);
    if (res.status === "Retirada") {
        confirmButton.style.filter = "brightness(50%)"
    } else {
        returnButton.style.filter = "brightness(50%)"
    }
}

if (!usuario) {
    window.location.href = "accesodenegado.html";
}



let libertador = [[], [], [], [], []];
let monta = [[], [], [], [], []];

function showModal() {
    document.getElementById("modal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

document.getElementById("closeModal").addEventListener("click", closeModal);

const selectMonta = document.getElementById("select-monta");
const selectLib = document.getElementById("select-libertador");
const classrooms = document.getElementById("classrooms");

const loadingScreen = document.getElementById("loadingScreen");

const botonM = document.getElementById("monta");
const botonL = document.getElementById("libertador");

botonM.addEventListener("click", showMonta);
botonL.addEventListener("click", showLibertador);



function showMonta() {
    document.querySelector(".select-libertador").classList.add("disactive");
    document.querySelector(".select-monta").classList.remove("disactive");
    classrooms.classList.add("disactive");
    confirmButton.style.display = "none";
    returnButton.style.display = "none";
    classrooms.innerHTML = "";
    botonL.style.background = ""
    botonM.style.background = "#cac8c8"

}
function showLibertador() {
    document.querySelector(".select-monta").classList.add("disactive");
    selectLib.classList.remove("disactive");
    classrooms.classList.add("disactive");
    confirmButton.style.display = "none";
    returnButton.style.display = "none";
    classrooms.innerHTML = "";
    botonM.style.background = ""
    botonL.style.background = "#cac8c8"
}


document.getElementById("select-monta").addEventListener("change", () => {
    updateClassroomsOptions((document.getElementById("select-monta").value), "monta");
})

document.getElementById("select-libertador").addEventListener("change", () => {
    updateClassroomsOptions((document.getElementById("select-libertador").value), "libertador");
})

async function updateClassroomsOptions(piso, edificio) {
    let options = [];
    console.log(edificio);

    // Aquí accedes al array correcto de acuerdo al edificio y piso seleccionados
    if (edificio === "monta") {
        options = monta[piso] || []; // Si no hay aulas, deja el array vacío
    } else if (edificio === "libertador") {
        options = libertador[piso] || []; // Lo mismo aquí para Libertador
    } else {
        console.log("no hay")
    }
    console.log(options);

    // Asegúrate de limpiar el contenido previo del selector de aulas
    classrooms.innerHTML = "";

    let classroomOption = document.createElement("option");
    classroomOption.textContent = "Selecciona un aula";
    classroomOption.disabled = true;
    classroomOption.selected = true;
    classrooms.appendChild(classroomOption);

    // Si hay aulas disponibles, las agregamos al selector
    if (options.length > 0) {
        options.forEach(room => {
            let opt = document.createElement("option");
            opt.value = room.id;
            opt.textContent = room.room.roomNumber;
            // opt.textContent = `ID: ${room.id} - Aula: ${room.room.roomNumber}`; 
            classrooms.appendChild(opt);
        });
        classrooms.classList.remove("disactive");
        confirmButton.style.display = "block";
        returnButton.style.display = "block";
    } else {
        // Si no hay aulas, mostramos el modal
        classrooms.classList.add("disactive");
        confirmButton.style.display = "none";
        returnButton.style.display = "none";
        showModal();
    }
}






classrooms.addEventListener("change", checkAllSelected);

function checkAllSelected() {
    const selectedClassroom = classrooms.value;
    if (selectedClassroom) {
        confirmButton.style.display = "block";
        returnButton.style.display = "block";
    } else {
        confirmButton.style.display = "none";
        returnButton.style.display = "none";
    }

    if (estado === "Retirada") {
        returnButton.disabled = true;
        confirmButton.disabled = false;
    } else if (estado === "Devuelta") {
        returnButton.disabled = false;
        confirmButton.disabled = true;
    } else {

        returnButton.disabled = false;
        confirmButton.disabled = false;
    }


}

confirmButton.addEventListener("click", () => requestComputer());
returnButton.addEventListener("click", () => returnComputer());

async function requestComputer() {
    let status = sessionStorage.getItem("status")
    if (status === "Retirada") {
        return
    }
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
            }),
        }
    );
    const res = JSON.stringify(await response.json());
    console.log(await res);
    if (response.status == 200) {
        sessionStorage.setItem("status", "En proceso");
        sessionStorage.setItem("correctKey", res);
        location.href = "../qr.html";
    }




}

async function returnComputer() {
    let status = sessionStorage.getItem("status")
    if (status != "Retirada") {
        return
    }
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
            }),
        }
    );

    const res = JSON.stringify(await response.json());
    if (response.status == 200) {
        sessionStorage.setItem("status", "En proceso devolucion");
        sessionStorage.setItem("correctKey", res);
        location.href = "../qr.html";
    }
}

async function initializeClassrooms() {
    try {

        loadingScreen.style.display = "flex";

        const data = await getCarros();
        console.log("Datos recibidos del backend:", data);


        for (let key in libertador) libertador[key] = [];
        for (let key in monta) monta[key] = [];

        data.forEach((item) => {
            const roomNumber = item.room.roomNumber;
            const building = roomNumber[0];
            const floor = roomNumber.slice(1, 2);

            if (building === "M" && monta[floor] !== undefined) {
                monta[floor].push(item);
            } else if (building === "L" && libertador[floor] !== undefined) {
                libertador[floor].push(item);
            } else {
                console.log(`no hay`);
            }
        });

        console.log("Aulas de Montañeses:", monta);
        console.log("Aulas de Libertador:", libertador);

    } catch (error) {



    } finally {
        loadingScreen.style.display = "none";
    }

}


initializeClassrooms();

