# Changelog

Log delle modifiche al progetto, organizzato per versione e data.

## v0.14.0 <Badge type="tip" text="corrente" />

**10 febbraio 2026**

- **Wiki multilingua**: aggiunta versione inglese completa della documentazione (11 pagine tradotte)
- **Wiki dark-only**: forzato tema scuro, rimosso toggle chiaro/scuro
- **Language switcher** nella navbar del wiki per passare da Italiano a English
- **Disclaimer AI**: modale informativa alla prima visita della sezione inglese, con checkbox "Don't show again"
- **Link wiki dinamici**: i link Changelog e Wiki nel footer dell'applicazione puntano alla lingua corrente (IT/EN)
- Ricerca localizzata nel wiki (Cerca / Search)

## v0.13.0

**9 febbraio 2026**

- **Survey v3.4**: raffinamenti linguistici su 23 opzioni/stem per massimizzare chiarezza e naturalezza
- Nuovo CTA: **"Inizia il viaggio"** (sostituisce "Inizia il Sondaggio")
- Nuovo testo introduttivo survey: tone of voice narrativo e rassicurante
- Rimosso CSS blend result (non più utilizzato)
- Traduzioni EN aggiornate per tutte le modifiche v3.4
- Wiki aggiornato con tabella correzioni v3.3 → v3.4

## v0.12.2

**9 febbraio 2026**

- Rinominata survey da "Human Skills Survey" a **Behavioural & Competency-Based** ovunque
- **Pulizia survey legacy**: rimosse BCB v1.0, BCB v2.0, SJT v1.0
- Rimosso dropdown "Tipo di sondaggio", aggiunto label statico versione survey
- Rimosso sistema password SJT e traduzioni survey obsolete
- Aggiunta pagina wiki Behavioural & Competency-Based
- Aggiunto link **Wiki** nel footer
- Aggiunto logo **SubSense** nella sidebar del wiki

## v0.12.0

**8 febbraio 2026**

- Aggiunta survey **Behavioural & Competency-Based v3.0** con 10 domande riformulate
- Traduzioni complete IT/EN
- Impostata come **survey di default**
- Aggiornato sottotitolo intro survey ("Cosa ti rende unico?")
- Link changelog nel footer ora punta alla **documentazione wiki** (VitePress)

## v0.9.1

**21 gennaio 2026**

- **i18n completo per survey**: tutte le domande e risposte tradotte in IT/EN
- Nomi archetipi tradotti nella tabella punteggi del System Log
- Messaggi System Log tradotti (avvio, completamento, simulazione survey)
- Affinamento logica di rilevamento lingua browser

## v0.9.0

**20 gennaio 2026**

- **Redesign scoring**: da sistema binario PIÙ/MENO a **single-choice** (una risposta per domanda)
- 10 domande comportamentali con mappatura bilanciata (5 occorrenze per archetipo)
- Risultato sempre **netto**: un singolo archetipo dominante
- Tie-break deterministico per ordine alfabetico in caso di parità
- Rimosso tie-break speciale Q10 (ora domanda standard)
- Indice di confidenza arrotondato a multipli del 5%
- Re-render risultati survey al cambio lingua
- Rebranding intro survey con sottotitolo Beyond Titles

## v0.8.0

**19 gennaio 2026**

- Introdotto sistema **Survey Archetipi Professionali** con 10 domande comportamentali
- Scoring MORE/LESS (binario) con singolo archetipo dominante
- Definiti **8 archetipi professionali**: Connettore, Stratega, Pragmatico, Collaboratore, Risolutore, Pioniere, Capitano, Artigiano
- Modale **Suggerimenti** per simulazione rapida risultati
- **Tabella punteggi live** nel System Activity Log con barre grafiche
- Modale preset con griglia 8 archetipi

## v0.7.1

**13 gennaio 2026**

- Aggiunto **pulsante Clear** (×) nel campo di ricerca
- Reset completo stato interfaccia al click

## v0.7.0

**13 gennaio 2026**

- Migrazione a **Database v4** con 604 mansioni totali (+159 rispetto a v0.5)
- Nuovo mapping type: **profilo_incompleto** per mansioni senza offerte attive (134 voci)
- Gestione URL null: fallback automatico a ricerca generica
- Gestione soft_skills null: 9 mansioni senza competenze definite
- Nuovo stato CTA **viola** per profili incompleti
- Aggiunto flag `has_custom_skills` nello schema database
- Aggiornamento label CTA

## v0.6.3

**12 gennaio 2026**

- Refactoring struttura header
- Changelog **multilingua** (IT/EN)
- Fix allineamento language toggle

## v0.6.2

**12 gennaio 2026**

- Fix allineamento header/footer
- **Centralizzazione** gestione header e footer in `components.js`

## v0.6.0

**11 gennaio 2026**

- Implementato sistema **i18n completo** (Italiano/Inglese)
- **Auto-detection** lingua browser (`navigator.language`)
- Toggle manuale lingua con persistenza in localStorage
- Traduzione completa di tutte le stringhe UI

## v0.5.0

**10 gennaio 2026**

- Nuovo `mansioni_database.json` con **445 posizioni**
- Sistema di mapping a **3 livelli**: Categoria Principale → Alias → Fallback
- **Integrazione soft skills**: competenze trasversali lette dal database (non generate)
- **URL diretti**: link alle offerte letti dal database (non costruiti)
- Statistiche database mostrate al caricamento

## v0.4.0

**17 dicembre 2025**

- Aggiunto **conteggio offerte di lavoro** per posizione nel database
- CTA dinamici: "Abbiamo XX offerte di lavoro per te"
- Struttura JSON aggiornata con oggetti `{nome, jobOffers}`

## v0.3.0

**17 dicembre 2025**

- **Scenario 3** (No Match): ricerca libera con gestione tasto Enter
- Stato UI **arancione** per nessuna corrispondenza
- Generazione URL di ricerca con parametro `?job=`
- Logo **Beyond Titles** nell'header

## v0.2.0

**17 dicembre 2025**

- **Scenario 1** (Unique Match): deep link alle offerte di lavoro
- Pulsante **CTA** con link diretto
- **System Activity Log**: pannello debug con log in tempo reale
- Tipi di log: INPUT, LOGIC, ROUTING, UI
- Layout a **due colonne** responsive (hero + log)

## v0.1.0

**17 dicembre 2025**

- **MVP iniziale**: struttura progetto modulare (HTML/CSS/JS separati)
- Database JSON esterno per mansioni
- Caricamento asincrono dati via Fetch API
- **Autocomplete** con evidenziazione e navigazione da tastiera
- Favicon
