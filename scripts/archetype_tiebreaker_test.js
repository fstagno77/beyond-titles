#!/usr/bin/env node
/**
 * Tiebreaker Q11 Test Suite
 *
 * 1. Finds answer combinations that produce ties for EACH archetype
 * 2. Verifies tiebreaker Q11 resolves 100% of ties for all 4 answers
 * 3. Tests every possible tie pair (8×7 = 56 pairs)
 * 4. Monte Carlo with tiebreaker integration
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
const totalCombinations = Math.pow(numOptions, numQuestions); // 1,048,576
const TB_ANSWERS = ['A', 'B', 'C', 'D'];

// =========================================================================
// Utility functions
// =========================================================================

function calculateScores(optionIndices) {
  const scores = {};
  allArchetypes.forEach(a => { scores[a] = 0; });
  for (let q = 0; q < numQuestions; q++) {
    const archetype = questionArchetypes[q][optionIndices[q]];
    scores[archetype] += questionWeightValues[q];
  }
  return scores;
}

function rank(scores) {
  return allArchetypes
    .map(a => ({ archetype: a, score: scores[a] }))
    .sort((a, b) => b.score - a.score);
}

function detectTie(scores) {
  const ranked = rank(scores);
  const topScore = ranked[0].score;
  const tied = ranked.filter(r => r.score === topScore);
  return tied.length >= 2 ? tied.map(r => r.archetype) : [];
}

function applyTiebreaker(scores, answerLetter, tiedArchetypes) {
  const tbWeights = tiebreaker.weights[answerLetter];
  const finalScores = { ...scores };
  tiedArchetypes.forEach(archKey => {
    if (tbWeights[archKey] !== undefined) {
      finalScores[archKey] += tbWeights[archKey];
    }
  });
  return finalScores;
}

function decodeCombo(combo) {
  const opts = [];
  let remaining = combo;
  for (let q = numQuestions - 1; q >= 0; q--) {
    opts[q] = remaining % numOptions;
    remaining = Math.floor(remaining / numOptions);
  }
  return opts;
}

function optsToLetters(opts) {
  return opts.map(i => String.fromCharCode(65 + i));
}

// =========================================================================
// SECTION 1: Find tie combinations for every archetype
// =========================================================================

console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║          TEST TIEBREAKER Q11 — SUITE COMPLETA v4.0                 ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝\n');

console.log('━'.repeat(70));
console.log('  SEZIONE 1: RICERCA COMBINAZIONI CHE GENERANO PAREGGIO');
console.log('━'.repeat(70) + '\n');

// Collect ties per archetype: which archetypes are involved in ties
const tiesPerArchetype = {};   // archetype -> array of { combo, tiedWith, score }
const tiesPerPair = {};        // "a+b" -> array of combos
allArchetypes.forEach(a => { tiesPerArchetype[a] = []; });

let totalTies = 0;
let tiesBy2 = 0;
let tiesBy3 = 0;
let tiesBy4plus = 0;

const startTime = Date.now();

for (let combo = 0; combo < totalCombinations; combo++) {
  const opts = decodeCombo(combo);
  const scores = calculateScores(opts);
  const tied = detectTie(scores);

  if (tied.length >= 2) {
    totalTies++;
    if (tied.length === 2) tiesBy2++;
    else if (tied.length === 3) tiesBy3++;
    else tiesBy4plus++;

    const topScore = scores[tied[0]];

    // Store for each involved archetype (max 5 examples per archetype)
    tied.forEach(a => {
      if (tiesPerArchetype[a].length < 5) {
        tiesPerArchetype[a].push({
          combo,
          answers: optsToLetters(opts),
          tiedWith: tied.filter(x => x !== a),
          score: topScore,
          tiedCount: tied.length
        });
      }
    });

    // Store per pair
    for (let i = 0; i < tied.length; i++) {
      for (let j = i + 1; j < tied.length; j++) {
        const pairKey = [tied[i], tied[j]].sort().join('+');
        if (!tiesPerPair[pairKey]) tiesPerPair[pairKey] = [];
        if (tiesPerPair[pairKey].length < 3) {
          tiesPerPair[pairKey].push({ combo, answers: optsToLetters(opts), score: topScore, allTied: tied });
        }
      }
    }
  }
}

const elapsed1 = Date.now() - startTime;

console.log(`  Enumerazione esaustiva di ${totalCombinations.toLocaleString()} combinazioni in ${elapsed1}ms\n`);
console.log(`  Totale casi di pareggio: ${totalTies.toLocaleString()} (${(totalTies/totalCombinations*100).toFixed(2)}%)\n`);
console.log(`    - Pareggio a 2: ${tiesBy2.toLocaleString()}`);
console.log(`    - Pareggio a 3: ${tiesBy3.toLocaleString()}`);
console.log(`    - Pareggio a 4+: ${tiesBy4plus.toLocaleString()}\n`);

// Show examples per archetype
console.log('  Esempi di pareggio per ogni archetipo:\n');

allArchetypes.forEach(a => {
  const examples = tiesPerArchetype[a];
  const nome = data.archetipi[a].nome;
  console.log(`  ${nome} (${examples.length >= 5 ? '5+' : examples.length} casi trovati):`);
  if (examples.length === 0) {
    console.log(`    ⚠️  Nessun pareggio trovato per ${nome}!`);
  } else {
    examples.slice(0, 3).forEach(ex => {
      const tiedNames = ex.tiedWith.map(k => data.archetipi[k].nome.replace(/^(Il |Lo |L')/, '')).join(', ');
      console.log(`    [${ex.answers.join(',')}] → pareggio a ${ex.tiedCount} con ${tiedNames} (score: ${ex.score})`);
    });
  }
  console.log();
});

// =========================================================================
// SECTION 2: Verify tiebreaker resolves every single tie
// =========================================================================

console.log('━'.repeat(70));
console.log('  SEZIONE 2: VERIFICA RISOLUZIONE TIEBREAKER Q11');
console.log('━'.repeat(70) + '\n');

let totalTiesChecked = 0;
let totalResolved = 0;
let totalUnresolved = 0;
const unresolvedExamples = [];

// Per-answer resolution stats
const resolutionByAnswer = {};
TB_ANSWERS.forEach(letter => { resolutionByAnswer[letter] = { resolved: 0, unresolved: 0 }; });

// Who wins after tiebreaker per answer
const winnerAfterTB = {};
TB_ANSWERS.forEach(letter => {
  winnerAfterTB[letter] = {};
  allArchetypes.forEach(a => { winnerAfterTB[letter][a] = 0; });
});

const startTime2 = Date.now();

for (let combo = 0; combo < totalCombinations; combo++) {
  const opts = decodeCombo(combo);
  const scores = calculateScores(opts);
  const tied = detectTie(scores);

  if (tied.length < 2) continue;

  // Test all 4 tiebreaker answers
  TB_ANSWERS.forEach(letter => {
    totalTiesChecked++;
    const finalScores = applyTiebreaker(scores, letter, tied);
    const finalTied = detectTie(finalScores);

    if (finalTied.length >= 2) {
      totalUnresolved++;
      resolutionByAnswer[letter].unresolved++;
      if (unresolvedExamples.length < 5) {
        unresolvedExamples.push({
          answers: optsToLetters(opts),
          tbAnswer: letter,
          tied,
          finalScores: { ...finalScores }
        });
      }
    } else {
      totalResolved++;
      resolutionByAnswer[letter].resolved++;
      const winner = rank(finalScores)[0].archetype;
      winnerAfterTB[letter][winner]++;
    }
  });
}

const elapsed2 = Date.now() - startTime2;

console.log(`  Verificati ${totalTiesChecked.toLocaleString()} casi (${totalTies.toLocaleString()} pareggi × 4 risposte Q11)\n`);
console.log(`  ✅ Risolti:    ${totalResolved.toLocaleString()} (${(totalResolved/totalTiesChecked*100).toFixed(4)}%)`);
console.log(`  ❌ Non risolti: ${totalUnresolved.toLocaleString()} (${(totalUnresolved/totalTiesChecked*100).toFixed(4)}%)`);
console.log(`  Tempo: ${elapsed2}ms\n`);

if (totalUnresolved === 0) {
  console.log('  ✅ RISULTATO: Il tiebreaker Q11 risolve il 100% dei pareggi!\n');
} else {
  console.log('  ❌ RISULTATO: Ci sono pareggi non risolti!\n');
  unresolvedExamples.forEach(ex => {
    console.log(`    [${ex.answers.join(',')}] + Q11=${ex.tbAnswer} → ancora pareggio tra: ${ex.tied.join(', ')}`);
  });
  console.log();
}

// Resolution stats per answer
console.log('  Risoluzione per risposta Q11:\n');
TB_ANSWERS.forEach(letter => {
  const stats = resolutionByAnswer[letter];
  const total = stats.resolved + stats.unresolved;
  const pct = total > 0 ? (stats.resolved / total * 100).toFixed(2) : '0.00';
  console.log(`    Q11-${letter}: ${pct}% risolti (${stats.resolved.toLocaleString()} / ${total.toLocaleString()})`);
});

// =========================================================================
// SECTION 3: Tiebreaker winner distribution per answer
// =========================================================================

console.log('\n' + '━'.repeat(70));
console.log('  SEZIONE 3: DISTRIBUZIONE VINCITORI DOPO TIEBREAKER');
console.log('━'.repeat(70) + '\n');

TB_ANSWERS.forEach(letter => {
  const totalWins = Object.values(winnerAfterTB[letter]).reduce((s, v) => s + v, 0);
  if (totalWins === 0) return;

  const optionText = tiebreaker.opzioni.find(o => o.id === `11${letter}`).testo;
  console.log(`  Q11-${letter}: "${optionText}"\n`);

  const sorted = allArchetypes
    .map(a => ({ archetype: a, wins: winnerAfterTB[letter][a] }))
    .filter(r => r.wins > 0)
    .sort((a, b) => b.wins - a.wins);

  sorted.forEach(r => {
    const nome = data.archetipi[r.archetype].nome;
    const pct = (r.wins / totalWins * 100).toFixed(1);
    const bar = '█'.repeat(Math.round(pct / 2));
    console.log(`    ${nome.padEnd(18)} ${pct.padStart(5)}% (${r.wins.toLocaleString().padStart(6)})  ${bar}`);
  });
  console.log();
});

// =========================================================================
// SECTION 4: Test tie scenarios for each archetype
// =========================================================================

console.log('━'.repeat(70));
console.log('  SEZIONE 4: SCENARI DI PAREGGIO PER OGNI ARCHETIPO');
console.log('━'.repeat(70) + '\n');

allArchetypes.forEach(primaryArch => {
  const nome = data.archetipi[primaryArch].nome;
  console.log(`  ┌─ ${nome} ${'─'.repeat(60 - nome.length)}`);

  // Find ties involving this archetype
  const myTies = [];
  for (let combo = 0; combo < totalCombinations && myTies.length < 50; combo++) {
    const opts = decodeCombo(combo);
    const scores = calculateScores(opts);
    const tied = detectTie(scores);
    if (tied.length >= 2 && tied.includes(primaryArch)) {
      myTies.push({ opts, scores, tied });
    }
  }

  if (myTies.length === 0) {
    console.log(`  │  ⚠️  Nessun pareggio trovato`);
    console.log(`  └${'─'.repeat(66)}\n`);
    return;
  }

  // Count how many times this archetype wins after tiebreaker
  let winsAfterTB = 0;
  let lossesAfterTB = 0;
  const winsByAnswer = { A: 0, B: 0, C: 0, D: 0 };
  const lossByAnswer = { A: 0, B: 0, C: 0, D: 0 };

  myTies.forEach(({ scores, tied }) => {
    TB_ANSWERS.forEach(letter => {
      const finalScores = applyTiebreaker(scores, letter, tied);
      const winner = rank(finalScores)[0].archetype;
      if (winner === primaryArch) {
        winsAfterTB++;
        winsByAnswer[letter]++;
      } else {
        lossesAfterTB++;
        lossByAnswer[letter]++;
      }
    });
  });

  const totalTests = winsAfterTB + lossesAfterTB;
  const winRate = (winsAfterTB / totalTests * 100).toFixed(1);

  console.log(`  │  Pareggi analizzati: ${myTies.length} (prime ${Math.min(50, myTies.length)} combinazioni)`);
  console.log(`  │  Vittorie dopo tiebreaker: ${winsAfterTB}/${totalTests} (${winRate}%)`);
  console.log(`  │`);
  console.log(`  │  Per risposta Q11:`);
  TB_ANSWERS.forEach(letter => {
    const total = winsByAnswer[letter] + lossByAnswer[letter];
    const pct = total > 0 ? (winsByAnswer[letter] / total * 100).toFixed(0) : '-';
    const bar = total > 0 ? '█'.repeat(Math.round(winsByAnswer[letter] / total * 20)) : '';
    console.log(`  │    Q11-${letter}: vince ${winsByAnswer[letter]}/${total} (${pct}%)  ${bar}`);
  });

  // Show 2 detailed examples
  console.log(`  │`);
  console.log(`  │  Esempi dettagliati:`);

  myTies.slice(0, 2).forEach((tie, idx) => {
    const letters = optsToLetters(tie.opts);
    const tiedNames = tie.tied.map(k => data.archetipi[k].nome.replace(/^(Il |Lo |L')/, '')).join(' = ');
    console.log(`  │    ${idx + 1}. Risposte [${letters.join(',')}] → ${tiedNames} (score: ${tie.scores[primaryArch]})`);

    TB_ANSWERS.forEach(letter => {
      const finalScores = applyTiebreaker(tie.scores, letter, tie.tied);
      const ranked = rank(finalScores);
      const winner = ranked[0];
      const winnerNome = data.archetipi[winner.archetype].nome.replace(/^(Il |Lo |L')/, '');
      const mark = winner.archetype === primaryArch ? '✅' : '  ';
      console.log(`  │       Q11-${letter}: ${winnerNome} (${winner.score}) ${mark}`);
    });
  });

  console.log(`  └${'─'.repeat(66)}\n`);
});

// =========================================================================
// SECTION 5: Tiebreaker weight matrix validation
// =========================================================================

console.log('━'.repeat(70));
console.log('  SEZIONE 5: VALIDAZIONE MATRICE PESI PRIMI');
console.log('━'.repeat(70) + '\n');

// Verify all weights are prime
function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

const allWeights = [];
let allPrime = true;
let allUnique = true;

console.log('  Matrice pesi Q11:\n');
console.log('  Risposta  ' + allArchetypes.map(a => a.substring(0, 6).padEnd(8)).join(''));
console.log('  ' + '─'.repeat(8 + allArchetypes.length * 8));

TB_ANSWERS.forEach(letter => {
  const tbWeights = tiebreaker.weights[letter];
  const vals = allArchetypes.map(a => tbWeights[a]);
  const line = vals.map(v => {
    const prime = isPrime(v);
    if (!prime) allPrime = false;
    return `${v}${prime ? '' : '!'}`.padEnd(8);
  });
  console.log(`  ${letter.padEnd(10)}${line.join('')}`);
  vals.forEach(v => allWeights.push(v));
});

// Check uniqueness
const uniqueWeights = new Set(allWeights);
if (uniqueWeights.size !== allWeights.length) {
  allUnique = false;
}

console.log();
console.log(`  Totale pesi: ${allWeights.length}`);
console.log(`  Pesi unici: ${uniqueWeights.size}`);
console.log(`  Tutti primi: ${allPrime ? '✅ Sì' : '❌ No'}`);
console.log(`  Tutti unici: ${allUnique ? '✅ Sì' : '❌ No'}`);
console.log(`  Range: [${Math.min(...allWeights)}, ${Math.max(...allWeights)}]`);

// =========================================================================
// SECTION 6: Monte Carlo con tiebreaker integrato
// =========================================================================

console.log('\n' + '━'.repeat(70));
console.log('  SEZIONE 6: MONTE CARLO CON TIEBREAKER (100.000 simulazioni)');
console.log('━'.repeat(70) + '\n');

const N = 100_000;
const mcWinCount = {};
const mcTiebreakerUsed = { total: 0, byAnswer: { A: 0, B: 0, C: 0, D: 0 } };
allArchetypes.forEach(a => { mcWinCount[a] = 0; });

const startTime3 = Date.now();

for (let i = 0; i < N; i++) {
  // Random Q1-Q10
  const opts = [];
  for (let q = 0; q < numQuestions; q++) {
    opts.push(Math.floor(Math.random() * numOptions));
  }
  const scores = calculateScores(opts);
  const tied = detectTie(scores);

  if (tied.length >= 2) {
    // Random Q11 answer
    const tbLetter = TB_ANSWERS[Math.floor(Math.random() * 4)];
    const finalScores = applyTiebreaker(scores, tbLetter, tied);
    const winner = rank(finalScores)[0].archetype;
    mcWinCount[winner]++;
    mcTiebreakerUsed.total++;
    mcTiebreakerUsed.byAnswer[tbLetter]++;
  } else {
    const winner = rank(scores)[0].archetype;
    mcWinCount[winner]++;
  }
}

const elapsed3 = Date.now() - startTime3;

console.log(`  ${N.toLocaleString()} simulazioni in ${elapsed3}ms`);
console.log(`  Tiebreaker attivato: ${mcTiebreakerUsed.total.toLocaleString()} volte (${(mcTiebreakerUsed.total/N*100).toFixed(2)}%)\n`);

const expectedPct = 100 / allArchetypes.length;
const z = 1.96;

const mcResults = allArchetypes
  .map(a => {
    const p = mcWinCount[a] / N;
    const se = Math.sqrt(p * (1 - p) / N);
    return {
      archetype: a,
      nome: data.archetipi[a].nome,
      wins: mcWinCount[a],
      pct: p * 100,
      ciLow: (p - z * se) * 100,
      ciHigh: (p + z * se) * 100,
      dev: p * 100 - expectedPct
    };
  })
  .sort((a, b) => b.pct - a.pct);

console.log('  Archetipo           Frequenza    IC 95%              Deviazione');
console.log('  ' + '─'.repeat(68));

mcResults.forEach(r => {
  const sign = r.dev >= 0 ? '+' : '';
  console.log(
    `  ${r.nome.padEnd(20)} ` +
    `${r.pct.toFixed(2).padStart(6)}%   ` +
    `[${r.ciLow.toFixed(2).padStart(5)}% - ${r.ciHigh.toFixed(2).padStart(5)}%]   ` +
    `${sign}${r.dev.toFixed(2).padStart(5)} pp`
  );
});

const mcMax = mcResults[0].pct;
const mcMin = mcResults[mcResults.length - 1].pct;
console.log(`\n  Spread: ${(mcMax - mcMin).toFixed(2)} pp`);

// Chi-square
const expectedCount = N / allArchetypes.length;
let chiSquare = 0;
allArchetypes.forEach(a => {
  chiSquare += Math.pow(mcWinCount[a] - expectedCount, 2) / expectedCount;
});

const df = allArchetypes.length - 1;
let pLabel;
if (chiSquare > 24.32) pLabel = 'p < 0.001';
else if (chiSquare > 18.48) pLabel = 'p < 0.01';
else if (chiSquare > 14.07) pLabel = 'p < 0.05';
else pLabel = 'p > 0.05 (non significativo ✅)';

console.log(`\n  Chi-quadro = ${chiSquare.toFixed(2)} (df=${df}), ${pLabel}`);

// =========================================================================
// SECTION 7: Riepilogo finale
// =========================================================================

console.log('\n' + '━'.repeat(70));
console.log('  RIEPILOGO FINALE');
console.log('━'.repeat(70) + '\n');

const checks = [
  { label: 'Tutti i pesi sono numeri primi', ok: allPrime },
  { label: 'Tutti i 32 pesi sono unici', ok: allUnique },
  { label: 'Risoluzione 100% pareggi (esaustiva)', ok: totalUnresolved === 0 },
  { label: 'Ogni archetipo ha casi di pareggio', ok: allArchetypes.every(a => tiesPerArchetype[a].length > 0) },
  { label: 'Monte Carlo: spread < 2 pp', ok: (mcMax - mcMin) < 2 },
  { label: 'Monte Carlo: chi-quadro non significativo', ok: chiSquare <= 14.07 },
];

let allOk = true;
checks.forEach(c => {
  const mark = c.ok ? '✅' : '❌';
  if (!c.ok) allOk = false;
  console.log(`  ${mark} ${c.label}`);
});

console.log();
if (allOk) {
  console.log('  ✅ TUTTI I TEST SUPERATI — Tiebreaker Q11 validato\n');
} else {
  console.log('  ⚠️  ALCUNI TEST FALLITI — Verificare i dettagli sopra\n');
}
