/**
 * Beyond Titles - Shared Components
 * Centralized header and footer management
 */

const CURRENT_VERSION = '0.6.2';

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
            <p class="footer__text">Beyond Titles v${CURRENT_VERSION} | <a href="changelog.html" class="footer__link" data-i18n="footer_changelog">Changelog</a></p>
        </footer>
    `;

    // Insert footer at the end of body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
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

    // Handle toggle click
    langToggle.addEventListener('click', () => {
        const currentLang = i18n.getLanguage();
        const newLang = currentLang === 'it' ? 'en' : 'it';
        i18n.setLanguage(newLang);
        updateLanguageToggle(newLang);
    });

    // Listen for language changes from other sources
    window.addEventListener('languageChanged', (e) => {
        updateLanguageToggle(e.detail.lang);
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
