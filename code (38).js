/**
 * Fonction pour créer un storyboard détaillé complet à partir d'un scénario.
 * Assignée à window.createStoryboardComplet.
 */
console.log("--- storyboard_detaille.js : DÉBUT ANALYSE (Complet) ---");

window.createStoryboardComplet = async function(scenario) {
    console.log("--- createStoryboardComplet: Démarrage ---");
    try {
        if (!scenario || !scenario.chapters || !Array.isArray(scenario.chapters) || scenario.chapters.length === 0) { throw new Error("Données scénario invalides."); }
        const univers = scenario.univers || { type: "contemporain", lieux: ["Lieu par Défaut"] };
        const personnagesScenario = scenario.personnages || [];
        const storyboardComplet = { scenarioTitle: scenario.title, chapters: [] };
        console.log(`createStoryboardComplet: Traitement ${scenario.chapters.length} chapitres...`);

        for (const [chapterIndex, chapitre] of scenario.chapters.entries()) {
            if (!chapitre) { console.warn(`Chapitre ${chapterIndex+1} invalide.`); continue; }
            const personnagesNomsChapitre = chapitre.personnages || personnagesScenario.map(p => p.nom);
            const personnagesChapitre = personnagesScenario.filter(p => personnagesNomsChapitre.includes(p.nom));
            const pagesResultat = []; const pagesSource = chapitre.pages || []; const pagesCount = pagesSource.length;
            // console.log(`  -> Chap ${chapterIndex+1} ('${chapitre.titre || '?'}'): ${pagesSource.length} pages.`);

            for (const [pageIndex, pageScenario] of pagesSource.entries()) {
                 if (!pageScenario || !pageScenario.cases || !Array.isArray(pageScenario.cases)) { pagesResultat.push({ pageNumber: pageScenario?.numeroGlobal || -1, description: `Page ${pageIndex+1} invalide`, cases: [] }); continue; }
                 const casesStoryboard = pageScenario.cases.map((caseScenario, caseIndex) => ({
                     description: caseScenario.descriptionVisuelle || "N/A",
                     dialogue: caseScenario.dialogue ? `${caseScenario.dialogue.personnage}: ${caseScenario.dialogue.texte}` : null,
                     personnages: caseScenario.personnagesPresents || []
                 }));
                 pagesResultat.push({ pageNumber: pageScenario.numeroGlobal, description: pageScenario.description, cases: casesStoryboard });
            }
            storyboardComplet.chapters.push({ chapterNumber: chapitre.numero || chapterIndex + 1, chapterTitle: chapitre.title || `Chapitre ${chapterIndex + 1}`, chapterSummary: chapitre.resume || "Aucun.", pages: pagesResultat, personnages: personnagesChapitre });
        }
        storyboardComplet.univers = univers;
        console.log("--- createStoryboardComplet: Storyboard COMPLET généré ---");
        return storyboardComplet;

    } catch (error) { console.error("--- createStoryboardComplet: ERREUR ---", error); return null; }
}
console.log("--- storyboard_detaille.js : Fonction window.createStoryboardComplet DÉFINIE ---");
console.log("--- storyboard_detaille.js : FIN ANALYSE (Complet) ---");