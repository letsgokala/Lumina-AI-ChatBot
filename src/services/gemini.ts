import { Content, GoogleGenAI, Part } from "@google/genai";
import { Message } from "../types/chat";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = "gemini-3-flash-preview";
const systemInstruction =
  "You are Lumina, a premium AI assistant. Support markdown and analyze images if provided.";

function getInlineDataFromAttachment(attachment: string): Part | null {
  const match = attachment.match(/^data:(.+?);base64,(.+)$/);

  if (!match) {
    return null;
  }

  const [, mimeType, data] = match;

  return {
    inlineData: {
      mimeType,
      data,
    },
  };
}

function messageToParts(message: Message): Part[] {
  const parts: Part[] = [];

  if (message.content) {
    parts.push({ text: message.content });
  }

  if (message.attachment) {
    const inlineDataPart = getInlineDataFromAttachment(message.attachment);
    if (inlineDataPart) {
      parts.push(inlineDataPart);
    }
  }

  if (parts.length === 0) {
    parts.push({ text: "" });
  }

  return parts;
}

function messageToContent(message: Message): Content {
  return {
    role: message.role === "assistant" ? "model" : "user",
    parts: messageToParts(message),
  };
}

export async function generateChatResponse(messages: Message[]) {
  if (!apiKey) throw new Error("API key missing");
  if (messages.length === 0) throw new Error("No messages to send");

  const genAI = new GoogleGenAI({ apiKey });
  const lastMsg = messages[messages.length - 1];
  const history = messages.slice(0, -1).map(messageToContent);

  const chat = genAI.chats.create({
    model: modelName,
    config: {
      systemInstruction,
    },
    history,
  });

  const response = await chat.sendMessage({
    message: messageToParts(lastMsg),
  });

  return response.text ?? "No response generated.";
}

export async function streamChatResponse(
  messages: Message[],
  onChunk: (text: string) => void,
  abortSignal?: AbortSignal
) {
  if (!apiKey) throw new Error("API key missing");
  if (messages.length === 0) throw new Error("No messages to send");

  const genAI = new GoogleGenAI({ apiKey });
  const lastMsg = messages[messages.length - 1];
  const history = messages.slice(0, -1).map(messageToContent);

  const chat = genAI.chats.create({
    model: modelName,
    config: {
      systemInstruction,
      abortSignal,
    },
    history,
  });

  const stream = await chat.sendMessageStream({
    message: messageToParts(lastMsg),
    config: {
      abortSignal,
    },
  });

  let fullText = "";

  for await (const chunk of stream) {
    const chunkText = chunk.text ?? "";

    if (!chunkText) {
      continue;
    }

    fullText += chunkText;
    onChunk(fullText);
  }

  if (!fullText) {
    fullText = "No response generated.";
    onChunk(fullText);
  }

  return fullText;
}
