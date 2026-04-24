import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deleteFromHistory, clearHistory } from '../utils/history';

export default function History() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => { setItems(getHistory()); }, []);

  function del(id) { deleteFromHistory(id); setItems(getHistory()); }
  function clear() { if (window.confirm('Clear all history?')) { clearHistory(); setItems([]); } }

  const filtered = filter === 'all' ? items : items.filter(x => filter === 'flood' ? x.isFlood : !x.isFlood);

  const filterBtn = (f, label) => (
    <button key={f} onClick={() => setFilter(f)}
      style={{
        border: 'none', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: filter === f ? 600 : 400, transition: '.3s',
        ...(filter === f
          ? { background: 'linear-gradient(135deg,#1e5aff,#0099ff)', color: 'white', position: 'relative', zIndex: 1 }
          : { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', color: '#94a3b8' })
      }}>
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 100, padding: '100px 1.5rem' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 900, color: 'white' }}>History</h2>
            <p style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>{items.length} total analyses</p>
          </div>
          <button onClick={clear}
            style={{ background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.25)', color: '#f87171', padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13 }}>
            🗑️ Clear All
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {filterBtn('all', 'All')}
          {filterBtn('flood', '⚠️ Flood')}
          {filterBtn('safe', '✅ Safe')}
        </div>

        {filtered.length === 0 ? (
          <div className="glass-card" style={{ borderRadius: 18, padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
            <p style={{ color: '#475569' }}>No {filter === 'all' ? '' : filter} results yet.</p>
            <button onClick={() => navigate('/detect')} className="btn-primary"
              style={{ marginTop: 12, border: 'none', color: 'white', padding: '9px 20px', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 600, position: 'relative', zIndex: 1 }}>
              Start Detecting
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(x => (
              <div key={x.id} className="glass-card" style={{ borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 28 }}>{x.isFlood ? '⚠️' : '✅'}</div>
                <div style={{ flex: 1 }}>
                  <div className="font-display" style={{ fontWeight: 700, color: 'white', fontSize: 15 }}>
                    {x.isFlood ? 'Flood Detected' : 'Safe Zone'}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 3 }}>{x.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="font-display" style={{ fontWeight: 800, fontSize: 16, color: x.isFlood ? '#f87171' : '#4ade80' }}>
                    {x.conf}%
                  </div>
                  <div style={{ fontSize: 11, color: '#334155' }}>confidence</div>
                </div>
                <button onClick={() => del(x.id)}
                  style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', fontSize: 16, padding: 4, transition: '.2s' }}
                  onMouseOver={e => e.target.style.color = '#f87171'}
                  onMouseOut={e => e.target.style.color = '#334155'}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
