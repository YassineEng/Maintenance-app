/**
 * Env Node - Environment Variables & Credentials
 * Provides API keys and configuration to connected nodes
 */

import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    INodeExecutionData,
} from '../types/node.types';

export class EnvNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: '.env',
        name: 'env',
        icon: '🔑',
        group: ['config'],
        version: 1,
        description: 'Provide API keys and environment variables',
        defaults: {
            name: '.env',
            color: '#10B981', // Emerald-500
        },
        inputs: [], // Env node usually starts a branch or merges in
        outputs: ['main'],
        properties: [
            {
                displayName: 'Gemini API Key',
                name: 'geminiKey',
                type: 'string',
                typeOptions: {
                    password: true, // Hint for UI to mask input (custom property needed in generator)
                },
                default: '',
                placeholder: 'AIza...',
                description: 'Google Gemini API Key',
            },
            {
                displayName: 'OpenAI API Key',
                name: 'openaiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                placeholder: 'sk-...',
                description: 'OpenAI API Key',
            },
            {
                displayName: 'Anthropic API Key',
                name: 'anthropicKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                placeholder: 'sk-ant-...',
                description: 'Anthropic API Key',
            },
            {
                displayName: 'Custom Variables',
                name: 'customVars',
                type: 'fixedCollection',
                default: {},
                placeholder: 'Add Variable',
                typeOptions: {
                    multipleValues: true,
                },
                options: [
                    {
                        name: 'variable',
                        displayName: 'Variable',
                        values: [
                            {
                                displayName: 'Name',
                                name: 'name',
                                type: 'string',
                                default: '',
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                            },
                        ],
                    },
                ],
                description: 'Additional environment variables',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        // Env node acts as a source or enrichment
        // It outputs a single item containing all configured keys

        const geminiKey = this.getNodeParameter<string>('geminiKey', 0, '');
        const openaiKey = this.getNodeParameter<string>('openaiKey', 0, '');
        const anthropicKey = this.getNodeParameter<string>('anthropicKey', 0, '');
        const customVars = this.getNodeParameter<any>('customVars', 0, {});

        const outputJson: Record<string, any> = {
            geminiKey,
            openaiKey,
            anthropicKey,
        };

        // Process custom variables
        if (customVars.variable) {
            customVars.variable.forEach((v: any) => {
                if (v.name) {
                    outputJson[v.name] = v.value;
                }
            });
        }

        // If there are inputs, we merge with them (enrichment)
        // If no inputs, we just output the keys (source)
        const items = this.getInputData();

        if (items.length > 0) {
            const returnData = items.map((item, index) => ({
                json: {
                    ...item.json,
                    ...outputJson,
                },
                pairedItem: {
                    item: index,
                },
            }));
            return this.helpers.prepareOutputData(returnData);
        } else {
            // No input, just output the keys as one item
            return this.helpers.prepareOutputData([{
                json: outputJson,
            }]);
        }
    }
}
