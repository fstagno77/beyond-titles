# Pipeline Dati

## Panoramica

Questa pagina documenta il processo di trasformazione dei dati dal file Excel sorgente ai file JSON utilizzati dall'applicazione, incluse le regole di normalizzazione, il sistema di ereditarietà e le discrepanze note.

## Sorgente Dati

**File:** `mansioni-softskills-dude-20251230.xlsx`

Il file Excel contiene due fogli principali:

### Foglio "Struttura"

| Colonna | Contenuto |
|---|---|
| **Value** | Nome della mansione |
| **Relation** | Tipo di relazione (`JobTitles` o `SoftSkills`) |
| **Relation Value** | Job title generico o nome della soft skill |

**Totale record:** 2.823

I valori della colonna **Relation** determinano il significato di ogni riga:

- `Relation = "JobTitles"` — La mansione in `Value` è collegata al job title generico in `Relation Value`
- `Relation = "SoftSkills"` — La mansione in `Value` possiede la competenza specificata in `Relation Value`

### Foglio "Offerte su sito"

Contiene **445 mansioni** con annunci di lavoro attivi e il rispettivo conteggio offerte.

## Il Problema dei Due Conteggi

### Discrepanza 469 vs 379

Il database contiene due conteggi diversi di mansioni con soft skill, **entrambi corretti** ma riferiti a definizioni diverse.

#### Metodo A: Conteggio completo (469)

Estrae tutte le mansioni uniche dal database considerando **sia** la colonna `Value` **sia** la colonna `Relation Value` per i record con `Relation = "JobTitles"`. Dopo normalizzazione e rimozione duplicati: **469 mansioni**.

Questo conteggio rappresenta l'**universo completo** dei job title nel database, inclusi sia i titoli generici (es. "Magazziniere") sia le mansioni specifiche (es. "Addetto al magazzino - gestione ordine e uscita merci").

#### Metodo B: Conteggio K8 (379)

Conta solo le mansioni che hanno soft skill **direttamente** associate nel database — quelle che compaiono come `Value` quando `Relation = "SoftSkills"`. **Esclude** i job title generici che esistono solo come `Relation Value` e ereditano le soft skill dalle mansioni collegate.

#### Riepilogo

| Metodo | Risultato | Cosa include |
|---|:---:|---|
| Completo (JobTitles) | **469** | Value + Relation Value per JobTitles |
| K8 (SoftSkills) | **379** | Solo Value con Relation = SoftSkills |
| **Differenza** | **90** | Job title generici senza soft skill dirette |

::: info
La discrepanza è **metodologica, non un errore**. Il modello K8 usa correttamente 379 perché si riferisce alle mansioni con soft skill direttamente mappate — quelle effettivamente utilizzabili per il calcolo dell'affinità con gli archetipi.
:::

## Sistema di Ereditarietà

### Problema

I job title generici come "Magazziniere", "Carrellista" o "Mulettista" non hanno soft skill direttamente mappate nel database. Un utente che cerca questi termini non troverebbe competenze associate.

### Soluzione

Il sistema di ereditarietà (introdotto nella v2.0 del modello K8) risolve il problema: ogni mansione generica **eredita le soft skill** dalle mansioni specifiche collegate tramite la relazione `JobTitles`.

### Esempio: Magazziniere

"Magazziniere" esiste nel database **solo come `Relation Value`** (job title generico). Non ha soft skill proprie.

Le sue soft skill vengono ereditate da 4 mansioni specifiche:

| Mansione specifica | Soft Skills |
|---|---|
| Addetto al magazzino - gestione ordine e uscita merci | Iniziativa, Pianificazione e organizzazione, Scrupolosità |
| Addetto al magazzino - entrata merci | Pianificazione e organizzazione, Stabilità emotiva |
| Addetto al carico scarico | Pianificazione e organizzazione, Stabilità emotiva |
| Impiegato amministrativo di magazzino | Pianificazione e organizzazione, Problem Solving, Scrupolosità, Collaborazione Teamwork |

Nell'applicazione, le soft skill aggregate da tutte le mansioni collegate sono disponibili per "Magazziniere".

### Impatto

| Metrica | Prima (v1.1) | Dopo (v2.0) | Delta |
|---|:---:|:---:|:---:|
| Mansioni con soft skill mappate | 379 | **453** | +74 |
| Offerte di lavoro associate | 2.460 | **2.671** | +211 |
| Accuratezza validazione | — | **100%** | — |

## Normalizzazione

### Nomi delle mansioni

I nomi nel file Excel sono in MAIUSCOLO. La normalizzazione li converte in **Title Case** per leggibilità:

```
Excel:    "TECNICO COMMERCIALE"
JSON:     "Tecnico commerciale"
```

Spazi multipli vengono ridotti a spazio singolo.

### Nomi delle soft skill

Formattazione uniforme applicata. Il file originale contiene **35 soft skill uniche** — lo stesso numero viene mantenuto dopo la normalizzazione.

```
Excel:    "COORDINAMENTO OPERATIVO/CONTROLLO"
JSON:     "Coordinamento operativo / Controllo"
```

::: details Anomalia nota
Una soft skill nel file originale è scritta in minuscolo: `"fiducia in sé/consapevolezza"`. È associata a sole 2 mansioni: "Installatore e collaudatore - impianti" e "Installatore e collaudatore - macchinari industriali". Mantenuta nel JSON così come nell'originale.
:::

### Impatto sui conteggi

La normalizzazione **non altera** i conteggi delle mansioni — rimangono **379** sia nell'Excel originale che nei JSON.

## Struttura dei JSON

### mansioni_database.json

**604 record totali**, suddivisi in 3 categorie:

| Categoria | Count | Descrizione |
|---|:---:|---|
| `categoria_principale` | 445 | Mansioni nel foglio "Offerte" con annunci attivi |
| `profilo_incompleto` | 134 | Mansioni in "Struttura" ma non in "Offerte" (nessun annuncio attivo) |
| `alias` | 25 | Job title generici che puntano ad altre mansioni |

Per ogni mansione il JSON contiene:

```json
{
  "nome": "Tecnico Commerciale",
  "id": "tecnico-commerciale",
  "numero_offerte": 59,
  "url": "https://www.gigroup.it/offerte-lavoro/tecnico-commerciale/",
  "soft_skills": ["Comunicazione", "Ascolto", "Analisi", "..."],
  "mapping_type": "categoria_principale",
  "has_custom_skills": true
}
```

### survey_archetypes.json

Definisce gli 8 archetipi del modello K8 con le rispettive soft skill indicative che determinano l'affinità con le mansioni (vedi [Modello K8](./modello-k8)).

## Discrepanze Note

### Conteggio offerte K8 vs Excel

Le cifre delle offerte nel documento K8 non corrispondono esattamente al file Excel corrente:

| Metrica | K8 | Excel | Match |
|---|:---:|:---:|:---:|
| Totale record | 604 | 604 | ✓ |
| Mansioni con soft skills | 379 | 379 | ✓ |
| Mansioni senza soft skills | 225 | 225 | ✓ |
| Offerte (mansioni con SS) | 2.460 | 2.235 | ✗ |
| Offerte (mansioni senza SS) | 912 | 957 | ✗ |
| Totale offerte | 3.372 | 3.192 | ✗ |

::: warning
I numeri delle offerte nel K8 sono stati probabilmente calcolati su una versione precedente del database o con criteri diversi. Si consiglia di aggiornare il K8 con i valori correnti dell'Excel.
:::

## Perimetro Dati Corrente

| Metrica | Valore |
|---|:---:|
| Record totali nel database | **604** |
| Mansioni con soft skill mappate | **453** (con ereditarietà) |
| Offerte di lavoro attive | **2.671** |
| Mansioni senza soft skill | **151** |
| Soft skill uniche | **35** |
| Aree professionali | **22** |
