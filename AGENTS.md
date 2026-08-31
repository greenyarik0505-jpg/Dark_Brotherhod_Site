# 🎮 Brawl Stars Club Sites — Руководство по Проекту (AGENTS.md)

> **Документ для разработчиков и ИИ-ассистентов.**  
> Содержит полное описание архитектуры проекта, ссылки на репозитории, настройки хостинга, доменов, базы данных Firebase и скрипта автообновления кубков.

---

## 📌 1. Обзор проекта

Проект представляет собой экосистему веб-сайтов для клубов игры **Brawl Stars**.  
Каждый сайт включает в себя:
- **Главную страницу клуба**: статистика, описание, новости, галерея достижений, зал славы, события, правила чата и форма вступления.
- **Скрытую Админ-панель** (доступ по хэшу `/#adminka_bs`): добавление/редактирование/удаление участников, новостей, событий, картинок в галерею и рекордов.
- **Интерактивную презентацию** (`/presentation.html`) на базе Reveal.js с демонстрацией сайта на макетах ПК и мобильного телефона.
- **VIP Desktop Утилиту (`BrawlUpdater.py`)** на Python (CustomTkinter) для 1-клик синхронизации кубков и состава клубов напрямую из серверов Supercell Brawl Stars API в Firebase.

### Стек технологий:
- **Фронтенд**: Чистый HTML5, CSS3 (Glassmorphism, Neon Dark Theme, Flexbox/Grid), Vanilla JavaScript (ES6+).
- **Презентация**: Reveal.js.
- **База данных и бэкенд**: Google Firebase Realtime Database + Firebase Authentication (Email/Password).
- **Хостинг**: GitHub Pages (Static Hosting) + Custom DNS (домены `.eu.cc`).
- **Синхронизатор**: Python + `customtkinter` + `requests`.

---

## 🌐 2. Сайты и Репозитории

> ⚠️ **КРИТИЧЕСКОЕ ПРАВИЛО: НЕ ОБЪЕДИНЯТЬ КЛУБЫ!**  
> **«Священная Империя»** и **«Dark Brotherhood»** — это **два абсолютно разных, независимых клуба**!  
> У каждого клуба:
> 1. Свой отдельный репозиторий на GitHub и локальная папка (`Holy_Empire` и `Dark_Brotherhood`).
> 2. Своя отдельная база данных Firebase (`brawlclub-432dd` vs `dark-club-57e07`).
> 3. Свой собственный домен (`holy-empire-club.eu.cc` vs `dark-brotherhood.eu.cc`).
> 4. Свои администраторы, пароли, правила и состав участников.
> **СТРОГО ЗАПРЕЩЕНО** объединять их базы данных, домены или репозитории в один! Любые изменения вносятся строго изолированно в папку нужного клуба.

В проекте развёрнуто **2 клуба**:

| Параметр | Клуб 1: Священная Империя (Holy Empire) | Клуб 2: Dark Brotherhood |
| :--- | :--- | :--- |
| **Локальная папка** | `D:\Brawl_Stars_Clubs\Holy_Empire` | `D:\Brawl_Stars_Clubs\Dark_Brotherhood` |
| **GitHub Репозиторий** | [github.com/greenyarik0505-jpg/Brawl_Stars_Club_Site](https://github.com/greenyarik0505-jpg/Brawl_Stars_Club_Site) | [github.com/greenyarik0505-jpg/Dark_Brotherhod_Site](https://github.com/greenyarik0505-jpg/Dark_Brotherhod_Site) |
| **Ветка деплоя** | `main` | `master` |
| **Основной домен** | `https://holy-empire-club.eu.cc` | `https://dark-brotherhood.eu.cc` |
| **Резервный URL** | `https://greenyarik0505-jpg.github.io/Brawl_Stars_Club_Site/` | `https://greenyarik0505-jpg.github.io/Dark_Brotherhod_Site/` |
| **Тег клуба в игре** | `#2QCLRR800` | `#809L8LRUL` |
| **Админ-панель** | `https://holy-empire-club.eu.cc/#adminka_bs` | `https://dark-brotherhood.eu.cc/#adminka_bs` |
| **Презентация** | `https://holy-empire-club.eu.cc/presentation.html` | `https://dark-brotherhood.eu.cc/presentation.html` |
| **Firebase Project** | `brawlclub-432dd` | `dark-club-57e07` |
| **Firebase RTDB URL** | `https://brawlclub-432dd-default-rtdb.europe-west1.firebasedatabase.app` | `https://dark-club-57e07-default-rtdb.europe-west1.firebasedatabase.app` |
| **Firebase Web API Key** | `AIzaSyDzvGVlyssX3t-ZZJzmdydaiY-nBKBou7c` | `AIzaSyCh14CMKFKwVqtEz6s9mSxKyMmxoEFscFc` |

---

## 🚀 3. Хостинг и команды консоли

Сайты хостятся на **GitHub Pages** бесплатно.

### 3.1. Как пушить изменения в репозиторий через консоль:

#### Для Священной Империи (`D:\Brawl_Stars_Clubs\Holy_Empire`):
```powershell
cd D:\Brawl_Stars_Clubs\Holy_Empire
git add .
git commit -m "feat: описание изменений"
git push origin main
```

#### Для Dark Brotherhood (`D:\Brawl_Stars_Clubs\Dark_Brotherhood`):
```powershell
cd D:\Brawl_Stars_Clubs\Dark_Brotherhood
git add .
git commit -m "feat: описание изменений"
git push origin master
```

---

## 🌍 4. Настройка Доменов и DNS

### 4.1. DNS Записи (у регистратора доменов, например eu.org / eu.cc):
Для привязки любого домена к GitHub Pages необходимо добавить **4 A-записи**:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

### 4.2. Файл CNAME в репозитории:
В корне проекта лежит файл `CNAME` (без расширения), содержащий одну строчку с доменом, например:
```
dark-brotherhood.eu.cc
```
При пуше файла `CNAME` GitHub Pages автоматически привязывает домен и выписывает бесплатный SSL-сертификат (HTTPS).

### 4.3. Привязка домена через консоль (GitHub API):
```powershell
gh api -X PUT /repos/greenyarik0505-jpg/Dark_Brotherhod_Site/pages -f cname="dark-brotherhood.eu.cc"
```

---

## 🔑 5. База Данных Firebase и Авторизация

### 5.1. Архитектура базы (Realtime Database)
Все данные сайта хранятся в корневом узле `brawlClubData`:
```json
{
  "brawlClubData": {
    "info": {
      "name": "Dark Brotherhood",
      "tag": "#809L8LRUL",
      "description": "...",
      "requiredTrophies": 60000,
      "ownerTelegram": "@yarik_owner"
    },
    "members": [
      {
        "id": "m1",
        "name": "Яросний хом'як",
        "role": "Президент",
        "trophies": 128762,
        "avatar": "👑"
      }
    ],
    "news": [
      {
        "id": "1",
        "date": "18.07.2026",
        "title": "🎉 Запуск сайта!",
        "content": "..."
      }
    ],
    "events": [
      {
        "id": "1",
        "date": "Каждые выходные",
        "title": "Мегакопилка",
        "desc": "...",
        "type": "megapig"
      }
    ],
    "gallery": [],
    "achievements": []
  }
}
```

### 5.2. Правила Безопасности (Security Rules)
В Firebase Console -> **Realtime Database** -> **Rules**:
```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```
*Чтение доступно всем посетителям сайта. Запись и редактирование разрешены только авторизованным администраторам.*

### 5.3. Авторизация (Firebase Auth)
1. В Firebase Console -> **Authentication** -> вкладка **Sign-in method** включен провайдер **Email/Password**.
2. Во вкладке **Users** создаются администраторы:
   - Пример для Dark Brotherhood: `hamster_admin@brawl.com` / `hamster_admin`
   - Пример для Священной Империи: `bibrik@brawl.com` / `bibrik_admin`
3. На сайте при вводе логина без `@` скрипт автоматически дописывает `@brawl.com`.

---

## ⚡ 6. VIP Синхронизатор Кубков (`BrawlUpdater.py`)

Находится в папке `D:\Brawl_Stars_Clubs\Dark_Brotherhood\BrawlUpdater.py`.  
Запускается через Python или созданный `.bat` файл на рабочем столе.

Пример содержимого `.bat` файла:
```bat
@echo off
cd /d "D:\Brawl_Stars_Clubs\Dark_Brotherhood"
start "" pythonw "D:\Brawl_Stars_Clubs\Dark_Brotherhood\BrawlUpdater.py"
```

### Как работает утилита:
1. Построена на **CustomTkinter** (тёмный VIP-интерфейс).
2. Позволяет в выпадающем списке переключать клуб (**Dark Brotherhood** / **Holy Empire**).
3. Сохраняет настройки и авторизационные данные для каждого клуба раздельно в `brawl_updater_config.json`.
4. При нажатии кнопки **«🚀 ПОЛНАЯ СИНХРОНИЗАЦИЯ»**:
   - Авторизуется в Firebase через Google Identity Toolkit API (`signInWithPassword`) и получает временный `idToken`.
   - Запрашивает официальный API Brawl Stars (`https://api.brawlstars.com/v1/clubs/{tag}/members`) с API-ключом пользователя.
   - Скачивает текущую базу из Firebase.
   - **Синхронизирует**: обновляет кубки и роли у текущих участников, добавляет новых игроков, удаляет выбывших из клуба, сохраняя при этом кастомные аватарки.
   - Отправляет обновлённый JSON через REST API Firebase с параметром `?auth={idToken}`.

---

## 📁 7. Локальные Пути и Структура Файлов на Диске

```text
📁 Главная папка проектов: D:\Brawl_Stars_Clubs\
├── AGENTS.md                   # Главное руководство по проекту для ИИ и разработчиков
│
├── 📂 Holy_Empire\             # Клуб 1: Священная Империя (Holy Empire)
│   ├── index.html              # Главная страница (табы, модалки, правила, заявки)
│   ├── style.css               # Оформление (неон, стекло, адаптив под смартфоны)
│   ├── script.js               # Основной JS движок (Firebase RTDB + Auth, админка)
│   ├── presentation.html       # Интерактивная презентация (Reveal.js)
│   ├── CNAME                   # Домен (holy-empire-club.eu.cc)
│   ├── README.md               # Краткое описание репозитория
│   └── AGENTS.md               # Руководство для ИИ
│
└── 📂 Dark_Brotherhood\        # Клуб 2: Dark Brotherhood
    ├── index.html              # Главная страница клуба Dark Brotherhood
    ├── style.css               # Оформление и стили
    ├── script.js               # JS движок под базу dark-club-57e07
    ├── presentation.html       # Интерактивная презентация Dark Brotherhood
    ├── CNAME                   # Домен (dark-brotherhood.eu.cc)
    ├── BrawlUpdater.py         # Главный скрипт VIP-автообновления кубков (Python)
    ├── brawl_updater_config.json # Сохранённые ключи и пароли админов для обоих клубов
    ├── README.md               # Краткое описание репозитория
    └── AGENTS.md               # Руководство для ИИ
```

---

## 💡 8. Советы для следующих ИИ-ассистентов

1. **Кодировка**: Все файлы должны строго сохраняться в **UTF-8 without BOM**.
2. **Кэш браузера**: При обновлении `style.css` или `script.js` увеличивайте версию в `index.html` (например, `style.css?v=7`) и переменную `SITE_VERSION` в `script.js`, чтобы браузеры сбрасывали кэш.
3. **Безопасность**: Никогда не убирайте проверку `auth != null` из Firebase Rules на постоянной основе.
4. **Адаптивность**: Мобильные стили критичны — проверяйте медиа-запросы в `style.css` и масштабирование макетов в `presentation.html`.
5. **Git CLI**: На компьютере пользователя установлен `gh` (GitHub CLI) с авторизованным аккаунтом `greenyarik0505-jpg`. Можно выполнять операции создания репозиториев и управления Pages напрямую через `gh`.
