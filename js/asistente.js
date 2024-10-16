    // if (!sessionStorage.getItem("asist-Key")) {
        //     window.location.href = "accesodenegado.html";
        // 
        const tbody = document.querySelector('#transaccionesTable tbody');



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

// const alumno= document.getElementById("alumno")
// const ocupacion = document.getElementById("ocupacion")
// const computadora= document.getElementById("aula")
// const estado = document.getElementById("estado")
// const horario = document.getElementById("horario")
// const buscar = document.getElementById("go")

// // || ocupacion.value.length > 0 || aula.value.length > 0 || estado.value.length > 0 || horario.value.length > 0 
// alumno.addEventListener("change",()=>{
    
//         tb.innerHTML=""
//         ocupacion.setAttribute("disabled",true)  
// })

// const alumno = document.getElementById("alumno");
// const ocupacion = document.getElementById("ocupacion");
// const computadora = document.getElementById("aula");
// const estado = document.getElementById("estado");
// const horario = document.getElementById("horario");

// function checkValues() {
//   // Si alguno de los campos tiene un valor mayor que 0 o no está vacío
//   if (alumno.value.length > 0 || ocupacion.value.length > 0 || computadora.value.length > 0 || estado.value.length > 0 || horario.value.length > 0) {
//     if (alumno.value.length > 0) {
//       ocupacion.setAttribute("disabled", true);
//       computadora.setAttribute("disabled", true);
//       estado.setAttribute("disabled", true);
//       horario.setAttribute("disabled", true);
//     } else if (ocupacion.value.length > 0) {
//       alumno.setAttribute("disabled", true);
//       computadora.setAttribute("disabled", true);
//       estado.setAttribute("disabled", true);
//       horario.setAttribute("disabled", true);
//     } else if (computadora.value.length > 0) {
//       alumno.setAttribute("disabled", true);
//       ocupacion.setAttribute("disabled", true);
//       estado.setAttribute("disabled", true);
//       horario.setAttribute("disabled", true);
//     } else if (estado.value.length > 0) {
//       alumno.setAttribute("disabled", true);
//       ocupacion.setAttribute("disabled", true);
//       computadora.setAttribute("disabled", true);
//       horario.setAttribute("disabled", true);
//     } else if (horario.value.length > 0) {
//       alumno.setAttribute("disabled", true);
//       ocupacion.setAttribute("disabled", true);
//       computadora.setAttribute("disabled", true);
//       estado.setAttribute("disabled", true);
//     }
//   } else {
//     alumno.removeAttribute("disabled");
//     ocupacion.removeAttribute("disabled");
//     computadora.removeAttribute("disabled");
//     estado.removeAttribute("disabled");
//     horario.removeAttribute("disabled");
//   }
// }

// alumno.addEventListener("change", checkValues);
// ocupacion.addEventListener("change", checkValues);
// computadora.addEventListener("change", checkValues);
// estado.addEventListener("change", checkValues);
// horario.addEventListener("change", checkValues);




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

