/**
 * Fonction pour générer des prompts détaillés pour Midjourney.
 * Assignée à window.generatePromptsDetailles.
 */
console.log("--- prompts_detailles.js : DÉBUT ANALYSE ---");

window.generatePromptsDetailles = async function(storyboard) {
    console.log("--- generatePromptsDetailles : Démarrage ---");
    try {
        if (!storyboard || !storyboard.pages || !Array.isArray(storyboard.pages)) { throw new Error("Données storyboard invalides."); }
        if (storyboard.pages.length === 0) { console.warn("generatePromptsDetailles: Storyboard sans pages."); return { pages: [] }; }
        console.log("Génération prompts détaillés...");
        const promptsResult = { pages: [] }; const personnagesGlobaux = storyboard.personnages || []; const univers = storyboard.univers || { type: "contemporain" };
        const artStylesParUnivers = { "contemporain": ["modern illustration style", "realistic contemporary art", "photorealistic"], /* Ajoutez d'autres styles ici */ };
        const elementsVisuelsDeBase = ["detailed", "high quality", "cinematic lighting", "dynamic composition"];
        const elementsVisuelsSpecifiques = { "contemporain": ["urban environment", "modern architecture"], /* Ajoutez d'autres ici */ };

        for (const page of storyboard.pages) {
             if (!page || !page.cases || !Array.isArray(page.cases)) { console.warn(`generatePromptsDetailles: Page ${page?.pageNumber} invalide.`); promptsResult.pages.push({ pageNumber: page?.pageNumber || '?', panels: [] }); continue; }
             const promptsPage = { pageNumber: page.pageNumber, panels: [] };
            for (const [index, caseItem] of page.cases.entries()) {
                 if (!caseItem) { console.warn(`generatePromptsDetailles: Case invalide P${page.pageNumber}-C${index+1}.`); continue; }
                let artStyles = artStylesParUnivers[univers.type] || artStylesParUnivers["contemporain"] || ["illustration style"]; const style = artStyles[Math.floor(pseudoRandom(Date.now() + index * 10) * artStyles.length)];
                const elementsDeBase = selectionnerElementsAleatoires(elementsVisuelsDeBase, 2, 3, Date.now() + index * 11); const elementsSpecifiques = selectionnerElementsAleatoires(elementsVisuelsSpecifiques[univers.type] || elementsVisuelsSpecifiques["contemporain"] || [], 1, 2, Date.now() + index * 12);
                const descriptionCase = caseItem.description || ""; const dialogueCase = caseItem.dialogue || null; const personnagesCaseNoms = caseItem.personnages || []; const personnagesCompletsCase = personnagesGlobaux.filter(p => personnagesCaseNoms.includes(p?.nom));
                let promptDescription = creerDescriptionPrompt(descriptionCase, dialogueCase, personnagesCompletsCase, personnagesGlobaux, univers);
                const promptComplet = `${style}, ${elementsDeBase.join(", ")}, ${elementsSpecifiques.join(", ")}, ${promptDescription} --ar 16:9 --style raw`.replace(/, ,/g, ',').replace(/,\s*--/,' --').replace(/, $/,'');
                promptsPage.panels.push({ prompt: promptComplet });
            }
             promptsResult.pages.push(promptsPage);
        }
        console.log("--- generatePromptsDetailles: Génération terminée ---");
        return promptsResult;
    } catch (error) { console.error("--- generatePromptsDetailles: ERREUR ---", error); return null; }
}
console.log("--- prompts_detailles.js : Fonction window.generatePromptsDetailles DÉFINIE. ---");

// --- Fonctions auxiliaires (Simplifiées - Utilisez vos versions complètes si besoin) ---
function pseudoRandom(seed) { let x = Math.sin(seed) * 10000; return x - Math.floor(x); }
function selectionnerElementsAleatoires(liste, min, max, seed) { if (!liste || liste.length === 0) return []; const n = Math.max(0, Math.floor(pseudoRandom(seed) * (max - min + 1)) + min); const e = []; const c = [...liste]; for (let i=0; i<n && c.length > 0; i++) { const idx = Math.floor(pseudoRandom(seed+i+1)*c.length); e.push(c.splice(idx, 1)[0]); } return e; }
function creerDescriptionPrompt(description, dialogue, personnagesCase, personnagesGlobaux, univers) { let p = description; if (personnagesCase.length > 0) { p += `, featuring ${personnagesCase.map(pers => `${pers.nom}(${pers.apparence||''})`).join(' & ')}`; } if (dialogue?.includes("!")) p+=", dramatic"; if (dialogue?.includes("?")) p+=", questioning"; return p; }

console.log("--- prompts_detailles.js : FIN ANALYSE ---");
