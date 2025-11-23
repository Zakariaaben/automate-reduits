import { Handle, Position, type NodeProps, useReactFlow, type Node } from '@xyflow/react';
import { memo } from 'react';
import { Dropdown, Button, Label } from '@heroui/react';

type StateNodeData = {
    label: string;
    isInitial: boolean;
    isFinal: boolean;
};

type StateNodeType = Node<StateNodeData>;

const StateNode = ({ id, data, selected }: NodeProps<StateNodeType>) => {
    const { setNodes, setEdges } = useReactFlow();

    const onDelete = () => {
        setNodes((nodes) => nodes.filter((n) => n.id !== id));
        setEdges((edges) => edges.filter((e) => e.source !== id && e.target !== id));
    };

    const onToggleFinal = () => {
        setNodes((nodes) =>
            nodes.map((n) => {
                if (n.id === id) {
                    return {
                        ...n,
                        data: { ...n.data, isFinal: !n.data.isFinal },
                    };
                }
                return n;
            })
        );
    };

    const onMakeInitial = () => {
        setNodes((nodes) =>
            nodes.map((n) => ({
                ...n,
                data: { ...n.data, isInitial: n.id === id },
            }))
        );
    };

    return (
        <div className="relative flex items-center justify-center group">
            {/* Initial State Indicator */}
            {data.isInitial && (
                <div className="absolute -left-8 text-2xl text-black dark:text-white pointer-events-none">
                    →
                </div>
            )}

            <div
                className={`
          w-16 h-16 rounded-full flex items-center justify-center 
          bg-white dark:bg-zinc-900 
          border-2 transition-all duration-200
          ${selected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-zinc-300 dark:border-zinc-700'}
          ${data.isFinal ? 'ring-4 ring-zinc-300 dark:ring-zinc-700 ring-offset-2 ring-offset-white dark:ring-offset-black' : ''}
        `}
            >
                <span className="font-medium text-lg text-zinc-900 dark:text-zinc-100 pointer-events-none select-none">
                    {data.label}
                </span>

                {/* Dropdown Menu Trigger - Visible on hover or selected */}
                <div className={`absolute -top-3 -right-3 transition-opacity duration-200 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <Button
                                isIconOnly
                                size="sm"
                                className="w-6 h-6 min-w-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm rounded-full"
                            >
                                <span className="text-xs">⋮</span>
                            </Button>
                        </Dropdown.Trigger>
                        <Dropdown.Popover>
                            <Dropdown.Menu onAction={(key) => {
                                if (key === 'initial') onMakeInitial();
                                if (key === 'final') onToggleFinal();
                                if (key === 'delete') onDelete();
                            }}>
                                <Dropdown.Item id="initial" textValue="Make Initial">
                                    <Label>Make Initial</Label>
                                </Dropdown.Item>
                                <Dropdown.Item id="final" textValue="Toggle Final">
                                    <Label>{data.isFinal ? 'Unmark Final' : 'Mark Final'}</Label>
                                </Dropdown.Item>
                                <Dropdown.Item id="delete" textValue="Delete" variant="danger">
                                    <Label>Delete State</Label>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown.Popover>
                    </Dropdown>
                </div>

                <Handle
                    type="source"
                    position={Position.Top}
                    id="top"
                    className={`w-4 h-4 bg-blue-500! border-2 border-white! rounded-full transition-opacity duration-200 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    id="right"
                    className={`w-4 h-4 bg-blue-500! border-2 border-white! rounded-full transition-opacity duration-200 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="bottom"
                    className={`w-4 h-4 bg-blue-500! border-2 border-white! rounded-full transition-opacity duration-200 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                />
                <Handle
                    type="source"
                    position={Position.Left}
                    id="left"
                    className={`w-4 h-4 bg-blue-500! border-2 border-white! rounded-full transition-opacity duration-200 ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                />
            </div>
        </div>
    );
};

export default memo(StateNode);
