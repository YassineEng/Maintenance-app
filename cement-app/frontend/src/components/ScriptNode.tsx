import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Plus } from 'lucide-react';

const ScriptNode = ({ data }: { data: any }) => {
    return (
        <div className="relative bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow min-w-[180px]">
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

            {/* Add Connection Button */}
            <button className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 shadow-sm">
                <Plus size={14} className="text-gray-600" />
            </button>
        </div>
    );
};

export default memo(ScriptNode);
