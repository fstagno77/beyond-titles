/**
 * Beyond Titles - Internationalization (i18n) Module
 * Language detection and translation management
 */

const translations = {
    it: {
        // Header
        header_logo_alt: "Beyond Titles",

        // Hero Section
        hero_title: "Qual è il tuo ruolo?",
        hero_subtitle: "Digita la tua mansione attuale per verificare la corrispondenza con il nostro database.",

        // Search
        search_placeholder: "Inizia a scrivere (es. Magazziniere, Barista...)",
        search_aria_label: "Inserisci il tuo ruolo lavorativo",
        suggestions_link: "Suggerimenti",

        // CTA Button
        cta_default: "Vedi Offerte",
        cta_active_single: "Abbiamo 1 offerta di lavoro per te",
        cta_active_multiple: "Abbiamo {count} offerte di lavoro per te",
        cta_warning: "Scopri le nostre offerte di lavoro per te",

        // System Log
        log_title: "System Activity Log",
        log_clear: "Clear",
        log_aria_clear: "Pulisci log",
        log_aria_label: "Log attività sistema",

        // Footer
        footer_changelog: "Changelog",

        // Modal
        modal_title: "Esempi di ricerche",
        modal_close: "Chiudi",
        modal_copy: "Copia",

        modal_example1_badge: "Categoria Principale",
        modal_example1_text: "Il sistema trova il match esatto. Tratta la mansione come un nodo primario e carica il set completo di skill (Comunicazione, Orientamento al cliente, Standing, ecc.). L'utente atterra direttamente sull'URL dedicato con 74 offerte attive.",

        modal_example2_badge: "Alias",
        modal_example2_text: "Il sistema riconosce che l'utente ha usato un termine comune. Attraverso il campo rif_parent presente nel JSON, il motore \"pesca\" le skill del padre (Addetto al magazzino - gestione ordine e uscita merci) ma mantiene l'utente sul link specifico per i magazzinieri che ha 60 offerte.",

        modal_example3_badge: "Fallback",
        modal_example3_text: "Il sistema identifica una mansione esistente tra le offerte ma priva di mappatura competenze nel database della struttura. Attiva il protocollo di sicurezza caricando le skill universali per la survey, ma mantiene il puntamento al link specifico per massaggiatori presente nel JSON, tutelando la conversione finale nonostante l'assenza di dati psicometrici originali.",

        modal_example4_badge: "No Match",
        modal_example4_text: "L'input non trova alcun riscontro nei database delle offerte o delle competenze. Il motore carica il set di skill di base per completare il racconto dell'archetipo e genera dinamicamente una ricerca generica sul sito Gi Group basata sul termine inserito, evitando che l'utente finisca in un vicolo cieco tecnologico e garantendo continuita all'esperienza.",

        // Status Messages
        status_match: "Ruolo identificato: {role} ({type})",
        status_no_match: "Nessun match esatto. Attivazione ricerca libera.",
        status_error: "Errore nel caricamento dei dati. Riprova più tardi.",
        status_no_exact_match: "Nessuna corrispondenza esatta. Premi Invio per attivare la ricerca libera.",

        // Log Messages
        log_loading: "Loading mansioni database...",
        log_loaded_stats: "Database loaded: {total} mansioni ({main} dirette, {alias} alias, {fallback} fallback).",
        log_loaded: "Database loaded: {count} job titles available.",
        log_error: "Error loading database: {error}",
        log_cleared: "Log cleared.",
        log_init: "Beyond Titles v0.6.3 initializing...",
        log_ready: "Application ready. Waiting for user input...",
        log_user_selected: "User selected \"{role}\".",
        log_user_submitted: "User submitted \"{term}\" ({trigger}).",
        log_user_modal: "User selected \"{role}\" from suggestions modal.",
        log_check_no_match: "Check DB... No Match Found.",
        log_generating_search: "Generating Standard Search Query.",
        log_cta_enabled: "CTA Enabled (Orange State).",

        // Mapping Types
        mapping_categoria_principale: "Categoria Principale",
        mapping_alias: "Alias",
        mapping_fallback: "Fallback",

        // Log consolidated message
        log_match_found: "Match found - Tipo: {type} | Soft Skills: {skills} | Offerte: {offers}",

        // Triggers
        trigger_enter: "Enter Key",
        trigger_blur: "Focus Out",
        trigger_selection: "Selection",

        // Language Toggle
        lang_toggle_aria: "Cambia lingua",
        lang_it: "Italiano",
        lang_en: "English",

        // Changelog
        changelog_back: "← Torna alla Home",
        changelog_title: "Changelog",

        changelog_v063_date: "13 Gennaio 2026",
        changelog_v063_item1: "Changelog multilingua (IT/EN)",
        changelog_v063_item2: "Traduzioni changelog sincronizzate con selettore lingua",
        changelog_v063_item3: "Allineamento toggle lingua con pannello System Log",

        changelog_v062_date: "13 Gennaio 2026",
        changelog_v062_item1: "Gestione centralizzata header e footer",
        changelog_v062_item2: "Header e footer identici su tutte le pagine",
        changelog_v062_item3: "Sistema di versioning unificato",

        changelog_v06_date: "12 Gennaio 2026",
        changelog_v06_item1: "Sistema multilingua italiano e inglese",
        changelog_v06_item2: "Rilevamento automatico lingua browser",
        changelog_v06_item3: "Toggle per cambio lingua manuale",
        changelog_v06_item4: "Traduzioni complete interfaccia utente",

        changelog_v05_date: "10 Gennaio 2026",
        changelog_v05_item1: "Integrazione nuovo database mansioni_database.json con 445 mansioni",
        changelog_v05_item2: "Sistema di mapping a 3 livelli: categoria principale, alias, fallback",
        changelog_v05_item3: "Visualizzazione tipo di mapping nel System Log (Categoria Principale, Alias, Fallback)",
        changelog_v05_item4: "Visualizzazione soft skills richieste per ogni mansione nel log",
        changelog_v05_item5: "URL delle offerte ora letti direttamente dal database (non più generati)",
        changelog_v05_item6: "Statistiche del database mostrate al caricamento",

        changelog_v04_date: "17 Dicembre 2025",
        changelog_v04_item1: "Aggiunto conteggio job offers per ogni mansione nel database",
        changelog_v04_item2: "CTA dinamica per Match: \"Abbiamo XX offerte di lavoro per te\"",
        changelog_v04_item3: "CTA dinamica per No Match: \"Scopri le nostre offerte di lavoro per te\"",
        changelog_v04_item4: "Struttura dati JSON aggiornata con oggetti {nome, jobOffers}",

        changelog_v03_date: "17 Dicembre 2025",
        changelog_v03_item1: "Implementato Scenario 3: No Match con ricerca libera",
        changelog_v03_item2: "Gestione tasto Enter per submit input personalizzato",
        changelog_v03_item3: "Gestione blur event per submit automatico",
        changelog_v03_item4: "Generazione URL di ricerca con parametro ?job=",
        changelog_v03_item5: "Nuovo tipo di log NO MATCH (arancione)",
        changelog_v03_item6: "Stato CTA arancione per scenario No Match",
        changelog_v03_item7: "Bordo input arancione quando No Match attivo",
        changelog_v03_item8: "Messaggio status: \"Premi Invio per ricerca libera\"",
        changelog_v03_item9: "Aggiunto logo Beyond Titles nell'header",
        changelog_v03_item10: "Aggiunta favicon",

        changelog_v02_date: "17 Dicembre 2025",
        changelog_v02_item1: "Implementato Scenario 1: Unique Match con generazione Deep Link",
        changelog_v02_item2: "Aggiunto pulsante CTA \"Vedi Offerte\" con stati disabled/active",
        changelog_v02_item3: "Creato pannello System Activity Log per debugging/demo",
        changelog_v02_item4: "Generazione URL dinamica (lowercase, spazi -> trattini, suffisso -jo)",
        changelog_v02_item5: "Log eventi in tempo reale: INPUT, LOGIC, ROUTING, UI",
        changelog_v02_item6: "Stile terminale per il log (monospace, tema scuro)",
        changelog_v02_item7: "Layout responsive a due colonne (hero + log panel)",

        changelog_v01_date: "17 Dicembre 2025",
        changelog_v01_item1: "Struttura progetto refactored: separazione HTML, CSS e JS",
        changelog_v01_item2: "Database mansioni padre estratto in file JSON esterno",
        changelog_v01_item3: "Caricamento asincrono dati con fetch API",
        changelog_v01_item4: "Autocomplete con highlight delle corrispondenze",
        changelog_v01_item5: "Gestione scenari Match e No Match con feedback visivo",
        changelog_v01_item6: "Navigazione tastiera nelle suggestions (frecce, Enter, Escape)",
        changelog_v01_item7: "UI con branding Gi Group (palette colori, tipografia)",
        changelog_v01_item8: "Layout responsive per dispositivi mobile",
        changelog_v01_item9: "Accessibilità migliorata con attributi ARIA"
    },

    en: {
        // Header
        header_logo_alt: "Beyond Titles",

        // Hero Section
        hero_title: "What's your role?",
        hero_subtitle: "Type your current job title to check the match with our database.",

        // Search
        search_placeholder: "Start typing (e.g. Warehouse Worker, Barista...)",
        search_aria_label: "Enter your job role",
        suggestions_link: "Suggestions",

        // CTA Button
        cta_default: "View Jobs",
        cta_active_single: "We have 1 job offer for you",
        cta_active_multiple: "We have {count} job offers for you",
        cta_warning: "Discover our job offers for you",

        // System Log
        log_title: "System Activity Log",
        log_clear: "Clear",
        log_aria_clear: "Clear log",
        log_aria_label: "System activity log",

        // Footer
        footer_changelog: "Changelog",

        // Modal
        modal_title: "Search examples",
        modal_close: "Close",
        modal_copy: "Copy",

        modal_example1_badge: "Main Category",
        modal_example1_text: "The system finds an exact match. It treats the job as a primary node and loads the complete skill set (Communication, Customer Orientation, Standing, etc.). The user lands directly on the dedicated URL with 74 active offers.",

        modal_example2_badge: "Alias",
        modal_example2_text: "The system recognizes that the user has used a common term. Through the rif_parent field in the JSON, the engine \"fetches\" the skills from the parent job (Warehouse Associate - order and shipment management) but keeps the user on the specific link for warehouse workers which has 60 offers.",

        modal_example3_badge: "Fallback",
        modal_example3_text: "The system identifies an existing job among the offers but without competency mapping in the database structure. It activates the safety protocol by loading universal skills for the survey, but maintains the pointer to the specific link for massage therapists in the JSON, protecting the final conversion despite the absence of original psychometric data.",

        modal_example4_badge: "No Match",
        modal_example4_text: "The input finds no match in the offers or competencies databases. The engine loads the basic skill set to complete the archetype story and dynamically generates a generic search on the Gi Group site based on the entered term, preventing the user from hitting a technological dead-end and ensuring experience continuity.",

        // Status Messages
        status_match: "Role identified: {role} ({type})",
        status_no_match: "No exact match. Activating free search.",
        status_error: "Error loading data. Please try again later.",
        status_no_exact_match: "No exact match. Press Enter to activate free search.",

        // Log Messages
        log_loading: "Loading job titles database...",
        log_loaded_stats: "Database loaded: {total} job titles ({main} direct, {alias} aliases, {fallback} fallback).",
        log_loaded: "Database loaded: {count} job titles available.",
        log_error: "Error loading database: {error}",
        log_cleared: "Log cleared.",
        log_init: "Beyond Titles v0.6.3 initializing...",
        log_ready: "Application ready. Waiting for user input...",
        log_user_selected: "User selected \"{role}\".",
        log_user_submitted: "User submitted \"{term}\" ({trigger}).",
        log_user_modal: "User selected \"{role}\" from suggestions modal.",
        log_check_no_match: "Check DB... No Match Found.",
        log_generating_search: "Generating Standard Search Query.",
        log_cta_enabled: "CTA Enabled (Orange State).",

        // Mapping Types
        mapping_categoria_principale: "Main Category",
        mapping_alias: "Alias",
        mapping_fallback: "Fallback",

        // Log consolidated message
        log_match_found: "Match found - Type: {type} | Soft Skills: {skills} | Offers: {offers}",

        // Triggers
        trigger_enter: "Enter Key",
        trigger_blur: "Focus Out",
        trigger_selection: "Selection",

        // Language Toggle
        lang_toggle_aria: "Switch language",
        lang_it: "Italiano",
        lang_en: "English",

        // Changelog
        changelog_back: "← Back to Home",
        changelog_title: "Changelog",

        changelog_v063_date: "January 13, 2026",
        changelog_v063_item1: "Multilingual changelog (IT/EN)",
        changelog_v063_item2: "Changelog translations synchronized with language selector",
        changelog_v063_item3: "Language toggle aligned with System Log panel",

        changelog_v062_date: "January 13, 2026",
        changelog_v062_item1: "Centralized header and footer management",
        changelog_v062_item2: "Identical header and footer across all pages",
        changelog_v062_item3: "Unified versioning system",

        changelog_v06_date: "January 12, 2026",
        changelog_v06_item1: "Italian and English multilingual system",
        changelog_v06_item2: "Automatic browser language detection",
        changelog_v06_item3: "Toggle for manual language change",
        changelog_v06_item4: "Complete user interface translations",

        changelog_v05_date: "January 10, 2026",
        changelog_v05_item1: "Integration of new mansioni_database.json with 445 job titles",
        changelog_v05_item2: "3-level mapping system: main category, alias, fallback",
        changelog_v05_item3: "Mapping type display in System Log (Main Category, Alias, Fallback)",
        changelog_v05_item4: "Required soft skills display for each job in log",
        changelog_v05_item5: "Job offer URLs now read directly from database (no longer generated)",
        changelog_v05_item6: "Database statistics shown on load",

        changelog_v04_date: "December 17, 2025",
        changelog_v04_item1: "Added job offers count for each job title in database",
        changelog_v04_item2: "Dynamic CTA for Match: \"We have XX job offers for you\"",
        changelog_v04_item3: "Dynamic CTA for No Match: \"Discover our job offers for you\"",
        changelog_v04_item4: "Updated JSON data structure with {name, jobOffers} objects",

        changelog_v03_date: "December 17, 2025",
        changelog_v03_item1: "Implemented Scenario 3: No Match with free search",
        changelog_v03_item2: "Enter key handling for custom input submit",
        changelog_v03_item3: "Blur event handling for automatic submit",
        changelog_v03_item4: "Search URL generation with ?job= parameter",
        changelog_v03_item5: "New NO MATCH log type (orange)",
        changelog_v03_item6: "Orange CTA state for No Match scenario",
        changelog_v03_item7: "Orange input border when No Match is active",
        changelog_v03_item8: "Status message: \"Press Enter for free search\"",
        changelog_v03_item9: "Added Beyond Titles logo in header",
        changelog_v03_item10: "Added favicon",

        changelog_v02_date: "December 17, 2025",
        changelog_v02_item1: "Implemented Scenario 1: Unique Match with Deep Link generation",
        changelog_v02_item2: "Added \"View Jobs\" CTA button with disabled/active states",
        changelog_v02_item3: "Created System Activity Log panel for debugging/demo",
        changelog_v02_item4: "Dynamic URL generation (lowercase, spaces -> hyphens, -jo suffix)",
        changelog_v02_item5: "Real-time event logging: INPUT, LOGIC, ROUTING, UI",
        changelog_v02_item6: "Terminal style for log (monospace, dark theme)",
        changelog_v02_item7: "Responsive two-column layout (hero + log panel)",

        changelog_v01_date: "December 17, 2025",
        changelog_v01_item1: "Refactored project structure: HTML, CSS and JS separation",
        changelog_v01_item2: "Parent job titles database extracted to external JSON file",
        changelog_v01_item3: "Asynchronous data loading with fetch API",
        changelog_v01_item4: "Autocomplete with match highlighting",
        changelog_v01_item5: "Match and No Match scenarios with visual feedback",
        changelog_v01_item6: "Keyboard navigation in suggestions (arrows, Enter, Escape)",
        changelog_v01_item7: "UI with Gi Group branding (color palette, typography)",
        changelog_v01_item8: "Responsive layout for mobile devices",
        changelog_v01_item9: "Improved accessibility with ARIA attributes"
    }
};

/**
 * i18n Manager
 */
class I18n {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.translations = translations;
    }

    /**
     * Detects the user's language based on geolocation (country code)
     * Falls back to browser language if geolocation fails
     * @returns {string} Language code (it or en)
     */
    detectLanguage() {
        // Check localStorage first
        const savedLang = localStorage.getItem('beyond-titles-lang');
        if (savedLang && (savedLang === 'it' || savedLang === 'en')) {
            return savedLang;
        }

        // Try to detect based on browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('it')) {
            return 'it';
        }

        // Default to English for all other countries
        return 'en';
    }

    /**
     * Sets the current language
     * @param {string} lang - Language code (it or en)
     */
    setLanguage(lang) {
        if (lang === 'it' || lang === 'en') {
            this.currentLang = lang;
            localStorage.setItem('beyond-titles-lang', lang);

            // Update HTML lang attribute
            document.documentElement.lang = lang;

            // Dispatch event for app to update UI
            window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
        }
    }

    /**
     * Gets the current language
     * @returns {string} Current language code
     */
    getLanguage() {
        return this.currentLang;
    }

    /**
     * Translates a key with optional parameters
     * @param {string} key - Translation key
     * @param {Object} params - Optional parameters for interpolation
     * @returns {string} Translated text
     */
    t(key, params = {}) {
        let text = this.translations[this.currentLang]?.[key] || key;

        // Replace parameters
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });

        return text;
    }

    /**
     * Gets all translations for current language
     * @returns {Object} Translations object
     */
    getAll() {
        return this.translations[this.currentLang] || {};
    }
}

// Export for use in app.js
window.I18n = I18n;
