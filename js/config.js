



document.getElementById('logoutBtn').addEventListener('click',logOut)
function logOut() {
    sessionStorage.clear();
    location.href = 'index.html';  
}
