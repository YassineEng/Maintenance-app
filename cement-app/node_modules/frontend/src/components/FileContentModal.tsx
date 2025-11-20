import { useState, useEffect } from 'react';
import { X, FileText, Loader2 } from 'lucide-react';
import { fileService } from '../services/file.service';

interface FileContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    filePath: string | null;
    fileName: string | null;
}

export default function FileContentModal({ isOpen, onClose, filePath, fileName }: FileContentModalProps) {
    const [content, setContent] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && filePath) {
            loadContent(filePath);
        } else {
            setContent('');
            setError(null);
        }
    }, [isOpen, filePath]);

    const loadContent = async (path: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fileService.getFileContent(path);
            setContent(data);
        } catch (err) {
            console.error('Failed to load file content:', err);
            setError('Failed to load file content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (!content) return <span className="text-gray-400 italic">File is empty</span>;

        try {
            // Try to parse as JSON (for Excel files)
            const jsonData = JSON.parse(content);
            if (Array.isArray(jsonData) && Array.isArray(jsonData[0])) {
                return (
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jsonData.map((row: any[], rowIndex: number) => (
                                <tr key={rowIndex} className={rowIndex === 0 ? 'bg-gray-50 font-medium' : ''}>
                                    {row.map((cell: any, cellIndex: number) => (
                                        <td
                                            key={cellIndex}
                                            className="px-4 py-2 text-sm text-gray-700 border-r border-gray-200 last:border-r-0 whitespace-nowrap"
                                        >
                                            {cell !== null && cell !== undefined ? String(cell) : ''}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            }
        } catch (e) {
            // Not JSON, render as text
        }

        return (
            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-words p-4">
                {content}
            </pre>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-[800px] max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">{fileName || 'File Content'}</h2>
                            <p className="text-xs text-gray-500 font-mono">{filePath}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden p-0 bg-gray-50 relative flex flex-col">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-2 text-purple-500" />
                            <p className="text-sm">Loading content...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full text-red-500">
                            <p className="font-medium">{error}</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-auto w-full h-full">
                            {renderContent()}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex justify-end bg-white rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
