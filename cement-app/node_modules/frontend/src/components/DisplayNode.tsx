import { memo, useState } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { Eye } from 'lucide-react';
import { NodeActionsToolbar } from './NodeActionsToolbar';

const DisplayNode = ({ data, id, selected }: { data: any, id: string, selected: boolean }) => {
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
            className="relative bg-white rounded-lg shadow-md border border-gray-200 min-w-[200px] h-full flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <NodeActionsToolbar
                isVisible={isHovered}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
            />
            <NodeResizer
                color="#a855f7"
                isVisible={selected}
                minWidth={200}
                minHeight={100}
            />

            <div className="flex items-center gap-2 p-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Eye size={16} className="text-purple-600" />
                </div>
                <span className="font-semibold text-sm text-gray-800">Display</span>
            </div>

            <div className="flex-1 p-3 overflow-hidden flex flex-col">
                <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Output</div>
                <div className="flex-1 bg-gray-50 rounded border border-gray-200 p-2 overflow-auto font-mono text-xs text-gray-700 whitespace-pre-wrap">
                    {data.output || <span className="text-gray-400 italic">No output generated yet...</span>}
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
            />
        </div>
    );
};

export default memo(DisplayNode);
