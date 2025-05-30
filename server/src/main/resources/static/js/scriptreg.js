document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registrationForm");

    // Маска для телефона
    const phoneInput = document.getElementById("phone");

    phoneInput.addEventListener("input", function (e) {
        let x = e.target.value
            .replace(/\D/g, "")
            .match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        e.target.value = !x[2]
            ? x[1]
            : "+" +
            x[1] +
            "(" +
            x[2] +
            (x[3] ? ")-" + x[3] : "") +
            (x[4] ? "-" + x[4] : "") +
            (x[5] ? "-" + x[5] : "");
    });

    // Валидация формы
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const login = document.getElementById("login").value.trim();
        const password = document.getElementById("password").value;
        const fullName = document.getElementById("fullName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();

        let isValid = true;

        // Валидация логина
        if (login.length < 3) {
            document.getElementById("loginError").textContent =
                "Логин должен содержать минимум 3 символа";
            isValid = false;
        } else {
            document.getElementById("loginError").textContent = "";
            // Здесь можно добавить проверку на уникальность логина через AJAX
        }

        // Валидация пароля
        if (password.length < 6) {
            document.getElementById("passwordError").textContent =
                "Пароль должен содержать минимум 6 символов";
            isValid = false;
        } else {
            document.getElementById("passwordError").textContent = "";
        }

        // Валидация ФИО
        const nameRegex = /^[А-ЯЁа-яё\s]+$/;
        if (!nameRegex.test(fullName)) {
            document.getElementById("fullNameError").textContent =
                "ФИО должно содержать только кириллицу и пробелы";
            isValid = false;
        } else {
            document.getElementById("fullNameError").textContent = "";
        }

        // Валидация телефона
        const phoneRegex = /^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(phone)) {
            document.getElementById("phoneError").textContent =
                "Введите телефон в формате +7(XXX)-XXX-XX-XX";
            isValid = false;
        } else {
            document.getElementById("phoneError").textContent = "";
        }

        // Валидация email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById("emailError").textContent = "Введите корректный email";
            isValid = false;
        } else {
            document.getElementById("emailError").textContent = "";
        }

        if (!isValid) return;

        const submitButton = form.querySelector("button[type='submit']");
        submitButton.disabled = true;
        await registerUser({
            login,
            password,
            fullName,
            phone,
            email,
        });
        submitButton.disabled = false;
    });

    // Функция регистрации пользователя
    async function registerUser(userData) {
        /*
            тут тело ответа такое:
            {
                "success": true,
                "message": если пиздец,
                "token": "token",
            }
        */
        await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Регистрация успешна!");
                    localStorage.setItem("token", data.token);
                    window.location.href = "/mineIsNotMyself";
                } else {
                    alert("Ошибка регистрации: " + data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Произошла ошибка при регистрации");
            });
    }
});
