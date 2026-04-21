/* ==========================================================================
   Beyond — Survey Analytics Dashboard
   dashboard.js — caricamento dati, state, filtri, navigazione country
   ========================================================================== */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // Percorso dati (relativo alla posizione di index.html)
  // -------------------------------------------------------------------------
  const DATA_URL = '../../data/dashboard_data.json?v=7';

  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------
  const state = {
    raw: null,          // oggetto dashboard_data.json completo
    target: 'all',      // 'all' | 'b2b' | 'b2c' | '0'
    country: null,      // country code selezionata
    compareGlobal: false,
    weekFrom: null,     // ISO week string "YYYY-WNN" o null
    weekTo: null,       // ISO week string "YYYY-WNN" o null
  };

  // Stato interno del week picker (non fa parte del filtro dati)
  let _wpSelStart = null;
  let _wpHover    = null;

  // Stato interno del combobox country
  let _comboItems = [];   // [{ value, label }, ...]
  let _comboIdx   = -1;   // indice evidenziato con tastiera

  // -------------------------------------------------------------------------
  // Utility
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // JSON structure helper — mostra schema senza dati grezzi
  // -------------------------------------------------------------------------
  function jsonStructure(obj, depth, maxDepth) {
    depth = depth || 0;
    maxDepth = (maxDepth !== undefined) ? maxDepth : 3;
    if (obj === null) return 'null';
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      const inner = '  '.repeat(depth + 1);
      const sample = jsonStructure(obj[0], depth + 1, maxDepth);
      return `[\n${inner}/* Array(${obj.length}) */ ${sample}\n${'  '.repeat(depth)}]`;
    }
    if (typeof obj === 'object') {
      if (depth >= maxDepth) {
        const keys = Object.keys(obj);
        return `{ /* ${keys.length} keys: ${keys.slice(0, 6).join(', ')}${keys.length > 6 ? ', …' : ''} */ }`;
      }
      const indent = '  '.repeat(depth);
      const inner  = '  '.repeat(depth + 1);
      const entries = Object.keys(obj).map(k =>
        `${inner}"${k}": ${jsonStructure(obj[k], depth + 1, maxDepth)}`
      );
      return `{\n${entries.join(',\n')}\n${indent}}`;
    }
    if (typeof obj === 'string') {
      return obj.length > 50 ? `"${obj.slice(0, 50)}…"` : `"${obj}"`;
    }
    return String(obj);
  }

  function fmt(n) {
    if (n == null) return '—';
    const r = Math.round(n);
    if (Number.isInteger(n)) return r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return n.toFixed(1).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function pct(part, total) {
    if (!total) return '—';
    return (part / total * 100).toFixed(1) + '%';
  }

  function topKey(obj) {
    return Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  }

  // -------------------------------------------------------------------------
  // Date helpers (mirror di isoWeekToDate in charts.js)
  // -------------------------------------------------------------------------
  function isoWeekToDate(weekStr) {
    const [yearStr, weekPart] = weekStr.split('-W');
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekPart, 10);
    const jan4 = new Date(year, 0, 4);
    const jan4Day = jan4.getDay() || 7;
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - (jan4Day - 1) + (week - 1) * 7);
    return monday;
  }

  function fmtShort(d) {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }

  // -------------------------------------------------------------------------
  // Chiave slice — sempre 'default' (il pre-lancio è escluso automaticamente)
  // -------------------------------------------------------------------------
  function sliceKey() {
    return 'default';
  }

  function getGlobalSlice() {
    return state.raw.global['default'];
  }

  function getCountrySlice(code) {
    const country = state.raw.countries[code];
    if (!country) return null;
    return country['default'];
  }

  function getCountryMeta(code) {
    return state.raw.countries[code] ?? null;
  }

  // -------------------------------------------------------------------------
  // Filtra distribuzione archetypes per target
  // archOverride: oggetto by_archetype già filtrato per range (da weeklyAggregated)
  // -------------------------------------------------------------------------
  function archetypesByTarget(slice, target, archOverride) {
    const base = archOverride ?? slice.by_archetype;
    if (target === 'all') return base;
    // Se abbiamo un override dal range, non possiamo spezzare per target
    // perché by_archetype nel weekly non è suddiviso per target.
    // Usiamo by_archetype_target solo quando non c'è filtro data.
    if (archOverride) return base;
    const byArchTarget = slice.by_archetype_target;
    if (!byArchTarget) return base;
    return Object.fromEntries(
      Object.entries(byArchTarget).map(([arch, targets]) => [arch, targets[target] ?? 0])
    );
  }

  // -------------------------------------------------------------------------
  // Filtra weekly solo per range date (senza target)
  // -------------------------------------------------------------------------
  function weeklyRangeFiltered(slice) {
    if (!slice?.weekly) return [];
    if (!state.weekFrom && !state.weekTo) return slice.weekly;
    return slice.weekly.filter(w => {
      if (state.weekFrom && w.week < state.weekFrom) return false;
      if (state.weekTo   && w.week > state.weekTo)   return false;
      return true;
    });
  }

  // Aggrega i dati weekly filtrati per range → { total, by_target, by_archetype, by_country }
  function weeklyAggregated(slice) {
    const data = weeklyRangeFiltered(slice);
    let total = 0;
    const by_target = {};
    const by_archetype = {};
    const by_country = {};
    data.forEach(w => {
      total += w.count;
      if (w.by_target) {
        Object.entries(w.by_target).forEach(([k, v]) => {
          by_target[k] = (by_target[k] ?? 0) + v;
        });
      }
      if (w.by_archetype) {
        Object.entries(w.by_archetype).forEach(([k, v]) => {
          by_archetype[k] = (by_archetype[k] ?? 0) + v;
        });
      }
      if (w.by_country) {
        Object.entries(w.by_country).forEach(([k, v]) => {
          by_country[k] = (by_country[k] ?? 0) + v;
        });
      }
    });
    return { total, by_target, by_archetype, by_country };
  }

  // -------------------------------------------------------------------------
  // Filtra weekly per range date + target (per i grafici trend)
  // -------------------------------------------------------------------------
  function weeklyFiltered(slice) {
    const data = weeklyRangeFiltered(slice);
    const t = state.target;
    if (t === 'all') return data;
    return data.map(w => ({
      week: w.week,
      count: w.by_target ? (w.by_target[t] ?? 0) : 0,
    }));
  }

  // -------------------------------------------------------------------------
  // Filtra risposte Q1-Q10 per target
  // -------------------------------------------------------------------------
  function questionAnswersFiltered(slice) {
    const t = state.target;
    if (t === 'all') return slice.question_answers;
    const byTarget = slice.question_answers_by_target;
    if (!byTarget) return slice.question_answers;
    return Object.fromEntries(
      Object.keys(slice.question_answers).map(q => [
        q, byTarget[q]?.[t] ?? { A: 0, B: 0, C: 0, D: 0 },
      ])
    );
  }

  // -------------------------------------------------------------------------
  // Conteggio per country filtrato per slice e target correnti
  // -------------------------------------------------------------------------
  function getCountryCounts() {
    const t  = state.target;
    const sk = sliceKey();
    const result = {};
    state.raw.meta.countries.forEach(code => {
      const cs = state.raw.countries[code][sk];
      if (!cs) return;
      result[code] = t === 'all' ? cs.total : (cs.by_target[t] ?? 0);
    });
    return result;
  }

  // -------------------------------------------------------------------------
  // DOM refs
  // -------------------------------------------------------------------------
  const $ = id => document.getElementById(id);

  // -------------------------------------------------------------------------
  // Archetype name translation (keys in data are Italian)
  // -------------------------------------------------------------------------
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

  function archName(key) {
    return ARCH_NAMES[key] ?? (key.charAt(0).toUpperCase() + key.slice(1));
  }

  // -------------------------------------------------------------------------
  // Render KPI globali
  // -------------------------------------------------------------------------
  function fmtArchKpi(archData) {
    const top = topKey(archData);
    if (top === '—') return '—';
    const count = archData[top] ?? 0;
    return archName(top) + (count ? ' (' + fmt(count) + ')' : '');
  }

  function renderGlobalKPIs(slice) {
    const d = state.raw;
    const t = state.target;

    let filteredTotal;

    if (state.weekFrom || state.weekTo) {
      const agg = weeklyAggregated(slice);
      filteredTotal = t === 'all' ? agg.total : (agg.by_target[t] ?? 0);
    } else {
      filteredTotal = t === 'all' ? slice.total : (slice.by_target[t] ?? 0);
    }

    const archOverride = (state.weekFrom || state.weekTo)
      ? weeklyAggregated(slice).by_archetype
      : null;
    $('kpiTotal').textContent          = fmt(filteredTotal);
    $('kpiTopArchetype').textContent   = fmtArchKpi(archetypesByTarget(slice, t, archOverride));
    $('kpiCountries').textContent      = fmt(d.meta.countries.length);
    $('kpiCountriesLabel').textContent = 'Active countries';
    syncKpiStrip();
  }

  // -------------------------------------------------------------------------
  // Render KPI country
  // -------------------------------------------------------------------------
  function renderCountryKPIs(code) {
    const slice = getCountrySlice(code);
    const globalSlice = getGlobalSlice();
    if (!slice) return;

    const t = state.target;
    let ctryFiltered, globalFiltered;

    if (state.weekFrom || state.weekTo) {
      const ctryAgg   = weeklyAggregated(slice);
      const globalAgg = weeklyAggregated(globalSlice);
      ctryFiltered   = t === 'all' ? ctryAgg.total   : (ctryAgg.by_target[t]   ?? 0);
      globalFiltered = t === 'all' ? globalAgg.total : (globalAgg.by_target[t] ?? 0);
    } else {
      ctryFiltered   = t === 'all' ? slice.total       : (slice.by_target[t]       ?? 0);
      globalFiltered = t === 'all' ? globalSlice.total : (globalSlice.by_target[t] ?? 0);
    }

    const ctryArchOverride = (state.weekFrom || state.weekTo)
      ? weeklyAggregated(slice).by_archetype
      : null;
    $('kpiTotal').textContent          = fmt(ctryFiltered);
    $('kpiTopArchetype').textContent   = fmtArchKpi(archetypesByTarget(slice, t, ctryArchOverride));
    $('kpiCountries').textContent      = pct(ctryFiltered, globalFiltered);
    $('kpiCountriesLabel').textContent = 'Share of total';
    syncKpiStrip();
  }

  // -------------------------------------------------------------------------
  // Update header meta
  // -------------------------------------------------------------------------
  function renderMeta() {
    const m = state.raw.meta;
    const fmtFull = s => new Date(s).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const btn = $('dateRangePicker');

    if (state.weekFrom || state.weekTo) {
      const fromStr = state.weekFrom
        ? fmtShort(isoWeekToDate(state.weekFrom))
        : fmtFull(m.date_range.min);
      let toStr;
      if (state.weekTo) {
        const sun = new Date(isoWeekToDate(state.weekTo));
        sun.setDate(sun.getDate() + 6);
        toStr = fmtShort(sun);
      } else {
        toStr = fmtFull(m.date_range.max);
      }
      btn.textContent = fromStr + ' — ' + toStr;
      btn.classList.add('dash-header__range-btn--filtered');
    } else {
      btn.textContent = fmtFull(m.date_range.min) + ' — ' + fmtFull(m.date_range.max);
      btn.classList.remove('dash-header__range-btn--filtered');
    }
  }

  // -------------------------------------------------------------------------
  // Popola il selettore country
  // -------------------------------------------------------------------------
  const COUNTRY_NAMES = {
    ar:'Argentina', be:'Belgio', bg:'Bulgaria', br:'Brasile',
    ch:'Svizzera', cn:'Cina', co:'Colombia', cz:'Rep. Ceca',
    de:'Germania', dk:'Danimarca', es:'Spagna', fr:'Francia',
    gb:'Regno Unito', hk:'Hong Kong', hr:'Croazia', hu:'Ungheria',
    ie:'Irlanda', in:'India', it:'Italia', lt:'Lituania',
    me:'Montenegro', nl:'Paesi Bassi', no:'Norvegia', pl:'Polonia',
    pt:'Portogallo', ro:'Romania', rs:'Serbia', sk:'Slovacchia', tr:'Turchia',
    other:'Other',
  };

  // -------------------------------------------------------------------------
  // Combobox bespoke — costruzione lista, rendering, apertura/chiusura
  // -------------------------------------------------------------------------
  function buildComboItems() {
    _comboItems = [{ value: 'global', label: 'Global Overview' }];
    state.raw.meta.countries.forEach(code => {
      _comboItems.push({
        value: code,
        label: (COUNTRY_NAMES[code] ?? code.toUpperCase()) + ' (' + code.toUpperCase() + ')',
      });
    });
  }

  function renderComboList(filter) {
    const list = $('countryListbox');
    list.innerHTML = '';
    _comboIdx = -1;
    const q = (filter ?? '').trim().toLowerCase();
    const visible = q
      ? _comboItems.filter(i => i.label.toLowerCase().includes(q))
      : _comboItems;
    visible.forEach(item => {
      const li = document.createElement('li');
      li.className = 'country-combobox__item';
      li.setAttribute('role', 'option');
      li.dataset.value = item.value;
      li.textContent = item.label;
      if (item.value === state.country) li.setAttribute('aria-selected', 'true');
      li.addEventListener('mousedown', e => {
        e.preventDefault();
        selectComboValue(item.value);
        closeCombo();
      });
      list.appendChild(li);
    });
  }

  function openCombo() {
    $('countryCombobox').setAttribute('aria-expanded', 'true');
    $('countryListbox').hidden = false;
    $('countryInput').value = '';
    renderComboList('');
  }

  function closeCombo() {
    $('countryCombobox').setAttribute('aria-expanded', 'false');
    $('countryListbox').hidden = true;
    const cur = _comboItems.find(i => i.value === state.country);
    $('countryInput').value = cur ? cur.label : '';
  }

  function highlightComboItem(items) {
    items.forEach((li, i) => {
      li.classList.toggle('country-combobox__item--active', i === _comboIdx);
      if (i === _comboIdx) li.scrollIntoView({ block: 'nearest' });
    });
  }

  function selectComboValue(value) {
    state.country = value;
    if (value === 'global') {
      refresh();
    } else {
      updateView();
      refreshCountry();
    }
  }

  function updateView() {
    const isGlobal = state.country === 'global';
    const cur = _comboItems.find(i => i.value === state.country);
    $('countryInput').value = cur ? cur.label : '';
    const titleEl = $('sectionTitle');
    const qTitle = $('titleCtryQuestions');
    if (isGlobal) {
      titleEl.textContent = 'Global Overview';
      if (qTitle) {
        const badge = qTitle.querySelector('.period-note');
        qTitle.textContent = 'Answer Distribution Q1–Q10';
        if (badge) qTitle.appendChild(badge);
      }
    } else {
      const code = state.country;
      titleEl.textContent = (COUNTRY_NAMES[code] ?? code.toUpperCase()) + ' (' + code.toUpperCase() + ')';
      if (qTitle) {
        const badge = qTitle.querySelector('.period-note');
        qTitle.textContent = 'Answer Distribution Q1–Q10 \u2014 ' + code.toUpperCase();
        if (badge) qTitle.appendChild(badge);
      }
    }
  }

  function initCombo() {
    buildComboItems();
    state.country = 'global';
  }

  // -------------------------------------------------------------------------
  // Refresh completo dei grafici e KPI
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // Dati per Completions by Country (da default.total per paese, sempre fisso)
  // Sostituisce il precedente "Completion Rate by Country" —
  // non sono disponibili record abbandonati nel DB Perabite, quindi
  // non è calcolabile alcun tasso. Si mostra il conteggio assoluto di completamenti.
  // -------------------------------------------------------------------------
  function getCompletionRateData() {
    return state.raw.meta.countries.map(code => ({
      country: code,
      total: state.raw.countries[code]?.default?.total ?? 0,
    }));
  }

  // Dati Q1-Q10: risponde a country + audience target (non a date range, dati non weekly)
  function getQuestionAnswers() {
    const slice = (state.country && state.country !== 'global')
      ? getCountrySlice(state.country)
      : getGlobalSlice();
    if (!slice) return {};
    const t = state.target;
    if (t === 'all') return slice.question_answers ?? {};
    const qbt = slice.question_answers_by_target ?? {};
    const result = {};
    Object.entries(qbt).forEach(([q, targets]) => {
      result[q] = targets[t] ?? { A: 0, B: 0, C: 0, D: 0 };
    });
    return result;
  }

  // -------------------------------------------------------------------------
  // Dati per Heatmap Paese × Archetipo
  // Risponde a: slice, target, date range
  // -------------------------------------------------------------------------
  function getHeatmapData() {
    const isFiltered = !!(state.weekFrom || state.weekTo);
    const sk = sliceKey();
    const heatmap = {};
    const totals  = [];
    state.raw.meta.countries.forEach(code => {
      const cs = state.raw.countries[code][sk];
      if (!cs) return;
      const archOverride = isFiltered ? weeklyAggregated(cs).by_archetype : null;
      heatmap[code] = archetypesByTarget(cs, state.target, archOverride);
      const tot = Object.values(heatmap[code]).reduce((s, v) => s + v, 0);
      totals.push({ code, total: tot });
    });
    totals.sort((a, b) => b.total - a.total);
    return { heatmap, sortedCountries: totals };
  }

  // -------------------------------------------------------------------------
  // Indicatori "full period" sui grafici non filtrabili per data
  // -------------------------------------------------------------------------
  // Q1-Q10 answers are not split by week in the data, so they always show the full period
  const FULL_PERIOD_TITLES = ['titleCtryQuestions'];

  function updatePeriodNotes() {
    const isFiltered = !!(state.weekFrom || state.weekTo);
    FULL_PERIOD_TITLES.forEach(id => {
      const el = $(id);
      if (!el) return;
      el.querySelector('.period-note')?.remove();
      if (isFiltered) {
        const badge = document.createElement('span');
        badge.className = 'period-note';
        badge.textContent = 'full period';
        el.appendChild(badge);
      }
    });
  }

  function refresh() {
    const globalSlice = getGlobalSlice();
    const isFiltered = !!(state.weekFrom || state.weekTo);
    renderGlobalKPIs(globalSlice);

    const globalAgg = weeklyAggregated(globalSlice);
    const archOverride = isFiltered ? globalAgg.by_archetype : null;
    DashCharts.updateGlobalArchetypes(archetypesByTarget(globalSlice, state.target, archOverride));

    // Audience doughnut: usa by_target aggregato dal range se filtro attivo
    DashCharts.updateGlobalAudience(isFiltered ? globalAgg.by_target : globalSlice.by_target);

    // Top Countries: usa by_country aggregato dal range se filtro attivo
    DashCharts.updateTopCountries(isFiltered ? globalAgg.by_country : getCountryCounts());

    DashCharts.updateGlobalTrend(weeklyFiltered(globalSlice));

    // Completions by Country (fisso — non risponde a filtri slice/target/date)
    DashCharts.updateCompletionRate(getCompletionRateData());

    // Tiebreaker Rate donut + Q11 bar (fissi — pre-calcolati in analytics)
    const tbAnalytics = state.raw.analytics;
    DashCharts.updateTiebreakerRate(tbAnalytics.tiebreaker_count, state.raw.meta.slice_counts.default);
    DashCharts.updateTiebreaker(tbAnalytics.tiebreaker_answers);

    // Heatmap (risponde a slice, target, date range)
    const { heatmap, sortedCountries } = getHeatmapData();
    DashCharts.updateHeatmap(heatmap, sortedCountries);

    // Q1-Q10 answer distribution (risponde a country + audience, non a date range)
    DashCharts.updateCtryQuestions(getQuestionAnswers());

    updatePeriodNotes();
    updateView();
    refreshCountry();
  }

  function refreshCountry() {
    const code = state.country;
    if (!code || code === 'global') return;
    const slice = getCountrySlice(code);
    if (!slice) return;
    const globalSlice = getGlobalSlice();
    const isFiltered = !!(state.weekFrom || state.weekTo);

    renderCountryKPIs(code);

    const ctryAgg  = weeklyAggregated(slice);
    const ctryArch = isFiltered ? ctryAgg.by_archetype : null;

    // Adatta i grafici globali ai dati del paese
    DashCharts.updateGlobalArchetypes(archetypesByTarget(slice, state.target, ctryArch));
    DashCharts.updateGlobalAudience(isFiltered ? ctryAgg.by_target : slice.by_target);
    DashCharts.updateGlobalTrend(weeklyFiltered(slice));

    // Q1-Q10: aggiorna con i dati del paese selezionato + filtro audience
    DashCharts.updateCtryQuestions(getQuestionAnswers());
  }

  // -------------------------------------------------------------------------
  // Week picker
  // -------------------------------------------------------------------------
  function buildWeekPicker() {
    const weekSet = new Set();
    (state.raw.global['default']?.weekly ?? []).forEach(w => weekSet.add(w.week));
    const weeks = [...weekSet].sort();
    const list = $('weekPickerList');
    list.innerHTML = '';

    let lastMonthKey = null;
    weeks.forEach(ws => {
      const mon = isoWeekToDate(ws);
      const monthKey = mon.getFullYear() + '-' + mon.getMonth();

      if (monthKey !== lastMonthKey) {
        lastMonthKey = monthKey;
        const hdr = document.createElement('div');
        hdr.className = 'week-picker__month';
        hdr.textContent = mon.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        list.appendChild(hdr);
      }

      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);

      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'week-picker__week';
      row.dataset.week = ws;
      row.innerHTML =
        '<span class="wk-num">W' + ws.split('-W')[1] + '</span>' +
        '<span class="wk-dates">' + fmtShort(mon) + ' – ' + fmtShort(sun) + '</span>';

      row.addEventListener('click',       () => onWeekClick(ws));
      row.addEventListener('mouseenter',  () => onWeekHover(ws));
      row.addEventListener('mouseleave',  () => { _wpHover = null; refreshWkHL(); });
      list.appendChild(row);
    });
  }

  function onWeekClick(ws) {
    if (!_wpSelStart) {
      _wpSelStart = ws;
      $('wpHint').textContent = 'Now click the end week';
      refreshWkHL();
    } else {
      let from = _wpSelStart, to = ws;
      if (to < from) { const tmp = from; from = to; to = tmp; }
      _wpSelStart = null;
      _wpHover    = null;
      state.weekFrom = from;
      state.weekTo   = to;
      closeWeekPicker();
      renderMeta();
      refresh();
    }
  }

  function onWeekHover(ws) {
    if (_wpSelStart) { _wpHover = ws; refreshWkHL(); }
  }

  function refreshWkHL() {
    let lo, hi;
    if (_wpSelStart) {
      const end = _wpHover || _wpSelStart;
      lo = _wpSelStart <= end ? _wpSelStart : end;
      hi = _wpSelStart <= end ? end : _wpSelStart;
    } else if (state.weekFrom) {
      lo = state.weekFrom;
      hi = state.weekTo || state.weekFrom;
    }

    document.querySelectorAll('.week-picker__week').forEach(btn => {
      const w = btn.dataset.week;
      btn.classList.toggle('wk-start',    !!lo && w === lo);
      btn.classList.toggle('wk-end',      !!hi && w === hi && hi !== lo);
      btn.classList.toggle('wk-in-range', !!lo && !!hi && w >= lo && w <= hi);
    });
  }

  function openWeekPicker() {
    _wpSelStart = null;
    _wpHover    = null;
    buildWeekPicker();
    refreshWkHL();
    const popup = $('weekPicker');
    popup.hidden = false;
    $('dateRangePicker').setAttribute('aria-expanded', 'true');
    $('wpHint').textContent = state.weekFrom ? 'Click to change start week' : 'Select start week';
  }

  function closeWeekPicker() {
    $('weekPicker').hidden = true;
    $('dateRangePicker').setAttribute('aria-expanded', 'false');
    _wpSelStart = null;
    _wpHover    = null;
  }

  // -------------------------------------------------------------------------
  // Help modal
  // -------------------------------------------------------------------------
  const HELP_CONTENT = {
    'kpi-global-total': {
      title: 'Completions',
      body: `<p>Total number of users who completed the survey from start to finish, within the active filters (audience, date range, advanced options).</p>
<p>Abandoned sessions are <strong>excluded</strong> unless "Include abandoned" is toggled on, and pre-launch responses are excluded unless "Include pre-launch" is active.</p>`,
    },
'kpi-global-archetype': {
      title: 'Top archetype',
      body: `<p>The professional archetype assigned most frequently across all completions in the selected period, with the active filters applied.</p>
<p>The number in parentheses shows how many people belong to that archetype. The <strong>8 Beyond archetypes</strong> are: The Captain, The Pioneer, The Problem Solver, The Connector, The Pragmatist, The Craftsman, The Strategist, The Collaborator.</p>`,
    },
    'kpi-global-countries': {
      title: 'Active countries',
      body: `<p>Number of distinct countries from which at least one survey completion was recorded, regardless of the active audience and date filters.</p>
<p>Reflects the overall geographic reach of the Beyond programme.</p>`,
    },
    'chart-global-archetypes': {
      title: 'Archetype Distribution',
      body: `<p>Horizontal bar chart showing how many users were assigned to each of the <strong>8 Beyond archetypes</strong>.</p>
<p>Bar length is proportional to the number of completions for that archetype. The chart updates based on the active audience filter (All / B2B / B2C / General) and the selected date range.</p>
<p>Use this to understand which professional profile is most represented among survey completers.</p>`,
    },
    'chart-global-audience': {
      title: 'Audience Split',
      body: `<p>Doughnut chart showing the breakdown of completions by audience segment:</p>
<p><strong>B2B</strong> — professionals accessing via a corporate context.<br>
<strong>B2C</strong> — consumers accessing via direct-to-public channels.<br>
<strong>General</strong> — users accessing without specific targeting (generic link).</p>
<p>Percentages refer to the total within the selected period and active filters.</p>`,
    },
    'chart-global-countries': {
      title: 'All Countries',
      body: `<p>Vertical bar chart ranking all countries by number of completions, from highest to lowest.</p>
<p>Only countries with at least one completion in the selected period and active audience filters are shown. Use this to identify the most active markets and compare relative volume across countries.</p>`,
    },
    'chart-global-trend': {
      title: 'Weekly Trend',
      body: `<p>Line chart showing the number of completions per <strong>ISO week</strong> over time.</p>
<p>Use this to spot engagement peaks, the impact of launch campaigns, or seasonal patterns. Use the <strong>date range picker</strong> in the header to zoom into a specific period.</p>
<p>The audience filter updates the chart to show only completions for the selected segment.</p>`,
    },
    'kpi-country-total': {
      title: 'Completions — selected country',
      body: `<p>Total completions recorded in the <strong>selected country</strong>, within the active filters (audience, date range, advanced options).</p>
<p>Compare this with the "Share of total" KPI to assess the relative weight of this market.</p>`,
    },
    'kpi-country-completion': {
      title: 'Completion rate — selected country',
      body: `<p>Percentage of users who started the survey in the selected country and completed it.</p>
<p>Calculated as: <strong>country completions / (completions + abandoned) in that country</strong>. A value significantly different from the global average may indicate cultural differences, localisation issues, or market-specific targeting.</p>`,
    },
    'kpi-country-archetype': {
      title: 'Top archetype — selected country',
      body: `<p>The most frequent professional archetype among completions in the selected country, with the active filters applied.</p>
<p>May differ from the global top archetype, reflecting local cultural, sectoral, or market characteristics. The number in parentheses shows the absolute count.</p>`,
    },
    'kpi-country-share': {
      title: 'Share of total',
      body: `<p>Percentage of global completions that come from the selected country, with the active filters applied.</p>
<p>Indicates the <strong>relative weight</strong> of this market within the entire Beyond programme. Useful for comparing market importance and informing resource allocation decisions.</p>`,
    },
    'chart-country-archetypes': {
      title: 'Archetypes — selected country',
      body: `<p>Horizontal bar chart showing the distribution of the 8 Beyond archetypes for the selected country.</p>
<p>When the <strong>"vs Global Average"</strong> toggle is on, a dashed red line overlays each bar to show the global average for that archetype, enabling a direct comparison between the local profile and the programme-wide picture.</p>`,
    },
    'chart-country-trend': {
      title: 'Weekly Trend — selected country',
      body: `<p>Line chart showing the weekly completions trend for the selected country.</p>
<p>Useful for evaluating the effectiveness of local campaigns, market-specific events, or seasonal variations. Use the <strong>date range picker</strong> in the header to focus on a specific period.</p>`,
    },
    'chart-country-questions': {
      title: 'Answer Distribution Q1–Q10',
      body: `<p>Grouped bar chart showing how users in the selected country answered each of the <strong>10 Beyond survey questions</strong>.</p>
<p>For each question, 4 bars are displayed — one per answer option (<strong>A, B, C, D</strong>). The answers are not neutral: each option maps to a different orientation across the Beyond archetypes. The emerging preferences reveal the dominant professional attitudes in the local market.</p>
<p>The audience filter updates the data by segment.</p>`,
    },
    'chart-country-audience': {
      title: 'Audience Split — selected country',
      body: `<p>Doughnut chart showing the breakdown of completions in the selected country by audience segment: <strong>B2B</strong>, <strong>B2C</strong>, <strong>General</strong>.</p>
<p>Compare this with the global Audience Split to understand whether the local audience mix differs from the average, and to inform the country's survey distribution strategy.</p>`,
    },
    'chart-completion-rate': {
      title: 'Completions by Country',
      body: `<p>Horizontal bar chart showing the <strong>absolute number of completed surveys</strong> for each country, sorted from highest to lowest.</p>
<p>Only completed records are counted — this reflects the data available from the Perabite database. Abandoned sessions are not recorded at the DB level and therefore cannot be included.</p>
<p><em>Note: this data is fixed and does not respond to audience or date range filters.</em></p>`,
    },
    'chart-tiebreaker-rate': {
      title: 'Tiebreaker Rate',
      body: `<p>Doughnut chart showing, out of all completions for the entire period, how many required the <strong>Q11 tiebreaker question</strong> and how many produced a winning archetype directly.</p>
<p>A high tiebreaker rate may indicate that survey questions frequently produce balanced scores between archetypes, suggesting a lack of clear differentiation in responses. A low rate indicates that most users have a well-defined profile.</p>
<p><em>Note: fixed data calculated over the entire non-pre-launch period. Does not respond to audience or date range filters.</em></p>`,
    },
    'chart-tiebreaker': {
      title: 'Q11 Tiebreaker Analysis',
      body: `<p>Horizontal bar chart showing the distribution of responses to the <strong>Q11 tiebreaker question</strong>, displayed only for completions that produced a tied score between two archetypes.</p>
<p>Q11 is shown to respondents only in the event of a tie and guides the final archetype assignment. The four options (A, B, C, D) each favour different archetypes:</p>
<ul style="padding-left:16px;margin:8px 0">
  <li><strong>Option A</strong> — tends to favour Strategist / Captain</li>
  <li><strong>Option B</strong> — tends to favour Problem Solver / Pragmatist</li>
  <li><strong>Option C</strong> — tends to favour Craftsman / Strategist</li>
  <li><strong>Option D</strong> — tends to favour Connector / Collaborator</li>
</ul>
<p>The percentage shown reflects how often each option was chosen across all tiebreaker cases. <em>Note: fixed data, does not respond to filters.</em></p>`,
    },
    'chart-heatmap': {
      title: 'Archetype Distribution by Country',
      body: `<p>Horizontal 100% stacked bar chart showing how the <strong>8 Beyond archetypes</strong> are distributed for each country, expressed as a percentage of that country's total completions.</p>
<p>Each row is a country (sorted by completion volume, highest to lowest). Each coloured segment corresponds to an archetype. Percentage labels appear for segments above 7%.</p>
<p>This chart helps identify <strong>geographic patterns</strong>: countries with similar profiles, markets dominated by a single archetype, or countries with a particularly balanced distribution.</p>
<p>The chart responds to the active <strong>audience</strong> and <strong>date range</strong> filters.</p>`,
    },
'chart-country-deviation': {
      title: 'Deviation from Global Average',
      body: `<p>Horizontal bar chart with <strong>positive and negative values</strong> showing, for the selected country, how much each archetype deviates from the global distribution.</p>
<p>The value shown is the <strong>deviation in percentage points (pp)</strong>: positive (blue) means that archetype is more represented in the country than the global average; negative (red) means it is less represented.</p>
<p>Example: "+8.2 pp" for the Captain means the country has a share of Captains 8.2 points higher than the Beyond global average.</p>
<p>The chart responds to the active <strong>audience</strong> and <strong>date range</strong> filters.</p>`,
    },
  };

  function openHelpModal(key) {
    const content = HELP_CONTENT[key];
    if (!content) return;
    $('helpModalTitle').textContent = content.title;
    $('helpModalBody').innerHTML    = content.body;
    $('helpModal').hidden = false;
    $('helpModalClose').focus();
  }

  function closeHelpModal() {
    $('helpModal').hidden = true;
  }

  function bindHelpModal() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.help-btn[data-help]');
      if (btn) {
        e.stopPropagation();
        openHelpModal(btn.dataset.help);
        return;
      }
      if (e.target.id === 'helpModalClose' || e.target.id === 'helpModalBackdrop') {
        closeHelpModal();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !$('helpModal').hidden) closeHelpModal();
    });
  }

  // -------------------------------------------------------------------------
  // Event listeners
  // -------------------------------------------------------------------------
  function bindEvents() {
    // Target segmented control
    document.querySelectorAll('[data-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-target]').forEach(b =>
          b.classList.remove('segmented-control__button--active'));
        btn.classList.add('segmented-control__button--active');
        state.target = btn.dataset.target;
        refresh();
      });
    });

    // Combobox bespoke
    const cbInput = $('countryInput');

    cbInput.addEventListener('focus', () => { openCombo(); });
    cbInput.addEventListener('click',  () => { if ($('countryListbox').hidden) openCombo(); });
    cbInput.addEventListener('blur',   () => setTimeout(closeCombo, 150));

    cbInput.addEventListener('input', () => {
      if ($('countryListbox').hidden) openCombo();
      renderComboList(cbInput.value);
    });

    cbInput.addEventListener('keydown', e => {
      const items = $('countryListbox').querySelectorAll('.country-combobox__item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        _comboIdx = Math.min(_comboIdx + 1, items.length - 1);
        highlightComboItem(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        _comboIdx = Math.max(_comboIdx - 1, 0);
        highlightComboItem(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (_comboIdx >= 0 && items[_comboIdx]) {
          selectComboValue(items[_comboIdx].dataset.value);
          closeCombo();
        }
      } else if (e.key === 'Escape') {
        closeCombo();
      }
    });

    // Prev / Next country
    $('countryPrev').addEventListener('click', () => {
      const cur = _comboItems.findIndex(i => i.value === state.country);
      if (cur > 0) selectComboValue(_comboItems[cur - 1].value);
    });

    $('countryNext').addEventListener('click', () => {
      const cur = _comboItems.findIndex(i => i.value === state.country);
      if (cur < _comboItems.length - 1) selectComboValue(_comboItems[cur + 1].value);
    });

    // Date range picker
    $('dateRangePicker').addEventListener('click', e => {
      e.stopPropagation();
      if ($('weekPicker').hidden) openWeekPicker();
      else closeWeekPicker();
    });

    $('wpReset').addEventListener('click', () => {
      state.weekFrom = null;
      state.weekTo   = null;
      closeWeekPicker();
      renderMeta();
      refresh();
    });

    // Chiudi popup cliccando fuori
    document.addEventListener('click', e => {
      if (!$('weekPicker').hidden &&
          !$('weekPicker').contains(e.target) &&
          e.target !== $('dateRangePicker')) {
        closeWeekPicker();
      }
    });

    // Chiudi popup con Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !$('weekPicker').hidden) closeWeekPicker();
      if (e.key === 'Escape' && !$('jsonModal').hidden) $('jsonModal').hidden = true;
    });

    // JSON viewer
    $('btnViewJson').addEventListener('click', () => {
      $('jsonModalTitle').textContent = 'JSON Structure — dashboard_data.json';
      $('jsonModalPre').textContent = jsonStructure(state.raw);
      $('jsonModal').hidden = false;
      $('jsonModalClose').focus();
    });

    $('jsonModalClose').addEventListener('click', () => { $('jsonModal').hidden = true; });
    $('jsonModalBackdrop').addEventListener('click', () => { $('jsonModal').hidden = true; });

    // Copy JSON structure
    $('jsonModalCopy').addEventListener('click', () => {
      const btn = $('jsonModalCopy');
      navigator.clipboard.writeText($('jsonModalPre').textContent).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('json-modal__copy-btn--copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('json-modal__copy-btn--copied');
        }, 2000);
      });
    });

    // Full dataset download
    $('btnDownloadJson').addEventListener('click', () => {
      const a    = document.createElement('a');
      a.href     = '../../data/mock_survey_results.json';
      a.download = 'mock_survey_results.json';
      a.click();
    });
  }

  // -------------------------------------------------------------------------
  // KPI strip — copia i valori dalle card e la mostra/nasconde via Observer
  // -------------------------------------------------------------------------
  function syncKpiStrip() {
    $('kpiStripTotal').textContent          = $('kpiTotal').textContent;
    $('kpiStripArchetype').textContent      = $('kpiTopArchetype').textContent;
    $('kpiStripCountries').textContent      = $('kpiCountries').textContent;
    $('kpiStripCountriesLabel').textContent = $('kpiCountriesLabel').textContent;
    $('kpiStripContext').textContent        = $('sectionTitle').textContent;
  }

  function syncFilterBarHeight() {
    const bar = document.querySelector('.dash-filters');
    if (!bar) return;
    document.documentElement.style.setProperty(
      '--dash-filters-height', bar.getBoundingClientRect().height + 'px'
    );
  }

  function initKpiStrip() {
    const grid  = $('kpiGrid');
    const strip = $('kpiStrip');
    if (!grid || !strip || !window.IntersectionObserver) return;
    const obs = new IntersectionObserver(
      ([entry]) => strip.classList.toggle('kpi-strip--visible', !entry.isIntersecting),
      { threshold: 0, rootMargin: '-1px 0px 0px 0px' }
    );
    obs.observe(grid);
  }

  // -------------------------------------------------------------------------
  // Init
  // -------------------------------------------------------------------------
  async function init() {
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      state.raw = await res.json();

      renderMeta();
      initCombo();
      DashCharts.init();
      bindEvents();
      bindHelpModal();
      initKpiStrip();
      refresh();
    } catch (err) {
      console.error('Dashboard data loading error:', err);
      document.querySelector('.dash-main').insertAdjacentHTML('afterbegin',
        `<div style="padding:24px;color:#e74c3c;background:#fff;border-radius:12px;margin-bottom:16px;">
          <strong>Data loading error.</strong><br>
          Make sure you are serving the page via an HTTP server (e.g. <code>python3 -m http.server</code>)
          and that you have run <code>python3 scripts/aggregate_dashboard_data.py</code>.
        </div>`
      );
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    syncFilterBarHeight();
    window.addEventListener('resize', syncFilterBarHeight);
    init();
  });

})();
