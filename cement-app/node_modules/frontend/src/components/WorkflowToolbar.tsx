import { Save, Share2, Play } from 'lucide-react';

interface WorkflowToolbarProps {
    workflowName: string;
    isActive: boolean;
    onWorkflowNameChange: (name: string) => void;
    onActiveToggle: () => void;
    onSave: () => void;
    onTest: () => void;
}

export default function WorkflowToolbar({
    workflowName,
    isActive,
    onWorkflowNameChange,
    onActiveToggle,
    onSave,
    onTest,
}: WorkflowToolbarProps) {
    return (
        <div className="bg-gray-100 border-b border-gray-300 px-6 py-3 flex items-center justify-between">
            {/* Left Section - Workflow Name */}
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => onWorkflowNameChange(e.target.value)}
                    className="text-lg font-medium bg-transparent border-none outline-none focus:bg-white focus:px-2 focus:py-1 focus:rounded transition-all"
                    placeholder="My workflow"
                />
                <span className="text-sm text-gray-500">+ Add tag</span>
            </div>

            {/* Right Section - Controls */}
            <div className="flex items-center gap-3">
                {/* Active/Inactive Toggle */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                        onClick={onActiveToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>

                {/* Share Button */}
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2">
                    <Share2 size={16} />
                    Share
                </button>

                {/* Save Button */}
                <button
                    onClick={onSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 flex items-center gap-2"
                >
                    <Save size={16} />
                    Save
                </button>

                {/* Test Workflow Button */}
                <button
                    onClick={onTest}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 flex items-center gap-2"
                >
                    <Play size={16} />
                    Test workflow
                </button>
            </div>
        </div>
    );
}
