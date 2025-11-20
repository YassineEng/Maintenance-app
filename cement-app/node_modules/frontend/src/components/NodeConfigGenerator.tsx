/**
 * NodeConfigGenerator - Auto-generates configuration UI from node properties
 * Dynamically renders form fields based on node description
 */

import React, { useState, useCallback } from 'react';
import {
    INodeTypeDescription,
    INodeProperties,
    INodeParameters,
    NodePropertyType,
} from '../types/node.types';
import Editor from '@monaco-editor/react';

/**
 * Props for NodeConfigGenerator component
 */
interface NodeConfigGeneratorProps {
    /** Node description containing properties */
    description: INodeTypeDescription;
    /** Current configuration values */
    config: INodeParameters;
    /** Callback when configuration changes */
    onChange: (config: INodeParameters) => void;
    /** Optional CSS class */
    className?: string;
}

/**
 * NodeConfigGenerator Component
 * Renders dynamic configuration UI based on node properties
 */
export default function NodeConfigGenerator({
    description,
    config,
    onChange,
    className = '',
}: NodeConfigGeneratorProps) {
    const [localConfig, setLocalConfig] = useState<INodeParameters>(config);

    /**
     * Handle parameter value change
     */
    const handleChange = useCallback(
        (parameterName: string, value: any) => {
            const newConfig = { ...localConfig, [parameterName]: value };
            setLocalConfig(newConfig);
            onChange(newConfig);
        },
        [localConfig, onChange]
    );

    /**
     * Check if property should be displayed based on display options
     */
    const shouldDisplayProperty = useCallback(
        (property: INodeProperties): boolean => {
            const { displayOptions } = property;
            if (!displayOptions) return true;

            // Check show conditions
            if (displayOptions.show) {
                for (const [key, values] of Object.entries(displayOptions.show)) {
                    const currentValue = localConfig[key];
                    if (!values.includes(currentValue)) {
                        return false;
                    }
                }
            }

            // Check hide conditions
            if (displayOptions.hide) {
                for (const [key, values] of Object.entries(displayOptions.hide)) {
                    const currentValue = localConfig[key];
                    if (values.includes(currentValue)) {
                        return false;
                    }
                }
            }

            return true;
        },
        [localConfig]
    );

    /**
     * Render a single property field
     */
    const renderProperty = useCallback(
        (property: INodeProperties) => {
            if (!shouldDisplayProperty(property)) {
                return null;
            }

            const value = localConfig[property.name] ?? property.default;

            return (
                <div key={property.name} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {property.displayName}
                        {property.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {property.description && (
                        <p className="text-xs text-gray-500 mb-2">{property.description}</p>
                    )}

                    {renderPropertyInput(property, value)}

                    {property.hint && (
                        <p className="text-xs text-gray-400 mt-1 italic">{property.hint}</p>
                    )}
                </div>
            );
        },
        [localConfig, shouldDisplayProperty]
    );

    /**
     * Render property input based on type
     */
    const renderPropertyInput = (property: INodeProperties, value: any) => {
        switch (property.type) {
            case 'string':
                return renderStringInput(property, value);
            case 'number':
                return renderNumberInput(property, value);
            case 'boolean':
                return renderBooleanInput(property, value);
            case 'options':
                return renderOptionsInput(property, value);
            case 'multiOptions':
                return renderMultiOptionsInput(property, value);
            case 'code':
                return renderCodeInput(property, value);
            case 'json':
                return renderJsonInput(property, value);
            case 'color':
                return renderColorInput(property, value);
            case 'dateTime':
                return renderDateTimeInput(property, value);
            case 'collection':
                return renderCollectionInput(property, value);
            case 'hidden':
                return null;
            default:
                return renderStringInput(property, value);
        }
    };

    /**
     * Render string input
     */
    const renderStringInput = (property: INodeProperties, value: string) => {
        const rows = property.typeOptions?.rows || 1;

        if (rows > 1) {
            return (
                <textarea
                    value={value || ''}
                    onChange={(e) => handleChange(property.name, e.target.value)}
                    placeholder={property.placeholder}
                    rows={rows}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            );
        }

        return (
            <input
                type="text"
                value={value || ''}
                onChange={(e) => handleChange(property.name, e.target.value)}
                placeholder={property.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        );
    };

    /**
     * Render number input
     */
    const renderNumberInput = (property: INodeProperties, value: number) => {
        const { minValue, maxValue, numberStepSize } = property.typeOptions || {};

        return (
            <input
                type="number"
                value={value ?? ''}
                onChange={(e) => handleChange(property.name, parseFloat(e.target.value))}
                min={minValue}
                max={maxValue}
                step={numberStepSize || 1}
                placeholder={property.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        );
    };

    /**
     * Render boolean input (checkbox)
     */
    const renderBooleanInput = (property: INodeProperties, value: boolean) => {
        return (
            <label className="flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={value || false}
                    onChange={(e) => handleChange(property.name, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                    {property.placeholder || 'Enable'}
                </span>
            </label>
        );
    };

    /**
     * Render options input (select dropdown)
     */
    const renderOptionsInput = (property: INodeProperties, value: any) => {
        return (
            <select
                value={value || ''}
                onChange={(e) => handleChange(property.name, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="">Select an option...</option>
                {property.options?.map((option) => (
                    <option key={String(option.value)} value={String(option.value)}>
                        {option.name}
                    </option>
                ))}
            </select>
        );
    };

    /**
     * Render multi-options input (multi-select)
     */
    const renderMultiOptionsInput = (property: INodeProperties, value: any[]) => {
        const selectedValues = Array.isArray(value) ? value : [];

        return (
            <div className="space-y-2">
                {property.options?.map((option) => (
                    <label key={String(option.value)} className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedValues.includes(option.value)}
                            onChange={(e) => {
                                const newValues = e.target.checked
                                    ? [...selectedValues, option.value]
                                    : selectedValues.filter((v) => v !== option.value);
                                handleChange(property.name, newValues);
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option.name}</span>
                    </label>
                ))}
            </div>
        );
    };

    /**
     * Render code input (Monaco editor)
     */
    const renderCodeInput = (property: INodeProperties, value: string) => {
        const language = property.typeOptions?.language || 'javascript';

        return (
            <div className="border border-gray-300 rounded-md overflow-hidden">
                <Editor
                    height="300px"
                    language={language}
                    value={value || ''}
                    onChange={(newValue) => handleChange(property.name, newValue || '')}
                    theme="vs-light"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>
        );
    };

    /**
     * Render JSON input
     */
    const renderJsonInput = (property: INodeProperties, value: any) => {
        const jsonString = typeof value === 'string' ? value : JSON.stringify(value, null, 2);

        return (
            <div className="border border-gray-300 rounded-md overflow-hidden">
                <Editor
                    height="200px"
                    language="json"
                    value={jsonString}
                    onChange={(newValue) => {
                        try {
                            const parsed = JSON.parse(newValue || '{}');
                            handleChange(property.name, parsed);
                        } catch (e) {
                            // Keep as string if invalid JSON
                            handleChange(property.name, newValue);
                        }
                    }}
                    theme="vs-light"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
                />
            </div>
        );
    };

    /**
     * Render color input
     */
    const renderColorInput = (property: INodeProperties, value: string) => {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={value || '#000000'}
                    onChange={(e) => handleChange(property.name, e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => handleChange(property.name, e.target.value)}
                    placeholder="#000000"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
        );
    };

    /**
     * Render date/time input
     */
    const renderDateTimeInput = (property: INodeProperties, value: string) => {
        return (
            <input
                type="datetime-local"
                value={value || ''}
                onChange={(e) => handleChange(property.name, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        );
    };

    /**
     * Render collection input (nested properties)
     */
    const renderCollectionInput = (property: INodeProperties, value: any) => {
        return (
            <div className="pl-4 border-l-2 border-gray-200">
                {property.values?.map((subProperty) => renderProperty(subProperty))}
            </div>
        );
    };

    return (
        <div className={`node-config-generator ${className}`}>
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {description.displayName}
                </h3>
                {description.description && (
                    <p className="text-sm text-gray-600 mt-1">{description.description}</p>
                )}
            </div>

            <div className="space-y-4">
                {description.properties.map((property) => renderProperty(property))}
            </div>
        </div>
    );
}
