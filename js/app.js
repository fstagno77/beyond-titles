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
 */

(function () {
    'use strict';

    // ==========================================================================
    // Configuration
    // ==========================================================================

    const CONFIG = {
        dataUrl: './data/mansioniPadre.json',
        baseUrl: 'https://www.gigroup.it/offerte-lavoro/',
        searchUrl: 'https://www.gigroup.it/offerte-lavoro/',
        urlSuffix: '-jo',
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
        suggestions: null,
        status: null,
        ctaButton: null,
        systemLog: null,
        clearLogBtn: null,
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
     * Clears all entries from the System Activity Log
     */
    function clearLog() {
        if (elements.systemLog) {
            elements.systemLog.innerHTML = '';
            logActivity(LogType.INFO, 'Log cleared.');
        }
    }

    // ==========================================================================
    // URL Generation
    // ==========================================================================

    /**
     * Generates a Deep Link URL from a job title (Scenario 1)
     * Rules: lowercase, spaces -> hyphens, append -jo
     * @param {string} jobTitle - The job title to convert
     * @returns {string} The generated URL
     */
    function generateDeepLink(jobTitle) {
        const slug = jobTitle
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .replace(/^-|-$/g, ''); // Trim hyphens from start/end

        return `${CONFIG.baseUrl}${slug}${CONFIG.urlSuffix}`;
    }

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
        const offerText = jobOffers === 1 ? '1 offerta di lavoro' : `${jobOffers} offerte di lavoro`;
        elements.ctaButton.textContent = `Abbiamo ${offerText} per te`;
        elements.ctaButton.classList.remove('cta-button--disabled', 'cta-button--warning');
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
        elements.ctaButton.textContent = 'Scopri le nostre offerte di lavoro per te';
        elements.ctaButton.classList.remove('cta-button--disabled', 'cta-button--active');
        elements.ctaButton.classList.add('cta-button--warning');
        elements.ctaButton.setAttribute('aria-disabled', 'false');
        elements.ctaButton.setAttribute('tabindex', '0');
        elements.ctaButton.setAttribute('target', '_blank');
        elements.ctaButton.setAttribute('rel', 'noopener noreferrer');

        state.currentScenario = 'no-match';
    }

    /**
     * Disables the CTA button
     */
    function disableCtaButton() {
        if (!elements.ctaButton) return;

        elements.ctaButton.href = '#';
        elements.ctaButton.textContent = 'Vedi Offerte';
        elements.ctaButton.classList.remove('cta-button--active', 'cta-button--warning');
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

    // ==========================================================================
    // Data Loading
    // ==========================================================================

    /**
     * Fetches mansioniPadre data from JSON file
     * @returns {Promise<string[]>} Array of job titles
     */
    async function loadMansioniPadreData() {
        logActivity(LogType.INFO, 'Loading mansioniPadre database...');

        try {
            const response = await fetch(CONFIG.dataUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.mansioniPadre || !Array.isArray(data.mansioniPadre)) {
                throw new Error('Invalid data format: expected { mansioniPadre: [] }');
            }

            state.mansioniPadre = data.mansioniPadre;
            state.isDataLoaded = true;

            logActivity(LogType.INFO, `Database loaded: ${state.mansioniPadre.length} job titles available.`);

            return state.mansioniPadre;
        } catch (error) {
            console.error('[Beyond Titles] Failed to load mansioniPadre data:', error);
            logActivity(LogType.INFO, `Error loading database: ${error.message}`);
            showStatus('Errore nel caricamento dei dati. Riprova più tardi.', 'error');
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
            li.innerHTML = highlightMatch(suggestion.nome, query);

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
     * @param {Object} suggestion - Selected mansione object with nome and jobOffers
     */
    function selectSuggestion(suggestion) {
        elements.input.value = suggestion.nome;
        hideSuggestions();

        // Log Event A: Selection
        logActivity(LogType.INPUT, `User selected "${suggestion.nome}".`);

        // Validate against database (Scenario 1)
        if (isExactMatch(suggestion.nome)) {
            processScenario1(suggestion.nome, suggestion.jobOffers);
        } else {
            // This shouldn't happen if selected from suggestions, but handle it
            processScenario3(suggestion.nome, 'selection');
        }

        elements.input.focus();
    }

    /**
     * Processes Scenario 1: Exact Match
     * @param {string} jobTitle - The matched job title
     * @param {number} jobOffers - Number of job offers for this role
     */
    function processScenario1(jobTitle, jobOffers) {
        // Log Event B: Analysis
        logActivity(LogType.LOGIC, 'Exact Match found in DB (Scenario 1).');

        // Generate Deep Link
        const deepLink = generateDeepLink(jobTitle);
        state.selectedRole = jobTitle;
        state.generatedUrl = deepLink;

        // Log Event C: Routing
        logActivity(LogType.ROUTING, 'Generated Deep Link:', deepLink);

        // Enable CTA (green state) with job offers count
        enableCtaButton(deepLink, jobOffers);
        setInputMatchState();

        // Log Event D: UI Ready
        logActivity(LogType.UI, `CTA Enabled with ${jobOffers} job offers.`);

        // Update status message
        showStatus(
            `Ruolo identificato: ${jobTitle} (Match Tecnico Valido)`,
            'match'
        );
    }

    /**
     * Processes Scenario 3: No Match
     * @param {string} searchTerm - The user's custom input
     * @param {string} trigger - 'enter' | 'blur' | 'selection'
     */
    function processScenario3(searchTerm, trigger) {
        // Log Event A: Input
        const triggerText = trigger === 'enter' ? 'Enter Key' : trigger === 'blur' ? 'Focus Out' : 'Selection';
        logActivity(LogType.INPUT, `User submitted custom text "${searchTerm}" (${triggerText}).`);

        // Log Event B: Check
        logActivity(LogType.LOGIC, 'Check DB... No Match Found.');

        // Generate search URL
        const searchUrl = generateSearchUrl(searchTerm);
        state.selectedRole = searchTerm;
        state.generatedUrl = searchUrl;

        // Log Event C: No Match routing
        logActivity(LogType.NOMATCH, 'Generating Standard Search Query.', searchUrl);

        // Enable CTA (orange/warning state)
        enableCtaButtonWarning(searchUrl);
        setInputNoMatchState();

        // Log Event D: UI Ready
        logActivity(LogType.UI, 'CTA Enabled (Orange State).');

        // Update status message
        showStatus(
            'Nessun match esatto. Attivazione ricerca libera.',
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
            logActivity(LogType.INPUT, `User submitted "${inputValue}" (${trigger === 'enter' ? 'Enter Key' : 'Focus Out'}).`);
            processScenario1(mansione.nome, mansione.jobOffers);
        } else {
            // Process as Scenario 3 (No Match)
            processScenario3(inputValue, trigger);
        }
    }

    /**
     * Shows a status message
     * @param {string} message - Message to display
     * @param {'match' | 'no-match' | 'error' | ''} type - Message type
     */
    function showStatus(message, type = '') {
        elements.status.textContent = message;
        elements.status.className = 'search__status';

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
                `Nessuna corrispondenza esatta. Premi Invio per attivare la ricerca libera.`,
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
        elements.suggestions = document.getElementById('suggestions');
        elements.status = document.getElementById('statusMessage');
        elements.ctaButton = document.getElementById('ctaButton');
        elements.systemLog = document.getElementById('systemLog');
        elements.clearLogBtn = document.getElementById('clearLogBtn');

        if (!elements.input || !elements.suggestions || !elements.status) {
            throw new Error('[Beyond Titles] Required DOM elements not found');
        }
    }

    /**
     * Binds event listeners
     */
    function bindEvents() {
        const debouncedInput = debounce(handleInput, CONFIG.debounceDelay);

        elements.input.addEventListener('input', debouncedInput);
        elements.input.addEventListener('keydown', handleKeydown);
        elements.input.addEventListener('blur', handleBlur);
        document.addEventListener('click', handleClickOutside);

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
    }

    /**
     * Main initialization function
     */
    async function init() {
        try {
            initializeElements();

            logActivity(LogType.INFO, 'Beyond Titles v0.4 initializing...');

            await loadMansioniPadreData();
            bindEvents();

            logActivity(LogType.INFO, 'Application ready. Waiting for user input...');

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
