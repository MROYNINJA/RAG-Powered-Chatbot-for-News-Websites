import React, { useEffect, useState } from 'react';
import ChatBox from './components/ChatBox';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>RAG Chatbot (News)</h1>
      </header>
      <main>
        <ChatBox />
      </main>
    </div>
  );
}

export default App;
