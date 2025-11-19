import { X } from 'lucide-react';

interface DisplayConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: any;
}

export default function DisplayConfigModal({ isOpen, onClose, initialData }: DisplayConfigModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[600px] h-[400px] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Display Node Output</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto">
                    <pre className="text-sm bg-gray-100 p-4 rounded-md whitespace-pre-wrap">
                        {initialData?.output || 'No output to display.'}
                    </pre>
                </div>
                <div className="p-4 border-t border-gray-200 flex justify-end bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
