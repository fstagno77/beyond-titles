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
        suggestions_link: "Simulazioni",

        // CTA Button
        cta_default: "Vedi Offerte",
        cta_active_single: "Abbiamo 1 offerta di lavoro per te",
        cta_active_multiple: "Abbiamo {count} offerte di lavoro per te",
        cta_warning: "Scopri tutte le nostre offerte di lavoro",

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
        log_init: "Beyond Titles v{version} initializing...",
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
        cta_no_offers: "Scopri tutte le nostre offerte di lavoro",

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

        changelog_v0190_date: "27 Febbraio 2026",
        changelog_v0190_item1: "Survey v4.1: revisione wording italiano con Gi Group (8 modifiche testuali)",
        changelog_v0190_item2: "Survey v4.1: riscrittura completa traduzione inglese con revisione Gi Group",
        changelog_v0190_item3: "Aggiornamento wiki IT/EN: versione survey v4.1, tabella evoluzione",

        changelog_v0180_date: "23 Febbraio 2026",
        changelog_v0180_item1: "Pulizia i18n: rimosse chiavi legacy survey_q1–q10 (IT/EN)",
        changelog_v0180_item2: "Standardizzazione British English per tutte le stringhe EN",
        changelog_v0180_item3: "Correzioni traduzioni EN: Q7 e Q9 riformulate per naturalezza",
        changelog_v0180_item4: "Aggiornamento wiki IT/EN: tie-break, versione, architettura",

        changelog_v0110_date: "29 Gennaio 2026",
        changelog_v0110_item1: "Nuovo sondaggio Behavioural & Competency-Based v2.0 con 10 domande riformulate",
        changelog_v0110_item2: "Traduzioni complete BCB v2.0 italiano e inglese",
        changelog_v0110_item3: "Supporto multi-versione per survey BCB (v1.0 e v2.0)",

        changelog_v0100_date: "28 Gennaio 2026",
        changelog_v0100_item1: "Sistema survey Behavioural & Competency-Based v3.3",
        changelog_v0100_item2: "10 domande Behavioural & Competency-Based",
        changelog_v0100_item3: "Scoring pesato per archetipo",
        changelog_v0100_item4: "Persistenza selezione survey in localStorage",
        changelog_v0100_item5: "Traduzioni complete italiano e inglese",
        changelog_v0100_item6: "Ristrutturazione survey_archetypes.json a formato v3.3",

        changelog_v091_date: "21 Gennaio 2026",
        changelog_v091_item1: "Traduzioni complete sondaggio in inglese (domande e risposte)",
        changelog_v091_item2: "Traduzione nomi archetipi nella tabella punteggi del System Log",
        changelog_v091_item3: "Traduzione messaggi System Log (avvio, completamento, simulazione)",
        changelog_v091_item4: "Rilevamento lingua browser: italiano per 'it', inglese per tutte le altre lingue",

        changelog_v09_date: "20 Gennaio 2026",
        changelog_v09_item1: "Nuovo sistema di scoring single-choice: una selezione per domanda",
        changelog_v09_item2: "10 nuove domande comportamentali con mapping bilanciato (5 occorrenze per archetipo)",
        changelog_v09_item3: "Risultato sempre netto: un singolo archetipo dominante",
        changelog_v09_item4: "Tie-break deterministico in caso di parità",
        changelog_v09_item5: "Rimossa la logica tie-break Q10, ora domanda standard",
        changelog_v09_item6: "Indice di confidenza arrotondato a multipli di 5%",

        changelog_v08_date: "19 Gennaio 2026",
        changelog_v08_item1: "Sondaggio Archetipi Professionali con 10 domande comportamentali",
        changelog_v08_item2: "Sistema di scoring PIÙ/MENO con singolo archetipo dominante",
        changelog_v08_item3: "8 archetipi con profili e soft skill distintive",
        changelog_v08_item4: "Modale Suggerimenti per simulare risultati sondaggio",
        changelog_v08_item5: "Tabella punteggi live nel System Log durante il sondaggio",

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
        changelog_v01_item9: "Accessibilità migliorata con attributi ARIA",

        // Segmented Control
        tab_ruolo: "Ruolo",
        tab_sondaggio: "Sondaggio",

        // Survey
        survey_title: "Scopri il tuo profilo Beyond Titles",
        survey_subtitle: "Attraverso 10 situazioni che possono capitare a tutti nel lavoro, nello studio, nella vita quotidiana, scopri quale degli 8 profili #BeyondTitles può raccontare una storia nuova: la tua.<br><br>Una storia fatta di valori, competenze trasversali e umane che spesso non si trovano dentro un curriculum vitae.<br><br>Per ognuna delle situazioni proposte, scegli come reagiresti.<br><br>L'importante è:<ul><li>Rispondere senza pensarci troppo</li><li>Sapere che non ci sono risposte giuste o sbagliate</li><li>Sapere che tutto resta anonimo</li></ul>Non importa se hai o non hai ancora esperienza nel mondo del lavoro, immagina di trovarti in quelle situazioni e rispondi seguendo il tuo istinto.<br><br><strong>Ci vogliono solo 5 minuti.</strong>",
        survey_start: "Inizia",
        survey_progress: "Domanda {current} di {total}",
        survey_instruction: "Seleziona l'opzione più vicina al tuo modo di agire",
        survey_prev: "Indietro",
        survey_next: "Avanti",
        survey_finish: "Scopri il Risultato",
        survey_restart: "Rifai il Test",
        survey_result_primary: "Il Tuo Archetipo",

        // Survey Presets Modal
        survey_presets_link: "Simulazioni",
        survey_presets_modal_title: "Simula Risultato",
        survey_presets_description: "Seleziona un archetipo per simulare il risultato del sondaggio.",
        survey_presets_tie_toggle: "Simula pareggio",

        // Archetypes
        archetype_connettore_name: "Il Connettore",
        archetype_connettore_claim: "Costruisce ponti tra le persone",
        archetype_connettore_profile: "Eccelle nelle relazioni interpersonali e nella comunicazione. Sa ascoltare attivamente, coinvolgere gli interlocutori e mettere il cliente al centro. È il punto di riferimento per creare connessioni autentiche e durature tra le persone.",
        archetype_connettore_skills: "Comunicazione, Ascolto, Orientamento al cliente, Coinvolgimento, Standing",

        archetype_stratega_name: "Lo Stratega",
        archetype_stratega_claim: "Vede il quadro completo",
        archetype_stratega_profile: "Pianifica e organizza con metodo, analizza i dati con attenzione e mantiene il focus sui risultati. Dove altri vedono caos, lui vede pattern da ottimizzare e obiettivi da raggiungere.",
        archetype_stratega_skills: "Pianificazione e organizzazione, Analisi, Orientamento al risultato, Sintesi",

        archetype_pragmatico_name: "Il Pragmatico",
        archetype_pragmatico_claim: "Dalle idee ai fatti",
        archetype_pragmatico_profile: "Trasforma i piani in azione concreta con scrupolosità e metodo. È affidabile, organizzato e orientato all'execution. Non si perde in teorie: porta a casa quello che serve, quando serve.",
        archetype_pragmatico_skills: "Scrupolosità, Pianificazione e organizzazione, Affidabilità, Concretezza, Execution",

        archetype_collaboratore_name: "Il Collaboratore",
        archetype_collaboratore_claim: "Il valore del noi",
        archetype_collaboratore_profile: "Mette il team al centro di tutto. Sa adattarsi, lavorare con cura e costruire senso di appartenenza. Crede che i risultati migliori nascano dal lavoro insieme e si impegna con scrupolosità per il bene comune.",
        archetype_collaboratore_skills: "Collaborazione e Teamwork, Flessibilità, Scrupolosità, Senso di appartenenza",

        archetype_risolutore_name: "Il Risolutore",
        archetype_risolutore_claim: "Ogni problema ha una soluzione",
        archetype_risolutore_profile: "Affronta i problemi con calma e determinazione, trovando soluzioni pratiche anche sotto pressione. Mantiene la lucidità nelle situazioni difficili e trasforma gli ostacoli in opportunità con approccio concreto e operativo.",
        archetype_risolutore_skills: "Problem Solving, Concretezza, Stabilità emotiva, Flessibilità operativa",

        archetype_pioniere_name: "Il Pioniere",
        archetype_pioniere_claim: "Apre nuove strade",
        archetype_pioniere_profile: "Genera nuove idee e sfida lo status quo. Prende l'iniziativa per esplorare approcci innovativi e non si accontenta delle soluzioni convenzionali. Vede possibilità dove altri vedono ostacoli.",
        archetype_pioniere_skills: "Flessibilità, Iniziativa, Innovazione, Problem Setting",

        archetype_capitano_name: "Il Capitano",
        archetype_capitano_claim: "Guida con l'esempio",
        archetype_capitano_profile: "Sa prendere decisioni e guidare il team con chiarezza. Prende l'iniziativa, negozia con efficacia e sa influenzare positivamente gli altri. Il suo esempio ispira il team a dare il meglio.",
        archetype_capitano_skills: "Decisionalità, Iniziativa, Negoziazione, Guida e Team Leadership, Influenza",

        archetype_artigiano_name: "L'Artigiano",
        archetype_artigiano_claim: "La perfezione nei dettagli",
        archetype_artigiano_profile: "Lavora con precisione e cura artigianale, prestando attenzione a ogni dettaglio. Possiede sensibilità tecnica e capacità di visualizzazione che gli permettono di eccellere in attività che richiedono maestria e precisione.",
        archetype_artigiano_skills: "Scrupolosità, Visualizzazione spaziale, Autonomia operativa, Sensibilità manuale",

        // System Log Survey Messages
        log_survey_started: "Sondaggio iniziato - 10 domande (single-choice)",
        log_survey_completed: "Sondaggio completato!",
        log_survey_back_to_intro: "Tornato alla schermata iniziale",
        log_survey_simulation: "Simulazione: {name}",
        log_scores_title: "Score Archetipi",
        log_data_loaded: "Loaded survey_archetypes.json v4.1 - {questions} domande, {archetypes} archetipi ({list})",

        // Survey Selector
        survey_selector_label: "Tipo di sondaggio",
        survey_bcb_v3_name: "Behavioural & Competency-Based",
        survey_bcb_v3_short: "Behavioural & Competency-Based v4.1",

        // Behavioural & Competency-Based v4.1 Questions
        bcb3_q1_stem: "Hai una nuova attività in programma, ma poche indicazioni. Qual è la prima cosa che fai?",
        bcb3_q1_opt_a: "Mi confronto con qualcuno per capire cosa è importante e cosa viene prima.",
        bcb3_q1_opt_b: "Raccolgo le informazioni disponibili e mi soffermo sui dettagli.",
        bcb3_q1_opt_c: "Stabilisco una direzione chiara e parto.",
        bcb3_q1_opt_d: "Parto dal primo passo che produce un risultato tangibile.",

        bcb3_q2_stem: "Un imprevisto cambia i tuoi piani. Come reagisci?",
        bcb3_q2_opt_a: "Trovo una soluzione pratica e riparto.",
        bcb3_q2_opt_b: "Sperimento un modo diverso e mi adatto rapidamente.",
        bcb3_q2_opt_c: "Mi confronto con qualcuno e decidiamo insieme come procedere.",
        bcb3_q2_opt_d: "Controllo con attenzione cosa è cambiato, un passo alla volta.",

        bcb3_q3_stem: "Devi preparare qualcosa di importante anche per altre persone. Come procedi?",
        bcb3_q3_opt_a: "Mi assicuro che ogni dettaglio sia fatto bene.",
        bcb3_q3_opt_b: "Coinvolgo gli altri per costruire insieme il modo migliore di farlo.",
        bcb3_q3_opt_c: "Individuo il modo più concreto per portarlo a termine.",
        bcb3_q3_opt_d: "Introduco un miglioramento che renda il risultato più utile.",

        bcb3_q4_stem: "Hai svariati compiti da portare a termine e poco tempo. Da dove inizi?",
        bcb3_q4_opt_a: "Decido cosa affrontare per primo e mi metto all'opera.",
        bcb3_q4_opt_b: "Faccio un passo indietro, analizzo la situazione nel suo insieme e definisco le priorità.",
        bcb3_q4_opt_c: "Parto da ciò che posso chiudere subito e vado avanti.",
        bcb3_q4_opt_d: "Sblocco ciò che sta fermando tutto.",

        bcb3_q5_stem: "All'improvviso cambia il modo in cui hai sempre svolto un'attività. Come reagisci?",
        bcb3_q5_opt_a: "Testo con prontezza il nuovo metodo e imparo facendolo.",
        bcb3_q5_opt_b: "Capisco come funziona il nuovo sistema, poi mi organizzo di conseguenza.",
        bcb3_q5_opt_c: "Mi confronto con gli altri per delineare cosa funziona meglio.",
        bcb3_q5_opt_d: "Seguo le nuove indicazioni con attenzione e controllo che siano corrette.",

        bcb3_q6_stem: "Ti accorgi che una procedura può essere migliorata. Cosa fai?",
        bcb3_q6_opt_a: "Faccio una piccola prova per vedere se funziona.",
        bcb3_q6_opt_b: "Scelgo pochi passi chiari e li applico immediatamente.",
        bcb3_q6_opt_c: "Raccolgo i punti di vista di chi è coinvolto per trovare la soluzione migliore.",
        bcb3_q6_opt_d: "Valuto vantaggi e possibili rischi prima di agire.",

        bcb3_q7_stem: "Collaborando con un'altra persona nasce un fraintendimento e la tensione aumenta. Come ti comporti?",
        bcb3_q7_opt_a: "Ascolto con attenzione, riformulo quanto è stato detto e aiuto a riportare calma e rispetto.",
        bcb3_q7_opt_b: "Cerco un punto in comune e costruisco qualcosa che funzioni per entrambi.",
        bcb3_q7_opt_c: "Riporto l'attenzione sull'obiettivo comune e indico il prossimo passo.",
        bcb3_q7_opt_d: "Propongo un'azione pratica da adottare e agisco immediatamente.",

        bcb3_q8_stem: "In un lavoro di squadra manca chiarezza e i tempi stringono. Come intervieni?",
        bcb3_q8_opt_a: "Condivido le informazioni per allineare tutti.",
        bcb3_q8_opt_b: "Aiuto il gruppo a coordinarsi e a dividersi i compiti.",
        bcb3_q8_opt_c: "Scelgo come procedere e propongo azioni precise.",
        bcb3_q8_opt_d: "Mi occupo subito di ciò che non può aspettare.",

        bcb3_q9_stem: "Noti un problema prima che diventi evidente. Come intervieni?",
        bcb3_q9_opt_a: "Lo sistemo con cura, occupandomi con attenzione dei dettagli.",
        bcb3_q9_opt_b: "Punto sulla soluzione più efficace, anche se richiede più tempo.",
        bcb3_q9_opt_c: "Intervengo rapidamente per evitare conseguenze.",
        bcb3_q9_opt_d: "Provo un'alternativa che possa funzionare meglio.",

        bcb3_q10_stem: "Una persona ti ringrazia per il tuo lavoro. Cosa ti soddisfa di più?",
        bcb3_q10_opt_a: "Aver raggiunto con gli altri un risultato comune.",
        bcb3_q10_opt_b: "Aver raggiunto l'obiettivo che mi ero prefissato.",
        bcb3_q10_opt_c: "Aver portato a termine la responsabilità che avevo.",
        bcb3_q10_opt_d: "Aver risolto un problema reale.",

        // Tiebreaker Q11
        bcb3_q11_stem: "Quando prendi una decisione importante, cosa ti guida di più?",
        bcb3_q11_opt_a: "L'obiettivo finale che voglio raggiungere",
        bcb3_q11_opt_b: "Il risultato concreto e immediato",
        bcb3_q11_opt_c: "La qualità e la precisione del processo",
        bcb3_q11_opt_d: "Il coinvolgimento e il contributo delle persone",
        survey_tiebreaker_title: "Domanda aggiuntiva",
        survey_tiebreaker_subtitle: "Due profili hanno ottenuto lo stesso punteggio. Rispondi a quest'ultima domanda per determinare il tuo archetipo."
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
        suggestions_link: "Simulations",

        // CTA Button
        cta_default: "View Jobs",
        cta_active_single: "We have 1 job offer for you",
        cta_active_multiple: "We have {count} job offers for you",
        cta_warning: "Discover all our job offers",

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
        log_init: "Beyond Titles v{version} initializing...",
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
        cta_no_offers: "Discover all our job offers",

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

        changelog_v0190_date: "February 27, 2026",
        changelog_v0190_item1: "Survey v4.1: Italian wording review with Gi Group (8 text changes)",
        changelog_v0190_item2: "Survey v4.1: complete English translation rewrite with Gi Group review",
        changelog_v0190_item3: "Wiki update (IT/EN): survey version v4.1, evolution table",

        changelog_v0180_date: "February 23, 2026",
        changelog_v0180_item1: "i18n cleanup: removed legacy survey_q1–q10 keys (IT/EN)",
        changelog_v0180_item2: "British English standardisation across all EN strings",
        changelog_v0180_item3: "EN translation fixes: Q7 and Q9 stems reworded for naturalness",
        changelog_v0180_item4: "Wiki update (IT/EN): tie-break, version, architecture",

        changelog_v0110_date: "January 29, 2026",
        changelog_v0110_item1: "New Behavioural & Competency-Based v2.0 survey with 10 reformulated questions",
        changelog_v0110_item2: "Complete BCB v2.0 translations in Italian and English",
        changelog_v0110_item3: "Multi-version support for BCB surveys (v1.0 and v2.0)",

        changelog_v0100_date: "January 28, 2026",
        changelog_v0100_item1: "Behavioural & Competency-Based v3.3 system",
        changelog_v0100_item2: "10 Behavioural & Competency-Based questions",
        changelog_v0100_item3: "Weighted scoring per archetype",
        changelog_v0100_item4: "Survey selection persistence in localStorage",
        changelog_v0100_item5: "Complete Italian and English translations",
        changelog_v0100_item6: "Restructured survey_archetypes.json to v3.3 format",

        changelog_v091_date: "January 21, 2026",
        changelog_v091_item1: "Complete survey translations in English (questions and answers)",
        changelog_v091_item2: "Translated archetype names in System Log scores table",
        changelog_v091_item3: "Translated System Log messages (start, completion, simulation)",
        changelog_v091_item4: "Browser language detection: Italian for 'it', English for all other languages",

        changelog_v09_date: "January 20, 2026",
        changelog_v09_item1: "New single-choice scoring system: one selection per question",
        changelog_v09_item2: "10 new behavioral questions with balanced mapping (5 occurrences per archetype)",
        changelog_v09_item3: "Always single dominant archetype result",
        changelog_v09_item4: "Deterministic alphabetical tie-breaking for score ties",
        changelog_v09_item5: "Removed Q10 tie-break logic, now standard question",
        changelog_v09_item6: "Confidence index rounded to multiples of 5%",

        changelog_v08_date: "January 19, 2026",
        changelog_v08_item1: "Professional Archetypes Survey with 10 behavioral questions",
        changelog_v08_item2: "MOST/LEAST scoring system with single dominant archetype",
        changelog_v08_item3: "8 archetypes with profiles and distinctive soft skills",
        changelog_v08_item4: "Suggestions modal to simulate survey results",
        changelog_v08_item5: "Live scores table in System Log during survey",

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
        changelog_v01_item9: "Improved accessibility with ARIA attributes",

        // Segmented Control
        tab_ruolo: "Role",
        tab_sondaggio: "Survey",

        // Survey
        survey_title: "Discover your Beyond Titles profile",
        survey_subtitle: "Through 10 situations that can happen to anyone at work, school, or in everyday life, discover which of the 8 #BeyondTitles profiles can tell a new story: yours.<br><br>A story made of values, soft skills and human skills that are often missing from a CV.<br><br>For each situation, choose how you would react.<br><br>What matters is:<ul><li>Answer without overthinking</li><li>There are no right or wrong answers</li><li>Everything stays anonymous</li></ul>It doesn't matter if you have work experience or not — imagine yourself in those situations and follow your instinct.<br><br><strong>It only takes 5 minutes.</strong>",
        survey_start: "Start",
        survey_progress: "Question {current} of {total}",
        survey_instruction: "Select the option closest to how you act",
        survey_prev: "Back",
        survey_next: "Next",
        survey_finish: "See Results",
        survey_restart: "Retake Test",
        survey_result_primary: "Your Archetype",

        // Survey Presets Modal
        survey_presets_link: "Simulations",
        survey_presets_modal_title: "Simulate Result",
        survey_presets_description: "Select an archetype to simulate the survey result.",
        survey_presets_tie_toggle: "Simulate tie",

        // Archetypes
        archetype_connettore_name: "The Connector",
        archetype_connettore_claim: "Builds bridges between people",
        archetype_connettore_profile: "Excels in interpersonal relationships and communication. Knows how to listen actively, engage stakeholders, and put the customer at the centre. Is the reference point for creating authentic and lasting connections between people.",
        archetype_connettore_skills: "Communication, Listening, Customer Focus, Engagement, Presence",

        archetype_stratega_name: "The Strategist",
        archetype_stratega_claim: "Sees the big picture",
        archetype_stratega_profile: "Plans and organises methodically, analyses data carefully, and maintains focus on results. Where others see chaos, they see patterns to optimise and goals to achieve.",
        archetype_stratega_skills: "Planning and Organization, Analysis, Results Orientation, Synthesis",

        archetype_pragmatico_name: "The Pragmatist",
        archetype_pragmatico_claim: "From ideas to action",
        archetype_pragmatico_profile: "Transforms plans into concrete action with diligence and method. Is reliable, organised, and execution-oriented. Doesn't get lost in theories: delivers what's needed, when it's needed.",
        archetype_pragmatico_skills: "Diligence, Planning and Organization, Reliability, Concreteness, Execution",

        archetype_collaboratore_name: "The Collaborator",
        archetype_collaboratore_claim: "The value of us",
        archetype_collaboratore_profile: "Puts the team at the centre of everything. Knows how to adapt, work with care, and build a sense of belonging. Believes that the best results come from working together and commits diligently for the common good.",
        archetype_collaboratore_skills: "Collaboration and Teamwork, Flexibility, Diligence, Sense of Belonging",

        archetype_risolutore_name: "The Problem Solver",
        archetype_risolutore_claim: "Every problem has a solution",
        archetype_risolutore_profile: "Faces problems with calm and determination, finding practical solutions even under pressure. Maintains clarity in difficult situations and transforms obstacles into opportunities with a concrete and operational approach.",
        archetype_risolutore_skills: "Problem Solving, Concreteness, Emotional Stability, Operational Flexibility",

        archetype_pioniere_name: "The Pioneer",
        archetype_pioniere_claim: "Opens new paths",
        archetype_pioniere_profile: "Generates new ideas and challenges the status quo. Takes initiative to explore innovative approaches and is not satisfied with conventional solutions. Sees possibilities where others see obstacles.",
        archetype_pioniere_skills: "Flexibility, Initiative, Innovation, Problem Setting",

        archetype_capitano_name: "The Captain",
        archetype_capitano_claim: "Leads by example",
        archetype_capitano_profile: "Knows how to make decisions and guide the team with clarity. Takes initiative, negotiates effectively, and can positively influence others. Their example inspires the team to give their best.",
        archetype_capitano_skills: "Decision-Making, Initiative, Negotiation, Team Leadership, Influence",

        archetype_artigiano_name: "The Craftsman",
        archetype_artigiano_claim: "Perfection in details",
        archetype_artigiano_profile: "Works with precision and craftsmanship, paying attention to every detail. Possesses technical sensitivity and visualization skills that allow them to excel in activities requiring mastery and precision.",
        archetype_artigiano_skills: "Diligence, Spatial Visualization, Operational Autonomy, Manual Sensitivity",

        // System Log Survey Messages
        log_survey_started: "Survey started - 10 questions (single-choice)",
        log_survey_completed: "Survey completed!",
        log_survey_back_to_intro: "Returned to home screen",
        log_survey_simulation: "Simulation: {name}",
        log_scores_title: "Archetype Scores",
        log_data_loaded: "Loaded survey_archetypes.json v4.1 - {questions} questions, {archetypes} archetypes ({list})",

        // Survey Selector
        survey_selector_label: "Survey type",
        survey_bcb_v3_name: "Behavioural & Competency-Based",
        survey_bcb_v3_short: "Behavioural & Competency-Based v4.1",

        // Behavioural & Competency-Based v4.1 Questions
        bcb3_q1_stem: "You have a new task but very little guidance. What do you do first?",
        bcb3_q1_opt_a: "I speak to someone to understand what matters most and what should come first.",
        bcb3_q1_opt_b: "I gather the available information and review the details thoroughly.",
        bcb3_q1_opt_c: "I set a clear direction and get started.",
        bcb3_q1_opt_d: "I begin with the first step that will deliver a tangible result.",

        bcb3_q2_stem: "Something unexpected disrupts your plans. How do you respond?",
        bcb3_q2_opt_a: "I find a practical fix and carry on.",
        bcb3_q2_opt_b: "I try a different approach and adapt quickly.",
        bcb3_q2_opt_c: "I speak to someone and decide together how to proceed.",
        bcb3_q2_opt_d: "I assess what has changed, step by step.",

        bcb3_q3_stem: "You need to prepare something important that affects other people. How do you approach it?",
        bcb3_q3_opt_a: "I make sure every detail is handled properly.",
        bcb3_q3_opt_b: "I involve others to shape the best way forward together.",
        bcb3_q3_opt_c: "I identify the most efficient way to get it done.",
        bcb3_q3_opt_d: "I introduce an improvement that strengthens the outcome.",

        bcb3_q4_stem: "You have several tasks to complete and limited time. Where do you begin?",
        bcb3_q4_opt_a: "I decide what to tackle first and get to work.",
        bcb3_q4_opt_b: "I step back, assess the bigger picture, and set priorities.",
        bcb3_q4_opt_c: "I start with something I can complete quickly, then move on.",
        bcb3_q4_opt_d: "I remove the blocker that's holding everything up.",

        bcb3_q5_stem: "Suddenly, the way you've always done something changes. What's your reaction?",
        bcb3_q5_opt_a: "I test the new method straight away and learn as I go.",
        bcb3_q5_opt_b: "I make sure I understand how it works, then organise myself accordingly.",
        bcb3_q5_opt_c: "I speak with others to clarify what works best.",
        bcb3_q5_opt_d: "I carefully follow the new guidance and ensure it is applied correctly.",

        bcb3_q6_stem: "You notice a process could be improved. What happens next?",
        bcb3_q6_opt_a: "I run a small trial to see if it works.",
        bcb3_q6_opt_b: "I define a few clear steps and put them into practice immediately.",
        bcb3_q6_opt_c: "I gather input from those involved to find the best way forward.",
        bcb3_q6_opt_d: "I consider the benefits and risks before deciding.",

        bcb3_q7_stem: "While working with someone, a misunderstanding arises and tension increases. How do you handle it?",
        bcb3_q7_opt_a: "I listen closely, rephrase what's been said, and help restore calm.",
        bcb3_q7_opt_b: "I look for common ground and move towards an outcome that works for both of us.",
        bcb3_q7_opt_c: "I refocus attention on the shared goal and outline the next action.",
        bcb3_q7_opt_d: "I suggest a specific move and act on it straight away.",

        bcb3_q8_stem: "In a team setting, clarity is missing and time is tight. How do you step in?",
        bcb3_q8_opt_a: "I share information so everyone is aligned.",
        bcb3_q8_opt_b: "I help the group coordinate and divide responsibilities.",
        bcb3_q8_opt_c: "I propose a way forward and suggest specific actions.",
        bcb3_q8_opt_d: "I take care of what cannot wait.",

        bcb3_q9_stem: "You notice a problem before it becomes obvious. How do you deal with it?",
        bcb3_q9_opt_a: "I resolve it with precision, paying close attention to detail.",
        bcb3_q9_opt_b: "I aim for the most effective solution, even if it takes longer.",
        bcb3_q9_opt_c: "I act quickly to prevent it from escalating.",
        bcb3_q9_opt_d: "I try an alternative option that may work better.",

        bcb3_q10_stem: "Someone thanks you for your work. What gives you the greatest satisfaction?",
        bcb3_q10_opt_a: "Achieving a shared result with others.",
        bcb3_q10_opt_b: "Reaching the goal I set for myself.",
        bcb3_q10_opt_c: "Fulfilling the responsibility entrusted to me.",
        bcb3_q10_opt_d: "Solving a real problem.",

        // Tiebreaker Q11
        bcb3_q11_stem: "You're facing an important decision. What guides you most?",
        bcb3_q11_opt_a: "The outcome I ultimately want to achieve.",
        bcb3_q11_opt_b: "The immediate, concrete result.",
        bcb3_q11_opt_c: "The quality and rigour of the process.",
        bcb3_q11_opt_d: "The involvement and contribution of others.",
        survey_tiebreaker_title: "Additional question",
        survey_tiebreaker_subtitle: "Two profiles scored equally. Answer this last question to determine your archetype."
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
