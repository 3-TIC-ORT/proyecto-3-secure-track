    // if (!sessionStorage.getItem("asist-Key")) {
        //     window.location.href = "accesodenegado.html";
        // 

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
        
   
        const tbody = document.querySelector('#transaccionesTable tbody');
        
        
        tbody.innerHTML = '';
        
       
        transacciones.tokens.forEach(transaccion => {
            const fila = document.createElement('tr');
            
            fila.innerHTML = `
                <td>${transaccion.token.user.username}</td>
                <td>${transaccion.token.user.occupation}</td>
                <td>${transaccion.token.cart.room.roomNumber}</td>
                <td>${transaccion.computerId}</td>
                <td>${transaccion.token.status}</td>
                <td>${transaccion.token.createdAt.toString()}</td>
            `;
            
            tbody.appendChild(fila);
        });
    } catch (error) {
       console.log(error)
    }
}

async function filtrarTransacciones() {
    try {
       
        const response = await fetch('https://secure-track-db.vercel.app/asistente/tokens/filtrados',{
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                request:"1"
            })
           
         }); 
        const transacciones = await response.json();
        console.log(transacciones)
        
   
        const tbody = document.querySelector('#transaccionesTable tbody');
        
        
        tbody.innerHTML = '';
        
       
        transacciones.tokens.forEach(transaccion => {
            const fila = document.createElement('tr');
            
            fila.innerHTML = `
                <td>${transaccion.token.user.username}</td>
                <td>${transaccion.token.user.occupation}</td>
                <td>${transaccion.token.cart.room.roomNumber}</td>
                <td>${transaccion.computerId}</td>
                <td>${transaccion.token.status}</td>
                <td>${transaccion.token.createdAt.toString()}</td>
            `;
            
            tbody.appendChild(fila);
        });
    } catch (error) {
       console.log(error)
    }
}



cargarTransacciones();
