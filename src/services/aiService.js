import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

const MAX_LENGTH = 60000;

const PROMPT = `You are an expert note-taker analyzing a YouTube video transcript. Your goal is to preserve specific details, not generalize.

Generate the following in clean Markdown:

## Summary
3-5 sentences covering the main topic and key argument of the video.

## Key Concepts
For each major concept covered in the video:
- **Concept name**: Detailed explanation of HOW it works, not just WHAT it is. Include specific examples from the video.

## Practical Takeaways
What can the reader actually DO or apply after watching this video? Be specific.

## Flashcards
5-8 high quality cards only. Prioritize specific, testable knowledge over general concepts.

**Q:** specific question
**A:** specific answer with enough detail to actually be useful

IMPORTANT RULES:
- Never generalize. If the video explains HOW something works, capture that explanation in full.
- Preserve specific numbers, names, and examples from the transcript.
- Quality over quantity — fewer detailed notes beat many shallow ones.
- Do not make up information not present in the transcript.`;

export async function generateNotes(transcript, apiKey, provider) {
    const truncatedTranscript = transcript.length > MAX_LENGTH
        ? transcript.substring(0, MAX_LENGTH) + '...[transcript truncated]'
        : transcript;

    const content = `${PROMPT}\n\nTranscript:\n${truncatedTranscript}`;

    if (provider === 'Gemini') {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
        const result = await model.generateContent(content);
        return result.response.text();
    }

    if (provider === 'Claude') {
        const client = new Anthropic({ apiKey });
        const message = await client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            messages: [{ role: 'user', content }]
        });
        return message.content[0].text;
    }

    if (provider === 'OpenAI') {
        const client = new OpenAI({ apiKey });
        const result = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content }]
        });
        return result.choices[0].message.content;
    }

    if (provider === 'Groq') {
        const client = new OpenAI({
            apiKey,
            baseURL: 'https://api.groq.com/openai/v1'
        });
        const result = await client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content }]
        });
        return result.choices[0].message.content;
    }

    if (provider === 'Grok') {
        const client = new OpenAI({
            apiKey,
            baseURL: 'https://api.x.ai/v1'
        });
        const result = await client.chat.completions.create({
            model: 'grok-3',
            messages: [{ role: 'user', content }]
        });
        return result.choices[0].message.content;
    }
  
    if (provider === 'OpenRouter') {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.1-8b-instruct',
                messages: [{ role: 'user', content }]
            })
        });
        const data = await response.json();
        
        if (!response.ok || !data.choices?.[0]) {
            throw new Error(`OpenRouter error: ${JSON.stringify(data.error || data)}`);
        }
        
        return data.choices[0].message.content;
    }
    throw new Error(`Provider ${provider} not yet implemented`);
}