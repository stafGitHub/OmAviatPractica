document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса
    const historyTab = document.getElementById('historyTab');
    const newTab = document.getElementById('newTab');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const requestForm = document.getElementById('requestForm');
    const requestsList = document.getElementById('requestsList');
    const statusFilter = document.getElementById('statusFilter');
    const logoutBtn = document.getElementById('logoutBtn');
    const modal = document.getElementById('requestModal');
    const closeModalBtn = document.querySelector('.close-btn');
    const cancelRequestBtn = document.getElementById('cancelRequestBtn');

    // Текущий пользователь (в реальном приложении получаем из системы авторизации)
    let currentUser = {
        id: 1,
        name: "Иван Иванов",
        email: "ivan@example.com"
    };

    // Моковые данные заявок
    let requests = [
        {
            id: 1,
            userId: 1,
            type: "repair",
            description: "Не работает кран на кухне, протекает вода",
            priority: "high",
            status: "completed",
            createdAt: "2023-05-10T14:30:00",
            completedAt: "2023-05-12T10:15:00",
            desiredDate: "2023-05-11"
        },
        {
            id: 2,
            userId: 1,
            type: "cleaning",
            description: "Генеральная уборка квартиры перед приездом гостей",
            priority: "medium",
            status: "in_progress",
            createdAt: "2023-06-01T09:45:00",
            desiredDate: "2023-06-05"
        },
        {
            id: 3,
            userId: 1,
            type: "other",
            description: "Установка кондиционера в спальне",
            priority: "low",
            status: "new",
            createdAt: "2023-06-15T16:20:00",
            desiredDate: "2023-06-20"
        }
    ];

    // Инициализация страницы
    function init() {
        document.getElementById('username').textContent = currentUser.name;
        loadRequests();
        setupEventListeners();
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Переключение вкладок
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                switchTab(tabId);
            });
        });

        // Фильтрация заявок
        statusFilter.addEventListener('change', loadRequests);

        // Отправка формы новой заявки
        requestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitNewRequest();
        });

        // Выход из системы
        logoutBtn.addEventListener('click', function() {
            // В реальном приложении здесь был бы запрос на сервер для выхода
            window.location.href = 'login.html';
        });

        // Закрытие модального окна
        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Отмена заявки
        cancelRequestBtn.addEventListener('click', cancelCurrentRequest);
    }

    // Переключение между вкладками
    function switchTab(tabId) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.tab-btn[data-tab="${tabId}"']`).classList.add('active');

        historyTab.classList.add('hidden');
        newTab.classList.add('hidden');
        document.getElementById(`${tabId}Tab`).classList.remove('hidden');
    }

    // Загрузка списка заявок
    function loadRequests() {
        const status = statusFilter.value;
        
        // Фильтрация заявок
        let filteredRequests = requests.filter(request => request.userId === currentUser.id);
        
        if (status !== 'all') {
            filteredRequests = filteredRequests.filter(request => request.status === status);
        }
        // Сортировка по дате создания (новые сначала)
        filteredRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Очистка списка
        requestsList.innerHTML = '';

        if (filteredRequests.length === 0) {
            requestsList.innerHTML = '<div class="loading">Нет заявок по выбранному фильтру</div>';
            return;
        }

        // Отображение заявок
        filteredRequests.forEach(request => {
            const requestCard = document.createElement('div');
            requestCard.className = 'request-card';
            requestCard.setAttribute('data-id', request.id);
            
            const typeMap = {
                repair: 'Ремонт',
                cleaning: 'Уборка',
                delivery: 'Доставка',
                other: 'Другое'
            };
            
            const statusMap = {
                new: { text: 'Новая', class: 'status-new' },
                in_progress: { text: 'В работе', class: 'status-in_progress' },
                completed: { text: 'Завершена', class: 'status-completed' },
                cancelled: { text: 'Отменена', class: 'status-cancelled' }
            };
            
            const createdAt = new Date(request.createdAt).toLocaleString('ru-RU');
            const desiredDate = request.desiredDate ? new Date(request.desiredDate).toLocaleDateString('ru-RU') : 'Не указана';
            
            requestCard.innerHTML = ` 
                <h3>${typeMap[request.type] || 'Заявка'} #${request.id}</h3>
                <div class="request-meta">
                    <span>${createdAt}</span>
                    <span class="request-status ${statusMap[request.status].class}">
                        ${statusMap[request.status].text}
                    </span>
                </div>
                <div class="request-description">${request.description}</div>
                <div class="request-meta" style="margin-top: 10px;">
                    <span>Желаемая дата: ${desiredDate}</span>
                    <span>Приоритет: ${request.priority === 'high' ? 'Высокий' : request.priority === 'medium' ? 'Средний' : 'Низкий'}</span>
                </div>
            `;
            
            requestCard.addEventListener('click', () => openRequestDetails(request.id));
            requestsList.appendChild(requestCard);
        });
    }

    // Открытие деталей заявки
    function openRequestDetails(requestId) {
        const request = requests.find(r => r.id === requestId);
        if (!request) return;
        
        const typeMap = {
            repair: 'Ремонт',
            cleaning: 'Уборка',
            delivery: 'Доставка',
            other: 'Другое'
        };
        
        const statusMap = {
            new: 'Новая',
            in_progress: 'В работе',
            completed: 'Завершена',
            cancelled: 'Отменена'
        };
        
        const priorityMap = {
            high: 'Высокий',
            medium: 'Средний',
            low: 'Низкий'
        };
        
        const createdAt = new Date(request.createdAt).toLocaleString('ru-RU');
        const desiredDate = request.desiredDate ? new Date(request.desiredDate).toLocaleDateString('ru-RU') : 'Не указана';
        const completedAt = request.completedAt ? new Date(request.completedAt).toLocaleString('ru-RU') : 'Не завершена';
        
        document.getElementById('modalTitle').textContent = `${typeMap[request.type] || 'Заявка'} #${request.id}`;
        
        document.getElementById('modalBody').innerHTML = `
            <div class="modal-field">
                <strong>Статус:</strong> ${statusMap[request.status]}
            </div>
            <div class="modal-field">
                <strong>Дата создания:</strong> ${createdAt}
            </div>
            <div class="modal-field">
                <strong>Желаемая дата выполнения:</strong> ${desiredDate}
            </div>
            <div class="modal-field">
                <strong>Дата завершения:</strong> ${completedAt}
            </div>
            <div class="modal-field">
                <strong>Приоритет:</strong> ${priorityMap[request.priority]}
            </div>
            <div class="modal-field">
                <strong>Тип заявки:</strong> ${typeMap[request.type] || 'Другое'}
            </div>
            <div class="modal-field" style="margin-top: 20px;">
                <strong>Описание:</strong>
                <div style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                    ${request.description}
                </div>
            </div>
        `;
        
        // Показываем/скрываем кнопку отмены в зависимости от статуса
        if (request.status === 'new' || request.status === 'in_progress') {
            cancelRequestBtn.style.display = 'block';
            cancelRequestBtn.setAttribute('data-id', request.id);
        } else {
            cancelRequestBtn.style.display = 'none';
        }
        
        openModal();
    }

    // Отправка новой заявки
    function submitNewRequest() {
        const type = document.getElementById('requestType').value;
        const description = document.getElementById('requestDescription').value.trim();
        const priority = document.getElementById('requestPriority').value;
        const desiredDate = document.getElementById('requestDate').value;
        
        // Валидация
        if (!type || !description) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        // Создаем новую заявку
        const newRequest = {
            id: requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1,
            userId: currentUser.id,
            type,
            description,
            priority,
            status: "new",
            createdAt: new Date().toISOString(),
            desiredDate: desiredDate || null
        };
        
        // В реальном приложении здесь был бы запрос к API
        requests.unshift(newRequest);
        
        // Очищаем форму
        requestForm.reset();
        
        // Показываем уведомление
        alert('Заявка успешно создана!');
        
        // Переключаемся на вкладку истории и обновляем список
        switchTab('history');
        loadRequests();
    }

    // Отмена заявки
    function cancelCurrentRequest() {
        const requestId = parseInt(cancelRequestBtn.getAttribute('data-id'));
        const requestIndex = requests.findIndex(r => r.id === requestId);
        
        if (requestIndex === -1) return;
        
        if (confirm('Вы уверены, что хотите отменить эту заявку?')) {
            // В реальном приложении здесь был бы запрос к API
            requests[requestIndex].status = 'cancelled';
            requests[requestIndex].completedAt = new Date().toISOString();
            
            // Закрываем модальное окно и обновляем список
            closeModal();
            loadRequests();
        }
    }

    // Открытие модального окна
    function openModal() {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // Закрытие модального окна
    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }});
    }

    // Инициализация приложения
    init();
});