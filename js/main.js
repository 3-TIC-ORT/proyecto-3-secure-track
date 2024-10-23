function showTab(tabId) {
        document.querySelectorAll(".content").forEach(tab => {
            tab.classList.remove("active");
        });
        document.getElementById(tabId).classList.add("active");

        document.querySelectorAll(".decision-button").forEach(button => {
            button.classList.remove("active");
        });
        document.getElementById("button-" + tabId).classList.add("active");
        clearMessages();
    }

    function showError(message) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    function showSuccess(message) {
        const successMessage = document.getElementById('success-message');
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        document.getElementById('error-message').style.display = 'none'; 
    }

    function clearMessages() {
        document.getElementById('error-message').style.display = 'none';
        document.getElementById('success-message').style.display = 'none';
    }

    document.querySelectorAll(".decision-button").forEach(button => {
        button.addEventListener("click", function() {
            let tabId = this.id.replace("button-", "");
            showTab(tabId);
        });
    });

    let hash = window.location.hash.substring(1);
    showTab(hash || "login");

    document.getElementById("submit-login").addEventListener("click", function(event) {
        event.preventDefault();
        clearMessages();
        
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!/^\d{8}$/.test(username)) {
            showError("El DNI debe ser un número de 8 dígitos.");
            return;
        }

        sessionStorage.setItem("username", username); // Guardar el username correctamente
        logueo_user({ username: username, password: password });
    });

    document.getElementById("submit-register").addEventListener("click", function(event) {
        event.preventDefault();
        clearMessages();

        const dni = document.getElementById("dni").value;
        const password = document.getElementById("register-password").value;

        if (!/^\d{8}$/.test(dni)) {
            showError("El DNI debe ser un número de 8 dígitos.");
            return;
        }

        sessionStorage.setItem("dni", dni); // Asegúrate de usar "dni" en minúsculas
        register_user({ username: dni, password: password, avatar: avatarSelect.value });
    });

    async function register_user(user) {
        try {
            let response = await fetch(`https://secure-track-db.vercel.app/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });
            let data = await response.json();

            if (response.status === 200) {
                showSuccess("Registro exitoso. Redirigiendo...");
                sessionStorage.setItem("userId", data.id);
                sessionStorage.setItem("profilePhoto", data.avatar);
                setTimeout(() => {
                    location.href = "../selectorItems.html";
                }, 2000);
            } else {
                showError(data.message || "Error en el registro");
            }
        } catch (error) {
            showError("Error en el servidor. Inténtelo de nuevo.");
        }
    }

    let avatarSelect = document.getElementById("avatar");
    avatarSelect.addEventListener("change", function () {
        const selectedAvatar = this.value;
        sessionStorage.setItem("profilePhoto", selectedAvatar);
    });

    async function  logueo_user(user) {
        try {
            let response = await fetch(`https://secure-track-db.vercel.app/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });
            let data = await response.json();
           
            if (response.status === 200) {
                console.log(data)
                showSuccess("Inicio de sesión exitoso. Redirigiendo...");
                sessionStorage.setItem("userId", data.id);
                sessionStorage.setItem("occupation", data.occupation)
                sessionStorage.setItem("profilePhoto", data.avatar);
                console.log(data.avatar)
                setTimeout(() => {
                    if (data.occupation === "Estudiante") {
                        location.href = "../selectorItems.html";
                    } else if (data.occupation === "Asistente") {
                        location.href = "../asistente.html";
                    } else if (data.occupation === "Profesor") {
                        location.href = "../selectorItems.html";
                    }
                }, 2000);
            } else {
                showError(data.message || "Usuario o contraseña incorrectos.");
            }
        } catch (error) {
            showError("Error en el servidor. Inténtelo de nuevo.");
        }
    }

