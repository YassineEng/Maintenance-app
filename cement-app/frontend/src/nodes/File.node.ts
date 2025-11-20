/**
 * File Node - File Operations
 * Handles file uploading, reading, and parsing
 */

import {
    INodeType,
    INodeTypeDescription,
    IExecuteFunctions,
    INodeExecutionData,
} from '../types/node.types';

export class FileNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'File',
        name: 'file',
        icon: '📄',
        group: ['input', 'output'],
        version: 1,
        description: 'Read, write, or upload files',
        defaults: {
            name: 'File',
            color: '#F59E0B', // Amber-500
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                options: [
                    { name: 'Read File', value: 'read' },
                    // { name: 'Write File', value: 'write' }, // Future implementation
                ],
                default: 'read',
            },
            {
                displayName: 'File Path',
                name: 'filePath',
                type: 'string',
                default: '',
                placeholder: '/path/to/file.csv',
                description: 'Absolute path to the file',
                required: true,
            },
            {
                displayName: 'Parse CSV',
                name: 'parseCsv',
                type: 'boolean',
                default: false,
                description: 'Automatically parse CSV content into JSON objects',
                displayOptions: {
                    show: {
                        operation: ['read'],
                    },
                },
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        // If no input items, we still want to execute once (source node behavior)
        const iterations = items.length > 0 ? items.length : 1;

        for (let i = 0; i < iterations; i++) {
            const item = items[i] || { json: {} };

            const operation = this.getNodeParameter<string>('operation', i);
            const filePath = this.getNodeParameter<string>('filePath', i);
            const parseCsv = this.getNodeParameter<boolean>('parseCsv', i, false);

            try {
                if (operation === 'read') {
                    // Call backend to read file
                    const response = await this.helpers.request({
                        method: 'GET',
                        url: `http://localhost:3000/files/content`,
                        qs: { path: filePath },
                        json: true,
                    });

                    let content = response.content;
                    let parsedData = null;

                    if (parseCsv && filePath.toLowerCase().endsWith('.csv')) {
                        // Simple CSV parser for demo
                        // In production, use a proper library on backend or frontend
                        const lines = content.split('\n');
                        const headers = lines[0].split(',').map((h: string) => h.trim());
                        parsedData = lines.slice(1).filter((l: string) => l.trim()).map((line: string) => {
                            const values = line.split(',');
                            const obj: Record<string, any> = {};
                            headers.forEach((h: string, idx: number) => {
                                obj[h] = values[idx]?.trim();
                            });
                            return obj;
                        });
                    }

                    if (parsedData) {
                        // If parsed, we might want to output multiple items?
                        // For now, let's output one item with data property
                        returnData.push({
                            json: {
                                ...item.json,
                                fileName: filePath,
                                content: content,
                                data: parsedData
                            },
                            pairedItem: {
                                item: i,
                            },
                        });
                    } else {
                        returnData.push({
                            json: {
                                ...item.json,
                                fileName: filePath,
                                content: content,
                            },
                            pairedItem: {
                                item: i,
                            },
                        });
                    }
                }
            } catch (error: any) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            ...item.json,
                            error: error.message,
                        },
                        pairedItem: {
                            item: i,
                        },
                    });
                } else {
                    throw new Error(`File operation failed: ${error.message}`);
                }
            }
        }

        return this.helpers.prepareOutputData(returnData);
    }
}
