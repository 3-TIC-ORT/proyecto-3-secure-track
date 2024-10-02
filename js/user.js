document.addEventListener("DOMContentLoaded", function () {
    const profileImage = document.getElementById("image-user");
    const profilePhotoURL = sessionStorage.getItem("profilePhoto"); 
    const div = document.getElementById("div-image");
    const userSettings = document.getElementById("userSettings");
    const closeDiv = document.getElementById("closeBtn")

    if (profilePhotoURL) {
        profileImage.src = profilePhotoURL; 
        div.style.display = "block"; 
        profileImage.style.display = "block";
    }
    profileImage.addEventListener("click", mostrarConfiguraciones);

    function mostrarConfiguraciones() {
        if (userSettings.style.display === "none") {
            userSettings.style.display = "block"; // Mostrar la sección
        } else {
            userSettings.style.display = "none"; // Ocultar la sección
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
})
