import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SensorConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: any) => void;
    initialData: any;
}

export default function SensorConfigModal({ isOpen, onClose, onSave, initialData }: SensorConfigModalProps) {
    const [label, setLabel] = useState(initialData?.label || '');
    const [sensorId, setSensorId] = useState(initialData?.sensorId || '');
    const [type, setType] = useState(initialData?.type || 'Temperature');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ label, sensorId, type });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-96 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Configure Sensor</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sensor Name</label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., Temperature Sensor 1"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sensor ID</label>
                        <input
                            type="text"
                            value={sensorId}
                            onChange={(e) => setSensorId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="e.g., S-TMP-001"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sensor Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="Temperature">Temperature</option>
                            <option value="Vibration">Vibration</option>
                            <option value="Pressure">Pressure</option>
                            <option value="Flow">Flow</option>
                            <option value="Level">Level</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
