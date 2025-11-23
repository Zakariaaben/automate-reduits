import { type Node, type Edge } from '@xyflow/react';

export type AlgorithmStep = {
    line: number;
    highlightedNodes: string[];
    highlightedEdges: string[];
    description: string;
    queue: string[];
    accessible: string[];
};

export function* generateAccessibleSteps(nodes: Node[], edges: Edge[]): Generator<AlgorithmStep> {
    const initialNode = nodes.find((n) => n.data.isInitial);

    // Ligne 1: P = {i}
    const accessible = new Set<string>();
    if (initialNode) {
        accessible.add(initialNode.id);
    }
    yield {
        line: 1,
        highlightedNodes: initialNode ? [initialNode.id] : [],
        highlightedEdges: [],
        description: "Initialiser l'ensemble accessible P avec l'état initial",
        queue: [],
        accessible: Array.from(accessible),
    };

    // Ligne 2: L = [i]
    const queue: string[] = [];
    if (initialNode) {
        queue.push(initialNode.id);
    }
    yield {
        line: 2,
        highlightedNodes: initialNode ? [initialNode.id] : [],
        highlightedEdges: [],
        description: "Initialiser la file L avec l'état initial",
        queue: [...queue],
        accessible: Array.from(accessible),
    };

    // Ligne 3: Tant que L n'est pas vide
    while (queue.length > 0) {
        yield {
            line: 3,
            highlightedNodes: [],
            highlightedEdges: [],
            description: "Vérifier si la file est vide",
            queue: [...queue],
            accessible: Array.from(accessible),
        };

        // Ligne 4: s = L.pop()
        const s = queue.shift()!;
        yield {
            line: 4,
            highlightedNodes: [s],
            highlightedEdges: [],
            description: `Défiler l'état ${s}`,
            queue: [...queue],
            accessible: Array.from(accessible),
        };

        // Trouver les transitions depuis s
        const transitions = edges.filter((e) => e.source === s);

        // Ligne 5: Pour chaque transition
        if (transitions.length === 0) {
            yield {
                line: 5,
                highlightedNodes: [s],
                highlightedEdges: [],
                description: `Aucune transition depuis ${s}`,
                queue: [...queue],
                accessible: Array.from(accessible),
            };
        }

        for (const edge of transitions) {
            const t = edge.target;
            yield {
                line: 5,
                highlightedNodes: [s, t],
                highlightedEdges: [edge.id],
                description: `Vérifier la transition de ${s} vers ${t}`,
                queue: [...queue],
                accessible: Array.from(accessible),
            };

            // Ligne 6: Si t n'est pas dans P
            if (!accessible.has(t)) {
                yield {
                    line: 6,
                    highlightedNodes: [t],
                    highlightedEdges: [],
                    description: `${t} n'est pas dans l'ensemble accessible P`,
                    queue: [...queue],
                    accessible: Array.from(accessible),
                };

                // Ligne 7: P.add(t)
                accessible.add(t);
                yield {
                    line: 7,
                    highlightedNodes: [t],
                    highlightedEdges: [],
                    description: `Marquer ${t} comme accessible`,
                    queue: [...queue],
                    accessible: Array.from(accessible),
                };

                // Ligne 8: L.push(t)
                queue.push(t);
                yield {
                    line: 8,
                    highlightedNodes: [t],
                    highlightedEdges: [],
                    description: `Ajouter ${t} à la file`,
                    queue: [...queue],
                    accessible: Array.from(accessible),
                };
            } else {
                yield {
                    line: 6,
                    highlightedNodes: [t],
                    highlightedEdges: [],
                    description: `${t} est déjà accessible`,
                    queue: [...queue],
                    accessible: Array.from(accessible),
                };
            }
        }
    }

    yield {
        line: 3,
        highlightedNodes: [],
        highlightedEdges: [],
        description: "La file est vide",
        queue: [],
        accessible: Array.from(accessible),
    };

    // Ligne 9: Retourner P
    yield {
        line: 9,
        highlightedNodes: Array.from(accessible),
        highlightedEdges: [],
        description: "Algorithme terminé. Retourner les états accessibles.",
        queue: [],
        accessible: Array.from(accessible),
    };
}

export function* generateCoAccessibleSteps(nodes: Node[], edges: Edge[]): Generator<AlgorithmStep> {
    const finalNodes = nodes.filter((n) => n.data.isFinal);

    // Ligne 1: Q = {f | f in F}
    const coAccessible = new Set<string>();
    finalNodes.forEach(n => coAccessible.add(n.id));

    yield {
        line: 1,
        highlightedNodes: finalNodes.map(n => n.id),
        highlightedEdges: [],
        description: "Initialiser l'ensemble co-accessible Q avec les états finaux",
        queue: [],
        accessible: Array.from(coAccessible),
    };

    // Ligne 2: L = [f | f in F]
    const queue: string[] = [];
    finalNodes.forEach(n => queue.push(n.id));

    yield {
        line: 2,
        highlightedNodes: finalNodes.map(n => n.id),
        highlightedEdges: [],
        description: "Initialiser la file L avec les états finaux",
        queue: [...queue],
        accessible: Array.from(coAccessible),
    };

    // Ligne 3: Tant que L n'est pas vide
    while (queue.length > 0) {
        yield {
            line: 3,
            highlightedNodes: [],
            highlightedEdges: [],
            description: "Vérifier si la file est vide",
            queue: [...queue],
            accessible: Array.from(coAccessible),
        };

        // Ligne 4: s = L.pop()
        const s = queue.shift()!;
        yield {
            line: 4,
            highlightedNodes: [s],
            highlightedEdges: [],
            description: `Défiler l'état ${s}`,
            queue: [...queue],
            accessible: Array.from(coAccessible),
        };

        // Trouver les transitions vers s (inversées)
        // On cherche les arêtes (t, a, s) où target === s
        const incomingEdges = edges.filter((e) => e.target === s);

        // Ligne 5: Pour chaque transition (t, a, s)
        if (incomingEdges.length === 0) {
            yield {
                line: 5,
                highlightedNodes: [s],
                highlightedEdges: [],
                description: `Aucune transition vers ${s}`,
                queue: [...queue],
                accessible: Array.from(coAccessible),
            };
        }

        for (const edge of incomingEdges) {
            const t = edge.source;
            yield {
                line: 5,
                highlightedNodes: [t, s],
                highlightedEdges: [edge.id],
                description: `Vérifier la transition de ${t} vers ${s}`,
                queue: [...queue],
                accessible: Array.from(coAccessible),
            };

            // Ligne 6: Si t n'est pas dans Q
            if (!coAccessible.has(t)) {
                yield {
                    line: 6,
                    highlightedNodes: [t],
                    highlightedEdges: [],
                    description: `${t} n'est pas dans l'ensemble co-accessible Q`,
                    queue: [...queue],
                    accessible: Array.from(coAccessible),
                };

                // Ligne 7: Q.add(t)
                coAccessible.add(t);
                yield {
                    line: 7,
                    highlightedNodes: [t],
                    highlightedEdges: [],
                    description: `Marquer ${t} comme co-accessible`,
                    queue: [...queue],
                    accessible: Array.from(coAccessible),
                };

                // Ligne 8: L.push(t)
                queue.push(t);
                yield {
                    line: 8,
                    highlightedNodes: [t],
                    highlightedEdges: [],
                    description: `Ajouter ${t} à la file`,
                    queue: [...queue],
                    accessible: Array.from(coAccessible),
                };
            } else {
                yield {
                    line: 6,
                    highlightedNodes: [t],
                    highlightedEdges: [],
                    description: `${t} est déjà co-accessible`,
                    queue: [...queue],
                    accessible: Array.from(coAccessible),
                };
            }
        }
    }

    yield {
        line: 3,
        highlightedNodes: [],
        highlightedEdges: [],
        description: "La file est vide",
        queue: [],
        accessible: Array.from(coAccessible),
    };

    // Ligne 9: Retourner Q
    yield {
        line: 9,
        highlightedNodes: Array.from(coAccessible),
        highlightedEdges: [],
        description: "Algorithme terminé. Retourner les états co-accessibles.",
        queue: [],
        accessible: Array.from(coAccessible),
    };
}
