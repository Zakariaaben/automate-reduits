import { Card, Button, Chip } from "@heroui/react";
import { motion, AnimatePresence } from "motion/react";

interface AlgorithmSidebarProps {
    currentLine: number;
    isPlaying: boolean;
    onPlayPause: () => void;
    onNext: () => void;
    onReset: () => void;
    queue: string[];
    accessible: string[];
    description: string;
    algorithmType: 'accessible' | 'co-accessible';
    onAlgorithmChange: (type: 'accessible' | 'co-accessible') => void;
    onPrune: () => void;
    canPrune: boolean;
    onRestoreOriginal: () => void;
    canRestore: boolean;
}

const ACCESSIBLE_CODE = [
    { line: 1, text: "Initialiser P = {i} (états accessibles)" },
    { line: 2, text: "Initialiser L = [i] (file d'attente)" },
    { line: 3, text: "Tant que L n'est pas vide :" },
    { line: 4, text: "  Retirer un état s de L" },
    { line: 5, text: "  Pour chaque transition (s, a, t) :" },
    { line: 6, text: "    Si t n'est pas dans P :" },
    { line: 7, text: "      Ajouter t à P" },
    { line: 8, text: "      Ajouter t à L" },
    { line: 9, text: "Retourner P" },
];

const CO_ACCESSIBLE_CODE = [
    { line: 1, text: "Initialiser Q = {f | f ∈ F} (co-accessibles)" },
    { line: 2, text: "Initialiser L = [f | f ∈ F] (file)" },
    { line: 3, text: "Tant que L n'est pas vide :" },
    { line: 4, text: "  Retirer un état s de L" },
    { line: 5, text: "  Pour chaque transition (t, a, s) :" },
    { line: 6, text: "    Si t n'est pas dans Q :" },
    { line: 7, text: "      Ajouter t à Q" },
    { line: 8, text: "      Ajouter t à L" },
    { line: 9, text: "Retourner Q" },
];

export default function AlgorithmSidebar({
    currentLine,
    isPlaying,
    onPlayPause,
    onNext,
    onReset,
    queue,
    accessible,
    description,
    algorithmType,
    onAlgorithmChange,
    onPrune,
    canPrune,
    onRestoreOriginal,
    canRestore,
}: AlgorithmSidebarProps) {
    const codeLines = algorithmType === 'accessible' ? ACCESSIBLE_CODE : CO_ACCESSIBLE_CODE;

    return (
        <Card className="h-full w-96 flex flex-col border-l border-zinc-200 bg-white/80 backdrop-blur-md shadow-xl rounded-none">
            {/* Header & Controls */}
            <div className="p-4 border-b border-zinc-200 bg-zinc-50/50">
                <div className="mb-4 flex gap-2 justify-center">
                    <Button
                        size="sm"
                        variant={algorithmType === 'accessible' ? 'primary' : 'secondary'}
                        onPress={() => onAlgorithmChange('accessible')}
                        className="flex-1"
                    >
                        Accessible
                    </Button>
                    <Button
                        size="sm"
                        variant={algorithmType === 'co-accessible' ? 'primary' : 'secondary'}
                        onPress={() => onAlgorithmChange('co-accessible')}
                        className="flex-1"
                    >
                        Co-Accessible
                    </Button>
                </div>

                <div className="flex justify-center gap-2 mb-4">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        onPress={onReset}
                        className="text-zinc-500 hover:text-zinc-900"
                    >
                        ↺
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="primary"
                        onPress={onPlayPause}
                        className="text-white"
                    >
                        {isPlaying ? "||" : "▶"}
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        onPress={onNext}
                        isDisabled={isPlaying}
                        className="text-zinc-500 hover:text-zinc-900"
                    >
                        ⏭
                    </Button>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                    <Button
                        size="sm"
                        variant="secondary"
                        onPress={onPrune}
                        isDisabled={!canPrune}
                        className="w-full font-medium"
                    >
                        supprimer les états non-{algorithmType === 'accessible' ? 'accessibles' : 'co-accessibles'}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onPress={onRestoreOriginal}
                        isDisabled={!canRestore}
                        className="w-full font-medium text-xs"
                    >
                        ↻ Restaurer l'automate original
                    </Button>
                </div>

                <div className="text-xs font-mono text-zinc-500 bg-zinc-100 p-2 rounded border border-zinc-200 min-h-12 flex items-center justify-center text-center">
                    {description || "Prêt à démarrer"}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Pseudo Code */}
                <div className="p-4">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Pseudo-code</h3>
                    <div className="font-mono text-xs space-y-1">
                        {codeLines.map((item) => (
                            <div
                                key={item.line}
                                className={`relative px-2 py-1.5 rounded transition-colors duration-200 ${currentLine === item.line
                                    ? "bg-blue-100 text-blue-700 font-medium"
                                    : "text-zinc-500"
                                    }`}
                            >
                                {currentLine === item.line && (
                                    <motion.span
                                        layoutId="sidebar-arrow"
                                        className="absolute -left-1 text-blue-500 font-bold"
                                    >
                                        ➜
                                    </motion.span>
                                )}
                                <span className="ml-2">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-zinc-200 my-2 mx-4" />

                {/* Data Structures */}
                <div className="p-4 space-y-6">
                    {/* Queue */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">File d'attente (L)</h3>
                            <span className="text-xs text-zinc-400 font-mono">FIFO</span>
                        </div>
                        <div className="min-h-16 bg-zinc-100/50 border border-zinc-200/60 rounded-xl p-3 flex flex-wrap gap-2 items-center content-start transition-all">
                            <AnimatePresence mode="popLayout">
                                {queue.length === 0 ? (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-zinc-400 text-sm italic w-full text-center py-2"
                                    >
                                        Vide
                                    </motion.span>
                                ) : (
                                    queue.map((state) => (
                                        <motion.div
                                            layout
                                            key={state}
                                            initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.5, y: -10 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            className="bg-white border-2 border-zinc-200 text-zinc-800 px-3 py-1.5 rounded-lg text-sm font-bold font-mono shadow-sm min-w-10 text-center"
                                        >
                                            {state}
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Accessible Set */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                                {algorithmType === 'accessible' ? 'États Accessibles' : 'États Co-Accessibles'} ({algorithmType === 'accessible' ? 'P' : 'Q'})
                            </h3>
                            <span className="text-xs text-zinc-400 font-mono">Ensemble</span>
                        </div>
                        <div className="min-h-16 bg-zinc-100/50 border border-zinc-200/60 rounded-xl p-3 flex flex-wrap gap-2 items-center content-start transition-all">
                            <AnimatePresence mode="popLayout">
                                {accessible.length === 0 ? (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-zinc-400 text-sm italic w-full text-center py-2"
                                    >
                                        Vide
                                    </motion.span>
                                ) : (
                                    accessible.map((state) => (
                                        <motion.div
                                            layout
                                            key={state}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                        >
                                            <Chip
                                                size="md"
                                                variant="soft"
                                                color="success"
                                                className="font-mono font-medium text-zinc-900 shadow-sm"
                                            >
                                                {state}
                                            </Chip>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
