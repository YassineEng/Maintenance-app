import { useState } from 'react';
import { Settings, Bot, Database, AlertTriangle, Key, ChevronDown, ChevronRight, Eye, FileText } from 'lucide-react';

const nodeTypes = [
    { type: 'agent', label: 'AI Agent', icon: Bot, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { type: 'sensor', label: 'Sensor', icon: Database, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { type: 'alert', label: 'Alert', icon: AlertTriangle, iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
    { type: 'script', label: 'Code', icon: Settings, iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
    { type: 'env', label: 'Environment', icon: Key, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { type: 'display', label: 'Display', icon: Eye, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { type: 'file', label: 'File', icon: FileText, iconBg: 'bg-purple-50', iconColor: 'text-purple-600' },
];

const equipmentCategories = {
    'Crushing & Raw Material': [
        'Jaw Crusher', 'Hammer Crusher', 'Impact Crusher', 'Raw Mill', 'Coal Mill'
    ],
    'Kiln System': [
        'Rotary Kiln', 'Preheater', 'Precalciner', 'Cooler'
    ],
    'Grinding & Finishing': [
        'Cement Mill', 'Vertical Roller Mill', 'Separator', 'Packer'
    ],
    'Material Handling': [
        'Conveyor Belt', 'Bucket Elevator', 'Screw Conveyor', 'Pneumatic Conveyor'
    ],
    'Auxiliary Equipment': [
        'Compressor', 'ID Fan', 'FD Fan', 'Pump', 'Generator'
    ],
};

export default function NodePalette() {
    const [equipmentExpanded, setEquipmentExpanded] = useState(false);

    const onDragStart = (event: React.DragEvent, nodeType: string, equipmentType?: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        if (equipmentType) {
            event.dataTransfer.setData('equipmentType', equipmentType);
        }
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <h2 className="text-sm font-semibold mb-3 text-gray-700 uppercase tracking-wide">Nodes</h2>

            {/* Equipment Dropdown */}
            <div className="mb-3">
                <button
                    onClick={() => setEquipmentExpanded(!equipmentExpanded)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 hover:shadow-md hover:border-gray-300 transition-all flex items-center justify-between"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                            <Settings size={16} className="text-gray-700" />
                        </div>
                        <span className="font-medium text-sm text-gray-800">Equipment</span>
                    </div>
                    {equipmentExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                {equipmentExpanded && (
                    <div className="mt-2 ml-4 space-y-1">
                        {Object.entries(equipmentCategories).map(([category, items]) => (
                            <div key={category}>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 mt-2">
                                    {category}
                                </div>
                                {items.map((equipType) => (
                                    <div
                                        key={equipType}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, 'equipment', equipType)}
                                        className="bg-gray-50 border border-gray-200 rounded px-2 py-1.5 cursor-move hover:bg-gray-100 hover:border-gray-300 transition-all text-sm text-gray-700"
                                    >
                                        {equipType}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Other Nodes */}
            <div className="space-y-1">
                {nodeTypes.map((node) => {
                    const Icon = node.icon;
                    return (
                        <div
                            key={node.type}
                            draggable
                            onDragStart={(e) => onDragStart(e, node.type)}
                            className="bg-white border border-gray-200 rounded-lg p-2 cursor-move hover:shadow-md hover:border-gray-300 transition-all flex items-center gap-2"
                        >
                            <div className={`w-8 h-8 rounded-lg ${node.iconBg} flex items-center justify-center flex-shrink-0`}>
                                <Icon size={16} className={node.iconColor} />
                            </div>
                            <span className="font-medium text-sm text-gray-800">{node.label}</span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs text-blue-800">
                    <strong>Tip:</strong> Drag nodes onto the canvas to build your workflow.
                </p>
            </div>
        </div>
    );
}
