// db.js - Менеджер базы данных IndexedDB
class FootballDB {
    constructor() {
        this.dbName = 'FootballTournamentDB';
        this.version = 3;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = async () => {
                this.db = request.result;

                // Очищаем LocalStorage от старых данных
                await this.cleanupLocalStorage();

                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const oldVersion = event.oldVersion;

                // Создаем структуру базы данных с нуля
                if (oldVersion < 1) {
                    // Таблица команд
                    if (!db.objectStoreNames.contains('teams')) {
                        const teamsStore = db.createObjectStore('teams', { keyPath: 'id' });
                        teamsStore.createIndex('name', 'name', { unique: false });
                    }

                    // Таблица матчей
                    if (!db.objectStoreNames.contains('matches')) {
                        const matchesStore = db.createObjectStore('matches', { keyPath: 'id' });
                        matchesStore.createIndex('date', 'date', { unique: false });
                        matchesStore.createIndex('status', 'status', { unique: false });
                        matchesStore.createIndex('homeTeamId', 'homeTeamId', { unique: false });
                        matchesStore.createIndex('awayTeamId', 'awayTeamId', { unique: false });
                    }

                    // Таблица игроков
                    if (!db.objectStoreNames.contains('players')) {
                        const playersStore = db.createObjectStore('players', { keyPath: 'id' });
                        playersStore.createIndex('teamId', 'teamId', { unique: false });
                    }

                    // Таблица статистики игроков
                    if (!db.objectStoreNames.contains('playerStats')) {
                        const statsStore = db.createObjectStore('playerStats', { keyPath: 'id' });
                        statsStore.createIndex('playerId', 'playerId', { unique: false });
                        statsStore.createIndex('matchId', 'matchId', { unique: false });
                    }

                    // Настройки приложения
                    if (!db.objectStoreNames.contains('settings')) {
                        const settingsStore = db.createObjectStore('settings', { keyPath: 'key' });
                    }
                }
            };
        });
    }

    async cleanupLocalStorage() {
        try {
            // Очищаем все старые данные из LocalStorage
            const itemsToRemove = [
                'footballTournamentData',
                'isAdmin',
                'adminPassword'
            ];

            let cleanedItems = [];
            itemsToRemove.forEach(key => {
                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key);
                    cleanedItems.push(key);
                }
            });

            if (cleanedItems.length > 0) {
                console.log('Очищены данные из LocalStorage:', cleanedItems);
            }

            return true;
        } catch (error) {
            console.error('Ошибка очистки LocalStorage:', error);
            return false;
        }
    }

    // ... остальные методы класса без изменений ...
    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            try {
                if (!this.db) {
                    reject(new Error('База данных не инициализирована'));
                    return;
                }

                if (!this.db.objectStoreNames.contains(storeName)) {
                    reject(new Error(`Хранилище ${storeName} не существует`));
                    return;
                }

                const transaction = this.db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);
                const request = store.getAll();

                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => reject(request.error);

                transaction.onerror = () => reject(transaction.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    async get(storeName, id) {
        return new Promise((resolve, reject) => {
            try {
                if (!this.db) {
                    reject(new Error('База данных не инициализирована'));
                    return;
                }

                const transaction = this.db.transaction([storeName], 'readonly');
                const store = transaction.objectStore(storeName);
                const request = store.get(id);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    async add(storeName, data) {
        return new Promise((resolve, reject) => {
            try {
                if (!this.db) {
                    reject(new Error('База данных не инициализирована'));
                    return;
                }

                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.add(data);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    async update(storeName, data) {
        return new Promise((resolve, reject) => {
            try {
                if (!this.db) {
                    reject(new Error('База данных не инициализирована'));
                    return;
                }

                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.put(data);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    async delete(storeName, id) {
        return new Promise((resolve, reject) => {
            try {
                if (!this.db) {
                    reject(new Error('База данных не инициализирована'));
                    return;
                }

                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.delete(id);

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Специфические методы для приложения

    // Команды
    async getTeams() {
        return this.getAll('teams');
    }

    async getTeam(teamId) {
        return this.get('teams', teamId);
    }

    async saveTeam(team) {
        return this.update('teams', team);
    }

    async addTeam(team) {
        return this.add('teams', team);
    }

    async deleteTeam(teamId) {
        return this.delete('teams', teamId);
    }

    // Матчи
    async getMatches() {
        return this.getAll('matches');
    }

    async getMatch(matchId) {
        return this.get('matches', matchId);
    }

    async saveMatch(match) {
        return this.update('matches', match);
    }

    async addMatch(match) {
        return this.add('matches', match);
    }

    async deleteMatch(matchId) {
        return this.delete('matches', matchId);
    }

    // Игроки
    async getPlayers(teamId = null) {
        const players = await this.getAll('players');
        if (teamId) {
            return players.filter(player => player.teamId === teamId);
        }
        return players;
    }

    async getPlayer(playerId) {
        return this.get('players', playerId);
    }

    async savePlayer(player) {
        return this.update('players', player);
    }

    async addPlayer(player) {
        return this.add('players', player);
    }

    async deletePlayer(playerId) {
        return this.delete('players', playerId);
    }

    // Статистика игроков
    async getPlayerStats(playerId = null, matchId = null) {
        const stats = await this.getAll('playerStats');
        let filteredStats = stats;

        if (playerId) {
            filteredStats = filteredStats.filter(stat => stat.playerId === playerId);
        }

        if (matchId) {
            filteredStats = filteredStats.filter(stat => stat.matchId === matchId);
        }

        return filteredStats;
    }

    // Новый метод для получения конкретной записи статистики
    async getPlayerStat(statId) {
        return this.get('playerStats', statId);
    }

    async savePlayerStat(stat) {
        return this.update('playerStats', stat);
    }

    async addPlayerStat(stat) {
        return this.add('playerStats', stat);
    }

    async deletePlayerStat(statId) {
        return this.delete('playerStats', statId);
    }

    // Настройки
    async getSetting(key) {
        try {
            const setting = await this.get('settings', key);
            return setting ? setting.value : null;
        } catch (error) {
            console.error('Ошибка получения настройки:', error);
            return null;
        }
    }

    async setSetting(key, value) {
        return this.update('settings', { key, value });
    }
}