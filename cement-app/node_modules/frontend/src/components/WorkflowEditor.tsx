import { useCallback, useState, useRef } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Connection,
    Edge,
    NodeMouseHandler,
} from 'reactflow';
import EquipmentNode from './EquipmentNode';
import AgentNode from './AgentNode';
import SensorNode from './SensorNode';
import AlertNode from './AlertNode';
import ScriptNode from './ScriptNode';
import EnvNode from './EnvNode';
import DisplayNode from './DisplayNode';
import NodePalette from './NodePalette';
import WorkflowToolbar from './WorkflowToolbar';
import EquipmentConfigModal from './EquipmentConfigModal';
import AgentConfigModal from './AgentConfigModal';
import SensorConfigModal from './SensorConfigModal';
import AlertConfigModal from './AlertConfigModal';
import ScriptConfigModal from './ScriptConfigModal';
import EnvConfigModal from './EnvConfigModal';
import DisplayConfigModal from './DisplayConfigModal';
import { scriptService } from '../services/script.service';

const nodeTypes = {
    equipment: EquipmentNode,
    agent: AgentNode,
    sensor: SensorNode,
    alert: AlertNode,
    script: ScriptNode,
    env: EnvNode,
    display: DisplayNode,
};

const initialNodes: any[] = [];
const initialEdges: any[] = [];

let nodeId = 1;

export default function WorkflowEditor() {
    const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
    const [agentModalOpen, setAgentModalOpen] = useState(false);
    const [sensorModalOpen, setSensorModalOpen] = useState(false);
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const [scriptModalOpen, setScriptModalOpen] = useState(false);
    const [envModalOpen, setEnvModalOpen] = useState(false);
    const [displayModalOpen, setDisplayModalOpen] = useState(false);
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

    // Workflow state
    const [workflowName, setWorkflowName] = useState('My workflow');
    const [isActive, setIsActive] = useState(false);

    const onConnect = useCallback(
        (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onNodeDoubleClick: NodeMouseHandler = useCallback((_event, node) => {
        setSelectedNode(node);
        switch (node.type) {
            case 'equipment':
                setEquipmentModalOpen(true);
                break;
            case 'agent':
                setAgentModalOpen(true);
                break;
            case 'sensor':
                setSensorModalOpen(true);
                break;
            case 'alert':
                setAlertModalOpen(true);
                break;
            case 'script':
                setScriptModalOpen(true);
                break;
            case 'env':
                setEnvModalOpen(true);
                break;
            case 'display':
                setDisplayModalOpen(true);
                break;
        }
    }, []);

    const handleConfigSave = (config: any) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === selectedNode.id
                    ? { ...node, data: { ...node.data, ...config } }
                    : node
            )
        );
    };

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Keep track of edges in a ref to avoid stale closures in node callbacks
    const edgesRef = useRef(edges);
    edgesRef.current = edges;

    const handleRunScript = async (nodeId: string, code: string) => {
        try {
            const result = await scriptService.runScript(nodeId, code);
            // Use ref to get latest edges
            const currentEdges = edgesRef.current;
            const connectedEdges = currentEdges.filter((edge) => edge.source === nodeId);
            const targetNodeIds = connectedEdges.map((edge) => edge.target);

            setNodes((nds) =>
                nds.map((node) => {
                    if (targetNodeIds.includes(node.id) && node.type === 'display') {
                        return {
                            ...node,
                            data: { ...node.data, output: result.output },
                        };
                    }
                    return node;
                })
            );
        } catch (error: any) {
            console.error('Failed to run script', error);
            const currentEdges = edgesRef.current;
            const connectedEdges = currentEdges.filter((edge) => edge.source === nodeId);
            const targetNodeIds = connectedEdges.map((edge) => edge.target);
            setNodes((nds) =>
                nds.map((node) => {
                    if (targetNodeIds.includes(node.id) && node.type === 'display') {
                        return {
                            ...node,
                            data: { ...node.data, output: `Error: ${error.message}` },
                        };
                    }
                    return node;
                })
            );
        }
    };

    const handleNodeDelete = useCallback((nodeId: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
        scriptService.deleteEnv(nodeId).catch(err => console.error("Failed to delete env", err));
    }, [setNodes, setEdges]);

    const handleNodeDuplicate = useCallback((nodeId: string, data: any) => {
        const newNodeId = `${parseInt(nodeId) + 1000}`; // Simple ID generation

        setNodes((nds) => {
            const originalNode = nds.find((n) => n.id === nodeId);
            if (!originalNode) return nds;

            const newNode = {
                id: newNodeId,
                type: originalNode.type,
                position: { x: originalNode.position.x + 50, y: originalNode.position.y + 50 },
                data: {
                    ...data,
                    label: `${data.label} (Copy)`,
                    onRun: handleRunScript,
                    onDelete: handleNodeDelete,
                    onDuplicate: handleNodeDuplicate,
                    onClear: (nodeId: string) => {
                        setNodes((nds) =>
                            nds.map((node) =>
                                node.id === nodeId
                                    ? { ...node, data: { ...node.data, output: '' } }
                                    : node
                            )
                        );
                    }
                },
            };

            // Create env for duplicate if it's a script node
            if (originalNode.type === 'script') {
                scriptService.createEnv(newNodeId).catch(console.error);
            }

            return nds.concat(newNode);
        });
    }, [setNodes]);

    const getDefaultNodeData = (type: string, equipmentType?: string) => {
        const baseData = {
            onDelete: handleNodeDelete,
            onDuplicate: handleNodeDuplicate
        };

        switch (type) {
            case 'equipment':
                return {
                    ...baseData,
                    label: equipmentType || 'New Equipment',
                    equipmentType: equipmentType || 'Rotary Kiln',
                    equipmentId: '',
                    status: 'Running'
                };
            case 'agent':
                return {
                    ...baseData,
                    label: 'New Agent',
                    model: 'gpt-4-turbo',
                    task: '',
                    persona: 'Maintenance Expert',
                    temperature: 0.7,
                    maxTokens: 2000,
                    topP: 1.0
                };
            case 'sensor':
                return { ...baseData, label: 'New Sensor', sensorId: '', type: 'Temperature' };
            case 'alert':
                return { ...baseData, label: 'New Alert', condition: '', severity: 'Medium' };
            case 'script':
                return {
                    ...baseData,
                    label: 'New Script',
                    code: '',
                    language: 'JavaScript',
                    onRun: handleRunScript,
                };
            case 'env':
                return { ...baseData, label: '.env', openaiKey: '', anthropicKey: '', customKeys: [] };
            case 'display':
                return {
                    ...baseData,
                    label: 'Display',
                    output: '',
                    onClear: (nodeId: string) => {
                        setNodes((nds) =>
                            nds.map((node) =>
                                node.id === nodeId
                                    ? { ...node, data: { ...node.data, output: '' } }
                                    : node
                            )
                        );
                    }
                };
            default:
                return { ...baseData, label: 'New Node' };
        }
    };

    const onDrop = useCallback(
        async (event: React.DragEvent) => {
            event.preventDefault();
            console.log('onDrop triggered!', event);

            const type = event.dataTransfer.getData('application/reactflow');
            const equipmentType = event.dataTransfer.getData('equipmentType');
            console.log('Drop data:', { type, equipmentType });
            if (!type || !reactFlowInstance) return;

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: `${nodeId++}`,
                type,
                position,
                data: getDefaultNodeData(type, equipmentType),
            };

            setNodes((nds) => nds.concat(newNode));

            // Create environment for script nodes
            if (type === 'script') {
                try {
                    await scriptService.createEnv(newNode.id);
                    console.log(`Environment created for node ${newNode.id}`);
                } catch (error) {
                    console.error(`Failed to create environment for node ${newNode.id}`, error);
                }
            }
        },
        [reactFlowInstance, setNodes]
    );

    const onNodesDelete = useCallback(
        async (deletedNodes: any[]) => {
            console.log('onNodesDelete triggered', deletedNodes);
            for (const node of deletedNodes) {
                if (node.type === 'script') {
                    console.log(`Attempting to delete env for node ${node.id}`);
                    try {
                        await scriptService.deleteEnv(node.id);
                        console.log(`Environment deleted for node ${node.id}`);
                    } catch (error) {
                        console.error(`Failed to delete environment for node ${node.id}`, error);
                    }
                }
            }
        },
        []
    );

    const handleSave = () => {
        console.log('Saving workflow...', { workflowName, nodes, edges });
        // Add your save logic here
    };

    const handleTest = () => {
        console.log('Testing workflow...');
        // Add your test logic here
    };

    return (
        <div className="flex flex-col w-screen h-screen">
            {/* Toolbar */}
            <WorkflowToolbar
                workflowName={workflowName}
                isActive={isActive}
                onWorkflowNameChange={setWorkflowName}
                onActiveToggle={() => setIsActive(!isActive)}
                onSave={handleSave}
                onTest={handleTest}
            />

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                <NodePalette />
                <div ref={reactFlowWrapper} className="flex-1 bg-gray-50">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeDoubleClick={onNodeDoubleClick}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodesDelete={onNodesDelete}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Controls />
                        <MiniMap />
                        <Background gap={12} size={1} color="#e5e7eb" />
                    </ReactFlow>
                </div>
            </div>

            <EquipmentConfigModal
                isOpen={equipmentModalOpen}
                onClose={() => setEquipmentModalOpen(false)}
                onSave={handleConfigSave}
                initialData={selectedNode?.data}
            />

            <AgentConfigModal
                isOpen={agentModalOpen}
                onClose={() => setAgentModalOpen(false)}
                onSave={handleConfigSave}
                initialData={selectedNode?.data}
            />

            <SensorConfigModal
                isOpen={sensorModalOpen}
                onClose={() => setSensorModalOpen(false)}
                onSave={handleConfigSave}
                initialData={selectedNode?.data}
            />

            <AlertConfigModal
                isOpen={alertModalOpen}
                onClose={() => setAlertModalOpen(false)}
                onSave={handleConfigSave}
                initialData={selectedNode?.data}
            />

            <ScriptConfigModal
                isOpen={scriptModalOpen}
                onClose={() => setScriptModalOpen(false)}
                onSave={handleConfigSave}
                initialData={selectedNode?.data}
                nodeId={selectedNode?.id}
                onRunScript={handleRunScript}
            />

            <EnvConfigModal
                isOpen={envModalOpen}
                onClose={() => setEnvModalOpen(false)}
                onSave={handleConfigSave}
                initialData={selectedNode?.data}
            />

            <DisplayConfigModal
                isOpen={displayModalOpen}
                onClose={() => setDisplayModalOpen(false)}
                initialData={selectedNode?.data}
            />
        </div>
    );
}
