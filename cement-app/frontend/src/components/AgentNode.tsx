import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Bot, Play } from 'lucide-react';
import { NodeActionsToolbar } from './NodeActionsToolbar';

const AgentNode = ({ data, id }: { data: any, id: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (data.onDelete) data.onDelete(id);
    };

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (data.onDuplicate) data.onDuplicate(id, data);
    };

    const handleRun = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (data.onRun) data.onRun(id);
    };

    return (
        <div
            className="relative bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow min-w-[180px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <NodeActionsToolbar
                isVisible={isHovered}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
            >
                <button
                    onClick={handleRun}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Run Agent"
                >
                    <Play size={14} />
                </button>
            </NodeActionsToolbar>
            {/* Connection Handles */}
            <Handle
                type="target"
                position={Position.Left}
                id="agent-input"
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
            />
            <Handle
                type="source"
                position={Position.Right}
                id="agent-output"
                className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white"
            />

            {/* Node Content */}
            <div className="px-4 py-3 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                    <Bot size={24} className="text-blue-600" />
                </div>

                {/* Label */}
                <div className="font-semibold text-sm text-gray-800 mb-1">
                    {data.label || 'AI Agent'}
                </div>

                {/* Metadata */}
                <div className="text-xs text-gray-500">
                    {data.persona || 'Agent'}
                </div>
            </div>
        </div>
    );
};

export default memo(AgentNode);
