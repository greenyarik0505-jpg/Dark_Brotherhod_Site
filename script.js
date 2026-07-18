// ============================================================
// 🎮 Brawl Stars Club — Священная Империя | script.js
// ============================================================
const SITE_VERSION = "9";
console.log("%c🎮 Сайт загружен | Версия: " + SITE_VERSION, "color: #00e5ff; font-size: 16px; font-weight: bold;");
// Полнофункциональный скрипт для клубного сайта.
// Содержит: управление состоянием, навигацию, анимации,
// админ-панель с CRUD для новостей/участников/событий,
// систему тостов, кастомные диалоги подтверждения и др.
// ============================================================

"use strict";

// ======================== КОНСТАНТЫ ========================

/**
 * Пароль будет загружаться динамически из файла config.js,
 * который находится в вашем .gitignore и не заливается на GitHub.
 * В GitHub Actions он создается автоматически из GitHub Secrets.
 */
let ADMIN_SECRET_CODE = ""; // Пароль отсутствует по умолчанию (безопасно для GitHub)

// Если в глобальном объекте window определен пароль из config.js, используем его
if (window.BRAWL_CLUB_CONFIG && window.BRAWL_CLUB_CONFIG.adminPassword) {
    ADMIN_SECRET_CODE = window.BRAWL_CLUB_CONFIG.adminPassword;
}

// Вспомогательная функция для получения актуального пароля
function getAdminSecretCode() {
    if (window.BRAWL_CLUB_CONFIG && window.BRAWL_CLUB_CONFIG.adminPassword) {
        return window.BRAWL_CLUB_CONFIG.adminPassword;
    }
    return ADMIN_SECRET_CODE;
}


/** Ключ для хранения данных в LocalStorage */
const STORAGE_KEY = "brawlClubData";

/** Данные клуба по умолчанию */
const DEFAULT_CLUB_DATA = {
    info: {
        name: "Holy Empire",
        tag: "#2QCLRR800",
        description: "Священная империя ждёт воинов. Склонись и сразись! Неактив 3 дня — кик. Отыгровка копилки обязательна. 🇷🇺",
        requiredTrophies: 60000,
        ownerTelegram: "@yarik_owner"
    },
    members: [
        { id: "m1", name: "farel", role: "Ветеран", trophies: 175013, avatar: "⭐" },
        { id: "m2", name: "Code: Zharik🔥", role: "Вице-президент", trophies: 110234, avatar: "🦎" },
        { id: "m3", name: "✨Cezuis✨", role: "Президент", trophies: 107576, avatar: "👑" },
        { id: "m4", name: "⚔️| MAGIM |⚔️", role: "Участник", trophies: 102162, avatar: "🌵" },
        { id: "m5", name: "BiBr1k", role: "Вице-президент", trophies: 87342, avatar: "🔥" },
        { id: "m6", name: "kęŗbąx❄️", role: "Участник", trophies: 87246, avatar: "⛄" },
        { id: "m7", name: "Loader", role: "Участник", trophies: 80847, avatar: "👤" },
        { id: "m8", name: "УМБИЦА", role: "Ветеран", trophies: 77145, avatar: "⭐" },
        { id: "m9", name: "👿Sa{Y}ReX👿", role: "Участник", trophies: 74320, avatar: "👤" },
        { id: "m10", name: "KVD | Deathgan", role: "Участник", trophies: 71759, avatar: "👤" },
        { id: "m11", name: "☃️Vęņģuś☃️", role: "Участник", trophies: 68629, avatar: "👤" },
        { id: "m12", name: "САХАРOК", role: "Ветеран", trophies: 68111, avatar: "👤" },
        { id: "m13", name: "Lemon_h1k", role: "Участник", trophies: 67734, avatar: "👤" },
        { id: "m14", name: "senyakrud", role: "Вице-президент", trophies: 66828, avatar: "👑" },
        { id: "m15", name: "KVD | Gladiator", role: "Участник", trophies: 63368, avatar: "👤" },
        { id: "m16", name: "DreamTournament", role: "Участник", trophies: 62917, avatar: "👤" },
        { id: "m17", name: "[]{}#%^*+=\\_|~<", role: "Ветеран", trophies: 60609, avatar: "👤" },
        { id: "m18", name: "Code: Saharok", role: "Участник", trophies: 60049, avatar: "👤" },
        { id: "m19", name: "KOT9", role: "Ветеран", trophies: 59668, avatar: "👤" },
        { id: "m20", name: "Андрій🙏Skill", role: "Участник", trophies: 58394, avatar: "👤" },
        { id: "m21", name: "god, bless Zo.", role: "Участник", trophies: 56145, avatar: "👤" },
        { id: "m22", name: "Ash | AuraBS🗿", role: "Участник", trophies: 51473, avatar: "👤" },
        { id: "m23", name: "килья", role: "Ветеран", trophies: 51316, avatar: "👤" },
        { id: "m24", name: "Ti Ne Top🤡", role: "Ветеран", trophies: 50869, avatar: "👤" },
        { id: "m25", name: "SometG", role: "Ветеран", trophies: 50822, avatar: "👤" },
        { id: "m26", name: "умник prime", role: "Участник", trophies: 50819, avatar: "👤" },
        { id: "m27", name: "Toose", role: "Ветеран", trophies: 47694, avatar: "👤" },
        { id: "m28", name: "『fg|HiRo』", role: "Участник", trophies: 45893, avatar: "👤" },
        { id: "m29", name: "DED", role: "Участник", trophies: 45678, avatar: "👤" },
        { id: "m30", name: "Sword", role: "Участник", trophies: 42550, avatar: "👤" }
    ],
    news: [
        { id: "1", date: "15.07.2026", title: "🎉 Мегакопилка заполнена!", content: "Поздравляем всех бойцов! Мы полностью заполнили Мегакопилку и забрали максимальные награды. Всем огромное спасибо за активное участие! Так держать!" },
        { id: "2", date: "10.07.2026", title: "📢 Новые критерии вступления", content: "В связи с ростом среднего уровня участников, порог кубков для вступления повышен до 60,000 трофеев. Не сбавляем темп, империя растёт!" },
        { id: "3", date: "05.07.2026", title: "🏆 Победа в Клубной Лиге!", content: "Наш клуб занял 1 место в Клубной Лиге сезона! Особая благодарность всем участникам за слаженную игру. Награды уже начислены." }
    ],
    events: [
        { id: "1", date: "24 Июля 2026", title: "Клубная Мегакопилка", desc: "Главный ивент месяца. Все билеты должны быть отыграны! За неактивность — исключение.", type: "megapig" },
        { id: "2", date: "28 Июля 2026", title: "Внутриклановый турнир 3х3", desc: "Турнир по Brawl Ball среди участников клуба. Собирайте команды, призовой фонд — Brawl Pass Plus!", type: "tournament" },
        { id: "3", date: "1 Августа 2026", title: "Очистка неактивных", desc: "Ежемесячная проверка логов активности. Игроки, не заходившие в игру более 3 дней без предупреждения, будут кикнуты.", type: "cleanup" },
        { id: "4", date: "5 Августа 2026", title: "Дружеский матч с Легионом", desc: "Товарищеская встреча с дружественным клубом «Легион Огня». 5v5, режим — Осада.", type: "friendly" }
    ],
    gallery: [
        { id: "g1", url: "https://cdn.supercell.com/supercell.com/images/posts/brawl-stars/19c7e69b69/1024x0/Header.webp", caption: "Победа в Клубной Лиге — Сезон 1" },
        { id: "g2", url: "https://cdn.supercell.com/supercell.com/images/posts/brawl-stars/aa2e1fca6b/1024x0/Header.webp", caption: "Мегакопилка заполнена на 100%" },
        { id: "g3", url: "https://cdn.supercell.com/supercell.com/images/posts/brawl-stars/1f66c14bb6/1024x0/Header.webp", caption: "Турнир 3х3 — Наша команда чемпионов" },
        { id: "g4", url: "https://cdn.supercell.com/supercell.com/images/posts/brawl-stars/b5ce4b9f33/1024x0/Header.webp", caption: "62 000 трофеев — Рекорд президента" }
    ],
    achievements: [
        // Зал Славы
        { id: "hof_prime3", type: "fame", period: "hall-of-fame", players: "✨Cesuis✨", value: "3 Прайм" },
        { id: "hof_prime4", type: "fame", period: "hall-of-fame", players: "Zharik🔥", value: "4 Прайм" },
        { id: "hof_prime5", type: "fame", period: "hall-of-fame", players: "BiBr1k", value: "5 Прайм" },
        { id: "hof_master", type: "ranked", period: "hall-of-fame", players: "farel", value: "Мастер" },
        { id: "hof_pro", type: "ranked", period: "hall-of-fame", players: "senyakrud", value: "Про Ранг" },
        
        // Достижения игроков
        { id: "ach3", type: "wins3v3", period: "week", players: "ęŗbąx❄️", value: "350 побед" },
        { id: "ach4", type: "winsSd", period: "month", players: "⚔️| MAGIM |⚔️", value: "85 побед в ШД" },
        { id: "ach5", type: "wins3v3", period: "year", players: "senyakrud", value: "4,500 побед" }
    ]
};

// ======================== ГЛОБАЛЬНОЕ СОСТОЯНИЕ ========================

/** Текущее состояние приложения */
let clubData = null;

/** Флаг авторизации администратора */
let isAdminAuthenticated = false;


/**
 * Загрузка состояния (Firebase Realtime Database или LocalStorage)
 */
const firebaseConfig = {
    apiKey: "AIzaSyCh14CMKFKwVqtEz6s9mSxKyMmxoEFscFc",
    authDomain: "dark-club-57e07.firebaseapp.com",
    databaseURL: "https://dark-club-57e07-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "dark-club-57e07",
    storageBucket: "dark-club-57e07.firebasestorage.app",
    messagingSenderId: "732975006109",
    appId: "1:732975006109:web:e9e98e05baf73fe5e9ef74",
    measurementId: "G-CYCH36MMEW"
};

let firebaseDb = null;
try {
    firebase.initializeApp(firebaseConfig);
    firebaseDb = firebase.database();
} catch (e) {
    console.error("Firebase init failed:", e);
}

function loadState() {
    // 1. Оптимистичная загрузка (показываем дефолтные данные сразу)
    clubData = deepClone(DEFAULT_CLUB_DATA);

    // 2. Подключаемся к Firebase
    if (firebaseDb) {
        const dbRef = firebaseDb.ref('brawlClubData');
        dbRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Если данные есть в базе, используем их
                clubData = data;
                
                // Проверки на наличие массивов (миграции)
                if (!clubData.news) clubData.news = [];
                if (!clubData.members) clubData.members = [];
                if (!clubData.events) clubData.events = [];
                if (!clubData.gallery) clubData.gallery = [];
                if (!clubData.achievements) clubData.achievements = [];
                
                // Перерисовываем UI при каждом изменении базы
                renderUI();
            } else {
                // Если база пустая, просто используем дефолтные данные
                // НЕ вызываем saveState() автоматически, чтобы избежать цикла ошибок Permission Denied
                clubData = deepClone(DEFAULT_CLUB_DATA);
                renderUI();
            }
        }, (error) => {
            console.error("Ошибка чтения Firebase:", error);
        });
    } else {
        // Fallback to local storage if firebase fails
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) clubData = JSON.parse(raw);
        } catch (e) {}
    }
}

/**
 * Сохранение текущего состояния в Firebase
 */
function saveState() {
    if (firebaseDb) {
        const dbRef = firebaseDb.ref('brawlClubData');
        // deepClone убирает undefined значения, которые ломают Firebase
        dbRef.set(deepClone(clubData)).catch(err => {
            console.error("Ошибка записи в Firebase:", err);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(clubData));
        });
    } else {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(clubData));
        } catch (e) {}
    }
}

// ============================================================
//  1. УПРАВЛЕНИЕ СОСТОЯНИЕМ (STATE MANAGEMENT)
// ============================================================

/**
 * Глубокое клонирование объекта через JSON
 * @param {Object} obj - объект для клонирования
 * @returns {Object} глубокая копия
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}




// ============================================================
//  2. СИСТЕМА ТОСТ-УВЕДОМЛЕНИЙ
// ============================================================

/**
 * Показать тост-уведомление
 * @param {string} message - текст сообщения
 * @param {'success'|'error'|'info'} type - тип уведомления
 */
function showToast(message, type = "info") {
    // Создаём контейнер, если его ещё нет
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    // Иконка по типу
    const icons = { success: "✅", error: "❌", info: "ℹ️" };
    const icon = icons[type] || icons.info;

    // Создаём элемент тоста
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-message">${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    // Принудительный reflow для запуска анимации появления
    toast.offsetHeight; // eslint-disable-line no-unused-expressions
    toast.classList.add("toast-show");

    // Автоудаление через 3 секунды
    setTimeout(() => {
        toast.classList.remove("toast-show");
        toast.classList.add("toast-hide");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
        // Подстраховка на случай, если animationend не сработает
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 500);
    }, 3000);
}


// ============================================================
//  3. КАСТОМНЫЙ ДИАЛОГ ПОДТВЕРЖДЕНИЯ
// ============================================================

/**
 * Показать модальный диалог подтверждения
 * @param {string} message - текст вопроса
 * @returns {Promise<boolean>} true — подтверждено, false — отменено
 */
function showConfirm(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById("confirmModal");
        const msgEl = document.getElementById("confirmMessage");
        const yesBtn = document.getElementById("confirmYes");
        const noBtn = document.getElementById("confirmNo");

        if (!modal || !msgEl || !yesBtn || !noBtn) {
            resolve(confirm(message));
            return;
        }

        msgEl.textContent = message;
        modal.style.display = "flex";

        const cleanup = (result) => {
            modal.style.display = "none";
            yesBtn.removeEventListener("click", onYes);
            noBtn.removeEventListener("click", onNo);
            modal.removeEventListener("click", onBgClick);
            resolve(result);
        };

        const onYes = () => cleanup(true);
        const onNo = () => cleanup(false);
        const onBgClick = (e) => {
            if (e.target === modal) cleanup(false);
        };

        yesBtn.addEventListener("click", onYes);
        noBtn.addEventListener("click", onNo);
        modal.addEventListener("click", onBgClick);
    });
}


// ============================================================
//  4. НАВИГАЦИЯ ПО ВКЛАДКАМ
// ============================================================

/**
 * Настройка переключения табов
 */
function setupTabNavigation() {
    const navLinks = document.querySelectorAll("[data-tab]");

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const tabId = link.getAttribute("data-tab");
            switchTab(tabId);

            // Закрываем мобильное меню при клике
            if (window._closeMenu) {
                window._closeMenu();
            }

            // Плавный скролл к контенту
            const mainContent = document.querySelector(".main-content");
            if (mainContent) {
                mainContent.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

/**
 * Переключение активной вкладки
 * @param {string} tabId - идентификатор вкладки (club, members, news, events, admin)
 */
function switchTab(tabId) {
    // Если пытаемся переключиться на админку без авторизации, показываем экран логина
    if (tabId === "admin" && !isAdminAuthenticated) {
        const dashboard = document.getElementById("adminDashboard");
        const loginSection = document.getElementById("adminLoginSection");
        if (dashboard) dashboard.style.display = "none";
        if (loginSection) loginSection.style.display = "block";
    }

    // Снимаем active со всех навигационных ссылок
    document.querySelectorAll("[data-tab]").forEach((link) => {
        link.classList.remove("active");
    });

    // Скрываем все секции
    document.querySelectorAll(".content-section").forEach((section) => {
        section.classList.remove("active");
    });

    // Активируем нужную ссылку и секцию
    const activeLinks = document.querySelectorAll(`[data-tab="${tabId}"]`);
    const activeSection = document.getElementById(`${tabId}-section`);

    activeLinks.forEach((link) => link.classList.add("active"));
    if (activeSection) activeSection.classList.add("active");

    // Скрываем или показываем Hero Banner в зависимости от вкладки
    const heroBanner = document.querySelector(".hero-banner");
    if (heroBanner) {
        if (tabId === "club") {
            heroBanner.style.display = "flex";
        } else {
            heroBanner.style.display = "none";
        }
    }
}



// ============================================================
//  5. МОБИЛЬНОЕ МЕНЮ (ГАМБУРГЕР)
// ============================================================

/**
 * Настройка мобильного гамбургер-меню
 */
function setupMobileMenu() {
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");

    if (!navToggle || !navMenu) return;

    // Создаём оверлей для затемнения фона
    const overlay = document.createElement("div");
    overlay.className = "mobile-nav-overlay";
    document.body.appendChild(overlay);

    function openMenu() {
        navMenu.classList.add("open");
        navToggle.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        navMenu.classList.remove("open");
        navToggle.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    navToggle.addEventListener("click", () => {
        if (navMenu.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Закрытие по клику на оверлей
    overlay.addEventListener("click", closeMenu);

    // Экспортируем closeMenu чтобы использовать при клике на таб
    window._closeMenu = closeMenu;
}


// ============================================================
//  6. АНИМИРОВАННЫЕ СЧЁТЧИКИ
// ============================================================

/**
 * Анимация числового счётчика
 * @param {HTMLElement} element - элемент, в который записывается число
 * @param {number} target - целевое значение
 * @param {number} duration - длительность анимации в мс
 */
function animateCounter(element, target, duration = 1500) {
    const start = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        // Функция плавного замедления (ease-out cubic)
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (target - startValue) * eased);

        element.textContent = currentValue.toLocaleString("ru-RU");

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}


// ============================================================
//  7. SCROLL REVEAL АНИМАЦИИ
// ============================================================

let globalRevealObserver = null;

/**
 * Настройка IntersectionObserver для анимаций появления
 */
function setupScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");
    if (!revealElements.length) return;

    if (!globalRevealObserver) {
        globalRevealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-active");
                        globalRevealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.05 }
        );
    }

    revealElements.forEach((el) => {
        if (el.classList.contains("reveal-active")) return;
        
        const rect = el.getBoundingClientRect();
        // Если элемент уже на экране, сразу показываем
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add("reveal-active");
        } else {
            globalRevealObserver.observe(el);
        }
    });
}


// ============================================================
//  8. ПОИСК, ФИЛЬТРАЦИЯ И СОРТИРОВКА УЧАСТНИКОВ
// ============================================================

/**
 * Настройка фильтров участников (поиск, роль, сортировка)
 */
function setupFilters() {
    const searchInput = document.getElementById("memberSearch");
    const roleFilter = document.getElementById("roleFilter");
    const sortSelect = document.getElementById("sortSelect");

    // Поиск с debounce 200мс
    if (searchInput) {
        searchInput.addEventListener("input", debounce(() => renderMembersList(), 200));
    }

    // Фильтр по роли
    if (roleFilter) {
        roleFilter.addEventListener("change", () => renderMembersList());
    }

    // Сортировка
    if (sortSelect) {
        sortSelect.addEventListener("change", () => renderMembersList());
    }

    // Вкладки в зале достижений (Main)
    const achMainBtns = document.querySelectorAll(".ach-main-tab");
    const achPeriodTabsContainer = document.getElementById("achPeriodTabs");
    achMainBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            achMainBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            currentMainAchTab = btn.getAttribute("data-main-tab");
            
            if (currentMainAchTab === "players") {
                if (achPeriodTabsContainer) achPeriodTabsContainer.style.display = "flex";
            } else {
                if (achPeriodTabsContainer) achPeriodTabsContainer.style.display = "none";
            }
            renderAchievements();
        });
    });

    // Вкладки периодов в зале достижений
    const achPeriodBtns = document.querySelectorAll(".ach-period-tab");
    achPeriodBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            achPeriodBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            currentPeriodAchTab = btn.getAttribute("data-period");
            renderAchievements();
        });
    });

    // Вкладки в админ-панели
    const adminTabBtns = document.querySelectorAll(".admin-tab-btn");
    adminTabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            adminTabBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const targetTab = btn.getAttribute("data-admin-tab");

            // Скрываем все секции
            document.querySelectorAll(".admin-sub-section").forEach((sec) => {
                sec.style.display = "none";
                sec.classList.remove("active");
            });

            // Показываем нужную
            const targetSection = document.getElementById(`admin-${targetTab}-section`);
            if (targetSection) {
                targetSection.style.display = "block";
                targetSection.classList.add("active");
            }
        });
    });
}

/**
 * Получить отфильтрованный и отсортированный список участников
 * @returns {Array} массив участников
 */
function getFilteredMembers() {
    const searchInput = document.getElementById("memberSearch");
    const roleFilter = document.getElementById("roleFilter");
    const sortSelect = document.getElementById("sortSelect");

    const searchQuery = (searchInput ? searchInput.value : "").toLowerCase().trim();
    const roleValue = roleFilter ? roleFilter.value : "all";
    const sortValue = sortSelect ? sortSelect.value : "trophies-desc";

    let filtered = [...clubData.members];

    // Фильтрация по имени
    if (searchQuery) {
        filtered = filtered.filter((m) =>
            m.name.toLowerCase().includes(searchQuery)
        );
    }

    // Фильтрация по роли
    if (roleValue !== "all") {
        filtered = filtered.filter((m) => m.role === roleValue);
    }

    // Сортировка
    switch (sortValue) {
        case "trophies-desc":
            filtered.sort((a, b) => b.trophies - a.trophies);
            break;
        case "trophies-asc":
            filtered.sort((a, b) => a.trophies - b.trophies);
            break;
        case "name-az":
            filtered.sort((a, b) => a.name.localeCompare(b.name, "ru"));
            break;
        default:
            filtered.sort((a, b) => b.trophies - a.trophies);
    }

    return filtered;
}


// ============================================================
//  9. КНОПКА «НАВЕРХ»
// ============================================================

/**
 * Создание и настройка кнопки «Наверх»
 */
function createBackToTopButton() {
    const btn = document.createElement("button");
    btn.className = "back-to-top";
    btn.textContent = "↑";
    btn.setAttribute("aria-label", "Наверх");
    document.body.appendChild(btn);

    // Показ / скрытие при скролле
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            btn.classList.add("visible");
        } else {
            btn.classList.remove("visible");
        }
    });

    // Плавный скролл наверх
    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}


// ============================================================
// 10. КОПИРОВАНИЕ ТЕГА В БУФЕР ОБМЕНА
// ============================================================

/**
 * Настройка кнопки копирования тега клуба
 */
function setupClipboard() {
    const copyBtn = document.getElementById("copyTagBtn");

    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const tag = clubData.info.tag;

            navigator.clipboard.writeText(tag).then(() => {
                showToast("Тег скопирован: " + tag, "success");
                // Анимация кнопки
                copyBtn.classList.add("copied");
                setTimeout(() => copyBtn.classList.remove("copied"), 600);
            }).catch(() => {
                // Фолбэк для старых браузеров
                const textarea = document.createElement("textarea");
                textarea.value = tag;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand("copy");
                    showToast("Тег скопирован: " + tag, "success");
                    copyBtn.classList.add("copied");
                    setTimeout(() => copyBtn.classList.remove("copied"), 600);
                } catch (err) {
                    showToast("Не удалось скопировать тег", "error");
                }
                document.body.removeChild(textarea);
            });
        });
    }
}


// ============================================================
// 11. АВТОРИЗАЦИЯ АДМИНИСТРАТОРА
// ============================================================

/**
 * Настройка входа / выхода из админ-панели
 */
function setupAdminAuth() {
    const loginBtn = document.getElementById("adminLoginBtn");
    const loginModal = document.getElementById("adminLoginModal");
    const loginSubmit = document.getElementById("adminLoginSubmit");
    const loginClose = document.getElementById("adminLoginClose");
    const logoutBtn = document.getElementById("adminLogoutBtn");
    const passwordInput = document.getElementById("adminPasswordInput");
    const emailInput = document.getElementById("adminEmailInput");

    // Подписка на изменение статуса авторизации
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            isAdminAuthenticated = true;
            if (loginModal) loginModal.style.display = "none";
            const dashboard = document.getElementById("adminDashboard");
            const loginSection = document.getElementById("adminLoginSection");
            if (dashboard) dashboard.style.display = "block";
            if (loginSection) loginSection.style.display = "none";
            renderAdminDashboard();
        } else {
            isAdminAuthenticated = false;
            const dashboard = document.getElementById("adminDashboard");
            const loginSection = document.getElementById("adminLoginSection");
            if (dashboard) dashboard.style.display = "none";
            if (loginSection) loginSection.style.display = "block";
        }
    });

    // Кнопка «Войти» — открыть модалку
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            if (loginModal) loginModal.style.display = "flex";
            if (passwordInput) passwordInput.value = "";
            if (emailInput) emailInput.value = "";
            if (emailInput) emailInput.focus();
        });
    }

    // Подтверждение входа
    if (loginSubmit) {
        loginSubmit.addEventListener("click", () => attemptAdminLogin());
    }

    // Enter в поле пароля
    if (passwordInput) {
        passwordInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") attemptAdminLogin();
        });
    }

    // Кнопка "Показать пароль"
    const togglePasswordBtn = document.getElementById("togglePasswordBtn");
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            togglePasswordBtn.textContent = type === "password" ? "Показать" : "Скрыть";
        });
    }

    // Закрытие модалки
    if (loginClose) {
        loginClose.addEventListener("click", () => {
            if (loginModal) loginModal.style.display = "none";
        });
    }

    // Закрытие по клику на оверлей
    if (loginModal) {
        loginModal.addEventListener("click", (e) => {
            if (e.target === loginModal) loginModal.style.display = "none";
        });
    }

    // Выход из админки
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            firebase.auth().signOut().then(() => {
                switchTab("club");
                showToast("Вы вышли из админ-панели", "info");
            }).catch(err => console.error("Ошибка при выходе", err));
        });
    }
}

/**
 * Попытка входа в админ-панель
 */
async function attemptAdminLogin() {
    const emailInput = document.getElementById("adminEmailInput");
    const passwordInput = document.getElementById("adminPasswordInput");
    const loginModal = document.getElementById("adminLoginModal");
    
    const username = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    if (!username || !password) {
        showToast("Введите Логин и Пароль!", "error");
        return;
    }

    // Если пользователь ввел email целиком (с @), используем его. 
    // Иначе добавляем @brawl.com для удобства ввода короткого логина.
    const email = username.includes("@") ? username : username + "@brawl.com";

    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        showToast("Добро пожаловать, Администратор!", "success");
        if (loginModal) loginModal.style.display = "none";
        switchTab("admin");
    } catch (error) {
        console.error("Auth error:", error);
        showToast("Неверный Логин или Пароль!", "error");
        const modalContent = loginModal ? loginModal.querySelector(".modal-content") : null;
        if (modalContent) {
            modalContent.classList.add("shake");
            setTimeout(() => modalContent.classList.remove("shake"), 500);
        }
    }
}


// ============================================================
// 12. АДМИН-ПАНЕЛЬ — CRUD ОПЕРАЦИИ
// ============================================================

/**
 * Настройка всех админских форм и модалок
 */
function setupAdminForms() {
    // ---- Настройки клуба ----
    const clubSettingsForm = document.getElementById("clubSettingsForm");
    if (clubSettingsForm) {
        clubSettingsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            clubData.info.name = document.getElementById("settingName").value.trim();
            clubData.info.tag = document.getElementById("settingTag").value.trim();
            clubData.info.requiredTrophies = parseInt(document.getElementById("settingTrophies").value, 10) || 0;
            clubData.info.description = document.getElementById("settingDescription").value.trim();
            clubData.info.ownerTelegram = document.getElementById("settingTelegram").value.trim();
            saveState();
            renderUI();
            showToast("Настройки клуба обновлены!", "success");
        });
    }

    // ---- Новости: добавление ----
    const addNewsBtn = document.getElementById("addNewsBtn");
    if (addNewsBtn) {
        addNewsBtn.addEventListener("click", () => openNewsModal());
    }

    // ---- Новости: сохранение (модалка) ----
    const saveNewsBtn = document.getElementById("saveNewsBtn");
    if (saveNewsBtn) {
        saveNewsBtn.addEventListener("click", () => saveNewsFromModal());
    }

    // ---- Участники: добавление ----
    const addMemberBtn = document.getElementById("addMemberBtn");
    if (addMemberBtn) {
        addMemberBtn.addEventListener("click", () => openMemberModal());
    }

    // ---- Участники: сохранение ----
    const saveMemberBtn = document.getElementById("saveMemberBtn");
    if (saveMemberBtn) {
        saveMemberBtn.addEventListener("click", () => saveMemberFromModal());
    }

    // ---- События: добавление ----
    const addEventBtn = document.getElementById("addEventBtn");
    if (addEventBtn) {
        addEventBtn.addEventListener("click", () => openEventModal());
    }

    // ---- События: сохранение ----
    const saveEventBtn = document.getElementById("saveEventBtn");
    if (saveEventBtn) {
        saveEventBtn.addEventListener("click", () => saveEventFromModal());
    }

    // ---- Галерея: добавление ----
    const addGalleryBtn = document.getElementById("addGalleryBtn");
    if (addGalleryBtn) {
        addGalleryBtn.addEventListener("click", () => openGalleryModal());
    }

    // ---- Галерея: сохранение ----
    const saveGalleryBtn = document.getElementById("saveGalleryBtn");
    if (saveGalleryBtn) {
        saveGalleryBtn.addEventListener("click", () => saveGalleryFromModal());
    }

    // ---- Достижения: добавление ----
    const addAchievementBtn = document.getElementById("addAchievementBtn");
    if (addAchievementBtn) {
        addAchievementBtn.addEventListener("click", () => openAchievementModal());
    }

    // ---- Достижения: сохранение ----
    const saveAchievementBtn = document.getElementById("saveAchievementBtn");
    if (saveAchievementBtn) {
        saveAchievementBtn.addEventListener("click", () => saveAchievementFromModal());
    }

    // ---- Закрытие модалок по кнопкам-крестикам и оверлею ----
    document.querySelectorAll(".modal-close").forEach((btn) => {
        btn.addEventListener("click", () => {
            const modal = btn.closest(".modal");
            if (modal) modal.style.display = "none";
        });
    });

    document.querySelectorAll(".modal").forEach((modal) => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });
    });
}


// ──────────────── НОВОСТИ: CRUD ────────────────

/**
 * Открыть модалку новости (добавление / редактирование)
 * @param {string|null} newsId - ID новости для редактирования (null — создание)
 */
function openNewsModal(newsId = null) {
    const modal = document.getElementById("newsModal");
    const titleInput = document.getElementById("newsTitle");
    const contentInput = document.getElementById("newsContent");
    const idInput = document.getElementById("newsEditId");
    const modalTitle = document.getElementById("newsModalTitle");

    if (!modal) return;

    if (newsId) {
        // Редактирование
        const item = clubData.news.find((n) => n.id === newsId);
        if (!item) return;
        if (modalTitle) modalTitle.textContent = "Редактировать новость";
        if (titleInput) titleInput.value = item.title;
        if (contentInput) contentInput.value = item.content;
        if (idInput) idInput.value = item.id;
    } else {
        // Создание
        if (modalTitle) modalTitle.textContent = "Добавить новость";
        if (titleInput) titleInput.value = "";
        if (contentInput) contentInput.value = "";
        if (idInput) idInput.value = "";
    }

    modal.style.display = "flex";
}

/**
 * Сохранить новость из модалки
 */
function saveNewsFromModal() {
    const titleInput = document.getElementById("newsTitle");
    const contentInput = document.getElementById("newsContent");
    const idInput = document.getElementById("newsEditId");

    const title = titleInput ? titleInput.value.trim() : "";
    const content = contentInput ? contentInput.value.trim() : "";
    const editId = idInput ? idInput.value : "";

    if (!title || !content) {
        showToast("Заполните все поля!", "error");
        return;
    }

    if (editId) {
        // Обновление существующей
        const idx = clubData.news.findIndex((n) => n.id === editId);
        if (idx !== -1) {
            clubData.news[idx].title = title;
            clubData.news[idx].content = content;
        }
        showToast("Новость обновлена!", "success");
    } else {
        // Добавление новой
        clubData.news.unshift({
            id: generateId(),
            date: formatDate(),
            title: title,
            content: content
        });
        showToast("Новость добавлена!", "success");
    }

    saveState();
    renderUI();

    const modal = document.getElementById("newsModal");
    if (modal) modal.style.display = "none";
}

/**
 * Удалить новость по ID (с подтверждением)
 * @param {string} newsId
 */
function deleteNews(newsId) {
    console.log("[v" + SITE_VERSION + "] deleteNews:", newsId);
    clubData.news = clubData.news.filter((n) => n.id !== newsId);
    saveState();
    renderUI();
    showToast("Новость удалена", "info");
}


// ──────────────── УЧАСТНИКИ: CRUD ────────────────

/**
 * Открыть модалку участника
 * @param {string|null} memberId
 */
function openMemberModal(memberId = null) {
    const modal = document.getElementById("memberModal");
    const nameInput = document.getElementById("memberName");
    const roleInput = document.getElementById("memberRole");
    const trophiesInput = document.getElementById("memberTrophies");
    const avatarInput = document.getElementById("memberAvatar");
    const idInput = document.getElementById("memberEditId");
    const modalTitle = document.getElementById("memberModalTitle");

    if (!modal) return;

    if (memberId) {
        const item = clubData.members.find((m) => m.id === memberId);
        if (!item) return;
        if (modalTitle) modalTitle.textContent = "Редактировать участника";
        if (nameInput) nameInput.value = item.name;
        if (roleInput) roleInput.value = item.role;
        if (trophiesInput) trophiesInput.value = item.trophies;
        if (avatarInput) avatarInput.value = item.avatar;
        if (idInput) idInput.value = item.id;
    } else {
        if (modalTitle) modalTitle.textContent = "Добавить участника";
        if (nameInput) nameInput.value = "";
        if (roleInput) roleInput.value = "Участник";
        if (trophiesInput) trophiesInput.value = "";
        if (avatarInput) avatarInput.value = "🎮";
        if (idInput) idInput.value = "";
    }

    modal.style.display = "flex";
}

/**
 * Сохранить участника из модалки
 */
function saveMemberFromModal() {
    const nameInput = document.getElementById("memberName");
    const roleInput = document.getElementById("memberRole");
    const trophiesInput = document.getElementById("memberTrophies");
    const avatarInput = document.getElementById("memberAvatar");
    const idInput = document.getElementById("memberEditId");

    const name = nameInput ? nameInput.value.trim() : "";
    const role = roleInput ? roleInput.value : "Участник";
    const trophies = trophiesInput ? parseInt(trophiesInput.value, 10) || 0 : 0;
    const avatar = avatarInput ? avatarInput.value.trim() || "🎮" : "🎮";
    const editId = idInput ? idInput.value : "";

    if (!name) {
        showToast("Укажите ник участника!", "error");
        return;
    }

    if (editId) {
        const idx = clubData.members.findIndex((m) => m.id === editId);
        if (idx !== -1) {
            clubData.members[idx].name = name;
            clubData.members[idx].role = role;
            clubData.members[idx].trophies = trophies;
            clubData.members[idx].avatar = avatar;
        }
        showToast("Участник обновлён!", "success");
    } else {
        clubData.members.push({
            id: generateId(),
            name: name,
            role: role,
            trophies: trophies,
            avatar: avatar
        });
        showToast("Участник добавлен!", "success");
    }

    saveState();
    renderUI();

    const modal = document.getElementById("memberModal");
    if (modal) modal.style.display = "none";
}

/**
 * Удалить участника (с подтверждением)
 * @param {string} memberId
 */
function deleteMember(memberId) {
    console.log("[v" + SITE_VERSION + "] deleteMember:", memberId);
    clubData.members = clubData.members.filter((m) => m.id !== memberId);
    saveState();
    renderUI();
    showToast("Участник удалён", "info");
}


// ──────────────── СОБЫТИЯ: CRUD ────────────────

/**
 * Открыть модалку события
 * @param {string|null} eventId
 */
function openEventModal(eventId = null) {
    const modal = document.getElementById("eventModal");
    const dateInput = document.getElementById("eventDate");
    const titleInput = document.getElementById("eventTitle");
    const descInput = document.getElementById("eventDesc");
    const typeInput = document.getElementById("eventType");
    const idInput = document.getElementById("eventEditId");
    const modalTitle = document.getElementById("eventModalTitle");

    if (!modal) return;

    if (eventId) {
        const item = clubData.events.find((ev) => ev.id === eventId);
        if (!item) return;
        if (modalTitle) modalTitle.textContent = "Редактировать событие";
        if (dateInput) dateInput.value = item.date;
        if (titleInput) titleInput.value = item.title;
        if (descInput) descInput.value = item.desc;
        if (typeInput) typeInput.value = item.type || "megapig";
        if (idInput) idInput.value = item.id;
    } else {
        if (modalTitle) modalTitle.textContent = "Добавить событие";
        if (dateInput) dateInput.value = "";
        if (titleInput) titleInput.value = "";
        if (descInput) descInput.value = "";
        if (typeInput) typeInput.value = "megapig";
        if (idInput) idInput.value = "";
    }

    modal.style.display = "flex";
}

/**
 * Сохранить событие из модалки
 */
function saveEventFromModal() {
    const dateInput = document.getElementById("eventDate");
    const titleInput = document.getElementById("eventTitle");
    const descInput = document.getElementById("eventDesc");
    const typeInput = document.getElementById("eventType");
    const idInput = document.getElementById("eventEditId");

    const date = dateInput ? dateInput.value.trim() : "";
    const title = titleInput ? titleInput.value.trim() : "";
    const desc = descInput ? descInput.value.trim() : "";
    const type = typeInput ? typeInput.value : "megapig";
    const editId = idInput ? idInput.value : "";

    if (!date || !title || !desc) {
        showToast("Заполните все поля события!", "error");
        return;
    }

    if (editId) {
        const idx = clubData.events.findIndex((ev) => ev.id === editId);
        if (idx !== -1) {
            clubData.events[idx].date = date;
            clubData.events[idx].title = title;
            clubData.events[idx].desc = desc;
            clubData.events[idx].type = type;
        }
        showToast("Событие обновлено!", "success");
    } else {
        clubData.events.push({
            id: generateId(),
            date: date,
            title: title,
            desc: desc,
            type: type
        });
        showToast("Событие добавлено!", "success");
    }

    saveState();
    renderUI();

    const modal = document.getElementById("eventModal");
    if (modal) modal.style.display = "none";
}

/**
 * Удалить событие (с подтверждением)
 * @param {string} eventId
 */
function deleteEvent(eventId) {
    console.log("[v" + SITE_VERSION + "] deleteEvent:", eventId);
    clubData.events = clubData.events.filter((ev) => ev.id !== eventId);
    saveState();
    renderUI();
    showToast("Событие удалено", "info");
}


// ──────────────── ГАЛЕРЕЯ: CRUD ────────────────

/**
 * Открыть модалку галереи (добавление / редактирование)
 * @param {string|null} itemId - ID фото для редактирования (null — создание)
 */
function openGalleryModal(itemId = null) {
    const modal = document.getElementById("galleryModal");
    const urlInput = document.getElementById("galleryUrl");
    const captionInput = document.getElementById("galleryCaption");
    const idInput = document.getElementById("galleryEditId");
    const modalTitle = document.getElementById("galleryModalTitle");
    const previewContainer = document.getElementById("galleryPreviewContainer");
    const previewImg = document.getElementById("galleryPreviewImg");
    const uploadZone = document.getElementById("galleryUploadZone");
    const fileInput = document.getElementById("galleryFileInput");
    const changeBtn = document.getElementById("galleryChangePhotoBtn");

    if (!modal) return;

    if (itemId) {
        const item = clubData.gallery.find((g) => g.id === itemId);
        if (!item) return;
        if (modalTitle) modalTitle.textContent = "Редактировать фото";
        if (urlInput) urlInput.value = item.url;
        if (captionInput) captionInput.value = item.caption;
        if (idInput) idInput.value = item.id;
        if (previewContainer && previewImg) {
            previewImg.src = item.url;
            previewContainer.style.display = "block";
            if (uploadZone) uploadZone.style.display = "none";
        }
    } else {
        if (modalTitle) modalTitle.textContent = "Добавить фото";
        if (urlInput) urlInput.value = "";
        if (captionInput) captionInput.value = "";
        if (idInput) idInput.value = "";
        if (previewContainer) previewContainer.style.display = "none";
        if (uploadZone) uploadZone.style.display = "block";
        if (fileInput) fileInput.value = "";
    }

    modal.style.display = "flex";

    // ---- Функция загрузки файла ----
    function handleFile(file) {
        if (!file || !file.type.startsWith("image/")) {
            showToast("Выбери файл изображения!", "error");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            showToast("Файл слишком большой (макс. 10 МБ)!", "error");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            if (urlInput) urlInput.value = dataUrl;
            if (previewImg) previewImg.src = dataUrl;
            if (previewContainer) previewContainer.style.display = "block";
            if (uploadZone) uploadZone.style.display = "none";
        };
        reader.readAsDataURL(file);
    }

    // Клик по зоне загрузки
    if (uploadZone && !uploadZone._hasListener) {
        uploadZone.addEventListener("click", () => fileInput && fileInput.click());

        // Выбор файла через диалог
        fileInput && fileInput.addEventListener("change", () => {
            if (fileInput.files[0]) handleFile(fileInput.files[0]);
        });

        // Drag-and-drop
        uploadZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            uploadZone.classList.add("drag-over");
        });
        uploadZone.addEventListener("dragleave", () => {
            uploadZone.classList.remove("drag-over");
        });
        uploadZone.addEventListener("drop", (e) => {
            e.preventDefault();
            uploadZone.classList.remove("drag-over");
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        });

        uploadZone._hasListener = true;
    }

    // Кнопка «Выбрать другое фото»
    if (changeBtn && !changeBtn._hasListener) {
        changeBtn.addEventListener("click", () => {
            if (previewContainer) previewContainer.style.display = "none";
            if (uploadZone) uploadZone.style.display = "block";
            if (fileInput) fileInput.value = "";
            if (urlInput) urlInput.value = "";
        });
        changeBtn._hasListener = true;
    }
}


/**
 * Сохранить фото из модалки
 */
function saveGalleryFromModal() {
    const urlInput = document.getElementById("galleryUrl");
    const captionInput = document.getElementById("galleryCaption");
    const idInput = document.getElementById("galleryEditId");

    const url = urlInput ? urlInput.value.trim() : "";
    const caption = captionInput ? captionInput.value.trim() : "";
    const editId = idInput ? idInput.value : "";

    if (!url) {
        showToast("Выбери фото для загрузки!", "error");
        return;
    }
    if (!caption) {
        showToast("Добавьте описание!", "error");
        return;
    }

    if (editId) {
        // Обновление существующего
        const idx = clubData.gallery.findIndex((g) => g.id === editId);
        if (idx !== -1) {
            clubData.gallery[idx].url = url;
            clubData.gallery[idx].caption = caption;
        }
        showToast("Фото обновлено!", "success");
    } else {
        // Добавление нового
        clubData.gallery.push({
            id: "g" + generateId(),
            url: url,
            caption: caption
        });
        showToast("Фото добавлено в галерею!", "success");
    }

    saveState();
    renderUI();

    const modal = document.getElementById("galleryModal");
    if (modal) modal.style.display = "none";
}

/**
 * Удалить фото из галереи (с подтверждением)
 * @param {string} itemId
 */
function deleteGalleryItem(itemId) {
    console.log("[v" + SITE_VERSION + "] deleteGalleryItem:", itemId);
    clubData.gallery = clubData.gallery.filter((g) => g.id !== itemId);
    saveState();
    renderUI();
    showToast("Фото удалено из галереи", "info");
}

/**
 * Открыть lightbox для просмотра фото
 * @param {string} itemId
 */
function openLightbox(itemId) {
    const modal = document.getElementById("lightboxModal");
    const img = document.getElementById("lightboxImg");
    const caption = document.getElementById("lightboxCaption");

    if (!modal || !clubData.gallery) return;

    const item = clubData.gallery.find((g) => g.id === itemId);
    if (!item) return;

    if (img) img.src = item.url;
    if (caption) caption.textContent = item.caption;
    modal.style.display = "flex";
}

// ──────────────── ДОСТИЖЕНИЯ: CRUD ────────────────

/**
 * Открыть модалку достижений (добавление / редактирование)
 * @param {string|null} achId
 */
function openAchievementModal(achId = null) {
    const modal = document.getElementById("achievementModal");
    const typeSelect = document.getElementById("achType");
    const periodSelect = document.getElementById("achPeriod");
    const playersInput = document.getElementById("achPlayers");
    const valueInput = document.getElementById("achValue");
    const idInput = document.getElementById("achievementEditId");
    const modalTitle = document.getElementById("achievementModalTitle");

    if (!modal) return;

    if (achId) {
        const ach = clubData.achievements.find((a) => a.id === achId);
        if (!ach) return;
        if (modalTitle) modalTitle.textContent = "Редактировать достижение";
        if (typeSelect) typeSelect.value = ach.type;
        if (periodSelect) periodSelect.value = ach.period;
        if (playersInput) playersInput.value = ach.players;
        if (valueInput) valueInput.value = ach.value;
        if (idInput) idInput.value = ach.id;
    } else {
        if (modalTitle) modalTitle.textContent = "Добавить достижение";
        if (typeSelect) typeSelect.selectedIndex = 0;
        if (periodSelect) periodSelect.selectedIndex = 0;
        if (playersInput) playersInput.value = "";
        if (valueInput) playersInput.value = "";
        if (valueInput) valueInput.value = "";
        if (idInput) idInput.value = "";
    }

    modal.style.display = "flex";
}

/**
 * Сохранить достижение из модалки
 */
function saveAchievementFromModal() {
    const typeSelect = document.getElementById("achType");
    const periodSelect = document.getElementById("achPeriod");
    const playersInput = document.getElementById("achPlayers");
    const valueInput = document.getElementById("achValue");
    const idInput = document.getElementById("achievementEditId");

    const type = typeSelect ? typeSelect.value : "wins3v3";
    const period = periodSelect ? periodSelect.value : "week";
    const players = playersInput ? playersInput.value.trim() : "";
    const value = valueInput ? valueInput.value.trim() : "";
    const editId = idInput ? idInput.value : "";

    if (!players) {
        showToast("Укажите никнеймы игроков!", "error");
        return;
    }
    if (!value) {
        showToast("Укажите значение/рекорд!", "error");
        return;
    }

    if (!clubData.achievements) {
        clubData.achievements = [];
    }

    if (editId) {
        const idx = clubData.achievements.findIndex((a) => a.id === editId);
        if (idx !== -1) {
            clubData.achievements[idx].type = type;
            clubData.achievements[idx].period = period;
            clubData.achievements[idx].players = players;
            clubData.achievements[idx].value = value;
        }
        showToast("Достижение успешно обновлено!", "success");
    } else {
        clubData.achievements.push({
            id: "ach" + generateId(),
            type: type,
            period: period,
            players: players,
            value: value
        });
        showToast("Достижение добавлено в зал!", "success");
    }

    saveState();
    renderUI();

    const modal = document.getElementById("achievementModal");
    if (modal) modal.style.display = "none";
}

/**
 * Удалить достижение (с подтверждением)
 * @param {string} achId
 */
function deleteAchievement(achId) {
    console.log("[v" + SITE_VERSION + "] deleteAchievement:", achId);
    clubData.achievements = clubData.achievements.filter((a) => a.id !== achId);
    saveState();
    renderUI();
    showToast("Достижение удалено из зала", "info");
}



// ============================================================
// 13. ФУНКЦИИ РЕНДЕРИНГА
// ============================================================

/**
 * Перерисовать весь интерфейс
 */
function renderUI() {
    renderClubStats();
    renderNews();
    renderEvents();
    renderMembersList();
    renderGallery();
    renderAchievements();

    // Обновляем данные на странице вступления
    renderJoinPage();

    if (isAdminAuthenticated) {
        renderAdminDashboard();
    }

    // Повторно наблюдаем за новыми .reveal элементами
    setupScrollReveal();
}

/**
 * Рендеринг статистики клуба (карточки с анимированными счётчиками)
 */
function renderClubStats() {
    const container = document.getElementById("clubStats");
    if (!container) return;

    const totalTrophies = clubData.members.reduce((sum, m) => sum + m.trophies, 0);
    const avgTrophies = clubData.members.length
        ? Math.round(totalTrophies / clubData.members.length)
        : 0;

    container.innerHTML = `
        <div class="stat-card reveal">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
                <div class="stat-value" data-target="${clubData.members.length}">0</div>
                <div class="stat-label">Участников</div>
            </div>
        </div>
        <div class="stat-card reveal">
            <div class="stat-icon">🏆</div>
            <div class="stat-info">
                <div class="stat-value" data-target="${totalTrophies}">0</div>
                <div class="stat-label">Общие трофеи</div>
            </div>
        </div>
        <div class="stat-card reveal">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
                <div class="stat-value" data-target="${avgTrophies}">0</div>
                <div class="stat-label">Средние трофеи</div>
            </div>
        </div>
        <div class="stat-card reveal">
            <div class="stat-icon">⚡</div>
            <div class="stat-info">
                <div class="stat-value" data-target="${clubData.info.requiredTrophies}">0</div>
                <div class="stat-label">Порог входа</div>
            </div>
        </div>
    `;

    // Запускаем анимацию счётчиков
    container.querySelectorAll(".stat-value[data-target]").forEach((el) => {
        const target = parseInt(el.getAttribute("data-target"), 10);
        animateCounter(el, target);
    });
}

/**
 * Рендеринг списка новостей
 */
function renderNews() {
    const container = document.getElementById("newsList");
    if (!container) return;

    if (!clubData.news.length) {
        container.innerHTML = '<p class="empty-message">Новостей пока нет 📰</p>';
        return;
    }

    container.innerHTML = clubData.news.map((item) => `
        <div class="news-card reveal">
            <div class="news-date">${escapeHtml(item.date)}</div>
            <h3 class="news-title">${escapeHtml(item.title)}</h3>
            <p class="news-content">${escapeHtml(item.content)}</p>
        </div>
    `).join("");
}

/**
 * Рендеринг таймлайна событий
 */
function renderEvents() {
    const container = document.getElementById("eventsTimeline");
    if (!container) return;

    if (!clubData.events.length) {
        container.innerHTML = '<p class="empty-message">Событий пока нет 📅</p>';
        return;
    }

    // Маппинг типа события → цвет точки на таймлайне
    const dotColors = {
        megapig: "#FFD700",   // золотой
        tournament: "#00E5FF", // циан
        cleanup: "#FF4444",    // красный
        friendly: "#00E676"    // зелёный
    };

    container.innerHTML = clubData.events.map((ev) => {
        const dotColor = dotColors[ev.type] || "#888";
        const icon = getEventTypeIcon(ev.type);

        return `
            <div class="timeline-item reveal">
                <div class="timeline-dot" style="background: ${dotColor}; box-shadow: 0 0 12px ${dotColor}80;"></div>
                <div class="timeline-content">
                    <div class="timeline-date">${escapeHtml(ev.date)}</div>
                    <h3 class="timeline-title">${icon} ${escapeHtml(ev.title)}</h3>
                    <p class="timeline-desc">${escapeHtml(ev.desc)}</p>
                </div>
            </div>
        `;
    }).join("");
}

/**
 * Рендеринг карточек участников (с учётом фильтров)
 */
function renderMembersList() {
    const container = document.getElementById("membersList");
    if (!container) return;

    const members = getFilteredMembers();

    if (!members.length) {
        container.innerHTML = '<p class="empty-message">Участники не найдены 🔍</p>';
        return;
    }

    container.innerHTML = members.map((m, index) => `
        <div class="member-card reveal ${getRoleBadgeClass(m.role)}" style="animation-delay: ${index * 0.05}s;">
            <div class="member-avatar">${m.avatar}</div>
            <div class="member-info">
                <h3 class="member-name">${escapeHtml(m.name)}</h3>
                <span class="member-role">${escapeHtml(m.role)}</span>
            </div>
            <div class="member-trophies">
                <span class="trophy-icon">🏆</span>
                <span class="trophy-count">${m.trophies.toLocaleString("ru-RU")}</span>
            </div>
        </div>
    `).join("");

    setupScrollReveal();
}

/** Текущая активная вкладка достижений */
let currentMainAchTab = "hall-of-fame";
let currentPeriodAchTab = "week";

/**
 * Рендеринг карточек достижений по выбранному периоду
 */
function renderAchievements() {
    const container = document.getElementById("achievementsList");
    if (!container) return;

    const achievements = clubData.achievements || [];
    
    // Фильтруем по периоду
    let filtered = [];
    if (currentMainAchTab === "hall-of-fame") {
        filtered = achievements.filter((ach) => ach.period === "hall-of-fame");
    } else {
        filtered = achievements.filter((ach) => ach.period === currentPeriodAchTab);
    }

    if (!filtered.length) {
        container.innerHTML = '<p class="empty-message" style="grid-column: span 3; text-align: center; padding: 3rem 0;">В этой категории пока нет достижений 🏆</p>';
        return;
    }

    container.innerHTML = filtered.map((ach, index) => {
        // Выбираем значок в зависимости от типа
        let icon = "⚔️";
        if (ach.type === "winsSd") icon = "☠️";
        if (ach.type === "ranked") icon = "🏆";
        if (ach.type === "fame") icon = "🌟";

        return `
            <div class="achievement-card reveal" style="animation-delay: ${index * 0.05}s;">
                <div class="ach-card-glow"></div>
                <div class="ach-header">
                    <span class="ach-icon-badge">${icon}</span>
                    <span class="ach-type">${getAchievementTypeLabel(ach.type)}</span>
                </div>
                <div class="ach-body">
                    <div class="ach-value">${escapeHtml(ach.value)}</div>
                    <div class="ach-players">${escapeHtml(ach.players)}</div>
                </div>
                <div class="ach-footer">
                    <span class="ach-period-badge">${getAchievementPeriodLabel(ach.period)}</span>
                </div>
            </div>
        `;
    }).join("");

    // Повторно инициализируем появление для новых элементов
    setupScrollReveal();
}

/**
 * Рендеринг галереи достижений на главной странице
 */
function renderGallery() {
    const container = document.getElementById("galleryGrid");
    if (!container) return;

    const gallery = clubData.gallery || [];

    if (!gallery.length) {
        container.innerHTML = '<p class="empty-message">Фото пока нет 🖼️</p>';
        return;
    }

    container.innerHTML = gallery.map((item) => `
        <div class="gallery-item reveal" onclick="window.openLightbox('${item.id}')">
            <img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.caption)}" loading="lazy"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22><rect fill=%22%231a1f35%22 width=%22400%22 height=%22300%22/><text x=%2250%%22 y=%2250%%22 fill=%22%237f8ab5%22 font-size=%2248%22 text-anchor=%22middle%22 dominant-baseline=%22central%22>🖼️</text></svg>'">
            <div class="gallery-overlay">
                <span>${escapeHtml(item.caption)}</span>
            </div>
        </div>
    `).join("");
}

/**
 * Обновление данных на странице вступления
 */
function renderJoinPage() {
    const tagEl = document.getElementById("joinClubTag");
    const tgLink = document.getElementById("ownerTgLink");
    const trophiesEl = document.getElementById("joinRequiredTrophies");
    const nameEl = document.getElementById("clubNameDisplay");
    const descEl = document.getElementById("clubDescDisplay");

    if (tagEl) tagEl.textContent = clubData.info.tag;
    if (trophiesEl) trophiesEl.textContent = clubData.info.requiredTrophies.toLocaleString("ru-RU");
    if (nameEl) nameEl.textContent = clubData.info.name;
    if (descEl) descEl.textContent = clubData.info.description;

    if (tgLink) {
        const tg = clubData.info.ownerTelegram || "@yarik_owner";
        tgLink.textContent = tg;
        tgLink.href = tg.startsWith("@") ? `https://t.me/${tg.substring(1)}` : `https://t.me/${tg}`;
    }
}

/**
 * Рендеринг админ-панели: статистика, таблицы, форма настроек
 */
function renderAdminDashboard() {
    renderAdminStats();
    renderAdminNewsTable();
    renderAdminMembersTable();
    renderAdminEventsTable();
    renderAdminGalleryTable();
    renderAdminAchievementsTable();
    prefillSettingsForm();
}


// ============================================================
// 14. АДМИНСКАЯ СТРОКА СТАТИСТИКИ
// ============================================================

/**
 * Рендеринг мини-карточек статистики в админке
 */
function renderAdminStats() {
    const container = document.getElementById("adminStatsRow");
    if (!container) return;

    const totalTrophies = clubData.members.reduce((sum, m) => sum + m.trophies, 0);

    container.innerHTML = `
        <div class="admin-stat-card">
            <span class="admin-stat-icon">👥</span>
            <div>
                <div class="admin-stat-value">${clubData.members.length}</div>
                <div class="admin-stat-label">Участников</div>
            </div>
        </div>
        <div class="admin-stat-card">
            <span class="admin-stat-icon">🏆</span>
            <div>
                <div class="admin-stat-value">${totalTrophies.toLocaleString("ru-RU")}</div>
                <div class="admin-stat-label">Общие трофеи</div>
            </div>
        </div>
        <div class="admin-stat-card">
            <span class="admin-stat-icon">📰</span>
            <div>
                <div class="admin-stat-value">${clubData.news.length}</div>
                <div class="admin-stat-label">Новостей</div>
            </div>
        </div>
        <div class="admin-stat-card">
            <span class="admin-stat-icon">📅</span>
            <div>
                <div class="admin-stat-value">${clubData.events.length}</div>
                <div class="admin-stat-label">Событий</div>
            </div>
        </div>
        <div class="admin-stat-card">
            <span class="admin-stat-icon">🖼️</span>
            <div>
                <div class="admin-stat-value">${clubData.gallery ? clubData.gallery.length : 0}</div>
                <div class="admin-stat-label">Фото</div>
            </div>
        </div>
    `;
}


// ──────────────── Админские таблицы ────────────────

/**
 * Таблица новостей в админке
 */
function renderAdminNewsTable() {
    const tbody = document.getElementById("adminNewsBody");
    if (!tbody) return;

    if (!clubData.news.length) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty-cell">Нет новостей</td></tr>';
        return;
    }

    tbody.innerHTML = clubData.news.map((n) => `
        <tr>
            <td>${escapeHtml(n.title)}</td>
            <td>${escapeHtml(n.date)}</td>
            <td class="action-cell">
                <button class="btn btn-sm btn-edit" data-action="editNews" data-id="${n.id}">✏️</button>
                <button class="btn btn-sm btn-delete" data-action="deleteNews" data-id="${n.id}">🗑️</button>
            </td>
        </tr>
    `).join("");
}

/**
 * Таблица участников в админке
 */
function renderAdminMembersTable() {
    const tbody = document.getElementById("adminMembersBody");
    if (!tbody) return;

    if (!clubData.members.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">Нет участников</td></tr>';
        return;
    }

    tbody.innerHTML = clubData.members.map((m) => `
        <tr>
            <td>${m.avatar}</td>
            <td>${escapeHtml(m.name)}</td>
            <td><span class="role-badge ${getRoleBadgeClass(m.role)}">${escapeHtml(m.role)}</span></td>
            <td>${m.trophies.toLocaleString("ru-RU")}</td>
            <td class="action-cell">
                <button class="btn btn-sm btn-edit" data-action="editMember" data-id="${m.id}">✏️</button>
                <button class="btn btn-sm btn-delete" data-action="deleteMember" data-id="${m.id}">🗑️</button>
            </td>
        </tr>
    `).join("");
}

/**
 * Таблица событий в админке
 */
function renderAdminEventsTable() {
    const tbody = document.getElementById("adminEventsBody");
    if (!tbody) return;

    if (!clubData.events.length) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty-cell">Нет событий</td></tr>';
        return;
    }

    tbody.innerHTML = clubData.events.map((ev) => `
        <tr>
            <td>${escapeHtml(ev.date)}</td>
            <td>${escapeHtml(ev.title)}</td>
            <td>${getEventTypeIcon(ev.type)} ${getEventTypeLabel(ev.type)}</td>
            <td class="action-cell">
                <button class="btn btn-sm btn-edit" data-action="editEvent" data-id="${ev.id}">✏️</button>
                <button class="btn btn-sm btn-delete" data-action="deleteEvent" data-id="${ev.id}">🗑️</button>
            </td>
        </tr>
    `).join("");
}

/**
 * Таблица галереи в админке
 */
function renderAdminGalleryTable() {
    const tbody = document.getElementById("adminGalleryBody");
    if (!tbody) return;

    const gallery = clubData.gallery || [];

    if (!gallery.length) {
        tbody.innerHTML = '<tr><td colspan="3" class="empty-cell">Нет фото</td></tr>';
        return;
    }

    tbody.innerHTML = gallery.map((item) => `
        <tr>
            <td><img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.caption)}" class="admin-gallery-thumb"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 60%22><rect fill=%22%231a1f35%22 width=%2280%22 height=%2260%22/><text x=%2250%%22 y=%2250%%22 fill=%22%237f8ab5%22 font-size=%2220%22 text-anchor=%22middle%22 dominant-baseline=%22central%22>🖼️</text></svg>'"></td>
            <td>${escapeHtml(item.caption)}</td>
            <td class="action-cell">
                <button class="btn btn-sm btn-edit" data-action="editGalleryItem" data-id="${item.id}">✏️</button>
                <button class="btn btn-sm btn-delete" data-action="deleteGalleryItem" data-id="${item.id}">🗑️</button>
            </td>
        </tr>
    `).join("");
}

/** Helper mapping for achievements translations */
function getAchievementTypeLabel(type) {
    const map = {
        "wins3v3": "⚔️ Победы 3 на 3",
        "winsSd": "☠️ Победы ШД",
        "ranked": "🏆 Ранкед рекорд",
        "fame": "🌟 Зал славы"
    };
    return map[type] || type;
}

function getAchievementPeriodLabel(period) {
    const map = {
        "week": "📅 Неделя",
        "month": "🗓️ Месяц",
        "year": "⏳ Год",
        "alltime": "♾️ Все время",
        "hall-of-fame": "⭐ Зал славы"
    };
    return map[period] || period;
}

/**
 * Таблица достижений в админке
 */
function renderAdminAchievementsTable() {
    const tbody = document.getElementById("adminAchievementsBody");
    if (!tbody) return;

    const achievements = clubData.achievements || [];

    if (!achievements.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-cell">Нет достижений</td></tr>';
        return;
    }

    tbody.innerHTML = achievements.map((ach) => `
        <tr>
            <td>${getAchievementTypeLabel(ach.type)}</td>
            <td>${getAchievementPeriodLabel(ach.period)}</td>
            <td>${escapeHtml(ach.players)}</td>
            <td>${escapeHtml(ach.value)}</td>
            <td class="action-cell">
                <button class="btn btn-sm btn-edit" data-action="editAchievement" data-id="${ach.id}">✏️</button>
                <button class="btn btn-sm btn-delete" data-action="deleteAchievement" data-id="${ach.id}">🗑️</button>
            </td>
        </tr>
    `).join("");
}

/**
 * Предзаполнение формы настроек клуба текущими данными
 */
function prefillSettingsForm() {
    const fields = {
        settingName: clubData.info.name,
        settingTag: clubData.info.tag,
        settingTrophies: clubData.info.requiredTrophies,
        settingDescription: clubData.info.description,
        settingTelegram: clubData.info.ownerTelegram
    };

    for (const [id, value] of Object.entries(fields)) {
        const el = document.getElementById(id);
        if (el) el.value = value;
    }
}


// ============================================================
// 15. ФОНОВЫЕ ЧАСТИЦЫ (PARTICLE BACKGROUND)
// ============================================================

/**
 * Создание частиц в секции hero
 */
function createParticles() {
    const container = document.getElementById("heroParticles");
    if (!container) return;

    // Очистка предыдущих частиц
    container.innerHTML = "";

    for (let i = 0; i < 25; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";

        const size = Math.random() * 4 + 2; // 2-6px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 5 + 3}s`;  // 3-8s
        particle.style.animationDelay = `${Math.random() * 5}s`;          // 0-5s

        container.appendChild(particle);
    }
}


// ============================================================
// 16. УТИЛИТАРНЫЕ ФУНКЦИИ
// ============================================================

/**
 * Экранирование HTML-спецсимволов для защиты от XSS
 * @param {string} str - исходная строка
 * @returns {string} безопасная строка
 */
function escapeHtml(str) {
    if (typeof str !== "string") return String(str);
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return str.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Генерация уникального ID на основе временной метки
 * @returns {string}
 */
function generateId() {
    return Date.now().toString();
}

/**
 * Форматирование текущей даты в формате ДД.ММ.ГГГГ
 * @returns {string}
 */
function formatDate() {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

/**
 * Стандартная debounce-функция
 * @param {Function} fn - функция для отложенного вызова
 * @param {number} delay - задержка в мс
 * @returns {Function}
 */
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

/**
 * Получить CSS-класс бейджа роли
 * @param {string} role - роль участника
 * @returns {string} CSS-класс
 */
function getRoleBadgeClass(role) {
    const map = {
        "Президент": "role-president",
        "Вице-президент": "role-vice-president",
        "Ветеран": "role-veteran",
        "Участник": "role-member"
    };
    return map[role] || "role-member";
}

/**
 * Получить эмодзи-иконку типа события
 * @param {string} type - тип события
 * @returns {string} эмодзи
 */
function getEventTypeIcon(type) {
    const icons = {
        megapig: "🐷",
        tournament: "⚔️",
        cleanup: "🧹",
        friendly: "🤝"
    };
    return icons[type] || "📌";
}

/**
 * Получить русское название типа события
 * @param {string} type - тип события
 * @returns {string} название
 */
function getEventTypeLabel(type) {
    const labels = {
        megapig: "Мегакопилка",
        tournament: "Турнир",
        cleanup: "Очистка",
        friendly: "Дружеский матч"
    };
    return labels[type] || "Другое";
}


// ============================================================
// 17. (Цвета точек таймлайна — см. renderEvents)
// ============================================================


/**
 * Event delegation for admin table buttons (fixes mobile tap issues).
 * Mobile browsers sometimes do not fire onclick on dynamically rendered
 * button elements inside scrollable table wrappers. Using event delegation
 * on the document with both "click" and "touchend" solves this.
 */
(function setupAdminButtonDelegation() {
    function handleAdminAction(e) {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        const action = btn.getAttribute("data-action");
        const id = btn.getAttribute("data-id");
        if (!action || !id) return;

        if (!isAdminAuthenticated) {
            showToast("Доступ запрещен!", "error");
            return;
        }

        switch (action) {
            case "editNews": openNewsModal(id); break;
            case "deleteNews": deleteNews(id); break;
            case "editMember": openMemberModal(id); break;
            case "deleteMember": deleteMember(id); break;
            case "editEvent": openEventModal(id); break;
            case "deleteEvent": deleteEvent(id); break;
            case "editGalleryItem": openGalleryModal(id); break;
            case "deleteGalleryItem": deleteGalleryItem(id); break;
            case "editAchievement": openAchievementModal(id); break;
            case "deleteAchievement": deleteAchievement(id); break;
        }
    }

    document.addEventListener("click", handleAdminAction);
    // touchend for mobile — fires even when onclick is swallowed
    document.addEventListener("touchend", function(e) {
        const btn = e.target.closest("button[data-action]");
        if (!btn) return;
        // Prevent the subsequent click from firing a duplicate
        e.preventDefault();
        handleAdminAction(e);
    }, { passive: false });
})();

/** Открыть lightbox */
window.openLightbox = function (id) {
    openLightbox(id);
};


// ============================================================
// 19. ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ============================================================

/**
 * Главная точка входа — инициализация всего приложения
 */
function initApp() {
    // Загрузка данных
    loadState();

    // Настройка навигации и интерфейса
    setupTabNavigation();
    setupMobileMenu();
    setupFilters();

    // Настройка админ-панели
    setupAdminAuth();
    setupAdminForms();

    // Настройка копирования и визуальных эффектов
    setupClipboard();
    createParticles();
    setupScrollReveal();

    // Проверка секретной ссылки для входа в админку
    checkAdminUrlAccess();

    // Первоначальный рендеринг
    renderUI();

    console.log("🎮 Священная Империя — сайт клуба загружен!");
}

/**
 * Проверка, содержит ли URL секретный параметр или хэш для открытия админ-панели
 */
function checkAdminUrlAccess() {
    const isUrlParam = window.location.search.includes("adminka_bs");
    const isHash = window.location.hash.includes("adminka_bs");
    
    if (isUrlParam || isHash) {
        switchTab("admin");
        showToast("Секретный доступ обнаружен! Пожалуйста, авторизуйтесь.", "info");
    }
}

// Запуск при загрузке DOM
document.addEventListener("DOMContentLoaded", initApp);

// Слушаем изменения хэша для динамического входа в админку без перезагрузки
window.addEventListener("hashchange", checkAdminUrlAccess);
