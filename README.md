# RAG-Powered Chatbot - Starter Project

This archive contains a complete starter project (boilerplate) for the RAG Chatbot assignment:
- `backend/` : Node.js + Express backend with Redis session handling and placeholder services for embeddings and LLM.
- `frontend/`: React + SCSS frontend (basic chat UI).

## What to do next
1. Fill in real embedding service implementations (Jina, OpenAI embeddings, etc.) in `backend/services/embedding.js`.
2. Replace the Gemini stub in `backend/services/gemini.js` with real API calls and API keys.
3. Connect a vector database (Qdrant/Chroma/Pinecone) and implement retrieval logic.
4. Optionally persist transcripts in Postgres/MySQL and deploy to Render/Heroku.

## ZIP Contents
The archive contains both frontend and backend folders with everything needed to start development.
