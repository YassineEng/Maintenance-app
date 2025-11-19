import { useState } from 'react';
import { X } from 'lucide-react';

interface EquipmentConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: any) => void;
    initialData: any;
}

const equipmentTypes = [
    'Jaw Crusher', 'Hammer Crusher', 'Impact Crusher', 'Raw Mill', 'Coal Mill',
    'Rotary Kiln', 'Preheater', 'Precalciner', 'Cooler',
    'Cement Mill', 'Vertical Roller Mill', 'Separator', 'Packer',
    'Conveyor Belt', 'Bucket Elevator', 'Screw Conveyor', 'Pneumatic Conveyor',
    'Compressor', 'ID Fan', 'FD Fan', 'Pump', 'Generator', 'Other'
];

export default function EquipmentConfigModal({ isOpen, onClose, onSave, initialData }: EquipmentConfigModalProps) {
    // Basic Info
    const [label, setLabel] = useState(initialData?.label || '');
    const [equipmentType, setEquipmentType] = useState(initialData?.equipmentType || 'Rotary Kiln');
    const [equipmentId, setEquipmentId] = useState(initialData?.equipmentId || '');

    // Specifications
    const [manufacturer, setManufacturer] = useState(initialData?.manufacturer || '');
    const [model, setModel] = useState(initialData?.model || '');
    const [yearInstalled, setYearInstalled] = useState(initialData?.yearInstalled || '');
    const [capacity, setCapacity] = useState(initialData?.capacity || '');

    // Operating Parameters
    const [ratedPower, setRatedPower] = useState(initialData?.ratedPower || '');
    const [operatingSpeed, setOperatingSpeed] = useState(initialData?.operatingSpeed || '');
    const [temperatureRange, setTemperatureRange] = useState(initialData?.temperatureRange || '');

    // Maintenance
    const [lastServiceDate, setLastServiceDate] = useState(initialData?.lastServiceDate || '');
    const [nextServiceDue, setNextServiceDue] = useState(initialData?.nextServiceDue || '');
    const [serviceInterval, setServiceInterval] = useState(initialData?.serviceInterval || '');

    // Status
    const [status, setStatus] = useState(initialData?.status || 'Running');
    const [operatingHours, setOperatingHours] = useState(initialData?.operatingHours || '');
    const [efficiency, setEfficiency] = useState(initialData?.efficiency || '');

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            label,
            equipmentType,
            equipmentId,
            manufacturer,
            model,
            yearInstalled,
            capacity,
            ratedPower,
            operatingSpeed,
            temperatureRange,
            lastServiceDate,
            nextServiceDue,
            serviceInterval,
            status,
            operatingHours,
            efficiency,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Equipment Configuration</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto flex-1">
                    {/* Basic Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name *</label>
                                <input
                                    type="text"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder="e.g., Kiln #1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Type *</label>
                                <select
                                    value={equipmentType}
                                    onChange={(e) => setEquipmentType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {equipmentTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment ID</label>
                                <input
                                    type="text"
                                    value={equipmentId}
                                    onChange={(e) => setEquipmentId(e.target.value)}
                                    placeholder="e.g., KLN-001"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Specifications</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                                <input
                                    type="text"
                                    value={manufacturer}
                                    onChange={(e) => setManufacturer(e.target.value)}
                                    placeholder="e.g., FLSmidth"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                <input
                                    type="text"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    placeholder="e.g., ILC 4000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year Installed</label>
                                <input
                                    type="number"
                                    value={yearInstalled}
                                    onChange={(e) => setYearInstalled(e.target.value)}
                                    placeholder="e.g., 2018"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                <input
                                    type="text"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    placeholder="e.g., 3000 TPD"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Operating Parameters */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Operating Parameters</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rated Power</label>
                                <input
                                    type="text"
                                    value={ratedPower}
                                    onChange={(e) => setRatedPower(e.target.value)}
                                    placeholder="e.g., 850 kW"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Operating Speed</label>
                                <input
                                    type="text"
                                    value={operatingSpeed}
                                    onChange={(e) => setOperatingSpeed(e.target.value)}
                                    placeholder="e.g., 3.5 RPM"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature Range</label>
                                <input
                                    type="text"
                                    value={temperatureRange}
                                    onChange={(e) => setTemperatureRange(e.target.value)}
                                    placeholder="e.g., 1400-1450°C"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Maintenance */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Maintenance Schedule</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Service Date</label>
                                <input
                                    type="date"
                                    value={lastServiceDate}
                                    onChange={(e) => setLastServiceDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Next Service Due</label>
                                <input
                                    type="date"
                                    value={nextServiceDue}
                                    onChange={(e) => setNextServiceDue(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Interval</label>
                                <input
                                    type="text"
                                    value={serviceInterval}
                                    onChange={(e) => setServiceInterval(e.target.value)}
                                    placeholder="e.g., 6 months"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Status & Performance */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Status & Performance</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Running">Running</option>
                                    <option value="Stopped">Stopped</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Error">Error</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
                                <input
                                    type="text"
                                    value={operatingHours}
                                    onChange={(e) => setOperatingHours(e.target.value)}
                                    placeholder="e.g., 45,230 hrs"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Efficiency</label>
                                <input
                                    type="text"
                                    value={efficiency}
                                    onChange={(e) => setEfficiency(e.target.value)}
                                    placeholder="e.g., 92%"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
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
                        Save Equipment
                    </button>
                </div>
            </div>
        </div>
    );
}
