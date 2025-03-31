/**
 * Fonction pour générer un scénario détaillé (simulation).
 * Assignée à window.generateScenarioDetaille.
 */
console.log("--- scenario_detaille.js : DÉBUT ANALYSE ---");

window.generateScenarioDetaille = async function(keywords) {
    try {
        console.log("generateScenarioDetaille: Démarrage pour : " + keywords);
        const randomSeed = Date.now() + Math.floor(Math.random() * 1000000);
        const keywordsList = keywords.toLowerCase().split(/[ ,\n]+/).filter(k => k.trim().length > 0);

        let title = genererTitreCreatif(keywordsList, randomSeed);
        const univers = creerUnivers(keywordsList, randomSeed);
        const personnages = creerPersonnages(keywordsList, univers, randomSeed);
        const structureNarrative = creerStructureNarrative(keywordsList, univers, personnages, randomSeed);
        const chapitres = genererChapitresDetailles(structureNarrative, univers, personnages, randomSeed);

        const scenario = { title, theme: keywords, univers, personnages, structureNarrative, chapters: chapitres, generatedAt: new Date().toISOString() };

        console.log("generateScenarioDetaille: Scénario final généré avec succès.");
        await new Promise(resolve => setTimeout(resolve, 50)); // Simuler délai
        return scenario;

    } catch (error) {
        console.error("generateScenarioDetaille: ERREUR lors de la génération:", error);
        return null; // Renvoyer null pour indiquer l'échec
    }
}
console.log("--- scenario_detaille.js : Fonction window.generateScenarioDetaille DÉFINIE ---");

// --- Fonctions auxiliaires ---
function pseudoRandom(seed) { let x = Math.sin(seed) * 10000; return x - Math.floor(x); }
function genererTitreCreatif(keywordsList, randomSeed) { const titres = ["Les Chroniques de [Mot-clé]", "L'Odyssée [Mot-clé]", "Le Secret des [Mot-clé]", "[Mot-clé]: La Légende", "L'Éveil de [Mot-clé]"]; const modele = titres[Math.floor(pseudoRandom(randomSeed) * titres.length)]; const keyword = keywordsList[0] || "Aventure"; return modele.replace("[Mot-clé]", keyword.charAt(0).toUpperCase() + keyword.slice(1)); }
function creerUnivers(keywordsList, randomSeed) { const typesUnivers = ["médiéval-fantastique", "science-fiction", "post-apocalyptique", "contemporain", "cyberpunk", "steampunk"]; let type = typesUnivers[Math.floor(pseudoRandom(randomSeed+1)*typesUnivers.length)]; const caracteristiques = { "médiéval-fantastique": {epoque:"Moyen-Âge", technologie:"Magie", particularites:"Quêtes", lieux:["Forêt","Château"]}, "science-fiction": {epoque:"23ème Siècle", technologie:"Vaisseaux", particularites:"Exploration", lieux:["Station","Planète X"]}, "post-apocalyptique": {epoque:"Après Chute", technologie:"Bricolage", particularites:"Survie", lieux:["Ruines","Abri"]}, "contemporain": {epoque:"Aujourd'hui", technologie:"Actuelle", particularites:"Intrigues", lieux:["Ville","Café"]}, "cyberpunk": {epoque:"2077", technologie:"Implants", particularites:"Corpos", lieux:["Néo-Kyoto","Bas-fonds"]}, "steampunk": {epoque:"1888", technologie:"Vapeur", particularites:"Inventions", lieux:["Londres","Dirigeable"]} }; if(!caracteristiques[type]) type="contemporain"; const data = caracteristiques[type]; return { type, ...data, description: `Univers ${type}.`}; }
function creerPersonnages(keywordsList, univers, randomSeed) { const archetypes = ["héros", "mentor", "allié", "antagoniste"]; const pers = []; for(let i=0; i<4; i++) pers.push(creerPersonnageDetaille(archetypes[i%archetypes.length], univers, keywordsList, randomSeed+i*10)); return pers;}
function creerPersonnageDetaille(archetype, univers, keywordsList, randomSeed, nomsParUnivers={}, allTraits={}, allMotivations={}) { const nom = `${archetype.charAt(0).toUpperCase()+archetype.slice(1)} ${Math.floor(pseudoRandom(randomSeed)*100)}`; const apparence = "Apparence générée"; const trait = "Trait généré"; const motiv = "Motivation générée"; return { nom, archetype, apparence, traitDistinctif: trait, motivation: motiv, description: `${nom} (${archetype}). ${apparence}. Trait: ${trait}. Motivation: ${motiv}.`}; }
function creerStructureNarrative(keywordsList, univers, personnages, randomSeed) { const types = ["Voyage du Héros", "Quête", "Enquête"]; const type = types[Math.floor(pseudoRandom(randomSeed+10)*types.length)]; return {type, nombreChapitres: 4, etapesParChapitre:["Intro","Développement","Crise","Climax/Résolution"], description:`Structure: ${type}`}; }
function genererChapitresDetailles(structureNarrative, univers, personnages, randomSeed) { const chapitres = []; const nbChap = structureNarrative.nombreChapitres || 4; const etapes = structureNarrative.etapesParChapitre || ["Etape inconnue"]; let pg=1; for(let i=0; i<nbChap; i++){ const pages = []; for(let j=0; j<12; j++){ pages.push(genererPage(pg, i+1, j+1, univers, personnages, etapes[i%etapes.length], randomSeed+pg)); pg++; } chapitres.push({numero:i+1, titre:`Chap ${i+1}: ${etapes[i%etapes.length]}`, etape:etapes[i%etapes.length], pages, resume:`Résumé chap ${i+1}`}); } return chapitres; }
function genererPage(numGlob, numChap, numLoc, univers, personnages, etape, seed) { const nbCases=Math.floor(pseudoRandom(seed)*4)+3; const cases=[]; for(let k=0; k<nbCases; k++) cases.push(genererCase(numGlob, k+1, univers, personnages.slice(0,2), etape, seed+k)); return {numeroGlobal:numGlob, numeroChapitre:numChap, numeroLocal:numLoc, cases, description:`Desc Page ${numGlob}`}; }
function genererCase(numPg, numCase, univers, persosPresents, etape, seed) { const plans=["large","moyen","gros"]; const plan=plans[Math.floor(pseudoRandom(seed)*plans.length)]; const lieu=univers?.lieux?.length ? univers.lieux[Math.floor(pseudoRandom(seed+1)*univers.lieux.length)] : "Lieu?"; const dialogue= pseudoRandom(seed+2)>0.5&&persosPresents?.length ? {personnage: persosPresents[0]?.nom||"?", texte:genererLigneDialogue(persosPresents[0], etape, seed+5)} : null; const narration= pseudoRandom(seed+3)>0.7 ? genererNarration(univers, lieu, persosPresents, etape, dialogue, seed+6) : null; const desc=genererDescriptionVisuelle(plan, lieu, persosPresents, etape, dialogue, narration, seed+7); return {numeroPage:numPg, numeroCase, typePlan:plan, lieu, personnagesPresents: persosPresents.map(p=>p?.nom||"?"), dialogue, narration, descriptionVisuelle: desc}; }
function genererLigneDialogue(personnage, etape, seed) { const base = ["Quoi?", "Allons-y.", "Attention!", "Regarde."]; return base[Math.floor(pseudoRandom(seed)*base.length)]; }
function genererNarration(univers, lieu, personnages, etape, dialogue, seed) { const base = ["Silence.", "Tension.", "Soudain..."]; return base[Math.floor(pseudoRandom(seed)*base.length)]; }
function genererDescriptionVisuelle(typePlan, lieu, personnages, etape, dialogue, narration, seed) { return `${typePlan} dans ${lieu}. ${personnages.map(p=>p.nom).join(', ')}. Action/Expression. Ambiance.`; }

console.log("--- scenario_detaille.js : FIN ANALYSE ---");
