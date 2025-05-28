document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    
    // Обработка отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Сброс предыдущих ошибок
        document.getElementById('usernameError').textContent = '';
        document.getElementById('passwordError').textContent = '';
        
        // Валидация полей
        let isValid = true;
        
        if (username === '') {
            document.getElementById('usernameError').textContent = 'Введите логин';
            isValid = false;
        }
        
        if (password === '') {
            document.getElementById('passwordError').textContent = 'Введите пароль';
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Эмуляция отправки данных на сервер
        authenticateUser(username, password);
    });
    
    // Функция аутентификации пользователя
    function authenticateUser(username, password) {
        // Здесь должна быть реализация отправки данных на сервер
        // Например, с помощью fetch API
        
        // Для демонстрации используем mock-данные
        const mockUsers = [
            { username: 'admin', password: 'admin123' },
            { username: 'user', password: 'user123' }
        ];
        
        // Эмуляция задержки сети
        setTimeout(() => {
            const user = mockUsers.find(u => u.username === username && u.password === password);
            
            if (user) {
                // Успешная авторизация
                showMessage('Авторизация успешна! Перенаправление...', 'success');
                
                // В реальном приложении здесь было бы перенаправление
                // window.location.href = '/dashboard';
            } else {
                // Ошибка авторизации
                showMessage('Неверный логин или пароль', 'error');
                document.getElementById('passwordError').textContent = 'Неверный пароль';
            }
        }, 1000);
        
        // Реальный пример с fetch:
        /*
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка авторизации');
            return response.json();
        })
        .then(data => {
            // Сохраняем токен или делаем перенаправление
            localStorage.setItem('authToken', data.token);
            window.location.href = '/dashboard';
        })
        .catch(error => {
            showMessage('Неверный логин или пароль', 'error');
            document.getElementById('passwordError').textContent = 'Неверный пароль';
        });
        */
    }
    
    // Показать сообщение для пользователя
    function showMessage(text, type) {
        // Удаляем предыдущие сообщения
        const oldMessage = document.querySelector('.message');
        if (oldMessage) oldMessage.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = message ${type}-message;
        messageDiv.textContent = text;
        
        const container = document.querySelector('.container');
        container.insertBefore(messageDiv, form);
    }

const adminCredentials = {
  login: 'admin',
  password: 'adminka'
};

// Проверка статуса входа при загрузке любой страницы
window.addEventListener('DOMContentLoaded', () => {
  updateAdminPanelVisibility();
});

// Обновление видимости админской панели
function updateAdminPanelVisibility() {
  if (localStorage.getItem('isAdminLoggedIn') === 'true') {
    showAdminPanel();
  } else {
    hideAdminPanel();
  }
}

// Показать панель администратора
function showAdminPanel() {
  const adminSection = document.getElementById('adminPanel');
  if (adminSection) {
    adminSection.classList.remove('hidden');
  }
}

// Скрыть панель администратора
function hideAdminPanel() {
  const adminSection = document.getElementById('adminPanel');
  if (adminSection) {
    adminSection.classList.add('hidden');
  }
}

// Обработка формы входа (если есть форма на странице)
function setupLoginForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = form.querySelector('#username').value.trim();
    const password = form.querySelector('#password').value.trim();

    if (username === adminCredentials.login && password === adminCredentials.password) {
      localStorage.setItem('isAdminLoggedIn', 'true');
      alert('Вы вошли как админ');
      updateAdminPanelVisibility();
      // Можно перенаправить или оставить на текущей странице
      // window.location.href = 'index.html'; // раскомментировать при необходимости
    } else {
      alert('Неверный логин или пароль');
    }
  });
}

// Выйти из админ-панели
function adminLogout() {
  localStorage.setItem('isAdminLoggedIn', 'false');
  updateAdminPanelVisibility();
}
});