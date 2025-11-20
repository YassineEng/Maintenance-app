"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
let GeminiService = class GeminiService {
    async generateContent(apiKey, model, prompt) {
        try {
            const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
            const modelInstance = genAI.getGenerativeModel({ model: model || 'gemini-2.0-flash-exp' });
            const result = await modelInstance.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return {
                text,
                success: true,
            };
        }
        catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error(`Gemini API call failed: ${error.message}`);
        }
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = __decorate([
    (0, common_1.Injectable)()
], GeminiService);
//# sourceMappingURL=gemini.service.js.map