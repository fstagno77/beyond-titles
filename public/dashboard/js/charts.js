/* ==========================================================================
   Beyond — Survey Analytics Dashboard
   charts.js — inizializzazione e aggiornamento di tutti i grafici Chart.js
   ========================================================================== */

const DashCharts = (function () {
  'use strict';

  // -------------------------------------------------------------------------
  // Colori archetypes (palette brand-consistente)
  // -------------------------------------------------------------------------
  const ARCH_COLORS = {
    capitano:     '#0056b3',
    pioniere:     '#27ae60',
    risolutore:   '#e67e22',
    connettore:   '#9b59b6',
    pragmatico:   '#e74c3c',
    artigiano:    '#1abc9c',
    stratega:     '#f39c12',
    collaboratore:'#95a5a6',
  };

  const TARGET_COLORS = {
    b2b:     '#0056b3',
    b2c:     '#27ae60',
    '0':     '#adb5bd',
  };

  const TARGET_LABELS = {
    b2b: 'B2B',
    b2c: 'B2C',
    '0': 'General',
  };

  const ANSWER_COLORS = {
    A: '#0056b3',
    B: '#27ae60',
    C: '#e67e22',
    D: '#9b59b6',
  };

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  const ARCHETYPES_ORDER = [
    'capitano','pioniere','risolutore','connettore',
    'pragmatico','artigiano','stratega','collaboratore',
  ];

  const ARCH_NAMES = {
    capitano:     'The Captain',
    pioniere:     'The Pioneer',
    risolutore:   'The Problem Solver',
    connettore:   'The Connector',
    pragmatico:   'The Pragmatist',
    artigiano:    'The Craftsman',
    stratega:     'The Strategist',
    collaboratore:'The Collaborator',
  };

  function archLabels() {
    return ARCHETYPES_ORDER.map(k => ARCH_NAMES[k]);
  }

  function archValues(byArch) {
    return ARCHETYPES_ORDER.map(k => byArch[k] ?? 0);
  }

  function archColors(alpha = 1) {
    return ARCHETYPES_ORDER.map(k =>
      alpha < 1 ? hexToRgba(ARCH_COLORS[k], alpha) : ARCH_COLORS[k]
    );
  }

  // Plugin datalabels default per bar charts
  const DATALABELS_BAR = {
    anchor: 'end',
    align: 'end',
    formatter: (value, ctx) => {
      const total = ctx.dataset.data.reduce((s, v) => s + v, 0);
      if (!total || value === 0) return '';
      return (value / total * 100).toFixed(1) + '%';
    },
    font: { size: 11, weight: '600' },
    color: '#555',
    padding: { right: 4 },
  };

  const DATALABELS_DOUGHNUT = {
    formatter: (value, ctx) => {
      const total = ctx.chart.data.datasets[0].data.reduce((s, v) => s + v, 0);
      if (!total || value === 0) return '';
      const pct = (value / total * 100).toFixed(1);
      return pct + '%';
    },
    font: { size: 12, weight: '600' },
    color: '#fff',
  };

  const BASE_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
  };

  // -------------------------------------------------------------------------
  // Registro grafici
  // -------------------------------------------------------------------------
  const charts = {};

  function destroy(id) {
    if (charts[id]) {
      charts[id].destroy();
      delete charts[id];
    }
  }

  // -------------------------------------------------------------------------
  // 1. Archetypes globali — bar orizzontale
  // -------------------------------------------------------------------------
  function initGlobalArchetypes() {
    const ctx = document.getElementById('chartGlobalArchetypes').getContext('2d');
    charts.globalArchetypes = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: archLabels(),
        datasets: [{
          label: 'Completions',
          data: new Array(8).fill(0),
          backgroundColor: archColors(0.85),
          borderColor: archColors(),
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        ...BASE_OPTIONS,
        indexAxis: 'y',
        scales: {
          x: { grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 } } },
          y: { grid: { display: false }, ticks: { font: { size: 12 } } },
        },
        plugins: {
          ...BASE_OPTIONS.plugins,
          datalabels: DATALABELS_BAR,
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  function updateGlobalArchetypes(byArch) {
    const c = charts.globalArchetypes;
    c.data.datasets[0].data = archValues(byArch);
    c.update();
  }

  // -------------------------------------------------------------------------
  // 2. Audience globale — doughnut
  // -------------------------------------------------------------------------
  function initGlobalAudience() {
    const ctx = document.getElementById('chartGlobalAudience').getContext('2d');
    const keys = ['b2b', 'b2c', '0'];
    charts.globalAudience = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: keys.map(k => TARGET_LABELS[k]),
        datasets: [{
          data: new Array(3).fill(0),
          backgroundColor: keys.map(k => TARGET_COLORS[k]),
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 6,
        }],
      },
      options: {
        ...BASE_OPTIONS,
        cutout: '60%',
        plugins: {
          ...BASE_OPTIONS.plugins,
          legend: {
            display: true,
            position: 'right',
            labels: { font: { size: 12 }, padding: 12 },
          },
          datalabels: DATALABELS_DOUGHNUT,
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  function updateGlobalAudience(byTarget) {
    const c = charts.globalAudience;
    c.data.datasets[0].data = ['b2b', 'b2c', '0'].map(k => byTarget[k] ?? 0);
    c.update();
  }

  // -------------------------------------------------------------------------
  // 3. Top 10 countries — bar verticale
  // -------------------------------------------------------------------------
  function initTopCountries() {
    const ctx = document.getElementById('chartTopCountries').getContext('2d');
    charts.topCountries = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Completions',
          data: [],
          backgroundColor: hexToRgba('#0056b3', 0.8),
          borderColor: '#0056b3',
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        ...BASE_OPTIONS,
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 12 }, maxRotation: 0 } },
          y: { grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 } } },
        },
        plugins: {
          ...BASE_OPTIONS.plugins,
          datalabels: {
            anchor: 'end',
            align: 'end',
            formatter: v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v,
            font: { size: 11, weight: '600' },
            color: '#555',
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  function updateTopCountries(byCountry) {
    const c = charts.topCountries;
    const all = Object.entries(byCountry).sort((a, b) => b[1] - a[1]);
    c.data.labels = all.map(([k]) => k.toUpperCase());
    c.data.datasets[0].data = all.map(([, v]) => v);
    c.update();
  }

  // -------------------------------------------------------------------------
  // 4. Trend settimanale globale — line
  // -------------------------------------------------------------------------
  function initGlobalTrend() {
    const ctx = document.getElementById('chartGlobalTrend').getContext('2d');
    charts.globalTrend = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Completions/day',
          data: [],
          borderColor: '#0056b3',
          backgroundColor: hexToRgba('#0056b3', 0.08),
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5,
        }],
      },
      options: {
        ...BASE_OPTIONS,
        scales: {
          x: {
            type: 'time',
            time: { unit: 'day', tooltipFormat: 'dd MMM yyyy' },
            grid: { display: false },
            ticks: { font: { size: 11 }, maxTicksLimit: 8 },
          },
          y: {
            grid: { color: '#f0f0f0' },
            ticks: { font: { size: 11 } },
          },
        },
        plugins: {
          ...BASE_OPTIONS.plugins,
          datalabels: { display: false },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  // Aggrega dati giornalieri per settimana (per range > 60 giorni)
  // Input: [{date: "YYYY-MM-DD", count: N}, ...]
  // Output: [{date: lunedì ISO, count: somma settimana}, ...]
  function aggregateByWeek(daily) {
    const buckets = new Map();
    daily.forEach(({ date, count }) => {
      const d = new Date(date + 'T00:00:00');
      const dow = d.getDay() === 0 ? 7 : d.getDay(); // 1=lun … 7=dom
      const monday = new Date(d);
      monday.setDate(d.getDate() - (dow - 1));
      const key = monday.toISOString().slice(0, 10);
      buckets.set(key, (buckets.get(key) ?? 0) + count);
    });
    return [...buckets.entries()]
      .sort((a, b) => a[0] < b[0] ? -1 : 1)
      .map(([date, count]) => ({ date, count }));
  }

  function updateGlobalTrend(daily) {
    const c = charts.globalTrend;
    const useWeekly = daily.length > 60;
    const data = useWeekly ? aggregateByWeek(daily) : daily;

    c.data.datasets[0].label = useWeekly ? 'Completions/week' : 'Completions/day';
    c.data.datasets[0].data  = data.map(d => ({
      x: new Date(d.date + 'T00:00:00'),
      y: d.count,
    }));
    c.options.scales.x.time.unit = useWeekly ? 'week' : 'day';
    c.update();
  }

  // -------------------------------------------------------------------------
  // 5. Archetypes country — bar orizzontale (con linea media globale opzionale)
  // -------------------------------------------------------------------------
  function initCtryArchetypes() {
    const ctx = document.getElementById('chartCtryArchetypes').getContext('2d');
    charts.ctryArchetypes = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: archLabels(),
        datasets: [
          {
            label: 'Country',
            data: new Array(8).fill(0),
            backgroundColor: archColors(0.85),
            borderColor: archColors(),
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: 'Global Average',
            data: new Array(8).fill(0),
            type: 'line',
            borderColor: '#e74c3c',
            borderWidth: 2,
            borderDash: [6, 3],
            pointRadius: 4,
            fill: false,
            hidden: true,
            datalabels: { display: false },
          },
        ],
      },
      options: {
        ...BASE_OPTIONS,
        indexAxis: 'y',
        scales: {
          x: { grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 } } },
          y: { grid: { display: false }, ticks: { font: { size: 12 } } },
        },
        plugins: {
          ...BASE_OPTIONS.plugins,
          legend: {
            display: true,
            labels: { font: { size: 11 } },
          },
          datalabels: DATALABELS_BAR,
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  function updateCtryArchetypes(byArch, globalByArch) {
    const c = charts.ctryArchetypes;
    c.data.datasets[0].data = archValues(byArch);
    if (globalByArch) {
      // Normalizza i valori globali alla stessa scala (percentuali)
      const localTotal = Object.values(byArch).reduce((s, v) => s + v, 0);
      const globalTotal = Object.values(globalByArch).reduce((s, v) => s + v, 0);
      c.data.datasets[1].data = archValues(globalByArch).map(v =>
        globalTotal ? Math.round(v / globalTotal * localTotal) : 0
      );
      c.data.datasets[1].hidden = false;
    } else {
      c.data.datasets[1].hidden = true;
    }
    c.update();
  }

  // -------------------------------------------------------------------------
  // 6. Trend settimanale country — line
  // -------------------------------------------------------------------------
  function initCtryTrend() {
    const ctx = document.getElementById('chartCtryTrend').getContext('2d');
    charts.ctryTrend = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: 'Completions/day',
          data: [],
          borderColor: '#27ae60',
          backgroundColor: hexToRgba('#27ae60', 0.08),
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 5,
        }],
      },
      options: {
        ...BASE_OPTIONS,
        scales: {
          x: {
            type: 'time',
            time: { unit: 'day', tooltipFormat: 'dd MMM yyyy' },
            grid: { display: false },
            ticks: { font: { size: 11 }, maxTicksLimit: 8 },
          },
          y: {
            grid: { color: '#f0f0f0' },
            ticks: { font: { size: 11 } },
          },
        },
        plugins: {
          ...BASE_OPTIONS.plugins,
          datalabels: { display: false },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  function updateCtryTrend(daily) {
    const c = charts.ctryTrend;
    const useWeekly = daily.length > 60;
    const data = useWeekly ? aggregateByWeek(daily) : daily;

    c.data.datasets[0].label = useWeekly ? 'Completions/week' : 'Completions/day';
    c.data.datasets[0].data  = data.map(d => ({
      x: new Date(d.date + 'T00:00:00'),
      y: d.count,
    }));
    c.options.scales.x.time.unit = useWeekly ? 'week' : 'day';
    c.update();
  }

  // -------------------------------------------------------------------------
  // 7. Distribuzione risposte Q1–Q10 — bar gruppato
  // -------------------------------------------------------------------------
  function initCtryQuestions() {
    const ctx = document.getElementById('chartCtryQuestions').getContext('2d');
    const questions = ['Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8','Q9','Q10'];
    const answers = ['A','B','C','D'];

    charts.ctryQuestions = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: questions,
        datasets: answers.map(opt => ({
          label: opt,
          data: new Array(10).fill(0),
          backgroundColor: hexToRgba(ANSWER_COLORS[opt], 0.8),
          borderColor: ANSWER_COLORS[opt],
          borderWidth: 1,
          borderRadius: 3,
        })),
      },
      options: {
        ...BASE_OPTIONS,
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 12 } },
          },
          y: {
            grid: { color: '#f0f0f0' },
            ticks: { font: { size: 11 } },
            stacked: false,
          },
        },
        plugins: {
          ...BASE_OPTIONS.plugins,
          legend: {
            display: true,
            position: 'top',
            labels: { font: { size: 12 }, padding: 12 },
          },
          datalabels: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => {
                const total = ctx.chart.data.datasets
                  .reduce((s, ds) => s + (ds.data[ctx.dataIndex] ?? 0), 0);
                const pct = total ? (ctx.parsed.y / total * 100).toFixed(1) : 0;
                return ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString('it-IT')} (${pct}%)`;
              },
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  function updateCtryQuestions(questionAnswers) {
    const c = charts.ctryQuestions;
    const questions = ['Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8','Q9','Q10'];
    const answers = ['A','B','C','D'];
    answers.forEach((opt, i) => {
      c.data.datasets[i].data = questions.map(q =>
        questionAnswers[q]?.[opt] ?? 0
      );
    });
    c.update();
  }

  // -------------------------------------------------------------------------
  // 8. Audience country — doughnut
  // -------------------------------------------------------------------------
  function initCtryAudience() {
    const ctx = document.getElementById('chartCtryAudience').getContext('2d');
    const keys = ['b2b', 'b2c', '0'];
    charts.ctryAudience = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: keys.map(k => TARGET_LABELS[k]),
        datasets: [{
          data: new Array(3).fill(0),
          backgroundColor: keys.map(k => TARGET_COLORS[k]),
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 6,
        }],
      },
      options: {
        ...BASE_OPTIONS,
        cutout: '60%',
        plugins: {
          ...BASE_OPTIONS.plugins,
          legend: {
            display: true,
            position: 'right',
            labels: { font: { size: 12 }, padding: 12 },
          },
          datalabels: DATALABELS_DOUGHNUT,
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  function updateCtryAudience(byTarget) {
    const c = charts.ctryAudience;
    c.data.datasets[0].data = ['b2b', 'b2c', '0'].map(k => byTarget[k] ?? 0);
    c.update();
  }

  // -------------------------------------------------------------------------
  // 9. Tiebreaker Rate — doughnut (quanti completamenti hanno avuto spareggio)
  // -------------------------------------------------------------------------
  function initTiebreakerRate() {
    const ctx = document.getElementById('chartTiebreakerRate').getContext('2d');
    charts.tiebreakerRate = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Needed tiebreaker (Q11)', 'No tiebreaker needed'],
        datasets: [{
          data: [0, 0],
          backgroundColor: [hexToRgba('#f39c12', 0.85), hexToRgba('#adb5bd', 0.55)],
          borderWidth: 2,
          borderColor: '#fff',
          hoverOffset: 6,
        }],
      },
      options: {
        ...BASE_OPTIONS,
        cutout: '60%',
        plugins: {
          ...BASE_OPTIONS.plugins,
          legend: {
            display: true,
            position: 'right',
            labels: { font: { size: 12 }, padding: 12 },
          },
          datalabels: DATALABELS_DOUGHNUT,
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  function updateTiebreakerRate(tiebreakerCount, totalCompleted) {
    const c = charts.tiebreakerRate;
    c.data.datasets[0].data = [tiebreakerCount, Math.max(0, totalCompleted - tiebreakerCount)];
    c.update();
  }

  // -------------------------------------------------------------------------
  // 10. Completions by Country — bar orizzontale, conteggio assoluto
  // Precedentemente "Completion Rate by Country" — rimosso perché richiede
  // dati di sessioni abbandonate non disponibili nel DB Perabite.
  // Il grafico mostra ora il numero assoluto di completamenti per paese (fisso).
  // -------------------------------------------------------------------------
  function initCompletionRate() {
    const ctx = document.getElementById('chartCompletionRate').getContext('2d');
    charts.completionRate = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Completions',
            data: [],
            backgroundColor: hexToRgba('#0057FF', 0.75),
            borderColor: '#0057FF',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        ...BASE_OPTIONS,
        indexAxis: 'y',
        scales: {
          x: {
            min: 0,
            grid: { color: '#f0f0f0' },
            ticks: { font: { size: 11 } },
          },
          y: { grid: { display: false }, ticks: { font: { size: 11 } } },
        },
        plugins: {
          ...BASE_OPTIONS.plugins,
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'end',
            formatter: v => (typeof v === 'number' && v > 0
              ? (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)
              : ''),
            font: { size: 10, weight: '600' },
            color: '#555',
            padding: { right: 4 },
          },
          tooltip: {
            callbacks: {
              label: ctx => ' ' + ctx.parsed.x.toLocaleString('en-GB') + ' completions',
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  function updateCompletionRate(countryTotals) {
    const c = charts.completionRate;
    const sorted = [...countryTotals].sort((a, b) => b.total - a.total);
    c.data.labels = sorted.map(d => d.country.toUpperCase());
    c.data.datasets[0].data = sorted.map(d => d.total);
    c.update();
  }

  // -------------------------------------------------------------------------
  // 10. Heatmap Paese × Archetipo — stacked 100% bar orizzontale
  // -------------------------------------------------------------------------
  function initHeatmap() {
    const ctx = document.getElementById('chartHeatmap').getContext('2d');
    charts.heatmap = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: ARCHETYPES_ORDER.map(arch => ({
          label: ARCH_NAMES[arch],
          data: [],
          backgroundColor: hexToRgba(ARCH_COLORS[arch], 0.85),
          borderColor: '#fff',
          borderWidth: 0.5,
          borderRadius: 0,
          stack: 'heatmap',
        })),
      },
      options: {
        ...BASE_OPTIONS,
        indexAxis: 'y',
        scales: {
          x: {
            stacked: true,
            min: 0,
            max: 100,
            grid: { color: '#f0f0f0' },
            ticks: { font: { size: 11 }, callback: v => v + '%' },
          },
          y: {
            stacked: true,
            grid: { display: false },
            ticks: { font: { size: 11 } },
          },
        },
        plugins: {
          ...BASE_OPTIONS.plugins,
          legend: {
            display: true,
            position: 'top',
            labels: { font: { size: 11 }, padding: 10, boxWidth: 12 },
          },
          datalabels: {
            display: ctx => ctx.dataset.data[ctx.dataIndex] > 7,
            formatter: v => v.toFixed(0) + '%',
            font: { size: 10, weight: '600' },
            color: '#fff',
          },
          tooltip: {
            callbacks: {
              label: ctx => ' ' + ctx.dataset.label + ': ' + ctx.parsed.x.toFixed(1) + '%',
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  function updateHeatmap(heatmapData, sortedCountries) {
    // heatmapData = { code: { arch: count, … }, … }
    // sortedCountries = [{ code, total }, …] ordinati per totale desc
    const c = charts.heatmap;
    c.data.labels = sortedCountries.map(d => d.code.toUpperCase());
    ARCHETYPES_ORDER.forEach((arch, i) => {
      c.data.datasets[i].data = sortedCountries.map(d => {
        const ac = heatmapData[d.code] ?? {};
        const tot = Object.values(ac).reduce((s, v) => s + v, 0);
        if (!tot) return 0;
        return Math.round((ac[arch] ?? 0) / tot * 1000) / 10;
      });
    });
    c.update();
  }

  // -------------------------------------------------------------------------
  // 11. Indice di deviazione dal globale — bar ± orizzontale (country)
  // -------------------------------------------------------------------------
  function initCtryDeviation() {
    const ctx = document.getElementById('chartCtryDeviation').getContext('2d');
    charts.ctryDeviation = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: archLabels(),
        datasets: [{
          label: 'Deviation from global avg (pp)',
          data: new Array(8).fill(0),
          backgroundColor: new Array(8).fill(hexToRgba('#0056b3', 0.75)),
          borderColor: new Array(8).fill('#0056b3'),
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        ...BASE_OPTIONS,
        indexAxis: 'y',
        scales: {
          x: {
            grid: { color: '#f0f0f0' },
            ticks: {
              font: { size: 11 },
              callback: v => (v > 0 ? '+' : '') + v.toFixed(1) + ' pts',
            },
          },
          y: { grid: { display: false }, ticks: { font: { size: 12 } } },
        },
        plugins: {
          ...BASE_OPTIONS.plugins,
          datalabels: {
            anchor: ctx => ctx.dataset.data[ctx.dataIndex] >= 0 ? 'end' : 'start',
            align:  ctx => ctx.dataset.data[ctx.dataIndex] >= 0 ? 'end' : 'start',
            formatter: v => (v > 0 ? '+' : '') + v.toFixed(1) + ' pts',
            font: { size: 11, weight: '600' },
            color: '#555',
            padding: { left: 4, right: 4 },
          },
          tooltip: {
            callbacks: {
              label: ctx => {
                const v = ctx.parsed.x;
                return ' ' + (v > 0 ? '+' : '') + v.toFixed(1) + ' pts vs global average';
              },
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  function updateCtryDeviation(ctryByArch, globalByArch) {
    const c = charts.ctryDeviation;
    const ctryTotal   = Object.values(ctryByArch).reduce((s, v) => s + v, 0);
    const globalTotal = Object.values(globalByArch).reduce((s, v) => s + v, 0);
    const deviations  = ARCHETYPES_ORDER.map(arch => {
      const cp = ctryTotal   ? (ctryByArch[arch]   ?? 0) / ctryTotal   * 100 : 0;
      const gp = globalTotal ? (globalByArch[arch] ?? 0) / globalTotal * 100 : 0;
      return Math.round((cp - gp) * 10) / 10;
    });
    c.data.datasets[0].data = deviations;
    c.data.datasets[0].backgroundColor = deviations.map(v =>
      v >= 0 ? hexToRgba('#0056b3', 0.75) : hexToRgba('#e74c3c', 0.65)
    );
    c.data.datasets[0].borderColor = deviations.map(v =>
      v >= 0 ? '#0056b3' : '#e74c3c'
    );
    c.update();
  }

  // -------------------------------------------------------------------------
  // 13. Analisi Q11 Tiebreaker — bar orizzontale (globale)
  // -------------------------------------------------------------------------
  function initTiebreaker() {
    const ctx = document.getElementById('chartTiebreaker').getContext('2d');
    // Colori legati agli archetipi dominanti per ogni opzione del tiebreaker
    const tbColors = [
      ARCH_COLORS.stratega,    // 11A → Stratega/Capitano
      ARCH_COLORS.risolutore,  // 11B → Risolutore/Pragmatico
      ARCH_COLORS.artigiano,   // 11C → Artigiano/Stratega
      ARCH_COLORS.connettore,  // 11D → Connettore/Collaboratore
    ];
    charts.tiebreaker = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Option A', 'Option B', 'Option C', 'Option D'],
        datasets: [{
          label: 'Q11 responses',
          data: [0, 0, 0, 0],
          backgroundColor: tbColors.map(col => hexToRgba(col, 0.8)),
          borderColor: tbColors,
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        ...BASE_OPTIONS,
        indexAxis: 'y',
        scales: {
          x: { grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 } } },
          y: { grid: { display: false }, ticks: { font: { size: 12 } } },
        },
        plugins: {
          ...BASE_OPTIONS.plugins,
          datalabels: DATALABELS_BAR,
          tooltip: {
            callbacks: {
              label: ctx => {
                const total = ctx.dataset.data.reduce((s, v) => s + v, 0);
                const pct = total ? (ctx.parsed.x / total * 100).toFixed(1) : 0;
                return ' ' + ctx.parsed.x.toLocaleString('it-IT') + ' (' + pct + '%)';
              },
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  function updateTiebreaker(tiebreakerAnswers) {
    const c = charts.tiebreaker;
    c.data.datasets[0].data = ['11A','11B','11C','11D'].map(k => tiebreakerAnswers[k] ?? 0);
    c.update();
  }

  // -------------------------------------------------------------------------
  // Init pubblico — chiamato da dashboard.js dopo il caricamento DOM
  // -------------------------------------------------------------------------
  function init() {
    // Registra il plugin datalabels globalmente
    Chart.register(ChartDataLabels);

    // Imposta defaults globali
    Chart.defaults.font.family = "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif";
    Chart.defaults.color = '#666666';
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(30,30,30,0.85)';
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;

    initGlobalArchetypes();
    initGlobalAudience();
    initTopCountries();
    initGlobalTrend();
    initTiebreakerRate();
    initTiebreaker();
    initCompletionRate();
    initHeatmap();
    initCtryQuestions();
  }

  // -------------------------------------------------------------------------
  // API pubblica
  // -------------------------------------------------------------------------
  return {
    init,
    updateGlobalArchetypes,
    updateGlobalAudience,
    updateTopCountries,
    updateGlobalTrend,
    updateTiebreakerRate,
    updateCompletionRate,
    updateTiebreaker,
    updateHeatmap,
    updateCtryArchetypes,
    updateCtryTrend,
    updateCtryQuestions,
    updateCtryAudience,
    updateCtryDeviation,
  };

})();
