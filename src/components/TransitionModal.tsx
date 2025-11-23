import {
    Modal,
    Button,
    Select,
    Label,
    ListBox,
} from "@heroui/react";
import { useState, useEffect } from "react";
import type { Key } from "@heroui/react";

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
    const [selectedSymbol, setSelectedSymbol] = useState<Key | null>(null);

    // Reset selection when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedSymbol(null);
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (selectedSymbol) {
            onConfirm(selectedSymbol.toString());
            onOpenChange(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Container>
                <Modal.Dialog>
                    <Modal.Header>Add Transition</Modal.Header>
                    <Modal.Body>
                        <div className="w-full">
                            <Select
                                placeholder="Choose a symbol"
                                value={selectedSymbol}
                                onChange={(val) => setSelectedSymbol(val as Key)}
                                className="max-w-xs"
                            >
                                <Label>Symbol</Label>
                                <Select.Trigger>
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox>
                                        {alphabet
                                            .filter((symbol) => !usedSymbols.has(symbol))
                                            .map((symbol) => (
                                                <ListBox.Item key={symbol} id={symbol} textValue={symbol}>
                                                    {symbol}
                                                    <ListBox.ItemIndicator />
                                                </ListBox.Item>
                                            ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onPress={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onPress={handleConfirm}>
                            Add Transition
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </Modal.Container>
        </Modal>
    );
}
