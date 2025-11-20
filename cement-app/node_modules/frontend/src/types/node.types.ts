/**
 * Core type definitions for n8n-style node architecture
 * Provides interfaces for node types, execution data, properties, and credentials
 */

// ============================================================================
// Node Execution Data
// ============================================================================

/**
 * Represents a single item of data flowing through the workflow
 */
export interface INodeExecutionData {
    /** JSON data payload */
    json: Record<string, any>;
    /** Binary data (files, images, etc.) */
    binary?: Record<string, IBinaryData>;
    /** Metadata about the item */
    pairedItem?: {
        item: number;
        input?: number;
    };
}

/**
 * Binary data structure for files and blobs
 */
export interface IBinaryData {
    data: string; // Base64 encoded data
    mimeType: string;
    fileName?: string;
    fileExtension?: string;
    fileSize?: number;
}

// ============================================================================
// Node Property Types
// ============================================================================

/**
 * All supported property types for node configuration
 */
export type NodePropertyType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'options'
    | 'multiOptions'
    | 'collection'
    | 'fixedCollection'
    | 'json'
    | 'code'
    | 'credentials'
    | 'color'
    | 'dateTime'
    | 'hidden';

/**
 * Option for select/dropdown properties
 */
export interface INodePropertyOptions {
    name: string;
    value: string | number | boolean;
    description?: string;
    action?: string;
}

/**
 * Type options for specific property types
 */
export interface INodePropertyTypeOptions {
    /** For code/string types - specify editor type */
    editor?: 'code' | 'json' | 'html';
    /** For code editor - language mode */
    language?: 'python' | 'javascript' | 'json' | 'html' | 'css';
    /** For number types - min/max/step */
    minValue?: number;
    maxValue?: number;
    numberStepSize?: number;
    /** For string types - multiline */
    rows?: number;
    /** For options - allow custom values */
    loadOptionsMethod?: string;
}

/**
 * Display conditions for showing/hiding properties
 */
export interface IDisplayOptions {
    show?: {
        [key: string]: Array<string | number | boolean>;
    };
    hide?: {
        [key: string]: Array<string | number | boolean>;
    };
}

/**
 * Individual node property definition
 */
export interface INodeProperties {
    /** Display name shown in UI */
    displayName: string;
    /** Internal parameter name */
    name: string;
    /** Property type */
    type: NodePropertyType;
    /** Default value */
    default: any;
    /** Description/help text */
    description?: string;
    /** Placeholder text */
    placeholder?: string;
    /** Whether this property is required */
    required?: boolean;
    /** Options for select/dropdown types */
    options?: INodePropertyOptions[];
    /** Type-specific options */
    typeOptions?: INodePropertyTypeOptions;
    /** Display conditions */
    displayOptions?: IDisplayOptions;
    /** For collection/fixedCollection types */
    values?: INodeProperties[];
    /** For fixedCollection - allow multiple instances */
    multipleValues?: boolean;
    /** Hint text */
    hint?: string;
    /** Whether to extract value from expression */
    noDataExpression?: boolean;
}

// ============================================================================
// Credentials
// ============================================================================

/**
 * Credential type definition
 */
export interface ICredentialType {
    name: string;
    displayName: string;
    properties: INodeProperties[];
    authenticate?: {
        type: string;
        properties: Record<string, any>;
    };
}

/**
 * Credential data storage
 */
export interface ICredentialsDecrypted {
    id?: string;
    name: string;
    type: string;
    data?: Record<string, any>;
}

/**
 * Credential reference in node
 */
export interface INodeCredentialDescription {
    name: string;
    required?: boolean;
    displayOptions?: IDisplayOptions;
    testedBy?: string;
}

// ============================================================================
// Node Type Description
// ============================================================================

/**
 * Complete node type description
 * This is the core metadata that defines a node's UI and behavior
 */
export interface INodeTypeDescription {
    /** Display name shown in palette and on canvas */
    displayName: string;
    /** Unique internal name (no spaces, lowercase) */
    name: string;
    /** Icon to display (emoji or icon name) */
    icon?: string;
    /** Node group/category for palette organization */
    group?: string[];
    /** Node version */
    version: number | number[];
    /** Subtitle shown below node name */
    subtitle?: string;
    /** Detailed description */
    description: string;
    /** Default values for new instances */
    defaults: {
        name: string;
        color?: string;
    };
    /** Input configuration */
    inputs: string[] | INodeInputConfiguration[];
    /** Output configuration */
    outputs: string[] | INodeOutputConfiguration[];
    /** Credentials this node can use */
    credentials?: INodeCredentialDescription[];
    /** Properties/parameters for configuration */
    properties: INodeProperties[];
    /** Webhook configuration for trigger nodes */
    webhooks?: IWebhookDescription[];
    /** Polling configuration for trigger nodes */
    polling?: boolean;
    /** Maximum number of nodes of this type allowed */
    maxNodes?: number;
    /** Whether this node can be used as a trigger */
    trigger?: boolean;
}

/**
 * Input configuration for nodes
 */
export interface INodeInputConfiguration {
    type: string;
    displayName?: string;
    required?: boolean;
    maxConnections?: number;
}

/**
 * Output configuration for nodes
 */
export interface INodeOutputConfiguration {
    type: string;
    displayName?: string;
}

/**
 * Webhook description for trigger nodes
 */
export interface IWebhookDescription {
    name: string;
    httpMethod: string | string[];
    responseMode?: string;
    path: string;
}

// ============================================================================
// Node Type Interface
// ============================================================================

/**
 * Main interface that all nodes must implement
 */
export interface INodeType {
    /** Node description metadata */
    description: INodeTypeDescription;

    /** Execute method for standard nodes */
    execute?(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;

    /** Trigger method for trigger nodes */
    trigger?(this: ITriggerFunctions): Promise<ITriggerResponse | undefined>;

    /** Webhook method for webhook nodes */
    webhook?(this: IWebhookFunctions): Promise<IWebhookResponseData>;

    /** Methods for loading dynamic options */
    methods?: {
        loadOptions?: {
            [key: string]: (this: ILoadOptionsFunctions) => Promise<INodePropertyOptions[]>;
        };
    };
}

/**
 * Constructor type for node classes
 */
export interface INodeTypeConstructor {
    new(): INodeType;
}

// ============================================================================
// Execution Context Interfaces
// ============================================================================

/**
 * Helper methods available during node execution
 */
export interface IExecutionHelpers {
    /** Make HTTP request */
    request(options: IHttpRequestOptions): Promise<any>;

    /** Return data as JSON array */
    returnJsonArray(data: any[]): INodeExecutionData[];

    /** Construct execution metadata */
    constructExecutionMetaData(
        inputData: INodeExecutionData[],
        options: { itemData: { item: number } }
    ): INodeExecutionData[];

    /** Prepare output data */
    prepareOutputData(outputData: INodeExecutionData[]): INodeExecutionData[][];
}

/**
 * HTTP request options
 */
export interface IHttpRequestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    url: string;
    headers?: Record<string, string>;
    body?: any;
    json?: boolean;
    qs?: Record<string, any>;
    timeout?: number;
    encoding?: string | null;
}

/**
 * Execution context provided to nodes during execute()
 */
export interface IExecuteFunctions {
    /** Get input data items */
    getInputData(inputIndex?: number, inputName?: string): INodeExecutionData[];

    /** Get node parameter value */
    getNodeParameter<T = any>(
        parameterName: string,
        itemIndex: number,
        fallbackValue?: T,
        options?: IGetNodeParameterOptions
    ): T;

    /** Get credentials */
    getCredentials(type: string, itemIndex?: number): Promise<ICredentialsDecrypted>;

    /** Get current node */
    getNode(): INode;

    /** Get workflow */
    getWorkflow(): IWorkflow;

    /** Helper methods */
    helpers: IExecutionHelpers;

    /** Continue on fail */
    continueOnFail(): boolean;
}

/**
 * Options for getNodeParameter
 */
export interface IGetNodeParameterOptions {
    extractValue?: boolean;
    returnFullObject?: boolean;
}

/**
 * Trigger function context
 */
export interface ITriggerFunctions extends IExecuteFunctions {
    /** Emit trigger events */
    emit(data: INodeExecutionData[][]): void;

    /** Get activation mode */
    getActivationMode(): string;
}

/**
 * Trigger response
 */
export interface ITriggerResponse {
    closeFunction?: () => Promise<void>;
    manualTriggerFunction?: () => Promise<void>;
}

/**
 * Webhook function context
 */
export interface IWebhookFunctions extends IExecuteFunctions {
    /** Get webhook request object */
    getRequestObject(): any;

    /** Get webhook response object */
    getResponseObject(): any;

    /** Get webhook name */
    getWebhookName(): string;
}

/**
 * Webhook response data
 */
export interface IWebhookResponseData {
    workflowData?: INodeExecutionData[][];
    webhookResponse?: any;
    noWebhookResponse?: boolean;
}

/**
 * Load options function context
 */
export interface ILoadOptionsFunctions {
    /** Get current node parameter values */
    getCurrentNodeParameter(parameterName: string): any;

    /** Get credentials */
    getCredentials(type: string): Promise<ICredentialsDecrypted>;

    /** Helper methods */
    helpers: IExecutionHelpers;
}

// ============================================================================
// Workflow & Node Instances
// ============================================================================

/**
 * Node instance in a workflow
 */
export interface INode {
    id: string;
    name: string;
    type: string;
    typeVersion: number;
    position: [number, number];
    parameters: INodeParameters;
    credentials?: INodeCredentials;
    disabled?: boolean;
    notes?: string;
    notesInFlow?: boolean;
}

/**
 * Node parameters (configuration values)
 */
export interface INodeParameters {
    [key: string]: any;
}

/**
 * Node credentials reference
 */
export interface INodeCredentials {
    [key: string]: {
        id: string;
        name?: string;
    };
}

/**
 * Workflow definition
 */
export interface IWorkflow {
    id?: string;
    name: string;
    active: boolean;
    nodes: INode[];
    connections: IConnections;
    settings?: IWorkflowSettings;
    staticData?: any;
}

/**
 * Workflow connections
 */
export interface IConnections {
    [nodeName: string]: {
        [outputType: string]: Array<Array<IConnection>>;
    };
}

/**
 * Single connection
 */
export interface IConnection {
    node: string;
    type: string;
    index: number;
}

/**
 * Workflow settings
 */
export interface IWorkflowSettings {
    saveDataErrorExecution?: string;
    saveDataSuccessExecution?: string;
    saveManualExecutions?: boolean;
    timezone?: string;
    executionTimeout?: number;
}

// ============================================================================
// Execution Result
// ============================================================================

/**
 * Node execution result
 */
export interface INodeExecutionResult {
    data: INodeExecutionData[][];
    error?: Error;
    metadata?: {
        executionTime?: number;
        [key: string]: any;
    };
}

/**
 * Workflow execution result
 */
export interface IWorkflowExecutionResult {
    finished: boolean;
    data: {
        resultData: {
            runData: IRunData;
        };
    };
    mode: string;
    startedAt: Date;
    stoppedAt?: Date;
}

/**
 * Run data for all nodes
 */
export interface IRunData {
    [nodeName: string]: IRunNodeData[];
}

/**
 * Run data for a single node
 */
export interface IRunNodeData {
    startTime: number;
    executionTime: number;
    data: INodeExecutionData[][];
    error?: Error;
}

// ============================================================================
// Feature Flags & Configuration
// ============================================================================

/**
 * Feature flags for gradual migration
 */
export interface IFeatureFlags {
    /** Enable new n8n-style node system */
    USE_NODES_V2: boolean;
    /** Enable legacy adapter for old nodes */
    LEGACY_ADAPTER_ENABLED: boolean;
}

/**
 * Node executor configuration
 */
export interface INodeExecutorConfig {
    /** Maximum execution time per node (ms) */
    timeout?: number;
    /** Continue workflow on node failure */
    continueOnFail?: boolean;
    /** Maximum number of items to process */
    maxItems?: number;
}
