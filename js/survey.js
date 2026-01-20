/**
 * Beyond Titles - Survey Archetipi Professionali v2.0
 * Sistema single-choice: una selezione per domanda, +1 punto all'archetipo
 */

(function() {
    'use strict';

    // =========================================================================
    // Configuration
    // =========================================================================
    const CONFIG = {
        surveyDataUrl: './data/survey_archetypes.json',
        TOTAL_WEIGHT: 196,  // Somma di tutti i pesi
        SOGLIA_NETTO: 10,   // delta >= 10 per profilo netto
        totalQuestions: 10
    };

    // =========================================================================
    // State
    // =========================================================================
    const state = {
        surveyData: null,
        currentQuestion: 0,
        answers: [], // Array of { questionId, selectedOptionId, archetype }
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
            const answered = state.answers.filter(a => a && a.selectedOptionId).length;
            progressEl.textContent = `Q${answered}/10`;
        }

        // Find max score for scaling bars (max is 5 per archetype)
        const scores = Object.values(state.scores);
        const maxScore = Math.max(...scores, 1);

        // Sort archetypes by score (descending)
        const sortedArchetypes = Object.entries(state.scores)
            .sort((a, b) => b[1] - a[1]);

        // Get the grid container
        const grid = table.querySelector('.scores-table__grid');
        if (!grid) return;

        // Get current order of rows (before reordering)
        const rows = Array.from(grid.querySelectorAll('.scores-table__row'));
        const previousOrder = rows.map(row => row.dataset.archetype);

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
                    row.classList.add('scores-table__row--moving-up');
                } else {
                    row.classList.add('scores-table__row--moving-down');
                }

                setTimeout(() => {
                    row.classList.remove('scores-table__row--moving-up', 'scores-table__row--moving-down');
                }, 500);
            }

            // Move row to end (which maintains sorted order as we iterate)
            grid.appendChild(row);

            const valueEl = row.querySelector('[data-value]');
            const positiveBar = row.querySelector('[data-bar="positive"]');

            // Update value - show raw weighted score (integer)
            if (valueEl) {
                valueEl.textContent = Math.round(score);
                valueEl.style.color = score > 0 ? '#27ae60' : '#888';
            }

            // Update bar - max theoretical is 5 * max weight (~5750)
            // Use current max for relative scaling
            if (positiveBar) {
                const width = maxScore > 0 ? (score / maxScore) * 100 : 0;
                positiveBar.style.width = `${width}%`;
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

        const message = `Loaded survey_archetypes.json v2.0 - ${numDomande} domande, ${numArchetipi} archetipi (${archetipiList})`;

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
        logSurveyActivity('Sondaggio iniziato - 10 domande (single-choice)');
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
        const answer = state.answers[state.currentQuestion] || { selectedOptionId: null };

        const html = `
            <p class="survey__question-stem">${escapeHtml(question.stem)}</p>
            <div class="survey__options survey__options--single-choice">
                ${question.opzioni.map(option => renderOption(option, answer)).join('')}
            </div>
        `;

        elements.questionContainer.innerHTML = html;

        // Bind option events
        bindOptionEvents();
    }

    function renderOption(option, answer) {
        const isSelected = answer.selectedOptionId === option.id;

        let optionClass = 'survey__option survey__option--single';
        if (isSelected) optionClass += ' survey__option--selected';

        return `
            <div class="${optionClass}" data-option-id="${option.id}" role="radio" aria-checked="${isSelected}" tabindex="0">
                <div class="survey__option-radio">
                    <div class="survey__option-radio-dot ${isSelected ? 'survey__option-radio-dot--active' : ''}"></div>
                </div>
                <span class="survey__option-text">${escapeHtml(option.testo)}</span>
            </div>
        `;
    }

    function bindOptionEvents() {
        const options = elements.questionContainer.querySelectorAll('.survey__option--single');
        options.forEach(option => {
            option.addEventListener('click', handleOptionClick);
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOptionClick(e);
                }
            });
        });
    }

    function handleOptionClick(e) {
        const optionEl = e.target.closest('.survey__option--single');
        if (!optionEl) return;

        const optionId = optionEl.dataset.optionId;
        const question = state.surveyData.domande[state.currentQuestion];
        const selectedOption = question.opzioni.find(o => o.id === optionId);

        // Create or update answer for current question
        state.answers[state.currentQuestion] = {
            questionId: question.id,
            selectedOptionId: optionId,
            archetype: selectedOption.archetipo
        };

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
        const isComplete = answer && answer.selectedOptionId;
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

        // Get question weights from survey data
        const weights = state.surveyData.questionWeights || {};

        // Process answers up to current question (inclusive)
        for (let i = 0; i <= state.currentQuestion; i++) {
            const answer = state.answers[i];
            if (!answer || !answer.selectedOptionId) continue;

            // Get weight for this question (default to W_BAR if not specified)
            const questionKey = `Q${answer.questionId}`;
            const weight = weights[questionKey] || CONFIG.W_BAR;

            // Add weighted points to the selected archetype
            const archetype = answer.archetype;
            if (archetype && state.scores.hasOwnProperty(archetype)) {
                state.scores[archetype] += weight;
            }
        }
    }

    // =========================================================================
    // Scoring Logic
    // =========================================================================
    function calculateResults() {
        // Reset scores
        initializeScores();

        // Get question weights from survey data
        const weights = state.surveyData.questionWeights || {};

        // Process each answer - each selection adds weighted points
        state.answers.forEach((answer) => {
            if (!answer || !answer.selectedOptionId) return;

            // Get weight for this question (default to W_BAR if not specified)
            const questionKey = `Q${answer.questionId}`;
            const weight = weights[questionKey] || CONFIG.W_BAR;

            const archetype = answer.archetype;
            if (archetype && state.scores.hasOwnProperty(archetype)) {
                state.scores[archetype] += weight;
            }
        });

        console.log('[SURVEY] Final scores (weighted):', state.scores);
    }

    function rankArchetypes() {
        // Convert scores to array
        const entries = Object.entries(state.scores);

        // Group archetypes by score (for tie detection)
        const scoreGroups = {};
        entries.forEach(([archetype, score]) => {
            if (!scoreGroups[score]) {
                scoreGroups[score] = [];
            }
            scoreGroups[score].push(archetype);
        });

        // Shuffle archetypes within each score group (random tie-breaking)
        Object.values(scoreGroups).forEach(group => {
            if (group.length > 1) {
                // Fisher-Yates shuffle for fair randomization
                for (let i = group.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [group[i], group[j]] = [group[j], group[i]];
                }
            }
        });

        // Get unique scores sorted descending
        const sortedScores = Object.keys(scoreGroups)
            .map(Number)
            .sort((a, b) => b - a);

        // Build ranked array with randomized tie-breaking
        const ranked = [];
        sortedScores.forEach(score => {
            scoreGroups[score].forEach(archetype => {
                ranked.push({
                    archetype,
                    score,
                    rank: ranked.length + 1
                });
            });
        });

        return ranked;
    }

    function classifyProfile(rankedArchetypes) {
        const S1 = rankedArchetypes[0].score; // Primary score
        const S2 = rankedArchetypes[1].score; // Secondary score
        const S3 = rankedArchetypes[2].score; // Tertiary score

        // Direct delta comparison (no division needed with new weights)
        const delta12 = S1 - S2;
        const delta23 = S2 - S3;

        let profileType;
        let archetypesToShow;

        if (delta12 >= CONFIG.SOGLIA_NETTO) {
            // Profilo netto: primario dominante (delta >= 10)
            profileType = "netto";
            archetypesToShow = [rankedArchetypes[0]];
        } else {
            // Profilo blend (delta < 10)
            if (delta23 === 0 && delta12 === 0) {
                // Possibile blend a 3 archetipi (tutti e tre in parità)
                profileType = "blend_3";
                archetypesToShow = [rankedArchetypes[0], rankedArchetypes[1], rankedArchetypes[2]];
            } else {
                // Blend a 2 archetipi
                profileType = "blend_2";
                archetypesToShow = [rankedArchetypes[0], rankedArchetypes[1]];
            }
        }

        return {
            profileType,
            primary: rankedArchetypes[0],
            secondary: rankedArchetypes[1],
            tertiary: rankedArchetypes[2],
            archetypesToShow,
            delta12,
            delta23
        };
    }

    function calculatePercentages(S1, S2) {
        const total = S1 + S2;
        if (total === 0) return { w1: 50, w2: 50 };

        const w1Raw = (S1 / total) * 100;

        // Arrotonda a interi
        const w1 = Math.round(w1Raw);
        const w2 = 100 - w1;

        return { w1, w2 };
    }

    function calculateConfidence(S1, S2) {
        const delta = S1 - S2;
        // Confidence normalized to 0-1 range (max delta is 196)
        const confidence = delta / CONFIG.TOTAL_WEIGHT;

        let confidenceLabel;
        if (delta >= 30) {
            confidenceLabel = "molto_definito";
        } else if (delta >= 20) {
            confidenceLabel = "definito";
        } else if (delta >= 10) {
            confidenceLabel = "sfaccettato";
        } else {
            confidenceLabel = "molto_sfaccettato";
        }

        return { confidence, confidenceLabel, delta };
    }

    // =========================================================================
    // Results Display
    // =========================================================================

    /**
     * Gets translated archetype data
     * @param {string} archetypeKey - The archetype key (e.g., 'connettore')
     * @returns {Object} Translated archetype data
     */
    function getTranslatedArchetype(archetypeKey) {
        const baseData = state.surveyData.archetipi[archetypeKey];
        if (!baseData) return null;

        // Get translations if i18n is available
        if (window.i18n) {
            const nome = window.i18n.t(`archetype_${archetypeKey}_name`) || baseData.nome;
            const claim = window.i18n.t(`archetype_${archetypeKey}_claim`) || baseData.claim;
            const profilo = window.i18n.t(`archetype_${archetypeKey}_profile`) || baseData.profilo;
            const skillsStr = window.i18n.t(`archetype_${archetypeKey}_skills`);
            const soft_skills = skillsStr && skillsStr !== `archetype_${archetypeKey}_skills`
                ? skillsStr.split(', ')
                : baseData.soft_skills;

            return {
                ...baseData,
                nome,
                claim,
                profilo,
                soft_skills
            };
        }

        return baseData;
    }

    function showResults() {
        elements.surveyQuestions.hidden = true;
        elements.surveyResults.hidden = false;

        const ranked = rankArchetypes();
        const profile = classifyProfile(ranked);

        // Get translated archetype data
        const primaryArchetype = getTranslatedArchetype(profile.primary.archetype);
        const secondaryArchetype = getTranslatedArchetype(profile.secondary.archetype);

        const isBlend = profile.profileType !== 'netto';
        const { w1, w2 } = calculatePercentages(profile.primary.score, profile.secondary.score);
        const { confidence, confidenceLabel } = calculateConfidence(profile.primary.score, profile.secondary.score);

        // Log profile info (detect tie-breaking)
        const hasTie = profile.primary.score === profile.secondary.score;
        const tieInfo = hasTie ? ' | Tie: random' : '';
        logSurveyActivity(`Profilo: ${profile.profileType} | Δ: ${profile.delta12}${tieInfo} | Confidence: ${confidenceLabel}`);
        logSurveyActivity(`Scores: ${profile.primary.archetype}=${profile.primary.score}, ${profile.secondary.archetype}=${profile.secondary.score} | Blend: ${w1}%/${w2}%`);

        // Get translated labels
        const labelPrimary = window.i18n ? window.i18n.t('survey_result_primary') : 'Il Tuo Archetipo';
        const labelPrimaryBlend = window.i18n ? window.i18n.t('survey_result_primary_blend') : 'Archetipo Primario';
        const labelSecondary = window.i18n ? window.i18n.t('survey_result_secondary') : 'Archetipo Secondario';
        const labelBlendTitle = window.i18n ? window.i18n.t('survey_result_blend_title') : 'Il tuo profilo blend';

        let html = `
            <div class="survey__result-card" style="border-color: ${primaryArchetype.colore}">
                <p class="survey__result-label" style="color: ${primaryArchetype.colore}">
                    ${isBlend ? labelPrimaryBlend : labelPrimary}
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
            html += `
                <div class="survey__result-blend">
                    <p class="survey__result-blend-title">${labelBlendTitle}</p>
                    <div class="survey__result-blend-bar">
                        <div class="survey__result-blend-segment" style="width: ${w1}%; background-color: ${primaryArchetype.colore}">
                            ${w1}%
                        </div>
                        <div class="survey__result-blend-segment" style="width: ${w2}%; background-color: ${secondaryArchetype.colore}">
                            ${w2}%
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
                            <p class="survey__result-label" style="color: ${secondaryArchetype.colore}">${labelSecondary}</p>
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

        // Show tertiary archetype if blend_3
        if (profile.profileType === 'blend_3') {
            const tertiaryArchetype = getTranslatedArchetype(profile.tertiary.archetype);
            const labelTertiary = window.i18n ? window.i18n.t('survey_result_tertiary') : 'Archetipo Terziario';
            html += `
                <div class="survey__result-card survey__result-card--tertiary" style="border-color: ${tertiaryArchetype.colore}" id="tertiary-card">
                    <button class="survey__result-card-header" id="tertiary-toggle" aria-expanded="false" aria-controls="tertiary-details">
                        <div class="survey__result-card-header-content">
                            <p class="survey__result-label" style="color: ${tertiaryArchetype.colore}">${labelTertiary}</p>
                            <h2 class="survey__result-archetype">${escapeHtml(tertiaryArchetype.nome)}</h2>
                            <p class="survey__result-claim">"${escapeHtml(tertiaryArchetype.claim)}"</p>
                        </div>
                        <span class="survey__result-card-chevron" style="color: ${tertiaryArchetype.colore}">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </span>
                    </button>
                    <div class="survey__result-card-details" id="tertiary-details" hidden>
                        <p class="survey__result-profilo" style="border-color: ${tertiaryArchetype.colore}">
                            ${escapeHtml(tertiaryArchetype.profilo)}
                        </p>
                        <div class="survey__result-skills">
                            ${tertiaryArchetype.soft_skills.map(skill => `
                                <span class="survey__result-skill" style="background-color: ${tertiaryArchetype.colore}20; color: ${tertiaryArchetype.colore}">
                                    ${escapeHtml(skill)}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        elements.resultsContent.innerHTML = html;

        // Bind accordion toggle events
        bindResultsAccordions();
    }

    function bindResultsAccordions() {
        const toggles = [
            { toggle: 'secondary-toggle', details: 'secondary-details', card: 'secondary-card' },
            { toggle: 'tertiary-toggle', details: 'tertiary-details', card: 'tertiary-card' }
        ];

        toggles.forEach(({ toggle, details, card }) => {
            const toggleBtn = document.getElementById(toggle);
            const detailsEl = document.getElementById(details);
            const cardEl = document.getElementById(card);

            if (toggleBtn && detailsEl && cardEl) {
                toggleBtn.addEventListener('click', () => {
                    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                    toggleBtn.setAttribute('aria-expanded', !isExpanded);
                    detailsEl.hidden = isExpanded;
                    cardEl.classList.toggle('survey__result-card--expanded', !isExpanded);
                });
            }
        });
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

        // With new weights (total 196, soglia_netto = 10):
        // - Blend: delta < 10 between primary and secondary
        // - Netto: delta >= 10 between primary and secondary

        if (withBlend) {
            // Blend scenario: primary 65, secondary 45 (delta = 20 but < soglia for demo)
            // Wait - delta 20 >= 10 would be netto! Use delta = 8: primary 55, secondary 47
            // Actually for blend we need delta < 10, so use 55 vs 48 (delta = 7)
            // Percentages: 55/(55+48) = 53.4% → 55%, 48/(55+48) = 46.6% → 45%
            const secondaryKey = BLEND_PAIRINGS[primaryKey];
            state.scores[primaryKey] = 55;
            state.scores[secondaryKey] = 48;

            // Distribute remaining 93 points among others (196 - 55 - 48 = 93)
            const otherKeys = Object.keys(state.scores).filter(k => k !== primaryKey && k !== secondaryKey);
            let remaining = 93;
            otherKeys.forEach((key, i) => {
                if (remaining > 0) {
                    // Give decreasing amounts to others
                    const pts = Math.min(Math.floor(remaining / (otherKeys.length - i)), remaining);
                    state.scores[key] = pts;
                    remaining -= pts;
                }
            });
        } else {
            // Netto scenario: primary 80, secondary 55 (delta = 25, triggers netto)
            // Percentages: 80/(80+55) = 59.3% → 60%, 55/(80+55) = 40.7% → 40%
            state.scores[primaryKey] = 80;

            // Distribute remaining 116 points among others (196 - 80 = 116)
            const otherKeys = Object.keys(state.scores).filter(k => k !== primaryKey);
            let remaining = 116;
            // Give second highest 55, rest distributed
            otherKeys.forEach((key, i) => {
                if (remaining > 0) {
                    const pts = i === 0 ? 55 : Math.min(Math.floor(remaining / (otherKeys.length - i)), remaining);
                    state.scores[key] = pts;
                    remaining -= pts;
                }
            });
        }

        // Log simulation
        const primaryName = state.surveyData.archetipi[primaryKey].nome;
        if (withBlend) {
            const secondaryKey = BLEND_PAIRINGS[primaryKey];
            const secondaryName = state.surveyData.archetipi[secondaryKey].nome;
            logSurveyActivity(`Simulazione: ${primaryName} + ${secondaryName} (blend)`);
        } else {
            logSurveyActivity(`Simulazione: ${primaryName} (netto)`);
        }

        // Create fake answers array (so restart works)
        state.answers = new Array(10).fill(null).map((_, i) => ({
            questionId: i + 1,
            selectedOptionId: `${i + 1}A`,
            archetype: 'connettore' // Placeholder
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
        console.log('[SURVEY] Initializing v2.0 (single-choice)...');

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
        getScores: () => state.scores,
        getRanked: () => rankArchetypes(),
        getProfile: () => classifyProfile(rankArchetypes())
    };

})();
