import { type State, Automate } from "./automate";

/**
 * Calcule l'automate accessible à partir d'un automate donné.
 * Un état est accessible s'il existe un chemin depuis l'état initial vers cet état.
 */
const accessible = (a: Automate): Automate => {
    // Identifier les états accessibles

    const etatsAccessibles = new Set<State>();
    const aVisiter: State[] = [a.initialState];

    etatsAccessibles.add(a.initialState);

    // Parcours en profondeur pour trouver tous les états atteignables
    while (aVisiter.length > 0) {
        const etatCourant = aVisiter.pop()!;
        const transitionsDuCourant = a.transitionMatrix.get(etatCourant);

        if (transitionsDuCourant) {
            for (const [_symbole, etatSuivant] of transitionsDuCourant.entries()) {
                // Si l'état suivant n'a pas encore été visité
                if (!etatsAccessibles.has(etatSuivant)) {
                    etatsAccessibles.add(etatSuivant);
                    aVisiter.push(etatSuivant);
                }
            }
        }
    }

    // Construire le nouvel automate avec uniquement les états accessibles

    // Filtrer les états
    const nouveauxEtats = new Set(
        [...a.states].filter(etat => etatsAccessibles.has(etat))
    );

    // Filtrer les états finaux
    const nouveauxEtatsFinaux = new Set(
        [...a.finalStates].filter(etat => etatsAccessibles.has(etat))
    );

    // Filtrer les transitions (garder seulement celles entre états accessibles)
    const nouvellesInstructions = a.instructions.filter(
        ({ from, to }) => etatsAccessibles.has(from) && etatsAccessibles.has(to)
    );

    // Construire et retourner le nouvel automate
    return new Automate(
        a.alphabet,
        nouveauxEtats,
        a.initialState,
        nouveauxEtatsFinaux,
        nouvellesInstructions
    );
};

export { accessible };
