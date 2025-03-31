/**
 * BD Creator - Script Principal (main.js)
 * Version finale.
 */
console.log("--- Exécution de main.js (Version Finale) ---");

// --- Variable globale RENOMMÉE ---
let bdCreatorAppData = {
    keywords: localStorage.getItem('bdKeywords') || "",
    scenario: null,
    storyboard: null,
    prompts: null
};
console.log("main.js: Variable bdCreatorAppData initialisée.");

// --- Fonctions Utilitaires (Affichage) ---

function displayScenario(scenario, container) {
    // console.log("displayScenario: Affichage demandé.");
    if (!container) { console.error("displayScenario: Conteneur introuvable!"); container=document.getElementById('scenario-display-container') || document.getElementById('scenario-container'); if (!container) return; }
    if (!scenario || typeof scenario !== 'object' || !scenario.title) { console.error("displayScenario: Scénario invalide:", scenario); container.innerHTML = '<p class="error-message">Données scénario invalides.</p>'; return; }
    container.innerHTML = ''; let htmlContent = ''; // Début construction HTML
    htmlContent += `<div class="scenario-header"><h3>${scenario.title}</h3>`; if (scenario.theme) htmlContent += `<p class="scenario-theme"><em>Thème: ${scenario.theme.substring(0,150)}${scenario.theme.length > 150 ? '...' : ''}</em></p>`; htmlContent += `</div>`;
    if (scenario.univers) { htmlContent += `<div class="scenario-section"><h4>Univers : ${scenario.univers.type || '?'}</h4><p>${scenario.univers.description || ''}</p><ul>`; if(scenario.univers.epoque) htmlContent += `<li>Époque: ${scenario.univers.epoque}</li>`; if(scenario.univers.technologie) htmlContent += `<li>Technologie: ${scenario.univers.technologie}</li>`; if(scenario.univers.particularites) htmlContent += `<li>Particularités: ${scenario.univers.particularites}</li>`; htmlContent += `</ul></div>`; }
    if (scenario.personnages && scenario.personnages.length > 0) { htmlContent += `<div class="scenario-section"><h4>Personnages</h4><ul class="personnages-list">`; scenario.personnages.forEach(p => { htmlContent += `<li class="personnage-item"><strong>${p.nom || '?'}</strong> (${p.archetype || '?'})`; if(p.description) htmlContent += `<br><small>${p.description}</small>`; if(p.apparence) htmlContent += `<br><small><i>Apparence:</i> ${p.apparence}</small>`; if(p.traitDistinctif) htmlContent += `<br><small><i>Trait:</i> ${p.traitDistinctif}</small>`; htmlContent += `</li>`; }); htmlContent += `</ul></div>`; }
    if (scenario.structureNarrative && scenario.structureNarrative.etapesParChapitre) { htmlContent += `<div class="scenario-section"><h4>Structure: ${scenario.structureNarrative.type || '?'}</h4><ol>`; scenario.structureNarrative.etapesParChapitre.forEach((etapes, idx) => { htmlContent += `<li>Chap ${idx + 1}: ${etapes}</li>`; }); htmlContent += `</ol></div>`; }
    if (scenario.chapters && scenario.chapters.length > 0) { htmlContent += `<div class="scenario-section"><h4>Chapitres (${scenario.chapters.length})</h4><div class="chapitres-accordion">`; scenario.chapters.forEach((chapitre, index) => { htmlContent += `<div class="chapitre-item"><div class="chapitre-header" onclick="this.classList.toggle('active'); const content = this.nextElementSibling; content.style.display = content.style.display === 'block' ? 'none' : 'block';">Chapitre ${chapitre.numero || index + 1}: ${chapitre.titre || 'Sans Titre'} (+)</div>`; htmlContent += `<div class="chapitre-content"><p class="chapitre-resume"><strong>Résumé:</strong> ${chapitre.resume || 'Aucun.'}</p>`; if (chapitre.pages?.length) htmlContent += `<p class="pages-count">${chapitre.pages.length} pages.</p>`; if (chapitre.pages?.[0]?.cases?.[0]?.descriptionVisuelle) { htmlContent += `<p><i>Début: ${chapitre.pages[0].cases[0].descriptionVisuelle.substring(0, 100)}...</i></p>`; } htmlContent += `</div></div>`; }); htmlContent += `</div></div>`; }
    else { htmlContent += `<div class="scenario-section"><p>Aucun chapitre généré.</p></div>`; }
    container.innerHTML = htmlContent; console.log("displayScenario: Affichage terminé.");
}

function displayStoryboardComplet(storyboardComplet, container) {
    console.log("displayStoryboardComplet: Affichage demandé.");
    if (!container) { console.error("displayStoryboardComplet: Conteneur manquant !"); return; }
    if (!storyboardComplet || !storyboardComplet.chapters || storyboardComplet.chapters.length === 0) { container.innerHTML = '<p>Aucun chapitre de storyboard.</p>'; return; }
    let htmlContent = '';
    storyboardComplet.chapters.forEach((chapterData) => {
        if (!chapterData) return;
        htmlContent += `<div class="storyboard-chapter-section"><h3>Chapitre ${chapterData.chapterNumber}: ${chapterData.chapterTitle}</h3>`;
        if (chapterData.chapterSummary) htmlContent += `<p><em>${chapterData.chapterSummary}</em></p>`;
        if (chapterData.pages?.length) {
             chapterData.pages.forEach((page) => {
                  htmlContent += `<div class="storyboard-page"><h4>Page ${page.pageNumber}</h4>`;
                  if (page.description) htmlContent += `<p><small><i>${page.description}</i></small></p>`;
                  if (page.cases?.length) {
                       htmlContent += `<div class="panels-container">`;
                       page.cases.forEach((panel, panelIdx) => {
                           htmlContent += `<div class="panel"><h5>Case ${panelIdx + 1}</h5>`;
                           if (panel.description) htmlContent += `<p class="panel-description"><small><strong>Visuel:</strong> ${panel.description}</small></p>`;
                           if (panel.dialogue) htmlContent += `<div class="dialogue"><small><strong>Dialogue:</strong> ${panel.dialogue}</small></div>`;
                           if (panel.personnages?.length) htmlContent += `<div class="personnages-case"><small><i>Présents: ${panel.personnages.join(', ')}</i></small></div>`;
                           htmlContent += `</div>`;
                       });
                       htmlContent += `</div>`;
                  } else { htmlContent += `<p><small>Aucune case.</small></p>`; }
                  htmlContent += `</div>`;
             });
        } else { htmlContent += `<p>Aucune page.</p>`; }
        htmlContent += `</div>`;
    });
    container.innerHTML = htmlContent;
    console.log("displayStoryboardComplet: Affichage terminé.");
}

function displayPrompts(promptsData, container) {
    console.log("displayPrompts: Affichage demandé.");
    if (!container) { console.error("displayPrompts: Conteneur manquant !"); return; }
    if (!promptsData || !promptsData.pages || !Array.isArray(promptsData.pages) || promptsData.pages.length === 0) { container.innerHTML = '<p>Aucun prompt.</p>'; return; }
    let currentPageIndex = 0; const totalPages = promptsData.pages.length;
    function renderPromptsPage(index) {
        if (index < 0 || index >= totalPages) return; currentPageIndex = index; const page = promptsData.pages[index];
        if (!page || !page.panels || !Array.isArray(page.panels)) { /* Gérer erreur page invalide */ return; }
        let pageHtml = `<h4>Page ${page.pageNumber || (index + 1)} / ${totalPages}</h4>`;
        if (page.panels.length > 0) { pageHtml += `<div class="panels-container">`; page.panels.forEach((panel, panelIndex) => { pageHtml += `<div class="panel prompt-panel"><h5>Case ${panelIndex + 1}</h5>`; if (panel.prompt) { pageHtml += `<div class="prompt"><textarea class="prompt-textarea" readonly>${panel.prompt}</textarea><button class="copy-button" data-prompt-index="${index}-${panelIndex}">Copier</button></div>`; } else { pageHtml += `<p><i>Aucun prompt.</i></p>`; } pageHtml += `</div>`; }); pageHtml += `</div>`; }
        else { pageHtml += `<p>Aucun prompt.</p>`; }
        const pageContentDiv = container.querySelector('.prompts-page-content'); if (pageContentDiv) { pageContentDiv.innerHTML = pageHtml; const indicator = container.querySelector('.page-indicator'); const prevBtn = container.querySelector('.prev-page-btn'); const nextBtn = container.querySelector('.next-page-btn'); if(indicator) indicator.textContent = `Page ${index + 1} / ${totalPages}`; if(prevBtn) prevBtn.disabled = (index === 0); if(nextBtn) nextBtn.disabled = (index === totalPages - 1); }
    }
     if (!container.querySelector('.pagination-container')) { container.innerHTML = `<div class="pagination-container"><button class="prev-page-btn pagination-button" disabled>Précédent</button><span class="page-indicator">Page 1 / ${totalPages}</span><button class="next-page-btn pagination-button">Suivant</button></div><div class="prompts-page-content"></div>`; container.querySelector('.prev-page-btn').addEventListener('click', () => renderPromptsPage(currentPageIndex - 1)); container.querySelector('.next-page-btn').addEventListener('click', () => renderPromptsPage(currentPageIndex + 1)); }
    container.removeEventListener('click', handlePaginationClick); container.removeEventListener('click', handlePromptCopy); // Nettoyer anciens listeners
    container.addEventListener('click', handlePaginationClick); container.addEventListener('click', handlePromptCopy); // Attacher nouveaux
    function handlePaginationClick(event) { if(event.target.classList.contains('prev-page-btn')) { renderPromptsPage(currentPageIndex - 1); } else if(event.target.classList.contains('next-page-btn')) { renderPromptsPage(currentPageIndex + 1); } } // Gérer pagination
    renderPromptsPage(0); console.log("displayPrompts: Affichage terminé.");
}

function handlePromptCopy(event) {
     if (event.target.classList.contains('copy-button')) {
        const button = event.target; const textarea = button.previousElementSibling;
        if (textarea?.tagName === 'TEXTAREA') {
             textarea.select(); textarea.setSelectionRange(0, 99999);
             try { document.execCommand('copy'); button.textContent = 'Copié!'; button.style.backgroundColor = '#2ecc71'; setTimeout(() => { button.textContent = 'Copier'; button.style.backgroundColor = ''; }, 2000); }
             catch (err) { console.error('Erreur copie:', err); button.textContent = 'Erreur'; button.style.backgroundColor = '#e74c3c'; setTimeout(() => { button.textContent = 'Copier'; button.style.backgroundColor = ''; }, 2000); }
             window.getSelection()?.removeAllRanges();
        }
    }
}


// --- Fonctions de Génération (Appels) ---
function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    console.log("generateAndDisplayScenario: Appel pour:", keywords);
    if (typeof window.generateScenarioDetaille !== 'function') { console.error("generateScenarioDetaille non définie!"); alert("Erreur critique."); return; }
    window.generateScenarioDetaille(keywords)
        .then(scenario => {
            console.log("generateAndDisplayScenario: Scénario reçu.", scenario); if (!scenario) throw new Error("Scénario null reçu.");
            bdCreatorAppData.scenario = scenario;
            try { localStorage.setItem('bdScenario', JSON.stringify(scenario)); console.log("Scenario sauvegardé."); } catch (e) { console.error("Erreur sauvegarde Scénario:", e); }
            let container = document.getElementById('scenario-display-container'); if (!container) { container = document.createElement('div'); container.id='scenario-display-container'; container.className='scenario-container'; generateButton.closest('.feature')?.parentNode?.insertBefore(container, generateButton.closest('.feature').nextSibling);}
            displayScenario(scenario, container);
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            container?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
        })
        .catch(error => {
            console.error("generateAndDisplayScenario: ERREUR CATCH:", error); alert("Erreur génération scénario.");
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            let container = document.getElementById('scenario-display-container'); if(container) { container.innerHTML = `<p class="error-message">Impossible de générer.</p>`; }
        });
}

async function generateAndSaveStoryboardComplet(scenario) {
    console.log("generateAndSaveStoryboardComplet: Démarrage..."); let storyboardData = null;
    if (typeof window.createStoryboardComplet === 'function') { try { storyboardData = await window.createStoryboardComplet(scenario); if (storyboardData) { bdCreatorAppData.storyboard = storyboardData; localStorage.setItem('bdStoryboard', JSON.stringify(storyboardData)); console.log("Storyboard COMPLET généré/sauvegardé."); } else { console.error("createStoryboardComplet a retourné null."); } } catch (error) { console.error("Erreur appel createStoryboardComplet:", error); } }
    else { console.error("Fonction createStoryboardComplet non trouvée."); } return storyboardData;
}

async function generateAndSavePrompts(storyboardData) {
    console.log("generateAndSavePrompts: Démarrage..."); let promptsData = null;
    if (typeof window.generatePromptsDetailles === 'function') { try { promptsData = await window.generatePromptsDetailles(storyboardData); if (promptsData) { bdCreatorAppData.prompts = promptsData; localStorage.setItem('bdPrompts', JSON.stringify(promptsData)); console.log("Prompts générés/sauvegardés."); } else { console.error("generatePromptsDetailles a retourné null."); } } catch (error) { console.error("Erreur appel generatePromptsDetailles:", error); } }
    else { console.error("Fonction generatePromptsDetailles non trouvée."); } return promptsData;
}


// --- Initialisation ---
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    console.log("main.js: Initialisation Application Globale.");
    const pagePath = window.location.pathname.split('/').pop() || 'index.html';
    let pageName = pagePath.endsWith('.html') ? pagePath.substring(0, pagePath.length - 5) : pagePath;
    if (pageName === '') pageName = 'index';
    console.log(`main.js: Nom de page détecté: '${pageName}'`);

    if (window.bdSessionManager instanceof SessionManager) { console.log("main.js: bdSessionManager trouvé."); } else { console.warn("main.js: bdSessionManager non trouvé."); }

    if (pageName === 'index') {
        const keywordsInput = document.getElementById('keywords'); const generateButton = document.getElementById('generate-scenario-btn'); const scenarioDisplayContainer = document.getElementById('scenario-display-container');
        if (keywordsInput && generateButton && scenarioDisplayContainer) { initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer); }
    } else if (pageName === 'scenario') {
        const scenarioContainerPage = document.getElementById('scenario-container'); const keywordsDisplayPage = document.getElementById('keywords-display');
        if (scenarioContainerPage && keywordsDisplayPage) { initializeScenarioPage(scenarioContainerPage, keywordsDisplayPage); }
    } else if (pageName === 'storyboard') {
        const storyboardContainerPage = document.getElementById('storyboard-container'); const chapterTitleElementSB = document.getElementById('chapter-title');
        if (storyboardContainerPage) { initializeStoryboardPage(storyboardContainerPage, chapterTitleElementSB); }
    } else if (pageName === 'prompts') {
        const promptsContainerPage = document.getElementById('prompts-container'); const chapterNameElementP = document.getElementById('chapter-name');
        if (promptsContainerPage) { initializePromptsPage(promptsContainerPage, chapterNameElementP); }
    }
    console.log("main.js: Fin initializeApp.");
}

// --- Fonctions d'Initialisation Spécifiques ---
function initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer) {
     console.log("main.js: Initialisation Page Accueil.");
     if (!generateButton.dataset.listenerAttached) {
        generateButton.addEventListener('click', function handleGenerateClick() {
            console.log(">>> Bouton Générer Scénario cliqué!"); const keywords = keywordsInput.value; if (!keywords?.trim()) { alert('Veuillez entrer du texte.'); return; }
            generateButton.disabled = true; generateButton.textContent = "Génération..."; let loadingElement = document.getElementById('loading-indicator');
            if (!loadingElement) { loadingElement = document.createElement('div'); loadingElement.id = 'loading-indicator'; loadingElement.innerHTML = '<p>Génération...</p>'; loadingElement.style.cssText = 'margin-top:15px; padding:10px; background:#eee; border-radius:4px; text-align:center;'; generateButton.parentNode.insertBefore(loadingElement, generateButton.nextSibling); } else { loadingElement.style.display = 'block'; }
            localStorage.removeItem('bdScenario'); localStorage.removeItem('bdStoryboard'); localStorage.removeItem('bdPrompts'); localStorage.setItem('bdKeywords', keywords);
            console.log(">>> Appel de generateAndDisplayScenario...");
            if (typeof window.generateScenarioDetaille === 'function') { generateAndDisplayScenario(keywords, generateButton, loadingElement); }
            else { console.error("HOME: generateScenarioDetaille non trouvé!"); alert("Erreur critique."); /* Nettoyage UI */ }
        });
        generateButton.dataset.listenerAttached = 'true'; console.log("main.js: Écouteur attaché (Accueil).");
     }
     const existingScenarioJson = localStorage.getItem('bdScenario');
     if (existingScenarioJson) { console.log("main.js: Affichage scénario existant (Accueil)."); try { const existingScenario = JSON.parse(existingScenarioJson); bdCreatorAppData.scenario = existingScenario; displayScenario(existingScenario, scenarioDisplayContainer); keywordsInput.value = localStorage.getItem('bdKeywords') || ''; } catch (e) { console.error("main.js: Erreur parsing (Accueil):", e); localStorage.removeItem('bdScenario'); scenarioDisplayContainer.innerHTML = '<p class="error-message">Erreur chargement.</p>'; } }
     else { scenarioDisplayContainer.innerHTML = ''; }
}

function initializeScenarioPage(container, keywordsDisplay) {
     console.log("main.js: Initialisation Page Scénario."); const keywords = localStorage.getItem('bdKeywords') || ''; keywordsDisplay.textContent = keywords.substring(0, 150) + (keywords.length > 150 ? '...' : ''); const scenarioJson = localStorage.getItem('bdScenario');
     if (scenarioJson) { try { const scenario = JSON.parse(scenarioJson); bdCreatorAppData.scenario = scenario; displayScenario(scenario, container); } catch (e) { console.error("main.js: Erreur affichage (Scénario):", e); container.innerHTML = '<p class="error-message">Erreur affichage.</p>'; } }
     else { container.innerHTML = '<p>Aucun scénario généré.</p>'; }
}

async function initializeStoryboardPage(container, chapterTitleElement) {
    console.log("main.js: Initialisation Page Storyboard (Complet)."); if (!container) { return; } container.innerHTML = '<p>Chargement...</p>'; const scenarioJson = localStorage.getItem('bdScenario'); if (!scenarioJson) { container.innerHTML = '<p class="error-message">Scénario non trouvé.</p>'; return; }
    try {
        const scenario = JSON.parse(scenarioJson); bdCreatorAppData.scenario = scenario; const existingStoryboardJson = localStorage.getItem('bdStoryboard'); let storyboardCompletData = null;
        if (existingStoryboardJson) { console.log("Storyboard complet existant trouvé."); try { storyboardCompletData = JSON.parse(existingStoryboardJson); if (!storyboardCompletData?.chapters) { console.warn("Cache storyboard invalide."); storyboardCompletData = null; localStorage.removeItem('bdStoryboard'); } else { bdCreatorAppData.storyboard = storyboardCompletData; } } catch (e) { console.error("Erreur parsing storyboard complet:", e); localStorage.removeItem('bdStoryboard'); } }
        if (!storyboardCompletData) { console.log("Génération storyboard COMPLET..."); storyboardCompletData = await generateAndSaveStoryboardComplet(scenario); if (!storyboardCompletData) { throw new Error("Échec génération storyboard complet."); } }
        if(chapterTitleElement) chapterTitleElement.textContent = "Tous les Chapitres";
        displayStoryboardComplet(storyboardCompletData, container);
    } catch (error) { console.error("Erreur init Storyboard Complet:", error); container.innerHTML = `<p class="error-message">Erreur chargement storyboard: ${error.message}</p>`; }
}

async function initializePromptsPage(container, chapterNameElement) {
    console.log("main.js: Initialisation Page Prompts."); if (!container) { return; } container.innerHTML = '<p>Chargement...</p>'; const storyboardJson = localStorage.getItem('bdStoryboard'); if (!storyboardJson) { container.innerHTML = '<p class="error-message">Storyboard non trouvé.</p>'; return; }
    try {
        const storyboardData = JSON.parse(storyboardJson); bdCreatorAppData.storyboard = storyboardData;
        if(chapterNameElement && storyboardData?.scenarioTitle) { chapterNameElement.textContent = `(Pour ${storyboardData.scenarioTitle})`; } else if (chapterNameElement) { chapterNameElement.textContent = "?"; } // Utiliser scenarioTitle ici ?
        const existingPromptsJson = localStorage.getItem('bdPrompts'); let promptsData = null;
        if (existingPromptsJson) { console.log("Prompts existants trouvés."); try { promptsData = JSON.parse(existingPromptsJson); bdCreatorAppData.prompts = promptsData; } catch (e) { console.error("Erreur parsing prompts:", e); localStorage.removeItem('bdPrompts'); } }
        if (!promptsData) { console.log("Génération prompts..."); promptsData = await generateAndSavePrompts(storyboardData); if (!promptsData) { throw new Error("Échec génération prompts."); } }
        displayPrompts(promptsData, container);
    } catch (error) { console.error("Erreur init Prompts:", error); container.innerHTML = `<p class="error-message">Erreur chargement prompts: ${error.message}</p>`; }
}

console.log("main.js (Complet final V2) chargé.");
