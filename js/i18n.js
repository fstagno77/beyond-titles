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
        search_clear: "Cancella ricerca",
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
        modal_example1_search: "Addetto alla vendita retail",
        modal_example1_text: "Il sistema trova il match esatto nel database delle offerte attive. La mansione è classificata come categoria_principale con has_custom_skills: true, il che significa che possiede un set di competenze specifico e verificato (Coinvolgimento, Stabilità emotiva, Flessibilità, ecc.). L'utente atterra direttamente sull'URL dedicato con 74 offerte attive.",

        modal_example2_badge: "Alias",
        modal_example2_search: "Insegnante scuola dell'infanzia",
        modal_example2_text: "Il sistema riconosce che l'utente ha cercato una variante specifica di una mansione più generica. Il mapping_type: alias indica che questa voce eredita URL e numero offerte dalla categoria principale di riferimento (categoria_riferimento: insegnante), ma mantiene le proprie soft skills distintive (Problem Solving, Coinvolgimento, Comunicazione, Ascolto, ecc.). L'utente viene indirizzato alla pagina \"Insegnante\" che contiene 1 offerta attiva, ricevendo però un profilo competenze calibrato sul ruolo specifico dell'infanzia.",

        modal_example3_badge: "Profilo Incompleto",
        modal_example3_search: "Data Scientist",
        modal_example3_text: "Il sistema identifica una mansione presente nel database delle competenze ma priva di offerte attive sul sito Gi Group. Il mapping_type: profilo_incompleto segnala che url: null e numero_offerte: 0. Il motore carica comunque le 8 soft skills associate al ruolo (Iniziativa, Problem Solving, Analisi, Innovazione, ecc.) per completare il profilo dell'utente nella survey. Il frontend gestisce l'assenza di link mostrando un messaggio \"Nessuna offerta attiva al momento\", mantenendo il valore informativo delle competenze.",

        modal_example4_badge: "No Match",
        modal_example4_search: "Influencer",
        modal_example4_text: "L'input non trova alcun riscontro nel database delle mansioni. Il frontend rileva l'assenza di match e attiva il protocollo di fallback caricando le skill universali (Problem Solving, Affidabilità, Collaborazione Teamwork) per completare comunque la survey, generando dinamicamente una ricerca generica sul sito Gi Group basata sul termine inserito. Questo evita che l'utente finisca in un vicolo cieco e garantisce continuità all'esperienza.",

        modal_extra_title: "Casi Aggiuntivi da Verificare",

        modal_example5_badge: "Skills Mancanti",
        modal_example5_search: "Magazziniere",
        modal_example5_text: "Il sistema trova la mansione tra le offerte attive (60 posizioni disponibili), ma il campo has_custom_skills: false e soft_skills: null indicano che non esistono competenze specifiche mappate nel database della struttura. Il frontend rileva il valore null e applica il set di skill universali per la survey, mantenendo l'URL valido verso le offerte reali.",

        modal_example6_badge: "Doppio Null",
        modal_example6_search: "Web Marketing Expert",
        modal_example6_text: "Caso limite: la mansione esiste nel database struttura ma con url: null, soft_skills: null e numero_offerte: 0. Il frontend gestisce il doppio null mostrando \"Nessuna offerta attiva\" e applicando il fallback delle skill universali a livello di visualizzazione per garantire il completamento della survey.",

        // Status Messages
        status_match: "Ruolo identificato: {role} ({type})",
        status_no_match: "Nessun match esatto. Attivazione ricerca libera.",
        status_error: "Errore nel caricamento dei dati. Riprova più tardi.",
        status_no_exact_match: "Nessuna corrispondenza esatta. Premi Invio per attivare la ricerca libera.",

        // Log Messages
        log_loading: "Loading mansioni database...",
        log_loaded_stats: "Database loaded: {total} mansioni ({main} principali, {alias} alias, {incomplete} profili incompleti).",
        log_loaded: "Database loaded: {count} job titles available.",
        log_error: "Error loading database: {error}",
        log_cleared: "Log cleared.",
        log_init: "Beyond Titles v0.7.1 initializing...",
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
        mapping_profilo_incompleto: "Profilo Incompleto",

        // Mapping Types (short for suggestions dropdown)
        mapping_short_categoria_principale: "Principale",
        mapping_short_alias: "Alias",
        mapping_short_profilo_incompleto: "Incompleto",

        // Profilo Incompleto Messages
        no_offers_available: "Nessuna offerta attiva al momento",
        skills_not_defined: "Competenze non ancora definite",
        cta_no_offers: "Scopri le nostre offerte di lavoro per te",

        // Log consolidated message
        log_match_found: "Match found - Tipo: {type} | Soft Skills: {skills} | Offerte: {offers}",
        log_match_found_html: "Match found - Tipo: {type} | Soft Skills: {skills} | Offerte: {offers}",

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

        changelog_v071_date: "13 Gennaio 2026",
        changelog_v071_item1: "Aggiunto pulsante X per cancellare il contenuto del campo di ricerca",
        changelog_v071_item2: "Il pulsante appare automaticamente quando l'utente inizia a digitare",
        changelog_v071_item3: "Click sul pulsante resetta tutti gli stati dell'interfaccia",

        changelog_v07_date: "13 Gennaio 2026",
        changelog_v07_item1: "Migrazione a database mansioni v4 con 604 voci totali",
        changelog_v07_item2: "Nuovo mapping_type: profilo_incompleto (134 mansioni senza offerte attive)",
        changelog_v07_item3: "Gestione URL null per profili incompleti con ricerca automatica",
        changelog_v07_item4: "Gestione soft_skills null (9 profili senza competenze definite)",
        changelog_v07_item5: "Nuovo stato CTA viola per profili incompleti",
        changelog_v07_item6: "Rimosso mapping_type fallback, sostituito con has_custom_skills",

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
        search_clear: "Clear search",
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
        modal_example1_search: "Addetto alla vendita retail",
        modal_example1_text: "The system finds an exact match in the active offers database. The job is classified as categoria_principale with has_custom_skills: true, meaning it has a specific and verified skill set (Engagement, Emotional Stability, Flexibility, etc.). The user lands directly on the dedicated URL with 74 active offers.",

        modal_example2_badge: "Alias",
        modal_example2_search: "Insegnante scuola dell'infanzia",
        modal_example2_text: "The system recognizes that the user searched for a specific variant of a more generic job. The mapping_type: alias indicates that this entry inherits URL and offer count from the main reference category (categoria_riferimento: insegnante), but maintains its own distinctive soft skills (Problem Solving, Engagement, Communication, Listening, etc.). The user is directed to the \"Teacher\" page containing 1 active offer, while receiving a skills profile calibrated for the specific early childhood role.",

        modal_example3_badge: "Incomplete Profile",
        modal_example3_search: "Data Scientist",
        modal_example3_text: "The system identifies a job present in the skills database but without active offers on the Gi Group site. The mapping_type: profilo_incompleto signals that url: null and numero_offerte: 0. The engine still loads the 8 soft skills associated with the role (Initiative, Problem Solving, Analysis, Innovation, etc.) to complete the user's survey profile. The frontend handles the missing link by showing a \"No active offers at the moment\" message, maintaining the informational value of the skills.",

        modal_example4_badge: "No Match",
        modal_example4_search: "Influencer",
        modal_example4_text: "The input finds no match in the job database. The frontend detects the absence of a match and activates the fallback protocol, loading universal skills (Problem Solving, Reliability, Teamwork Collaboration) to complete the survey anyway, dynamically generating a generic search on the Gi Group site based on the entered term. This prevents the user from hitting a dead-end and ensures experience continuity.",

        modal_extra_title: "Additional Test Cases",

        modal_example5_badge: "Missing Skills",
        modal_example5_search: "Magazziniere",
        modal_example5_text: "The system finds the job among active offers (60 available positions), but the fields has_custom_skills: false and soft_skills: null indicate that no specific skills are mapped in the structure database. The frontend detects the null value and applies the universal skill set for the survey, maintaining the valid URL to real offers.",

        modal_example6_badge: "Double Null",
        modal_example6_search: "Web Marketing Expert",
        modal_example6_text: "Edge case: the job exists in the structure database but with url: null, soft_skills: null and numero_offerte: 0. The frontend handles the double null by showing \"No active offers\" and applying the universal skills fallback at the display level to ensure survey completion.",

        // Status Messages
        status_match: "Role identified: {role} ({type})",
        status_no_match: "No exact match. Activating free search.",
        status_error: "Error loading data. Please try again later.",
        status_no_exact_match: "No exact match. Press Enter to activate free search.",

        // Log Messages
        log_loading: "Loading job titles database...",
        log_loaded_stats: "Database loaded: {total} job titles ({main} main, {alias} aliases, {incomplete} incomplete profiles).",
        log_loaded: "Database loaded: {count} job titles available.",
        log_error: "Error loading database: {error}",
        log_cleared: "Log cleared.",
        log_init: "Beyond Titles v0.7.1 initializing...",
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
        mapping_profilo_incompleto: "Incomplete Profile",

        // Mapping Types (short for suggestions dropdown)
        mapping_short_categoria_principale: "Main",
        mapping_short_alias: "Alias",
        mapping_short_profilo_incompleto: "Incomplete",

        // Profilo Incompleto Messages
        no_offers_available: "No active offers at the moment",
        skills_not_defined: "Skills not yet defined",
        cta_no_offers: "Discover our job offers for you",

        // Log consolidated message
        log_match_found: "Match found - Type: {type} | Soft Skills: {skills} | Offers: {offers}",
        log_match_found_html: "Match found - Type: {type} | Soft Skills: {skills} | Offers: {offers}",

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

        changelog_v071_date: "January 13, 2026",
        changelog_v071_item1: "Added X button to clear search field content",
        changelog_v071_item2: "Button appears automatically when user starts typing",
        changelog_v071_item3: "Clicking the button resets all interface states",

        changelog_v07_date: "January 13, 2026",
        changelog_v07_item1: "Migration to job database v4 with 604 total entries",
        changelog_v07_item2: "New mapping_type: profilo_incompleto (134 jobs without active offers)",
        changelog_v07_item3: "Null URL handling for incomplete profiles with automatic search",
        changelog_v07_item4: "Null soft_skills handling (9 profiles without defined skills)",
        changelog_v07_item5: "New purple CTA state for incomplete profiles",
        changelog_v07_item6: "Removed mapping_type fallback, replaced with has_custom_skills",

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
