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

const botonM = document.getElementById("monta");
const botonL = document.getElementById("libertador");

botonM.addEventListener("click", showMonta);
botonL.addEventListener("click", showLibertador);

let libertador = [[], [], [], [], []];
let monta = [[], [], [], [], []];

function showMonta() {
    document.querySelector(".select-libertador").classList.add("disactive");
    document.querySelector(".select-monta").classList.remove("disactive");
    classrooms.classList.add("disactive");
    confirmButton.style.display = "none";
    returnButton.style.display = "none";
    classrooms.innerHTML = "";
    botonL.style.background = "";
    botonM.style.background = "#d4ece5";
}

function showLibertador() {
    document.querySelector(".select-monta").classList.add("disactive");
    document.querySelector(".select-libertador").classList.remove("disactive");
    classrooms.classList.add("disactive");
    confirmButton.style.display = "none";
    returnButton.style.display = "none";
    classrooms.innerHTML = "";
    botonM.style.background = "";
    botonL.style.background = "#d4ece5";
}

async function tenerAulas() {
    try {
        const response = await fetch(`https://secure-track-db.vercel.app/`);
        if (!response.ok) {
            throw new Error("Error al obtener aulas");
        }
        const data = await response.json();
        // por año y edificio aca
    } catch (error) {
        location.href = "../error.html"; 
        return [];
    }
}

selectMonta.addEventListener("change", showClassroomsM);
selectLib.addEventListener("change", showClassroomsL);

function showClassroomsM() {
     classrooms.style.display="block";
     confirmButton.style.display="block";
     returnButton.style.display="block";
    };
    
function showClassroomsL(params) {
    
}