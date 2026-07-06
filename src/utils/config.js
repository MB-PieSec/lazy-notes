import crypto from 'crypto';
import os from 'os';
import path from 'path';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs';

const CONFIG_DIR = path.join(os.homedir(), '.lazynotes');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const ALGORITHM = 'aes-256-cbc';

// Use machine hostname as encryption secret
function getEncryptionKey() {
    return crypto
        .createHash('sha256')
        .update(os.hostname())
        .digest('hex')
        .substring(0, 32);
}

function encrypt(text) {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    const key = getEncryptionKey();
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString();
}

function loadConfig() {
    if (!existsSync(CONFIG_FILE)) return {};
    try {
        return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
    } catch {
        return {};
    }
}

function saveConfig(config) {
    if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
    writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getApiKey(provider) {
    const config = loadConfig();
    const encrypted = config[provider.toLowerCase()];
    if (!encrypted) return null;
    try {
        return decrypt(encrypted);
    } catch {
        return null;
    }
}

export function setApiKey(provider, apiKey) {
    const config = loadConfig();
    config[provider.toLowerCase()] = encrypt(apiKey);
    saveConfig(config);
}

export function getConfiguredProviders() {
    const config = loadConfig();
    return Object.keys(config);
}

export function removeApiKey(provider) {
    const config = loadConfig();
    delete config[provider.toLowerCase()];
    saveConfig(config);
}

export function getCookiesPath() {
    const config = loadConfig();
    return config.cookiesPath || null;
}

export function setCookiesPath(cookiesPath) {
    const config = loadConfig();
    config.cookiesPath = cookiesPath;
    saveConfig(config);
}