import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Key } from 'lucide-react';
import { NodeActionsToolbar } from './NodeActionsToolbar';

const EnvNode = ({ data, id }: { data: any, id: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (data.onDelete) data.onDelete(id);
    };

    const handleDuplicate = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (data.onDuplicate) data.onDuplicate(id, data);
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
            />
            {/* Connection Handles */}
            <Handle
                type="target"
                position={Position.Left}
                id="env-input"
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
            />
            <Handle
                type="source"
                position={Position.Right}
                id="env-output"
                className="!w-3 !h-3 !bg-green-500 !border-2 !border-white"
            />

            {/* Node Content */}
            <div className="px-4 py-3 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mb-2">
                    <Key size={24} className="text-green-600" />
                </div>

                {/* Label */}
                <div className="font-semibold text-sm text-gray-800 mb-1">
                    {data.label || '.env'}
                </div>

                {/* Metadata */}
                <div className="text-xs text-gray-500">
                    API Configuration
                </div>
            </div>
        </div>
    );
};

export default memo(EnvNode);
