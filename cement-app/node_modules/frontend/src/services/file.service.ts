import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const fileService = {
    async uploadFile(file: File): Promise<{ path: string; filename: string; originalname: string; size: number }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/files/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async getFileContent(path: string): Promise<string> {
        const response = await axios.get(`${API_URL}/files/content`, {
            params: { path }
        });
        return response.data.content;
    }
};
