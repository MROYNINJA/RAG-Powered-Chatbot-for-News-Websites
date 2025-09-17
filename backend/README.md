# Backend - RAG Chatbot

## Overview
This Node.js + Express backend provides endpoints to:
- Create a new session (`POST /api/chat/session`)
- Send a message and receive an answer (`POST /api/chat/message`)
- Fetch session history (`GET /api/chat/history/:sessionId`)
- Clear a session (`POST /api/chat/clear`)

It uses Redis to store session histories and includes placeholder services for embeddings and LLM calls.

## Quickstart
1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies: `npm install`
3. Start Redis locally or provide `REDIS_URL`.
4. Run: `npm run dev`
