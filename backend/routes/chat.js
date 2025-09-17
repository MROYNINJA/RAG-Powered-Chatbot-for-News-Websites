const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Redis = require('ioredis');
const embeddingService = require('../services/embedding');
const geminiService = require('../services/gemini');


const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

// Create new session
router.post('/session', async (req, res) => {
  const sessionId = uuidv4();
  await redis.set(`session:${sessionId}`, JSON.stringify({ history: [] }), 'EX', 60*60*24); // 24h TTL
  res.json({ sessionId });
});

// Send message and get response
router.post('/message', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) return res.status(400).json({ error: 'sessionId and message required' });

    // Retrieve history
    const raw = await redis.get(`session:${sessionId}`);
    let session = raw ? JSON.parse(raw) : { history: [] };

    // Save user message
    session.history.push({ role: 'user', text: message, ts: Date.now() });

    // --- RAG steps --
    // 1) Create embedding for query (placeholder)

    const queryEmbedding = await embeddingService.embedText(message);

    // 2) Retrieve top-k docs from vector DB 
  
    const retrieved = await embeddingService.retrieveSimilar(queryEmbedding, 3);

    // 3) Call Gemini 
    const context = retrieved.map((d, i) => `Doc${i+1}: ${d.slice(0,200)}`).join('\n---\n');
    const answer = await geminiService.generateAnswer(message, context);

    // Save bot message
    session.history.push({ role: 'bot', text: answer, ts: Date.now() });

    // Persist session back to Redis with TTL (refresh TTL)
    await redis.set(`session:${sessionId}`, JSON.stringify(session), 'EX', 60*60*24);

    res.json({ answer, retrieved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// Fetch session history
router.get('/history/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  const raw = await redis.get(`session:${sessionId}`);
  if (!raw) return res.status(404).json({ error: 'session not found' });
  res.json(JSON.parse(raw));
});

// Clear session
router.post('/clear', async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
  await redis.del(`session:${sessionId}`);
  res.json({ ok: true });
});

module.exports = router;
