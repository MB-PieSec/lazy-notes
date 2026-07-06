import { execSync } from 'child_process';
import { readdirSync, readFileSync, unlinkSync, existsSync } from 'fs';
import path from 'path';
import { getCookiesPath } from '../utils/config.js';

function extractVideoId(url) {
    const patterns = [
        /youtube\.com\/watch\?v=([^&]+)/,
        /youtu\.be\/([^?]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    throw new Error('Could not extract video ID from URL');
}

function parseVtt(vttContent) {
    return vttContent
        .split('\n')
        .filter(line => 
            line.trim() &&
            !line.startsWith('WEBVTT') &&
            !line.startsWith('Kind:') &&
            !line.startsWith('Language:') &&
            !line.includes('-->') &&
            !/^\d+$/.test(line.trim())
        )
        .join(' ')
        .replace(/<[^>]*>/g, '') // remove HTML tags
        .replace(/\s+/g, ' ')    // clean extra spaces
        .trim();
}

export async function getTranscript(url) {
    const videoId = extractVideoId(url);
    const cookiesPath = getCookiesPath() || path.resolve('cookies.txt');

    if (!existsSync(cookiesPath)) {
        throw new Error(
            'YouTube cookies not found. Go to Configure → YouTube Cookies and set your cookies.txt path.\n' +
            '  To export cookies: install "Get cookies.txt LOCALLY" extension in your browser, go to YouTube, export as Netscape format.'
        );
    }
    // run yt-dlp
    execSync(
        `yt-dlp --skip-download --write-auto-sub --sub-lang en --sub-format vtt --cookies "${cookiesPath}" --remote-components ejs:github "https://www.youtube.com/watch?v=${videoId}"`,
        { encoding: 'utf-8' }
    );

    // find the generated .vtt file
    const files = readdirSync('.');
    const vttFile = files.find(f => f.includes(videoId) && f.endsWith('.vtt'));

    if (!vttFile) throw new Error('Transcript file not found');

    // extract title from filename
    const title = vttFile
        .replace(`[${videoId}].en.vtt`, '')
        .trim();

    // read and parse
    const content = readFileSync(vttFile, 'utf-8');
    const transcript = parseVtt(content);

    // clean up the .vtt file
    unlinkSync(vttFile);

    return { transcript, title };
}