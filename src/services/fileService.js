import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

export function saveNotes(title, notes) {
    const outputDir = path.resolve('output');
    
    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
    }

    const safeTitle = title
        .replace(/[^a-zA-Z0-9\s-_]/g, '')
        .trim()
        .replace(/\s+/g, '_');

    const filename = `${safeTitle}.md`;
    const filePath = path.join(outputDir, filename);

    writeFileSync(filePath, notes, 'utf-8');

    return filePath;
}