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
const datalist = document.getElementsByTagName("datalist")

    if (profilePhotoURL) {
        profileImage.src = `./img/${profilePhotoURL}.jpg`; 
        div.style.display = "block"; 
        profileImage.style.display = "block";
    }
    profileImage.addEventListener("click", mostrarConfiguraciones);

    function mostrarConfiguraciones() {
        if (userSettings.style.display === "none") {
            userSettings.style.display = "block"; 
        } else {
            userSettings.style.display = "none"; 
        }
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

 async function cargarTransacciones() {
    try {

        const response = await fetch('https://secure-track-db.vercel.app/user/transactions',{
            method: "POST",
            mode: "cors",
            body:"userId",
            headers: {
                "Content-Type": "application/json",
            },
           
         }); 
        const transacciones = await response.json();
        console.log(transacciones)
       
    } catch (error) {
        location.href("./error500.html")
    }
}