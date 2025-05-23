document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        // Сброс предыдущих ошибок
        document.getElementById("usernameError").textContent = "";
        document.getElementById("passwordError").textContent = "";

        // Валидация полей
        let isValid = true;

        if (username === "") {
            document.getElementById("usernameError").textContent = "Введите логин";
            isValid = false;
        }

        if (password === "") {
            document.getElementById("passwordError").textContent = "Введите пароль";
            isValid = false;
        }

        if (!isValid) return;

        const submitButton = form.querySelector("button[type='submit']");
        submitButton.disabled = true;
        await authenticateUser(username, password);
        submitButton.disabled = false;
    });

    // Функция аутентификации пользователя
    async function authenticateUser(username, password) {
        // TODO: УБЕРИ НАХУЙ ПОТОМ САНЯ СЛЫШИШЬ ДА
        if (username === "admin" && password === "admin") {
            localStorage.setItem("isAdminLoggedIn", "true");
            localStorage.setItem("authToken", "admin");
            alert("урааа фейковая админка");
            window.location.href = "../index.html";
            return;
        }

        /*
            Эндпоинт видишь ниже
            Тело ответа:
            {
                "success": boolean
                "message": сообщение на случай пиздеца
                "token": токен аутентификации
                "isAdmin": boolean
            }
        */
        await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Ошибка авторизации");
                return response.json();
            })
            .then((data) => {
                if (!data.success) throw new Error(data.message);
                if (data.isAdmin) {
                    localStorage.setItem("isAdminLoggedIn", "true");
                }
                localStorage.setItem("authToken", data.token);
                window.location.href = "../index.html";
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Произошла ошибка при авторизации: ", "error");
            });
    }
});
