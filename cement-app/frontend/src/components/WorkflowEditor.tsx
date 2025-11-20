import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Connection,
    Edge,
    NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';

import EquipmentNode from './EquipmentNode';
import AgentNode from './AgentNode';
import SensorNode from './SensorNode';
import AlertNode from './AlertNode';
import ScriptNode from './ScriptNode';
import EnvNode from './EnvNode';
import DisplayNode from './DisplayNode';
import FileNode from './FileNode';
import NodePalette from './NodePalette';
import WorkflowToolbar from './WorkflowToolbar';
import EquipmentConfigModal from './EquipmentConfigModal';
import AgentConfigModal from './AgentConfigModal';
import SensorConfigModal from './SensorConfigModal';
import AlertConfigModal from './AlertConfigModal';
import ScriptConfigModal from './ScriptConfigModal';
import FileContentModal from './FileContentModal';
import EnvConfigModal from './EnvConfigModal';
import DisplayConfigModal from './DisplayConfigModal';
import { scriptService } from '../services/script.service';
import { fileService } from '../services/file.service';

const nodeTypes = {
    equipment: EquipmentNode,
    agent: AgentNode,
    sensor: SensorNode,
    alert: AlertNode,
    script: ScriptNode,
    env: EnvNode,
    display: DisplayNode,
    file: FileNode,
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
    const [isFileModalOpen, setIsFileModalOpen] = useState(false);
    const [selectedFileNode, setSelectedFileNode] = useState<{ path: string; name: string } | null>(null);
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
            case 'file':
                if (node.data.fileInfo) {
                    setSelectedFileNode({
                        path: node.data.fileInfo.path,
                        name: node.data.fileInfo.name
                    });
                    setIsFileModalOpen(true);
                }
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

    const handleUploadComplete = useCallback(async (nodeId: string, fileInfo: any) => {
        console.log(`Upload complete for node ${nodeId}`, fileInfo);

        // Update the node's data
        setNodes(nds => nds.map(node => {
            if (node.id === nodeId) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        fileInfo: fileInfo,
                        label: fileInfo ? fileInfo.name : 'File Node'
                    }
                };
            }
            return node;
        }));

        // Propagate to connected Display Nodes
        if (fileInfo) {
            const currentEdges = edgesRef.current;
            const connectedEdges = currentEdges.filter(edge => edge.source === nodeId);
            const targetNodeIds = connectedEdges.map(edge => edge.target);

            if (targetNodeIds.length > 0) {
                try {
                    const content = await fileService.getFileContent(fileInfo.path);
                    setNodes(nds => nds.map(node => {
                        if (targetNodeIds.includes(node.id) && node.type === 'display') {
                            return {
                                ...node,
                                data: {
                                    ...node.data,
                                    output: content.slice(0, 2000) + (content.length > 2000 ? '\n... (content truncated)' : '')
                                }
                            };
                        }
                        return node;
                    }));
                } catch (error) {
                    console.error('Failed to propagate file content:', error);
                }
            }
        }
    }, [setNodes]);

    const handleNodeDelete = useCallback((nodeId: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
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
                    },
                    onUploadComplete: handleUploadComplete
                },
            };

            // Create env for duplicate if it's a script node
            if (originalNode.type === 'script') {
                scriptService.createEnv(newNodeId).catch(console.error);
            }

            return nds.concat(newNode);
        });
    }, [setNodes, handleUploadComplete, handleNodeDelete, handleRunScript]);

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
            case 'file':
                return {
                    ...baseData,
                    label: 'File Node',
                    fileInfo: null,
                    onUploadComplete: handleUploadComplete
                };
            default:
                return { ...baseData, label: 'New Node' };
        }
    };

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current!.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');
            const equipmentType = event.dataTransfer.getData('application/reactflow/equipmentType');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const newNode = {
                id: String(nodeId++),
                type,
                position,
                data: getDefaultNodeData(type, equipmentType),
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes, getDefaultNodeData],
    );

    const onNodesDelete = useCallback(
        (deletedNodes: any[]) => {
            setEdges(
                (eds) =>
                    eds.filter(
                        (edge) =>
                            !deletedNodes.some((node) => node.id === edge.source || node.id === edge.target),
                    ),
            );
            deletedNodes.forEach(node => {
                if (node.type === 'script') {
                    scriptService.deleteEnv(node.id).catch(console.error);
                }
            });
        },
        [setEdges],
    );

    const handleSave = () => {
        if (reactFlowInstance) {
            const flow = reactFlowInstance.toObject();
            console.log('Workflow saved:', flow);
            // Here you would typically send `flow` to your backend
        }
    };

    const handleTest = () => {
        console.log('Test workflow');
        // Logic to test the workflow
    };

    return (
        <div className="flex flex-col h-screen">
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

            <FileContentModal
                isOpen={isFileModalOpen}
                onClose={() => setIsFileModalOpen(false)}
                filePath={selectedFileNode?.path || null}
                fileName={selectedFileNode?.name || null}
            />
        </div>
    );
}
