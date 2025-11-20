/**
 * Generic Node Configuration Modal
 * Wraps NodeConfigGenerator to provide a consistent modal interface for all nodes
 */

import React, { useEffect, useState } from 'react';
import { X, Save } from 'lucide-react';
import NodeConfigGenerator from './NodeConfigGenerator';
import { nodeRegistry } from '../core/NodeRegistry';
import { INodeParameters } from '../types/node.types';

interface GenericNodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (nodeId: string, data: any) => void;
    nodeId: string;
    nodeType: string;
    initialData: any;
}

export default function GenericNodeModal({
    isOpen,
    onClose,
    onSave,
    nodeId,
    nodeType,
    initialData,
}: GenericNodeModalProps) {
    const [config, setConfig] = useState<INodeParameters>({});
    const [nodeDescription, setNodeDescription] = useState<any>(null);

    // Load node description and initial data when modal opens
    useEffect(() => {
        if (isOpen && nodeType) {
            const description = nodeRegistry.getNodeDescription(nodeType);
            if (description) {
                setNodeDescription(description);
                // Merge defaults with initial data
                const defaults: any = {};
                description.properties.forEach(prop => {
                    defaults[prop.name] = prop.default;
                });

                // If initialData has parameters, use them, otherwise use flat data (legacy)
                const initialParams = initialData.parameters || initialData;

                setConfig({ ...defaults, ...initialParams });
            }
        }
    }, [isOpen, nodeType, initialData]);

    const handleSave = () => {
        // Save the configuration
        // We preserve the original structure but update parameters
        onSave(nodeId, {
            ...initialData,
            parameters: config,
            // Also flatten for legacy compatibility if needed
            ...config
        });
        onClose();
    };

    if (!isOpen || !nodeDescription) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[800px] max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{nodeDescription.icon || '📦'}</span>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {nodeDescription.displayName}
                            </h2>
                            <p className="text-xs text-gray-500">
                                {nodeDescription.description}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    <NodeConfigGenerator
                        description={nodeDescription}
                        config={config}
                        onChange={setConfig}
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Save size={16} />
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}
