# Lumina AI Workspace

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0b0f19" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.8" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Gemini-Google%20GenAI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
</p>

<p align="center">
  A polished AI chat workspace with streaming responses, markdown-rich conversations, persistent sessions, and image-aware prompts.
</p>

## Overview

Lumina is a modern chat interface built for fast, focused conversations with Gemini. It blends a premium workspace feel with practical tools like saved sessions, response streaming, markdown rendering, image uploads, and code-friendly message formatting.

## Highlights

- Live streaming responses for a more natural chat experience
- Persistent chat sessions with rename, search, and pin support
- Image attachments through both file picker and drag-and-drop
- Markdown rendering with colorful copyable code blocks
- Auto-resizing composer with keyboard shortcuts
- Regenerate and stop controls for better response flow
- Responsive workspace layout for desktop and mobile use

## Tech Stack

| Area | Tools |
| --- | --- |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS |
| State | Zustand, TanStack Query |
| AI | Google GenAI SDK |
| Content Rendering | React Markdown, React Syntax Highlighter |
| Utilities | date-fns, clsx, tailwind-merge |

## Feature Tour

### Chat Experience

- Real-time assistant streaming
- Stop generation while a response is in progress
- Regenerate the latest assistant reply
- Keyboard-friendly prompt composer

### Workspace Tools

- Sidebar session management
- Searchable chat history
- Pin important conversations
- Rename or remove sessions instantly

### Rich Content

- Markdown-aware assistant messages
- Syntax-highlighted code blocks
- One-click copy for fenced code snippets
- Image attachments inside the chat flow

## Screenshots

> Replace these placeholders with actual screenshots when you are ready.

| View | Preview |
| --- | --- |
| Workspace overview | `docs/screenshots/workspace-overview.png` |
| Streaming response | `docs/screenshots/streaming-response.png` |
| Sidebar tools | `docs/screenshots/sidebar-tools.png` |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file and add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Project Structure

```text
src/
  components/   Reusable chat and layout UI
  services/     Gemini integration
  store/        Zustand chat state
  types/        Shared TypeScript types
```

## Why This Project Stands Out

Lumina is more than a basic chatbot shell. It is designed to feel like a polished product, with careful attention to conversation flow, session management, code presentation, and an interface that stays responsive while the model is generating.

## License

This project is available for personal and educational use. Add a formal license if you plan to distribute it publicly.
