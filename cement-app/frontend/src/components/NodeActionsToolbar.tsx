import React from 'react';
import { NodeToolbar, Position } from 'reactflow';
import { Trash2, Copy, Play } from 'lucide-react';

interface NodeActionsToolbarProps {
    isVisible: boolean;
    onDelete?: (e: React.MouseEvent) => void;
    onDuplicate?: (e: React.MouseEvent) => void;
    onRun?: (e: React.MouseEvent) => void;
    children?: React.ReactNode;
}

export const NodeActionsToolbar: React.FC<NodeActionsToolbarProps> = ({
    isVisible,
    onDelete,
    onDuplicate,
    onRun,
    children
}) => {
    return (
        <NodeToolbar
            isVisible={isVisible}
            position={Position.Top}
            offset={0}
            className="flex gap-2 bg-white p-1 rounded-lg shadow-md border border-gray-200"
        >
            {onRun && (
                <button
                    onClick={onRun}
                    className="p-1.5 rounded-md hover:bg-green-50 text-green-600 transition-colors"
                    title="Run Script"
                >
                    <Play size={16} />
                </button>
            )}
            {children}
            {onDuplicate && (
                <button
                    onClick={onDuplicate}
                    className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Duplicate Node"
                >
                    <Copy size={16} />
                </button>
            )}
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                    title="Delete Node"
                >
                    <Trash2 size={16} />
                </button>
            )}
        </NodeToolbar>
    );
};
