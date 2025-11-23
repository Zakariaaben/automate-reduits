export type State = string;

export interface Instruction {
    from: State;
    symbol: string;
    to: State;
}

export class Automate {
    alphabet: Set<string>;
    states: Set<State>;
    initialState: State;
    finalStates: Set<State>;
    instructions: Instruction[];
    transitionMatrix: Map<State, Map<string, State>>;

    constructor(
        alphabet: Set<string> | string[],
        states: Set<State> | State[],
        initialState: State,
        finalStates: Set<State> | State[],
        instructions: Instruction[]
    ) {
        this.alphabet = new Set(alphabet);
        this.states = new Set(states);
        this.initialState = initialState;
        this.finalStates = new Set(finalStates);
        this.instructions = instructions;
        this.transitionMatrix = new Map();

        for (const { from, symbol, to } of instructions) {
            if (!this.transitionMatrix.has(from)) {
                this.transitionMatrix.set(from, new Map());
            }
            this.transitionMatrix.get(from)!.set(symbol, to);
        }
    }
}


