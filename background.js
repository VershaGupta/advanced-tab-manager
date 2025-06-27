// Background script for Advanced Tab Manager
class TabManager {
    constructor() {
        this.setupEventListeners();
        this.initializeExtension();
    }

    setupEventListeners() {
        // Handle extension installation
        chrome.runtime.onInstalled.addListener(() => {
            this.initializeStorage();
        });

        // Handle keyboard shortcuts
        chrome.commands.onCommand.addListener((command) => {
            this.handleCommand(command);
        });

        // Handle tab updates for duplicate detection
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete') {
                this.updateTabInfo(tab);
            }
        });

        // Handle tab removal
        chrome.tabs.onRemoved.addListener((tabId) => {
            this.cleanupTabData(tabId);
        });
    }

    async initializeExtension() {
        // Set up default settings
        const defaultSettings = {
            autoCloseDuplicates: false,
            groupByDomain: false,
            saveSessionsAutomatically: false,
            maxSavedSessions: 10
        };

        const result = await chrome.storage.sync.get('settings');
        if (!result.settings) {
            await chrome.storage.sync.set({ settings: defaultSettings });
        }
    }

    async initializeStorage() {
        // Initialize storage with default values
        const defaultData = {
            savedSessions: [],
            tabGroups: [],
            settings: {
                autoCloseDuplicates: false,
                groupByDomain: false,
                saveSessionsAutomatically: false,
                maxSavedSessions: 10
            }
        };

        await chrome.storage.sync.set(defaultData);
    }

    async handleCommand(command) {
        switch (command) {
            case 'close_duplicate_tabs':
                await this.closeDuplicateTabs();
                break;
            case 'save_session':
                await this.saveCurrentSession();
                break;
        }
    }

    async closeDuplicateTabs() {
        const tabs = await chrome.tabs.query({});
        const urlMap = new Map();
        const duplicates = [];

        // Find duplicates
        tabs.forEach(tab => {
            if (urlMap.has(tab.url)) {
                duplicates.push(tab.id);
            } else {
                urlMap.set(tab.url, tab.id);
            }
        });

        // Close duplicate tabs
        if (duplicates.length > 0) {
            await chrome.tabs.remove(duplicates);
            this.showNotification(`Closed ${duplicates.length} duplicate tabs`);
        }
    }

    async saveCurrentSession() {
        const windows = await chrome.windows.getAll({ populate: true });
        const session = {
            id: Date.now().toString(),
            name: `Session ${new Date().toLocaleString()}`,
            timestamp: Date.now(),
            windows: windows.map(window => ({
                tabs: window.tabs.map(tab => ({
                    url: tab.url,
                    title: tab.title,
                    favIconUrl: tab.favIconUrl
                }))
            }))
        };

        const result = await chrome.storage.sync.get('savedSessions');
        const savedSessions = result.savedSessions || [];
        savedSessions.unshift(session);

        // Keep only the latest sessions
        const maxSessions = 10;
        if (savedSessions.length > maxSessions) {
            savedSessions.splice(maxSessions);
        }

        await chrome.storage.sync.set({ savedSessions });
        this.showNotification('Session saved successfully');
    }

    async updateTabInfo(tab) {
        // Store tab information for analytics and duplicate detection
        const tabInfo = {
            id: tab.id,
            url: tab.url,
            title: tab.title,
            domain: new URL(tab.url).hostname,
            lastAccessed: Date.now()
        };

        const result = await chrome.storage.local.get('tabsInfo');
        const tabsInfo = result.tabsInfo || {};
        tabsInfo[tab.id] = tabInfo;

        await chrome.storage.local.set({ tabsInfo });
    }

    async cleanupTabData(tabId) {
        const result = await chrome.storage.local.get('tabsInfo');
        const tabsInfo = result.tabsInfo || {};
        delete tabsInfo[tabId];
        await chrome.storage.local.set({ tabsInfo });
    }

    showNotification(message) {
        // Note: notifications permission would need to be added to manifest for this to work
        console.log('Advanced Tab Manager:', message);
    }
}

// Initialize the tab manager
new TabManager();
