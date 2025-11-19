import { useState } from 'react';
import { X } from 'lucide-react';

interface AgentConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: any) => void;
    initialData: any;
}

const aiModels = [
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
    { value: 'claude-2', label: 'Claude 2' },
    { value: 'custom', label: 'Custom Model' },
];

const personas = [
    'Maintenance Expert',
    'Scheduler',
    'Anomaly Detector',
    'Parts Optimizer',
    'Safety Inspector',
    'Energy Optimizer',
    'Custom',
];

export default function AgentConfigModal({ isOpen, onClose, onSave, initialData }: AgentConfigModalProps) {
    const [label, setLabel] = useState(initialData?.label || '');
    const [model, setModel] = useState(initialData?.model || 'gpt-4-turbo');
    const [customModel, setCustomModel] = useState(initialData?.customModel || '');
    const [task, setTask] = useState(initialData?.task || '');
    const [persona, setPersona] = useState(initialData?.persona || 'Maintenance Expert');
    const [customPersona, setCustomPersona] = useState(initialData?.customPersona || '');

    // Parameters
    const [temperature, setTemperature] = useState(initialData?.temperature || '0.7');
    const [maxTokens, setMaxTokens] = useState(initialData?.maxTokens || '2000');
    const [topP, setTopP] = useState(initialData?.topP || '1.0');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            label,
            model,
            customModel: model === 'custom' ? customModel : '',
            task,
            persona: persona === 'Custom' ? customPersona : persona,
            customPersona: persona === 'Custom' ? customPersona : '',
            temperature: parseFloat(temperature),
            maxTokens: parseInt(maxTokens),
            topP: parseFloat(topP),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">AI Agent Configuration</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto flex-1">
                    {/* Basic Configuration */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Basic Configuration</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name *</label>
                                <input
                                    type="text"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder="e.g., Predictive Maintenance Agent"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Persona</label>
                                <select
                                    value={persona}
                                    onChange={(e) => setPersona(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {personas.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                            {persona === 'Custom' && (
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Persona</label>
                                    <input
                                        type="text"
                                        value={customPersona}
                                        onChange={(e) => setCustomPersona(e.target.value)}
                                        placeholder="e.g., Vibration Analysis Specialist"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI Model Selection */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">AI Model</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                                <select
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {aiModels.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>
                            {model === 'custom' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Model Name</label>
                                    <input
                                        type="text"
                                        value={customModel}
                                        onChange={(e) => setCustomModel(e.target.value)}
                                        placeholder="e.g., my-custom-model"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Task Specification */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Task Specification</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prompt / Task Description *
                            </label>
                            <textarea
                                value={task}
                                onChange={(e) => setTask(e.target.value)}
                                rows={6}
                                placeholder="Describe the agent's task in detail. For example:&#10;&#10;Monitor vibration sensor data from the rotary kiln. When vibration exceeds 5mm/s for more than 30 seconds, analyze historical patterns and recommend maintenance actions. Consider equipment age, previous maintenance records, and current operating conditions."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Provide detailed instructions for what the agent should do, including any specific conditions, thresholds, or decision criteria.
                            </p>
                        </div>
                    </div>

                    {/* Model Parameters */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Model Parameters</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Temperature
                                    <span className="text-xs text-gray-500 ml-1">(0.0-2.0)</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="2"
                                    value={temperature}
                                    onChange={(e) => setTemperature(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="mt-1 text-xs text-gray-500">Controls randomness</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Tokens
                                </label>
                                <input
                                    type="number"
                                    step="100"
                                    min="1"
                                    max="8000"
                                    value={maxTokens}
                                    onChange={(e) => setMaxTokens(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="mt-1 text-xs text-gray-500">Maximum response length</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Top P
                                    <span className="text-xs text-gray-500 ml-1">(0.0-1.0)</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="1"
                                    value={topP}
                                    onChange={(e) => setTopP(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="mt-1 text-xs text-gray-500">Nucleus sampling</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        Save Agent
                    </button>
                </div>
            </div>
        </div>
    );
}
