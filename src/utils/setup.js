import { execSync, spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import ora from 'ora';
import chalk from 'chalk';

function runCommand(command) {
    try {
        execSync(command, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

function isPythonInstalled() {
    return runCommand('python --version') || runCommand('python3 --version');
}

function isYtDlpInstalled() {
    return runCommand('yt-dlp --version');
}

function isDenoInstalled() {
    return runCommand('deno --version');
}

function getPythonScriptsPath() {
    try {
        const result = execSync('python -c "import sysconfig; print(sysconfig.get_path(\'scripts\'))"', { encoding: 'utf-8' });
        return result.trim();
    } catch {
        return null;
    }
}

function addToPath(directory) {
    try {
        // Add permanently to user PATH on Windows
        execSync(`setx PATH "%PATH%;${directory}"`, { stdio: 'ignore' });
        // Also add for current session
        process.env.PATH += `;${directory}`;
        return true;
    } catch {
        return false;
    }
}

function installYtDlp() {
    try {
        execSync('pip install yt-dlp', { stdio: 'ignore' });
        const scriptsPath = getPythonScriptsPath();
        if (scriptsPath) {
            addToPath(scriptsPath);
        }
        return true;
    } catch {
        return false;
    }
}

function installDeno() {
    try {
        console.log(chalk.yellow('Installing Deno...'));
        // Run the official Deno installer for Windows
        execSync('irm https://deno.land/install.ps1 | iex', { 
            stdio: 'inherit', 
            shell: 'powershell.exe' 
        });
        return true;
    } catch (error) {
        console.error('Deno installation failed:', error.message);
        return false;
    }
}

function installNodeModules() {
    try {
        execSync('npm install', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

export async function runSetup() {
    console.log(chalk.bold('\n  Checking dependencies...\n'));

    // Check node_modules
    const modulesSpinner = ora('Checking Node.js dependencies...').start();
    if (!existsSync('node_modules')) {
        modulesSpinner.text = 'Installing Node.js dependencies...';
        if (installNodeModules()) {
            modulesSpinner.succeed('Node.js dependencies installed');
        } else {
            modulesSpinner.fail('Failed to install Node.js dependencies — run npm install manually');
        }
    } else {
        modulesSpinner.succeed('Node.js dependencies ready');
    }

    // Check Python
    const pythonSpinner = ora('Checking Python...').start();
    if (!isPythonInstalled()) {
        pythonSpinner.fail('Python not found — please install Python from python.org');
        process.exit(1);
    } else {
        pythonSpinner.succeed('Python ready');
    }

    // Check yt-dlp
    const ytdlpSpinner = ora('Checking yt-dlp...').start();
    if (!isYtDlpInstalled()) {
        ytdlpSpinner.text = 'Installing yt-dlp...';
        if (installYtDlp()) {
            ytdlpSpinner.succeed('yt-dlp installed and added to PATH');
        } else {
            ytdlpSpinner.fail('Failed to install yt-dlp — run: pip install yt-dlp');
            process.exit(1);
        }
    } else {
        ytdlpSpinner.succeed('yt-dlp ready');
    }

    // Check Deno
    const denoSpinner = ora('Checking Deno...').start();
    if (!isDenoInstalled()) {
        denoSpinner.text = 'Installing Deno...';
        if (installDeno()) {
            denoSpinner.succeed('Deno installed successfully');
            // Give user a note about restarting terminal
            console.log(chalk.yellow('\n⚠️  Please restart your terminal for Deno to be recognized in PATH.'));
        } else {
            denoSpinner.fail('Failed to install Deno');
            process.exit(1);
        }
    } else {
        denoSpinner.succeed('Deno ready');
    }

    console.log(chalk.green('\n✅ All dependencies are ready!\n'));
}