#!/usr/bin/env node
/**
 * Monte Carlo Random Test - Archetype Balance v4.0
 *
 * Simulates N random survey completions and reports results
 * with confidence intervals. Compares results WITH and WITHOUT
 * tiebreaker Q11 side by side.
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

const N = 1_000_000;

console.log('╔══════════════════════════════════════════════════════════════════════════════════╗');
console.log('║       TEST MONTE CARLO v4.0 - CONFRONTO CON / SENZA TIEBREAKER Q11            ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════════╝\n');
console.log(`  Numero simulazioni: ${N.toLocaleString()}`);
console.log(`  Metodo: 10 risposte casuali (uniform) + Q11 tiebreaker se pareggio`);
console.log(`  Intervallo di confidenza: 95% (z = 1.96)\n`);

// Two sets of win counters
const winNoTB = {};   // without tiebreaker (first alphabetical wins on tie)
const winWithTB = {};  // with tiebreaker Q11
const scoreAccum = {};
const scoreSqAccum = {};
allArchetypes.forEach(a => {
  winNoTB[a] = 0;
  winWithTB[a] = 0;
  scoreAccum[a] = 0;
  scoreSqAccum[a] = 0;
});

const confidenceCounts = { molto_definito: 0, definito: 0, sfaccettato: 0, molto_sfaccettato: 0 };
let tiebreakerCount = 0;
let tiebreaker3way = 0;
let tiebreaker4plus = 0;

const startTime = Date.now();

for (let i = 0; i < N; i++) {
  const scores = {};
  allArchetypes.forEach(a => { scores[a] = 0; });

  for (let q = 0; q < numQuestions; q++) {
    const optIdx = Math.floor(Math.random() * numOptions);
    const archetype = questionArchetypes[q][optIdx];
    scores[archetype] += questionWeightValues[q];
  }

  allArchetypes.forEach(a => {
    scoreAccum[a] += scores[a];
    scoreSqAccum[a] += scores[a] * scores[a];
  });

  const ranked = allArchetypes
    .map(a => ({ archetype: a, score: scores[a] }))
    .sort((a, b) => b.score - a.score || a.archetype.localeCompare(b.archetype));

  const topScore = ranked[0].score;
  const tied = ranked.filter(r => r.score === topScore);

  // --- WITHOUT tiebreaker: first in sort order wins ---
  winNoTB[ranked[0].archetype]++;

  // --- WITH tiebreaker ---
  if (tied.length >= 2) {
    tiebreakerCount++;
    if (tied.length === 3) tiebreaker3way++;
    if (tied.length >= 4) tiebreaker4plus++;

    const tbLetter = TB_ANSWERS[Math.floor(Math.random() * 4)];
    const tbWeights = tiebreaker.weights[tbLetter];
    const finalScores = { ...scores };
    tied.forEach(r => {
      if (tbWeights[r.archetype] !== undefined) {
        finalScores[r.archetype] += tbWeights[r.archetype];
      }
    });
    const finalRanked = allArchetypes
      .map(a => ({ archetype: a, score: finalScores[a] }))
      .sort((a, b) => b.score - a.score);
    winWithTB[finalRanked[0].archetype]++;
  } else {
    winWithTB[ranked[0].archetype]++;
  }

  // Confidence (based on Q1-Q10 scores only)
  const delta = ranked[0].score - ranked[1].score;
  if (delta >= 30) confidenceCounts.molto_definito++;
  else if (delta >= 20) confidenceCounts.definito++;
  else if (delta >= 10) confidenceCounts.sfaccettato++;
  else confidenceCounts.molto_sfaccettato++;
}

const elapsed = Date.now() - startTime;

console.log(`  Tempo di esecuzione: ${elapsed}ms`);
console.log(`  Tiebreaker Q11 attivato: ${tiebreakerCount.toLocaleString()} volte (${(tiebreakerCount/N*100).toFixed(2)}%)`);
console.log(`    di cui 3-way: ${tiebreaker3way.toLocaleString()}, 4+ way: ${tiebreaker4plus.toLocaleString()}`);

// === COMPARISON TABLE ===
console.log('\n' + '━'.repeat(86));
console.log('  CONFRONTO: SENZA TIEBREAKER vs CON TIEBREAKER Q11');
console.log('━'.repeat(86) + '\n');

const z = 1.96;
const expectedPct = 100 / allArchetypes.length;

const comparison = allArchetypes.map(a => {
  const pNo = winNoTB[a] / N;
  const pWith = winWithTB[a] / N;
  const seNo = Math.sqrt(pNo * (1 - pNo) / N);
  const seWith = Math.sqrt(pWith * (1 - pWith) / N);
  const meanScore = scoreAccum[a] / N;
  const variance = scoreSqAccum[a] / N - meanScore * meanScore;
  return {
    archetype: a,
    nome: data.archetipi[a].nome,
    pctNo: pNo * 100,
    ciNoLow: (pNo - z * seNo) * 100,
    ciNoHigh: (pNo + z * seNo) * 100,
    pctWith: pWith * 100,
    ciWithLow: (pWith - z * seWith) * 100,
    ciWithHigh: (pWith + z * seWith) * 100,
    delta: (pWith - pNo) * 100,
    meanScore,
    stddev: Math.sqrt(variance)
  };
}).sort((a, b) => b.pctWith - a.pctWith);

console.log('                        SENZA Tiebreaker          CON Tiebreaker            Differenza');
console.log('  Archetipo           Freq.%    IC 95%           Freq.%    IC 95%             (TB-noTB)');
console.log('  ' + '─'.repeat(84));

comparison.forEach(r => {
  const diffSign = r.delta >= 0 ? '+' : '';
  console.log(
    `  ${r.nome.padEnd(20)} ` +
    `${r.pctNo.toFixed(2).padStart(6)}%  ` +
    `[${r.ciNoLow.toFixed(2).padStart(5)}-${r.ciNoHigh.toFixed(2).padStart(5)}]   ` +
    `${r.pctWith.toFixed(2).padStart(6)}%  ` +
    `[${r.ciWithLow.toFixed(2).padStart(5)}-${r.ciWithHigh.toFixed(2).padStart(5)}]   ` +
    `${diffSign}${r.delta.toFixed(2).padStart(5)} pp`
  );
});

const maxWith = comparison[0].pctWith;
const minWith = comparison[comparison.length - 1].pctWith;
const maxNo = Math.max(...comparison.map(r => r.pctNo));
const minNo = Math.min(...comparison.map(r => r.pctNo));
console.log(`\n  Spread senza TB: ${(maxNo - minNo).toFixed(2)} pp`);
console.log(`  Spread con TB:   ${(maxWith - minWith).toFixed(2)} pp`);
console.log(`  Margine di errore: ±${(z * Math.sqrt(0.125 * 0.875 / N) * 100).toFixed(2)} pp per archetipo`);

// === DEVIAZIONE DA ATTESO ===
console.log('\n' + '━'.repeat(86));
console.log('  DEVIAZIONE DAL VALORE ATTESO (12.50%)');
console.log('━'.repeat(86) + '\n');

console.log('  Archetipo             Senza TB    Con TB     Punteggio medio');
console.log('  ' + '─'.repeat(60));

comparison.sort((a, b) => b.pctWith - a.pctWith).forEach(r => {
  const devNo = r.pctNo - expectedPct;
  const devWith = r.pctWith - expectedPct;
  const sNo = devNo >= 0 ? '+' : '';
  const sW = devWith >= 0 ? '+' : '';
  console.log(
    `  ${r.nome.padEnd(20)} ` +
    `${sNo}${devNo.toFixed(2).padStart(5)} pp   ` +
    `${sW}${devWith.toFixed(2).padStart(5)} pp   ` +
    `${r.meanScore.toFixed(1)} ± ${r.stddev.toFixed(1)}`
  );
});

// === CONFIDENCE LEVELS ===
console.log('\n' + '━'.repeat(86));
console.log('  DISTRIBUZIONE LIVELLI DI CONFIDENZA (pre-tiebreaker, solo Q1-Q10)');
console.log('━'.repeat(86) + '\n');

Object.entries(confidenceCounts).forEach(([level, count]) => {
  const pct = (count / N * 100).toFixed(1);
  const bar = '█'.repeat(Math.round(pct));
  console.log(`  ${level.padEnd(22)} ${pct.padStart(5)}%  (${count.toLocaleString().padStart(7)})  ${bar}`);
});

// === CHI-SQUARE for both ===
console.log('\n' + '━'.repeat(86));
console.log('  TEST CHI-QUADRO (goodness of fit)');
console.log('━'.repeat(86) + '\n');

const expectedCount = N / allArchetypes.length;
let chiNo = 0, chiWith = 0;
allArchetypes.forEach(a => {
  chiNo += Math.pow(winNoTB[a] - expectedCount, 2) / expectedCount;
  chiWith += Math.pow(winWithTB[a] - expectedCount, 2) / expectedCount;
});

const df = allArchetypes.length - 1;
const pLabel = (chi) => {
  if (chi > 24.32) return 'p < 0.001';
  if (chi > 18.48) return 'p < 0.01';
  if (chi > 14.07) return 'p < 0.05';
  return 'p > 0.05 (n.s.)';
};

console.log(`  H0: tutti gli archetipi hanno la stessa probabilita (12.50%)\n`);
console.log(`  Senza tiebreaker:  Chi² = ${chiNo.toFixed(2).padStart(8)}  (df=${df})  ${pLabel(chiNo)}`);
console.log(`  Con tiebreaker:    Chi² = ${chiWith.toFixed(2).padStart(8)}  (df=${df})  ${pLabel(chiWith)}`);
console.log(`\n  Valori critici (df=${df}): 14.07 (p=0.05), 18.48 (p=0.01), 24.32 (p=0.001)`);

if (chiWith < chiNo) {
  console.log(`\n  → Il tiebreaker Q11 MIGLIORA il bilanciamento (Chi² ridotto di ${(chiNo - chiWith).toFixed(2)})`);
} else {
  console.log(`\n  → Il tiebreaker Q11 PEGGIORA leggermente il bilanciamento (Chi² aumentato di ${(chiWith - chiNo).toFixed(2)})`);
}

// === EXAMPLE RUNS ===
console.log('\n' + '━'.repeat(86));
console.log('  ESEMPIO: 20 COMPILAZIONI CASUALI');
console.log('━'.repeat(86) + '\n');

for (let i = 0; i < 20; i++) {
  const scores = {};
  allArchetypes.forEach(a => { scores[a] = 0; });
  const answers = [];

  for (let q = 0; q < numQuestions; q++) {
    const optIdx = Math.floor(Math.random() * numOptions);
    const archetype = questionArchetypes[q][optIdx];
    scores[archetype] += questionWeightValues[q];
    answers.push(String.fromCharCode(65 + optIdx));
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

  const tie = ranked.filter(r => r.score === ranked[0].score).length >= 2 ? ' [TIE]' : '';

  console.log(
    `  Test ${(i + 1).toString().padStart(2)}: ` +
    `[${answers.join(',')}] → ` +
    `${data.archetipi[ranked[0].archetype].nome.padEnd(18)} ` +
    `(${ranked[0].score} pts, Δ${delta.toString().padStart(2)}, ${conf})${tie}`
  );
}
