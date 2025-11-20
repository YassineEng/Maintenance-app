/**
 * NodeExecutor - Executes nodes with proper context and error handling
 * Provides the runtime environment for node execution
 */

import axios from 'axios';
import {
    INodeExecutionData,
    IExecuteFunctions,
    INode,
    IWorkflow,
    INodeParameters,
    ICredentialsDecrypted,
    IExecutionHelpers,
    IHttpRequestOptions,
    IGetNodeParameterOptions,
    INodeExecutorConfig,
} from '../types/node.types';
import { nodeRegistry } from './NodeRegistry';

/**
 * Execution context for a single node
 */
interface IExecutionContext {
    node: INode;
    workflow: IWorkflow;
    inputData: INodeExecutionData[][];
    credentials?: Record<string, ICredentialsDecrypted>;
    config?: INodeExecutorConfig;
}

/**
 * NodeExecutor class
 * Handles node execution with proper context and error handling
 */
export class NodeExecutor {
    /**
     * Execute a node with given context
     * @param nodeType - Type of node to execute
     * @param context - Execution context
     * @returns Execution result with data and metadata
     */
    public static async executeNode(
        nodeType: string,
        context: IExecutionContext
    ): Promise<{
        data: INodeExecutionData[][];
        error?: Error;
        executionTime: number;
    }> {
        const startTime = Date.now();

        try {
            // Get node instance from registry
            const nodeInstance = nodeRegistry.getNode(nodeType);
            if (!nodeInstance) {
                throw new Error(`Node type "${nodeType}" not found in registry`);
            }

            if (!nodeInstance.execute) {
                throw new Error(`Node type "${nodeType}" does not implement execute method`);
            }

            // Create execution functions context
            const executeFunctions = this.createExecuteFunctions(context);

            // Execute node with timeout if configured
            const timeout = context.config?.timeout || 300000; // 5 minutes default
            const data = await this.executeWithTimeout(
                nodeInstance.execute.call(executeFunctions),
                timeout,
                `Node "${context.node.name}" execution timeout`
            );

            const executionTime = Date.now() - startTime;

            return {
                data,
                executionTime,
            };
        } catch (error) {
            const executionTime = Date.now() - startTime;
            console.error(`Error executing node "${context.node.name}":`, error);

            return {
                data: [[]],
                error: error as Error,
                executionTime,
            };
        }
    }

    /**
     * Create IExecuteFunctions context for node execution
     * @param context - Execution context
     * @returns IExecuteFunctions implementation
     */
    private static createExecuteFunctions(context: IExecutionContext): IExecuteFunctions {
        const { node, workflow, inputData, credentials, config } = context;

        return {
            /**
             * Get input data for the node
             */
            getInputData: (inputIndex = 0, inputName?: string): INodeExecutionData[] => {
                if (inputIndex >= inputData.length) {
                    return [];
                }
                return inputData[inputIndex] || [];
            },

            /**
             * Get node parameter value
             */
            getNodeParameter: <T = any>(
                parameterName: string,
                itemIndex: number,
                fallbackValue?: T,
                options?: IGetNodeParameterOptions
            ): T => {
                const parameters = node.parameters || {};
                const value = parameters[parameterName];

                if (value === undefined || value === null) {
                    if (fallbackValue !== undefined) {
                        return fallbackValue;
                    }
                    throw new Error(
                        `Parameter "${parameterName}" is not set for node "${node.name}"`
                    );
                }

                return value as T;
            },

            /**
             * Get credentials for the node
             */
            getCredentials: async (
                type: string,
                itemIndex?: number
            ): Promise<ICredentialsDecrypted> => {
                if (!credentials || !credentials[type]) {
                    throw new Error(
                        `Credentials of type "${type}" not found for node "${node.name}"`
                    );
                }
                return credentials[type];
            },

            /**
             * Get current node
             */
            getNode: (): INode => {
                return node;
            },

            /**
             * Get workflow
             */
            getWorkflow: (): IWorkflow => {
                return workflow;
            },

            /**
             * Helper methods
             */
            helpers: NodeExecutor.createHelpers(node),

            /**
             * Continue on fail setting
             */
            continueOnFail: (): boolean => {
                return config?.continueOnFail || false;
            },
        };
    }

    /**
     * Create helper methods for node execution
     * @param node - Current node
     * @returns Helper methods
     */
    private static createHelpers(node: INode): IExecutionHelpers {
        return {
            /**
             * Make HTTP request
             */
            request: async (options: IHttpRequestOptions): Promise<any> => {
                try {
                    const response = await axios({
                        method: options.method,
                        url: options.url,
                        headers: options.headers,
                        data: options.body,
                        params: options.qs,
                        timeout: options.timeout || 30000,
                        responseType: options.encoding === null ? 'arraybuffer' : 'json',
                    });

                    return options.json !== false ? response.data : response;
                } catch (error: any) {
                    throw new Error(
                        `HTTP request failed: ${error.message || 'Unknown error'}`
                    );
                }
            },

            /**
             * Return data as JSON array
             */
            returnJsonArray: (data: any[]): INodeExecutionData[] => {
                return data.map(item => ({
                    json: typeof item === 'object' && item !== null ? item : { value: item },
                }));
            },

            /**
             * Construct execution metadata
             */
            constructExecutionMetaData: (
                inputData: INodeExecutionData[],
                options: { itemData: { item: number } }
            ): INodeExecutionData[] => {
                return inputData.map((item, index) => ({
                    ...item,
                    pairedItem: {
                        item: options.itemData.item,
                        input: 0,
                    },
                }));
            },

            /**
             * Prepare output data
             */
            prepareOutputData: (outputData: INodeExecutionData[]): INodeExecutionData[][] => {
                return [outputData];
            },
        };
    }

    /**
     * Execute a promise with timeout
     * @param promise - Promise to execute
     * @param timeoutMs - Timeout in milliseconds
     * @param timeoutMessage - Error message for timeout
     * @returns Promise result
     */
    private static async executeWithTimeout<T>(
        promise: Promise<T>,
        timeoutMs: number,
        timeoutMessage: string
    ): Promise<T> {
        return Promise.race([
            promise,
            new Promise<T>((_, reject) =>
                setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
            ),
        ]);
    }

    /**
     * Process items in batches
     * Useful for nodes that need to process large datasets
     * @param items - Input items
     * @param batchSize - Number of items per batch
     * @param processor - Function to process each batch
     * @returns Processed items
     */
    public static async processBatches<T, R>(
        items: T[],
        batchSize: number,
        processor: (batch: T[]) => Promise<R[]>
    ): Promise<R[]> {
        const results: R[] = [];

        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            const batchResults = await processor(batch);
            results.push(...batchResults);
        }

        return results;
    }

    /**
     * Validate node parameters
     * @param node - Node to validate
     * @param nodeType - Node type instance
     * @returns Validation errors (empty array if valid)
     */
    public static validateNodeParameters(
        node: INode,
        nodeType: string
    ): string[] {
        const errors: string[] = [];
        const nodeInstance = nodeRegistry.getNode(nodeType);

        if (!nodeInstance) {
            errors.push(`Node type "${nodeType}" not found`);
            return errors;
        }

        const { properties } = nodeInstance.description;
        const parameters = node.parameters || {};

        properties.forEach(property => {
            if (property.required) {
                const value = parameters[property.name];
                if (value === undefined || value === null || value === '') {
                    errors.push(
                        `Required parameter "${property.displayName}" is missing`
                    );
                }
            }
        });

        return errors;
    }
}
