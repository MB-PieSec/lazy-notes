import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

if (!existsSync('./node_modules')) {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('Done! Starting Lazy Notes...\n');
}

await import('./src/cli/index.js');