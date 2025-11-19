"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptController = void 0;
const common_1 = require("@nestjs/common");
const script_service_1 = require("./script.service");
let ScriptController = class ScriptController {
    constructor(scriptService) {
        this.scriptService = scriptService;
    }
    async createEnv(id) {
        try {
            await this.scriptService.createEnv(id);
            return { message: `Environment created for node ${id}` };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteEnv(id) {
        try {
            await this.scriptService.deleteEnv(id);
            return { message: `Environment deleted for node ${id}` };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async installPackages(id, packages) {
        try {
            await this.scriptService.installPackages(id, packages);
            return { message: `Packages installed for node ${id}` };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async runScript(id, code) {
        try {
            const result = await this.scriptService.runScript(id, code);
            return { output: result };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ScriptController = ScriptController;
__decorate([
    (0, common_1.Post)(':id/env'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "createEnv", null);
__decorate([
    (0, common_1.Delete)(':id/env'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "deleteEnv", null);
__decorate([
    (0, common_1.Post)(':id/packages'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('packages')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "installPackages", null);
__decorate([
    (0, common_1.Post)(':id/run'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ScriptController.prototype, "runScript", null);
exports.ScriptController = ScriptController = __decorate([
    (0, common_1.Controller)('scripts'),
    __metadata("design:paramtypes", [script_service_1.ScriptService])
], ScriptController);
//# sourceMappingURL=script.controller.js.map