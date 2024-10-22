    // if (!sessionStorage.getItem("asist-Key")) {
        //     window.location.href = "accesodenegado.html";
        // 
        
        const tbody = document.querySelector('#transaccionesTable tbody');
        const loadingScreen = document.getElementById("loadingScreen");


async function cargarTransacciones() {
    try {
        loadingScreen.style.display = "flex";

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
        location.href("./error500.html")
    }
    finally {
        loadingScreen.style.display = "none";
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
        <td>${(data.token.createdAt).toString().slice(0,10)}</td>
    `;
    
    tbody.appendChild(fila);
}

const alumno= document.getElementById("alumno")
const ocupacion = document.getElementById("ocupacion")
const computadora= document.getElementById("computadora")
const estado = document.getElementById("estado")
const horario = document.getElementById("horario")
const buscar = document.getElementById("go")
const aula = document.getElementById("aula")

alumno.addEventListener("change", checkValues);
ocupacion.addEventListener("change", checkValues);
computadora.addEventListener("change", checkValues);
estado.addEventListener("change", checkValues);
horario.addEventListener("change", checkValues);
aula.addEventListener("change", checkValues);



buscar.addEventListener("click", filtrado)


function checkValues() {
 
  if (aula.value.length > 0||alumno.value.length > 0 || ocupacion.value.length > 0 || computadora.value.length > 0 || estado.value.length > 0 || horario.value.length > 0) {
    if (alumno.value.length > 0) {
      ocupacion.setAttribute("disabled", true);
      computadora.setAttribute("disabled", true);
      estado.setAttribute("disabled", true);
      horario.setAttribute("disabled", true);
      aula.setAttribute("disabled", true);

    } else if (ocupacion.value.length > 0) {
      alumno.setAttribute("disabled", true);
      computadora.setAttribute("disabled", true);
      estado.setAttribute("disabled", true);
      horario.setAttribute("disabled", true);
      aula.setAttribute("disabled", true);

    }else if (aula.value.length > 0) {
        alumno.setAttribute("disabled", true);
        computadora.setAttribute("disabled", true);
        estado.setAttribute("disabled", true);
        horario.setAttribute("disabled", true);
        ocupacion.setAttribute("disabled", true);

        
      } else if (computadora.value.length > 0) {
      alumno.setAttribute("disabled", true);
      ocupacion.setAttribute("disabled", true);
      estado.setAttribute("disabled", true);
      horario.setAttribute("disabled", true);
      aula.setAttribute("disabled", true);

    } else if (estado.value.length > 0) {
      alumno.setAttribute("disabled", true);
      ocupacion.setAttribute("disabled", true);
      computadora.setAttribute("disabled", true);
      horario.setAttribute("disabled", true);
      aula.setAttribute("disabled", true);

    } else if (horario.value.length > 0) {
      alumno.setAttribute("disabled", true);
      ocupacion.setAttribute("disabled", true);
      computadora.setAttribute("disabled", true);
      estado.setAttribute("disabled", true);
      aula.setAttribute("disabled", true);

    }
  } else {
    alumno.removeAttribute("disabled");
    ocupacion.removeAttribute("disabled");
    computadora.removeAttribute("disabled");
    estado.removeAttribute("disabled");
    horario.removeAttribute("disabled");
    aula.removeAttribute("disabled");

  }
}



async function filtrado() {
    try {
        
        letselect = "";
        let benVaule= "";

        if (alumno.value.length > 0) {
           select = "alumno";
            benVaule= alumno.value;
        } else if (ocupacion.value.length > 0) {
           select = "ocupacion";
            benVaule= ocupacion.value;
        }else if (aula.value.length > 0) {
            select = "aula";
             benVaule= aula.value;
         } else if (computadora.value.length > 0) {
           select = "computadora";
            benVaule= computadora.value;
        } else if (estado.value.length > 0) {
           select = "estado";
            benVaule= estado.value;
        } else if (horario.value.length > 0) {
           select = "horario";
            benVaule= horario.value;
        } else {
            benVaule = ""
        }
        let response
        if (benVaule != "") {
             response = await fetch('https://secure-track-db.vercel.app/asistente/tokens/filtrados', {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type:select,  
                    data: benVaule  
                })
            });
            const hola = await response.json();
            console.log(hola);
            tbody.innerHTML = '';
    
          
            hola.data.forEach(element => {
                crearTransacciones(element);
            });
        }else{
             response = await fetch('https://secure-track-db.vercel.app/asistente/tokens',{
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
        }

       

    } catch (error) {
        location.href = "./error500.html";
    }
}


