#!/usr/bin/env node
/**
 * Archetype Balance - Corrective Analysis
 *
 * Tests multiple weight configurations to find the optimal balance.
 */

const fs = require('fs');
const path = require('path');

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'survey_archetypes.json'), 'utf8')
);

const questions = data.surveys.bcb_v3.domande;
const allArchetypes = Object.keys(data.archetipi);
const questionArchetypes = questions.map(q => q.opzioni.map(o => o.archetipo));
const numQuestions = 10;
const numOptions = 4;
const totalCombinations = Math.pow(numOptions, numQuestions);

function runSimulation(weightValues, label) {
  const winCount = {};
  allArchetypes.forEach(a => { winCount[a] = 0; });

  const scores = {};

  for (let combo = 0; combo < totalCombinations; combo++) {
    allArchetypes.forEach(a => { scores[a] = 0; });

    let remaining = combo;
    for (let q = numQuestions - 1; q >= 0; q--) {
      const optionIdx = remaining % numOptions;
      remaining = Math.floor(remaining / numOptions);
      const archetype = questionArchetypes[q][optionIdx];
      scores[archetype] += weightValues[q];
    }

    const ranked = allArchetypes
      .map(a => ({ archetype: a, score: scores[a] }))
      .sort((a, b) => b.score - a.score || a.archetype.localeCompare(b.archetype));

    winCount[ranked[0].archetype]++;
  }

  const results = allArchetypes
    .map(a => ({
      archetype: a,
      nome: data.archetipi[a].nome,
      wins: winCount[a],
      pct: (winCount[a] / totalCombinations * 100)
    }))
    .sort((a, b) => b.pct - a.pct);

  const maxPct = results[0].pct;
  const minPct = results[results.length - 1].pct;
  const spread = maxPct - minPct;

  // Compute sum of squares per archetype
  const sumSq = {};
  allArchetypes.forEach(a => { sumSq[a] = 0; });
  questionArchetypes.forEach((qa, qi) => {
    qa.forEach(a => { sumSq[a] += weightValues[qi] * weightValues[qi]; });
  });
  const sqValues = Object.values(sumSq);
  const sqSpread = Math.max(...sqValues) - Math.min(...sqValues);

  return { label, weightValues, results, spread, maxPct, minPct, sqSpread };
}

// --- Scenario A: Current weights ---
const currentWeights = [6, 20, 17, 31, 31, 6, 17, 38, 24, 6];
const scenarioA = runSimulation(currentWeights, 'A) Pesi attuali (v3.5)');

// --- Scenario B: Equal weights ---
const equalWeights = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
const scenarioB = runSimulation(equalWeights, 'B) Pesi uguali (tutti 10)');

// --- Scenario C: Compressed range (proportional) ---
// Map current 6-38 to 12-28 range, maintaining proportional relationships
const minOrig = 6, maxOrig = 38;
const minNew = 12, maxNew = 28;
const compressedWeights = currentWeights.map(w =>
  Math.round(minNew + (w - minOrig) / (maxOrig - minOrig) * (maxNew - minNew))
);
const scenarioC = runSimulation(compressedWeights, 'C) Range compresso (12-28)');

// --- Scenario D: Variance-equalized weights ---
// Goal: make sum of squares identical for each archetype
// Each archetype appears in 5 questions. We need sum(w_i^2) to be equal for all.
// Current sum of squares: connettore=2766, risolutore=2262
// We need to find weights that make this equal while keeping total weight per archetype = 98
// Approach: iterative adjustment
function optimizeForVarianceBalance(startWeights, iterations = 5000, lr = 0.1) {
  let weights = [...startWeights];

  for (let iter = 0; iter < iterations; iter++) {
    // Calculate sum of squares per archetype
    const sumSq = {};
    allArchetypes.forEach(a => { sumSq[a] = 0; });
    questionArchetypes.forEach((qa, qi) => {
      qa.forEach(a => { sumSq[a] += weights[qi] * weights[qi]; });
    });

    const sqValues = Object.values(sumSq);
    const targetSq = sqValues.reduce((s, v) => s + v, 0) / sqValues.length;

    // Gradient: for each question weight, how does changing it affect the balance?
    const gradient = weights.map((w, qi) => {
      let grad = 0;
      const archetypesInQ = questionArchetypes[qi];
      archetypesInQ.forEach(a => {
        grad += 2 * (sumSq[a] - targetSq) * 2 * w;
      });
      return grad;
    });

    // Update weights
    const maxGrad = Math.max(...gradient.map(Math.abs));
    if (maxGrad === 0) break;

    weights = weights.map((w, i) => {
      const newW = w - lr * gradient[i] / maxGrad;
      return Math.max(5, newW); // Minimum weight of 5
    });
  }

  // Round to integers
  return weights.map(w => Math.round(w));
}

const optimizedWeights = optimizeForVarianceBalance(currentWeights);
const scenarioD = runSimulation(optimizedWeights, 'D) Pesi ottimizzati (varianza equalizzata)');

// --- Scenario E: Mild compression (keep more differentiation) ---
const mildCompressed = currentWeights.map(w =>
  Math.round(10 + (w - minOrig) / (maxOrig - minOrig) * (30 - 10))
);
const scenarioE = runSimulation(mildCompressed, 'E) Range moderato (10-30)');

// --- Print all scenarios ---
const scenarios = [scenarioA, scenarioB, scenarioC, scenarioD, scenarioE];

console.log('╔══════════════════════════════════════════════════════════════════════════╗');
console.log('║           ANALISI COMPARATIVA - SCENARI DI BILANCIAMENTO               ║');
console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

scenarios.forEach(s => {
  console.log(`\n${'━'.repeat(70)}`);
  console.log(`  ${s.label}`);
  console.log(`  Pesi: [${s.weightValues.join(', ')}]`);
  console.log(`  Total: ${s.weightValues.reduce((a, b) => a + b, 0)}  |  Variance spread (sum²): ${s.sqSpread}`);
  console.log(`${'━'.repeat(70)}`);

  s.results.forEach(r => {
    const deviation = r.pct - 12.5;
    const sign = deviation >= 0 ? '+' : '';
    const bar = '█'.repeat(Math.round(r.pct * 2));
    console.log(
      `  ${r.nome.padEnd(18)} ${r.pct.toFixed(2).padStart(6)}%  (${sign}${deviation.toFixed(2)}%)  ${bar}`
    );
  });

  console.log(`\n  SPREAD: ${s.spread.toFixed(2)} pp  |  Range: ${s.minPct.toFixed(2)}% - ${s.maxPct.toFixed(2)}%`);

  if (s.spread < 1) console.log('  → ✅ OTTIMO: spread < 1pp');
  else if (s.spread < 2) console.log('  → ✅ BUONO: spread < 2pp');
  else if (s.spread < 3) console.log('  → ⚠️  MODERATO: spread 2-3pp');
  else console.log('  → ❌ PROBLEMATICO: spread > 3pp');
});

// Summary table
console.log(`\n\n${'═'.repeat(70)}`);
console.log('  RIEPILOGO COMPARATIVO');
console.log(`${'═'.repeat(70)}\n`);
console.log('  Scenario                          Spread    Min%     Max%     Giudizio');
console.log('  ' + '─'.repeat(66));
scenarios.forEach(s => {
  const judgment = s.spread < 1 ? '✅ OTTIMO' : s.spread < 2 ? '✅ BUONO' : s.spread < 3 ? '⚠️  MODERATO' : '❌ PROBLEMATICO';
  console.log(
    `  ${s.label.padEnd(35)} ${s.spread.toFixed(2).padStart(5)}pp  ${s.minPct.toFixed(2).padStart(6)}%  ${s.maxPct.toFixed(2).padStart(6)}%  ${judgment}`
  );
});

// Print optimized weights mapping
console.log(`\n\n${'═'.repeat(70)}`);
console.log('  DETTAGLIO PESI OTTIMIZZATI (Scenario D)');
console.log(`${'═'.repeat(70)}\n`);
console.log('  Domanda   Peso attuale → Peso ottimizzato   Delta');
console.log('  ' + '─'.repeat(55));
for (let i = 0; i < numQuestions; i++) {
  const curr = currentWeights[i];
  const opt = optimizedWeights[i];
  const delta = opt - curr;
  const sign = delta >= 0 ? '+' : '';
  console.log(`  Q${(i+1).toString().padEnd(8)} ${curr.toString().padStart(6)}    →    ${opt.toString().padStart(6)}          ${sign}${delta}`);
}
console.log(`\n  Totale    ${currentWeights.reduce((a,b)=>a+b,0).toString().padStart(6)}    →    ${optimizedWeights.reduce((a,b)=>a+b,0).toString().padStart(6)}`);

// Concentration analysis (Q4+Q5+Q8 dominance)
console.log(`\n\n${'═'.repeat(70)}`);
console.log('  ANALISI CONCENTRAZIONE PESO');
console.log(`${'═'.repeat(70)}\n`);
const totalWeight = currentWeights.reduce((a, b) => a + b, 0);
const topQuestions = [
  { q: 'Q8', w: 38 },
  { q: 'Q4', w: 31 },
  { q: 'Q5', w: 31 },
  { q: 'Q9', w: 24 },
  { q: 'Q2', w: 20 },
];
let cumulative = 0;
topQuestions.forEach(tq => {
  cumulative += tq.w;
  console.log(`  ${tq.q}: peso ${tq.w.toString().padStart(2)} → ${(tq.w/totalWeight*100).toFixed(1)}% del totale (cumulativo: ${(cumulative/totalWeight*100).toFixed(1)}%)`);
});
console.log(`\n  Le 3 domande più pesanti (Q4+Q5+Q8) valgono il ${((31+31+38)/totalWeight*100).toFixed(1)}% del punteggio totale`);
console.log(`  Le 3 domande più leggere (Q1+Q6+Q10) valgono il ${((6+6+6)/totalWeight*100).toFixed(1)}% del punteggio totale`);
console.log(`  Rapporto peso max/min: ${(38/6).toFixed(1)}x`);
