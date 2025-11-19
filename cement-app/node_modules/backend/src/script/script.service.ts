import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const execPromise = util.promisify(exec);

@Injectable()
export class ScriptService {
    private readonly logger = new Logger(ScriptService.name);
    private readonly envsDir = path.join(process.cwd(), 'envs');

    constructor() {
        if (!fs.existsSync(this.envsDir)) {
            fs.mkdirSync(this.envsDir);
        }
    }

    async createEnv(id: string): Promise<void> {
        const envPath = path.join(this.envsDir, id);
        if (fs.existsSync(envPath)) {
            this.logger.log(`Environment for node ${id} already exists.`);
            return;
        }

        this.logger.log(`Creating environment for node ${id} using uv...`);
        try {
            // Using uv to create a virtual environment
            await execPromise(`uv venv "${envPath}"`);
            this.logger.log(`Environment created successfully at ${envPath}`);
        } catch (error) {
            this.logger.error(`Failed to create environment for node ${id}`, error);
            throw new Error(`Failed to create environment: ${error.message}`);
        }
    }

    async deleteEnv(id: string): Promise<void> {
        const envPath = path.join(this.envsDir, id);
        if (!fs.existsSync(envPath)) {
            this.logger.warn(`Environment for node ${id} does not exist.`);
            return;
        }

        this.logger.log(`Deleting environment for node ${id}...`);
        try {
            fs.rmSync(envPath, { recursive: true, force: true });
            this.logger.log(`Environment deleted successfully.`);
        } catch (error) {
            this.logger.error(`Failed to delete environment for node ${id}`, error);
            throw new Error(`Failed to delete environment: ${error.message}`);
        }
    }

    async installPackages(id: string, packages: string[]): Promise<void> {
        if (!packages || packages.length === 0) return;

        const envPath = path.join(this.envsDir, id);
        if (!fs.existsSync(envPath)) {
            throw new Error(`Environment for node ${id} does not exist. Cannot install packages.`);
        }

        this.logger.log(`Installing packages [${packages.join(', ')}] for node ${id}...`);
        try {
            // Using uv pip install to install packages into the specific venv
            // Note: On Windows, the python executable is in Scripts/python.exe
            // But uv pip install -p <venv_path> works directly.
            const packagesStr = packages.join(' ');
            // Using -p to specify the python interpreter/environment
            // On Windows it's Scripts/python.exe, on Unix it's bin/python
            // uv pip install <pkgs> -p <venv_path> is the most robust way
            await execPromise(`uv pip install ${packagesStr} -p "${envPath}"`);
            this.logger.log(`Packages installed successfully.`);
        } catch (error) {
            this.logger.error(`Failed to install packages for node ${id}`, error);
            throw new Error(`Failed to install packages: ${error.message}`);
        }
    }

    async runScript(id: string, code: string): Promise<string> {
        const envPath = path.join(this.envsDir, id);
        if (!fs.existsSync(envPath)) {
            throw new Error(`Environment for node ${id} does not exist. Cannot run script.`);
        }

        const tempFilePath = path.join(envPath, 'temp_script.py');
        fs.writeFileSync(tempFilePath, code);

        // Determine python executable path
        const pythonExec = process.platform === 'win32'
            ? path.join(envPath, 'Scripts', 'python.exe')
            : path.join(envPath, 'bin', 'python');

        this.logger.log(`Running script for node ${id}...`);
        try {
            const { stdout, stderr } = await execPromise(`"${pythonExec}" "${tempFilePath}"`);

            // Cleanup temp file
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }

            if (stderr) {
                this.logger.warn(`Script execution stderr: ${stderr}`);
            }

            return stdout;
        } catch (error) {
            // Cleanup temp file in case of error
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }

            this.logger.error(`Script execution failed for node ${id}`, error);
            throw new Error(`Script execution failed: ${error.message}`);
        }
    }
}
