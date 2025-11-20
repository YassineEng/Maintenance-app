// Pure ESM Monaco Editor setup - NO CDN loader
import { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

// Import language contributions for syntax highlighting
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';

// Import editor worker
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

// Configure Monaco to use local ESM build (not CDN)
loader.config({ monaco });

// Set up web worker for Monaco
self.MonacoEnvironment = {
    getWorker() {
        return new editorWorker();
    }
};

console.log('Monaco ESM setup complete with syntax highlighting');
