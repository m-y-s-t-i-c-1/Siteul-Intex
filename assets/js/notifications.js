class NotificationManager {
    constructor() {
        this.container = null;
        this.toasts = [];
        this.defaults = {
            duration: 5000,
            langKey: 'intex_language',
            defaultLang: 'ro'
        };

        window.addEventListener('languageChanged', (e) => this.handleLanguageChange(e));
    }


    initContainer() {
        if (this.container) return;

        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            
            if (document.body) {
                document.body.appendChild(container);
            } else {
                setTimeout(() => this.initContainer(), 100);
                return;
            }
        }
        this.container = container;
    }

    getIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-times-circle"></i>',
            info: '<i class="fas fa-info-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>'
        };
        return icons[type] || icons.info;
    }

    getDefaultTitle(type) {
        const lang = this.getCurrentLang();
        const tKey = `notif_${type}`;
        

        if (window.translations && window.translations[lang] && window.translations[lang][tKey]) {
            return window.translations[lang][tKey];
        }

        const titles = {
            success: { ro: 'Succes', en: 'Success', ru: 'Успех' },
            error: { ro: 'Eroare', en: 'Error', ru: 'Ошибка' },
            info: { ro: 'Info', en: 'Info', ru: 'Инфо' },
            warning: { ro: 'Atenție', en: 'Warning', ru: 'Внимание' }
        };
        
        return (titles[type] && titles[type][lang]) ? titles[type][lang] : type.toUpperCase();
    }

    getCurrentLang() {
        if (window.currentLang) return window.currentLang;
        if (typeof localStorage !== 'undefined' && localStorage.getItem(this.defaults.langKey)) {
            return localStorage.getItem(this.defaults.langKey);
        }
        return this.defaults.defaultLang;
    }

    translate(key, params = {}) {
        const lang = this.getCurrentLang();
        let text = key;

        if (window.translations && window.translations[lang] && window.translations[lang][key]) {
            text = window.translations[lang][key];
        } 

        if (params && typeof params === 'object') {
            Object.keys(params).forEach(k => {
                text = text.replace(new RegExp(`{${k}}`, 'g'), params[k]);
            });
        }
        
        return text;
    }


    show(messagePayload, type = 'info', title = null, duration = null) {
        this.initContainer();
        if (!this.container) {
            console.error('[NOTIFICATIONS] Container not available');
            return null;
        }

        const actualDuration = duration !== null ? duration : this.defaults.duration;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        

        let displayMessage = '';
        let translationData = null;

        if (typeof messagePayload === 'object' && messagePayload !== null && messagePayload.key) {
            translationData = messagePayload;
            displayMessage = this.translate(messagePayload.key, messagePayload.params);
        } else {
            displayMessage = String(messagePayload || '');
        }

        const displayTitle = title || this.getDefaultTitle(type);
        const iconHtml = this.getIcon(type);

        toast.innerHTML = `
            <div class="toast-icon">${iconHtml}</div>
            <div class="toast-content">
                <div class="toast-title">${this.escapeHtml(displayTitle)}</div>
                <div class="toast-message">${this.escapeHtml(displayMessage)}</div>
            </div>
            <button class="toast-close" aria-label="Close">&times;</button>
            <div class="toast-progress">
                <div class="toast-progress-bar" style="transition-duration: ${actualDuration}ms"></div>
            </div>
        `;

        if (translationData) {
            toast.dataset.i18nKey = translationData.key;
            if (translationData.params) {
                try {
                    toast.dataset.i18nParams = JSON.stringify(translationData.params);
                } catch (e) {
                    console.warn('[NOTIFICATIONS] Could not stringify params');
                }
            }
        }
        
        if (!title) {
            toast.dataset.i18nType = type;
        }

        let timeoutId = null;
        let remainingTime = actualDuration;
        let startTime = Date.now();
        let isPaused = false;
        
        const progressBar = toast.querySelector('.toast-progress-bar');

        const startTimer = () => {
            if (actualDuration <= 0) return;
            startTime = Date.now();
            isPaused = false;

            requestAnimationFrame(() => {
                if (progressBar) {
                    progressBar.style.transform = 'scaleX(0)';
                }
            });

            timeoutId = setTimeout(() => {
                this.remove(toast);
            }, remainingTime);
        };

        const pauseTimer = () => {
            if (actualDuration <= 0 || isPaused) return;
            clearTimeout(timeoutId);
            remainingTime -= Date.now() - startTime;
            isPaused = true;
            
            if (progressBar) {
                const computedStyle = window.getComputedStyle(progressBar);
                const matrix = new DOMMatrix(computedStyle.transform);
                progressBar.style.transition = 'none';
                progressBar.style.transform = `scaleX(${matrix.a || 1})`;
            }
        };

        const resumeTimer = () => {
            if (actualDuration <= 0 || !isPaused) return;
            isPaused = false;
            
            if (progressBar) {
                progressBar.style.transition = `transform ${remainingTime}ms linear`;
                progressBar.style.transform = 'scaleX(0)';
            }
            startTimer();
        };

        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.remove(toast));
        }
        
        toast.addEventListener('mouseenter', pauseTimer);
        toast.addEventListener('mouseleave', resumeTimer);

        this.container.appendChild(toast);
        this.toasts.push(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
            if (actualDuration > 0) startTimer();
        });

        return toast;
    }


    remove(toast) {
        if (!toast || toast.classList.contains('removing')) return;

        toast.classList.remove('show');
        toast.classList.add('removing');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts = this.toasts.filter(t => t !== toast);
        }, 400);
    }


    handleLanguageChange(e) {
        this.toasts.forEach(toast => {
            if (toast.dataset.i18nKey) {
                let params = {};
                if (toast.dataset.i18nParams) {
                    try {
                        params = JSON.parse(toast.dataset.i18nParams);
                    } catch (err) {
                        console.warn('[NOTIFICATIONS] Invalid JSON in i18nParams');
                    }
                }
                
                const newMsg = this.translate(toast.dataset.i18nKey, params);
                const msgEl = toast.querySelector('.toast-message');
                if (msgEl) msgEl.textContent = newMsg;
            }


            if (toast.dataset.i18nType) {
                const newTitle = this.getDefaultTitle(toast.dataset.i18nType);
                const titleEl = toast.querySelector('.toast-title');
                if (titleEl) titleEl.textContent = newTitle;
            }
        });
    }


    escapeHtml(text) {
        if (text === null || text === undefined) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }
}

window.notifyManager = new NotificationManager();

window.showNotification = function(msg, type, title, duration) {
    return window.notifyManager.show(msg, type, title, duration);
};

window.showSuccess = function(msg, title, duration) {
    return window.notifyManager.show(msg, 'success', title, duration);
};

window.showError = function(msg, title, duration) {
    return window.notifyManager.show(msg, 'error', title, duration);
};

window.showInfo = function(msg, title, duration) {
    return window.notifyManager.show(msg, 'info', title, duration);
};

window.showWarning = function(msg, title, duration) {
    return window.notifyManager.show(msg, 'warning', title, duration);
};

window.showSuccessI18n = function(key, params, duration) {
    return window.notifyManager.show({ key, params }, 'success', null, duration);
};

window.showErrorI18n = function(key, params, duration) {
    return window.notifyManager.show({ key, params }, 'error', null, duration);
};

window.showInfoI18n = function(key, params, duration) {
    return window.notifyManager.show({ key, params }, 'info', null, duration);
};

window.showWarningI18n = function(key, params, duration) {
    return window.notifyManager.show({ key, params }, 'warning', null, duration);
};

console.log('[NOTIFICATIONS] System Ready.');