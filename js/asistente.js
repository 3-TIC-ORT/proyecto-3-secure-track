    // if (!sessionStorage.getItem("asist-Key")) {
        //     window.location.href = "accesodenegado.html";
        // 
        const tbody = document.querySelector('#transaccionesTable tbody');

let go = document.getElementById("go")
let input = document.getElementById("input")
go.addEventListener("click", ()=>filtrarTransacciones())
async function cargarTransacciones() {
    try {
       
        const response = await fetch('https://secure-track-db.vercel.app/asistente/tokens',{
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
           
         }); 
        const transacciones = await response.json();
        console.log(transacciones)
        
   
        
        
        tbody.innerHTML = '';
        
       
        transacciones.tokens.forEach(transaccion => {
          crearTransacciones(transaccion)
        });
    } catch (error) {
       console.log(error)
    }
}

cargarTransacciones();
 function crearTransacciones(data) {

    const fila = document.createElement('tr');
            
    fila.innerHTML = `
        <td>${data.token.user.username}</td>
        <td>${data.token.user.occupation}</td>
        <td>${data.token.cart.room.roomNumber}</td>
        <td>${data.computerId}</td>
        <td>${data.token.status}</td>
        <td>${data.token.createdAt.toString()}</td>
    `;
    
    tbody.appendChild(fila);
}

const alumno= document.getElementById("alumno")
const ocupacion = document.getElementById("ocupacion")
const computadora= document.getElementById("aula")
const estado = document.getElementById("estado")
const horario = document.getElementById("horario")
const buscar = document.getElementById("go")

// || ocupacion.value.length > 0 || aula.value.length > 0 || estado.value.length > 0 || horario.value.length > 0 
alumno.addEventListener("change",()=>{
    
        tb.innerHTML=""
        ocupacion.setAttribute("disabled",true)  
})






buscar.addEventListener("click", filtrado)


async function filtrado() {
    try {
       
        const response = await fetch('https://secure-track-db.vercel.app/asistente/tokens/filtrados',{
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                type:"alumno",
                data:alumno.value
            })
           
         }); 
        const hola  = await response.json();
        console.log(hola)
        tbody.innerHTML = '';
    hola.data.forEach(element => {
        crearTransacciones(element)
    });
        
    } catch (error) {
       console.log(error)
    }
}

//solo escribir en ub 