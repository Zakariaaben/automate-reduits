import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    type EdgeProps,
    useReactFlow,
} from '@xyflow/react';
import { Dropdown, Button, Label } from '@heroui/react';

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    label,
}: EdgeProps) {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        curvature: 0.3,
    });

    const onDelete = () => {
        setEdges((edges) => edges.filter((e) => e.id !== id));
    };

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                >
                    <Dropdown>
                        <Dropdown.Trigger>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="h-6 min-w-0 px-2 text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-sm"
                            >
                                {label || 'ε'}
                            </Button>
                        </Dropdown.Trigger>
                        <Dropdown.Popover>
                            <Dropdown.Menu onAction={(key) => {
                                if (key === 'delete') onDelete();
                            }}>
                                <Dropdown.Item id="delete" textValue="Delete" variant="danger">
                                    <Label>Delete Edge</Label>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown.Popover>
                    </Dropdown>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}
