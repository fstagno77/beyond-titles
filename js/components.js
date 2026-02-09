/**
 * Beyond Titles - Shared Components
 * Centralized header and footer management
 */

const CURRENT_VERSION = '0.12.2';

/**
 * Renders the header component
 * @param {string} currentPage - Current page identifier ('index' or 'changelog')
 */
function renderHeader(currentPage = 'index') {
    const headerHTML = `
        <div class="header-wrap">
            <header class="header">
                <a href="index.html" class="header__logo-link">
                    <img src="assets/logoBeyondTitles.png" alt="Beyond Titles" class="header__logo">
                </a>
                <button id="langToggle" class="lang-toggle" aria-label="Switch language">
                    <span class="lang-toggle__flag">🇮🇹</span>
                    <span class="lang-toggle__text">IT</span>
                </button>
            </header>
        </div>
    `;

    // Insert header at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

/**
 * Renders the footer component
 */
function renderFooter() {
    const footerHTML = `
        <footer class="footer">
            <p class="footer__text">Beyond Titles v${CURRENT_VERSION} | <a href="wiki/changelog/index.html" class="footer__link" data-i18n="footer_changelog">Changelog</a> | <a href="wiki/index.html" class="footer__link">Wiki</a></p>
        </footer>
    `;

    // Insert footer at the end of body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

/**
 * Updates all elements with data-i18n attributes
 * @param {I18n} i18n - The i18n instance
 */
function applyTranslations(i18n) {
    // Update all elements with data-i18n attribute (textContent)
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = i18n.t(key);
        if (translation && translation !== key) {
            element.textContent = translation;
        }
    });

    // Update all elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = i18n.t(key);
    });

    // Update all elements with data-i18n-aria-label attribute
    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
        const key = element.getAttribute('data-i18n-aria-label');
        element.setAttribute('aria-label', i18n.t(key));
    });
}

/**
 * Initializes language toggle functionality
 */
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    if (!langToggle) return;

    // Wait for i18n to be available
    if (typeof window.I18n === 'undefined') {
        setTimeout(initLanguageToggle, 50);
        return;
    }

    const i18n = new window.I18n();

    // Set initial flag and text
    updateLanguageToggle(i18n.getLanguage());

    // Apply initial translations (for pages without app.js)
    applyTranslations(i18n);

    // Handle toggle click
    langToggle.addEventListener('click', () => {
        const currentLang = i18n.getLanguage();
        const newLang = currentLang === 'it' ? 'en' : 'it';
        i18n.setLanguage(newLang);
        updateLanguageToggle(newLang);
        applyTranslations(i18n);
    });

    // Listen for language changes from other sources
    window.addEventListener('languageChanged', (e) => {
        updateLanguageToggle(e.detail.lang);
        applyTranslations(i18n);
    });
}

/**
 * Updates the language toggle button UI
 * @param {string} lang - Current language code
 */
function updateLanguageToggle(lang) {
    const flagSpan = document.querySelector('.lang-toggle__flag');
    const textSpan = document.querySelector('.lang-toggle__text');

    if (!flagSpan || !textSpan) return;

    if (lang === 'it') {
        flagSpan.textContent = '🇮🇹';
        textSpan.textContent = 'IT';
    } else {
        flagSpan.textContent = '🇬🇧';
        textSpan.textContent = 'EN';
    }
}

/**
 * Initializes components when DOM is ready
 */
function initComponents() {
    // Check if header already exists
    if (!document.querySelector('.header-wrap')) {
        // Determine current page from URL
        const currentPage = window.location.pathname.includes('changelog') ? 'changelog' : 'index';
        renderHeader(currentPage);

        // Initialize language toggle after header is rendered
        setTimeout(initLanguageToggle, 0);
    }

    // Check if footer already exists
    if (!document.querySelector('.footer')) {
        renderFooter();
    }
}

// Auto-initialize on DOM content loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
} else {
    // DOM is already ready
    initComponents();
}

// Export for use in other modules
window.BeyondTitlesComponents = {
    initComponents,
    initLanguageToggle,
    CURRENT_VERSION
};
