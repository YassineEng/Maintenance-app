import { useState } from 'react';
import { X, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';

interface EnvConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: any) => void;
    initialData?: any;
}

interface CustomKey {
    id: string;
    name: string;
    value: string;
}

export default function EnvConfigModal({ isOpen, onClose, onSave, initialData }: EnvConfigModalProps) {
    const [openaiKey, setOpenaiKey] = useState(initialData?.openaiKey || '');
    const [anthropicKey, setAnthropicKey] = useState(initialData?.anthropicKey || '');
    const [customKeys, setCustomKeys] = useState<CustomKey[]>(initialData?.customKeys || []);

    const [showOpenai, setShowOpenai] = useState(false);
    const [showAnthropic, setShowAnthropic] = useState(false);
    const [showCustom, setShowCustom] = useState<{ [key: string]: boolean }>({});

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            openaiKey,
            anthropicKey,
            customKeys,
        });
        onClose();
    };

    const addCustomKey = () => {
        const newKey: CustomKey = {
            id: Date.now().toString(),
            name: '',
            value: '',
        };
        setCustomKeys([...customKeys, newKey]);
    };

    const updateCustomKey = (id: string, field: 'name' | 'value', value: string) => {
        setCustomKeys(customKeys.map(key =>
            key.id === id ? { ...key, [field]: value } : key
        ));
    };

    const removeCustomKey = (id: string) => {
        setCustomKeys(customKeys.filter(key => key.id !== id));
    };

    const toggleShowCustom = (id: string) => {
        setShowCustom({ ...showCustom, [id]: !showCustom[id] });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Environment Configuration</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto flex-1">
                    {/* Warning */}
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            <strong>⚠️ Security Warning:</strong> API keys are sensitive. In production, use environment variables or secure key management systems.
                        </p>
                    </div>

                    {/* OpenAI API Key */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            OpenAI API Key
                        </label>
                        <div className="relative">
                            <input
                                type={showOpenai ? 'text' : 'password'}
                                value={openaiKey}
                                onChange={(e) => setOpenaiKey(e.target.value)}
                                placeholder="sk-..."
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOpenai(!showOpenai)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showOpenai ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Anthropic API Key */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Anthropic API Key
                        </label>
                        <div className="relative">
                            <input
                                type={showAnthropic ? 'text' : 'password'}
                                value={anthropicKey}
                                onChange={(e) => setAnthropicKey(e.target.value)}
                                placeholder="sk-ant-..."
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowAnthropic(!showAnthropic)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showAnthropic ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Custom API Keys */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Custom API Keys
                            </label>
                            <button
                                onClick={addCustomKey}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                            >
                                <Plus size={16} />
                                Add Key
                            </button>
                        </div>

                        {customKeys.map((key) => (
                            <div key={key.id} className="mb-3 p-3 border border-gray-200 rounded-lg">
                                <div className="grid grid-cols-2 gap-3 mb-2">
                                    <input
                                        type="text"
                                        value={key.name}
                                        onChange={(e) => updateCustomKey(key.id, 'name', e.target.value)}
                                        placeholder="Key name (e.g., CUSTOM_API_KEY)"
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                    <div className="relative">
                                        <input
                                            type={showCustom[key.id] ? 'text' : 'password'}
                                            value={key.value}
                                            onChange={(e) => updateCustomKey(key.id, 'value', e.target.value)}
                                            placeholder="API key value"
                                            className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => toggleShowCustom(key.id)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                {showCustom[key.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeCustomKey(key.id)}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {customKeys.length === 0 && (
                            <p className="text-sm text-gray-500 italic">No custom keys added yet.</p>
                        )}
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
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}
