# Bilanciamento Archetipi v4.0

## Contesto

La v4.0 introduce pesi compressi (**Scenario C**) per ridurre lo sbilanciamento strutturale identificato nell'[analisi di bilanciamento](/reports/archetype-balance-analysis). Il range dei pesi passa da 6-38 (v3.5) a **12-28** (v4.0), riducendo il rapporto max/min da 6,3x a 2,3x.

## Pesi per Domanda

| Domanda | Tema | Peso v3.5 | Peso v4.0 | Delta |
|---|---|:---:|:---:|:---:|
| Q1 | Gestione ambiguità | 6 | **12** | +6 |
| Q2 | Problem solving | 20 | **19** | -1 |
| Q3 | Responsabilità condivisa | 17 | **18** | +1 |
| Q4 | Gestione priorità | 31 | **25** | -6 |
| Q5 | Adattamento al cambiamento | 31 | **25** | -6 |
| Q6 | Innovazione | 6 | **12** | +6 |
| Q7 | Gestione conflitti | 17 | **18** | +1 |
| Q8 | Coordinamento gruppo | 38 | **28** | -10 |
| Q9 | Intervento proattivo | 24 | **21** | -3 |
| Q10 | Valori / Soddisfazione | 6 | **12** | +6 |
| **Totale** | | **196** | **190** | -6 |

**Principio:** comprimere i pesi estremi mantenendo l'ordine relativo di importanza. Le domande leggere (Q1, Q6, Q10) passano da peso 6 a 12, diventando significative. Q8 scende da 38 a 28, riducendo la concentrazione eccessiva su una singola domanda.

## Risultati: Enumerazione Esaustiva

Tutte le **1.048.576** combinazioni possibili (4^10) sono state enumerate e analizzate.

### Distribuzione Archetipi come Risultato Primario

Valore atteso per bilanciamento perfetto: **12,50%** ciascuno.

| Archetipo | % v4.0 | Deviazione | % v3.5 | Miglioramento |
|---|:---:|:---:|:---:|:---:|
| Il Capitano | 12,96% | +0,46 pp | 13,74% | -0,78 pp |
| Il Connettore | 12,95% | +0,45 pp | 13,76% | -0,81 pp |
| Il Pragmatico | 12,95% | +0,45 pp | 13,58% | -0,63 pp |
| Lo Stratega | 12,89% | +0,39 pp | 11,97% | +0,92 pp |
| Il Collaboratore | 12,67% | +0,17 pp | 13,52% | -0,85 pp |
| Il Risolutore | 11,97% | -0,53 pp | 10,88% | +1,09 pp |
| Il Pioniere | 11,83% | -0,67 pp | 10,98% | +0,85 pp |
| L'Artigiano | 11,78% | -0,72 pp | 11,57% | +0,21 pp |

### Metriche di Bilanciamento

| Metrica | v3.5 | v4.0 | Miglioramento |
|---|:---:|:---:|:---:|
| **Spread** (max − min) | 2,88 pp | **1,18 pp** | -59% |
| **Max/Min ratio** | 1,265x | **1,100x** | -13% |
| **Giudizio** | Moderato | **Accettabile** | ✅ |
| Stddev range | 20,6 – 22,8 | 18,8 – 19,5 | Molto più uniforme |

### Causa Residua dello Sbilanciamento

Lo spread residuo di 1,18 pp è dovuto alla **varianza** (sum of squares) dei pesi per archetipo:

| Archetipo | Domande (peso) | Sum of Squares | Stddev |
|---|---|:---:|:---:|
| Connettore | Q1(12), Q5(25), Q6(12), Q7(18), Q8(28) | 2.021 | 19,5 |
| Pragmatico | Q1(12), Q3(18), Q4(25), Q6(12), Q8(28) | 2.021 | 19,5 |
| Capitano | Q1(12), Q4(25), Q7(18), Q8(28), Q10(12) | 2.021 | 19,5 |
| Collaboratore | Q2(19), Q3(18), Q7(18), Q8(28), Q10(12) | 1.937 | 19,1 |
| Stratega | Q4(25), Q5(25), Q6(12), Q9(21), Q10(12) | 1.979 | 19,3 |
| Risolutore | Q2(19), Q4(25), Q7(18), Q9(21), Q10(12) | 1.895 | 18,8 |
| Pioniere | Q2(19), Q3(18), Q5(25), Q6(12), Q9(21) | 1.895 | 18,8 |
| Artigiano | Q1(12), Q2(19), Q3(18), Q5(25), Q9(21) | 1.895 | 18,8 |

La compressione dei pesi ha ridotto la differenza di stddev da **2,2 punti** (v3.5) a **0,7 punti** (v4.0).

## Pareggi e Tiebreaker Q11

| Metrica | v3.5 | v4.0 |
|---|:---:|:---:|
| Pareggi totali | 34.443 (3,28%) | 43.282 (4,13%) |
| Risoluzione Q11 | 100% | 100% |

I pareggi aumentano leggermente con i pesi compressi (punteggi più vicini tra loro), ma il tiebreaker Q11 con matrice di pesi primi li risolve tutti al 100%.

### Distribuzione Vincitori dopo Tiebreaker

| Archetipo | Solo wins | Tie wins | Totale |
|---|:---:|:---:|:---:|
| Capitano | 131.026 | 4.914 | 135.940 |
| Connettore | 131.239 | 4.556 | 135.795 |
| Pragmatico | 131.792 | 3.996 | 135.788 |
| Stratega | 126.102 | 9.019 | 135.121 |
| Collaboratore | 128.267 | 4.568 | 132.835 |
| Risolutore | 119.189 | 6.361 | 125.550 |
| Pioniere | 118.763 | 5.235 | 123.998 |
| Artigiano | 118.916 | 4.633 | 123.549 |

Lo Stratega beneficia maggiormente dal tiebreaker (9.019 tie wins) grazie ai pesi primi alti nella matrice Q11.

### Validazione Monte Carlo (1.000.000 simulazioni)

La simulazione Monte Carlo con risposte uniformi conferma i risultati dell'enumerazione esaustiva e quantifica l'effetto correttivo del tiebreaker:

| Archetipo | Senza TB | Con TB | Δ |
|---|:---:|:---:|:---:|
| Il Capitano | 13,25% | 12,95% | -0,30 pp |
| Il Connettore | 13,21% | 12,96% | -0,25 pp |
| Il Pragmatico | 12,98% | 12,95% | -0,04 pp |
| Lo Stratega | 12,03% | 12,90% | +0,87 pp |
| Il Collaboratore | 13,03% | 12,65% | -0,38 pp |
| Il Risolutore | 11,43% | 11,98% | +0,56 pp |
| Il Pioniere | 11,64% | 11,81% | +0,17 pp |
| L'Artigiano | 12,43% | 11,80% | -0,63 pp |
| **Spread** | **1,82 pp** | **1,18 pp** | **-35%** |
| **Chi²** (df=7) | 2.959 | 1.625 | **-45%** |

Il tiebreaker riduce lo spread da 1,82 pp a **1,18 pp** e il Chi² del 45%. Il bias all'interno dei tie (es. Stratega vince ~75% dei tie con Pragmatico) è intenzionale: compensa lo sbilanciamento strutturale dei pesi Q1-Q10, dove Stratega (12,03%) e Risolutore (11,43%) sono sotto-rappresentati senza tiebreaker.

> **Nota metodologica:** 1,18 pp di spread su risposte uniformi è il miglior risultato ottenibile senza modificare i pesi Q1-Q10 o la mappatura domanda→archetipo. Un tentativo di bilanciare la matrice Q11 per equità nei tie (somme per archetipo uniformi) peggiora lo spread globale a ~1,33 pp, perché rimuove la correzione compensativa. Pesi uguali per tutte le domande causano il 43% di pareggi e uno spread di 5,5 pp — significativamente peggiore. Il bias residuo è trascurabile in pratica: con utenti reali che rispondono con coerenza (non uniformemente), l'effetto scompare.

## Distribuzione Livelli di Confidenza

| Livello | Delta | v3.5 | v4.0 |
|---|---|:---:|:---:|
| Molto definito | ≥ 30 | 18,82% | 11,73% |
| Definito | 20-29 | 15,65% | 15,99% |
| Sfaccettato | 10-19 | 29,42% | 27,06% |
| Molto sfaccettato | < 10 | 36,11% | 45,23% |

Con pesi compressi, i punteggi sono più ravvicinati, aumentando i risultati "sfaccettati". Questo è atteso: con risposte casuali i delta sono bassi. Con utenti reali che rispondono con coerenza, i delta saranno significativamente più alti.

## Come Riprodurre

```bash
# Enumerazione esaustiva (tutte le 1M combinazioni)
node scripts/archetype_balance_test.js

# Monte Carlo (100K simulazioni random)
node scripts/archetype_montecarlo.js

# Test tiebreaker Q11 (verifica risoluzione 100%)
node scripts/archetype_tiebreaker_test.js
```

Tutti gli script leggono la configurazione da `data/survey_archetypes.json` e non modificano alcun file.
