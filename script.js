// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Элементы
    const aboutBtn = document.getElementById('aboutBtn');
    const getReportBtn = document.getElementById('getReportBtn');
    const aboutPopup = document.getElementById('aboutPopup');
    const closePopup = document.getElementById('closePopup');
    const popupOverlay = document.querySelector('.popup-overlay');
    
    // Отключение скролла на body
    document.body.style.overflow = 'hidden';
    
    // Открытие попапа
    aboutBtn.addEventListener('click', function() {
        aboutPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Закрытие попапа
    function closeAboutPopup() {
        aboutPopup.classList.remove('active');
        document.body.style.overflow = 'hidden';
    }
    
    closePopup.addEventListener('click', closeAboutPopup);
    popupOverlay.addEventListener('click', closeAboutPopup);
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && aboutPopup.classList.contains('active')) {
            closeAboutPopup();
        }
    });
    
    // Кнопка "Получить расклад"
    getReportBtn.addEventListener('click', function() {
        // Анимация нажатия
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Показ сообщения о скором запуске
        showFormMessage();
    });
    
    // Блокировка скролла при касании на попапе
    const popupBody = document.querySelector('.popup-body');
    if (popupBody) {
        popupBody.addEventListener('touchmove', function(e) {
            e.stopPropagation();
        }, { passive: false });
    }
    
    // Инициализация Telegram WebApp
    initTelegramWebApp();
});

// Функция для показа сообщения о форме
function showFormMessage() {
    // Создаем сообщение
    const message = document.createElement('div');
    message.className = 'form-message';
    message.innerHTML = `
        <div class="message-content">
            <i class="fas fa-crystal-ball"></i>
            <h3>Магия чисел готовится</h3>
            <p>Форма для получения персонального расклада скоро откроется</p>
            <button class="close-message">ПОНЯТНО</button>
        </div>
    `;
    
    // Стили для сообщения
    message.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(5, 3, 16, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
        animation: fadeIn 0.3s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .message-content {
            background: linear-gradient(135deg, rgba(26, 15, 51, 0.95), rgba(11, 7, 25, 0.98));
            padding: 30px;
            border-radius: 15px;
            border: 1px solid rgba(157, 138, 255, 0.3);
            text-align: center;
            max-width: 300px;
            margin: 20px;
            box-shadow: 0 0 40px rgba(157, 138, 255, 0.3);
        }
        
        .message-content i {
            font-size: 2.5rem;
            color: #9d8aff;
            margin-bottom: 15px;
        }
        
        .message-content h3 {
            color: #f0e6ff;
            font-family: 'Cinzel', serif;
            margin-bottom: 10px;
            font-size: 1.3rem;
        }
        
        .message-content p {
            color: #b8a9ff;
            margin-bottom: 20px;
            line-height: 1.5;
            font-size: 0.95rem;
        }
        
        .message-content button {
            background: linear-gradient(45deg, #5d4a8a, #9d8aff);
            color: #f0e6ff;
            border: none;
            padding: 12px 25px;
            border-radius: 50px;
            font-family: 'Cinzel', serif;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 0.9rem;
            width: 100%;
        }
        
        .message-content button:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 20px rgba(157, 138, 255, 0.5);
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(message);
    
    // Закрытие сообщения
    message.querySelector('.close-message').addEventListener('click', function() {
        message.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            message.remove();
            style.remove();
        }, 300);
    });
    
    // Анимация исчезновения
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(fadeOutStyle);
}

// Инициализация Telegram WebApp
function initTelegramWebApp() {
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        // Инициализация
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        
        // Установка цвета фона
        Telegram.WebApp.setBackgroundColor('#0b0719');
        
        // Настройка основной кнопки
        Telegram.WebApp.MainButton.text = "🔮 ПОЛУЧИТЬ РАСКЛАД";
        Telegram.WebApp.MainButton.color = "#9d8aff";
        Telegram.WebApp.MainButton.textColor = "#0b0719";
        Telegram.WebApp.MainButton.isVisible = true;
        
        // Обработчик клика по основной кнопке
        Telegram.WebApp.MainButton.onClick(function() {
            document.getElementById('getReportBtn').click();
        });
        
        // Обработчик изменения размера окна
        Telegram.WebApp.onEvent('viewportChanged', function() {
            adjustForViewport();
        });
        
        // Обработчик изменения темы
        Telegram.WebApp.onEvent('themeChanged', function() {
            setTelegramTheme();
        });
        
        // Настройка начальной темы
        setTelegramTheme();
        adjustForViewport();
    }
}

// Настройка под размеры Telegram WebApp
function adjustForViewport() {
    const viewportHeight = window.innerHeight;
    const content = document.querySelector('.content-wrapper');
    
    if (viewportHeight < 600) {
        content.style.gap = '20px';
    } else {
        content.style.gap = '30px';
    }
}

// Установка темы Telegram
function setTelegramTheme() {
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        const theme = Telegram.WebApp.colorScheme;
        
        if (theme === 'light') {
            // Для светлой темы Telegram
            document.body.style.background = '#1a0f33';
            document.documentElement.style.setProperty('--primary-bg', '#1a0f33');
        } else {
            // Для тёмной темы (по умолчанию)
            document.body.style.background = '#0b0719';
            document.documentElement.style.setProperty('--primary-bg', '#0b0719');
        }
    }
}

// Предотвращение масштабирования на мобильных устройствах
document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });