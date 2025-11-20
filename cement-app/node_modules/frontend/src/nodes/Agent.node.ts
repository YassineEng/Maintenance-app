/**
 * Agent Node - Google Gemini AI Integration
 * Executes AI prompts using configured models and credentials
 */

import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    INodeExecutionData,
} from '../types/node.types';

export class AgentNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'AI Agent',
        name: 'agent',
        icon: '🤖',
        group: ['ai'],
        version: 1,
        subtitle: '={{$parameter["model"]}}',
        description: 'Generate content using Google Gemini AI',
        defaults: {
            name: 'AI Agent',
            color: '#4F46E5', // Indigo-600
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Model',
                name: 'model',
                type: 'options',
                options: [
                    { name: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
                    { name: 'Gemini 2.0 Flash Exp', value: 'gemini-2.0-flash-exp' },
                    { name: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
                    { name: 'Gemini 1.5 Flash', value: 'gemini-1.5-flash' },
                ],
                default: 'gemini-2.5-flash',
                description: 'The AI model to use for generation',
            },
            {
                displayName: 'System Persona',
                name: 'persona',
                type: 'string',
                typeOptions: {
                    rows: 3,
                },
                default: 'You are a helpful maintenance expert assistant.',
                description: 'Defines the personality and role of the agent',
            },
            {
                displayName: 'Task / Prompt',
                name: 'task',
                type: 'string',
                typeOptions: {
                    rows: 4,
                },
                default: '',
                description: 'The specific task or prompt for the agent. Can use input data.',
            },
            {
                displayName: 'Temperature',
                name: 'temperature',
                type: 'number',
                typeOptions: {
                    minValue: 0,
                    maxValue: 1,
                    numberStepSize: 0.1,
                },
                default: 0.7,
                description: 'Controls randomness: 0 is focused, 1 is creative',
            },
            {
                displayName: 'Max Tokens',
                name: 'maxTokens',
                type: 'number',
                default: 2000,
                description: 'Maximum length of the generated response',
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        // Get parameters
        const model = this.getNodeParameter<string>('model', 0);
        const persona = this.getNodeParameter<string>('persona', 0);
        const task = this.getNodeParameter<string>('task', 0);
        const temperature = this.getNodeParameter<number>('temperature', 0);
        const maxTokens = this.getNodeParameter<number>('maxTokens', 0);

        // In the current architecture, credentials come from connected Env nodes
        // We'll look for a 'geminiKey' in the input data
        // This assumes the Env node merges its data into the stream

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const inputJson = item.json;

            // Try to find API key in input data (from Env node)
            const apiKey = inputJson.geminiKey || inputJson.GEMINI_API_KEY;

            if (!apiKey) {
                throw new Error('Gemini API Key not found. Please connect an .env node with the key configured.');
            }

            try {
                // Construct the prompt
                // If 'task' is empty, we might use the input 'output' or 'message'
                let prompt = task;
                if (!prompt && inputJson.output) {
                    prompt = typeof inputJson.output === 'string' ? inputJson.output : JSON.stringify(inputJson.output);
                }

                if (!prompt) {
                    throw new Error('No prompt provided. Please set a Task or provide input data.');
                }

                // Call Backend API
                const response = await this.helpers.request({
                    method: 'POST',
                    url: 'http://localhost:3000/gemini/generate',
                    body: {
                        model,
                        prompt,
                        systemInstruction: persona,
                        apiKey, // Pass key explicitly as backend expects it or env var
                        config: {
                            temperature,
                            maxOutputTokens: maxTokens,
                        }
                    },
                    json: true,
                });

                returnData.push({
                    json: {
                        ...inputJson,
                        output: response.text || response.output || response,
                        modelUsed: model
                    },
                    pairedItem: {
                        item: i,
                    },
                });

            } catch (error: any) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            ...inputJson,
                            error: error.message,
                        },
                        pairedItem: {
                            item: i,
                        },
                    });
                } else {
                    throw new Error(`Gemini AI execution failed: ${error.message}`);
                }
            }
        }

        return this.helpers.prepareOutputData(returnData);
    }
}
