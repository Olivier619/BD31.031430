/**
 * BD Creator - Script Principal (main.js)
 * Gère l'initialisation et les interactions pour toutes les pages.
 * Utilise bdCreatorAppData et gère le storyboard complet.
 */
console.log("--- Exécution de main.js (Version Finale - Storyboard Complet) ---");

// --- Variable globale RENOMMÉE ---
let bdCreatorAppData = {
    keywords: localStorage.getItem('bdKeywords') || "",
    scenario: null,
    storyboard: null, // Stockera le storyboard complet
    prompts: null
};
console.log("main.js: Variable bdCreatorAppData initialisée.");

// --- Fonctions Utilitaires (Affichage) ---

function displayScenario(scenario, container) {
    // console.log("displayScenario: Affichage demandé."); // Moins verbeux
    if (!container) { console.error("displayScenario: Conteneur introuvable!"); container=document.getElementById('scenario-display-container') || document.getElementById('scenario-container'); if (!container) return; }
    if (!scenario || typeof scenario !== 'object' || !scenario.title) { console.error("displayScenario: Scénario invalide:", scenario); container.innerHTML = '<p class="error-message">Données scénario invalides.</p>'; return; }
    container.innerHTML = ''; let htmlContent = '';
    htmlContent += `<div class="scenario-header"><h3>${scenario.title}</h3>`; if (scenario.theme) htmlContent += `<p class="scenario-theme"><em>Thème: ${scenario.theme.substring(0,150)}${scenario.theme.length > 150 ? '...' : ''}</em></p>`; htmlContent += `</div>`;
    if (scenario.univers) { htmlContent += `<div class="scenario-section"><h4>Univers : ${scenario.univers.type || '?'}</h4><p>${scenario.univers.description || ''}</p><ul>`; if(scenario.univers.epoque) htmlContent += `<li>Époque: ${scenario.univers.epoque}</li>`; if(scenario.univers.technologie) htmlContent += `<li>Technologie: ${scenario.univers.technologie}</li>`; if(scenario.univers.particularites) htmlContent += `<li>Particularités: ${scenario.univers.particularites}</li>`; htmlContent += `</ul></div>`; }
    if (scenario.personnages && scenario.personnages.length > 0) { htmlContent += `<div class="scenario-section"><h4>Personnages</h4><ul class="personnages-list">`; scenario.personnages.forEach(p => { htmlContent += `<li class="personnage-item"><strong>${p.nom || '?'}</strong> (${p.archetype || '?'})`; if(p.description) htmlContent += `<br><small>${p.description}</small>`; if(p.apparence) htmlContent += `<br><small><i>Apparence:</i> ${p.apparence}</small>`; if(p.traitDistinctif) htmlContent += `<br><small><i>Trait:</i> ${p.traitDistinctif}</small>`; htmlContent += `</li>`; }); htmlContent += `</ul></div>`; }
    if (scenario.structureNarrative && scenario.structureNarrative.etapesParChapitre) { htmlContent += `<div class="scenario-section"><h4>Structure: ${scenario.structureNarrative.type || '?'}</h4><ol>`; scenario.structureNarrative.etapesParChapitre.forEach((etapes, idx) => { htmlContent += `<li>Chap ${idx + 1}: ${etapes}</li>`; }); htmlContent += `</ol></div>`; }
    if (scenario.chapters && scenario.chapters.length > 0) { htmlContent += `<div class="scenario-section"><h4>Chapitres (${scenario.chapters.length})</h4><div class="chapitres-accordion">`; scenario.chapters.forEach((chapitre, index) => { htmlContent += `<div class="chapitre-item"><div class="chapitre-header" onclick="this.classList.toggle('active'); const content = this.nextElementSibling; content.style.display = content.style.display === 'block' ? 'none' : 'block';">Chapitre ${chapitre.numero || index + 1}: ${chapitre.titre || 'Sans Titre'} (+)</div>`; htmlContent += `<div class="chapitre-content"><p class="chapitre-resume"><strong>Résumé:</strong> ${chapitre.resume || 'Aucun.'}</p>`; if (chapitre.pages?.length) htmlContent += `<p class="pages-count">${chapitre.pages.length} pages.</p>`; if (chapitre.pages?.[0]?.cases?.[0]?.descriptionVisuelle) { htmlContent += `<p><i>Début: ${chapitre.pages[0].cases[0].descriptionVisuelle.substring(0, 100)}...</i></p>`; } htmlContent += `</div></div>`; }); htmlContent += `</div></div>`; }
    else { htmlContent += `<div class="scenario-section"><p>Aucun chapitre généré.</p></div>`; }
    container.innerHTML = htmlContent; console.log("displayScenario: Affichage terminé.");
}

// NOUVELLE FONCTION D'AFFICHAGE POUR STORYBOARD COMPLET
function displayStoryboardComplet(storyboardComplet, container) {
    console.log("displayStoryboardComplet: Affichage demandé.");
    if (!container) { console.error("displayStoryboardComplet: Conteneur manquant !"); return; }
    if (!storyboardComplet || !storyboardComplet.chapters || storyboardComplet.chapters.length === 0) {
        container.innerHTML = '<p>Aucun chapitre de storyboard à afficher.</p>'; return;
    }

    let htmlContent = '';
    // Boucle sur les chapitres
    storyboardComplet.chapters.forEach((chapterData, chapterIdx) => {
        if (!chapterData) return;

        htmlContent += `<div class="storyboard-chapter-section" style="margin-bottom: 30px; border-top: 2px solid #ccc; padding-top: 20px;">`;
        htmlContent += `<h3>Chapitre ${chapterData.chapterNumber}: ${chapterData.chapterTitle}</h3>`;
        if (chapterData.chapterSummary) htmlContent += `<p><em>${chapterData.chapterSummary}</em></p>`;

        if (chapterData.pages && chapterData.pages.length > 0) {
             // Afficher TOUTES les pages et cases pour chaque chapitre
             chapterData.pages.forEach((page, pageIdx) => {
                  htmlContent += `<div class="storyboard-page" style="margin-left: 20px; margin-bottom: 15px; border-left: 3px solid #eee; padding-left: 15px;">`;
                  htmlContent += `<h4>Page ${page.pageNumber}</h4>`;
                  if (page.description) htmlContent += `<p><small><i>${page.description}</i></small></p>`;

                  if (page.cases && page.cases.length > 0) {
                       htmlContent += `<div class="panels-container">`; // Utiliser la classe existante
                       page.cases.forEach((panel, panelIdx) => {
                           htmlContent += `<div class="panel"><h5>Case ${panelIdx + 1}</h5>`; // Utiliser la classe existante
                           if (panel.description) htmlContent += `<p class="panel-description"><small><strong>Visuel:</strong> ${panel.description}</small></p>`;
                           if (panel.dialogue) htmlContent += `<div class="dialogue"><small><strong>Dialogue:</strong> ${panel.dialogue}</small></div>`;
                           if (panel.personnages?.length) htmlContent += `<div class="personnages-case"><small><i>Présents: ${panel.personnages.join(', ')}</i></small></div>`;
                           htmlContent += `</div>`; // Fin panel
                       });
                       htmlContent += `</div>`; // Fin panels-container
                  } else {
                       htmlContent += `<p><small>Aucune case.</small></p>`;
                  }
                  htmlContent += `</div>`; // Fin storyboard-page
             });

        } else {
             htmlContent += `<p>Aucune page générée pour ce chapitre.</p>`;
        }
        htmlContent += `</div>`; // Fin storyboard-chapter-section
    });

    container.innerHTML = htmlContent; // Remplacer le contenu
    console.log("displayStoryboardComplet: Affichage terminé.");
}


function displayPrompts(promptsData, container) { /* ... Votre fonction displayPrompts ... */ }
function handlePromptCopy(event) { /* ... Votre fonction handlePromptCopy ... */ }


// --- Fonctions de Génération (Appels) ---
function generateAndDisplayScenario(keywords, generateButton, loadingElement) {
    console.log("generateAndDisplayScenario: Appel pour:", keywords);
    if (typeof window.generateScenarioDetaille !== 'function') { console.error("generateScenarioDetaille N'EST PAS DÉFINIE !"); alert("Erreur critique."); return; }
    window.generateScenarioDetaille(keywords)
        .then(scenario => {
            console.log("generateAndDisplayScenario: Scénario reçu.", scenario); if (!scenario) throw new Error("Scénario null reçu.");
            bdCreatorAppData.scenario = scenario;
            try { localStorage.setItem('bdScenario', JSON.stringify(scenario)); console.log("Scenario sauvegardé."); } catch (e) { console.error("Erreur sauvegarde Scénario:", e); }
            let container = document.getElementById('scenario-display-container'); if (!container) { container = document.createElement('div'); container.id = 'scenario-display-container'; container.className = 'scenario-container'; generateButton.closest('.feature')?.parentNode?.insertBefore(container, generateButton.closest('.feature').nextSibling); }
            displayScenario(scenario, container);
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            if (container?.scrollIntoView) container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch(error => {
            console.error("generateAndDisplayScenario: ERREUR CATCH:", error); alert("Erreur génération scénario. Voir console.");
            generateButton.disabled = false; generateButton.textContent = "Générer un scénario"; if (loadingElement?.parentNode) loadingElement.parentNode.removeChild(loadingElement);
            let container = document.getElementById('scenario-display-container'); if(container) { container.innerHTML = `<p class="error-message">Impossible de générer.</p>`; }
        });
}

// MODIFIÉ : Appelle createStoryboardComplet
async function generateAndSaveStoryboardComplet(scenario) {
    console.log("generateAndSaveStoryboardComplet: Démarrage..."); let storyboardData = null;
    if (typeof window.createStoryboardComplet === 'function') { // Vérifier nouvelle fonction
        try {
            storyboardData = await window.createStoryboardComplet(scenario); // Appel nouvelle fonction
            if (storyboardData) {
                bdCreatorAppData.storyboard = storyboardData;
                localStorage.setItem('bdStoryboard', JSON.stringify(storyboardData)); // Sauvegarder complet
                console.log("Storyboard COMPLET généré/sauvegardé.");
            } else { console.error("createStoryboardComplet a retourné null."); }
        } catch (error) { console.error("Erreur appel createStoryboardComplet:", error); }
    } else { console.error("Fonction createStoryboardComplet non trouvée."); }
    return storyboardData;
}

async function generateAndSavePrompts(storyboardData) { /* ... Code generateAndSavePrompts ... */ }

// --- Initialisation ---
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    console.log("main.js: Initialisation Application Globale.");
    const pagePath = window.location.pathname.split('/').pop() || 'index.html';
    let pageName = pagePath.endsWith('.html') ? pagePath.substring(0, pagePath.length - 5) : pagePath;
    if (pageName === '') pageName = 'index'; // Gérer la racine
    console.log(`main.js: Nom de page détecté: '${pageName}'`);

    // Init Session Manager
    if (window.bdSessionManager instanceof SessionManager) { console.log("main.js: bdSessionManager trouvé."); }
    else { console.warn("main.js: bdSessionManager non trouvé."); }

    // Init spécifique à la page
    if (pageName === 'index') {
        const keywordsInput = document.getElementById('keywords'); const generateButton = document.getElementById('generate-scenario-btn'); const scenarioDisplayContainer = document.getElementById('scenario-display-container');
        if (keywordsInput && generateButton && scenarioDisplayContainer) { initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer); }
    } else if (pageName === 'scenario') {
        const scenarioContainerPage = document.getElementById('scenario-container'); const keywordsDisplayPage = document.getElementById('keywords-display');
        if (scenarioContainerPage && keywordsDisplayPage) { initializeScenarioPage(scenarioContainerPage, keywordsDisplayPage); }
    } else if (pageName === 'storyboard') {
        const storyboardContainerPage = document.getElementById('storyboard-container'); const chapterTitleElementSB = document.getElementById('chapter-title');
        if (storyboardContainerPage) { initializeStoryboardPage(storyboardContainerPage, chapterTitleElementSB); } // Appel fonction modifiée
    } else if (pageName === 'prompts') {
        const promptsContainerPage = document.getElementById('prompts-container'); const chapterNameElementP = document.getElementById('chapter-name');
        if (promptsContainerPage) { initializePromptsPage(promptsContainerPage, chapterNameElementP); }
    }
    console.log("main.js: Fin initializeApp.");
}

// --- Fonctions d'Initialisation Spécifiques ---
function initializeHomePage(keywordsInput, generateButton, scenarioDisplayContainer) { /* ... Code init accueil ... */ }
function initializeScenarioPage(container, keywordsDisplay) { /* ... Code init page scénario ... */ }

// MODIFIÉ : Utilise generateAndSaveStoryboardComplet et displayStoryboardComplet
async function initializeStoryboardPage(container, chapterTitleElement) {
    console.log("main.js: Initialisation Page Storyboard (Complet).");
    if (!container) { return; } container.innerHTML = '<p>Chargement storyboard complet...</p>';
    const scenarioJson = localStorage.getItem('bdScenario'); if (!scenarioJson) { container.innerHTML = '<p class="error-message">Scénario non trouvé.</p>'; return; }
    try {
        const scenario = JSON.parse(scenarioJson); bdCreatorAppData.scenario = scenario;
        const existingStoryboardJson = localStorage.getItem('bdStoryboard'); let storyboardCompletData = null;
        if (existingStoryboardJson) { console.log("Storyboard complet existant trouvé."); try { storyboardCompletData = JSON.parse(existingStoryboardJson); if (!storyboardCompletData?.chapters) { console.warn("Cache storyboard invalide."); storyboardCompletData = null; localStorage.removeItem('bdStoryboard'); } else { bdCreatorAppData.storyboard = storyboardCompletData; } } catch (e) { console.error("Erreur parsing storyboard complet:", e); localStorage.removeItem('bdStoryboard'); } }
        if (!storyboardCompletData) { console.log("Génération storyboard COMPLET..."); storyboardCompletData = await generateAndSaveStoryboardComplet(scenario); if (!storyboardCompletData) { throw new Error("Échec génération storyboard complet."); } }
        if(chapterTitleElement) chapterTitleElement.textContent = "Tous les Chapitres";
        displayStoryboardComplet(storyboardCompletData, container); // Appel NOUVELLE fonction affichage
    } catch (error) { console.error("Erreur init Storyboard Complet:", error); container.innerHTML = `<p class="error-message">Erreur chargement storyboard: ${error.message}</p>`; }
}

async function initializePromptsPage(container, chapterNameElement) { /* ... Code init page prompts ... */ }

console.log("main.js (Complet final - Storyboard Complet) chargé.");
