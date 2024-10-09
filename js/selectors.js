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


//aparecen los select y se cambia el color de fondo de los botones a rojo
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

        const filteredData = data.filter(room => room.roomNumber.startsWith(building === "monta" ? "M" : "L"));
        return filteredData;
    } catch (error) {
        location.href("../error.html")
        return [];
    }
}

async function updateClassroomsOptions(piso, edificio) {
    let options = [];
    console.log(edificio)
    if (edificio === "monta") {
        options = monta[piso] || [];
        filterRooms()
    } else if (edificio === "libertador") {
        options = libertador[piso] || [];
        filterRooms()
    }

    let classroomOption = document.createElement("option");
    classroomOption.textContent = "Selecciona un aula";
    classroomOption.disabled = true;
    classroomOption.selected = true;
    classrooms.appendChild(classroomOption);

    function filterRooms (){
        classrooms.innerHTML = ""
        options.forEach(room => {
            let opt = document.createElement("option");
            opt.value = room.id;
            opt.textContent = room.roomNumber;
            classrooms.appendChild(opt);
        });
    
        if (options.length > 0) {
            classrooms.classList.remove("disactive");
            confirmButton.style.display = "block";
            returnButton.style.display = "block";
        } else {
            classrooms.classList.add("disactive");
            confirmButton.style.display = "none";
            returnButton.style.display = "none";
            showModal();
        }
    }
    }

selectMonta.addEventListener("change", async () => {
    const selectedFloor = selectMonta.value.slice(1);
    monta[selectedFloor] = await fetchClassrooms("monta");
    updateClassroomsOptions(selectedFloor, "monta");
});

selectLib.addEventListener("change", async () => {
    const selectedFloor = selectLib.value.slice(1);
    libertador[selectedFloor] = await fetchClassrooms("libertador");
    updateClassroomsOptions(selectedFloor, "libertador");

});


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
    if (await response.status == 200) {
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
            const roomNumber = item.roomNumber; 
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
        location.href("./error.html")
    } finally {
        loadingScreen.style.display = "none";
    }
}

initializeClassrooms();



