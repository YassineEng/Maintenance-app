import { useState } from 'react';
import { X, Play, Download, Loader2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { scriptService } from '../services/script.service';

interface ScriptConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: any) => void;
    initialData: any;
    nodeId: string;
    onRunScript: (nodeId: string, code: string) => Promise<void>;
}

export default function ScriptConfigModal({ isOpen, onClose, onSave, initialData, nodeId, onRunScript }: ScriptConfigModalProps) {
    const [label, setLabel] = useState(initialData?.label || '');
    const [code, setCode] = useState(initialData?.code || '');
    const [language, setLanguage] = useState(initialData?.language || 'python');
    const [packages, setPackages] = useState(initialData?.packages || '');
    const [isInstalling, setIsInstalling] = useState(false);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ label, code, language, packages });
        onClose();
    };

    const handleInstallPackages = async () => {
        if (!packages.trim() || !nodeId) return;
        setIsInstalling(true);
        try {
            const pkgList = packages.split(',').map((p: string) => p.trim()).filter((p: string) => p);
            await scriptService.installPackages(nodeId, pkgList);
            alert('Packages installed successfully.');
        } catch (error: any) {
            console.error('Failed to install packages', error);
            alert(`Error installing packages: ${error.message}`);
        } finally {
            setIsInstalling(false);
        }
    };

    const handleRunScript = async () => {
        if (!code.trim() || !nodeId) return;
        await onRunScript(nodeId, code);
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onKeyDown={(e) => e.stopPropagation()}
        >
            <div className="bg-white rounded-lg shadow-xl w-[900px] h-[600px] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Configure Code Node</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Script Name</label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="e.g., Data Processing"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="python">Python</option>
                                <option value="javascript">JavaScript</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Packages (uv add) <span className="text-gray-400 font-normal text-xs ml-2">Comma separated, e.g., pandas, numpy</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={packages}
                                onChange={(e) => setPackages(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="pandas, numpy, scikit-learn"
                            />
                            <button
                                onClick={handleInstallPackages}
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!nodeId || isInstalling || !packages.trim()}
                                title={!nodeId ? "Save the node first to install packages" : "Install packages"}
                            >
                                {isInstalling ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                {isInstalling ? 'Installing...' : 'Install'}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 border border-gray-300 rounded-md overflow-hidden flex flex-col">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 flex justify-between items-center">
                            <span className="text-xs font-mono text-gray-500">main.py</span>
                            <button
                                onClick={handleRunScript}
                                className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!nodeId}
                                title={!nodeId ? "Save the node first to run code" : "Run code"}
                            >
                                <Play size={14} />
                                Run Code
                            </button>
                        </div>
                        <Editor
                            height="100%"
                            defaultLanguage={language}
                            language={language}
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                scrollBeyondLastLine: false,
                            }}
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 flex gap-2 justify-end bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}
