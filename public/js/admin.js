document.addEventListener('DOMContentLoaded', function () {
    // Элементы интерфейса
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.getElementById('adminPanel');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminLogin = document.getElementById('adminLogin');
    const adminPassword = document.getElementById('adminPassword');
    const loginError = document.getElementById('loginError');
    const requestsList = document.getElementById('requestsList');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');
    const statusModal = document.getElementById('statusModal');
    const closeModalBtn = document.querySelector('.close-btn');
    const cancelStatusBtn = document.getElementById('cancelStatusBtn');
    const saveStatusBtn = document.getElementById('saveStatusBtn');
    const newStatus = document.getElementById('newStatus');
    const cancelReasonGroup = document.getElementById('cancelReasonGroup');
    const cancelReason = document.getElementById('cancelReason');
    const modalRequestId = document.getElementById('modalRequestId');
    const currentStatus = document.getElementById('currentStatus');

    // Данные (в реальном приложении будут загружаться с сервера)
    let requests = [
        {
            id: 1,
            fio: "Иванов Иван Иванович",
            phone: "+7(123)-456-78-90",
            service: "Генеральная уборка",
            date: "2023-05-15",
            status: "new",
            address: "ул. Примерная, д. 10, кв. 25",
            comment: "Нужно убрать всю квартиру после ремонта"
        },
        {
            id: 2,
            fio: "Петрова Анна Сергеевна",
            phone: "+7(987)-654-32-10",
            service: "Химчистка дивана",
            date: "2023-05-18",
            status: "in_progress",
            address: "пр. Тестовый, д. 5, кв. 12",
            comment: "Диван светлого цвета, пятна от кофе"
        },
        {
            id: 3,
            fio: "Сидоров Алексей Владимирович",
            phone: "+7(555)-123-45-67",
            service: "Послестроительная уборка",
            date: "2023-05-20",
            status: "completed",
            address: "ул. Демонстрационная, д. 15",
            comment: "Новая квартира, уборка после строителей"
        },
        {
            id: 4,
            fio: "Кузнецова Елена Михайловна",
            phone: "+7(777)-888-99-00",
            service: "Регулярная уборка",
            date: "2023-05-22",
            status: "cancelled",
            cancelReason: "Клиент отменил заказ по личным причинам",
            address: "ул. Образцовая, д. 3, кв. 7",
            comment: "Еженедельная уборка 2-комнатной квартиры"
        }
    ];

    // Текущая выбранная заявка для изменения статуса
    let currentRequestId = null;

    // Инициализация приложения
    function init() {
        setupEventListeners();
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Вход в систему
        loginBtn.addEventListener('click', handleLogin);
        adminPassword.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') handleLogin();
        });

        // Выход из системы
        logoutBtn.addEventListener('click', handleLogout);

        // Фильтрация и поиск заявок
        statusFilter.addEventListener('change', loadRequests);
        searchInput.addEventListener('input', loadRequests);

        // Модальное окно изменения статуса
        closeModalBtn.addEventListener('click', closeStatusModal);
        cancelStatusBtn.addEventListener('click', closeStatusModal);
        statusModal.addEventListener('click', function (e) {
            if (e.target === statusModal) closeStatusModal();
        });

        // Изменение статуса
        newStatus.addEventListener('change', function () {
            cancelReasonGroup.classList.toggle('hidden', this.value !== 'cancelled');
        });
        saveStatusBtn.addEventListener('click', saveStatus);
    }

    // Обработка входа в систему
    function handleLogin() {
        const login = adminLogin.value.trim();
        const password = adminPassword.value.trim();

        if (login === 'adminka' && password === 'password') {
            // Успешный вход
            loginForm.classList.add('hidden');
            adminPanel.classList.remove('hidden');
            loadRequests();
        } else {
            // Ошибка входа
            loginError.textContent = 'Неверный логин или пароль';
        }
    }

    // Обработка выхода из системы
    function handleLogout() {
        adminLogin.value = '';
        adminPassword.value = '';
        loginError.textContent = '';
        adminPanel.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }

    // Загрузка списка заявок
    function loadRequests() {
        const status = statusFilter.value;
        const searchQuery = searchInput.value.toLowerCase();

        // Фильтрация заявок
        let filteredRequests = requests.filter(request => {
            const matchesStatus = status === 'all' || request.status === status;
            const matchesSearch = searchQuery === '' ||
                request.fio.toLowerCase().includes(searchQuery) ||
                request.phone.includes(searchQuery.replace(/\D/g, ''));

            return matchesStatus && matchesSearch;
        });

        // Очистка списка
        requestsList.innerHTML = '';

        if (filteredRequests.length === 0) {
            requestsList.innerHTML = '<div class="no-requests">Нет заявок по выбранным критериям</div>';
            return;
        }

        // Отображение заявок
        filteredRequests.forEach(request => {
            const requestItem = document.createElement('div');
            requestItem.className = 'request-item';
            requestItem.setAttribute('data-id', request.id);

            // Форматирование статуса
            const statusMap = {
                new: {text: 'Новая', class: 'status-new'},
                in_progress: {text: 'В работе', class: 'status-in_progress'},
                completed: {text: 'Выполнена', class: 'status-completed'},
                cancelled: {text: 'Отменена', class: 'status-cancelled'}
            };

            const statusInfo = statusMap[request.status] || {text: request.status, class: ''};

            // Форматирование даты
            const formattedDate = new Date(request.date).toLocaleDateString('ru-RU');

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
            requestItem.querySelector('.change-status-btn').addEventListener('click', () => {
                openStatusModal(request.id);
            });

            requestsList.appendChild(requestItem);
        });
    }

    // Открытие модального окна изменения статуса
    function openStatusModal(requestId) {
        const request = requests.find(r => r.id === requestId);
        if (!request) return;

        currentRequestId = requestId;
        modalRequestId.textContent = requestId;

        // Устанавливаем текущий статус
        const statusMap = {
            new: 'Новая',
            in_progress: 'В работе',
            completed: 'Выполнена',
            cancelled: 'Отменена'
        };

        currentStatus.textContent = statusMap[request.status] || request.status;

        // Сбрасываем форму
        newStatus.value = 'in_progress';
        cancelReason.value = '';
        cancelReasonGroup.classList.add('hidden');

        // Открываем модальное окно
        statusModal.classList.remove('hidden');
    }

    // Закрытие модального окна изменения статуса
    function closeStatusModal() {
        statusModal.classList.add('hidden');
    }

    // Сохранение нового статуса
    function saveStatus() {
        const request = requests.find(r => r.id === currentRequestId);
        if (!request) return;

        const newStatusValue = newStatus.value;
        const cancelReasonValue = cancelReason.value.trim();

        // Валидация
        if (newStatusValue === 'cancelled' && !cancelReasonValue) {
            alert('Укажите причину отмены');
            return;
        }

        // Обновляем статус заявки
        request.status = newStatusValue;

        // Если отмена - сохраняем причину
        if (newStatusValue === 'cancelled') {
            request.cancelReason = cancelReasonValue;
        }

        // В реальном приложении здесь был бы запрос к API

        // Закрываем модальное окно и обновляем список
        closeStatusModal();
        loadRequests();

        alert('Статус заявки успешно обновлен');
    }

    // Инициализация приложения
    init();
});