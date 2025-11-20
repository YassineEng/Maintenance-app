/**
 * Alert Node - Evaluates conditions and triggers alerts
 * Logic node for monitoring thresholds
 */

import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    INodeExecutionData,
} from '../types/node.types';

export class AlertNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Alert',
        name: 'alert',
        icon: '🚨',
        group: ['industrial', 'logic'],
        version: 1,
        description: 'Trigger alerts based on conditions',
        defaults: {
            name: 'Alert',
            color: '#EF4444', // Red-500
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Alert Name',
                name: 'alertName',
                type: 'string',
                default: '',
                placeholder: 'High Temperature Warning',
                description: 'Name of the alert',
                required: true,
            },
            {
                displayName: 'Condition',
                name: 'condition',
                type: 'options',
                options: [
                    { name: 'Value > Threshold', value: 'gt' },
                    { name: 'Value < Threshold', value: 'lt' },
                    { name: 'Value = Threshold', value: 'eq' },
                ],
                default: 'gt',
                description: 'Condition to evaluate',
            },
            {
                displayName: 'Value Field',
                name: 'valueField',
                type: 'string',
                default: 'value',
                description: 'Field name in input data to check (e.g., "value" or "sensor.value")',
            },
            {
                displayName: 'Threshold',
                name: 'threshold',
                type: 'number',
                default: 0,
                description: 'Threshold value for comparison',
            },
            {
                displayName: 'Severity',
                name: 'severity',
                type: 'options',
                options: [
                    { name: 'Low', value: 'low' },
                    { name: 'Medium', value: 'medium' },
                    { name: 'High', value: 'high' },
                    { name: 'Critical', value: 'critical' },
                ],
                default: 'medium',
                description: 'Severity level of the alert',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            const alertName = this.getNodeParameter<string>('alertName', i);
            const condition = this.getNodeParameter<string>('condition', i);
            const valueField = this.getNodeParameter<string>('valueField', i, 'value');
            const threshold = this.getNodeParameter<number>('threshold', i);
            const severity = this.getNodeParameter<string>('severity', i);

            // Resolve value from nested path if needed
            const getValue = (obj: any, path: string) => {
                return path.split('.').reduce((acc, part) => acc && acc[part], obj);
            };

            const value = getValue(item.json, valueField);
            let triggered = false;

            if (typeof value === 'number') {
                switch (condition) {
                    case 'gt':
                        triggered = value > threshold;
                        break;
                    case 'lt':
                        triggered = value < threshold;
                        break;
                    case 'eq':
                        triggered = value === threshold;
                        break;
                }
            }

            const alertData = {
                alertName,
                triggered,
                severity,
                timestamp: new Date().toISOString(),
                details: triggered ? `Alert "${alertName}" triggered: ${value} ${condition} ${threshold}` : 'Normal',
            };

            returnData.push({
                json: {
                    ...item.json,
                    alert: alertData,
                    // Flattened for easier access
                    alertTriggered: triggered,
                    alertSeverity: severity,
                    alertMessage: alertData.details
                },
                pairedItem: {
                    item: i,
                },
            });
        }

        return this.helpers.prepareOutputData(returnData);
    }
}
