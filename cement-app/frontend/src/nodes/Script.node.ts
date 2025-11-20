/**
 * Script Node - Execute Python or JavaScript code
 * Pilot implementation demonstrating n8n-style node architecture
 */

import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    INodeExecutionData,
} from '../types/node.types';

/**
 * Script Node Class
 * Executes custom code (Python or JavaScript) with virtual environment support
 */
export class ScriptNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Code',
        name: 'script',
        icon: '⚡',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["language"]}}',
        description: 'Execute Python or JavaScript code with package management',
        defaults: {
            name: 'Code',
            color: '#FF6B6B',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Language',
                name: 'language',
                type: 'options',
                options: [
                    {
                        name: 'Python',
                        value: 'python',
                        description: 'Execute Python code with uv package manager',
                    },
                    {
                        name: 'JavaScript',
                        value: 'javascript',
                        description: 'Execute JavaScript code with Node.js',
                    },
                ],
                default: 'python',
                description: 'Programming language to use',
            },
            {
                displayName: 'Code',
                name: 'code',
                type: 'code',
                typeOptions: {
                    editor: 'code',
                    language: 'python',
                },
                default: '# Write your Python code here\n# Access input data via items variable\n\nfor item in items:\n    print(item)\n\n# Return modified items\nreturn items',
                required: true,
                description: 'Code to execute. Input data is available as "items" variable.',
                hint: 'Use "items" to access input data, return modified items at the end',
            },
            {
                displayName: 'Packages',
                name: 'packages',
                type: 'string',
                default: '',
                placeholder: 'pandas, numpy, requests',
                description: 'Comma-separated list of packages to install (Python only)',
                displayOptions: {
                    show: {
                        language: ['python'],
                    },
                },
                hint: 'Packages will be installed using uv package manager',
            },
            {
                displayName: 'Continue On Fail',
                name: 'continueOnFail',
                type: 'boolean',
                default: false,
                description: 'Continue workflow execution even if this node fails',
            },
        ],
    };

    /**
     * Execute the script node
     * @param this - Execution context
     * @returns Execution result
     */
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        // Get node parameters
        const language = this.getNodeParameter<string>('language', 0);
        const code = this.getNodeParameter<string>('code', 0);
        const packages = this.getNodeParameter<string>('packages', 0, '');
        const continueOnFail = this.getNodeParameter<boolean>('continueOnFail', 0, false);

        try {
            // Get current node for ID
            const node = this.getNode();

            // Prepare request to backend
            const requestBody = {
                nodeId: node.id,
                code,
                language,
                packages: packages ? packages.split(',').map(p => p.trim()).filter(p => p) : [],
                inputItems: items.map(item => item.json),
            };

            // Execute code via backend API
            const response = await this.helpers.request({
                method: 'POST',
                url: 'http://localhost:3000/script/run',
                body: requestBody,
                json: true,
            });

            // Check for execution errors
            if (!response.success) {
                throw new Error(response.error || 'Script execution failed');
            }

            // Process output
            if (response.output) {
                // If output is an array, map it to items
                if (Array.isArray(response.output)) {
                    response.output.forEach((outputItem: any, index: number) => {
                        returnData.push({
                            json: {
                                ...items[index]?.json,
                                output: outputItem,
                            },
                            pairedItem: {
                                item: index,
                            },
                        });
                    });
                } else {
                    // Single output - attach to all items
                    items.forEach((item, index) => {
                        returnData.push({
                            json: {
                                ...item.json,
                                output: response.output,
                            },
                            pairedItem: {
                                item: index,
                            },
                        });
                    });
                }
            } else {
                // No output - return original items
                returnData.push(...items);
            }

            return this.helpers.prepareOutputData(returnData);
        } catch (error: any) {
            if (continueOnFail) {
                // Return error in output
                items.forEach((item, index) => {
                    returnData.push({
                        json: {
                            ...item.json,
                            error: error.message,
                        },
                        pairedItem: {
                            item: index,
                        },
                    });
                });
                return this.helpers.prepareOutputData(returnData);
            }

            // Re-throw error to stop workflow
            throw new Error(`Script execution failed: ${error.message}`);
        }
    }
}
