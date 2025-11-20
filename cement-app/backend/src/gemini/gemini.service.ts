import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
    async generateContent(apiKey: string, model: string, prompt: string): Promise<any> {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const modelInstance = genAI.getGenerativeModel({ model: model || 'gemini-2.0-flash-exp' });

            const result = await modelInstance.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return {
                text,
                success: true,
            };
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error(`Gemini API call failed: ${error.message}`);
        }
    }
}
