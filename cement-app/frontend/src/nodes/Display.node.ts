/**
 * Display Node - Visual Output
 * Renders input data for inspection. Pass-through node.
 */

import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    INodeExecutionData,
} from '../types/node.types';

export class DisplayNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Display',
        name: 'display',
        icon: '🖥️',
        group: ['output'],
        version: 1,
        description: 'Inspect data flow and display results',
        defaults: {
            name: 'Display',
            color: '#6B7280', // Gray-500
        },
        inputs: ['main'],
        outputs: ['main'], // Pass-through
        properties: [
            {
                displayName: 'Title',
                name: 'title',
                type: 'string',
                default: 'Output',
                description: 'Label for the display',
            },
            {
                displayName: 'Mode',
                name: 'mode',
                type: 'options',
                options: [
                    { name: 'JSON', value: 'json' },
                    { name: 'Table', value: 'table' },
                    { name: 'Text', value: 'text' },
                ],
                default: 'json',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();

        // Display node is mostly for UI, but in execution it just passes data through
        // It could potentially log data or send it to a specific UI endpoint

        // In the new architecture, the execution result is what's displayed
        // So we just return the items as is

        return this.helpers.prepareOutputData(items);
    }
}
