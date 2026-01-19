/**
 * Beyond Titles - Survey Archetipi Professionali
 * Questionario comportamentale per determinare l'archetipo professionale
 */

(function() {
    'use strict';

    // =========================================================================
    // Configuration
    // =========================================================================
    const CONFIG = {
        surveyDataUrl: './data/survey_archetypes.json',
        pointsPlus: 2,
        pointsMinus: -1,
        blendThreshold: 2
    };

    // =========================================================================
    // State
    // =========================================================================
    const state = {
        surveyData: null,
        currentQuestion: 0,
        answers: [], // Array of { questionId, plusOptionId, minusOptionId }
        scores: {} // { archetipo: punteggio }
    };

    // =========================================================================
    // DOM Elements
    // =========================================================================
    const elements = {};

    // =========================================================================
    // Initialization
    // =========================================================================
    function initializeElements() {
        // Segmented Control
        elements.tabRuolo = document.getElementById('tab-ruolo');
        elements.tabSondaggio = document.getElementById('tab-sondaggio');
        elements.panelRuolo = document.getElementById('panel-ruolo');
        elements.panelSondaggio = document.getElementById('panel-sondaggio');

        // Survey sections
        elements.surveyIntro = document.getElementById('survey-intro');
        elements.surveyQuestions = document.getElementById('survey-questions');
        elements.surveyResults = document.getElementById('survey-results');

        // Survey controls
        elements.startBtn = document.getElementById('survey-start');
        elements.prevBtn = document.getElementById('survey-prev');
        elements.nextBtn = document.getElementById('survey-next');
        elements.restartBtn = document.getElementById('survey-restart');

        // Survey content
        elements.progressFill = document.getElementById('survey-progress-fill');
        elements.progressText = document.getElementById('survey-progress-text');
        elements.questionContainer = document.getElementById('survey-question-container');
        elements.resultsContent = document.getElementById('survey-results-content');

        // System Log
        elements.systemLog = document.getElementById('systemLog');
    }

    // =========================================================================
    // System Log Functions
    // =========================================================================
    const SCORES_TABLE_ID = 'survey-scores-table';

    function getTimestamp() {
        const now = new Date();
        return now.toTimeString().slice(0, 8);
    }

    function logSurveyActivity(message, isHtml = false) {
        if (!elements.systemLog) return;

        const entry = document.createElement('div');
        entry.className = 'system-log__entry';

        const timestamp = `<span class="system-log__timestamp">[${getTimestamp()}]</span>`;
        const typeLabel = `<span class="system-log__type--logic">SURVEY:</span>`;
        const messageSpan = isHtml
            ? `<span class="system-log__message">${message}</span>`
            : `<span class="system-log__message">${escapeHtml(message)}</span>`;

        entry.innerHTML = `${timestamp} ${typeLabel} ${messageSpan}`;
        elements.systemLog.appendChild(entry);
        elements.systemLog.scrollTop = elements.systemLog.scrollHeight;
    }

    function createScoresTable() {
        if (!elements.systemLog || !state.surveyData) return;

        // Remove existing table if any
        const existingTable = document.getElementById(SCORES_TABLE_ID);
        if (existingTable) {
            existingTable.remove();
        }

        // Create table container
        const tableContainer = document.createElement('div');
        tableContainer.id = SCORES_TABLE_ID;
        tableContainer.className = 'system-log__scores-table';

        // Build table HTML
        const archetipiKeys = Object.keys(state.surveyData.archetipi);

        let tableHtml = `
            <div class="scores-table__header">
                <span class="scores-table__title">Score Archetipi</span>
                <span class="scores-table__progress" id="scores-progress">Q0/10</span>
            </div>
            <div class="scores-table__grid">
        `;

        archetipiKeys.forEach(key => {
            const archetype = state.surveyData.archetipi[key];
            const shortName = archetype.nome
                .replace('Il ', '')
                .replace('Lo ', '')
                .replace("L'", '');

            tableHtml += `
                <div class="scores-table__row" data-archetype="${key}">
                    <span class="scores-table__name" style="color: ${archetype.colore}">${shortName}</span>
                    <div class="scores-table__bar-container">
                        <div class="scores-table__bar scores-table__bar--positive" data-bar="positive" style="background-color: ${archetype.colore}"></div>
                        <div class="scores-table__bar scores-table__bar--negative" data-bar="negative"></div>
                    </div>
                    <span class="scores-table__value" data-value>0</span>
                </div>
            `;
        });

        tableHtml += '</div>';
        tableContainer.innerHTML = tableHtml;
        elements.systemLog.appendChild(tableContainer);
        elements.systemLog.scrollTop = elements.systemLog.scrollHeight;
    }

    function updateScoresTable() {
        if (!elements.systemLog || !state.surveyData) return;

        const table = document.getElementById(SCORES_TABLE_ID);
        if (!table) {
            createScoresTable();
            return;
        }

        // Update progress indicator
        const progressEl = table.querySelector('#scores-progress');
        if (progressEl) {
            const answered = state.answers.filter(a => a && a.plusOptionId && a.minusOptionId).length;
            progressEl.textContent = `Q${answered}/10`;
        }

        // Find max absolute score for scaling bars
        const scores = Object.values(state.scores);
        const maxScore = Math.max(Math.abs(Math.min(...scores, 0)), Math.max(...scores, 0), 1);

        // Sort archetypes by score (descending)
        const sortedArchetypes = Object.entries(state.scores)
            .sort((a, b) => b[1] - a[1]);

        // Get the grid container
        const grid = table.querySelector('.scores-table__grid');
        if (!grid) return;

        // Get current order of rows (before reordering)
        const rows = Array.from(grid.querySelectorAll('.scores-table__row'));
        const previousOrder = rows.map(row => row.dataset.archetype);

        // Create new order array
        const newOrder = sortedArchetypes.map(([key]) => key);

        // Reorder rows based on score and apply animations
        sortedArchetypes.forEach(([key, score], newIndex) => {
            const row = table.querySelector(`[data-archetype="${key}"]`);
            if (!row) return;

            // Find previous position
            const previousIndex = previousOrder.indexOf(key);

            // Remove previous animation classes
            row.classList.remove('scores-table__row--moving-up', 'scores-table__row--moving-down');

            // Apply animation class based on position change
            if (previousIndex !== -1 && previousIndex !== newIndex) {
                if (newIndex < previousIndex) {
                    // Moving up (better score)
                    row.classList.add('scores-table__row--moving-up');
                } else {
                    // Moving down (worse score)
                    row.classList.add('scores-table__row--moving-down');
                }

                // Remove animation class after animation completes
                setTimeout(() => {
                    row.classList.remove('scores-table__row--moving-up', 'scores-table__row--moving-down');
                }, 500);
            }

            // Move row to end (which maintains sorted order as we iterate)
            grid.appendChild(row);

            const valueEl = row.querySelector('[data-value]');
            const positiveBar = row.querySelector('[data-bar="positive"]');
            const negativeBar = row.querySelector('[data-bar="negative"]');

            // Update value
            if (valueEl) {
                const sign = score > 0 ? '+' : '';
                valueEl.textContent = `${sign}${score}`;
                valueEl.style.color = score > 0 ? '#27ae60' : score < 0 ? '#e74c3c' : '#888';
            }

            // Update bars (max width 100% represents maxScore)
            if (positiveBar) {
                const width = score > 0 ? (score / maxScore) * 100 : 0;
                positiveBar.style.width = `${width}%`;
            }
            if (negativeBar) {
                const width = score < 0 ? (Math.abs(score) / maxScore) * 100 : 0;
                negativeBar.style.width = `${width}%`;
            }
        });

        elements.systemLog.scrollTop = elements.systemLog.scrollHeight;
    }

    function removeScoresTable() {
        const table = document.getElementById(SCORES_TABLE_ID);
        if (table) {
            table.remove();
        }
    }

    // =========================================================================
    // Data Loading
    // =========================================================================
    async function loadSurveyData() {
        try {
            const response = await fetch(CONFIG.surveyDataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            state.surveyData = await response.json();
            console.log('[SURVEY] Data loaded successfully');

            // Log to System Log
            logDataLoaded();

            return true;
        } catch (error) {
            console.error('[SURVEY] Failed to load survey data:', error);
            return false;
        }
    }

    function logDataLoaded() {
        if (!elements.systemLog || !state.surveyData) return;

        const entry = document.createElement('div');
        entry.className = 'system-log__entry';

        const timestamp = `<span class="system-log__timestamp">[${getTimestamp()}]</span>`;
        const typeLabel = `<span class="system-log__type--info">INFO:</span>`;

        const numDomande = state.surveyData.domande?.length || 0;
        const numArchetipi = Object.keys(state.surveyData.archetipi || {}).length;
        const archetipiList = Object.keys(state.surveyData.archetipi || {}).join(', ');

        const message = `Loaded survey_archetypes.json - ${numDomande} domande, ${numArchetipi} archetipi (${archetipiList})`;

        entry.innerHTML = `${timestamp} ${typeLabel} <span class="system-log__message">${message}</span>`;
        elements.systemLog.appendChild(entry);
        elements.systemLog.scrollTop = elements.systemLog.scrollHeight;
    }

    // =========================================================================
    // Segmented Control
    // =========================================================================
    function initSegmentedControl() {
        const tabs = document.querySelectorAll('.segmented-control__button');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const panelId = tab.dataset.panel;
                switchPanel(panelId);
            });
        });
    }

    function switchPanel(panelId) {
        // Update tabs
        const tabs = document.querySelectorAll('.segmented-control__button');
        tabs.forEach(tab => {
            const isActive = tab.dataset.panel === panelId;
            tab.classList.toggle('segmented-control__button--active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });

        // Update panels
        const panels = document.querySelectorAll('.panel');
        panels.forEach(panel => {
            const isActive = panel.id === `panel-${panelId}`;
            panel.classList.toggle('panel--active', isActive);
            panel.hidden = !isActive;
        });
    }

    // =========================================================================
    // Survey Flow
    // =========================================================================
    function startSurvey() {
        // Reset state
        state.currentQuestion = 0;
        state.answers = [];
        initializeScores();

        // Log survey start and create scores table
        logSurveyActivity('Sondaggio iniziato - 10 domande');
        createScoresTable();
        updateScoresTable();

        // Show questions section
        elements.surveyIntro.hidden = true;
        elements.surveyQuestions.hidden = false;
        elements.surveyResults.hidden = true;

        // Render first question
        renderQuestion();
        updateProgress();
        updateNavigation();
    }

    function initializeScores() {
        state.scores = {};
        if (state.surveyData && state.surveyData.archetipi) {
            Object.keys(state.surveyData.archetipi).forEach(key => {
                state.scores[key] = 0;
            });
        }
    }

    function renderQuestion() {
        const question = state.surveyData.domande[state.currentQuestion];
        const answer = state.answers[state.currentQuestion] || { plusOptionId: null, minusOptionId: null };

        const html = `
            <p class="survey__question-stem">${escapeHtml(question.stem)}</p>
            <div class="survey__options">
                ${question.opzioni.map(option => renderOption(option, answer)).join('')}
            </div>
        `;

        elements.questionContainer.innerHTML = html;

        // Bind option button events
        bindOptionEvents();
    }

    function renderOption(option, answer) {
        const isPlusSelected = answer.plusOptionId === option.id;
        const isMinusSelected = answer.minusOptionId === option.id;

        let optionClass = 'survey__option';
        if (isPlusSelected) optionClass += ' survey__option--selected-plus';
        if (isMinusSelected) optionClass += ' survey__option--selected-minus';

        return `
            <div class="${optionClass}" data-option-id="${option.id}">
                <div class="survey__option-buttons">
                    <button
                        class="survey__option-btn survey__option-btn--plus ${isPlusSelected ? 'survey__option-btn--active' : ''}"
                        data-option-id="${option.id}"
                        data-type="plus"
                        aria-label="Seleziona come PIU simile"
                        ${isMinusSelected ? 'disabled' : ''}
                    >+</button>
                    <button
                        class="survey__option-btn survey__option-btn--minus ${isMinusSelected ? 'survey__option-btn--active' : ''}"
                        data-option-id="${option.id}"
                        data-type="minus"
                        aria-label="Seleziona come MENO simile"
                        ${isPlusSelected ? 'disabled' : ''}
                    >-</button>
                </div>
                <span class="survey__option-text">${escapeHtml(option.testo)}</span>
            </div>
        `;
    }

    function bindOptionEvents() {
        const buttons = elements.questionContainer.querySelectorAll('.survey__option-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', handleOptionClick);
        });
    }

    function handleOptionClick(e) {
        const optionId = e.target.dataset.optionId;
        const type = e.target.dataset.type; // 'plus' or 'minus'

        // Get or create answer for current question
        if (!state.answers[state.currentQuestion]) {
            state.answers[state.currentQuestion] = {
                questionId: state.surveyData.domande[state.currentQuestion].id,
                plusOptionId: null,
                minusOptionId: null
            };
        }

        const answer = state.answers[state.currentQuestion];

        // Toggle selection
        if (type === 'plus') {
            answer.plusOptionId = answer.plusOptionId === optionId ? null : optionId;
        } else {
            answer.minusOptionId = answer.minusOptionId === optionId ? null : optionId;
        }

        // Re-render question to update UI
        renderQuestion();
        updateNavigation();
    }

    function updateProgress() {
        const total = state.surveyData.domande.length;
        const current = state.currentQuestion + 1;
        const percentage = (current / total) * 100;

        elements.progressFill.style.width = `${percentage}%`;

        // Use i18n if available
        if (window.i18n) {
            elements.progressText.textContent = window.i18n.t('survey_progress', { current, total }) || `Domanda ${current} di ${total}`;
        } else {
            elements.progressText.textContent = `Domanda ${current} di ${total}`;
        }
    }

    function updateNavigation() {
        const answer = state.answers[state.currentQuestion];
        const isComplete = answer && answer.plusOptionId && answer.minusOptionId;
        const isLast = state.currentQuestion === state.surveyData.domande.length - 1;

        // Prev button always enabled - on first question goes back to intro
        elements.prevBtn.disabled = false;

        // Next button
        elements.nextBtn.disabled = !isComplete;

        // Update next button text for last question
        if (window.i18n) {
            elements.nextBtn.textContent = isLast ? window.i18n.t('survey_finish') || 'Scopri il Risultato' : window.i18n.t('survey_next') || 'Avanti';
        } else {
            elements.nextBtn.textContent = isLast ? 'Scopri il Risultato' : 'Avanti';
        }
    }

    function goToPrevQuestion() {
        if (state.currentQuestion > 0) {
            state.currentQuestion--;
            renderQuestion();
            updateProgress();
            updateNavigation();
        } else {
            // On first question, go back to intro
            goBackToIntro();
        }
    }

    function goBackToIntro() {
        // Reset state
        state.currentQuestion = 0;
        state.answers = [];
        initializeScores();

        // Remove scores table from System Log
        const scoresTable = document.getElementById(SCORES_TABLE_ID);
        if (scoresTable) {
            scoresTable.remove();
        }

        // Show intro, hide questions
        elements.surveyIntro.hidden = false;
        elements.surveyQuestions.hidden = true;
        elements.surveyResults.hidden = true;

        logSurveyActivity('Tornato alla schermata iniziale');
    }

    function goToNextQuestion() {
        const isLast = state.currentQuestion === state.surveyData.domande.length - 1;

        // Calculate partial scores up to current question
        calculatePartialScores();

        // Update scores table in-place
        updateScoresTable();

        if (isLast) {
            calculateResults();
            showResults();
            logSurveyActivity('Sondaggio completato!');
            // Keep scores table visible on results - don't remove it
        } else {
            state.currentQuestion++;
            renderQuestion();
            updateProgress();
            updateNavigation();
        }
    }

    function calculatePartialScores() {
        // Reset scores
        initializeScores();

        // Process answers up to current question (inclusive)
        for (let i = 0; i <= state.currentQuestion; i++) {
            const answer = state.answers[i];
            if (!answer) continue;

            const question = state.surveyData.domande[i];
            const plusOption = question.opzioni.find(o => o.id === answer.plusOptionId);
            const minusOption = question.opzioni.find(o => o.id === answer.minusOptionId);

            if (plusOption) {
                applyPoints(plusOption, question, 'plus');
            }
            if (minusOption) {
                applyPoints(minusOption, question, 'minus');
            }
        }
    }

    // =========================================================================
    // Scoring Logic
    // =========================================================================
    function calculateResults() {
        // Reset scores
        initializeScores();

        // Process each answer
        state.answers.forEach((answer, index) => {
            const question = state.surveyData.domande[index];

            // Find plus and minus options
            const plusOption = question.opzioni.find(o => o.id === answer.plusOptionId);
            const minusOption = question.opzioni.find(o => o.id === answer.minusOptionId);

            // Apply plus points
            if (plusOption) {
                applyPoints(plusOption, question, 'plus');
            }

            // Apply minus points
            if (minusOption) {
                applyPoints(minusOption, question, 'minus');
            }
        });

        console.log('[SURVEY] Final scores:', state.scores);
    }

    function applyPoints(option, question, type) {
        const isSpecial = question.special && Array.isArray(option.archetipo);

        if (isSpecial) {
            // Q10 special case: split points between multiple archetypes
            const archetipi = option.archetipo;
            if (type === 'plus') {
                const points = option.punti_piu || [1, 1];
                archetipi.forEach((arch, i) => {
                    state.scores[arch] = (state.scores[arch] || 0) + points[i];
                });
            } else {
                const points = option.punti_meno || [-0.5, -0.5];
                archetipi.forEach((arch, i) => {
                    state.scores[arch] = (state.scores[arch] || 0) + points[i];
                });
            }
        } else {
            // Normal case: single archetype
            const archetipo = option.archetipo;
            if (type === 'plus') {
                state.scores[archetipo] = (state.scores[archetipo] || 0) + CONFIG.pointsPlus;
            } else {
                state.scores[archetipo] = (state.scores[archetipo] || 0) + CONFIG.pointsMinus;
            }
        }
    }

    function getTopArchetypes() {
        // Sort archetypes by score (descending)
        const sorted = Object.entries(state.scores)
            .sort((a, b) => b[1] - a[1]);

        const primary = sorted[0];
        const secondary = sorted[1];

        // Handle tie-break using Q10
        if (primary[1] === secondary[1]) {
            // Use Q10 answer as tie-break
            const q10Answer = state.answers[9];
            if (q10Answer) {
                const q10 = state.surveyData.domande[9];
                const plusOption = q10.opzioni.find(o => o.id === q10Answer.plusOptionId);
                if (plusOption) {
                    const tieBreakArch = Array.isArray(plusOption.archetipo)
                        ? plusOption.archetipo[0]
                        : plusOption.archetipo;

                    // If tie-break archetype is in the tie, prioritize it
                    if (primary[0] === tieBreakArch || secondary[0] === tieBreakArch) {
                        if (secondary[0] === tieBreakArch) {
                            return { primary: secondary, secondary: primary };
                        }
                    }
                }
            }
        }

        return { primary, secondary };
    }

    // =========================================================================
    // Results Display
    // =========================================================================
    function showResults() {
        elements.surveyQuestions.hidden = true;
        elements.surveyResults.hidden = false;

        const { primary, secondary } = getTopArchetypes();
        const delta = primary[1] - secondary[1];
        const isBlend = delta <= CONFIG.blendThreshold;

        const primaryArchetype = state.surveyData.archetipi[primary[0]];
        const secondaryArchetype = state.surveyData.archetipi[secondary[0]];

        let html = `
            <div class="survey__result-card" style="border-color: ${primaryArchetype.colore}">
                <p class="survey__result-label" style="color: ${primaryArchetype.colore}">
                    ${isBlend ? 'Archetipo Primario' : 'Il Tuo Archetipo'}
                </p>
                <h2 class="survey__result-archetype">${escapeHtml(primaryArchetype.nome)}</h2>
                <p class="survey__result-claim">"${escapeHtml(primaryArchetype.claim)}"</p>
                <p class="survey__result-profilo" style="border-color: ${primaryArchetype.colore}">
                    ${escapeHtml(primaryArchetype.profilo)}
                </p>
                <div class="survey__result-skills">
                    ${primaryArchetype.soft_skills.map(skill => `
                        <span class="survey__result-skill" style="background-color: ${primaryArchetype.colore}20; color: ${primaryArchetype.colore}">
                            ${escapeHtml(skill)}
                        </span>
                    `).join('')}
                </div>
        `;

        if (isBlend) {
            // Calculate percentages for blend bar
            const total = primary[1] + secondary[1];
            const primaryPct = total > 0 ? Math.round((primary[1] / total) * 100) : 50;
            const secondaryPct = 100 - primaryPct;

            html += `
                <div class="survey__result-blend">
                    <p class="survey__result-blend-title">Il tuo profilo blend</p>
                    <div class="survey__result-blend-bar">
                        <div class="survey__result-blend-segment" style="width: ${primaryPct}%; background-color: ${primaryArchetype.colore}">
                            ${primaryPct}%
                        </div>
                        <div class="survey__result-blend-segment" style="width: ${secondaryPct}%; background-color: ${secondaryArchetype.colore}">
                            ${secondaryPct}%
                        </div>
                    </div>
                </div>
            `;
        }

        html += `</div>`;

        // Show secondary archetype card only when blend
        if (isBlend) {
            html += `
                <div class="survey__result-card survey__result-card--secondary" style="border-color: ${secondaryArchetype.colore}" id="secondary-card">
                    <button class="survey__result-card-header" id="secondary-toggle" aria-expanded="false" aria-controls="secondary-details">
                        <div class="survey__result-card-header-content">
                            <p class="survey__result-label" style="color: ${secondaryArchetype.colore}">Archetipo Secondario</p>
                            <h2 class="survey__result-archetype">${escapeHtml(secondaryArchetype.nome)}</h2>
                            <p class="survey__result-claim">"${escapeHtml(secondaryArchetype.claim)}"</p>
                        </div>
                        <span class="survey__result-card-chevron" style="color: ${secondaryArchetype.colore}">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </button>
                    <div class="survey__result-card-details" id="secondary-details" hidden>
                        <p class="survey__result-profilo" style="border-color: ${secondaryArchetype.colore}">
                            ${escapeHtml(secondaryArchetype.profilo)}
                        </p>
                        <div class="survey__result-skills">
                            ${secondaryArchetype.soft_skills.map(skill => `
                                <span class="survey__result-skill" style="background-color: ${secondaryArchetype.colore}20; color: ${secondaryArchetype.colore}">
                                    ${escapeHtml(skill)}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        elements.resultsContent.innerHTML = html;

        // Bind accordion toggle event for secondary card (only if blend)
        if (isBlend) {
            const toggleBtn = document.getElementById('secondary-toggle');
            const details = document.getElementById('secondary-details');
            const card = document.getElementById('secondary-card');
            if (toggleBtn && details && card) {
                toggleBtn.addEventListener('click', () => {
                    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                    toggleBtn.setAttribute('aria-expanded', !isExpanded);
                    details.hidden = isExpanded;
                    card.classList.toggle('survey__result-card--expanded', !isExpanded);
                });
            }
        }
    }

    function restartSurvey() {
        // Remove scores table if present
        removeScoresTable();

        // Reset to intro
        elements.surveyIntro.hidden = false;
        elements.surveyQuestions.hidden = true;
        elements.surveyResults.hidden = true;

        // Reset state
        state.currentQuestion = 0;
        state.answers = [];
        initializeScores();
    }

    // =========================================================================
    // Utilities
    // =========================================================================
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // =========================================================================
    // Survey Presets Modal
    // =========================================================================

    // Realistic blend pairings based on archetype similarities
    const BLEND_PAIRINGS = {
        connettore: 'collaboratore',   // Both focus on relationships and teamwork
        stratega: 'pragmatico',        // Both focus on planning and organization
        pragmatico: 'artigiano',       // Both focus on execution and precision
        collaboratore: 'connettore',   // Both focus on people and team dynamics
        risolutore: 'pioniere',        // Both focus on solving problems creatively
        pioniere: 'risolutore',        // Both take initiative and find new solutions
        capitano: 'stratega',          // Both focus on leadership and direction
        artigiano: 'pragmatico'        // Both focus on quality and execution
    };

    function initPresetsModal() {
        const presetsLink = document.getElementById('surveyPresetsLink');
        const presetsModal = document.getElementById('surveyPresetsModal');
        const presetsCloseBtn = document.getElementById('surveyPresetsCloseBtn');
        const presetsBackdrop = presetsModal?.querySelector('.modal__backdrop');

        if (!presetsLink || !presetsModal) return;

        // Open modal
        presetsLink.addEventListener('click', function(e) {
            e.preventDefault();
            renderPresetsGrid();
            presetsModal.classList.add('modal--visible');
            document.body.style.overflow = 'hidden';
        });

        // Close modal
        function closePresetsModal() {
            presetsModal.classList.remove('modal--visible');
            document.body.style.overflow = '';
        }

        if (presetsCloseBtn) {
            presetsCloseBtn.addEventListener('click', closePresetsModal);
        }

        if (presetsBackdrop) {
            presetsBackdrop.addEventListener('click', closePresetsModal);
        }

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && presetsModal.classList.contains('modal--visible')) {
                closePresetsModal();
            }
        });
    }

    function renderPresetsGrid() {
        const grid = document.getElementById('surveyPresetsGrid');
        const blendToggle = document.getElementById('surveyPresetsBlendToggle');
        if (!grid || !state.surveyData) return;

        const archetipi = state.surveyData.archetipi;
        let html = '';

        Object.entries(archetipi).forEach(([key, archetype]) => {
            const shortName = archetype.nome.replace('Il ', '').replace('Lo ', '').replace("L'", '');

            html += `
                <div class="survey-presets__card" data-archetype="${key}" style="--card-border-color: ${archetype.colore}">
                    <div class="survey-presets__card-header">
                        <span class="survey-presets__card-dot" style="background-color: ${archetype.colore}"></span>
                        <span class="survey-presets__card-name">${escapeHtml(shortName)}</span>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;

        // Bind click events on cards
        grid.querySelectorAll('.survey-presets__card').forEach(card => {
            card.addEventListener('click', () => {
                const archetypeKey = card.dataset.archetype;
                const withBlend = blendToggle?.checked || false;

                simulateArchetypeResult(archetypeKey, withBlend);
            });
        });
    }

    function simulateArchetypeResult(primaryKey, withBlend) {
        // Close modal
        const presetsModal = document.getElementById('surveyPresetsModal');
        if (presetsModal) {
            presetsModal.classList.remove('modal--visible');
            document.body.style.overflow = '';
        }

        // Initialize scores
        initializeScores();

        // Set primary archetype with high score
        const primaryScore = 10;
        state.scores[primaryKey] = primaryScore;

        if (withBlend) {
            // Set secondary archetype within blend threshold
            const secondaryKey = BLEND_PAIRINGS[primaryKey];
            const secondaryScore = primaryScore - 1; // Within blend threshold of 2
            state.scores[secondaryKey] = secondaryScore;

            // Give small scores to others to make it realistic
            Object.keys(state.scores).forEach(key => {
                if (key !== primaryKey && key !== secondaryKey) {
                    state.scores[key] = Math.floor(Math.random() * 3) - 1; // -1 to 1
                }
            });
        } else {
            // Set secondary with score outside blend threshold
            const sortedOthers = Object.keys(state.scores)
                .filter(k => k !== primaryKey)
                .sort(() => Math.random() - 0.5);

            state.scores[sortedOthers[0]] = primaryScore - 4; // Outside blend threshold

            // Random small scores for others
            sortedOthers.slice(1).forEach(key => {
                state.scores[key] = Math.floor(Math.random() * 4) - 2; // -2 to 1
            });
        }

        // Log simulation
        const primaryName = state.surveyData.archetipi[primaryKey].nome;
        if (withBlend) {
            const secondaryKey = BLEND_PAIRINGS[primaryKey];
            const secondaryName = state.surveyData.archetipi[secondaryKey].nome;
            logSurveyActivity(`Simulazione: ${primaryName} + ${secondaryName} (blend)`);
        } else {
            logSurveyActivity(`Simulazione: ${primaryName}`);
        }

        // Create fake answers array (so restart works)
        state.answers = new Array(10).fill(null).map((_, i) => ({
            questionId: i + 1,
            plusOptionId: `${i + 1}A`,
            minusOptionId: `${i + 1}B`
        }));
        state.currentQuestion = 9;

        // Create scores table and update it
        createScoresTable();
        updateScoresTable();

        // Show results directly
        elements.surveyIntro.hidden = true;
        elements.surveyQuestions.hidden = true;
        elements.surveyResults.hidden = false;

        showResults();
    }

    // =========================================================================
    // Event Binding
    // =========================================================================
    function bindEvents() {
        // Start button
        if (elements.startBtn) {
            elements.startBtn.addEventListener('click', startSurvey);
        }

        // Navigation buttons
        if (elements.prevBtn) {
            elements.prevBtn.addEventListener('click', goToPrevQuestion);
        }
        if (elements.nextBtn) {
            elements.nextBtn.addEventListener('click', goToNextQuestion);
        }

        // Restart button
        if (elements.restartBtn) {
            elements.restartBtn.addEventListener('click', restartSurvey);
        }

        // Presets modal
        initPresetsModal();
    }

    // =========================================================================
    // Main Init
    // =========================================================================
    async function init() {
        console.log('[SURVEY] Initializing...');

        initializeElements();

        // Load survey data
        const dataLoaded = await loadSurveyData();
        if (!dataLoaded) {
            console.error('[SURVEY] Failed to initialize - data not loaded');
            return;
        }

        initSegmentedControl();
        bindEvents();

        // Log "Application ready" as final message (after all data is loaded)
        logApplicationReady();

        console.log('[SURVEY] Initialized successfully');
    }

    function logApplicationReady() {
        if (!elements.systemLog) return;

        const entry = document.createElement('div');
        entry.className = 'system-log__entry';

        const timestamp = `<span class="system-log__timestamp">[${getTimestamp()}]</span>`;
        const typeLabel = `<span class="system-log__type--info">INFO:</span>`;
        const message = window.i18n ? window.i18n.t('log_ready') : 'Application ready. Waiting for user input...';

        entry.innerHTML = `${timestamp} ${typeLabel} <span class="system-log__message">${message}</span>`;
        elements.systemLog.appendChild(entry);
        elements.systemLog.scrollTop = elements.systemLog.scrollHeight;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging
    window.surveyDebug = {
        getState: () => state,
        getScores: () => state.scores
    };

})();
