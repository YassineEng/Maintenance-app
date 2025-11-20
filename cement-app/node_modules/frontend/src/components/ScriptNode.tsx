import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeActionsToolbar } from './NodeActionsToolbar';

const ScriptNode = ({ data, id }: { data: any, id: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleRun = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log(`Running script for node ${id}. Code length: ${data.code?.length || 0}`);
        if (data.onRun) {
            data.onRun(id, data.code);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (data.onDelete) {
            data.onDelete(id);
        }
    };

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (data.onDuplicate) {
            data.onDuplicate(id, data);
        }
    };

    return (
        <div
            className="relative bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow min-w-[180px] group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <NodeActionsToolbar
                isVisible={isHovered}
                onRun={handleRun}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
            />

            {/* Connection Handles */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
            />

            {/* UV Status Indicator */}
            <div className="absolute top-2 right-2 flex items-center gap-1">
                <span className="text-[10px] font-mono text-gray-400">uv</span>
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.6)]"></div>
            </div>

            {/* Node Content */}
            <div className="px-4 py-3 flex flex-col items-center text-center mt-2">
                {/* Icon with curly braces */}
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center mb-2">
                    <div className="text-2xl font-bold text-orange-600">{'{}'}</div>
                </div>

                {/* Label */}
                <div className="font-semibold text-sm text-gray-800 mb-1">
                    {data.label}
                </div>

                {/* Language */}
                <div className="text-xs text-gray-500">
                    {data.language || 'JavaScript'}
                </div>
            </div>
        </div>
    );
};

export default memo(ScriptNode);
