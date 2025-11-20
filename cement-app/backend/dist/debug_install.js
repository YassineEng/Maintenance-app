const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const execPromise = util.promisify(exec);
const envsDir = path.join(process.cwd(), 'envs');
const nodeId = 'debug-node';
async function debugInstall() {
    console.log('Starting debug installation...');
    const envPath = path.join(envsDir, nodeId);
    if (!fs.existsSync(envPath)) {
        console.log(`Creating env at ${envPath}...`);
        try {
            await execPromise(`uv venv "${envPath}"`);
            console.log('Env created.');
        }
        catch (e) {
            console.error('Failed to create env:', e);
            return;
        }
    }
    else {
        console.log('Env already exists.');
    }
    const packages = ['requests'];
    const packagesStr = packages.join(' ');
    console.log(`Installing ${packagesStr}...`);
    try {
        const cmd = `uv pip install ${packagesStr} -p "${envPath}"`;
        console.log(`Executing: ${cmd}`);
        const { stdout, stderr } = await execPromise(cmd);
        console.log('STDOUT:', stdout);
        console.log('STDERR:', stderr);
    }
    catch (e) {
        console.error('Failed to install packages:', e);
        console.error('Error details:', e.message);
        if (e.stderr)
            console.error('STDERR:', e.stderr);
    }
}
debugInstall();
//# sourceMappingURL=debug_install.js.map