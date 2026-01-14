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
  const conversation = messages
    .map((message) => `${message.role === 'assistant' ? 'Assistant' : 'User'}: ${message.content}`)
    .join('\n\n');

  const response = await client.models.generateContent({
    model: modelName,
    contents: `${systemInstruction}\n\n${conversation}`,
  });

  return response.text ?? 'No response generated.';
}
