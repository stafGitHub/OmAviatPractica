document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("isAdminLoggedIn") !== "true") {
        alert("Вы не авторизованы в системе администратора");
        window.location.href = "../index.html";
    }

    // Элементы интерфейса
    const adminPanel = document.getElementById("adminPanel");
    const logoutBtn = document.getElementById("logoutBtn");
    const requestsList = document.getElementById("requestsList");
    const statusFilter = document.getElementById("statusFilter");
    const searchInput = document.getElementById("searchInput");
    const statusModal = document.getElementById("statusModal");
    const closeModalBtn = document.querySelector(".close-btn");
    const cancelStatusBtn = document.getElementById("cancelStatusBtn");
    const saveStatusBtn = document.getElementById("saveStatusBtn");
    const newStatus = document.getElementById("newStatus");
    const cancelReasonGroup = document.getElementById("cancelReasonGroup");
    const cancelReason = document.getElementById("cancelReason");
    const modalRequestId = document.getElementById("modalRequestId");
    const currentStatus = document.getElementById("currentStatus");

    /*  Эндпоинт: /api/orders, НО ТУТ ЧЕРЕЗ GET
        Данные имеют такой вид:
        массив этих хуюмпол
        {
            id: number,
            fio: string,
            phone: string,
            service: string,
            date: datetime,
            status: string, (можно ебануть через многие-ко-многим и таблицу status)
            address: string,
            description: string    
        }
    */
    let requests = [];
    let exampleRequests = [
        {
            id: 1,
            fio: "Иванов Иван Иванович",
            phone: "+7 (123) 456-78-90",
            service: "Ремонт крана",
            date: "2023-05-10T14:30:00",
            status: "completed",
            address: "ул. Пушкина, д. 10",
            description: "Не работает кран на кухне, протекает вода",
        },
        {
            id: 2,
            fio: "Петров Петр Петрович",
            phone: "+7 (123) 456-78-90",
            service: "Уборка квартиры",
            date: "2023-06-01T09:45:00",
            status: "in_progress",
            address: "ул. Советская, д. 20",
            description: "Генеральная уборка квартиры перед приездом гостей",
        },
        {
            id: 3,
            fio: "Сидоров Сидор Сидорович",
            phone: "+7 (123) 456-78-90",
            service: "Уборка ковров и мебели",
            date: "2023-06-15T16:20:00",
            status: "new",
            address: "ул. Ленина, д. 30",
            description: "Плановая уборка ковров и мебели",
        },
    ];

    // fetch("api/orders", {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    // })
    //     .then((response) => {
    //         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    //         return response.json();
    //     })
    //     .then((data) => {
    //         requests = data;
    //     })
    //     .catch((error) => {
    //         console.error("Error:", error);
    //     });

    // УБЕРИ НАХУЙ ПОТОМ
    requests = exampleRequests;
    let currentRequestId = null;
    loadRequests();

    function init() {
        setupEventListeners();
    }

    function setupEventListeners() {
        // Выход из системы
        logoutBtn.addEventListener("click", handleLogout);

        // Фильтрация и поиск заявок
        statusFilter.addEventListener("change", loadRequests);
        searchInput.addEventListener("input", loadRequests);

        // Модальное окно изменения статуса
        closeModalBtn.addEventListener("click", closeStatusModal);
        cancelStatusBtn.addEventListener("click", closeStatusModal);
        statusModal.addEventListener("click", function (e) {
            if (e.target === statusModal) closeStatusModal();
        });

        // Изменение статуса
        newStatus.addEventListener("change", function () {
            cancelReasonGroup.classList.toggle("hidden", this.value !== "cancelled");
        });
        saveStatusBtn.addEventListener("click", saveStatus);
    }

    // Обработка выхода из системы
    function handleLogout() {
        window.location.href = "../index.html";
    }

    // Загрузка списка заявок
    function loadRequests() {
        const status = statusFilter.value;
        const searchQuery = searchInput.value.toLowerCase();

        // Фильтрация заявок
        let filteredRequests = requests.filter((request) => {
            const matchesStatus = status === "all" || request.status === status;
            const matchesSearch =
                searchQuery === "" ||
                request.fio.toLowerCase().includes(searchQuery) ||
                request.phone.includes(searchQuery.replace(/\D/g, ""));

            return matchesStatus && matchesSearch;
        });

        // Очистка списка
        requestsList.innerHTML = "";

        if (filteredRequests.length === 0) {
            requestsList.innerHTML =
                '<div class="no-requests">Нет заявок по выбранным критериям</div>';
            return;
        }

        // Отображение заявок
        filteredRequests.forEach((request) => {
            const requestItem = document.createElement("div");
            requestItem.className = "request-item";
            requestItem.setAttribute("data-id", request.id);

            // Форматирование статуса
            const statusMap = {
                new: { text: "Новая", class: "status-new" },
                in_progress: { text: "В работе", class: "status-in_progress" },
                completed: { text: "Выполнена", class: "status-completed" },
                cancelled: { text: "Отменена", class: "status-cancelled" },
            };

            const statusInfo = statusMap[request.status] || { text: request.status, class: "" };

            // Форматирование даты
            const formattedDate = new Date(request.date).toLocaleDateString("ru-RU");

            requestItem.innerHTML = `
                <div data-label="№">${request.id}</div>
                <div data-label="ФИО">${request.fio}</div>
                <div data-label="Телефон">${request.phone}</div>
                <div data-label="Услуга">${request.service}</div>
                <div data-label="Дата">${formattedDate}</div>
                <div data-label="Статус">
                    <span class="request-status ${statusInfo.class}">${statusInfo.text}</span>
                </div>
                <div data-label="Действия">
                    <button class="action-btn change-status-btn">Изменить статус</button>
                </div>
            `;

            // Добавляем обработчик для кнопки изменения статуса
            requestItem.querySelector(".change-status-btn").addEventListener("click", () => {
                openStatusModal(request.id);
            });

            requestsList.appendChild(requestItem);
        });
    }

    // Открытие модального окна изменения статуса
    function openStatusModal(requestId) {
        const request = requests.find((r) => r.id === requestId);
        if (!request) return;

        currentRequestId = requestId;
        modalRequestId.textContent = requestId;

        // Устанавливаем текущий статус
        const statusMap = {
            new: "Новая",
            in_progress: "В работе",
            completed: "Выполнена",
            cancelled: "Отменена",
        };

        currentStatus.textContent = statusMap[request.status] || request.status;

        // Сбрасываем форму
        newStatus.value = "in_progress";
        cancelReason.value = "";
        cancelReasonGroup.classList.add("hidden");

        // Открываем модальное окно
        statusModal.classList.remove("hidden");
    }

    // Закрытие модального окна изменения статуса
    function closeStatusModal() {
        statusModal.classList.add("hidden");
    }

    // Сохранение нового статуса
    function saveStatus() {
        const request = requests.find((r) => r.id === currentRequestId);
        if (!request) return;

        const newStatusValue = newStatus.value;
        const cancelReasonValue = cancelReason.value.trim();

        if (newStatusValue === "cancelled" && !cancelReasonValue) {
            alert("Укажите причину отмены");
            return;
        }

        request.status = newStatusValue;

        if (newStatusValue === "cancelled") {
            request.cancelReason = cancelReasonValue;
        }

        // ТУТ ТАКОЙ ЖЕ ЭНДПОИНТ, НО МЕТОД PUT
        // ПЛЮСОМ В ЭНДПОИНТЕ ЕЩЁ ЕСТЬ АЙДИШНИК
        // НАДЕЮСЬ ТЫ ЕБЕШЬ КАК ОБРАБОТАТЬ
        fetch(`/api/orders/${currentRequestId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        closeStatusModal();
        loadRequests();
        alert("Статус заявки успешно обновлен");
    }

    init();
});
