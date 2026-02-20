#!/usr/bin/env node
/**
 * Archetype Balance Analysis v4.0 - Exhaustive Enumeration
 *
 * Enumerates all 4^10 = 1,048,576 possible answer combinations
 * and calculates the exact probability distribution for each archetype
 * winning as primary result. Ties are resolved via tiebreaker Q11
 * with prime number weight matrix (averaged over all 4 Q11 answers).
 */

const fs = require('fs');
const path = require('path');

// Load survey data
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'survey_archetypes.json'), 'utf8')
);

const survey = data.surveys.bcb_v3;
const questions = survey.domande;
const weights = data.questionWeights;
const tiebreaker = survey.tiebreaker;
const TB_ANSWERS = ['A', 'B', 'C', 'D'];

// Extract archetype mapping per question
// questionArchetypes[q] = array of 4 archetype strings (one per option)
const questionArchetypes = questions.map(q => q.opzioni.map(o => o.archetipo));
const questionWeightValues = questions.map(q => weights[`Q${q.id}`]);

const allArchetypes = Object.keys(data.archetipi);
const numQuestions = 10;
const numOptions = 4;
const totalCombinations = Math.pow(numOptions, numQuestions); // 1,048,576

console.log('=== ARCHETYPE BALANCE ANALYSIS v4.0 (con tiebreaker Q11) ===');
console.log(`Total combinations to test: ${totalCombinations.toLocaleString()}\n`);

// Pre-analysis: weight exposure per archetype
console.log('--- Weight exposure per archetype ---');
const weightExposure = {};
const weightSquares = {};
allArchetypes.forEach(a => { weightExposure[a] = 0; weightSquares[a] = 0; });

questions.forEach((q, qi) => {
  const w = questionWeightValues[qi];
  q.opzioni.forEach(o => {
    weightExposure[o.archetipo] += w;
    weightSquares[o.archetipo] += w * w;
  });
});

allArchetypes.forEach(a => {
  console.log(`  ${a.padEnd(14)} total_weight=${weightExposure[a]}  sum_of_squares=${weightSquares[a]}`);
});
console.log();

// Counters
const winCount = {};       // How many times each archetype is primary
const soloWinCount = {};   // Wins without tie
const tieWinCount = {};    // Wins via tie-breaking
const pairCount = {};      // How many times each pair (primary, secondary) occurs
allArchetypes.forEach(a => {
  winCount[a] = 0;
  soloWinCount[a] = 0;
  tieWinCount[a] = 0;
});

// Score distribution tracking
const scoreDistributions = {};
allArchetypes.forEach(a => { scoreDistributions[a] = {}; });

// Confidence level counts
const confidenceCounts = {
  molto_definito: 0,
  definito: 0,
  sfaccettato: 0,
  molto_sfaccettato: 0
};

// Exhaustive enumeration
// Represent each combination as a number 0..4^10-1
// Digit i (base 4) = option chosen for question i

const scores = {};
let tiesTotal = 0;

for (let combo = 0; combo < totalCombinations; combo++) {
  // Reset scores
  allArchetypes.forEach(a => { scores[a] = 0; });

  // Decode combination and calculate scores
  let remaining = combo;
  for (let q = numQuestions - 1; q >= 0; q--) {
    const optionIdx = remaining % numOptions;
    remaining = Math.floor(remaining / numOptions);
    const archetype = questionArchetypes[q][optionIdx];
    scores[archetype] += questionWeightValues[q];
  }

  // Track score distributions
  allArchetypes.forEach(a => {
    const s = scores[a];
    scoreDistributions[a][s] = (scoreDistributions[a][s] || 0) + 1;
  });

  // Rank archetypes
  const ranked = allArchetypes
    .map(a => ({ archetype: a, score: scores[a] }))
    .sort((a, b) => b.score - a.score);

  const S1 = ranked[0].score;
  const S2 = ranked[1].score;
  const delta = S1 - S2;

  // Check for tie
  const tied = ranked.filter(r => r.score === S1);
  const isTie = tied.length >= 2;

  if (isTie) {
    tiesTotal++;
    // Resolve with tiebreaker Q11: count fractional wins (each Q11 answer equally likely)
    const tiedKeys = tied.map(r => r.archetype);
    TB_ANSWERS.forEach(letter => {
      const tbWeights = tiebreaker.weights[letter];
      const finalScores = { ...scores };
      tiedKeys.forEach(archKey => {
        if (tbWeights[archKey] !== undefined) {
          finalScores[archKey] += tbWeights[archKey];
        }
      });
      const finalRanked = allArchetypes
        .map(a => ({ archetype: a, score: finalScores[a] }))
        .sort((a, b) => b.score - a.score);
      const tbWinner = finalRanked[0].archetype;
      tieWinCount[tbWinner] = (tieWinCount[tbWinner] || 0) + 0.25; // 1/4 probability per Q11 answer
      winCount[tbWinner] += 0.25;
    });
  } else {
    const winner = ranked[0].archetype;
    soloWinCount[winner]++;
    winCount[winner]++;
  }

  // Track pair
  const pairKey = `${ranked[0].archetype} + ${ranked[1].archetype}`;
  pairCount[pairKey] = (pairCount[pairKey] || 0) + 1;

  // Confidence
  if (delta >= 30) confidenceCounts.molto_definito++;
  else if (delta >= 20) confidenceCounts.definito++;
  else if (delta >= 10) confidenceCounts.sfaccettato++;
  else confidenceCounts.molto_sfaccettato++;
}

// Results
console.log('=== PRIMARY ARCHETYPE DISTRIBUTION (all combinations) ===\n');
const expectedPct = (100 / allArchetypes.length).toFixed(2);
console.log(`Expected if perfectly balanced: ${expectedPct}% each\n`);

const sortedResults = allArchetypes
  .map(a => ({
    archetype: a,
    wins: winCount[a],
    pct: (winCount[a] / totalCombinations * 100).toFixed(2),
    soloWins: soloWinCount[a],
    tieWins: tieWinCount[a]
  }))
  .sort((a, b) => b.wins - a.wins);

sortedResults.forEach(r => {
  const bar = '█'.repeat(Math.round(r.pct * 2));
  const deviation = (r.pct - expectedPct).toFixed(2);
  const sign = deviation >= 0 ? '+' : '';
  console.log(
    `  ${data.archetipi[r.archetype].nome.padEnd(18)} ` +
    `${r.pct.padStart(6)}% (${r.wins.toLocaleString().padStart(9)} wins) ` +
    `${sign}${deviation}%  ` +
    `[solo: ${r.soloWins.toLocaleString()}, tie-break: ${r.tieWins.toLocaleString()}]  ` +
    `${bar}`
  );
});

console.log(`\n  Total ties resolved by tiebreaker Q11: ${tiesTotal.toLocaleString()} (${(tiesTotal/totalCombinations*100).toFixed(2)}%)`);

// Max/min ratio
const maxWins = sortedResults[0].wins;
const minWins = sortedResults[sortedResults.length - 1].wins;
const ratio = (maxWins / minWins).toFixed(3);
console.log(`  Max/Min ratio: ${ratio}x (${sortedResults[0].archetype} vs ${sortedResults[sortedResults.length - 1].archetype})`);

// Confidence distribution
console.log('\n=== CONFIDENCE LEVEL DISTRIBUTION ===\n');
Object.entries(confidenceCounts).forEach(([level, count]) => {
  console.log(`  ${level.padEnd(20)} ${(count/totalCombinations*100).toFixed(2)}% (${count.toLocaleString()})`);
});

// Top 10 most common pairs
console.log('\n=== TOP 15 PRIMARY + SECONDARY PAIRS ===\n');
const sortedPairs = Object.entries(pairCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15);

sortedPairs.forEach(([pair, count]) => {
  console.log(`  ${pair.padEnd(35)} ${(count/totalCombinations*100).toFixed(2)}% (${count.toLocaleString()})`);
});

// Score range analysis per archetype
console.log('\n=== SCORE RANGE PER ARCHETYPE ===\n');
allArchetypes.forEach(a => {
  const scores = Object.keys(scoreDistributions[a]).map(Number).sort((x, y) => x - y);
  const min = scores[0];
  const max = scores[scores.length - 1];

  // Calculate mean and std dev
  let totalScore = 0;
  let totalCount = 0;
  Object.entries(scoreDistributions[a]).forEach(([score, count]) => {
    totalScore += Number(score) * count;
    totalCount += count;
  });
  const mean = totalScore / totalCount;

  let variance = 0;
  Object.entries(scoreDistributions[a]).forEach(([score, count]) => {
    variance += Math.pow(Number(score) - mean, 2) * count;
  });
  variance /= totalCount;
  const stddev = Math.sqrt(variance);

  console.log(
    `  ${data.archetipi[a].nome.padEnd(18)} ` +
    `range=[${min}-${max}]  mean=${mean.toFixed(1)}  stddev=${stddev.toFixed(1)}  ` +
    `questions: ${questionArchetypes.map((qa, qi) => qa.includes(a) ? `Q${qi+1}(${questionWeightValues[qi]})` : null).filter(Boolean).join(', ')}`
  );
});

// Bias assessment
console.log('\n=== BIAS ASSESSMENT ===\n');
const maxPct = parseFloat(sortedResults[0].pct);
const minPct = parseFloat(sortedResults[sortedResults.length - 1].pct);
const spread = maxPct - minPct;

if (spread < 2) {
  console.log('  ✅ BILANCIAMENTO ACCETTABILE: spread < 2 punti percentuali');
} else if (spread < 5) {
  console.log('  ⚠️  SBILANCIAMENTO MODERATO: spread ' + spread.toFixed(1) + ' punti percentuali');
} else {
  console.log('  ❌ SBILANCIAMENTO SIGNIFICATIVO: spread ' + spread.toFixed(1) + ' punti percentuali');
}
console.log(`  Spread: ${minPct}% - ${maxPct}% (delta: ${spread.toFixed(2)} pp)`);

// Solo wins (no tiebreaker needed)
console.log('\n=== SOLO WINS (nessun pareggio) ===\n');
const totalSoloWins = allArchetypes.reduce((s, a) => s + soloWinCount[a], 0);
const soloResults = allArchetypes
  .map(a => ({
    archetype: a,
    wins: soloWinCount[a],
    pct: (soloWinCount[a] / totalSoloWins * 100).toFixed(2)
  }))
  .sort((a, b) => b.wins - a.wins);

soloResults.forEach(r => {
  console.log(
    `  ${data.archetipi[r.archetype].nome.padEnd(18)} ${r.pct.padStart(6)}% (${r.wins.toLocaleString().padStart(9)} solo wins)`
  );
});

// Tiebreaker wins distribution
console.log('\n=== TIEBREAKER WINS (risolti con Q11) ===\n');
const totalTieWins = allArchetypes.reduce((s, a) => s + (tieWinCount[a] || 0), 0);
if (totalTieWins > 0) {
  const tieResults = allArchetypes
    .map(a => ({
      archetype: a,
      wins: tieWinCount[a] || 0,
      pct: ((tieWinCount[a] || 0) / totalTieWins * 100).toFixed(2)
    }))
    .sort((a, b) => b.wins - a.wins);

  tieResults.forEach(r => {
    console.log(
      `  ${data.archetipi[r.archetype].nome.padEnd(18)} ${r.pct.padStart(6)}% (${r.wins.toFixed(1).padStart(9)} tie wins)`
    );
  });
} else {
  console.log('  Nessun pareggio trovato.');
}
