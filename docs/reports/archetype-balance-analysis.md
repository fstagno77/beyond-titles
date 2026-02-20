# Rapporto di Analisi: Bilanciamento Archetipi Survey BCB v3.5

**Data:** 16 febbraio 2026
**Versione survey:** v3.5
**Metodo:** Enumerazione esaustiva di tutte le 1.048.576 combinazioni possibili (4^10)

---

## 1. Contesto e Problema Segnalato

Un tester ha riportato che, variando le risposte in più compilazioni del survey, otteneva spesso gli stessi profili. L'osservazione ha sollevato il dubbio che alcuni archetipi siano strutturalmente favoriti dal sistema di scoring, indipendentemente dalle risposte dell'utente.

---

## 2. Struttura del Survey

| Parametro | Valore |
|---|---|
| Domande | 10 |
| Opzioni per domanda | 4 (single-choice) |
| Archetipi | 8 |
| Occorrenze per archetipo | 5 su 40 opzioni totali |
| Sistema scoring | Weighted (pesi differenziati per domanda) |
| Peso totale | 196 punti |
| Tie-breaking | Ordine alfabetico (deterministico) |

### 2.1 Distribuzione dei pesi

| Domanda | Tema | Peso | % del totale |
|---|---|---|---|
| Q8 | Coordinamento gruppo | **38** | 19.4% |
| Q4 | Gestione priorita | **31** | 15.8% |
| Q5 | Adattamento al cambiamento | **31** | 15.8% |
| Q9 | Intervento proattivo | 24 | 12.2% |
| Q2 | Problem solving | 20 | 10.2% |
| Q3 | Responsabilita condivisa | 17 | 8.7% |
| Q7 | Gestione conflitti | 17 | 8.7% |
| Q1 | Gestione ambiguita | 6 | 3.1% |
| Q6 | Innovazione | 6 | 3.1% |
| Q10 | Leadership situazionale | 6 | 3.1% |

**Dato critico:** Le 3 domande piu pesanti (Q4+Q5+Q8) valgono il **51.0%** del punteggio totale. Le 3 piu leggere (Q1+Q6+Q10) valgono solo il **9.2%**. Il rapporto peso max/min e **6.3x**.

---

## 3. Risultati dell'Analisi Esaustiva

### 3.1 Distribuzione archetipi come risultato primario

Con risposte completamente casuali (distribuzione uniforme), se il survey fosse perfettamente bilanciato ogni archetipo dovrebbe uscire nel **12.50%** dei casi.

| Archetipo | Probabilita | Deviazione | Gruppo |
|---|---|---|---|
| Il Connettore | **13.76%** | +1.26 pp | Favorito |
| Il Capitano | **13.74%** | +1.24 pp | Favorito |
| Il Pragmatico | **13.58%** | +1.08 pp | Favorito |
| Il Collaboratore | **13.52%** | +1.02 pp | Favorito |
| Lo Stratega | 11.97% | -0.53 pp | Neutro |
| L'Artigiano | 11.57% | -0.93 pp | Sfavorito |
| Il Pioniere | **10.98%** | -1.52 pp | Sfavorito |
| Il Risolutore | **10.88%** | -1.62 pp | Sfavorito |

- **Spread complessivo:** 2.88 punti percentuali
- **Rapporto max/min:** 1.265x (Connettore esce il 26.5% piu spesso del Risolutore)
- **Giudizio:** Sbilanciamento MODERATO

### 3.2 Causa dello sbilanciamento

Il bilanciamento "numerico" e perfetto: ogni archetipo appare esattamente 5 volte, e il peso totale delle domande in cui appare e sempre 98. **La media attesa e identica per tutti (24.5 punti).**

Il problema e la **varianza**. Gli archetipi che appaiono nelle domande con pesi molto diversi tra loro (mix di pesi alti e bassi) hanno una distribuzione dei punteggi piu "spalmata" — e quindi piu probabilita di raggiungere valori estremi e finire in cima.

| Archetipo | Domande (peso) | Deviazione std | Gruppo varianza |
|---|---|---|---|
| Connettore | Q1(6), Q5(31), Q6(6), Q7(17), Q8(38) | **22.8** | Alta |
| Pragmatico | Q1(6), Q3(17), Q4(31), Q6(6), Q8(38) | **22.8** | Alta |
| Capitano | Q1(6), Q4(31), Q7(17), Q8(38), Q10(6) | **22.8** | Alta |
| Collaboratore | Q2(20), Q3(17), Q7(17), Q8(38), Q10(6) | 21.5 | Media |
| Stratega | Q4(31), Q5(31), Q6(6), Q9(24), Q10(6) | 22.0 | Media |
| Risolutore | Q2(20), Q4(31), Q7(17), Q9(24), Q10(6) | **20.6** | Bassa |
| Pioniere | Q2(20), Q3(17), Q5(31), Q6(6), Q9(24) | **20.6** | Bassa |
| Artigiano | Q1(6), Q2(20), Q3(17), Q5(31), Q9(24) | **20.6** | Bassa |

**Pattern chiave:** Tutti e 3 gli archetipi favoriti (Connettore, Pragmatico, Capitano) appaiono nella domanda Q8 (peso 38), che da sola vale quasi il 20% del punteggio. I 3 archetipi sfavoriti (Risolutore, Pioniere, Artigiano) non appaiono in Q8.

---

## 4. Analisi di Sensibilita

### 4.1 Impatto del cambio di una singola risposta

Se si cambia la risposta a UNA sola domanda, con che probabilita cambia l'archetipo primario?

| Domanda | Peso | Prob. cambio risultato | Impatto |
|---|---|---|---|
| Q8 | 38 | **60.5%** | ALTO |
| Q5 | 31 | **46.2%** | ALTO |
| Q4 | 31 | **43.6%** | ALTO |
| Q9 | 24 | 35.3% | MEDIO |
| Q2 | 20 | 26.5% | MEDIO |
| Q7 | 17 | 25.8% | MEDIO |
| Q3 | 17 | 23.7% | BASSO |
| Q1 | 6 | **6.8%** | BASSO |
| Q10 | 6 | **6.8%** | BASSO |
| Q6 | 6 | **6.5%** | BASSO |

### 4.2 Impatto del cambio per gruppi di domande

| Gruppo di domande | Prob. cambio risultato |
|---|---|
| Solo Q1+Q6+Q10 (peso 6 ciascuna) | **13.0%** |
| Solo Q2+Q3+Q7+Q9 (pesi medi) | **59.5%** |
| Solo Q4+Q5+Q8 (pesi alti) | **88.8%** |

**Implicazione pratica:** Un utente che cambia risposta a Q1, Q6 e Q10 (3 domande su 10) ottiene lo stesso risultato nell'87% dei casi. Questo spiega perfettamente il feedback del tester: cambiando risposte su domande "leggere", il profilo non si muove.

---

## 5. Analisi della Competizione tra Archetipi

Archetipi che competono nelle stesse domande hanno i punteggi correlati: quando uno sale, l'altro non puo salire nella stessa domanda.

| Coppia | Domande condivise | Livello |
|---|---|---|
| Pioniere / Artigiano | 4 su 5 | **ALTA** competizione |
| Connettore / Pragmatico | 3 su 5 | Moderata |
| Connettore / Capitano | 3 su 5 | Moderata |
| Stratega / Risolutore | 3 su 5 | Moderata |
| Pragmatico / Capitano | 3 su 5 | Moderata |
| Collaboratore / Capitano | 3 su 5 | Moderata |
| Pioniere / Capitano | 0 su 5 | Indipendenti |

**Nota:** Pioniere e Artigiano condividono 4 domande su 5 — sono quasi mutuamente esclusivi. Se un utente preferisce risposte "da Pioniere", l'Artigiano sara quasi certamente basso. Questo e un dato di design, non un bug, ma va considerato nell'interpretazione dei risultati.

---

## 6. Distribuzione dei Livelli di Confidenza

Con risposte casuali:

| Livello | Delta | Frequenza |
|---|---|---|
| Molto sfaccettato | < 10 | **36.1%** |
| Sfaccettato | 10-19 | 29.4% |
| Definito | 20-29 | 15.7% |
| Molto definito | >= 30 | 18.8% |

Il 36% di risultati "molto sfaccettato" con risposte casuali e atteso e non problematico — un utente reale con preferenze genuine produrra delta piu alti.

---

## 7. Valutazione degli Scenari Correttivi

Sono stati testati 5 scenari di pesi diversi, ciascuno valutato su tutte le 1.048.576 combinazioni.

### 7.1 Riepilogo comparativo

| Scenario | Pesi | Spread | Giudizio |
|---|---|---|---|
| **A) Pesi attuali** | [6,20,17,31,31,6,17,38,24,6] | 2.88 pp | Moderato |
| **B) Pesi uguali** | [10,10,10,10,10,10,10,10,10,10] | **15.80 pp** | Pessimo |
| **C) Range compresso 12-28** | [12,19,18,25,25,12,18,28,21,12] | **1.86 pp** | Buono |
| **D) Varianza equalizzata** | [6,24,18,29,29,6,18,34,25,6] | 3.12 pp | Peggiore |
| **E) Range moderato 10-30** | [10,19,17,26,26,10,17,30,21,10] | 2.01 pp | Moderato |

### 7.2 Analisi per scenario

**Scenario B — Pesi uguali: DA EVITARE**
I pesi uguali sembrano la soluzione ovvia, ma producono il risultato peggiore in assoluto (spread 15.80 pp). Il motivo: con punteggi uguali, i pareggi diventano frequentissimi e il tie-breaking alfabetico domina. L'Artigiano (inizia con "A") vince nel 23% dei casi, lo Stratega nel 7%.

**Scenario C — Range compresso 12-28: RACCOMANDATO**
Comprime il range dei pesi da 6-38 a 12-28, mantenendo le proporzioni relative. Riduce lo spread a 1.86 pp con impatto minimo sulla logica di differenziazione tra domande. La differenziazione si mantiene (le domande pesanti continuano a pesare di piu), ma il rapporto max/min scende da 6.3x a 2.3x.

**Scenario D — Varianza equalizzata: NON FUNZIONA**
Il tentativo di equalizzare la varianza matematica senza considerare la struttura di competizione tra archetipi produce un risultato peggiore dell'attuale. L'approccio inverte semplicemente quali archetipi sono favoriti.

**Scenario E — Range moderato 10-30: ALTERNATIVA ACCETTABILE**
Compromesso tra A e C. Spread 2.01 pp — migliore dell'attuale ma non ottimale.

---

## 8. Rischi nel Lasciare il Sistema Attuale

### 8.1 Rischi reali

1. **Percezione di inaffidabilita da parte dei tester e degli utenti**
   Il feedback ricevuto lo conferma: se un utente ripete il survey cambiando poche risposte e ottiene lo stesso risultato, perde fiducia nello strumento. Anche se il sistema funziona correttamente in senso tecnico, la *percezione* di rigidita e un problema concreto.

2. **Domande "decorative"**
   Q1, Q6 e Q10 (peso 6 ciascuna) hanno un impatto cosi basso da essere quasi irrilevanti. Cambiare risposta su tutte e tre contemporaneamente modifica il risultato solo nel 13% dei casi. Questo solleva la domanda: se una domanda non influenza il risultato, vale la pena farla?

3. **Concentrazione eccessiva su Q8**
   Una singola domanda (Q8, coordinamento gruppo) determina il risultato nel 60.5% dei casi in cui viene cambiata. Questo significa che il survey sta effettivamente misurando "come ti comporti quando manca chiarezza nel gruppo" molto piu di quanto misuri innovazione (Q6, peso 6) o gestione dell'ambiguita (Q1, peso 6).

### 8.2 Rischi che NON ci sono

1. **Non e un bias "grave"**
   Lo spread di 2.88 pp e nella fascia moderata. Con utenti reali che rispondono con coerenza, l'effetto e ulteriormente diluito. Non siamo in una situazione in cui il survey "non funziona".

2. **La struttura di base e solida**
   Il bilanciamento numerico (5 occorrenze per archetipo, peso totale 98 per tutti) e perfetto. Il problema e solo nella distribuzione della varianza, correggibile senza riprogettare il survey.

3. **Il tie-breaking non e un problema con i pesi attuali**
   I pareggi esatti rappresentano solo il 3.28% dei casi. Con pesi differenziati, sono rari.

---

## 9. Raccomandazioni

### 9.1 Intervento raccomandato: Compressione range pesi (Scenario C)

Sostituire i pesi attuali con il range compresso 12-28:

| Domanda | Peso attuale | Peso proposto | Delta |
|---|---|---|---|
| Q1 | 6 | **12** | +6 |
| Q2 | 20 | **19** | -1 |
| Q3 | 17 | **18** | +1 |
| Q4 | 31 | **25** | -6 |
| Q5 | 31 | **25** | -6 |
| Q6 | 6 | **12** | +6 |
| Q7 | 17 | **18** | +1 |
| Q8 | 38 | **28** | -10 |
| Q9 | 24 | **21** | -3 |
| Q10 | 6 | **12** | +6 |

**Effetto:**
- Spread da 2.88 pp a **1.86 pp** (riduzione del 35%)
- Rapporto max/min da 6.3x a **2.3x**
- Le domande leggere diventano piu significative (un cambio su Q1/Q6/Q10 avra piu impatto)
- L'ordine di importanza relativa tra domande rimane invariato
- Non richiede modifiche alle domande o alle opzioni

### 9.2 Considerazioni aggiuntive

1. **Validare con i dati reali:** Prima di applicare la correzione in produzione, confrontare la distribuzione dei risultati reali raccolti finora con la distribuzione teorica. Se i risultati reali mostrano uno sbilanciamento simile a quello teorico, la correzione e piu urgente.

2. **Comunicare la modifica:** Se ci sono risultati gia emessi con i pesi v3.5, i nuovi pesi produrranno risultati leggermente diversi per le stesse risposte. Valutare se e necessario comunicarlo.

3. **Non cambiare le domande:** Il set di domande e opzioni e solido. Lo sbilanciamento e interamente nel layer dei pesi, quindi la correzione e chirurgica e non richiede riscrittura del contenuto.

---

## 10. Come Riprodurre l'Analisi

Gli script di analisi sono disponibili in `scripts/`:

```bash
# Analisi esaustiva completa (tutte le 1M combinazioni)
node scripts/archetype_balance_test.js

# Confronto scenari correttivi
node scripts/archetype_correctives.js

# Analisi di sensibilita per domanda
node scripts/archetype_sensitivity.js
```

Tutti e tre gli script leggono la configurazione da `data/survey_archetypes.json` e non modificano alcun file.

---

## Appendice: Glossario

- **Spread:** Differenza tra la probabilita del l'archetipo piu frequente e quello meno frequente (in punti percentuali)
- **Varianza:** Misura di quanto un punteggio puo oscillare rispetto alla media. Piu alta = piu possibilita di valori estremi
- **Tie-breaking:** Meccanismo di risoluzione dei pareggi (attualmente: ordine alfabetico del nome dell'archetipo)
- **pp (punti percentuali):** Differenza assoluta tra percentuali (es. 13.76% - 10.88% = 2.88 pp)
