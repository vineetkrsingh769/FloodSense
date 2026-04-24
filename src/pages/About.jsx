import React, { useEffect } from 'react';

const STACK = [
  ['#60a5fa', 'Frontend', 'React + Tailwind CSS'],
  ['#34d399', 'Backend', 'FastAPI + Python'],
  ['#a78bfa', 'ML Model', 'PyTorch (model.pt)'],
  ['#fb923c', 'Storage', 'Firebase + Firestore'],
  ['#f472b6', 'AI Chat', 'Google Gemini Pro'],
];

function genQR(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 160, 160);
  ctx.fillStyle = '#050a14';
  const draw7 = (x, y) => {
    ctx.fillRect(x, y, 28, 28); ctx.fillStyle = '#fff'; ctx.fillRect(x + 4, y + 4, 20, 20);
    ctx.fillStyle = '#050a14'; ctx.fillRect(x + 8, y + 8, 12, 12);
  };
  draw7(6, 6); draw7(126, 6); draw7(6, 126);
  let s = window.location.href.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
  for (let r = 0; r < 22; r++) for (let c = 0; c < 22; c++) {
    const x = 6 + c * 7, y = 6 + r * 7;
    if ((r < 5 && c < 5) || (r < 5 && c > 16) || (r > 16 && c < 5)) continue;
    if (rand() > 0.48) { ctx.fillStyle = '#050a14'; ctx.fillRect(x, y, 6, 6); }
  }
  ctx.fillStyle = '#1e5aff'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('FloodSense AI', 80, 155);
}

export default function About() {
  useEffect(() => { genQR('qr-canvas'); }, []);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 100, padding: '100px 1.5rem' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: 8 }}>
            About <span className="shimmer-text">FloodSense</span>
          </h2>
          <p style={{ color: '#64748b' }}>AI-powered flood detection for disaster preparedness</p>
        </div>

        {/* Tech Stack */}
        <div className="glass-card" style={{ borderRadius: 20, padding: 22, marginBottom: 14 }}>
          <h3 className="font-display" style={{ fontWeight: 700, color: 'white', marginBottom: 14, fontSize: 17 }}>🏗️ Tech Stack</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {STACK.map(([color, label, value]) => (
              <div key={label} className="stat-card" style={{ borderRadius: 12, padding: 14 }}>
                <div style={{ color, fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{label}</div>
                <div style={{ color: '#94a3b8', fontSize: 12 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="glass-card" style={{ borderRadius: 20, padding: 22, marginBottom: 14 }}>
          <h3 className="font-display" style={{ fontWeight: 700, color: 'white', marginBottom: 14, fontSize: 17 }}>⚙️ How It Works</h3>
          {[
            ['1', '#60a5fa', 'Upload Image', 'Gallery, camera, or URL — aerial/satellite images recommended'],
            ['2', '#a78bfa', 'Firebase Upload', 'Image is securely uploaded to Firebase Storage'],
            ['3', '#f472b6', 'FastAPI + model.pt', 'PyTorch model analyzes for flood patterns'],
            ['4', '#34d399', 'Gemini AI', 'Results enriched with Gemini safety recommendations'],
            ['5', '#fb923c', 'Save & Share', 'Results saved to Firestore history, downloadable as report'],
          ].map(([n, c, t, d]) => (
            <div key={n} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: c + '22', border: `1px solid ${c}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: c, flexShrink: 0 }}>{n}</div>
              <div>
                <div style={{ color: 'white', fontWeight: 600, fontSize: 14 }}>{t}</div>
                <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>

        {/* QR */}
        <div className="glass-card" style={{ borderRadius: 20, padding: 22, textAlign: 'center', marginBottom: 14 }}>
          <h3 className="font-display" style={{ fontWeight: 700, color: 'white', marginBottom: 6, fontSize: 17 }}>📲 Open on Mobile</h3>
          <p style={{ color: '#64748b', fontSize: 13, marginBottom: 16 }}>Scan QR to use on your phone</p>
          <div style={{ background: 'white', borderRadius: 16, padding: 12, display: 'inline-block' }}>
            <canvas id="qr-canvas" width="160" height="160" />
          </div>
          <button onClick={() => genQR('qr-canvas')} className="btn-primary"
            style={{ display: 'block', margin: '12px auto 0', border: 'none', color: 'white', padding: '9px 20px', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 600, position: 'relative', zIndex: 1 }}>
            Regenerate QR
          </button>
          <p style={{ color: '#334155', fontSize: 11, marginTop: 8 }}>Deploy on Vercel for a real shareable link</p>
        </div>
      </div>
    </div>
  );
}
