import {
    Modal,
    Button,
} from "@heroui/react";
import { useState, useEffect } from "react";

interface TransitionModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    alphabet: string[];
    usedSymbols: Set<string>;
    onConfirm: (symbol: string) => void;
}

export default function TransitionModal({
    isOpen,
    onOpenChange,
    alphabet,
    usedSymbols,
    onConfirm,
}: TransitionModalProps) {
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

    // Reset selection when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedSymbol(null);
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (selectedSymbol) {
            onConfirm(selectedSymbol);
            onOpenChange(false);
        }
    };

    const availableSymbols = alphabet.filter((symbol) => !usedSymbols.has(symbol));

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Container>
                <Modal.Dialog>
                    <Modal.Header>Ajouter une transition</Modal.Header>
                    <Modal.Body>
                        <div className="w-full">
                            <p className="text-sm text-zinc-500 mb-3">Sélectionnez un symbole :</p>
                            {availableSymbols.length === 0 ? (
                                <div className="text-zinc-400 italic text-sm text-center py-4 bg-zinc-50 rounded-lg border border-zinc-100">
                                    Tous les symboles sont déjà utilisés
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {availableSymbols.map((symbol) => (
                                        <Button
                                            key={symbol}
                                            size="sm"
                                            variant={selectedSymbol === symbol ? "primary" : "secondary"}
                                            onPress={() => setSelectedSymbol(symbol)}
                                            className={`min-w-12 font-mono text-sm ${selectedSymbol === symbol ? 'ring-2 ring-offset-1 ring-blue-500/30' : ''}`}
                                        >
                                            {symbol}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onPress={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button
                            variant="primary"
                            onPress={handleConfirm}
                            isDisabled={!selectedSymbol}
                        >
                            Ajouter
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal>
    );
}
