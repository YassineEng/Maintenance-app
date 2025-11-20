/**
 * Node Initialization
 * Registers all available node types with the NodeRegistry
 */

import { nodeRegistry } from './NodeRegistry';
import { ScriptNode } from '../nodes/Script.node';
import { AgentNode } from '../nodes/Agent.node';
import { EnvNode } from '../nodes/Env.node';
import { FileNode } from '../nodes/File.node';
import { DisplayNode } from '../nodes/Display.node';
import { EquipmentNode } from '../nodes/Equipment.node';
import { SensorNode } from '../nodes/Sensor.node';
import { AlertNode } from '../nodes/Alert.node';

/**
 * Initialize and register all nodes
 */
export function initializeNodes() {
    // Register core nodes
    nodeRegistry.registerNodes([
        ScriptNode,
        AgentNode,
        EnvNode,
        FileNode,
        DisplayNode,
        EquipmentNode,
        SensorNode,
        AlertNode,
    ]);

    console.log('✅ All nodes registered successfully');
    console.log('Registered nodes:', nodeRegistry.getAllNodes().map(n => n.description.name));
}
