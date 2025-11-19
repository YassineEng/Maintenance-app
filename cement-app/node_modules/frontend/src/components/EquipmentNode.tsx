import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Settings, Plus } from 'lucide-react';
import { NodeActionsToolbar } from './NodeActionsToolbar';

const EquipmentNode = ({ data, id }: { data: any, id: string }) => {
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
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
            />

            {/* Node Content */}
            <div className="px-4 py-3 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-2">
                    <Settings size={24} className="text-gray-700" />
                </div>

                {/* Label */}
                <div className="font-semibold text-sm text-gray-800 mb-1">
                    {data.label}
                </div>

                {/* Status Badge */}
                {data.status && (
                    <div className={`text-xs px-2 py-0.5 rounded-full ${data.status === 'Running'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}>
                        {data.status}
                    </div>
                )}
            </div>

            {/* Add Connection Button */}
            <button className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 shadow-sm">
                <Plus size={14} className="text-gray-600" />
            </button>
        </div>
    );
};

export default memo(EquipmentNode);
