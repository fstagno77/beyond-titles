# Decisioni

Architecture Decision Records (ADR) per documentare le scelte tecniche importanti del progetto.

## ADR-001: Vanilla JavaScript senza framework

**Data:** 17 dicembre 2025 | **Stato:** Accettata

### Contesto
Dovendo sviluppare un prototipo rapido per validare il concept di assessment comportamentale per archetipi professionali.

### Decisione
Utilizzare HTML5, CSS3 e JavaScript vanilla (ES6+) senza framework (React, Vue, Angular) e senza build tools.

### Motivazione
- Velocità di prototipazione: nessun setup, nessuna configurazione
- Zero dipendenze: nessun rischio di breaking changes da librerie terze
- Deploy immediato: file statici servibili da qualsiasi web server
- Semplicità di manutenzione per un prototipo con scope limitato

### Conseguenze
- Codice UI più verboso rispetto a un framework component-based
- Gestione stato manuale (no reactive state management)
- Nessun routing client-side (SPA basata su pannelli nascosti/visibili)

---

## ADR-002: Database JSON locale invece di Supabase

**Data:** 17 dicembre 2025 | **Stato:** Accettata

### Contesto
I dati delle mansioni provengono da un file Excel aggiornato periodicamente. Serviva decidere dove e come persistere questi dati.

### Decisione
Utilizzare file JSON statici (`mansioni_database.json`, `survey_archetypes.json`) caricati via Fetch API, invece di un database Supabase.

### Motivazione
- Nessuna dipendenza da servizi esterni per il prototipo
- Aggiornamento semplice: rigenerazione del JSON dal file Excel sorgente
- Performance: dati caricati una volta e filtrati in-memory
- Nessun costo infrastrutturale

### Conseguenze
- Nessuna query SQL o filtro server-side
- Aggiornamenti dati richiedono re-deploy (o sostituzione file)
- Tutti i dati scaricati dal client (dimensione accettabile per un prototipo)
- Migrazione a Supabase prevista nella fase successiva

---

## ADR-004: Scoring single-choice pesato per survey

**Data:** 20 gennaio 2026 | **Stato:** Accettata (sostituisce sistema binario v0.8)

### Contesto
Il sistema iniziale (v0.8) usava un approccio binario PIÙ/MENO per ogni domanda. Risultava poco discriminante e produceva troppi risultati ambigui.

### Decisione
Passare a un sistema **single-choice** con 4 opzioni per domanda, ciascuna mappata su un archetipo diverso, con pesi configurabili per domanda. Il risultato restituisce sempre un **singolo archetipo dominante**. In caso di parità perfetta, il tie-break è deterministico (ordine alfabetico).

### Motivazione
- Maggiore discriminazione tra archetipi
- Pesi configurabili permettono di bilanciare l'importanza delle domande
- Single-choice è più intuitivo per l'utente rispetto al PIÙ/MENO
- Risultato sempre chiaro e univoco (un solo archetipo)
- Tie-break deterministico garantisce risultati riproducibili

### Conseguenze
- Ogni domanda contribuisce a un solo archetipo (non a tutti)
- Necessario bilanciare la distribuzione (5 occorrenze per archetipo su 40 opzioni totali)
- Risultati più polarizzati rispetto al sistema binario

---

## ADR-005: Sistema multi-survey con versionamento

**Data:** 28 gennaio 2026 | **Stato:** Accettata

### Contesto
Dopo la validazione della survey BCB v1.0, sono state testate versioni riformulate (v2.0) e formati diversi (SJT). La v3.5 (Behavioural & Competency-Based) è risultata la versione definitiva.

### Decisione
Ristrutturare `survey_archetypes.json` in formato v3.5 con la sola Behavioural & Competency-Based. Le survey legacy (BCB v1.0, v2.0, SJT v1.0) sono state rimosse dopo la fase di A/B testing.

### Motivazione
- La Behavioural & Competency-Based v3.5 è la versione validata e definitiva
- Semplificazione del codice e dei dati rimuovendo le survey non più necessarie
- Riduzione delle traduzioni e della complessità del sistema
- Protezione password per survey in fase di sviluppo (SJT)

### Conseguenze
- Struttura JSON più complessa (oggetto radice con chiavi per survey)
- UI aggiuntiva (selettore tipo, modale password)
- Persistenza della selezione in localStorage per comodità utente

---

## ADR-006: Internazionalizzazione custom con data attributes

**Data:** 11 gennaio 2026 | **Stato:** Accettata

### Contesto
L'applicazione deve supportare italiano e inglese, con possibilità di aggiungere altre lingue.

### Decisione
Implementare un sistema i18n custom basato su attributi `data-i18n` negli elementi HTML, con un oggetto di traduzioni centralizzato in `i18n.js` e auto-detection della lingua browser.

### Motivazione
- Nessuna dipendenza esterna (coerente con ADR-001)
- Attributi data mantengono il markup pulito
- Auto-detection tramite `navigator.language` per UX immediata
- Persistenza scelta utente in localStorage

### Conseguenze
- Tutte le stringhe devono avere una chiave di traduzione
- Cambio lingua richiede re-render esplicito di tutti gli elementi tradotti
- CustomEvent `languageChanged` come meccanismo di notifica tra moduli

