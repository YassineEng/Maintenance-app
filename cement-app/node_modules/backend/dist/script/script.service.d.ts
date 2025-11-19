export declare class ScriptService {
    private readonly logger;
    private readonly envsDir;
    constructor();
    createEnv(id: string): Promise<void>;
    deleteEnv(id: string): Promise<void>;
    installPackages(id: string, packages: string[]): Promise<void>;
    runScript(id: string, code: string): Promise<string>;
}
