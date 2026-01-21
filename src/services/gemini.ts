import { GoogleGenAI } from '@google/genai';
import { Message } from '../types/chat';

const apiKey = process.env.GEMINI_API_KEY;
const modelName = 'gemini-3-flash-preview';
const systemInstruction =
  'You are Lumina, a premium AI assistant. Keep answers clear, helpful, and ready for markdown rendering.';

export async function generateChatResponse(messages: Message[]) {
  if (!apiKey) {
    throw new Error('API key missing');
  }

  if (messages.length === 0) {
    throw new Error('No messages to send');
  }

  const client = new GoogleGenAI({ apiKey });
  const lastMessage = messages[messages.length - 1];
  const history = messages.slice(0, -1)
    .map((message) => `${message.role === 'assistant' ? 'Assistant' : 'User'}: ${message.content}`)
    .join('\n\n');
  const promptParts = [`${systemInstruction}\n\n${history}`.trim(), lastMessage.content].filter(Boolean);

  if (lastMessage.attachment) {
    promptParts.push(`[Image attached: ${lastMessage.attachment.slice(0, 32)}...]`);
  }

  const response = await client.models.generateContent({
    model: modelName,
    contents: promptParts.join('\n\n'),
  });

  return response.text ?? 'No response generated.';
}

export async function streamChatResponse(
  messages: Message[],
  onChunk: (text: string) => void
) {
  if (!apiKey) {
    throw new Error('API key missing');
  }

  if (messages.length === 0) {
    throw new Error('No messages to send');
  }

  const client = new GoogleGenAI({ apiKey });
  const conversation = messages
    .map((message) => `${message.role === 'assistant' ? 'Assistant' : 'User'}: ${message.content}`)
    .join('\n\n');

  const stream = await client.models.generateContentStream({
    model: modelName,
    contents: `${systemInstruction}\n\n${conversation}`,
  });

  let fullText = '';

  for await (const chunk of stream) {
    const chunkText = chunk.text ?? '';

    if (!chunkText) {
      continue;
    }

    fullText += chunkText;
    onChunk(fullText);
  }

  return fullText || 'No response generated.';
}
