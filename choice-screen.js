// NUMERICAN - Professional JS with smooth transitions

class Carousel {
    constructor() {
        this.carouselInner = document.querySelector('.carousel-inner');
        this.cards = document.querySelectorAll('.card');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.arrow-left');
        this.nextBtn = document.querySelector('.arrow-right');
        this.cardButtons = document.querySelectorAll('.card-bottom-btn');
        this.backBtn = document.getElementById('backToMainBtn');
        
        this.currentIndex = 0;
        
        // Динамически определяем ширину карточки
        this.cardWidth = this.cards[0].offsetWidth;
        
        this.totalCards = this.cards.length;
        
        // Параметры для плавности
        this.isAnimating = false;
        this.animationDuration = 400; // ms
        this.swipeThreshold = 50;
        
        // Для тач-событий
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.isSwiping = false;
        
        // Для колеса мыши
        this.wheelTimeout = null;
        this.wheelCooldown = 1000; // Задержка между прокрутками
        
        this.init();
    }
    
    init() {
        this.setupBackButton();
        this.setupNavigation();
        this.setupCardButtons();
        this.setupTouchEvents();
        this.setupWheelEvents();
        this.initTelegramWebApp();
        this.updateCarousel();
        
        // Обновляем ширину при ресайзе
        window.addEventListener('resize', () => {
            this.cardWidth = this.cards[0].offsetWidth;
            this.updateCarousel();
        });
    }
    
    setupBackButton() {
        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => {
                if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
                    Telegram.WebApp.close();
                } else {
                    window.location.href = 'index.html';
                }
            });
        }
    }
    
    setupNavigation() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.goTo(index);
                }
            });
        });
    }
    
    setupCardButtons() {
        this.cardButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const card = btn.closest('.card');
                const cardType = card.dataset.type;
                const cardTitle = card.querySelector('.card-title').textContent;
                
                // Минимальная анимация
                btn.style.transform = 'scale(0.98)';
                setTimeout(() => btn.style.transform = '', 150);
                
                this.showSelectionModal(cardType, cardTitle);
            });
        });
    }
    
    setupTouchEvents() {
        // Touch start
        this.carouselInner.addEventListener('touchstart', (e) => {
            if (this.isAnimating) return;
            
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.isSwiping = true;
        }, { passive: true });
        
        // Touch move - добавляем визуальный фидбек
        this.carouselInner.addEventListener('touchmove', (e) => {
            if (!this.isSwiping || this.isAnimating) return;
            
            const currentX = e.touches[0].clientX;
            const diff = this.touchStartX - currentX;
            
            // Небольшое смещение для визуального фидбека (максимум 30px)
            if (Math.abs(diff) < 100) {
                this.carouselInner.style.transition = 'none';
                this.carouselInner.style.transform = `translateX(calc(-${this.currentIndex * this.cardWidth}px - ${diff * 0.3}px))`;
            }
        }, { passive: true });
        
        // Touch end
        this.carouselInner.addEventListener('touchend', (e) => {
            if (!this.isSwiping || this.isAnimating) return;
            
            this.isSwiping = false;
            this.touchEndX = e.changedTouches[0].clientX;
            this.touchEndY = e.changedTouches[0].clientY;
            
            const diffX = this.touchStartX - this.touchEndX;
            const diffY = this.touchStartY - this.touchEndY;
            
            // Проверяем, что это горизонтальный свайп, а не вертикальный
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.swipeThreshold) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            } else {
                // Возвращаем на место если свайп недостаточный
                this.updateCarousel();
            }
        }, { passive: true });
    }
    
    setupWheelEvents() {
        this.carouselInner.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            // Защита от слишком частой прокрутки
            if (this.isAnimating || this.wheelTimeout) return;
            
            // Определяем направление
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                if (e.deltaY > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            } else {
                if (e.deltaX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            
            // Устанавливаем кулдаун
            this.wheelTimeout = setTimeout(() => {
                this.wheelTimeout = null;
            }, this.wheelCooldown);
        }, { passive: false });
    }
    
    updateCarousel() {
        // Обновляем ширину карточки (на случай ресайза)
        this.cardWidth = this.cards[0].offsetWidth;
        
        // Восстанавливаем transition
        this.carouselInner.style.transition = `transform ${this.animationDuration}ms cubic-bezier(0.23, 1, 0.32, 1)`;
        this.carouselInner.style.transform = `translateX(-${this.currentIndex * this.cardWidth}px)`;
        
        // Обновление точек
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
        
        // Субтильная анимация карточек
        this.cards.forEach((card, index) => {
            card.style.transition = `all ${this.animationDuration}ms cubic-bezier(0.23, 1, 0.32, 1)`;
            card.style.opacity = index === this.currentIndex ? '1' : '0.96';
            card.style.transform = index === this.currentIndex ? 'translateY(0) scale(1)' : 'translateY(2px) scale(0.99)';
        });
    }
    
    goTo(index) {
        if (this.isAnimating) return;
        
        if (index < 0) index = this.totalCards - 1;
        if (index >= this.totalCards) index = 0;
        
        this.currentIndex = index;
        this.isAnimating = true;
        
        this.updateCarousel();
        
        // Сбрасываем флаг анимации
        setTimeout(() => {
            this.isAnimating = false;
        }, this.animationDuration);
    }
    
    next() {
        if (this.isAnimating) return;
        this.goTo(this.currentIndex + 1);
    }
    
    prev() {
        if (this.isAnimating) return;
        this.goTo(this.currentIndex - 1);
    }
    
    showSelectionModal(cardType, cardTitle) {
        const config = {
            basic: {
                title: 'Базовый пакет',
                price: 'Бесплатно',
                action: 'Получить бесплатно',
                description: 'Бесплатный обзор ключевых событий вашего года'
            },
            extended: {
                title: 'Расширенный пакет',
                price: '399 ₽',
                action: 'Приобрести анализ',
                description: 'Детальный анализ всех сфер жизни на 2026 год'
            },
            premium: {
                title: 'Премиум пакет',
                price: '599 ₽',
                action: 'Приобрести всё включено',
                description: 'Полный нумерологический расклад с эксклюзивными материалами'
            }
        };
        
        const data = config[cardType];
        
        // Создание модального окна
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 6, 20, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(20px);
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(145deg, rgba(26, 15, 51, 0.9), rgba(11, 7, 25, 0.95));
                padding: 40px;
                border-radius: 24px;
                border: 1px solid rgba(157, 138, 255, 0.1);
                max-width: 320px;
                margin: 20px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            ">
                <h3 style="
                    color: #f0e6ff;
                    font-family: 'Cinzel', serif;
                    font-size: 1.5rem;
                    font-weight: 500;
                    margin-bottom: 20px;
                    letter-spacing: 0.5px;
                ">
                    ${data.title}
                </h3>
                
                <p style="
                    color: #b8a9ff;
                    margin-bottom: 30px;
                    line-height: 1.5;
                    font-size: 1rem;
                    opacity: 0.9;
                ">
                    ${data.description}
                </p>
                
                <div style="
                    background: rgba(157, 138, 255, 0.05);
                    padding: 20px;
                    border-radius: 16px;
                    margin-bottom: 30px;
                    border: 1px solid rgba(157, 138, 255, 0.1);
                ">
                    <div style="
                        color: #f0e6ff;
                        font-family: 'Cinzel', serif;
                        font-size: 2.2rem;
                        font-weight: 400;
                    ">
                        ${data.price}
                    </div>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <button class="modal-confirm" style="
                        background: rgba(157, 138, 255, 0.1);
                        border: 1px solid rgba(157, 138, 255, 0.2);
                        color: #c8b6ff;
                        padding: 18px;
                        border-radius: 14px;
                        font-family: 'Cinzel', serif;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.3s;
                        font-size: 1rem;
                        letter-spacing: 0.5px;
                    ">
                        ${data.action}
                    </button>
                    
                    <button class="modal-cancel" style="
                        background: transparent;
                        border: 1px solid rgba(157, 138, 255, 0.1);
                        color: #b8a9ff;
                        padding: 18px;
                        border-radius: 14px;
                        font-family: 'Cinzel', serif;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.3s;
                        font-size: 1rem;
                    ">
                        Отмена
                    </button>
                </div>
            </div>
        `;
        
        // Добавление стилей
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
            
            .modal-confirm:hover {
                background: rgba(157, 138, 255, 0.15) !important;
                border-color: rgba(157, 138, 255, 0.3) !important;
                color: #e6e0ff !important;
                transform: translateY(-1px);
            }
            
            .modal-cancel:hover {
                background: rgba(157, 138, 255, 0.05) !important;
                border-color: rgba(157, 138, 255, 0.2) !important;
                color: #d8c9ff !important;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Обработчики
        const confirmBtn = modal.querySelector('.modal-confirm');
        const cancelBtn = modal.querySelector('.modal-cancel');
        
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                modal.remove();
                style.remove();
            }, 300);
        };
        
        confirmBtn.addEventListener('click', () => {
            closeModal();
            this.showNotification(cardType === 'basic' ? 
                'Открываем форму для базового пакета...' : 
                'Подготавливаем платёжную форму...');
        });
        
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    showNotification(text) {
        const notification = document.createElement('div');
        notification.textContent = text;
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(26, 15, 51, 0.9);
            border: 1px solid rgba(157, 138, 255, 0.15);
            color: #c8b6ff;
            padding: 14px 28px;
            border-radius: 12px;
            font-family: 'Cinzel', serif;
            font-size: 0.9rem;
            z-index: 1000;
            animation: slideUp 0.3s ease;
            max-width: 90%;
            text-align: center;
            backdrop-filter: blur(10px);
            letter-spacing: 0.5px;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 2000);
    }
    
    initTelegramWebApp() {
        if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            Telegram.WebApp.setBackgroundColor('#0a0614');
            
            // Принудительный перерасчет размеров после загрузки
            setTimeout(() => {
                this.cardWidth = this.cards[0].offsetWidth;
                this.updateCarousel();
            }, 100);
            
            Telegram.WebApp.MainButton.text = "← Назад";
            Telegram.WebApp.MainButton.color = "#1a0f33";
            Telegram.WebApp.MainButton.textColor = "#c8b6ff";
            Telegram.WebApp.MainButton.isVisible = true;
            
            Telegram.WebApp.MainButton.onClick(() => {
                window.location.href = 'index.html';
            });
        }
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});

// Предотвращаем масштабирование на мобильных
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// Предотвращаем контекстное меню на карточках
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.card')) {
        e.preventDefault();
    }
});
