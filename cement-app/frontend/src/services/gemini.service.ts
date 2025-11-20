import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const geminiService = {
    async generateContent(apiKey: string, model: string, prompt: string) {
        const response = await axios.post(`${API_URL}/gemini/generate`, {
            apiKey,
            model,
            prompt,
        });
        return response.data;
    },
};
