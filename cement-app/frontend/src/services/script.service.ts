const API_URL = 'http://127.0.0.1:3000';

export const scriptService = {
    async createEnv(nodeId: string) {
        const response = await fetch(`${API_URL}/scripts/${nodeId}/env`, {
            method: 'POST',
        });
        if (!response.ok) {
            throw new Error('Failed to create environment');
        }
        return response.json();
    },

    async deleteEnv(nodeId: string) {
        const response = await fetch(`${API_URL}/scripts/${nodeId}/env`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete environment');
        }
        return response.json();
    },

    async installPackages(nodeId: string, packages: string[]) {
        const response = await fetch(`${API_URL}/scripts/${nodeId}/packages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ packages }),
        });
        if (!response.ok) {
            throw new Error('Failed to install packages');
        }
        return response.json();
    },

    async runScript(nodeId: string, code: string) {
        const response = await fetch(`${API_URL}/scripts/${nodeId}/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });
        if (!response.ok) {
            throw new Error('Failed to run script');
        }

        const contentLength = response.headers.get('Content-Length');
        if (contentLength && parseInt(contentLength, 10) > 1000000) { // 1MB limit
            return { output: 'Response is too large to display. Please modify your script to produce less output.' };
        }

        return response.json();
    }
};
