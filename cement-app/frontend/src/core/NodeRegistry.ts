/**
 * NodeRegistry - Central registry for all node types
 * Manages node registration, retrieval, and metadata
 */

import {
    INodeType,
    INodeTypeConstructor,
    INodeTypeDescription,
} from '../types/node.types';

/**
 * Registered node metadata
 */
interface IRegisteredNode {
    /** Node class constructor */
    nodeClass: INodeTypeConstructor;
    /** Node instance (singleton) */
    instance: INodeType;
    /** Registration timestamp */
    registeredAt: Date;
    /** Node version */
    version: number | number[];
    /** Node categories/groups */
    groups: string[];
}

/**
 * Node registry singleton
 * Manages all available node types in the system
 */
class NodeRegistry {
    private static instance: NodeRegistry;
    private nodes: Map<string, IRegisteredNode> = new Map();

    /**
     * Private constructor for singleton pattern
     */
    private constructor() { }

    /**
     * Get singleton instance
     */
    public static getInstance(): NodeRegistry {
        if (!NodeRegistry.instance) {
            NodeRegistry.instance = new NodeRegistry();
        }
        return NodeRegistry.instance;
    }

    /**
     * Register a new node type
     * @param nodeClass - Node class constructor
     * @throws Error if node with same name already registered
     */
    public registerNode(nodeClass: INodeTypeConstructor): void {
        const instance = new nodeClass();
        const description = instance.description;

        if (!description || !description.name) {
            throw new Error('Node must have a valid description with a name');
        }

        const nodeName = description.name;

        if (this.nodes.has(nodeName)) {
            console.warn(`Node "${nodeName}" is already registered. Overwriting...`);
        }

        this.nodes.set(nodeName, {
            nodeClass,
            instance,
            registeredAt: new Date(),
            version: description.version,
            groups: description.group || [],
        });

        console.log(`✓ Registered node: ${description.displayName} (${nodeName})`);
    }

    /**
     * Register multiple nodes at once
     * @param nodeClasses - Array of node class constructors
     */
    public registerNodes(nodeClasses: INodeTypeConstructor[]): void {
        nodeClasses.forEach(nodeClass => this.registerNode(nodeClass));
    }

    /**
     * Get a node instance by type name
     * @param nodeType - Node type name
     * @returns Node instance or undefined if not found
     */
    public getNode(nodeType: string): INodeType | undefined {
        const registered = this.nodes.get(nodeType);
        return registered?.instance;
    }

    /**
     * Get node description by type name
     * @param nodeType - Node type name
     * @returns Node description or undefined if not found
     */
    public getNodeDescription(nodeType: string): INodeTypeDescription | undefined {
        const node = this.getNode(nodeType);
        return node?.description;
    }

    /**
     * Check if a node type is registered
     * @param nodeType - Node type name
     * @returns True if node is registered
     */
    public hasNode(nodeType: string): boolean {
        return this.nodes.has(nodeType);
    }

    /**
     * Get all registered nodes
     * @returns Array of all node instances
     */
    public getAllNodes(): INodeType[] {
        return Array.from(this.nodes.values()).map(registered => registered.instance);
    }

    /**
     * Get all registered node descriptions
     * @returns Array of all node descriptions
     */
    public getAllNodeDescriptions(): INodeTypeDescription[] {
        return this.getAllNodes().map(node => node.description);
    }

    /**
     * Get nodes by group/category
     * @param group - Group name
     * @returns Array of nodes in the specified group
     */
    public getNodesByGroup(group: string): INodeType[] {
        return Array.from(this.nodes.values())
            .filter(registered => registered.groups.includes(group))
            .map(registered => registered.instance);
    }

    /**
     * Get all available groups
     * @returns Array of unique group names
     */
    public getAllGroups(): string[] {
        const groups = new Set<string>();
        this.nodes.forEach(registered => {
            registered.groups.forEach(group => groups.add(group));
        });
        return Array.from(groups).sort();
    }

    /**
     * Get nodes grouped by category
     * @returns Map of group name to array of nodes
     */
    public getNodesGrouped(): Map<string, INodeType[]> {
        const grouped = new Map<string, INodeType[]>();

        this.nodes.forEach(registered => {
            const groups = registered.groups.length > 0 ? registered.groups : ['Other'];
            groups.forEach(group => {
                if (!grouped.has(group)) {
                    grouped.set(group, []);
                }
                grouped.get(group)!.push(registered.instance);
            });
        });

        return grouped;
    }

    /**
     * Unregister a node type
     * @param nodeType - Node type name
     * @returns True if node was unregistered
     */
    public unregisterNode(nodeType: string): boolean {
        return this.nodes.delete(nodeType);
    }

    /**
     * Clear all registered nodes
     * WARNING: This will remove all nodes from the registry
     */
    public clear(): void {
        this.nodes.clear();
        console.warn('⚠ NodeRegistry cleared - all nodes unregistered');
    }

    /**
     * Get registry statistics
     * @returns Object with registry stats
     */
    public getStats(): {
        totalNodes: number;
        groups: string[];
        nodesByGroup: Record<string, number>;
    } {
        const groups = this.getAllGroups();
        const nodesByGroup: Record<string, number> = {};

        groups.forEach(group => {
            nodesByGroup[group] = this.getNodesByGroup(group).length;
        });

        return {
            totalNodes: this.nodes.size,
            groups,
            nodesByGroup,
        };
    }

    /**
     * Create a new node instance
     * Useful for creating fresh instances without affecting the registry
     * @param nodeType - Node type name
     * @returns New node instance or undefined if not found
     */
    public createNodeInstance(nodeType: string): INodeType | undefined {
        const registered = this.nodes.get(nodeType);
        if (!registered) {
            return undefined;
        }
        return new registered.nodeClass();
    }
}

// Export singleton instance
export const nodeRegistry = NodeRegistry.getInstance();

// Export class for testing
export { NodeRegistry };
