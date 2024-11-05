const tbody = document.querySelector('#transaccionesTable tbody');
const loadingScreen = document.getElementById("loadingScreen");
const userId = sessionStorage.getItem("userId")



async function cargarTransacciones() {
    console.log (userId)
    try {
        loadingScreen.style.display = "flex";

        const response = await fetch('https://secure-track-db.vercel.app/professor/computers/use',{
            method: "POST",
            mode: "cors",
            body: JSON.stringify({ userId: userId }),
            headers: {
                "Content-Type": "application/json",
            },
           
         }); 
        const transacciones = await response.json();
        console.log( "estas son" ,  transacciones)
        
   
        
        
        tbody.innerHTML = '';
        
       
        transacciones.computers.forEach(transaccion => {
          crearTransacciones(transaccion)
        }); 
    } catch (error) {
        console.log(error)       
    }
    finally {
        loadingScreen.style.display = "none";
    }
}
const fila = document.createElement('tr');
let input =  document.createElement("input") 
let button = document.createElement("button")

 function crearTransacciones(data) {
    for (let i = 0; i < data.computers.length; i++) {
       
         input.setAttribute("id", `input${i}`)
         input.setAttribute("placeholder", "Usuario")
         input.setAttribute("class", "input")
         input.setAttribute("type", "text")
         button.addClassName("input")
        
         button.setAttribute("id",`button${i}`)
         button.addClassName("button")
         button.innerText = "Asignar"
        fila.innerHTML = `
            <td>${data.cart.room.roomNumber}</td>
            <td>${data.computers[i].computerId}</td>
            <td>${(data.createdAt).toString().slice(0,10)}</td>
           
        `;
        fila.appendChild(input)
        fila.appendChild(button)
        
        tbody.appendChild(fila);
    }
   


for (let i = 0; i < data.computers.length; i++) {
    document.getElementById(`button${i}`).addEventListener("click",async()=>{
        try {
            loadingScreen.style.display = "flex";
    
            const response = await fetch('https://secure-track-db.vercel.app/professor/computers/transfer',{
                method: "POST",
                mode: "cors",
                body: JSON.stringify({ professorId: userId, computerId: data.computers[i].computerId, userId: document.getElementById(`input${i}`).value }),
                headers: {
                    "Content-Type": "application/json",
                },
               
             }); 
            const transacciones = await response.json();
            console.log(transacciones)
            
       
            
            
            tbody.innerHTML = '';
            
           
            
        } catch (error) {
            console.log( "error de", error)       
        }
        finally {
            loadingScreen.style.display = "none";
        }
    })
}
}

cargarTransacciones();
