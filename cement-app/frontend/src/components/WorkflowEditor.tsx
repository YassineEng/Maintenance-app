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
import NodePalette from './NodePalette';
import WorkflowToolbar from './WorkflowToolbar';
import EquipmentConfigModal from './EquipmentConfigModal';
import AgentConfigModal from './AgentConfigModal';
import SensorConfigModal from './SensorConfigModal';
import AlertConfigModal from './AlertConfigModal';
import ScriptConfigModal from './ScriptConfigModal';
import EnvConfigModal from './EnvConfigModal';
import { scriptService } from '../services/script.service';

const nodeTypes = {
    equipment: EquipmentNode,
    agent: AgentNode,
    sensor: SensorNode,
    alert: AlertNode,
    script: ScriptNode,
    env: EnvNode,
};

const initialNodes = [
    { id: '1', type: 'equipment', position: { x: 100, y: 100 }, data: { label: 'Kiln Motor', equipmentId: '10002345', status: 'Running' } },
    { id: '2', type: 'agent', position: { x: 100, y: 300 }, data: { label: 'Predictive Agent', task: 'Monitor vibration > 5mm/s', persona: 'Anomaly Detector' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

let nodeId = 3;

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

    const onDrop = useCallback(
        async (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            const equipmentType = event.dataTransfer.getData('equipmentType');
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
                    alert(`Virtual Environment created successfully for node ${newNode.id}`);
                } catch (error) {
                    console.error(`Failed to create environment for node ${newNode.id}`, error);
                }
            }
        },
        [reactFlowInstance, setNodes]
    );

    const onNodesDelete = useCallback(
        async (deletedNodes: any[]) => {
            for (const node of deletedNodes) {
                if (node.type === 'script') {
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

    const getDefaultNodeData = (type: string, equipmentType?: string) => {
        switch (type) {
            case 'equipment':
                return {
                    label: equipmentType || 'New Equipment',
                    equipmentType: equipmentType || 'Rotary Kiln',
                    equipmentId: '',
                    status: 'Running'
                };
            case 'agent':
                return {
                    label: 'New Agent',
                    model: 'gpt-4-turbo',
                    task: '',
                    persona: 'Maintenance Expert',
                    temperature: 0.7,
                    maxTokens: 2000,
                    topP: 1.0
                };
            case 'sensor':
                return { label: 'New Sensor', sensorId: '', type: 'Temperature' };
            case 'alert':
                return { label: 'New Alert', condition: '', severity: 'Medium' };
            case 'script':
                return { label: 'New Script', code: '', language: 'JavaScript' };
            case 'env':
                return { label: '.env', openaiKey: '', anthropicKey: '', customKeys: [] };
            default:
                return { label: 'New Node' };
        }
    };

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
            />

            <EnvConfigModal
                isOpen={envModalOpen}
                onClose={() => setEnvModalOpen(false)}
                onSave={handleConfigSave}
                initialData={selectedNode?.data}
            />
        </div>
    );
}
