import { useCallback, useState, useMemo } from 'react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Background,
    Controls,
    MiniMap,
    type Connection,
    type Edge,
    type Node,
    MarkerType,
    BackgroundVariant,
    Panel,
    ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button, Card, Input } from '@heroui/react';
import StateNode from './StateNode';
import CustomEdge from './CustomEdge';
import TransitionModal from './TransitionModal';
import { Automate, type Instruction } from '../implementation/automate';

const nodeTypes = {
    state: StateNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

const initialNodes: Node[] = [
    {
        id: 'S0',
        type: 'state',
        position: { x: 250, y: 250 },
        data: { label: 'S0', isInitial: true, isFinal: false },
    },
];

export default function AutomateEditor() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [alphabet, setAlphabet] = useState<string[]>(['a', 'b']);
    const [newSymbol, setNewSymbol] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingConnection, setPendingConnection] = useState<Connection | null>(null);

    const usedSymbols = useMemo(() => {
        if (!pendingConnection) return new Set<string>();
        const sourceId = pendingConnection.source;
        const sourceEdges = edges.filter((e) => e.source === sourceId);
        const used = new Set<string>();
        sourceEdges.forEach((e) => {
            if (typeof e.label === 'string') {
                e.label.split(', ').forEach((s) => used.add(s));
            }
        });
        return used;
    }, [pendingConnection, edges]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const exportToAutomate = useCallback(() => {
        const stateSet = new Set(nodes.map((n) => n.id));
        const alphabetSet = new Set(alphabet);
        const initialState = nodes.find((n) => n.data.isInitial)?.id || '';
        const finalStates = new Set(nodes.filter((n) => n.data.isFinal).map((n) => n.id));

        const instructions: Instruction[] = [];
        edges.forEach((edge) => {
            if (edge.label) {
                const symbols = (edge.label as string).split(', ');
                symbols.forEach((symbol) => {
                    instructions.push({
                        from: edge.source,
                        to: edge.target,
                        symbol,
                    });
                });
            }
        });

        return new Automate(
            alphabetSet,
            stateSet,
            initialState,
            finalStates,
            instructions
        );
    }, [nodes, edges, alphabet]);

    const onConnect = useCallback(
        (params: Connection) => {
            setPendingConnection(params);
            setIsModalOpen(true);
        },
        []
    );

    const onConfirmTransition = useCallback(
        (symbol: string) => {
            if (!pendingConnection) return;

            const { source, target } = pendingConnection;

            // Check if edge already exists
            const existingEdge = edges.find(
                (e) => e.source === source && e.target === target
            );

            if (existingEdge) {
                // Update label
                const currentLabel = existingEdge.label as string;
                const symbols = currentLabel.split(', ');
                if (!symbols.includes(symbol)) {
                    const newLabel = [...symbols, symbol].sort().join(', ');
                    setEdges((eds) =>
                        eds.map((e) =>
                            e.id === existingEdge.id ? { ...e, label: newLabel } : e
                        )
                    );
                }
            } else {
                // Create new edge
                const newEdge: Edge = {
                    ...pendingConnection,
                    id: `e${source}-${target}`,
                    label: symbol,
                    type: 'custom', // Use custom edge
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                    },
                    style: { strokeWidth: 2 },
                };
                setEdges((eds) => addEdge(newEdge, eds));
            }

            setPendingConnection(null);
        },
        [pendingConnection, edges, setEdges]
    );

    const addState = useCallback(() => {
        // Find the minimum available index
        const existingIndices = new Set(
            nodes
                .map((n) => {
                    const match = n.id.match(/^S(\d+)$/);
                    return match ? parseInt(match[1], 10) : -1;
                })
                .filter((i) => i >= 0)
        );

        let newIndex = 0;
        while (existingIndices.has(newIndex)) {
            newIndex++;
        }

        const id = `S${newIndex}`;
        const newNode: Node = {
            id,
            type: 'state',
            position: {
                x: Math.random() * 400 + 100,
                y: Math.random() * 400 + 100,
            },
            data: { label: id, isInitial: false, isFinal: false },
        };
        setNodes((nds) => [...nds, newNode]);
    }, [nodes, setNodes]);

    const addSymbol = () => {
        if (newSymbol && !alphabet.includes(newSymbol)) {
            setAlphabet([...alphabet, newSymbol]);
            setNewSymbol('');
        }
    };

    return (
        <div className="w-full h-screen bg-zinc-50 dark:bg-zinc-950">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                connectionMode={ConnectionMode.Loose}
                className="bg-zinc-50 dark:bg-zinc-950"
            >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <Controls />
                <MiniMap />

                <Panel position="top-left" className="bg-transparent p-4">
                    <Card className="p-4 w-80 shadow-xl backdrop-blur-md bg-white/80 dark:bg-zinc-900/80">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Automata Editor</h2>

                            <div className="flex gap-2">
                                <Button onPress={addState} variant="primary" className="flex-1">
                                    Add State
                                </Button>
                                <Button onPress={() => console.log(exportToAutomate())} variant="secondary" className="flex-1">
                                    Export
                                </Button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Alphabet</span>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Symbol"
                                        value={newSymbol}
                                        onChange={(e) => setNewSymbol(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button onPress={addSymbol} size="sm" variant="ghost">
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {alphabet.map((s) => (
                                        <span key={s} className="px-2 py-1 text-xs rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Panel>
            </ReactFlow>

            <TransitionModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                alphabet={alphabet}
                usedSymbols={usedSymbols}
                onConfirm={onConfirmTransition}
            />
        </div>
    );
}
