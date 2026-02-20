#!/usr/bin/env node
/**
 * Monte Carlo Random Test - Archetype Balance v4.0
 *
 * Simulates N random survey completions and reports results
 * with confidence intervals. Integrates tiebreaker Q11 for
 * resolving ties with prime number weight matrix.
 */

const fs = require('fs');
const path = require('path');

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'survey_archetypes.json'), 'utf8')
);

const survey = data.surveys.bcb_v3;
const questions = survey.domande;
const weights = data.questionWeights;
const tiebreaker = survey.tiebreaker;
const allArchetypes = Object.keys(data.archetipi);
const questionArchetypes = questions.map(q => q.opzioni.map(o => o.archetipo));
const questionWeightValues = questions.map(q => weights[`Q${q.id}`]);
const numQuestions = 10;
const numOptions = 4;
const TB_ANSWERS = ['A', 'B', 'C', 'D'];

const N = 100_000; // Number of random tests

console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║      TEST MONTE CARLO v4.0 - CON TIEBREAKER Q11 INTEGRATO         ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝\n');
console.log(`  Numero simulazioni: ${N.toLocaleString()}`);
console.log(`  Metodo: 10 risposte casuali + Q11 tiebreaker se pareggio`);
console.log(`  Intervallo di confidenza: 95% (z = 1.96)\n`);

const winCount = {};
const scoreAccum = {};
const scoreSqAccum = {};
allArchetypes.forEach(a => {
  winCount[a] = 0;
  scoreAccum[a] = 0;
  scoreSqAccum[a] = 0;
});

// Confidence level counters
const confidenceCounts = { molto_definito: 0, definito: 0, sfaccettato: 0, molto_sfaccettato: 0 };

// Tiebreaker stats
let tiebreakerCount = 0;

// Run simulations
const startTime = Date.now();

for (let i = 0; i < N; i++) {
  // Generate random answers
  const scores = {};
  allArchetypes.forEach(a => { scores[a] = 0; });

  for (let q = 0; q < numQuestions; q++) {
    const optIdx = Math.floor(Math.random() * numOptions);
    const archetype = questionArchetypes[q][optIdx];
    scores[archetype] += questionWeightValues[q];
  }

  // Track score stats
  allArchetypes.forEach(a => {
    scoreAccum[a] += scores[a];
    scoreSqAccum[a] += scores[a] * scores[a];
  });

  // Detect tie
  const ranked = allArchetypes
    .map(a => ({ archetype: a, score: scores[a] }))
    .sort((a, b) => b.score - a.score);

  const topScore = ranked[0].score;
  const tied = ranked.filter(r => r.score === topScore);

  let finalRanked;
  if (tied.length >= 2) {
    // Apply tiebreaker Q11 with random answer
    tiebreakerCount++;
    const tbLetter = TB_ANSWERS[Math.floor(Math.random() * 4)];
    const tbWeights = tiebreaker.weights[tbLetter];
    const finalScores = { ...scores };
    tied.forEach(r => {
      if (tbWeights[r.archetype] !== undefined) {
        finalScores[r.archetype] += tbWeights[r.archetype];
      }
    });
    finalRanked = allArchetypes
      .map(a => ({ archetype: a, score: finalScores[a] }))
      .sort((a, b) => b.score - a.score);
  } else {
    finalRanked = ranked;
  }

  winCount[finalRanked[0].archetype]++;

  // Confidence (based on original Q1-Q10 scores)
  const delta = ranked[0].score - ranked[1].score;
  if (delta >= 30) confidenceCounts.molto_definito++;
  else if (delta >= 20) confidenceCounts.definito++;
  else if (delta >= 10) confidenceCounts.sfaccettato++;
  else confidenceCounts.molto_sfaccettato++;
}

const elapsed = Date.now() - startTime;

// Calculate results with confidence intervals
console.log(`  Tempo di esecuzione: ${elapsed}ms`);
console.log(`  Tiebreaker Q11 attivato: ${tiebreakerCount.toLocaleString()} volte (${(tiebreakerCount/N*100).toFixed(2)}%)\n`);
console.log('━'.repeat(70));
console.log('  RISULTATI (con tiebreaker Q11 integrato)');
console.log('━'.repeat(70) + '\n');

const z = 1.96; // 95% confidence
const expectedPct = 100 / allArchetypes.length;

const results = allArchetypes
  .map(a => {
    const p = winCount[a] / N;
    const se = Math.sqrt(p * (1 - p) / N);
    const ciLow = (p - z * se) * 100;
    const ciHigh = (p + z * se) * 100;
    const meanScore = scoreAccum[a] / N;
    const variance = scoreSqAccum[a] / N - meanScore * meanScore;
    const stddev = Math.sqrt(variance);
    return {
      archetype: a,
      nome: data.archetipi[a].nome,
      wins: winCount[a],
      pct: p * 100,
      ciLow,
      ciHigh,
      se: se * 100,
      meanScore,
      stddev
    };
  })
  .sort((a, b) => b.pct - a.pct);

console.log('  Archetipo           Frequenza    IC 95%              Deviazione   Punteggio medio');
console.log('  ' + '─'.repeat(82));

results.forEach(r => {
  const dev = r.pct - expectedPct;
  const sign = dev >= 0 ? '+' : '';
  const bar = '█'.repeat(Math.round(r.pct * 2));
  console.log(
    `  ${r.nome.padEnd(20)} ` +
    `${r.pct.toFixed(2).padStart(6)}%   ` +
    `[${r.ciLow.toFixed(2).padStart(5)}% - ${r.ciHigh.toFixed(2).padStart(5)}%]   ` +
    `${sign}${dev.toFixed(2).padStart(5)} pp   ` +
    `${r.meanScore.toFixed(1)} ± ${r.stddev.toFixed(1)}`
  );
});

const maxPct = results[0].pct;
const minPct = results[results.length - 1].pct;
console.log(`\n  Spread osservato: ${(maxPct - minPct).toFixed(2)} pp`);
console.log(`  Margine di errore: ±${(z * Math.sqrt(0.125 * 0.875 / N) * 100).toFixed(2)} pp per archetipo`);

// Confidence levels
console.log('\n' + '━'.repeat(70));
console.log('  DISTRIBUZIONE LIVELLI DI CONFIDENZA');
console.log('━'.repeat(70) + '\n');

Object.entries(confidenceCounts).forEach(([level, count]) => {
  const pct = (count / N * 100).toFixed(1);
  const bar = '█'.repeat(Math.round(pct));
  console.log(`  ${level.padEnd(22)} ${pct.padStart(5)}%  (${count.toLocaleString().padStart(7)})  ${bar}`);
});

// Print some example runs
console.log('\n' + '━'.repeat(70));
console.log('  ESEMPIO: 20 COMPILAZIONI CASUALI');
console.log('━'.repeat(70) + '\n');

for (let i = 0; i < 20; i++) {
  const scores = {};
  allArchetypes.forEach(a => { scores[a] = 0; });
  const answers = [];

  for (let q = 0; q < numQuestions; q++) {
    const optIdx = Math.floor(Math.random() * numOptions);
    const archetype = questionArchetypes[q][optIdx];
    scores[archetype] += questionWeightValues[q];
    answers.push(String.fromCharCode(65 + optIdx)); // A, B, C, D
  }

  const ranked = allArchetypes
    .map(a => ({ archetype: a, score: scores[a] }))
    .sort((a, b) => b.score - a.score || a.archetype.localeCompare(b.archetype));

  const delta = ranked[0].score - ranked[1].score;
  let conf;
  if (delta >= 30) conf = 'MOLTO DEF.';
  else if (delta >= 20) conf = 'DEFINITO';
  else if (delta >= 10) conf = 'SFACCETT.';
  else conf = 'MOLTO SFAC.';

  console.log(
    `  Test ${(i + 1).toString().padStart(2)}: ` +
    `[${answers.join(',')}] → ` +
    `${data.archetipi[ranked[0].archetype].nome.padEnd(18)} ` +
    `(${ranked[0].score} pts, delta ${delta.toString().padStart(2)}, ${conf})`
  );
}

// Statistical test: chi-square goodness of fit
console.log('\n' + '━'.repeat(70));
console.log('  TEST STATISTICO: Chi-quadro (goodness of fit)');
console.log('━'.repeat(70) + '\n');

const expectedCount = N / allArchetypes.length;
let chiSquare = 0;
allArchetypes.forEach(a => {
  const observed = winCount[a];
  chiSquare += Math.pow(observed - expectedCount, 2) / expectedCount;
});

// Chi-square with 7 degrees of freedom (8 categories - 1)
// Critical values: 14.07 (p=0.05), 18.48 (p=0.01), 24.32 (p=0.001)
const df = allArchetypes.length - 1;
let pValueLabel;
if (chiSquare > 24.32) pValueLabel = 'p < 0.001 (altamente significativo)';
else if (chiSquare > 18.48) pValueLabel = 'p < 0.01 (molto significativo)';
else if (chiSquare > 14.07) pValueLabel = 'p < 0.05 (significativo)';
else pValueLabel = 'p > 0.05 (non significativo)';

console.log(`  H0: tutti gli archetipi hanno la stessa probabilita (12.50%)`);
console.log(`  Chi-quadro = ${chiSquare.toFixed(2)} (df = ${df})`);
console.log(`  ${pValueLabel}`);

if (chiSquare > 14.07) {
  console.log(`\n  → Lo sbilanciamento e statisticamente significativo.`);
  console.log(`    La distribuzione NON e uniforme.`);
} else {
  console.log(`\n  → Lo sbilanciamento NON e statisticamente significativo.`);
  console.log(`    (Campione troppo piccolo o effetto troppo debole per essere rilevato)`);
}

console.log(`\n  Valori critici di riferimento (df=${df}):`);
console.log(`    14.07 → p = 0.05`);
console.log(`    18.48 → p = 0.01`);
console.log(`    24.32 → p = 0.001`);
