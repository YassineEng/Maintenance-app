import { ReactFlowProvider } from 'reactflow';
import WorkflowEditor from './components/WorkflowEditor';
import 'reactflow/dist/style.css';

function App() {
    return (
        <div className="w-screen h-screen bg-gray-50">
            <ReactFlowProvider>
                <WorkflowEditor />
            </ReactFlowProvider>
        </div>
    );
}

export default App;
