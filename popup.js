// Advanced Tab Manager - Popup Script
class AdvancedTabManager {
    constructor() {
        this.tabs = [];
        this.filteredTabs = [];
        this.selectedTabs = new Set();
        this.currentFilter = 'all';
        this.currentSort = 'title';
        this.searchQuery = '';
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadTabs();
        this.updateStats();
    }

    initializeElements() {
        // Get DOM elements
        this.tabCountEl = document.getElementById('tab-count');
        this.windowCountEl = document.getElementById('window-count');
        this.searchInput = document.getElementById('search-input');
        this.tabsList = document.getElementById('tabs-list');
        this.bulkActions = document.getElementById('bulk-actions');
        this.sortSelect = document.getElementById('sort-select');
        
        // Filter buttons
        this.filterButtons = {
            all: document.getElementById('filter-all'),
            current: document.getElementById('filter-current'),
            duplicates: document.getElementById('filter-duplicates')
        };
        
        // Action buttons
        this.actionButtons = {
            closeDuplicates: document.getElementById('close-duplicates'),
            groupByDomain: document.getElementById('group-by-domain'),
            ungroupAll: document.getElementById('ungroup-all'),
            saveSession: document.getElementById('save-session'),
            restoreSession: document.getElementById('restore-session')
        };
        
        // Bulk action buttons
        this.bulkButtons = {
            closeSelected: document.getElementById('close-selected'),
            groupSelected: document.getElementById('group-selected'),
            clearSelection: document.getElementById('clear-selection')
        };
    }

    setupEventListeners() {
        // Search functionality
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterAndDisplayTabs();
        });

        // Filter buttons
        Object.entries(this.filterButtons).forEach(([filter, button]) => {
            button.addEventListener('click', () => {
                this.setActiveFilter(filter);
                this.filterAndDisplayTabs();
            });
        });

        // Sort functionality
        this.sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.filterAndDisplayTabs();
        });

        // Action buttons
        this.actionButtons.closeDuplicates.addEventListener('click', () => {
            this.closeDuplicateTabs();
        });

        this.actionButtons.groupByDomain.addEventListener('click', () => {
            this.groupTabsByDomain();
        });

        this.actionButtons.ungroupAll.addEventListener('click', () => {
            this.ungroupAllTabs();
        });

        this.actionButtons.saveSession.addEventListener('click', () => {
            this.saveCurrentSession();
        });

        this.actionButtons.restoreSession.addEventListener('click', () => {
            this.showSessionManager();
        });

        // Add workspace management
        this.setupWorkspaceFeatures();

        // Bulk action buttons
        this.bulkButtons.closeSelected.addEventListener('click', () => {
            this.closeSelectedTabs();
        });

        this.bulkButtons.groupSelected.addEventListener('click', () => {
            this.groupSelectedTabs();
        });

        this.bulkButtons.clearSelection.addEventListener('click', () => {
            this.clearSelection();
        });
    }

    async loadTabs() {
        try {
            // Get all tabs
            this.tabs = await chrome.tabs.query({});
            
            // Get current window for filtering
            const currentWindow = await chrome.windows.getCurrent();
            this.currentWindowId = currentWindow.id;
            
            this.filterAndDisplayTabs();
        } catch (error) {
            console.error('Error loading tabs:', error);
            this.showError('Failed to load tabs');
        }
    }

    async updateStats() {
        try {
            const windows = await chrome.windows.getAll();
            this.tabCountEl.textContent = `${this.tabs.length} tabs`;
            this.windowCountEl.textContent = `${windows.length} windows`;
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    setActiveFilter(filter) {
        // Update button states
        Object.values(this.filterButtons).forEach(btn => btn.classList.remove('active'));
        this.filterButtons[filter].classList.add('active');
        this.currentFilter = filter;
    }

    filterAndDisplayTabs() {
        // Apply filters
        this.filteredTabs = this.tabs.filter(tab => {
            // Search filter
            if (this.searchQuery) {
                const searchMatch = tab.title.toLowerCase().includes(this.searchQuery) ||
                                  tab.url.toLowerCase().includes(this.searchQuery);
                if (!searchMatch) return false;
            }

            // Type filter
            switch (this.currentFilter) {
                case 'current':
                    return tab.windowId === this.currentWindowId;
                case 'duplicates':
                    return this.isDuplicateTab(tab);
                default:
                    return true;
            }
        });

        // Apply sorting
        this.sortTabs();
        
        // Display tabs
        this.displayTabs();
        
        // Update stats
        this.updateStats();
    }

    isDuplicateTab(tab) {
        return this.tabs.filter(t => t.url === tab.url).length > 1;
    }

    sortTabs() {
        this.filteredTabs.sort((a, b) => {
            switch (this.currentSort) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'url':
                    return a.url.localeCompare(b.url);
                case 'domain':
                    return this.getDomain(a.url).localeCompare(this.getDomain(b.url));
                case 'recent':
                    return b.lastAccessed - a.lastAccessed;
                default:
                    return 0;
            }
        });
    }

    getDomain(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    }

    displayTabs() {
        if (this.filteredTabs.length === 0) {
            this.showEmptyState();
            return;
        }

        const tabsHTML = this.filteredTabs.map(tab => this.createTabHTML(tab)).join('');
        this.tabsList.innerHTML = tabsHTML;

        // Add event listeners to tab items
        this.addTabEventListeners();
    }

    createTabHTML(tab) {
        const domain = this.getDomain(tab.url);
        const isDuplicate = this.isDuplicateTab(tab);
        const isSelected = this.selectedTabs.has(tab.id);
        const isActive = tab.active;
        const isGrouped = tab.groupId && tab.groupId !== -1;

        return `
            <div class="tab-item ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''} ${isGrouped ? 'grouped' : ''}"
                 data-tab-id="${tab.id}">
                ${isDuplicate ? '<div class="duplicate-indicator"></div>' : ''}
                ${isGrouped ? '<div class="group-indicator" title="Tab is in a group"></div>' : ''}
                <input type="checkbox" class="tab-checkbox" ${isSelected ? 'checked' : ''}>
                <img src="${tab.favIconUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23ddd"/></svg>'}"
                     class="tab-favicon" alt="">
                <div class="tab-info">
                    <div class="tab-title" title="${this.escapeHtml(tab.title)}">${this.escapeHtml(tab.title)}</div>
                    <div class="tab-url" title="${this.escapeHtml(tab.url)}">${this.escapeHtml(domain)}</div>
                </div>
                <div class="tab-actions">
                    ${isGrouped ?
                        '<button class="tab-action-btn ungroup" title="Remove from group">⊟</button>' : ''}
                    <button class="tab-action-btn close" title="Close tab">×</button>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    addTabEventListeners() {
        const tabItems = this.tabsList.querySelectorAll('.tab-item');
        
        tabItems.forEach(item => {
            const tabId = parseInt(item.dataset.tabId);
            const checkbox = item.querySelector('.tab-checkbox');
            const closeBtn = item.querySelector('.tab-action-btn.close');
            const ungroupBtn = item.querySelector('.tab-action-btn.ungroup');

            // Tab click to switch
            item.addEventListener('click', (e) => {
                if (e.target === checkbox || e.target === closeBtn || e.target === ungroupBtn) return;
                this.switchToTab(tabId);
            });

            // Checkbox for selection
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                if (e.target.checked) {
                    this.selectedTabs.add(tabId);
                } else {
                    this.selectedTabs.delete(tabId);
                }
                this.updateBulkActions();
            });

            // Close button
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeTab(tabId);
            });

            // Ungroup button (if present)
            if (ungroupBtn) {
                ungroupBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.ungroupTab(tabId);
                });
            }
        });
    }

    async switchToTab(tabId) {
        try {
            await chrome.tabs.update(tabId, { active: true });
            const tab = await chrome.tabs.get(tabId);
            await chrome.windows.update(tab.windowId, { focused: true });
            window.close();
        } catch (error) {
            console.error('Error switching to tab:', error);
        }
    }

    async closeTab(tabId) {
        try {
            await chrome.tabs.remove(tabId);
            this.tabs = this.tabs.filter(tab => tab.id !== tabId);
            this.selectedTabs.delete(tabId);
            this.filterAndDisplayTabs();
            this.updateBulkActions();
        } catch (error) {
            console.error('Error closing tab:', error);
        }
    }

    updateBulkActions() {
        const hasSelection = this.selectedTabs.size > 0;
        this.bulkActions.style.display = hasSelection ? 'flex' : 'none';
    }

    showEmptyState() {
        this.tabsList.innerHTML = `
            <div class="empty-state">
                <h3>No tabs found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
    }

    showError(message) {
        this.tabsList.innerHTML = `
            <div class="empty-state">
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
    }

    async closeDuplicateTabs() {
        const urlMap = new Map();
        const duplicates = [];

        // Find duplicates
        this.tabs.forEach(tab => {
            if (urlMap.has(tab.url)) {
                duplicates.push(tab.id);
            } else {
                urlMap.set(tab.url, tab.id);
            }
        });

        if (duplicates.length === 0) {
            this.showNotification('No duplicate tabs found');
            return;
        }

        try {
            await chrome.tabs.remove(duplicates);
            this.showNotification(`Closed ${duplicates.length} duplicate tabs`);
            await this.loadTabs();
        } catch (error) {
            console.error('Error closing duplicates:', error);
            this.showError('Failed to close duplicate tabs');
        }
    }

    async groupTabsByDomain() {
        try {
            const domainGroups = new Map();

            // Group tabs by domain
            this.tabs.forEach(tab => {
                const domain = this.getDomain(tab.url);
                if (!domainGroups.has(domain)) {
                    domainGroups.set(domain, []);
                }
                domainGroups.get(domain).push(tab);
            });

            // Create tab groups for domains with multiple tabs
            for (const [domain, tabs] of domainGroups) {
                if (tabs.length > 1) {
                    const tabIds = tabs.map(tab => tab.id);
                    try {
                        const group = await chrome.tabs.group({ tabIds });
                        await chrome.tabGroups.update(group, {
                            title: domain,
                            color: this.getRandomColor()
                        });
                    } catch (error) {
                        console.error(`Error grouping tabs for ${domain}:`, error);
                    }
                }
            }

            this.showNotification('Tabs grouped by domain');
            await this.loadTabs();
        } catch (error) {
            console.error('Error grouping tabs:', error);
            this.showError('Failed to group tabs by domain');
        }
    }

    getRandomColor() {
        const colors = ['grey', 'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    async ungroupAllTabs() {
        try {
            // Get all tab groups
            const groups = await chrome.tabGroups.query({});

            if (groups.length === 0) {
                this.showNotification('No tab groups found');
                return;
            }

            // Confirm action
            const confirmed = confirm(`Are you sure you want to ungroup all ${groups.length} tab groups?`);
            if (!confirmed) return;

            // Ungroup all tabs by removing them from groups
            let ungroupedCount = 0;
            for (const group of groups) {
                try {
                    const tabsInGroup = await chrome.tabs.query({ groupId: group.id });
                    const tabIds = tabsInGroup.map(tab => tab.id);

                    if (tabIds.length > 0) {
                        await chrome.tabs.ungroup(tabIds);
                        ungroupedCount++;
                    }
                } catch (error) {
                    console.error(`Error ungrouping group ${group.id}:`, error);
                }
            }

            this.showNotification(`Ungrouped ${ungroupedCount} tab groups`);
            await this.loadTabs();
        } catch (error) {
            console.error('Error ungrouping tabs:', error);
            this.showError('Failed to ungroup tabs');
        }
    }

    async ungroupTab(tabId) {
        try {
            await chrome.tabs.ungroup([tabId]);
            this.showNotification('Tab removed from group');
            await this.loadTabs();
        } catch (error) {
            console.error('Error ungrouping tab:', error);
            this.showError('Failed to ungroup tab');
        }
    }

    async saveCurrentSession() {
        try {
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

            // Keep only the latest 10 sessions
            if (savedSessions.length > 10) {
                savedSessions.splice(10);
            }

            await chrome.storage.sync.set({ savedSessions });
            this.showNotification('Session saved successfully');
        } catch (error) {
            console.error('Error saving session:', error);
            this.showError('Failed to save session');
        }
    }

    async showSessionManager() {
        try {
            const result = await chrome.storage.sync.get('savedSessions');
            const savedSessions = result.savedSessions || [];

            if (savedSessions.length === 0) {
                this.showNotification('No saved sessions found');
                return;
            }

            // Create session manager UI
            const sessionHTML = savedSessions.map(session => `
                <div class="session-item" data-session-id="${session.id}">
                    <div class="session-info">
                        <div class="session-name">${this.escapeHtml(session.name)}</div>
                        <div class="session-details">${session.windows.reduce((total, window) => total + window.tabs.length, 0)} tabs</div>
                    </div>
                    <div class="session-actions">
                        <button class="session-btn restore">Restore</button>
                        <button class="session-btn delete">Delete</button>
                    </div>
                </div>
            `).join('');

            this.tabsList.innerHTML = `
                <div class="session-manager">
                    <div class="session-header">
                        <h3>Saved Sessions</h3>
                        <button id="back-to-tabs" class="session-btn">Back to Tabs</button>
                    </div>
                    <div class="sessions-list">
                        ${sessionHTML}
                    </div>
                </div>
            `;

            this.addSessionEventListeners(savedSessions);
        } catch (error) {
            console.error('Error showing session manager:', error);
            this.showError('Failed to load sessions');
        }
    }

    addSessionEventListeners(savedSessions) {
        const backBtn = document.getElementById('back-to-tabs');
        backBtn.addEventListener('click', () => {
            this.filterAndDisplayTabs();
        });

        const sessionItems = this.tabsList.querySelectorAll('.session-item');
        sessionItems.forEach(item => {
            const sessionId = item.dataset.sessionId;
            const session = savedSessions.find(s => s.id === sessionId);

            const restoreBtn = item.querySelector('.restore');
            const deleteBtn = item.querySelector('.delete');

            restoreBtn.addEventListener('click', () => {
                this.restoreSession(session);
            });

            deleteBtn.addEventListener('click', () => {
                this.deleteSession(sessionId);
            });
        });
    }

    async restoreSession(session) {
        try {
            // Ask user if they want to close current tabs first
            const shouldCloseCurrent = confirm('Do you want to close current tabs before restoring the session?');

            if (shouldCloseCurrent) {
                const currentTabs = await chrome.tabs.query({});
                const tabsToClose = currentTabs.filter(tab => !tab.pinned); // Keep pinned tabs
                if (tabsToClose.length > 0) {
                    await chrome.tabs.remove(tabsToClose.map(tab => tab.id));
                }
            }

            // Restore session windows
            for (const window of session.windows) {
                const urls = window.tabs.map(tab => tab.url).filter(url => url && url !== 'chrome://newtab/');
                if (urls.length > 0) {
                    await chrome.windows.create({ url: urls });
                }
            }

            this.showNotification('Session restored successfully');
            window.close();
        } catch (error) {
            console.error('Error restoring session:', error);
            this.showError('Failed to restore session');
        }
    }

    async deleteSession(sessionId) {
        try {
            const result = await chrome.storage.sync.get('savedSessions');
            const savedSessions = result.savedSessions || [];
            const updatedSessions = savedSessions.filter(s => s.id !== sessionId);

            await chrome.storage.sync.set({ savedSessions: updatedSessions });
            this.showNotification('Session deleted');
            this.showSessionManager(); // Refresh the session manager
        } catch (error) {
            console.error('Error deleting session:', error);
            this.showError('Failed to delete session');
        }
    }

    async closeSelectedTabs() {
        if (this.selectedTabs.size === 0) return;

        try {
            const tabIds = Array.from(this.selectedTabs);
            await chrome.tabs.remove(tabIds);
            this.showNotification(`Closed ${tabIds.length} tabs`);
            this.selectedTabs.clear();
            await this.loadTabs();
            this.updateBulkActions();
        } catch (error) {
            console.error('Error closing selected tabs:', error);
            this.showError('Failed to close selected tabs');
        }
    }

    async groupSelectedTabs() {
        if (this.selectedTabs.size < 2) {
            this.showNotification('Select at least 2 tabs to group');
            return;
        }

        try {
            const tabIds = Array.from(this.selectedTabs);
            const group = await chrome.tabs.group({ tabIds });
            await chrome.tabGroups.update(group, {
                title: 'Custom Group',
                color: this.getRandomColor()
            });

            this.showNotification('Tabs grouped successfully');
            this.selectedTabs.clear();
            await this.loadTabs();
            this.updateBulkActions();
        } catch (error) {
            console.error('Error grouping selected tabs:', error);
            this.showError('Failed to group selected tabs');
        }
    }

    clearSelection() {
        this.selectedTabs.clear();
        this.filterAndDisplayTabs();
        this.updateBulkActions();
    }

    setupWorkspaceFeatures() {
        // Add keyboard shortcuts for advanced features
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'f':
                        e.preventDefault();
                        this.searchInput.focus();
                        break;
                    case 'a':
                        if (e.shiftKey) {
                            e.preventDefault();
                            this.selectAllTabs();
                        }
                        break;
                    case 'Escape':
                        this.clearSelection();
                        break;
                }
            }
        });
    }

    selectAllTabs() {
        this.filteredTabs.forEach(tab => {
            this.selectedTabs.add(tab.id);
        });
        this.filterAndDisplayTabs();
        this.updateBulkActions();
    }

    async getTabMemoryUsage() {
        // This would require additional permissions and APIs
        // For now, we'll simulate memory usage data
        return this.tabs.map(tab => ({
            id: tab.id,
            title: tab.title,
            url: tab.url,
            memoryUsage: Math.floor(Math.random() * 100) + 10 // Simulated MB
        }));
    }

    async showMemoryUsage() {
        const memoryData = await this.getTabMemoryUsage();
        const sortedByMemory = memoryData.sort((a, b) => b.memoryUsage - a.memoryUsage);

        const memoryHTML = sortedByMemory.map(tab => `
            <div class="memory-item">
                <div class="memory-info">
                    <div class="memory-title">${this.escapeHtml(tab.title)}</div>
                    <div class="memory-url">${this.escapeHtml(new URL(tab.url).hostname)}</div>
                </div>
                <div class="memory-usage">${tab.memoryUsage} MB</div>
            </div>
        `).join('');

        this.tabsList.innerHTML = `
            <div class="memory-manager">
                <div class="memory-header">
                    <h3>Memory Usage</h3>
                    <button id="back-to-tabs" class="session-btn">Back to Tabs</button>
                </div>
                <div class="memory-list">
                    ${memoryHTML}
                </div>
            </div>
        `;

        document.getElementById('back-to-tabs').addEventListener('click', () => {
            this.filterAndDisplayTabs();
        });
    }

    showNotification(message) {
        // Simple notification - could be enhanced with a toast system
        console.log('Notification:', message);

        // You could add a toast notification here
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 1000;
            font-size: 12px;
        `;

        document.body.appendChild(toast);
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 3000);
    }
}

// Initialize the Advanced Tab Manager when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedTabManager();
});
