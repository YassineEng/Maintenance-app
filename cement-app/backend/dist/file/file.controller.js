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
exports.FileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
let FileController = class FileController {
    uploadFile(file) {
        console.log('File uploaded:', file);
        return {
            path: file.path,
            filename: file.filename,
            originalname: file.originalname,
            size: file.size,
        };
    }
    getContent(filePath) {
        const uploadsDir = path.resolve('./uploads');
        const resolvedPath = path.resolve(filePath);
        if (!resolvedPath.startsWith(uploadsDir)) {
            if (!resolvedPath.includes('uploads')) {
                throw new Error('Invalid file path');
            }
        }
        if (!fs.existsSync(resolvedPath)) {
            throw new Error('File not found');
        }
        const ext = path.extname(resolvedPath).toLowerCase();
        if (ext === '.xlsx' || ext === '.xls') {
            const workbook = XLSX.readFile(resolvedPath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const preview = json.slice(0, 100);
            return { content: JSON.stringify(preview) };
        }
        const content = fs.readFileSync(resolvedPath, 'utf-8');
        return { content };
    }
};
exports.FileController = FileController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('content'),
    __param(0, (0, common_1.Query)('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FileController.prototype, "getContent", null);
exports.FileController = FileController = __decorate([
    (0, common_1.Controller)('files')
], FileController);
//# sourceMappingURL=file.controller.js.map