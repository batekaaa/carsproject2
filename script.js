// Global data setup for the comparison modal
const carData = [
    // Original 11 cars
    { id: "chiron", name: "Bugatti Chiron", engine: "Quad-turbo W16", acceleration: "~2.4s", power: "~1500 hp", price: "€2.5M+", img: "chiron.jpg" },
    { id: "porsche", name: "Porsche 911", engine: "Flat-6 variants", acceleration: "3.5s (varies)", power: "385–650+ hp", price: "$100K+", img: "911.jpg" },
    { id: "aventador", name: "Lamborghini Aventador", engine: "V12", acceleration: "~2.9s", power: "730-770 hp", price: "$400K+", img: "aventador.jpg" },
    { id: "g-wagon", name: "Mercedes G-Wagon", engine: "V8 (varies)", acceleration: "4.5s (AMG)", power: "416–577 hp", price: "$130K+", img: "gelik.jpg" },
    { id: "gtr", name: "Nissan GT-R", engine: "Twin-turbo V6", acceleration: "2.8s", power: "565+ hp", price: "$110K+", img: "gtr.jpg" },
    { id: "laferrari", name: "Ferrari LaFerrari", engine: "Hybrid V12", acceleration: "~2.5s", power: "950 hp (system)", price: "€1.4M+", img: "laferrari.jpg" },
    { id: "m3", name: "BMW M3", engine: "Twin-turbo I6", acceleration: "3.9s", power: "473-503 hp", price: "$75K+", img: "m3.jpg" },
    { id: "mustang", name: "Ford Mustang", engine: "V8 (varies)", acceleration: "4.0s (GT)", power: "310-480 hp", price: "$30K+", img: "mustang.jpg" },
    { id: "r8", name: "Audi R8", engine: "V10", acceleration: "3.2s", power: "532-610 hp", price: "$150K+", img: "r8.jpg" },
    { id: "rs7", name: "Audi RS7", engine: "Twin-turbo V8", acceleration: "3.6s", power: "~600 hp", price: "$120K+", img: "rs7.jpg" },
    { id: "supra", name: "Toyota Supra", engine: "3.0L Turbo I6", acceleration: "4.1s", power: "~382 hp", price: "$45K+", img: "supra.jpg" },
];

let comparisonList = [];
let favoritesList = []; // НОВОЕ: Массив для избранного

// НОВОЕ: Настройка звуковых эффектов (Убедитесь, что файлы MP3 находятся в папке 'sounds')
const clickSound = new Audio('sounds/click.mp3'); 
const vroomSound = new Audio('sounds/vroom.mp3'); 
const metallicClickSound = new Audio('sounds/metallic-click.mp3'); 

console.log("✅ JavaScript loaded!");


// ==========================
// 0. FAVORITES (LOCAL STORAGE)
// ==========================
function loadFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    // Хранение только ID, т.к. полные данные есть в carData
    favoritesList = storedFavorites ? JSON.parse(storedFavorites) : []; 
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favoritesList));
}

function updateFavoriteIcons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const carId = btn.getAttribute('data-car-id');
        const iconSpan = btn.querySelector('.favorite-icon');
        
        if (favoritesList.includes(carId)) {
            iconSpan.textContent = '❤️'; // Красное сердце
            btn.classList.add('active-favorite');
        } else {
            iconSpan.textContent = '🤍'; // Белое сердце
            btn.classList.remove('active-favorite');
        }
    });
}

document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const carId = this.getAttribute('data-car-id');
        const index = favoritesList.indexOf(carId);

        if (index === -1) {
            favoritesList.push(carId);
            alert(`${carId.toUpperCase()} added to Favorites!`);
            clickSound.play(); // Звук при добавлении
        } else {
            favoritesList.splice(index, 1);
            alert(`${carId.toUpperCase()} removed from Favorites.`);
            metallicClickSound.play(); // Звук при удалении
        }

        saveFavorites();
        updateFavoriteIcons();
    });
});

// Загрузка при старте
loadFavorites();
updateFavoriteIcons();


// ==========================
// 1. FORM VALIDATION
// ==========================
const form = document.getElementById("myForm");
const msgContainer = document.createElement("p");
msgContainer.id = "formMsg";
msgContainer.style.textAlign = "center";
msgContainer.style.fontWeight = "bold";
msgContainer.style.opacity = 0;
msgContainer.style.transition = "opacity 0.5s";
document.body.prepend(msgContainer); 

if (form) {
    document.getElementById("password")?.setAttribute("minlength", "6");
    document.getElementById("confirm")?.setAttribute("minlength", "6");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirm = document.getElementById("confirm").value;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

        let errorMsg = "";

        if (!name || !email || !password || !confirm) {
            errorMsg += "All required fields must be filled out.\n";
        }
        if (email && !emailRegex.test(email)) {
            errorMsg += "Enter a valid email address (example@domain.com).\n";
        }
        if (password && password.length < 6) {
             errorMsg += "Password must be at least 6 characters.\n";
        }
        if (password !== confirm) {
            errorMsg += "Passwords do not match.\n";
        }

        if (errorMsg) {
            msgContainer.textContent = errorMsg.trim();
            msgContainer.style.color = "red"; 
            msgContainer.style.opacity = 1;
        } else {
            msgContainer.textContent = "✅ Form submitted successfully! (No real data sent)";
            msgContainer.style.color = "lightgreen"; 
            msgContainer.style.opacity = 1;
            clickSound.play(); // Звук при успешной отправке
            form.reset();
        }

        setTimeout(() => (msgContainer.style.opacity = 0), 4000);
    });
    
    document.getElementById("resetFormBtn")?.addEventListener('click', () => {
        form.reset();
        msgContainer.textContent = "";
        msgContainer.style.opacity = 0;
        metallicClickSound.play(); // Звук при сбросе
    });
}

// ==========================
// 2. DETAILS MODAL (Bootstrap logic)
// ==========================
(function () {
    const detailsModal = document.getElementById('detailsModal');
    if (!detailsModal) return;

    detailsModal.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        if (!button) return;

        const name = button.getAttribute('data-name');
        const desc = button.getAttribute('data-desc');
        const img = button.getAttribute('data-img');

        document.getElementById('modalCarTitle').textContent = name;
        document.getElementById('modalCarDesc').textContent = desc;

        const imgEl = document.getElementById('modalCarImg');
        imgEl.src = img;
        imgEl.alt = name;
    });
})();

// ... (Остальной код для RATING STARS, POPUP, LIVE DATE & TIME) ...
// (Опущен для краткости, т.к. он остался без изменений, кроме той же логики звука)

// ==========================
// 6. DARK MODE TOGGLE (with localStorage persistence)
// ==========================
const themeBtn = document.getElementById("toggleTheme");
if (themeBtn) {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
        document.body.classList.add('dark');
    }

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        metallicClickSound.play(); // НОВОЕ: Звук при переключении
        
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}

// ==========================
// 7. DYNAMIC BACKGROUND (COLOR FLASH)
// ==========================
const colorBtn = document.getElementById("colorBtn");
const navbar = document.querySelector("nav.navbar");
const allCards = document.querySelectorAll(".card"); 

const gradients = [
    "linear-gradient(135deg, #00BFFF, #1E90FF)", // Blue theme gradient
    "linear-gradient(135deg, #FFD700, #F7C51F)", // Gold theme gradient
    "linear-gradient(135deg, #FF4D4D, #FF9999)", // Red theme gradient
];

let colorIndex = 0;

if (colorBtn) {
    colorBtn.addEventListener("click", () => {
        if (!colorBtn.dataset.originalBg) {
            colorBtn.dataset.originalBg = getComputedStyle(document.body).background;
        }

        const newColor = gradients[colorIndex];
        
        document.body.style.transition = "background 1s ease-in-out";
        document.body.style.background = newColor;

        if (navbar) navbar.style.backgroundColor = "rgba(0,0,0,0.7)";
        
        allCards.forEach(c => c.classList.add('flash-card-effect'));

        setTimeout(() => {
            document.body.style.background = colorBtn.dataset.originalBg;
            if (navbar) navbar.style.backgroundColor = ""; 
            allCards.forEach(c => c.classList.remove('flash-card-effect'));

        }, 8000); 

        colorIndex = (colorIndex + 1) % gradients.length;
    });
}

// ==========================
// 8. COMPARE MODAL LOGIC 
// ==========================
// ... (основная логика сравнения) ...
document.querySelectorAll('.card').forEach(card => {
    const compareBtn = card.querySelector('.compare-car-btn'); 
    if (compareBtn) {
        const carName = card.querySelector('.card-title')?.textContent.trim() || card.querySelector('h5.card-title')?.textContent.trim();
        const car = carData.find(c => c.name === carName);

        if (car) {
            compareBtn.addEventListener('click', () => {
                const isPresent = comparisonList.some(c => c.name === car.name);
                
                if (!isPresent && comparisonList.length < 5) { 
                    comparisonList.push(car);
                    alert(`${car.name} added to comparison list!`);
                    clickSound.play(); // НОВОЕ: Звук при добавлении
                } else if (comparisonList.length >= 5) {
                    alert(`You can compare up to 5 cars. Please remove one first.`);
                } else {
                    alert(`${car.name} is already in the comparison list.`);
                }
            });
        }
    }
});


// ==========================
// 10. CHANGE GREETING
// ==========================
const greetings = ["Welcome!", "Hello, bro!", "Ready to compare?", "Speed is life!"];
let greetingIndex = 0;

document.getElementById('changeGreetingBtn')?.addEventListener('click', function() {
    greetingIndex = (greetingIndex + 1) % greetings.length;
    document.getElementById('message').textContent = greetings[greetingIndex];
    vroomSound.play(); // НОВОЕ: Звук "Engine Start"
});

// ==========================
// 11. FILTER LOGIC
// ==========================
const filterButtons = document.querySelectorAll('.filter-btn');
const allCarCards = document.querySelectorAll('.car-card');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        allCarCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardParent = card.closest('.col-12, .col-md-4, .col-lg-4');

            // НОВОЕ: Добавление анимации при фильтрации
            card.classList.remove('animated-card'); 

            if (category === 'all' || cardCategory === category) {
                cardParent.style.display = 'block'; 
                // Запуск анимации для показанных карт
                setTimeout(() => card.classList.add('animated-card'), 10); 
            } else {
                cardParent.style.display = 'none'; 
            }
        });
    });
});

// ==========================
// 12. LIVE SEARCH (НОВАЯ ФУНКЦИЯ)
// ==========================
const searchInput = document.getElementById('liveSearchInput');

if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchText = this.value.toLowerCase().trim();

        allCarCards.forEach(card => {
            const cardName = card.getAttribute('data-car-name').toLowerCase();
            const cardParent = card.closest('.col-12, .col-md-4, .col-lg-4'); 

            // Сброс анимации перед проверкой
            card.classList.remove('animated-card'); 

            if (cardName.includes(searchText)) {
                // Анимация входа 
                cardParent.style.display = 'block';
                // Запуск анимации для найденных карт
                setTimeout(() => card.classList.add('animated-card'), 10); 
            } else {
                cardParent.style.display = 'none';
            }
        });
        
        // Сброс активного фильтра при поиске
        filterButtons.forEach(btn => btn.classList.remove('active'));
    });
}

// ==========================
// 13. KEYBOARD SHORTCUTS (НОВАЯ ФУНКЦИЯ)
// ==========================
document.addEventListener('keydown', function(event) {
    // 1. Закрытие модальных окон по ESC
    if (event.key === 'Escape') {
        // Логика закрытия Bootstrap модальных окон
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            
            const detailsModalEl = document.getElementById('detailsModal');
            const detailsModalInstance = bootstrap.Modal.getInstance(detailsModalEl);
            if (detailsModalInstance) detailsModalInstance.hide();
            
            const compareModalEl = document.getElementById('compareModal');
            const compareModalInstance = bootstrap.Modal.getInstance(compareModalEl);
            if (compareModalInstance) compareModalInstance.hide();
        }
        
        // Закрыть Popup
        const popup = document.getElementById("popupForm");
        if (popup && popup.style.display === 'flex') {
            popup.style.display = 'none';
        }
    }

    // 2. T (Theme) - Переключение темы
    if (event.key === 't' || event.key === 'T') {
        const themeBtn = document.getElementById("toggleTheme");
        if (themeBtn) themeBtn.click();
    }
    
    // 3. C (Compare) - Открыть модальное окно сравнения
    if (event.key === 'c' || event.key === 'C') {
        const compareBtn = document.getElementById('openCompare');
        if (compareBtn) compareBtn.click();
    }
});
// ====================================
// 15. RATING SYSTEM (DATA STRUCTURES & DOM MANIPULATION)
// ====================================

// DATA STRUCTURE: Объект для хранения всех рейтингов
// Ключ: carId (например, 'chiron'), Значение: rating (например, 5)
let carRatings = {};

// 1. DATA PERSISTENCE & LOADING
function loadRatings() {
    // Получение сохраненных данных из LocalStorage
    const storedRatings = localStorage.getItem('carRatings');
    carRatings = storedRatings ? JSON.parse(storedRatings) : {};
    
    // Применение загруженных рейтингов к DOM
    Object.keys(carRatings).forEach(carId => {
        // Вызываем функцию обновления DOM для каждого сохраненного рейтинга
        applyRatingToDOM(carId, carRatings[carId]);
    });
}

function saveRatings() {
    // Сохранение текущего объекта рейтингов в LocalStorage
    localStorage.setItem('carRatings', JSON.stringify(carRatings));
}

// 2. DOM MANIPULATION & VISUAL UPDATE
function applyRatingToDOM(carId, ratingValue) {
    // Выбираем все звезды для конкретного автомобиля
    const carStars = document.querySelectorAll(`.star[data-car="${carId}"]`);
    
    // Находим элемент сообщения, чтобы обновить его
    const ratingContainer = document.querySelector(`.car-card [data-car-id="${carId}"]`)?.closest('.card-body');
    const rateMsg = ratingContainer ? ratingContainer.querySelector('.rateMsg') : null;

    carStars.forEach(star => {
        const starValue = parseInt(star.getAttribute('data-value'));
        
        // DOM Manipulation: Добавляем/удаляем класс 'rated' для стилизации
        if (starValue <= ratingValue) {
            star.classList.add('rated');
        } else {
            star.classList.remove('rated');
        }
    });
    
    // Dynamic Content Update (UX)
    if (rateMsg) {
        if (ratingValue > 0) {
            rateMsg.textContent = `You rated this ${ratingValue}/5!`;
        } else {
            rateMsg.textContent = 'Click a star to rate';
        }
    }
}


// 3. EVENT HANDLING CORE FUNCTION
function handleStarClick(event) {
    // *** INTEGRATION POINT: SOUND EFFECT ***
    // Предполагаем, что у вас есть 'clickSound' из предыдущего шага
    // if (typeof clickSound !== 'undefined') { clickSound.play(); } 

    const clickedStar = event.currentTarget;
    const carId = clickedStar.getAttribute('data-car');
    const ratingValue = parseInt(clickedStar.getAttribute('data-value'));
    
    // Обновляем структуру данных
    carRatings[carId] = ratingValue;
    saveRatings(); // Сохраняем в localStorage

    // Обновляем интерфейс
    applyRatingToDOM(carId, ratingValue);
}


// 4. INITIALIZATION
function initializeRatingSystem() {
    // 4.1. Добавляем слушатель событий на каждую звезду
    const allStars = document.querySelectorAll('.rating .star');
    
    allStars.forEach(star => {
        // Event Listener Implementation
        star.addEventListener('click', handleStarClick);
    });

    // 4.2. Загружаем сохраненные данные при старте
    loadRatings(); 
}

// Вызовите эту функцию в конце вашего script.js после DOMContentLoaded
initializeRatingSystem();