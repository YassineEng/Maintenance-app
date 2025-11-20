import { GeminiService } from './gemini.service';
export declare class GeminiController {
    private readonly geminiService;
    constructor(geminiService: GeminiService);
    generateContent(body: {
        apiKey: string;
        model: string;
        prompt: string;
    }): Promise<any>;
}
