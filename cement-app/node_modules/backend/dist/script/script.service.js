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
var ScriptService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const fs = require("fs");
const path = require("path");
const util = require("util");
const execPromise = util.promisify(child_process_1.exec);
let ScriptService = ScriptService_1 = class ScriptService {
    constructor() {
        this.logger = new common_1.Logger(ScriptService_1.name);
        this.envsDir = path.join(process.cwd(), 'envs');
        if (!fs.existsSync(this.envsDir)) {
            fs.mkdirSync(this.envsDir);
        }
    }
    async createEnv(id) {
        const envPath = path.join(this.envsDir, id);
        if (fs.existsSync(envPath)) {
            this.logger.log(`Environment for node ${id} already exists.`);
            return;
        }
        this.logger.log(`Creating environment for node ${id} using uv...`);
        try {
            await execPromise(`uv venv "${envPath}"`);
            this.logger.log(`Environment created successfully at ${envPath}`);
        }
        catch (error) {
            this.logger.error(`Failed to create environment for node ${id}`, error);
            throw new Error(`Failed to create environment: ${error.message}`);
        }
    }
    async deleteEnv(id) {
        const envPath = path.join(this.envsDir, id);
        if (!fs.existsSync(envPath)) {
            this.logger.warn(`Environment for node ${id} does not exist.`);
            return;
        }
        this.logger.log(`Deleting environment for node ${id}...`);
        try {
            fs.rmSync(envPath, { recursive: true, force: true });
            this.logger.log(`Environment deleted successfully.`);
        }
        catch (error) {
            this.logger.error(`Failed to delete environment for node ${id}`, error);
            throw new Error(`Failed to delete environment: ${error.message}`);
        }
    }
    async installPackages(id, packages) {
        if (!packages || packages.length === 0)
            return;
        const envPath = path.join(this.envsDir, id);
        if (!fs.existsSync(envPath)) {
            throw new Error(`Environment for node ${id} does not exist. Cannot install packages.`);
        }
        this.logger.log(`Installing packages [${packages.join(', ')}] for node ${id}...`);
        try {
            const packagesStr = packages.join(' ');
            await execPromise(`uv pip install ${packagesStr} -p "${envPath}"`);
            this.logger.log(`Packages installed successfully.`);
        }
        catch (error) {
            this.logger.error(`Failed to install packages for node ${id}`, error);
            throw new Error(`Failed to install packages: ${error.message}`);
        }
    }
    async runScript(id, code) {
        const envPath = path.join(this.envsDir, id);
        if (!fs.existsSync(envPath)) {
            throw new Error(`Environment for node ${id} does not exist. Cannot run script.`);
        }
        const tempFilePath = path.join(envPath, 'temp_script.py');
        fs.writeFileSync(tempFilePath, code);
        const pythonExec = process.platform === 'win32'
            ? path.join(envPath, 'Scripts', 'python.exe')
            : path.join(envPath, 'bin', 'python');
        this.logger.log(`Running script for node ${id}...`);
        try {
            const { stdout, stderr } = await execPromise(`"${pythonExec}" "${tempFilePath}"`);
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            if (stderr) {
                this.logger.warn(`Script execution stderr: ${stderr}`);
            }
            return stdout;
        }
        catch (error) {
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            this.logger.error(`Script execution failed for node ${id}`, error);
            throw new Error(`Script execution failed: ${error.message}`);
        }
    }
};
exports.ScriptService = ScriptService;
exports.ScriptService = ScriptService = ScriptService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ScriptService);
//# sourceMappingURL=script.service.js.map