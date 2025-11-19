import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { AlertTriangle, Plus } from 'lucide-react';

const AlertNode = ({ data }: { data: any }) => {
    const severityConfig = {
        Low: { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' },
        Medium: { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
        High: { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
        Critical: { bg: 'bg-red-50', text: 'text-red-800', badge: 'bg-red-100 text-red-800' },
    };

    const config = severityConfig[data.severity as keyof typeof severityConfig] || severityConfig.Medium;

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
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg ${config.bg} flex items-center justify-center mb-2`}>
                    <AlertTriangle size={24} className={config.text} />
                </div>

                {/* Label */}
                <div className="font-semibold text-sm text-gray-800 mb-1">
                    {data.label}
                </div>

                {/* Severity Badge */}
                {data.severity && (
                    <div className={`text-xs px-2 py-0.5 rounded-full ${config.badge}`}>
                        {data.severity}
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

export default memo(AlertNode);
