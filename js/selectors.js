import { getCarros } from "./repository.js";
let usuario = sessionStorage.getItem("userId");
if (!usuario) {
    window.location.href = "accesodenegado.html";
}

let libertador =  [  [],  [],  [],  [], [] ];
let monta = [  [],  [],  [],  [], [] ];

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
const confirmButton = document.getElementById("confirmButton");
const returnButton = document.getElementById("returnButton");
const loadingScreen = document.getElementById("loadingScreen");

 const botonM= document.getElementById("monta");
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
     botonL.style.background= ""
    botonM.style.background= "#cac8c8"

}
function showLibertador() {
    document.querySelector(".select-monta").classList.add("disactive");
    selectLib.classList.remove("disactive");
    classrooms.classList.add("disactive");
    confirmButton.style.display = "none";
    returnButton.style.display = "none";
    classrooms.innerHTML = "";
botonM.style.background= ""
     botonL.style.background= "#cac8c8"
}

async function fetchClassrooms(building) {
    try {
        const response = await fetch(`https://secure-track-db.vercel.app/rooms`);
        if (!response.ok) {
            throw new Error("Error al obtener aulas");
        }
        const data = await response.json();

        const filteredData = data.filter(room => room.room.roomNumber.startsWith(building === "monta" ? "M" : "L"));
        return filteredData;
    } catch (error) {
        location.href("../error.html")
        return [];
    }
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
    }else{
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
            opt.textContent = room.room.roomNumber; // El número de aula
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
}

confirmButton.addEventListener("click", () => requestComputer());
returnButton.addEventListener("click", () => returnComputer());

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
            }),
        }
    );

    const res = JSON.stringify(await response.json());
    if (response.status == 200) {
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
        location.href("./error500.html")
    } finally {
        loadingScreen.style.display = "none";
    }
}

initializeClassrooms();




