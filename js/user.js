const profileImage = document.getElementById("image-user");
const profilePhotoURL = sessionStorage.getItem("profilePhoto"); 
const div = document.getElementById("div-image");
const userSettings = document.getElementById("userSettings");
const closeDiv = document.getElementById("closeBtn")
const avatar = document.getElementById("avatar")
const dni= sessionStorage.getItem("dni")
const username = sessionStorage.getItem("username")
const p_user = document.getElementById("dni")
const nfc = document.getElementById("nfc")
const user = sessionStorage.getItem("userId")
const asignar = document.getElementById("asignar")
const occupation = sessionStorage.getItem("occupation")



    if (profilePhotoURL) {
        profileImage.src = `./img/${profilePhotoURL}.jpg`; 
        div.style.display = "block"; 
        profileImage.style.display = "block";
    }
    profileImage.addEventListener("click", mostrarConfiguraciones);

        function mostrarConfiguraciones() {
            userSettings.classList.toggle("active");
        //       if (userSettings.style.display === "none") {
        //     userSettings.style.display = "block"; 
        // } else {
        //     userSettings.style.display = "none"; 
        // }
    }
closeDiv.addEventListener("click", close)

function close() {
     userSettings.style.display = "none"
}



    document.getElementById('logoutBtn').addEventListener('click', logOut);
    
    function logOut() {
        sessionStorage.clear();
        location.href = 'index.html';
    }

    if (avatar) {
        avatar.src = `./img/${profilePhotoURL}.jpg`; 
    }
    if (username) {
        p_user.innerHTML = `<p>${username}</p>`;
    } else if (dni) {
        p_user.innerHTML = `<p>${dni}</p>`;
    } else {

        p_user.innerHTML = `<p>hola</p>`;
    }

    nfc.addEventListener("click" ,crear)

 async function crear() {
    
sessionStorage.setItem("correctKey", JSON.stringify({tokenId:user,slots:[]}))
location.href="./qr.html"
 }

 document.addEventListener("DOMContentLoaded", () => {
    const summary = document.getElementById("summary");
    const datalist = document.getElementById("transacciones"); 

    summary.addEventListener("click", cargarTransacciones);

    async function cargarTransacciones() {
        try {
            console.log("User ID:", user);

            const response = await fetch('https://secure-track-db.vercel.app/users/transactions', {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({ userId: user }), 
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error en la solicitud: " + response.statusText);
            }

            const transacciones = await response.json();
            console.log(transacciones);

            datalist.innerHTML = ''; 
            if (transacciones.length > 0) {
                transacciones.forEach(transaccion => {
                    const transaccionP = document.createElement("p");
                    transaccionP.textContent = `Hora: ${transaccion.data.token.createdAt} - Aula: ${transaccion.data.token.cart.room.roomNumber}`;
                    datalist.appendChild(transaccionP);
                });
            } else {
                const noTransaccionP = document.createElement("p");
                noTransaccionP.textContent = "No hay transacciones disponibles"; 
                datalist.appendChild(noTransaccionP);
            }  
        } catch (error) {
            console.error("Error:", error);
            datalist.innerHTML = '<p>Error al cargar las transacciones, por  favor intente mas tarde.</p>';
        }
    }
});

 if ( occupation === "Profesor") {
    asignar.style.display="block"
 } else {
  asignar.style.display="none"
 }
 