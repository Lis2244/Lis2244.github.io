// Основной класс приложения
class FootballTournament {
    constructor() {
        this.db = new FootballDB();
        this.currentMatchId = null;
        this.editingMatchId = null;
        this.editingPlayerId = null;
        this.isInitialized = false;
        this.init();
    }

    // Инициализация приложения
    async init() {
        try {
            await this.db.init();
            await this.ensureDefaultData();
            this.bindEvents();
            this.addValidationRules();
            this.setupDesktopNavigation();
            await this.renderStandings();
            await this.renderMatches();
            await this.renderAnalytics();
            await this.checkAdminStatus(); // Проверяем статус админа
            this.setupMobileNavigation();
            this.isInitialized = true;
            console.log('Приложение инициализировано');
        } catch (error) {
            console.error('Ошибка инициализации:', error);
            alert('Ошибка загрузки приложения. Попробуйте обновить страницу.');
        }
    }

    // Создание данных по умолчанию
    async ensureDefaultData() {
        const teams = await this.db.getTeams();
        if (teams.length === 0) {
            // Создаем нашу команду по умолчанию
            const ourTeam = {
                id: 1,
                name: 'Наша команда',
                logo: '',
                players: []
            };
            await this.db.addTeam(ourTeam);
        }
    }

    // Привязка событий
    bindEvents() {
        // Админ-панель
        this.safeAddEventListener('adminLoginBtn', 'click', () => this.showLoginModal());
        this.safeAddEventListener('logoutBtn', 'click', () => this.logout());
        this.safeAddEventListener('cleanupStorageBtn', 'click', () => this.cleanupStorage());
        this.safeAddEventListener('loginBtn', 'click', () => this.login());
        this.safeAddEventListener('setupBtn', 'click', () => this.setupPassword());

        // Управление командой
        this.safeAddEventListener('saveTeamBtn', 'click', () => this.saveTeam());
        this.safeAddEventListener('addPlayerBtn', 'click', () => this.addPlayer());

        // Матчи
        this.safeAddEventListener('addMatchBtn', 'click', () => this.addMatch());

        // Модальное окно счёта
        this.safeAddEventListener('saveScoreBtn', 'click', () => this.saveScore());
        this.safeAddEventListener('cancelScoreBtn', 'click', () => this.hideScoreModal());

        // Модальное окно редактирования матча
        this.safeAddEventListener('updateMatchBtn', 'click', () => this.updateMatch());
        this.safeAddEventListener('deleteMatchBtn', 'click', () => this.deleteMatch());
        this.safeAddEventListener('cancelEditBtn', 'click', () => this.hideEditMatchModal());

        // Модальное окно статистики
        this.safeAddEventListener('closeStatsBtn', 'click', () => this.hidePlayerStatsModal());

        // Модальное окно управления статистикой игрока
        this.safeAddEventListener('savePlayerStatsBtn', 'click', () => this.savePlayerStats());
        this.safeAddEventListener('cancelPlayerStatsBtn', 'click', () => this.hidePlayerStatsEditModal());

        // Закрытие модальных окон по клику вне области
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.add('hidden');
            }
        });
    }

    // Добавление правил валидации
    addValidationRules() {
        // Валидация для добавления матча
        this.safeAddEventListener('opponentName', 'input', (e) => {
            this.validateField(e.target, {
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Zа-яА-Я0-9\s\-]+$/,
                required: true
            });
        });
        this.safeAddEventListener('matchDate', 'change', (e) => {
            this.validateField(e.target, {
                required: true
            });
        });

        // Валидация для добавления игрока
        this.safeAddEventListener('playerName', 'input', (e) => {
            this.validateField(e.target, {
                minLength: 2,
                maxLength: 30,
                pattern: /^[a-zA-Zа-яА-Я\s]+$/,
                required: true
            });
        });
        this.safeAddEventListener('playerNumber', 'input', (e) => {
            this.validateField(e.target, {
                pattern: /^[0-9]*$/,
                minValue: 1,
                maxValue: 99
            });
        });

        // Валидация для редактирования матча
        this.safeAddEventListener('editOpponentName', 'input', (e) => {
            this.validateField(e.target, {
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Zа-яА-Я0-9\s\-]+$/,
                required: true
            });
        });

        // Валидация пароля администратора
        this.safeAddEventListener('adminPassword', 'input', (e) => {
            this.validateField(e.target, {
                minLength: 4,
                maxLength: 20,
                required: true
            });
        });
    }

    // Валидация поля
    validateField(field, rules) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Сброс предыдущих стилей
        field.classList.remove('invalid', 'valid');

        if (rules.required && !value) {
            isValid = false;
            message = 'Это поле обязательно для заполнения';
        } else if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            message = `Минимальная длина: ${rules.minLength} символов`;
        } else if (rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            message = `Максимальная длина: ${rules.maxLength} символов`;
        } else if (rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            message = 'Недопустимые символы';
        } else if (rules.minValue && parseInt(value) < rules.minValue) {
            isValid = false;
            message = `Минимальное значение: ${rules.minValue}`;
        } else if (rules.maxValue && parseInt(value) > rules.maxValue) {
            isValid = false;
            message = `Максимальное значение: ${rules.maxValue}`;
        }

        if (isValid) {
            field.classList.add('valid');
            this.clearFieldError(field);
        } else {
            field.classList.add('invalid');
            this.showFieldError(field, message);
        }
        return isValid;
    }

    // Показать ошибку поля
    showFieldError(field, message) {
        this.clearFieldError(field);
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
            display: block;
        `;
        field.parentNode.appendChild(errorElement);
    }

    // Очистить ошибку поля
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Безопасное добавление обработчиков событий
    safeAddEventListener(elementId, event, handler) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener(event, handler);
        } else {
            console.warn(`Элемент ${elementId} не найден для добавления обработчика ${event}`);
        }
    }

    // Безопасное управление видимостью элементов
    safeToggleElement(elementId, show) {
        const element = document.getElementById(elementId);
        if (element) {
            if (show) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
            return true;
        } else {
            console.warn(`Элемент ${elementId} не найден для управления видимостью`);
            return false;
        }
    }

    // Настройка десктопной навигации
    setupDesktopNavigation() {
        const tabs = document.querySelectorAll('.desktop-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    // Настройка мобильной навигации
    setupMobileNavigation() {
        const tabs = document.querySelectorAll('.mobile-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    // Переключение вкладок
    switchTab(tabName) {
        // Обновляем активные вкладки
        document.querySelectorAll('.mobile-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.desktop-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Активируем выбранную вкладку
        const activeMobileTab = document.querySelector(`.mobile-tab[data-tab="${tabName}"]`);
        const activeDesktopTab = document.querySelector(`.desktop-tab[data-tab="${tabName}"]`);
        const activeSection = document.getElementById(`${tabName}Section`);

        if (activeMobileTab) activeMobileTab.classList.add('active');
        if (activeDesktopTab) activeDesktopTab.classList.add('active');
        if (activeSection) activeSection.classList.add('active');

        // Обновляем данные если нужно
        if (tabName === 'analytics') {
            this.renderAnalytics();
        } else if (tabName === 'team') {
            this.renderPlayers();
        }
    }

    // Очистка хранилища
    async cleanupStorage() {
        if (confirm('Это очистит все данные и сбросит приложение. Продолжить?')) {
            try {
                // Закрываем соединение с БД
                if (this.db && this.db.db) {
                    this.db.db.close();
                }
                // Удаляем IndexedDB
                await new Promise((resolve, reject) => {
                    const request = indexedDB.deleteDatabase('FootballTournamentDB');
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                    request.onblocked = () => {
                        alert('Закройте другие вкладки приложения и попробуйте снова');
                        reject(new Error('База данных заблокирована'));
                    };
                });
                // Очищаем LocalStorage
                localStorage.clear();
                // Очищаем кэш Service Worker
                if ('caches' in window) {
                    const cacheNames = await caches.keys();
                    await Promise.all(
                        cacheNames.map(cacheName => caches.delete(cacheName))
                    );
                }
                alert('Все данные очищены. Страница будет перезагружена.');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (error) {
                console.error('Ошибка очистки:', error);
                alert('Ошибка очистки данных: ' + error.message);
            }
        }
    }

    // Проверка статуса администратора
    async checkAdminStatus() {
        try {
            const isAdmin = await this.db.getSetting('isAdmin');
            console.log('Проверка статуса администратора из IndexedDB:', isAdmin);
            if (isAdmin === 'true') {
                this.showAdminPanel();
            } else {
                this.hideAdminPanel();
            }
        } catch (error) {
            console.error('Ошибка проверки статуса администратора:', error);
        }
    }

    // Показать модальное окно входа
    showLoginModal() {
        this.safeToggleElement('loginModal', true);
    }

    // Вход администратора
    async login() {
    const passwordInput = document.getElementById('adminPassword');
    const loginBtn = document.getElementById('loginBtn');
    const loginText = document.getElementById('loginText');
    const loginSpinner = document.getElementById('loginSpinner');
    
    if (!passwordInput) {
        alert('Ошибка: поле пароля не найдено');
        return;
    }
    
    // Валидация пароля
    if (!this.validateField(passwordInput, { minLength: 4, required: true })) {
        return;
    }
    
    // Показываем индикатор загрузки
    if (loginBtn && loginText && loginSpinner) {
        loginText.textContent = 'Вход...';
        loginSpinner.classList.remove('hidden');
        loginBtn.disabled = true;
    }
    
    try {
        const password = passwordInput.value;
        const savedPassword = await this.db.getSetting('adminPassword');
        if (!savedPassword) {
            alert('Сначала настройте пароль администратора');
            return;
        }

        if (password === savedPassword) {
            await this.db.setSetting('isAdmin', 'true');
            this.showAdminPanel();
            this.safeToggleElement('loginModal', false);
            passwordInput.value = '';
            await this.renderMatches();
            console.log('Вход выполнен успешно');
        } else {
            alert('Неверный пароль');
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        alert('Ошибка входа');
    } finally {
        // Восстанавливаем кнопку
        if (loginBtn && loginText && loginSpinner) {
            loginText.textContent = 'Войти';
            loginSpinner.classList.add('hidden');
            loginBtn.disabled = false;
        }
    }
}

    // Настройка пароля
    async setupPassword() {
        const passwordInput = document.getElementById('adminPassword');
        if (!passwordInput) {
            alert('Ошибка: поле пароля не найдено');
            return;
        }
        // Валидация пароля
        if (!this.validateField(passwordInput, { minLength: 4, required: true })) {
            return;
        }
        const password = passwordInput.value;
        await this.db.setSetting('adminPassword', password);
        await this.db.setSetting('isAdmin', 'true');
        this.showAdminPanel(); // Обновляем UI
        this.safeToggleElement('loginModal', false);
        passwordInput.value = '';
        await this.renderMatches();
        alert('Пароль установлен!');
    }

    // Показать админ-панель
    showAdminPanel() {
        console.log('Показываем админ-панель');
        // Всегда показываем управление командой в админ-режиме
        this.safeToggleElement('teamManagement', true);
        this.safeToggleElement('teamGuestMessage', false);

        // Показываем админские элементы
        this.safeToggleElement('adminSection', true);
        this.safeToggleElement('addMatchForm', true);

        // Скрываем кнопку входа
        this.safeToggleElement('adminLoginBtn', false);
        this.loadTeamData();
        this.renderPlayers();
    }

    // Скрыть админ-панель
    hideAdminPanel() {
        console.log('Скрываем админ-панель');
        // Скрываем админские элементы
        this.safeToggleElement('adminSection', false);
        this.safeToggleElement('addMatchForm', false);
        this.safeToggleElement('teamManagement', false);

        // Показываем кнопку входа и сообщение для гостей
        this.safeToggleElement('adminLoginBtn', true);
        this.safeToggleElement('teamGuestMessage', true);
        this.renderPlayers(); // Обновляем список игроков для гостя
    }

    // Выход
    async logout() {
        await this.db.setSetting('isAdmin', 'false');
        console.log('Выход из админ-панели');
        this.hideAdminPanel(); // Обновляем UI
        await this.renderMatches();
    }

    // Загрузка данных команды
    async loadTeamData() {
        const teamNameInput = document.getElementById('teamName');
        if (!teamNameInput) {
            console.warn('Поле названия команды не найдено');
            return;
        }
        const ourTeam = await this.db.getTeam(1);
        if (ourTeam) {
            teamNameInput.value = ourTeam.name;
        }
    }

    // Сохранение команды
    async saveTeam() {
        const teamNameInput = document.getElementById('teamName');
        if (!teamNameInput) {
            alert('Ошибка: поле названия команды не найдено');
            return;
        }
        // Валидация названия команды
        if (!this.validateField(teamNameInput, {
            minLength: 2,
            maxLength: 30,
            pattern: /^[a-zA-Zа-яА-Я0-9\s\-]+$/,
            required: true
        })) {
            return;
        }

        const teamName = teamNameInput.value.trim();
        const ourTeam = await this.db.getTeam(1);
        if (ourTeam) {
            ourTeam.name = teamName;
            await this.db.saveTeam(ourTeam);
            await this.renderStandings();
            alert('Команда сохранена!');
        }
    }

    // Добавление игрока
    async addPlayer() {
        const playerNameInput = document.getElementById('playerName');
        if (!playerNameInput) {
            alert('Ошибка: поле имени игрока не найдено');
            return;
        }
        // Валидация имени игрока
        if (!this.validateField(playerNameInput, {
            minLength: 2,
            maxLength: 30,
            pattern: /^[a-zA-Zа-яА-Я\s]+$/,
            required: true
        })) {
            return;
        }

        const name = playerNameInput.value.trim();
        const position = document.getElementById('playerPosition')?.value.trim() || '';
        const number = document.getElementById('playerNumber')?.value || '';

        const player = {
            id: Date.now(),
            teamId: 1, // ID нашей команды
            name: name,
            position: position || 'Не указана',
            number: number || '—'
        };

        await this.db.addPlayer(player);
        await this.renderPlayers();
        // Очистка формы
        playerNameInput.value = '';
        if (document.getElementById('playerPosition')) document.getElementById('playerPosition').value = '';
        if (document.getElementById('playerNumber')) document.getElementById('playerNumber').value = '';
        // Сброс стилей валидации
        playerNameInput.classList.remove('valid');
    }

    // Удаление игрока
    async removePlayer(playerId) {
        if (confirm('Вы уверены, что хотите удалить этого игрока?')) {
            // Удаляем статистику игрока
            const playerStats = await this.db.getPlayerStats(playerId);
            for (const stat of playerStats) {
                await this.db.deletePlayerStat(stat.id);
            }
            // Удаляем игрока
            await this.db.deletePlayer(playerId);
            await this.renderPlayers();
            await this.renderAnalytics();
        }
    }

    // Показать статистику игрока
    async showPlayerStats(playerId) {
        const player = await this.db.getPlayer(playerId);
        const stats = await this.db.getPlayerStats(playerId);
        const playerStats = this.calculatePlayerStats(stats);
        const rating = this.calculatePlayerRating(playerStats);

        const statsTitle = document.getElementById('playerStatsTitle');
        const statsContent = document.getElementById('playerStatsContent');
        if (statsTitle && statsContent) {
            statsTitle.textContent = `Статистика: ${player.name}`;
            statsContent.innerHTML = `
                <div class="stats-content">
                    <div class="stat-item">
                        <span>Рейтинг:</span>
                        <span class="stat-value">${rating}</span>
                    </div>
                    <div class="stat-item">
                        <span>Матчи:</span>
                        <span class="stat-value">${playerStats.matches}</span>
                    </div>
                    <div class="stat-item">
                        <span>Голы:</span>
                        <span class="stat-value">${playerStats.goals}</span>
                    </div>
                    <div class="stat-item">
                        <span>Ассисты:</span>
                        <span class="stat-value">${playerStats.assists}</span>
                    </div>
                    <div class="stat-item">
                        <span>Жёлтые карточки:</span>
                        <span class="stat-value">${playerStats.yellowCards}</span>
                    </div>
                    <div class="stat-item">
                        <span>Красные карточки:</span>
                        <span class="stat-value">${playerStats.redCards}</span>
                    </div>
                </div>
            `;
            this.safeToggleElement('playerStatsModal', true);
        }
    }

    // Расчет статистики игрока
    calculatePlayerStats(stats) {
    return {
        matches: stats.length,
        goals: stats.reduce((sum, stat) => sum + (stat.goals || 0), 0),
        assists: stats.reduce((sum, stat) => sum + (stat.assists || 0), 0),
        yellowCards: stats.reduce((sum, stat) => sum + (stat.yellowCards || 0), 0),
        redCards: stats.reduce((sum, stat) => sum + (stat.redCards || 0), 0) // Изменено
    };
}

    // Расчет рейтинга игрока
    calculatePlayerRating(playerStats) {
    let rating = 6.0; // Базовый рейтинг
    
    // Бонусы за голы и ассисты
    rating += (playerStats.goals * 0.3) + (playerStats.assists * 0.2);
    
    // Штрафы за карточки
    rating -= (playerStats.yellowCards * 0.1) + (playerStats.redCards * 0.5); // Увеличил штраф за красные
    
    // Бонус за участие в матчах
    if (playerStats.matches > 5) rating += 0.3;
    if (playerStats.matches > 10) rating += 0.3;
    if (playerStats.matches > 20) rating += 0.4;
    
    // Ограничиваем рейтинг от 0 до 10
    return Math.min(Math.max(rating, 0), 10).toFixed(1);
}

    // Скрыть модальное окно статистики
    hidePlayerStatsModal() {
        this.safeToggleElement('playerStatsModal', false);
    }

    // Отображение игроков с кнопкой редактирования статистики
    async renderPlayers() {
    const container = document.getElementById('playersContainer');
    if (!container) {
        console.warn('Контейнер игроков не найден');
        return;
    }

    const isAdmin = await this.db.getSetting('isAdmin') === 'true';
    const players = await this.db.getPlayers(1);
    if (players.length === 0) {
        container.innerHTML = '<p>Игроки не добавлены</p>';
        return;
    }

    // Рассчитываем рейтинг для каждого игрока
    const playersWithStats = await Promise.all(
        players.map(async (player) => {
            const stats = await this.db.getPlayerStats(player.id);
            const playerStats = this.calculatePlayerStats(stats);
            const rating = this.calculatePlayerRating(playerStats);
            return { ...player, rating, stats: playerStats };
        })
    );

    container.innerHTML = playersWithStats.map(player => `
        <div class="player-card">
            <div class="player-info">
                <h4>${player.name}</h4>
                <div class="player-details">
                    №${player.number} | ${player.position}
                </div>
                <div class="player-stats-mini">
                    <span class="stat-icon">⚽ ${player.stats.goals}</span>
                    <span class="stat-icon">🅰️ ${player.stats.assists}</span>
                    <span class="stat-icon">🟨 ${player.stats.yellowCards}</span>
                    <span class="stat-icon">🟥 ${player.stats.redCards}</span>
                </div>
            </div>
            <div class="player-actions">
                <span class="player-rating">${player.rating}</span>
                <button class="btn btn-info btn-sm" onclick="tournament.showPlayerStats(${player.id})">
                    📊 Статистика
                </button>
                ${isAdmin ? `
                <button class="btn btn-secondary btn-sm" onclick="tournament.editPlayerStats(${player.id})">
                    ✏️ Редактировать
                </button>
                <button class="btn btn-danger btn-sm" onclick="tournament.removePlayer(${player.id})">
                    🗑️ Удалить
                </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

    // Редактирование статистики игрока
    async editPlayerStats(playerId) {
    const player = await this.db.getPlayer(playerId);
    const stats = await this.db.getPlayerStats(playerId);
    // Для редактирования используем общую статистику (где matchId === null)
    const generalStat = stats.find(stat => stat.matchId === null) || {
        id: Date.now() + playerId, // Создаем уникальный ID для общей статистики
        playerId: playerId,
        matchId: null,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0  // Изменено с redCard на redCards
    };

    const statsTitle = document.getElementById('playerStatsEditTitle');
    const goalsInput = document.getElementById('playerGoals');
    const assistsInput = document.getElementById('playerAssists');
    const yellowCardsInput = document.getElementById('playerYellowCards');
    const redCardsInput = document.getElementById('playerRedCards'); // Изменено с чекбокса на инпут

    if (statsTitle && goalsInput && assistsInput && yellowCardsInput && redCardsInput) {
        statsTitle.textContent = `Редактирование статистики: ${player.name}`;
        goalsInput.value = generalStat.goals;
        assistsInput.value = generalStat.assists;
        yellowCardsInput.value = generalStat.yellowCards;
        redCardsInput.value = generalStat.redCards || 0; // Устанавливаем значение

        this.editingPlayerId = playerId;
        // Сохраняем ID общей статистики для обновления
        this.editingGeneralStatId = generalStat.id;
        this.safeToggleElement('playerStatsEditModal', true);
    }
}


    // Сохранение статистики игрока
    async savePlayerStats() {
    const goalsInput = document.getElementById('playerGoals');
    const assistsInput = document.getElementById('playerAssists');
    const yellowCardsInput = document.getElementById('playerYellowCards');
    const redCardsInput = document.getElementById('playerRedCards'); // Изменено

    if (!goalsInput || !assistsInput || !yellowCardsInput || !redCardsInput) {
        alert('Ошибка: поля формы не найдены');
        return;
    }

    const goals = parseInt(goalsInput.value) || 0;
    const assists = parseInt(assistsInput.value) || 0;
    const yellowCards = parseInt(yellowCardsInput.value) || 0;
    const redCards = parseInt(redCardsInput.value) || 0; // Изменено

    // Проверяем, существует ли уже общая статистика
    const existingGeneralStat = await this.db.getPlayerStat(this.editingGeneralStatId);

    if (existingGeneralStat) {
        // Обновляем существующую общую статистику
        existingGeneralStat.goals = goals;
        existingGeneralStat.assists = assists;
        existingGeneralStat.yellowCards = yellowCards;
        existingGeneralStat.redCards = redCards; // Изменено
        await this.db.savePlayerStat(existingGeneralStat);
    } else {
        // Создаем новую запись общей статистики
        const newGeneralStat = {
            id: this.editingGeneralStatId,
            playerId: this.editingPlayerId,
            matchId: null, // Обозначает общую статистику
            goals: goals,
            assists: assists,
            yellowCards: yellowCards,
            redCards: redCards // Изменено
        };
        await this.db.addPlayerStat(newGeneralStat);
    }

    await this.renderPlayers();
    await this.renderAnalytics();
    this.hidePlayerStatsEditModal();
    alert('Статистика сохранена!');
}

    // Скрыть модальное окно редактирования статистики
    hidePlayerStatsEditModal() {
        this.safeToggleElement('playerStatsEditModal', false);
        this.editingPlayerId = null;
        this.editingGeneralStatId = null; // Сброс ID общей статистики
    }

    // Добавление матча
    async addMatch() {
        const opponentNameInput = document.getElementById('opponentName');
        const matchDateInput = document.getElementById('matchDate');
        if (!opponentNameInput || !matchDateInput) {
            alert('Ошибка: поля формы не найдены');
            return;
        }
        // Валидация полей
        const isOpponentValid = this.validateField(opponentNameInput, {
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Zа-яА-Я0-9\s\-]+$/,
            required: true
        });
        const isDateValid = this.validateField(matchDateInput, {
            required: true
        });

        if (!isOpponentValid || !isDateValid) {
            alert('Исправьте ошибки в форме');
            return;
        }

        const opponentName = opponentNameInput.value.trim();
        const date = matchDateInput.value;

        // Создаем или находим команду соперника
        const teams = await this.db.getTeams();
        let opponentTeam = teams.find(team =>
            team.name.toLowerCase() === opponentName.toLowerCase() && team.id !== 1
        );
        if (!opponentTeam) {
            // Создаем новую команду соперника
            opponentTeam = {
                id: Date.now(),
                name: opponentName,
                logo: '',
                players: []
            };
            await this.db.addTeam(opponentTeam);
        }

        const match = {
            id: Date.now(),
            homeTeamId: 1, // Наша команда - дома
            awayTeamId: opponentTeam.id,
            homeScore: 0,
            awayScore: 0,
            date: date,
            status: 'scheduled'
        };

        await this.db.addMatch(match);
        await this.renderMatches();
        await this.renderStandings();
        await this.renderAnalytics();

        // Очистка формы
        opponentNameInput.value = '';
        matchDateInput.value = '';
        opponentNameInput.classList.remove('valid');
        matchDateInput.classList.remove('valid');
        alert('Матч добавлен!');
    }

    // Редактирование матча
    async editMatch(matchId) {
        const match = await this.db.getMatch(matchId);
        const awayTeam = await this.db.getTeam(match.awayTeamId);

        const editOpponentInput = document.getElementById('editOpponentName');
        const editDateInput = document.getElementById('editMatchDate');
        if (editOpponentInput && editDateInput) {
            editOpponentInput.value = awayTeam.name;
            editDateInput.value = match.date;
            this.editingMatchId = matchId;
            this.safeToggleElement('editMatchModal', true);
        }
    }

    // Обновление матча
    async updateMatch() {
        const editOpponentInput = document.getElementById('editOpponentName');
        const editDateInput = document.getElementById('editMatchDate');
        if (!editOpponentInput || !editDateInput) {
            alert('Ошибка: поля формы не найдены');
            return;
        }
        // Валидация полей
        const isOpponentValid = this.validateField(editOpponentInput, {
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Zа-яА-Я0-9\s\-]+$/,
            required: true
        });
        const isDateValid = this.validateField(editDateInput, {
            required: true
        });

        if (!isOpponentValid || !isDateValid) {
            alert('Исправьте ошибки в форме');
            return;
        }

        const opponentName = editOpponentInput.value.trim();
        const date = editDateInput.value;

        const match = await this.db.getMatch(this.editingMatchId);
        let awayTeam = await this.db.getTeam(match.awayTeamId);

        // Обновляем название команды соперника
        awayTeam.name = opponentName;
        await this.db.saveTeam(awayTeam);

        // Обновляем дату матча
        match.date = date;
        await this.db.saveMatch(match);

        await this.renderMatches();
        await this.renderStandings();
        await this.renderAnalytics();
        this.hideEditMatchModal();
        alert('Матч обновлен!');
    }

    // Удаление матча
    async deleteMatch() {
        if (confirm('Вы уверены, что хотите удалить этот матч? Это действие нельзя отменить.')) {
            await this.db.deleteMatch(this.editingMatchId);
            await this.renderMatches();
            await this.renderStandings();
            await this.renderAnalytics();
            this.hideEditMatchModal();
            alert('Матч удален!');
        }
    }

    // Удаление команды
    async deleteTeam(teamId) {
        if (teamId === 1) {
            alert('Нельзя удалить основную команду');
            return;
        }
        if (!confirm('Удаление команды также удалит все связанные матчи. Продолжить?')) {
            return;
        }
        try {
            // Удаляем связанные матчи
            const matches = await this.db.getMatches();
            const teamMatches = matches.filter(m =>
                m.homeTeamId === teamId || m.awayTeamId === teamId
            );
            for (const match of teamMatches) {
                await this.db.deleteMatch(match.id);
            }
            // Удаляем команду
            await this.db.deleteTeam(teamId);
            await this.renderStandings();
            await this.renderMatches();
            alert('Команда удалена');
        } catch (error) {
            console.error('Ошибка удаления команды:', error);
            alert('Ошибка при удалении команды');
        }
    }

    // Скрыть модальное окно редактирования матча
    hideEditMatchModal() {
        this.safeToggleElement('editMatchModal', false);
        this.editingMatchId = null;
    }

    // Отображение матчей
    async renderMatches() {
        const container = document.getElementById('matchesList');
        if (!container) {
            console.warn('Контейнер матчей не найден');
            return;
        }

        const isAdmin = await this.db.getSetting('isAdmin') === 'true';
        const matches = await this.db.getMatches();
        const teams = await this.db.getTeams();

        // Фильтруем матчи - убираем те, где команды не найдены (удалены)
        const validMatches = matches.filter(match => {
            const homeTeam = teams.find(t => t.id === match.homeTeamId);
            const awayTeam = teams.find(t => t.id === match.awayTeamId);
            return homeTeam && awayTeam;
        });

        if (validMatches.length === 0) {
            container.innerHTML = '<p>Матчи не добавлены</p>';
            return;
        }

        // Сортируем матчи по дате (сначала ближайшие)
        const sortedMatches = [...validMatches].sort((a, b) => new Date(a.date) - new Date(b.date));

        container.innerHTML = sortedMatches.map(match => {
            const homeTeam = teams.find(t => t.id === match.homeTeamId);
            const awayTeam = teams.find(t => t.id === match.awayTeamId);
            const isCompleted = match.status === 'completed';
            const isToday = new Date(match.date).toDateString() === new Date().toDateString();
            const isFuture = new Date(match.date) > new Date();

            // Проверяем, является ли команда соперника удаляемой (не нашей)
            const isAwayTeamDeletable = awayTeam && awayTeam.id !== 1;

            return `
                <div class="match-card ${isCompleted ? 'match-completed' : isToday ? 'match-today' : isFuture ? 'match-future' : 'match-past'}">
                    <div class="match-teams">
                        <div class="team">
                            <span class="team-name">${homeTeam.name}</span>
                        </div>
                        <div class="score">
                            ${isCompleted ?
                                `<span class="final-score">${match.homeScore} - ${match.awayScore}</span>` :
                                `<span class="vs">vs</span>`
                            }
                        </div>
                        <div class="team">
                            <span class="team-name">${awayTeam.name}</span>
                            ${isAdmin && isAwayTeamDeletable ? `
                                <button class="btn btn-danger btn-sm" onclick="tournament.deleteTeam(${awayTeam.id})" style="margin-top: 5px;">
                                    🗑️ Удалить команду
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    <div class="match-date">
                        ${new Date(match.date).toLocaleDateString('ru-RU')}
                        ${isToday ? ' (Сегодня)' : ''}
                        ${isFuture ? ' (Будет)' : !isCompleted ? ' (Не сыгран)' : ''}
                    </div>
                    ${isAdmin ? `
                        <div class="match-actions">
                            <button class="btn btn-sm" onclick="tournament.editScore(${match.id})">
                                ${isCompleted ? '✏️ Счёт' : '⚽ Счёт'}
                            </button>
                            <button class="btn btn-secondary btn-sm" onclick="tournament.editMatch(${match.id})">
                                ✏️ Редакт.
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    // Редактирование счёта
    async editScore(matchId) {
        const match = await this.db.getMatch(matchId);
        const teams = await this.db.getTeams();
        const homeTeam = teams.find(t => t.id === match.homeTeamId);
        const awayTeam = teams.find(t => t.id === match.awayTeamId);

        const homeTeamName = document.getElementById('homeTeamName');
        const awayTeamName = document.getElementById('awayTeamName');
        const homeScoreInput = document.getElementById('homeScore');
        const awayScoreInput = document.getElementById('awayScore');

        if (homeTeamName && awayTeamName && homeScoreInput && awayScoreInput) {
            homeTeamName.textContent = homeTeam.name;
            awayTeamName.textContent = awayTeam.name;
            homeScoreInput.value = match.homeScore;
            awayScoreInput.value = match.awayScore;
            this.currentMatchId = matchId;
            this.safeToggleElement('scoreModal', true);
        }
    }

    // Сохранение счёта
    async saveScore() {
        const homeScoreInput = document.getElementById('homeScore');
        const awayScoreInput = document.getElementById('awayScore');
        if (!homeScoreInput || !awayScoreInput) {
            alert('Ошибка: поля счёта не найдены');
            return;
        }

        const homeScore = parseInt(homeScoreInput.value);
        const awayScore = parseInt(awayScoreInput.value);

        if (isNaN(homeScore) || isNaN(awayScore) || homeScore < 0 || awayScore < 0) {
            alert('Введите корректный счёт');
            return;
        }

        const match = await this.db.getMatch(this.currentMatchId);
        match.homeScore = homeScore;
        match.awayScore = awayScore;
        match.status = 'completed';
        await this.db.saveMatch(match);

        await this.renderMatches();
        await this.renderStandings();
        await this.renderAnalytics();
        this.hideScoreModal();
    }

    // Скрыть модальное окно счёта
    hideScoreModal() {
        this.safeToggleElement('scoreModal', false);
        this.currentMatchId = null;
    }

    // Отображение турнирной таблицы
    async renderStandings() {
        const tbody = document.getElementById('standingsBody');
        if (!tbody) {
            console.warn('Таблица турнирной таблицы не найдена');
            return;
        }

        const teams = await this.db.getTeams();
        const matches = await this.db.getMatches();

        // Рассчитываем статистику для каждой команды
        const standings = await Promise.all(teams.map(async (team) => {
            // Получаем только сыгранные матчи, связанные с командой
            const teamMatches = matches.filter(m =>
                (m.homeTeamId === team.id || m.awayTeamId === team.id) && m.status === 'completed'
            );

            let matchesPlayed = 0;
            let wins = 0;
            let draws = 0;
            let losses = 0;
            let goalsFor = 0;
            let goalsAgainst = 0;

            teamMatches.forEach(match => {
                const isHome = match.homeTeamId === team.id;
                const teamScore = isHome ? match.homeScore : match.awayScore;
                const opponentScore = isHome ? match.awayScore : match.homeScore;

                goalsFor += teamScore;
                goalsAgainst += opponentScore;
                matchesPlayed++;

                if (teamScore > opponentScore) wins++;
                else if (teamScore < opponentScore) losses++;
                else draws++;
            });

            const points = wins * 3 + draws;
            const goalDifference = goalsFor - goalsAgainst;

            return {
                team: team,
                matchesPlayed,
                wins,
                draws,
                losses,
                goalsFor,
                goalsAgainst,
                goalDifference,
                points
            };
        }));

        // Сортируем по очкам, разнице голов, забитым голам
        standings.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
            return b.goalsFor - a.goalsFor;
        });

        tbody.innerHTML = standings.map((standing, index) => `
            <tr>
                <td>${index + 1}</td>
                <td class="team-name">${standing.team.name}</td>
                <td>${standing.matchesPlayed}</td>
                <td>${standing.wins}</td>
                <td>${standing.draws}</td>
                <td>${standing.losses}</td>
                <td>${standing.goalsFor}:${standing.goalsAgainst}</td>
                <td>${standing.goalDifference > 0 ? '+' : ''}${standing.goalDifference}</td>
                <td><strong>${standing.points}</strong></td>
            </tr>
        `).join('');
    }

    // Отображение аналитики
    async renderAnalytics() {
        await this.renderMatchesStats();
        await this.renderTopScorers();
        await this.renderRecentResults();
    }

    // Статистика матчей
    async renderMatchesStats() {
        const container = document.getElementById('matchesStats');
        if (!container) {
            console.warn('Контейнер статистики матчей не найден');
            return;
        }

        const matches = await this.db.getMatches();
        const teams = await this.db.getTeams();
        const ourTeamId = 1;

        const ourMatches = matches.filter(m =>
            m.homeTeamId === ourTeamId || m.awayTeamId === ourTeamId
        );
        const completedMatches = ourMatches.filter(m => m.status === 'completed');

        const wins = completedMatches.filter(m => {
            const isHome = m.homeTeamId === ourTeamId;
            return (isHome && m.homeScore > m.awayScore) || (!isHome && m.awayScore > m.homeScore);
        }).length;
        const draws = completedMatches.filter(m => m.homeScore === m.awayScore).length;
        const losses = completedMatches.length - wins - draws;

        const goalsFor = completedMatches.reduce((sum, m) => {
            return sum + (m.homeTeamId === ourTeamId ? m.homeScore : m.awayScore);
        }, 0);
        const goalsAgainst = completedMatches.reduce((sum, m) => {
            return sum + (m.homeTeamId === ourTeamId ? m.awayScore : m.homeScore);
        }, 0);

        container.innerHTML = `
            <div class="stat-item">
                <span>Всего матчей:</span>
                <span class="stat-value">${ourMatches.length}</span>
            </div>
            <div class="stat-item">
                <span>Сыграно:</span>
                <span class="stat-value">${completedMatches.length}</span>
            </div>
            <div class="stat-item">
                <span>Победы:</span>
                <span class="stat-value" style="color: var(--success-color);">${wins}</span>
            </div>
            <div class="stat-item">
                <span>Ничьи:</span>
                <span class="stat-value" style="color: var(--info-color);">${draws}</span>
            </div>
            <div class="stat-item">
                <span>Поражения:</span>
                <span class="stat-value" style="color: var(--warning-color);">${losses}</span>
            </div>
            <div class="stat-item">
                <span>Забито/Пропущено:</span>
                <span class="stat-value">${goalsFor}:${goalsAgainst}</span>
            </div>
        `;
    }

    // Лучшие бомбардиры
    async renderTopScorers() {
        const container = document.getElementById('topScorers');
        if (!container) {
            console.warn('Контейнер лучших бомбардиров не найден');
            return;
        }

        const players = await this.db.getPlayers(1);
        const playersWithGoals = await Promise.all(
            players.map(async (player) => {
                const stats = await this.db.getPlayerStats(player.id);
                // Суммируем голы из всех записей статистики (включая общую)
                const goals = stats.reduce((sum, stat) => sum + (stat.goals || 0), 0);
                return { ...player, goals };
            })
        );

        const topScorers = playersWithGoals
            .filter(p => p.goals > 0)
            .sort((a, b) => b.goals - a.goals)
            .slice(0, 5);

        if (topScorers.length === 0) {
            container.innerHTML = '<p>Нет данных о голах</p>';
            return;
        }

        container.innerHTML = topScorers.map((player, index) => `
            <div class="player-stat">
                <span>${index + 1}. ${player.name}</span>
                <span class="stat-value">${player.goals} ⚽</span>
            </div>
        `).join('');
    }

    // Последние результаты
    async renderRecentResults() {
        const container = document.getElementById('recentResults');
        if (!container) {
            console.warn('Контейнер последних результатов не найден');
            return;
        }

        const matches = await this.db.getMatches();
        const teams = await this.db.getTeams();
        const ourTeamId = 1;

        const ourMatches = matches
            .filter(m => (m.homeTeamId === ourTeamId || m.awayTeamId === ourTeamId) && m.status === 'completed')
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        if (ourMatches.length === 0) {
            container.innerHTML = '<p>Нет сыгранных матчей</p>';
            return;
        }

        container.innerHTML = ourMatches.map(match => {
            const isHome = match.homeTeamId === ourTeamId;
            const ourTeam = teams.find(t => t.id === ourTeamId);
            const opponentTeam = teams.find(t => t.id === (isHome ? match.awayTeamId : match.homeTeamId));

            const ourScore = isHome ? match.homeScore : match.awayScore;
            const opponentScore = isHome ? match.awayScore : match.homeScore;

            const resultIcon = ourScore > opponentScore ? '✅' : ourScore < opponentScore ? '❌' : '⚫';

            return `
                <div class="stat-item">
                    <span>${ourTeam.name} ${ourScore}-${opponentScore} ${opponentTeam.name}</span>
                    <span class="stat-value">${resultIcon}</span>
                </div>
            `;
        }).join('');
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    window.tournament = new FootballTournament();
});