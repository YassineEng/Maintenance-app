const nodeId = 'test-node-123';
const baseUrl = 'http://127.0.0.1:3000/scripts';

async function verify() {
    console.log('Starting backend verification...');

    // 1. Create Env
    console.log(`\n1. Creating environment for ${nodeId}...`);
    try {
        const res = await fetch(`${baseUrl}/${nodeId}/env`, { method: 'POST' });
        if (res.ok) console.log('✅ Environment created.');
        else console.error('❌ Failed to create environment:', await res.text());
    } catch (e) { console.error('❌ Error creating environment:', e); }

    // 2. Install Packages
    console.log(`\n2. Installing packages (requests)...`);
    try {
        const res = await fetch(`${baseUrl}/${nodeId}/packages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ packages: ['requests'] })
        });
        if (res.ok) console.log('✅ Packages installed.');
        else console.error('❌ Failed to install packages:', await res.text());
    } catch (e) { console.error('❌ Error installing packages:', e); }

    // 3. Run Script
    console.log(`\n3. Running script...`);
    const code = `
import requests
print("Requests version:", requests.__version__)
print("Hello from isolated environment!")
`;
    try {
        const res = await fetch(`${baseUrl}/${nodeId}/run`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        const data = await res.json();
        if (res.ok) {
            console.log('✅ Script executed successfully.');
            console.log('Output:', data.output);
        } else {
            console.error('❌ Failed to run script:', data);
        }
    } catch (e) { console.error('❌ Error running script:', e); }

    // 4. Delete Env
    console.log(`\n4. Deleting environment...`);
    try {
        const res = await fetch(`${baseUrl}/${nodeId}/env`, { method: 'DELETE' });
        if (res.ok) console.log('✅ Environment deleted.');
        else console.error('❌ Failed to delete environment:', await res.text());
    } catch (e) { console.error('❌ Error deleting environment:', e); }
}

verify();
