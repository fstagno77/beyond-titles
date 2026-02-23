# Database

Beyond Titles utilizza file JSON locali come database, caricati via Fetch API all'avvio dell'applicazione. Non è presente un backend né un database relazionale.

## Survey Database

**File:** `data/survey_archetypes.json`

### Metadati

| Campo | Valore |
|---|---|
| Versione | v4.0 |
| Formato | Behavioural & Competency-Based |
| Domande | 10 |
| Opzioni per domanda | 4 |
| Scoring | Single-choice pesato |

### Survey

| ID | Nome | Accesso |
|---|---|---|
| `bcb_v3` | Behavioural & Competency-Based v4.0 | Libero (default) |

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
  tie-break: domanda tiebreaker Q11 condizionale con matrice pesi primi

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
