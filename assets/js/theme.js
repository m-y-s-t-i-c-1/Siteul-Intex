(function () {
    const STORAGE_KEY = 'intex_theme';
    const DARK_CLASS = 'dark-mode';

    function getSaved() {
        try {
            const legacy = localStorage.getItem('theme');
            if (legacy === 'dark' || legacy === 'light') {
                localStorage.setItem(STORAGE_KEY, legacy === 'dark' ? 'dark' : 'light');
            }
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === null) {
                return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            return saved === 'dark';
        } catch (e) {
            console.error('Error reading theme from localStorage:', e);
            return false;
        }
    }

    function applyTheme(isDark) {
        try {
            document.body.classList.toggle(DARK_CLASS, !!isDark);
            const icon = document.getElementById('theme-icon') || document.querySelector('.theme-toggle i');
            if (icon) {
                icon.classList.remove('fa-moon', 'fa-sun');
                icon.classList.add(isDark ? 'fa-sun' : 'fa-moon');
            }
            localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
            
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            try {
                document.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark: !!isDark } }));
            } catch (e) {
                
            }
        } catch (e) {
            console.error('applyTheme error', e);
        }
    }

    function toggleTheme() {
        const isDark = document.body.classList.contains(DARK_CLASS);
        applyTheme(!isDark);
    }

    function init() {
        const saved = getSaved();
        applyTheme(saved);

        const btn = document.getElementById('themeBtn') || document.querySelector('.theme-toggle');
        if (btn) {
            btn.removeEventListener('click', toggleTheme);
            btn.addEventListener('click', toggleTheme);
            
            btn.setAttribute('aria-label', 'Toggle dark mode');
        }

        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem(STORAGE_KEY)) {
                    applyTheme(e.matches);
                }
            });
        }
    }

    function domReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    domReady();

    window.addEventListener('load', function () {
        try {
            const saved = getSaved();
            applyTheme(saved);
        } catch (e) {
        
        }
    });

    window.applySiteTheme = applyTheme;
    window.toggleSiteTheme = toggleTheme;
})();