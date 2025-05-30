document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('orderForm');

    // Маска для телефона
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function (e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        e.target.value = !x[2] ? x[1] : '+' + x[1] + '(' + x[2] + (x[3] ? ')-' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
    });

    const serviceRadios = document.querySelectorAll("input[name='service']")
    const otherServiceRadio = document.getElementById('otherService');
    const otherServiceGroup = document.getElementById('otherServiceGroup');

    // Показать/скрыть поле для другой услуги
    serviceRadios.forEach((radio) => {
        radio.addEventListener('change', function () {
        if (otherServiceRadio.checked === true) {
            otherServiceGroup.style.display = 'block';
        } else {
            otherServiceGroup.style.display = 'none';
            document.getElementById('otherServiceText').value = '';
            document.getElementById('otherServiceError').textContent = '';
        }
    });})

    // Валидация формы
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const service = document.querySelector('input[name="service"]:checked');
        const otherServiceText = document.getElementById('otherServiceText').value.trim();
        const payment = document.querySelector('input[name="payment"]:checked');

        let isValid = true;

        // Сброс ошибок
        document.querySelectorAll('.error').forEach(el => el.textContent = '');

        // Валидация адреса
        if (address === '') {
            document.getElementById('addressError').textContent = 'Введите адрес';
            isValid = false;
        }

        // Валидация телефона
        const phoneRegex = /^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(phone)) {
            document.getElementById('phoneError').textContent = 'Введите телефон в формате +7(XXX)-XXX-XX-XX';
            isValid = false;
        }

        // Валидация даты
        if (date === '') {
            document.getElementById('dateError').textContent = 'Выберите дату';
            isValid = false;
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                document.getElementById('dateError').textContent = 'Дата не может быть в прошлом';
                isValid = false;
            }
        }

        // Валидация времени
        if (time === '') {
            document.getElementById('timeError').textContent = 'Выберите время';
            isValid = false;
        }

        // Валидация услуги
        if (!service) {
            document.getElementById('serviceError').textContent = 'Выберите вид услуги';
            isValid = false;
        } else if (service.value === 'other' && otherServiceText === '') {
            document.getElementById('otherServiceError').textContent = 'Опишите вашу услугу';
            isValid = false;
        }

        // Валидация оплаты
        if (!payment) {
            document.getElementById('paymentError').textContent = 'Выберите способ оплаты';
            isValid = false;
        }

        // Если все данные валидны, отправляем заявку
        if (isValid) {
            submitOrder({
                address,
                phone, date,
                time,
                service: service.value === 'other' ? otherServiceText : service.value,
                payment: payment.value
            });
        }
    });

    function submitOrder(orderData) {
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        /*
            Эндпоинт: /api/orders (POST)
            Ответ от сервера выглядит как:
            {
                "success": boolean;
                "message": "сообщение на случай пиздеца"
            }
         */
        fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Заявка успешно отправлена!');
                form.reset();
                otherServiceGroup.style.display = 'none';
            } else {
                alert('Ошибка при отправке заявки: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке заявки');
        })
            .finally(() => submitButton.disabled = false);
    }
});