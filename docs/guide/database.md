# Database

Beyond Titles utilizza file JSON locali come database, caricati via Fetch API all'avvio dell'applicazione. Non è presente un backend né un database relazionale.

::: warning Nota su Supabase
Nonostante il progetto sia pensato per integrarsi con Supabase nella fase successiva al POC, la versione attuale non utilizza Supabase. Tutti i dati sono serviti da file JSON statici.
:::

## Mansioni Database

**File:** `data/mansioni_database.json`

### Metadati

| Campo | Valore |
|---|---|
| Versione | 3.0.0 |
| Totale voci | 604 |
| Ultimo aggiornamento | 2026-02-04 |
| Sorgente | `mansioni-softskills-dude-20260204.xlsx` |

### Schema Entry

```json
{
  "nome": "string",
  "id": "string",
  "numero_offerte": number,
  "url": "string | null",
  "soft_skills": ["string"] | null,
  "mapping_type": "categoria_principale" | "alias" | "profilo_incompleto",
  "has_custom_skills": boolean
}
```

| Campo | Descrizione |
|---|---|
| `nome` | Nome della mansione (titolo canonico) |
| `id` | Slug (lowercase, trattini) |
| `numero_offerte` | Numero di offerte attive su gigroup.it |
| `url` | URL diretto alle offerte (null per profili incompleti) |
| `soft_skills` | Array di competenze trasversali (null se non definite) |
| `mapping_type` | Tipo di corrispondenza nel sistema |
| `has_custom_skills` | Se ha competenze personalizzate nel database sorgente |

### Tipi di Mapping

| Tipo | Conteggio | Descrizione |
|---|---|---|
| `categoria_principale` | 445 | Match diretto con offerte attive |
| `alias` | 25 | Nome alternativo, eredita URL dalla categoria principale |
| `profilo_incompleto` | 134 | Presente nel DB competenze ma senza offerte attive |

### Distribuzione Soft Skills

- **277** categorie principali con skills definite
- **168** categorie principali senza skills
- **125** profili incompleti con skills
- **9** profili incompleti senza skills
- **35** soft skills uniche nel sistema

### Soft Skills Complete

Affidabilità, Analisi, Ascolto, Autonomia operativa, Coinvolgimento, Collaborazione Teamwork, Comunicazione, Concretezza, Decisionalità, Flessibilità / Pensare per alternative, Gestione dello stress, Guida e Team Leadership, Influenza, Iniziativa, Innovazione, Negoziazione, Orientamento al cliente, Orientamento al risultato, Pianificazione e organizzazione, Problem Solving, Scrupolosità, Sensibilità manuale, Senso di appartenenza, Stabilità emotiva, Standing, Visualizzazione spaziale.

## Survey Database

**File:** `data/survey_archetypes.json`

### Metadati

| Campo | Valore |
|---|---|
| Versione | v3.4 |
| Formato | Behavioural & Competency-Based |
| Domande | 10 |
| Opzioni per domanda | 4 |
| Scoring | Single-choice pesato |

### Survey

| ID | Nome | Accesso |
|---|---|---|
| `bcb_v3` | Behavioural & Competency-Based v3.4 | Libero (default) |

### 8 Archetipi Professionali

| Archetipo | Colore | Claim | Soft Skills |
|---|---|---|---|
| **Connettore** | `#1abc9c` | Costruisce ponti tra le persone | Comunicazione, Ascolto, Orientamento al cliente, Coinvolgimento, Standing |
| **Stratega** | `#3498db` | Vede il quadro d'insieme | Pianificazione e organizzazione, Analisi, Orientamento al risultato, Sintesi |
| **Pragmatico** | `#e74c3c` | Dalle idee all'azione | Scrupolosità, Pianificazione e organizzazione, Affidabilità, Concretezza, Execution |
| **Collaboratore** | `#2ecc71` | Il valore del noi | Collaborazione e Teamwork, Flessibilità, Scrupolosità, Senso di appartenenza |
| **Risolutore** | `#f39c12` | Ogni problema ha una soluzione | Problem Solving, Concretezza, Stabilità emotiva, Flessibilità operativa |
| **Pioniere** | `#9b59b6` | Apre strade nuove | Flessibilità, Iniziativa, Innovazione, Problem Setting |
| **Capitano** | `#c0392b` | Guida con l'esempio | Decisionalità, Iniziativa, Negoziazione, Guida e Team Leadership, Influenza |
| **Artigiano** | `#34495e` | La perfezione nei dettagli | Scrupolosità, Visualizzazione spaziale, Autonomia operativa, Sensibilità manuale |

### Algoritmo di Scoring

```
Per ogni domanda risponduta:
  peso = questionWeights[Qn] || W_BAR
  scores[archetipo_opzione_selezionata] += peso

Ranking:
  ordinamento archetipi per punteggio decrescente
  tie-break: ordine alfabetico (deterministico)

Risultato:
  sempre un singolo archetipo dominante
```

### Classificazione Confidenza

Il delta tra primo e secondo archetipo viene loggato nel System Activity Log come indicatore diagnostico:

| Delta | Livello |
|---|---|
| ≥ 30 | Molto definito |
| ≥ 20 | Definito |
| ≥ 10 | Sfaccettato |
| < 10 | Molto sfaccettato |
