#!/usr/bin/env node
/**
 * Sensitivity Analysis - How much does each question actually influence the result?
 *
 * For each question, calculates: if you change ONLY that answer,
 * how often does the primary archetype change?
 */

const fs = require('fs');
const path = require('path');

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'survey_archetypes.json'), 'utf8')
);

const questions = data.surveys.bcb_v3.domande;
const weights = data.questionWeights;
const allArchetypes = Object.keys(data.archetipi);
const questionArchetypes = questions.map(q => q.opzioni.map(o => o.archetipo));
const questionWeightValues = questions.map(q => weights[`Q${q.id}`]);
const numQuestions = 10;
const numOptions = 4;
const totalCombinations = Math.pow(numOptions, numQuestions);

// For each question, count how often changing just that answer flips the primary archetype
console.log('╔══════════════════════════════════════════════════════════════════════════╗');
console.log('║           ANALISI DI SENSIBILITÀ - IMPATTO PER DOMANDA                ║');
console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

// Sample-based approach for sensitivity (exhaustive would be too slow for pairwise)
const sampleSize = 100000;
const flipCounts = new Array(numQuestions).fill(0);
const flipSamples = new Array(numQuestions).fill(0);

function getWinner(answers) {
  const scores = {};
  allArchetypes.forEach(a => { scores[a] = 0; });
  answers.forEach((optIdx, qi) => {
    scores[questionArchetypes[qi][optIdx]] += questionWeightValues[qi];
  });
  return allArchetypes
    .map(a => ({ archetype: a, score: scores[a] }))
    .sort((a, b) => b.score - a.score || a.archetype.localeCompare(b.archetype))[0].archetype;
}

for (let s = 0; s < sampleSize; s++) {
  // Random base answers
  const baseAnswers = Array.from({ length: numQuestions }, () => Math.floor(Math.random() * numOptions));
  const baseWinner = getWinner(baseAnswers);

  for (let q = 0; q < numQuestions; q++) {
    // Try all other options for this question
    for (let opt = 0; opt < numOptions; opt++) {
      if (opt === baseAnswers[q]) continue;
      const modified = [...baseAnswers];
      modified[q] = opt;
      const newWinner = getWinner(modified);
      flipSamples[q]++;
      if (newWinner !== baseWinner) {
        flipCounts[q]++;
      }
    }
  }
}

console.log('  Se cambio UNA SOLA risposta, con che probabilità cambia il risultato?\n');
console.log('  Domanda   Peso   Flip%    Impatto   Barra');
console.log('  ' + '─'.repeat(60));

const flipRates = questionWeightValues.map((w, q) => ({
  q: q + 1,
  weight: w,
  flipRate: (flipCounts[q] / flipSamples[q] * 100)
})).sort((a, b) => b.flipRate - a.flipRate);

flipRates.forEach(fr => {
  const bar = '█'.repeat(Math.round(fr.flipRate));
  let impact;
  if (fr.flipRate > 40) impact = '🔴 ALTO';
  else if (fr.flipRate > 25) impact = '🟡 MEDIO';
  else impact = '🟢 BASSO';
  console.log(
    `  Q${fr.q.toString().padEnd(8)} ${fr.weight.toString().padStart(4)}   ${fr.flipRate.toFixed(1).padStart(5)}%   ${impact.padEnd(12)} ${bar}`
  );
});

// Group analysis: what if you change answers on light vs heavy questions?
console.log('\n\n  Cosa succede cambiando risposte in GRUPPI di domande?\n');

const groups = [
  { name: 'Solo Q1+Q6+Q10 (leggere, peso 6)', questions: [0, 5, 9] },
  { name: 'Solo Q4+Q5+Q8 (pesanti)', questions: [3, 4, 7] },
  { name: 'Solo Q2+Q3+Q7+Q9 (medie)', questions: [1, 2, 6, 8] },
];

const groupSampleSize = 50000;

groups.forEach(group => {
  let flips = 0;

  for (let s = 0; s < groupSampleSize; s++) {
    const baseAnswers = Array.from({ length: numQuestions }, () => Math.floor(Math.random() * numOptions));
    const baseWinner = getWinner(baseAnswers);

    // Change all answers in the group to random different values
    const modified = [...baseAnswers];
    group.questions.forEach(q => {
      let newOpt;
      do { newOpt = Math.floor(Math.random() * numOptions); } while (newOpt === baseAnswers[q]);
      modified[q] = newOpt;
    });
    const newWinner = getWinner(modified);
    if (newWinner !== baseWinner) flips++;
  }

  const flipPct = (flips / groupSampleSize * 100).toFixed(1);
  console.log(`  ${group.name}`);
  console.log(`    → Cambio risultato nel ${flipPct}% dei casi\n`);
});

// Dominance analysis: which archetypes tend to co-occur as top results?
console.log('\n╔══════════════════════════════════════════════════════════════════════════╗');
console.log('║           ANALISI CORRELAZIONE TRA ARCHETIPI                           ║');
console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

console.log('  Archetipi che competono nelle STESSE domande (alta correlazione)\n');

// Build co-occurrence matrix
const cooccurrence = {};
allArchetypes.forEach(a => { cooccurrence[a] = {}; allArchetypes.forEach(b => { cooccurrence[a][b] = 0; }); });

questionArchetypes.forEach((qa, qi) => {
  for (let i = 0; i < qa.length; i++) {
    for (let j = i + 1; j < qa.length; j++) {
      cooccurrence[qa[i]][qa[j]]++;
      cooccurrence[qa[j]][qa[i]]++;
    }
  }
});

// Show which pairs share the most questions
const pairs = [];
for (let i = 0; i < allArchetypes.length; i++) {
  for (let j = i + 1; j < allArchetypes.length; j++) {
    const a = allArchetypes[i];
    const b = allArchetypes[j];
    pairs.push({ a, b, shared: cooccurrence[a][b] });
  }
}
pairs.sort((a, b) => b.shared - a.shared);

console.log('  Coppia                              Domande condivise   Interpretazione');
console.log('  ' + '─'.repeat(68));
pairs.forEach(p => {
  const sharedQs = [];
  questionArchetypes.forEach((qa, qi) => {
    if (qa.includes(p.a) && qa.includes(p.b)) sharedQs.push(`Q${qi+1}`);
  });
  const interp = p.shared >= 4 ? '⚠️ ALTA competizione' : p.shared >= 3 ? 'Competizione moderata' : p.shared <= 1 ? 'Quasi indipendenti' : 'Bassa competizione';
  console.log(
    `  ${(data.archetipi[p.a].nome + ' / ' + data.archetipi[p.b].nome).padEnd(38)} ${p.shared}/5 (${sharedQs.join(', ').padEnd(16)}) ${interp}`
  );
});
