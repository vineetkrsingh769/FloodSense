import React, { useState, useRef, useEffect } from 'react';
import { askGemini } from '../utils/config';

const QUICK = ['Flood safety tips', 'How does detection work?', 'Emergency contacts India', 'What to do after a flood'];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am FloodSense AI powered by Gemini 🌊 Ask me anything about floods, disaster safety, or this app!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages]);

  async function send(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const reply = await askGemini(msg);
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: `Gemini error: ${e.message}` }]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* FAB */}
      {!open && (
        <button onClick={() => setOpen(true)} className="btn-primary chat-fab"
          style={{ position: 'fixed', bottom: 80, right: 16, zIndex: 99, width: 54, height: 54, borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          🤖
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div style={{ position: 'fixed', bottom: 80, right: 16, zIndex: 100, width: 'min(340px, calc(100vw - 32px))', animation: 'fade-in .25s ease' }}>
          <div className="glass-card" style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 60px rgba(30,90,255,.35)' }}>

            {/* Header */}
            <div className="btn-primary" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
                <div>
                  <div className="font-display" style={{ fontWeight: 800, color: 'white', fontSize: 14 }}>FloodSense AI</div>
                  <div style={{ color: '#93c5fd', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00ff88', display: 'inline-block' }} />
                    Gemini 1.5 Flash · Online
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>

            {/* Messages */}
            <div ref={msgsRef} style={{ height: 280, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, background: 'rgba(5,10,20,.85)' }}>
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'chat-user' : 'chat-ai'}>{m.text}</div>
              ))}
              {loading && (
                <div className="chat-ai">
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick prompts */}
            <div style={{ padding: '8px 12px', display: 'flex', gap: 6, overflowX: 'auto', background: 'rgba(5,10,20,.9)', borderTop: '1px solid rgba(255,255,255,.05)' }}>
              {QUICK.map(q => (
                <button key={q} onClick={() => send(q)}
                  style={{ background: 'rgba(30,90,255,.15)', border: '1px solid rgba(30,90,255,.25)', color: '#93c5fd', fontSize: 11, padding: '5px 10px', borderRadius: 8, whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0, transition: '.2s' }}>
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: 10, background: 'rgba(5,10,20,.95)', borderTop: '1px solid rgba(255,255,255,.05)', display: 'flex', gap: 8 }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about floods..."
                style={{ flex: 1, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '9px 13px', color: 'white', fontSize: 13, outline: 'none' }}
              />
              <button onClick={() => send()} className="btn-primary"
                style={{ width: 38, height: 38, borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, flexShrink: 0 }}>
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
