import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Controller('gemini')
export class GeminiController {
    constructor(private readonly geminiService: GeminiService) { }

    @Post('generate')
    async generateContent(@Body() body: { apiKey: string; model: string; prompt: string }) {
        const { apiKey, model, prompt } = body;

        if (!apiKey) {
            return { success: false, error: 'API key is required' };
        }

        if (!prompt) {
            return { success: false, error: 'Prompt is required' };
        }

        try {
            const result = await this.geminiService.generateContent(apiKey, model, prompt);
            return result;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to generate content',
            };
        }
    }
}
