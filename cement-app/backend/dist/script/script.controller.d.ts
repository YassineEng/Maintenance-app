import { ScriptService } from './script.service';
export declare class ScriptController {
    private readonly scriptService;
    constructor(scriptService: ScriptService);
    createEnv(id: string): Promise<{
        message: string;
    }>;
    deleteEnv(id: string): Promise<{
        message: string;
    }>;
    installPackages(id: string, packages: string[]): Promise<{
        message: string;
    }>;
    runScript(id: string, code: string): Promise<{
        output: string;
    }>;
}
