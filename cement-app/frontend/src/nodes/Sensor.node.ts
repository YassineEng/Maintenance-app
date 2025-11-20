/**
 * Sensor Node - Enriches data with sensor metadata
 * Adds sensor configuration to the data stream
 */

import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    INodeExecutionData,
} from '../types/node.types';

export class SensorNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Sensor',
        name: 'sensor',
        icon: '📡',
        group: ['industrial', 'monitoring'],
        version: 1,
        description: 'Define sensor parameters and thresholds',
        defaults: {
            name: 'Sensor',
            color: '#8B5CF6', // Violet-500
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Sensor ID',
                name: 'sensorId',
                type: 'string',
                default: '',
                placeholder: 'TEMP-01',
                description: 'Unique identifier for the sensor',
                required: true,
            },
            {
                displayName: 'Unit',
                name: 'unit',
                type: 'string',
                default: '°C',
                placeholder: '°C, bar, rpm',
                description: 'Unit of measurement',
            },
            {
                displayName: 'Min Threshold',
                name: 'min',
                type: 'number',
                default: 0,
                description: 'Minimum acceptable value',
            },
            {
                displayName: 'Max Threshold',
                name: 'max',
                type: 'number',
                default: 100,
                description: 'Maximum acceptable value',
            },
            {
                displayName: 'Simulate Value',
                name: 'simulate',
                type: 'boolean',
                default: false,
                description: 'Generate a random value within range for testing',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            const sensorId = this.getNodeParameter<string>('sensorId', i);
            const unit = this.getNodeParameter<string>('unit', i, '');
            const min = this.getNodeParameter<number>('min', i, 0);
            const max = this.getNodeParameter<number>('max', i, 100);
            const simulate = this.getNodeParameter<boolean>('simulate', i, false);

            const sensorData: any = {
                sensorId,
                unit,
                thresholds: {
                    min,
                    max
                }
            };

            // Optional simulation logic for testing
            if (simulate) {
                const range = max - min;
                const randomValue = min + (Math.random() * range);
                sensorData.value = parseFloat(randomValue.toFixed(2));
                sensorData.timestamp = new Date().toISOString();
            }

            returnData.push({
                json: {
                    ...item.json,
                    ...sensorData,
                    sensor: sensorData
                },
                pairedItem: {
                    item: i,
                },
            });
        }

        return this.helpers.prepareOutputData(returnData);
    }
}
