import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function ChatBox() {
  const [sessionId, setSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Create session on mount
    fetch(`${API}/api/chat/session`, { method: 'POST' })
      .then(r => r.json())
      .then(data => setSessionId(data.sessionId))
      .catch(console.error);
  }, []);

  const send = async () => {
    if (!input.trim()) return;
    const message = input.trim();
    setInput('');
    // Optimistically add message to UI
    setHistory(h => [...h, { role: 'user', text: message }]);

    const resp = await fetch(`${API}/api/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message })
    });
    const body = await resp.json();
    if (body.answer) {
      setHistory(h => [...h, { role: 'bot', text: body.answer }]);
    } else {
      setHistory(h => [...h, { role: 'bot', text: 'Error: no answer returned' }]);
    }
  };

  const resetSession = async () => {
    if (!sessionId) return;
    await fetch(`${API}/api/chat/clear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    // create new session
    const r = await fetch(`${API}/api/chat/session`, { method: 'POST' });
    const data = await r.json();
    setSessionId(data.sessionId);
    setHistory([]);
  };

  return (
    <div className="chatbox">
      <div className="controls">
        <div>Session: {sessionId || 'loading...'}</div>
        <button onClick={resetSession}>Reset Session</button>
      </div>
      <div className="history">
        {history.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="bubble">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="input">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about the news..." />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;
