/**
 * Equipment Node - Defines equipment metadata
 * Source node that outputs equipment details
 */

import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    INodeExecutionData,
} from '../types/node.types';

export class EquipmentNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Equipment',
        name: 'equipment',
        icon: '🏭',
        group: ['industrial', 'source'],
        version: 1,
        description: 'Define equipment metadata and start workflow',
        defaults: {
            name: 'Equipment',
            color: '#3B82F6', // Blue-500
        },
        inputs: ['main'], // Can be a source or pass-through
        outputs: ['main'],
        properties: [
            {
                displayName: 'Functional Location',
                name: 'floc',
                type: 'string',
                default: '',
                placeholder: 'KILN-01-MAIN',
                description: 'Functional location identifier',
                required: true,
            },
            {
                displayName: 'Serial Number',
                name: 'serial',
                type: 'string',
                default: '',
                placeholder: 'SN-12345678',
                description: 'Equipment serial number',
            },
            {
                displayName: 'Type',
                name: 'equipmentType',
                type: 'options',
                options: [
                    { name: 'Rotary Kiln', value: 'Rotary Kiln' },
                    { name: 'Ball Mill', value: 'Ball Mill' },
                    { name: 'Crusher', value: 'Crusher' },
                    { name: 'Conveyor', value: 'Conveyor' },
                    { name: 'Fan', value: 'Fan' },
                    { name: 'Pump', value: 'Pump' },
                ],
                default: 'Rotary Kiln',
                description: 'Type of equipment',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        // Get parameters
        // Since this is often a source node, we might only have one set of parameters
        // But if it has inputs, we should iterate

        const iterations = items.length > 0 ? items.length : 1;

        for (let i = 0; i < iterations; i++) {
            const item = items[i] || { json: {} };

            const floc = this.getNodeParameter<string>('floc', i);
            const serial = this.getNodeParameter<string>('serial', i, '');
            const equipmentType = this.getNodeParameter<string>('equipmentType', i);

            // Create equipment data object
            const equipmentData = {
                functionalLocation: floc,
                serialNumber: serial,
                equipmentType: equipmentType,
                timestamp: new Date().toISOString(),
            };

            // Merge with existing data if any
            returnData.push({
                json: {
                    ...item.json,
                    ...equipmentData,
                    // Also nest it under 'equipment' key for cleaner structure downstream
                    equipment: equipmentData
                },
                pairedItem: {
                    item: i,
                },
            });
        }

        return this.helpers.prepareOutputData(returnData);
    }
}
