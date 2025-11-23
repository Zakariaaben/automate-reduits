import { useState, useEffect, useCallback, useRef } from 'react';
import { ReactFlow, Background, BackgroundVariant, type Node, type Edge, useNodesState, useEdgesState, ConnectionMode } from '@xyflow/react';
import { generateAccessibleSteps, generateCoAccessibleSteps, type AlgorithmStep } from '../implementation/algorithms';
import StateNode from './StateNode';
import CustomEdge from './CustomEdge';
import AlgorithmSidebar from './AlgorithmSidebar';

const nodeTypes = {
    state: StateNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

interface AlgorithmVisualizerProps {
    initialNodes: Node[];
    initialEdges: Edge[];
}

export default function AlgorithmVisualizer({ initialNodes, initialEdges }: AlgorithmVisualizerProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    // État pour gérer les nœuds "actifs" (ceux qui n'ont pas été élagués)
    const [activeNodes, setActiveNodes] = useState<Node[]>([]);
    const [activeEdges, setActiveEdges] = useState<Edge[]>([]);
    const [isPruned, setIsPruned] = useState(false);

    const [steps, setSteps] = useState<AlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [algorithmType, setAlgorithmType] = useState<'accessible' | 'co-accessible'>('accessible');
    const timerRef = useRef<number | null>(null);

    // Sync activeNodes/activeEdges with initialNodes/initialEdges when they change
    useEffect(() => {
        setActiveNodes(initialNodes);
        setActiveEdges(initialEdges);
        setIsPruned(false);
    }, [initialNodes, initialEdges]);

    // Initialisation des étapes
    useEffect(() => {
        if (activeNodes.length === 0) return;

        // On utilise activeNodes/activeEdges au lieu de initialNodes/initialEdges
        // pour permettre le chaînage (élagage successif)
        const generator = algorithmType === 'accessible'
            ? generateAccessibleSteps(activeNodes, activeEdges)
            : generateCoAccessibleSteps(activeNodes, activeEdges);

        const generatedSteps = Array.from(generator);
        setSteps(generatedSteps);
        setCurrentStepIndex(0);
        setIsPlaying(false);

        // Initialisation de l'état visuel
        setNodes(activeNodes.map(n => ({ ...n, data: { ...n.data, readOnly: true, isHighlighted: false, isAccessible: false } })));
        setEdges(activeEdges.map(e => ({ ...e, animated: false, style: { ...e.style, stroke: '#71717a', strokeWidth: 2 } })));
    }, [activeNodes, activeEdges, algorithmType, setNodes, setEdges]);

    // Mise à jour de l'état visuel basé sur l'étape actuelle
    useEffect(() => {
        if (steps.length === 0) return;

        const step = steps[currentStepIndex];

        setNodes((nds) => nds.map((n) => {
            const isHighlighted = step.highlightedNodes.includes(n.id);
            const isAccessible = step.accessible.includes(n.id);
            return {
                ...n,
                data: {
                    ...n.data,
                    isHighlighted,
                    isAccessible,
                    readOnly: true
                }
            };
        }));

        setEdges((eds) => eds.map((e) => {
            const isHighlighted = step.highlightedEdges.includes(e.id);
            return {
                ...e,
                animated: isHighlighted,
                style: {
                    ...e.style,
                    stroke: isHighlighted ? '#eab308' : '#71717a',
                    strokeWidth: isHighlighted ? 3 : 2,
                }
            };
        }));

    }, [currentStepIndex, steps, setNodes, setEdges]);

    const handleNext = useCallback(() => {
        setCurrentStepIndex((prev) => {
            if (prev < steps.length - 1) return prev + 1;
            setIsPlaying(false);
            return prev;
        });
    }, [steps.length]);

    const handleReset = useCallback(() => {
        setIsPlaying(false);
        setCurrentStepIndex(0);
    }, []);

    const handlePlayPause = useCallback(() => {
        setIsPlaying((prev) => !prev);
    }, []);

    const handlePrune = useCallback(() => {
        if (steps.length === 0) return;

        const lastStep = steps[steps.length - 1];
        const keptNodeIds = new Set(lastStep.accessible);

        const newNodes = activeNodes.filter(n => keptNodeIds.has(n.id));
        const newEdges = activeEdges.filter(e => keptNodeIds.has(e.source) && keptNodeIds.has(e.target));

        setActiveNodes(newNodes);
        setActiveEdges(newEdges);
        setIsPruned(true);

        // Reset visual state immediately
        setNodes(newNodes);
        setEdges(newEdges);
    }, [steps, activeNodes, activeEdges, setNodes, setEdges]);

    const handleRestoreOriginal = useCallback(() => {
        setActiveNodes(initialNodes);
        setActiveEdges(initialEdges);
        setIsPruned(false);
    }, [initialNodes, initialEdges]);

    useEffect(() => {
        if (isPlaying) {
            timerRef.current = window.setInterval(handleNext, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isPlaying, handleNext]);

    const currentStep = steps[currentStepIndex];
    const isFinished = currentStepIndex === steps.length - 1;

    return (
        <div className="w-full h-full flex bg-zinc-50">
            <div className="flex-1 h-full relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                    connectionMode={ConnectionMode.Loose}
                    proOptions={{ hideAttribution: true }}
                >
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#e4e4e7" />
                </ReactFlow>
            </div>

            <div className="h-full shrink-0 z-10">
                <AlgorithmSidebar
                    currentLine={currentStep?.line ?? 0}
                    isPlaying={isPlaying}
                    onPlayPause={handlePlayPause}
                    onNext={handleNext}
                    onReset={handleReset}
                    queue={currentStep?.queue || []}
                    accessible={currentStep?.accessible || []}
                    description={currentStep?.description || ""}
                    algorithmType={algorithmType}
                    onAlgorithmChange={setAlgorithmType}
                    onPrune={handlePrune}
                    canPrune={isFinished && steps.length > 0}
                    onRestoreOriginal={handleRestoreOriginal}
                    canRestore={isPruned}
                />
            </div>
        </div>
    );
}
