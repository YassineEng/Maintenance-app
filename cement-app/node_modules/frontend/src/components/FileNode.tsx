import { memo, useCallback, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FileUp, FileText, FolderOpen, X } from 'lucide-react';
import { fileService } from '../services/file.service';
import { NodeActionsToolbar } from './NodeActionsToolbar';

const FileNode = ({ data, id, selected }: NodeProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [fileInfo, setFileInfo] = useState<{ name: string; size: number; path: string } | null>(data?.fileInfo || null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            await uploadFile(file);
        }
    }, [id]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadFile(file);
        }
    };

    const uploadFile = async (file: File) => {
        setUploadStatus('uploading');
        try {
            const result = await fileService.uploadFile(file);
            const newFileInfo = {
                name: result.originalname,
                size: result.size,
                path: result.path
            };
            setFileInfo(newFileInfo);
            // Update node data so it persists
            data.fileInfo = newFileInfo;
            data.label = result.originalname; // Update label for consistency
            setUploadStatus('success');

            // Notify parent
            if (data.onUploadComplete) {
                data.onUploadComplete(id, newFileInfo);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadStatus('error');
        }
    };

    const handleClear = () => {
        setFileInfo(null);
        setUploadStatus('idle');
        if (data) {
            data.fileInfo = null;
            data.label = 'File Node';

            // Notify parent of clear
            if (data.onUploadComplete) {
                data.onUploadComplete(id, null);
            }
        }
    };

    const openFilePicker = () => {
        document.getElementById(`file-input-${id}`)?.click();
    };

    return (
        <div
            className={`relative group rounded-lg border-2 bg-white min-w-[200px] transition-all duration-200 
                ${uploadStatus === 'success' ? 'border-green-500 shadow-md' :
                    selected ? 'border-purple-500 shadow-lg' : 'border-gray-200 hover:border-purple-300'} 
                ${isDragging ? 'border-purple-500 bg-purple-50' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <NodeActionsToolbar
                isVisible={isHovered}
                onDelete={data.onDelete ? () => data.onDelete(id) : undefined}
                onDuplicate={data.onDuplicate ? () => data.onDuplicate(id, data) : undefined}
            >
                <button
                    onClick={openFilePicker}
                    className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                    title="Open File"
                >
                    <FolderOpen size={14} />
                </button>
                <button
                    onClick={handleClear}
                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Clear Content"
                >
                    <X size={14} />
                </button>
            </NodeActionsToolbar>

            <div className="p-4">
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className={`p-3 rounded-full ${fileInfo ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                        {fileInfo ? <FileText size={24} /> : <FileUp size={24} />}
                    </div>

                    <div className="text-center">
                        <h3 className="font-medium text-gray-900 text-sm truncate max-w-[180px]">
                            {fileInfo ? fileInfo.name : 'Drop file here'}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {fileInfo ? `${(fileInfo.size / 1024).toFixed(1)} KB` : 'or use toolbar to browse'}
                        </p>
                        {uploadStatus === 'uploading' && <p className="text-xs text-purple-600 mt-1 animate-pulse">Uploading...</p>}
                        {uploadStatus === 'error' && <p className="text-xs text-red-600 mt-1">Upload failed</p>}
                    </div>

                    <input
                        id={`file-input-${id}`}
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".csv,.xls,.xlsx,.txt"
                    />
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className="w-3 h-3 bg-purple-500 border-2 border-white"
            />
        </div>
    );
};

export default memo(FileNode);
