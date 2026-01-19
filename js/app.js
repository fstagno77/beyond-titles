/**
 * Beyond Titles - Job Title Autocomplete Application
 * Gi Group Routing Algorithm Prototype
 *
 * This module handles:
 * - Async loading of mansioniPadre data from JSON
 * - Autocomplete filtering and display
 * - Scenario 1: Unique Match with Deep Link generation
 * - Scenario 3: No Match with free-text search URL
 * - System Activity Log for debugging/demo
 * - Keyboard navigation support
 * - Internationalization (i18n) - IT/EN language support
 */

(function () {
    'use strict';

    // Initialize i18n
    const i18n = new window.I18n();

    // ==========================================================================
    // Configuration
    // ==========================================================================

    const CONFIG = {
        dataUrl: './data/mansioni_database.json',
        searchUrl: 'https://www.gigroup.it/offerte-lavoro/',
        maxSuggestions: 15,
        minQueryLength: 1,
        debounceDelay: 100,
    };

    // ==========================================================================
    // State
    // ==========================================================================

    const state = {
        mansioniPadre: [],
        isDataLoaded: false,
        activeSuggestionIndex: -1,
        currentSuggestions: [],
        selectedRole: null,
        generatedUrl: null,
        currentScenario: null, // 'match' | 'no-match' | null
    };

    // ==========================================================================
    // DOM Elements
    // ==========================================================================

    const elements = {
        input: null,
        clearInput: null,
        suggestions: null,
        status: null,
        ctaButton: null,
        systemLog: null,
        clearLogBtn: null,
        suggestionsLink: null,
        suggestionsModal: null,
        modalCloseBtn: null,
        modalBackdrop: null,
        langToggle: null,
    };

    // ==========================================================================
    // Utility Functions
    // ==========================================================================

    /**
     * Creates a debounced version of a function
     * @param {Function} fn - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} Debounced function
     */
    function debounce(fn, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /**
     * Escapes HTML special characters to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Escapes special regex characters in a string
     * @param {string} str - String to escape
     * @returns {string} Escaped string safe for regex
     */
    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Gets current timestamp in HH:MM:SS format
     * @returns {string} Formatted timestamp
     */
    function getTimestamp() {
        const now = new Date();
        return now.toTimeString().slice(0, 8);
    }

    // ==========================================================================
    // Internationalization (i18n) Functions
    // ==========================================================================

    /**
     * Updates all UI text with current language translations
     */
    function updateUILanguage() {
        // Update all elements with data-i18n attribute (textContent)
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = i18n.t(key);
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

        // Update language toggle button
        updateLanguageToggle();

        // If there's a selected role, update the CTA button
        if (state.selectedRole && state.currentScenario === 'match') {
            const mansione = findMansione(state.selectedRole);
            if (mansione) {
                // Check if it's an incomplete profile
                if (mansione.mapping_type === 'profilo_incompleto') {
                    elements.ctaButton.textContent = i18n.t('cta_no_offers');
                } else {
                    const offerText = mansione.numero_offerte === 1
                        ? i18n.t('cta_active_single')
                        : i18n.t('cta_active_multiple', { count: mansione.numero_offerte });
                    elements.ctaButton.textContent = offerText;
                }
            }
        } else if (state.currentScenario === 'no-match') {
            elements.ctaButton.textContent = i18n.t('cta_warning');
        } else {
            elements.ctaButton.textContent = i18n.t('cta_default');
        }

        // Update status message if present
        if (elements.status.textContent) {
            const statusClasses = elements.status.className;
            if (statusClasses.includes('search__status--match') && state.selectedRole) {
                const mansione = findMansione(state.selectedRole);
                if (mansione) {
                    const mappingLabel = i18n.t(`mapping_${mansione.mapping_type}`);
                    showStatus(
                        i18n.t('status_match', { role: mansione.nome, type: mappingLabel }),
                        'match'
                    );
                }
            } else if (statusClasses.includes('search__status--no-match')) {
                showStatus(i18n.t('status_no_match'), 'no-match');
            }
        }
    }

    /**
     * Updates the language toggle button display
     */
    function updateLanguageToggle() {
        if (!elements.langToggle) return;

        const currentLang = i18n.getLanguage();
        const flagSpan = elements.langToggle.querySelector('.lang-toggle__flag');
        const textSpan = elements.langToggle.querySelector('.lang-toggle__text');

        if (currentLang === 'it') {
            flagSpan.textContent = '🇮🇹';
            textSpan.textContent = 'IT';
            elements.langToggle.setAttribute('aria-label', i18n.t('lang_toggle_aria'));
        } else {
            flagSpan.textContent = '🇬🇧';
            textSpan.textContent = 'EN';
            elements.langToggle.setAttribute('aria-label', i18n.t('lang_toggle_aria'));
        }
    }

    /**
     * Toggles between Italian and English
     */
    function toggleLanguage() {
        const currentLang = i18n.getLanguage();
        const newLang = currentLang === 'it' ? 'en' : 'it';
        i18n.setLanguage(newLang);
        updateUILanguage();
    }

    // ==========================================================================
    // System Activity Log
    // ==========================================================================

    /**
     * Log entry types for styling
     */
    const LogType = {
        INPUT: 'input',
        LOGIC: 'logic',
        ROUTING: 'routing',
        UI: 'ui',
        INFO: 'info',
        NOMATCH: 'nomatch',
    };

    /**
     * Adds an entry to the System Activity Log
     * @param {string} type - Log type (INPUT, LOGIC, ROUTING, UI, INFO, NOMATCH)
     * @param {string} message - Log message
     * @param {string} [url] - Optional URL to display
     */
    function logActivity(type, message, url = null) {
        if (!elements.systemLog) return;

        const entry = document.createElement('div');
        entry.className = 'system-log__entry';

        const timestamp = `<span class="system-log__timestamp">[${getTimestamp()}]</span>`;
        const displayType = type === 'nomatch' ? 'NO MATCH' : type.toUpperCase();
        const typeLabel = `<span class="system-log__type--${type}">${displayType}:</span>`;
        const messageSpan = `<span class="system-log__message">${escapeHtml(message)}</span>`;

        let html = `${timestamp} ${typeLabel} ${messageSpan}`;

        if (url) {
            html += `<br><span class="system-log__url">${escapeHtml(url)}</span>`;
        }

        entry.innerHTML = html;
        elements.systemLog.appendChild(entry);

        // Auto-scroll to bottom
        elements.systemLog.scrollTop = elements.systemLog.scrollHeight;
    }

    /**
     * Adds an entry to the System Activity Log with HTML content (no escaping)
     * @param {string} type - Log type (INPUT, LOGIC, ROUTING, UI, INFO, NOMATCH)
     * @param {string} htmlMessage - Log message with HTML formatting
     * @param {string} [url] - Optional URL to display
     */
    function logActivityHtml(type, htmlMessage, url = null) {
        if (!elements.systemLog) return;

        const entry = document.createElement('div');
        entry.className = 'system-log__entry';

        const timestamp = `<span class="system-log__timestamp">[${getTimestamp()}]</span>`;
        const displayType = type === 'nomatch' ? 'NO MATCH' : type.toUpperCase();
        const typeLabel = `<span class="system-log__type--${type}">${displayType}:</span>`;
        const messageSpan = `<span class="system-log__message">${htmlMessage}</span>`;

        let html = `${timestamp} ${typeLabel} ${messageSpan}`;

        if (url) {
            html += `<br><span class="system-log__url">${escapeHtml(url)}</span>`;
        }

        entry.innerHTML = html;
        elements.systemLog.appendChild(entry);

        // Auto-scroll to bottom
        elements.systemLog.scrollTop = elements.systemLog.scrollHeight;
    }

    /**
     * Clears all entries from the System Activity Log
     */
    function clearLog() {
        if (elements.systemLog) {
            elements.systemLog.innerHTML = '';
            logActivity(LogType.INFO, i18n.t('log_cleared'));
        }
    }

    // ==========================================================================
    // URL Generation
    // ==========================================================================

    /**
     * Generates a search query URL for free-text search (Scenario 3)
     * @param {string} searchTerm - The user's search term
     * @returns {string} The search URL with query parameter
     */
    function generateSearchUrl(searchTerm) {
        const encodedTerm = encodeURIComponent(searchTerm.trim());
        return `${CONFIG.searchUrl}?job=${encodedTerm}`;
    }

    // ==========================================================================
    // CTA Button Management
    // ==========================================================================

    /**
     * Enables the CTA button with the generated URL (Scenario 1 - Match)
     * @param {string} url - The URL to assign to the button
     * @param {number} jobOffers - Number of job offers for this role
     */
    function enableCtaButton(url, jobOffers) {
        if (!elements.ctaButton) return;

        elements.ctaButton.href = url;
        const offerText = jobOffers === 1
            ? i18n.t('cta_active_single')
            : i18n.t('cta_active_multiple', { count: jobOffers });
        elements.ctaButton.textContent = offerText;
        elements.ctaButton.classList.remove('cta-button--disabled', 'cta-button--warning', 'cta-button--incomplete');
        elements.ctaButton.classList.add('cta-button--active');
        elements.ctaButton.setAttribute('aria-disabled', 'false');
        elements.ctaButton.setAttribute('tabindex', '0');
        elements.ctaButton.setAttribute('target', '_blank');
        elements.ctaButton.setAttribute('rel', 'noopener noreferrer');

        state.currentScenario = 'match';
    }

    /**
     * Enables the CTA button with warning style (Scenario 3 - No Match)
     * @param {string} url - The URL to assign to the button
     */
    function enableCtaButtonWarning(url) {
        if (!elements.ctaButton) return;

        elements.ctaButton.href = url;
        elements.ctaButton.textContent = i18n.t('cta_warning');
        elements.ctaButton.classList.remove('cta-button--disabled', 'cta-button--active', 'cta-button--incomplete');
        elements.ctaButton.classList.add('cta-button--warning');
        elements.ctaButton.setAttribute('aria-disabled', 'false');
        elements.ctaButton.setAttribute('tabindex', '0');
        elements.ctaButton.setAttribute('target', '_blank');
        elements.ctaButton.setAttribute('rel', 'noopener noreferrer');

        state.currentScenario = 'no-match';
    }

    /**
     * Enables the CTA button for incomplete profiles (profilo_incompleto)
     * Shows special state - profile found but no active offers
     * @param {string} url - The search URL to assign to the button
     */
    function enableCtaButtonIncomplete(url) {
        if (!elements.ctaButton) return;

        elements.ctaButton.href = url;
        elements.ctaButton.textContent = i18n.t('cta_no_offers');
        elements.ctaButton.classList.remove('cta-button--disabled', 'cta-button--active', 'cta-button--warning');
        elements.ctaButton.classList.add('cta-button--incomplete');
        elements.ctaButton.setAttribute('aria-disabled', 'false');
        elements.ctaButton.setAttribute('tabindex', '0');
        elements.ctaButton.setAttribute('target', '_blank');
        elements.ctaButton.setAttribute('rel', 'noopener noreferrer');

        state.currentScenario = 'match';
    }

    /**
     * Disables the CTA button
     */
    function disableCtaButton() {
        if (!elements.ctaButton) return;

        elements.ctaButton.href = '#';
        elements.ctaButton.textContent = i18n.t('cta_default');
        elements.ctaButton.classList.remove('cta-button--active', 'cta-button--warning', 'cta-button--incomplete');
        elements.ctaButton.classList.add('cta-button--disabled');
        elements.ctaButton.setAttribute('aria-disabled', 'true');
        elements.ctaButton.setAttribute('tabindex', '-1');
        elements.ctaButton.removeAttribute('target');
        elements.ctaButton.removeAttribute('rel');

        state.selectedRole = null;
        state.generatedUrl = null;
        state.currentScenario = null;
    }

    // ==========================================================================
    // Input State Management
    // ==========================================================================

    /**
     * Sets the input field to match state (green/default)
     */
    function setInputMatchState() {
        elements.input.classList.remove('search__input--no-match');
    }

    /**
     * Sets the input field to no-match state (orange border)
     */
    function setInputNoMatchState() {
        elements.input.classList.add('search__input--no-match');
    }

    /**
     * Resets the input field to default state
     */
    function resetInputState() {
        elements.input.classList.remove('search__input--no-match');
    }

    /**
     * Updates the clear button visibility based on input content
     */
    function updateClearButton() {
        if (!elements.clearInput) return;

        const hasContent = elements.input.value.length > 0;
        if (hasContent) {
            elements.clearInput.classList.add('search__clear--visible');
            elements.input.classList.add('search__input--has-clear');
        } else {
            elements.clearInput.classList.remove('search__clear--visible');
            elements.input.classList.remove('search__input--has-clear');
        }
    }

    /**
     * Clears the input field and resets all states
     */
    function clearInputField() {
        elements.input.value = '';
        hideSuggestions();
        clearStatus();
        disableCtaButton();
        resetInputState();
        updateClearButton();
        elements.input.focus();
    }

    // ==========================================================================
    // Data Loading
    // ==========================================================================

    /**
     * Fetches mansioni database from JSON file
     * @returns {Promise<Object[]>} Array of mansione objects
     */
    async function loadMansioniData() {
        try {
            const response = await fetch(CONFIG.dataUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.database_mansioni || !Array.isArray(data.database_mansioni)) {
                throw new Error('Invalid data format: expected { database_mansioni: [] }');
            }

            state.mansioniPadre = data.database_mansioni;
            state.isDataLoaded = true;

            // Log statistics from metadata (v4 format)
            const stats = data.metadata?.statistiche;
            if (stats) {
                logActivity(LogType.INFO, i18n.t('log_loaded_stats', {
                    total: stats.totale_voci,
                    main: stats.categoria_principale?.totale || 0,
                    alias: stats.alias || 0,
                    incomplete: stats.profilo_incompleto?.totale || 0
                }));
            } else {
                logActivity(LogType.INFO, i18n.t('log_loaded', { count: state.mansioniPadre.length }));
            }

            return state.mansioniPadre;
        } catch (error) {
            console.error('[Beyond Titles] Failed to load mansioni data:', error);
            logActivity(LogType.INFO, i18n.t('log_error', { error: error.message }));
            showStatus(i18n.t('status_error'), 'error');
            throw error;
        }
    }

    // ==========================================================================
    // Autocomplete Logic
    // ==========================================================================

    /**
     * Filters mansioniPadre based on user query
     * @param {string} query - User search query
     * @returns {Object[]} Filtered and limited results (objects with nome and jobOffers)
     */
    function filterMansioniPadre(query) {
        if (!query || query.length < CONFIG.minQueryLength) {
            return [];
        }

        const normalizedQuery = query.toLowerCase().trim();

        const matches = state.mansioniPadre.filter((mansione) =>
            mansione.nome.toLowerCase().includes(normalizedQuery)
        );

        return matches.slice(0, CONFIG.maxSuggestions);
    }

    /**
     * Checks if a job title exists exactly in the database
     * @param {string} jobTitle - The job title to check
     * @returns {boolean} True if exact match found
     */
    function isExactMatch(jobTitle) {
        return state.mansioniPadre.some(
            (mansione) => mansione.nome.toLowerCase() === jobTitle.toLowerCase()
        );
    }

    /**
     * Finds a mansione object by name
     * @param {string} jobTitle - The job title to find
     * @returns {Object|null} The mansione object or null
     */
    function findMansione(jobTitle) {
        return state.mansioniPadre.find(
            (mansione) => mansione.nome.toLowerCase() === jobTitle.toLowerCase()
        ) || null;
    }

    /**
     * Highlights matching text in a string
     * @param {string} text - Full text
     * @param {string} query - Query to highlight
     * @returns {string} HTML string with highlighted matches
     */
    function highlightMatch(text, query) {
        const escapedText = escapeHtml(text);
        const escapedQuery = escapeRegex(query);
        const regex = new RegExp(`(${escapedQuery})`, 'gi');

        return escapedText.replace(
            regex,
            '<span class="search__highlight">$1</span>'
        );
    }

    // ==========================================================================
    // UI Rendering
    // ==========================================================================

    /**
     * Returns the CSS class for a mapping type badge
     * @param {string} mappingType - The mapping type (categoria_principale, alias, profilo_incompleto)
     * @returns {string} CSS class for the badge
     */
    function getBadgeClass(mappingType) {
        const classMap = {
            'categoria_principale': 'search__suggestion-badge--primary',
            'alias': 'search__suggestion-badge--alias',
            'profilo_incompleto': 'search__suggestion-badge--incomplete'
        };
        return classMap[mappingType] || '';
    }

    /**
     * Renders suggestions dropdown
     * @param {Object[]} suggestions - Array of matching mansione objects
     * @param {string} query - Original query for highlighting
     */
    function renderSuggestions(suggestions, query) {
        state.currentSuggestions = suggestions;
        state.activeSuggestionIndex = -1;

        if (suggestions.length === 0) {
            hideSuggestions();
            return;
        }

        const fragment = document.createDocumentFragment();

        suggestions.forEach((suggestion, index) => {
            const li = document.createElement('li');
            li.className = 'search__suggestion-item';
            li.setAttribute('role', 'option');
            li.setAttribute('id', `suggestion-${index}`);
            li.setAttribute('aria-selected', 'false');

            // Build suggestion HTML with name and badge
            const nameHtml = highlightMatch(suggestion.nome, query);
            const badgeClass = getBadgeClass(suggestion.mapping_type);
            const badgeText = i18n.t(`mapping_short_${suggestion.mapping_type}`);
            li.innerHTML = `
                <span class="search__suggestion-name">${nameHtml}</span>
                <span class="search__suggestion-badge ${badgeClass}">${badgeText}</span>
            `;

            li.addEventListener('click', () => selectSuggestion(suggestion));
            li.addEventListener('mouseenter', () => setActiveSuggestion(index));

            fragment.appendChild(li);
        });

        elements.suggestions.innerHTML = '';
        elements.suggestions.appendChild(fragment);
        showSuggestions();
    }

    /**
     * Shows the suggestions dropdown
     */
    function showSuggestions() {
        elements.suggestions.classList.add('search__suggestions--visible');
        elements.input.setAttribute('aria-expanded', 'true');
    }

    /**
     * Hides the suggestions dropdown
     */
    function hideSuggestions() {
        elements.suggestions.classList.remove('search__suggestions--visible');
        elements.input.setAttribute('aria-expanded', 'false');
        state.activeSuggestionIndex = -1;
        state.currentSuggestions = [];
    }

    /**
     * Sets the active suggestion for keyboard navigation
     * @param {number} index - Index of active suggestion
     */
    function setActiveSuggestion(index) {
        const items = elements.suggestions.querySelectorAll('.search__suggestion-item');

        // Remove active class from all items
        items.forEach((item) => {
            item.classList.remove('search__suggestion-item--active');
            item.setAttribute('aria-selected', 'false');
        });

        // Add active class to current item
        if (index >= 0 && index < items.length) {
            items[index].classList.add('search__suggestion-item--active');
            items[index].setAttribute('aria-selected', 'true');
            items[index].scrollIntoView({ block: 'nearest' });
            elements.input.setAttribute('aria-activedescendant', `suggestion-${index}`);
        } else {
            elements.input.removeAttribute('aria-activedescendant');
        }

        state.activeSuggestionIndex = index;
    }

    /**
     * Selects a suggestion and processes Scenario 1
     * @param {Object} suggestion - Selected mansione object
     */
    function selectSuggestion(suggestion) {
        elements.input.value = suggestion.nome;
        hideSuggestions();

        // Log Event A: Selection
        logActivity(LogType.INPUT, i18n.t('log_user_selected', { role: suggestion.nome }));

        // Process as Scenario 1 (match found)
        processScenario1(suggestion);

        elements.input.focus();
    }

    /**
     * Formats mapping type for display
     * @param {string} mappingType - The mapping type from database
     * @returns {string} Human-readable mapping type
     */
    function formatMappingType(mappingType) {
        return i18n.t(`mapping_${mappingType}`) || mappingType;
    }

    /**
     * Processes Scenario 1: Exact Match
     * Handles three mapping types: categoria_principale, alias, profilo_incompleto
     * @param {Object} mansione - The matched mansione object
     */
    function processScenario1(mansione) {
        const { nome, numero_offerte, url, soft_skills, mapping_type } = mansione;

        // Check if soft skills are missing
        const hasSkills = soft_skills && soft_skills.length > 0;

        // Build consolidated log message with HTML formatting
        const mappingLabel = formatMappingType(mapping_type);
        const skillsList = hasSkills
            ? soft_skills.join(', ')
            : `<span class="system-log__warning">${i18n.t('skills_not_defined')}</span>`;

        const consolidatedMessage = i18n.t('log_match_found_html', {
            type: `<strong>${mappingLabel}</strong>`,
            skills: skillsList,
            offers: numero_offerte
        });
        logActivityHtml(LogType.LOGIC, consolidatedMessage, url || 'N/A');

        state.selectedRole = nome;

        // Handle based on mapping_type
        if (mapping_type === 'profilo_incompleto') {
            // profilo_incompleto: URL is null, redirect to generic offers page
            const fallbackUrl = CONFIG.searchUrl;
            state.generatedUrl = fallbackUrl;

            // Enable CTA with special state for incomplete profiles
            enableCtaButtonIncomplete(fallbackUrl);
            setInputMatchState();

            // Update status message (no warning in UI)
            showStatus(
                i18n.t('status_match', { role: nome, type: mappingLabel }),
                'match'
            );
        } else {
            // categoria_principale or alias: URL is always present
            state.generatedUrl = url;

            // Enable CTA (green state) with job offers count
            enableCtaButton(url, numero_offerte);
            setInputMatchState();

            // Update status message (no warning in UI)
            showStatus(
                i18n.t('status_match', { role: nome, type: mappingLabel }),
                'match'
            );
        }
    }

    /**
     * Processes Scenario 3: No Match
     * @param {string} searchTerm - The user's custom input
     * @param {string} trigger - 'enter' | 'blur' | 'selection'
     */
    function processScenario3(searchTerm, trigger) {
        // Log Event A: Input
        const triggerText = i18n.t(`trigger_${trigger}`);
        logActivity(LogType.INPUT, i18n.t('log_user_submitted', { term: searchTerm, trigger: triggerText }));

        // Log Event B: Check
        logActivity(LogType.LOGIC, i18n.t('log_check_no_match'));

        // Use generic offers page URL for no-match scenario
        const fallbackUrl = CONFIG.searchUrl;
        state.selectedRole = searchTerm;
        state.generatedUrl = fallbackUrl;

        // Log Event C: No Match routing
        logActivity(LogType.NOMATCH, i18n.t('log_generating_search'), fallbackUrl);

        // Enable CTA (orange/warning state)
        enableCtaButtonWarning(fallbackUrl);
        setInputNoMatchState();

        // Log Event D: UI Ready
        logActivity(LogType.UI, i18n.t('log_cta_enabled'));

        // Update status message
        showStatus(
            i18n.t('status_no_match'),
            'no-match'
        );
    }

    /**
     * Handles custom input submission (Enter key or blur)
     * @param {string} trigger - 'enter' | 'blur'
     */
    function handleCustomInputSubmit(trigger) {
        const inputValue = elements.input.value.trim();

        if (!inputValue) {
            return;
        }

        // Check if it's an exact match (Scenario 1)
        const mansione = findMansione(inputValue);
        if (mansione) {
            // Log and process as Scenario 1
            const triggerText = i18n.t(`trigger_${trigger}`);
            logActivity(LogType.INPUT, i18n.t('log_user_submitted', { term: inputValue, trigger: triggerText }));
            processScenario1(mansione);
        } else {
            // Process as Scenario 3 (No Match)
            processScenario3(inputValue, trigger);
        }
    }

    /**
     * Shows a status message
     * @param {string} message - Message to display
     * @param {'match' | 'no-match' | 'error' | ''} type - Message type
     * @param {string} [warning] - Optional warning message to display in red
     */
    function showStatus(message, type = '', warning = '') {
        elements.status.className = 'search__status';

        if (warning) {
            elements.status.innerHTML = `${escapeHtml(message)} <span class="search__status-warning">${escapeHtml(warning)}</span>`;
        } else {
            elements.status.textContent = message;
        }

        if (type === 'match') {
            elements.status.classList.add('search__status--match');
        } else if (type === 'no-match' || type === 'error') {
            elements.status.classList.add('search__status--no-match');
        }
    }

    /**
     * Clears the status message
     */
    function clearStatus() {
        elements.status.textContent = '';
        elements.status.className = 'search__status';
    }

    // ==========================================================================
    // Event Handlers
    // ==========================================================================

    /**
     * Handles input changes
     * @param {Event} event - Input event
     */
    function handleInput(event) {
        const query = event.target.value.trim();

        // Reset states when user types
        disableCtaButton();
        resetInputState();

        if (!query) {
            hideSuggestions();
            clearStatus();
            return;
        }

        const matches = filterMansioniPadre(query);

        if (matches.length === 0) {
            hideSuggestions();
            showStatus(
                i18n.t('status_no_exact_match'),
                'no-match'
            );
            return;
        }

        clearStatus();
        renderSuggestions(matches, query);
    }

    /**
     * Handles keyboard navigation and Enter key submission
     * @param {KeyboardEvent} event - Keyboard event
     */
    function handleKeydown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();

            const suggestionsVisible = elements.suggestions.classList.contains(
                'search__suggestions--visible'
            );

            // If suggestions are visible and one is selected, use it
            if (suggestionsVisible && state.activeSuggestionIndex >= 0) {
                selectSuggestion(state.currentSuggestions[state.activeSuggestionIndex]);
            } else {
                // Close suggestions and handle as custom input
                hideSuggestions();
                handleCustomInputSubmit('enter');
            }
            return;
        }

        const suggestionsVisible = elements.suggestions.classList.contains(
            'search__suggestions--visible'
        );

        if (!suggestionsVisible) {
            return;
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                navigateSuggestions(1);
                break;

            case 'ArrowUp':
                event.preventDefault();
                navigateSuggestions(-1);
                break;

            case 'Escape':
                hideSuggestions();
                break;

            case 'Tab':
                hideSuggestions();
                break;
        }
    }

    /**
     * Handles blur event on input field
     * @param {FocusEvent} event - Blur event
     */
    function handleBlur(event) {
        const inputValue = elements.input.value.trim();

        // Small delay to allow click on suggestions to register
        setTimeout(() => {
            // Only process if there's text and no scenario is active yet
            if (inputValue && state.currentScenario === null) {
                // Check if the related target is within the suggestions
                const relatedTarget = event.relatedTarget;
                const isClickOnSuggestion = relatedTarget &&
                    elements.suggestions.contains(relatedTarget);

                if (!isClickOnSuggestion) {
                    handleCustomInputSubmit('blur');
                }
            }
        }, 150);
    }

    /**
     * Navigates through suggestions with keyboard
     * @param {number} direction - 1 for down, -1 for up
     */
    function navigateSuggestions(direction) {
        const totalSuggestions = state.currentSuggestions.length;

        if (totalSuggestions === 0) {
            return;
        }

        let newIndex = state.activeSuggestionIndex + direction;

        // Wrap around
        if (newIndex < 0) {
            newIndex = totalSuggestions - 1;
        } else if (newIndex >= totalSuggestions) {
            newIndex = 0;
        }

        setActiveSuggestion(newIndex);
    }

    /**
     * Handles clicks outside the component
     * @param {MouseEvent} event - Click event
     */
    function handleClickOutside(event) {
        const isClickInside =
            elements.input.contains(event.target) ||
            elements.suggestions.contains(event.target);

        if (!isClickInside) {
            hideSuggestions();
        }
    }

    // ==========================================================================
    // Initialization
    // ==========================================================================

    /**
     * Initializes DOM element references
     */
    function initializeElements() {
        elements.input = document.getElementById('jobInput');
        elements.clearInput = document.getElementById('clearInput');
        elements.suggestions = document.getElementById('suggestions');
        elements.status = document.getElementById('statusMessage');
        elements.ctaButton = document.getElementById('ctaButton');
        elements.systemLog = document.getElementById('systemLog');
        elements.clearLogBtn = document.getElementById('clearLogBtn');
        elements.suggestionsLink = document.getElementById('suggestionsLink');
        elements.suggestionsModal = document.getElementById('suggestionsModal');
        elements.modalCloseBtn = document.getElementById('modalCloseBtn');
        elements.modalBackdrop = elements.suggestionsModal?.querySelector('.modal__backdrop');
        elements.langToggle = document.getElementById('langToggle');

        if (!elements.input || !elements.suggestions || !elements.status) {
            throw new Error('[Beyond Titles] Required DOM elements not found');
        }
    }

    // ==========================================================================
    // Modal Management
    // ==========================================================================

    /**
     * Opens the suggestions modal
     */
    function openModal() {
        if (elements.suggestionsModal) {
            elements.suggestionsModal.classList.add('modal--visible');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Closes the suggestions modal
     */
    function closeModal() {
        if (elements.suggestionsModal) {
            elements.suggestionsModal.classList.remove('modal--visible');
            document.body.style.overflow = '';
        }
    }

    /**
     * Copies text to input field, closes modal and triggers search
     * @param {string} text - Text to insert in input
     */
    function copyToInput(text) {
        // Close the modal
        closeModal();

        // Set the text in the input field
        elements.input.value = text;

        // Focus the input
        elements.input.focus();

        // Reset states and trigger the search flow
        disableCtaButton();
        resetInputState();

        // Check if it matches a mansione and process accordingly
        const mansione = findMansione(text);
        if (mansione) {
            logActivity(LogType.INPUT, i18n.t('log_user_modal', { role: text }));
            processScenario1(mansione);
        } else {
            // If no match, show the suggestions dropdown
            const matches = filterMansioniPadre(text);
            if (matches.length > 0) {
                renderSuggestions(matches, text);
            }
        }
    }

    /**
     * Binds event listeners
     */
    function bindEvents() {
        const debouncedInput = debounce(handleInput, CONFIG.debounceDelay);

        elements.input.addEventListener('input', (e) => {
            updateClearButton();
            debouncedInput(e);
        });
        elements.input.addEventListener('keydown', handleKeydown);
        elements.input.addEventListener('blur', handleBlur);
        document.addEventListener('click', handleClickOutside);

        // Clear input button
        if (elements.clearInput) {
            elements.clearInput.addEventListener('click', clearInputField);
        }

        // Focus event to show suggestions again if there's input
        elements.input.addEventListener('focus', () => {
            const query = elements.input.value.trim();
            if (query && state.isDataLoaded && state.currentScenario === null) {
                const matches = filterMansioniPadre(query);
                if (matches.length > 0) {
                    renderSuggestions(matches, query);
                }
            }
        });

        // Clear log button
        if (elements.clearLogBtn) {
            elements.clearLogBtn.addEventListener('click', clearLog);
        }

        // Prevent disabled CTA from navigating
        if (elements.ctaButton) {
            elements.ctaButton.addEventListener('click', (e) => {
                if (elements.ctaButton.classList.contains('cta-button--disabled')) {
                    e.preventDefault();
                }
            });
        }

        // Modal events
        if (elements.suggestionsLink) {
            elements.suggestionsLink.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        }

        if (elements.modalCloseBtn) {
            elements.modalCloseBtn.addEventListener('click', closeModal);
        }

        if (elements.modalBackdrop) {
            elements.modalBackdrop.addEventListener('click', closeModal);
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.suggestionsModal?.classList.contains('modal--visible')) {
                closeModal();
            }
        });

        // Copy buttons in modal
        if (elements.suggestionsModal) {
            elements.suggestionsModal.addEventListener('click', (e) => {
                const copyBtn = e.target.closest('.modal__copy-btn');
                if (copyBtn) {
                    const textToCopy = copyBtn.dataset.copy;
                    if (textToCopy) {
                        copyToInput(textToCopy);
                    }
                }
            });
        }

        // Language toggle
        if (elements.langToggle) {
            elements.langToggle.addEventListener('click', toggleLanguage);
        }
    }

    /**
     * Main initialization function
     */
    async function init() {
        try {
            initializeElements();

            // Set initial language
            document.documentElement.lang = i18n.getLanguage();

            // Update UI with current language
            updateUILanguage();

            logActivity(LogType.INFO, i18n.t('log_init'));

            await loadMansioniData();
            bindEvents();

            // Note: "Application ready" message is logged by survey.js after all data is loaded

            console.log('[Beyond Titles] Application initialized successfully');
        } catch (error) {
            console.error('[Beyond Titles] Initialization failed:', error);
        }
    }

    // Start the application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
