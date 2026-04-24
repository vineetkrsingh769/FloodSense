import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalysisCount } from '../utils/history';

const FEATURES = [
  ['🧠', 'Deep Learning', 'YOLOv8 + ResNet50 trained on 50K+ flood images for maximum precision detection'],
  ['⚡', 'Instant Results', 'Predictions in under 2 seconds with full confidence scores and risk analysis'],
  ['🤖', 'Gemini AI Chat', 'Ask anything about floods, safety, or this app — powered by Google Gemini Pro'],
  ['📱', 'Mobile Ready', 'Camera upload + gallery. Open on any device by scanning the QR code'],
  ['🔒', 'Secure Storage', 'Firebase-backed image storage and Firestore for history. Your data stays private'],
  ['📊', 'Full Dashboard', 'Track all analyses, filter by flood/safe, view trends, download reports'],
];

export default function Home() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const target = getAnalysisCount();

  useEffect(() => {
    let c = 0;
    const step = Math.ceil(target / 80);
    const t = setInterval(() => {
      c = Math.min(c + step, target);
      setCount(c);
      if (c >= target) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [target]);

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, position: 'relative', overflow: 'hidden' }}>
      <div className="wave-bg" />

      {/* Hero */}
      <section style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <div className="float-anim" style={{ marginBottom: '2rem', position: 'relative', display: 'inline-block' }}>
          <div className="btn-primary" style={{ width: 110, height: 110, borderRadius: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, position: 'relative', zIndex: 1, margin: '0 auto' }}>🌊</div>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 28, background: 'rgba(30,90,255,.25)', animation: 'pulse-ring 2.2s infinite' }} />
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(30,90,255,.12)', border: '1px solid rgba(30,90,255,.25)', borderRadius: 999, padding: '6px 16px', fontSize: 12, color: '#93c5fd', marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', display: 'inline-block' }} />
          Gemini AI • Real-Time • 99.2% Accuracy
        </div>

        <h1 className="font-display" style={{ fontSize: 'clamp(2.4rem,6vw,4.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '1.2rem' }}>
          Detect Floods<br /><span className="shimmer-text">Instantly</span> with AI
        </h1>
        <p style={{ color: '#64748b', fontSize: 'clamp(1rem,2.5vw,1.15rem)', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Upload an aerial or satellite image. Get real-time flood predictions powered by deep learning + Gemini AI assistant.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          <button onClick={() => navigate('/detect')} className="btn-primary font-display"
            style={{ color: 'white', fontSize: 16, fontWeight: 800, padding: '14px 34px', borderRadius: 16, border: 'none', cursor: 'pointer', position: 'relative', zIndex: 1 }}>
            🔍 Start Detection
          </button>
          <button onClick={() => navigate('/about')} className="btn-ghost font-display"
            style={{ fontSize: 16, fontWeight: 800, padding: '14px 34px', borderRadius: 16, cursor: 'pointer' }}>
            💬 Learn More
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, maxWidth: 480, margin: '3.5rem auto 0', width: '100%' }}>
          {[
            [count.toLocaleString(), '#60a5fa', 'Analyzed'],
            ['99.2%', '#34d399', 'Accuracy'],
            ['< 2s', '#a78bfa', 'Response'],
          ].map(([v, c, l]) => (
            <div key={l} className="stat-card" style={{ borderRadius: 16, padding: 16, textAlign: 'center' }}>
              <div className="font-display" style={{ fontSize: 28, fontWeight: 900, color: c }}>{v}</div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h2 className="font-display" style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center', color: 'white', marginBottom: '2.5rem' }}>
          Why <span className="shimmer-text">FloodSense?</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 16 }}>
          {FEATURES.map(([emoji, title, desc]) => (
            <div key={title} className="glass-card" style={{ borderRadius: 18, padding: 22 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{emoji}</div>
              <h3 className="font-display" style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 6 }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '3rem 1.5rem 6rem', position: 'relative', zIndex: 1 }}>
        <h2 className="font-display" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 12 }}>Ready to detect floods?</h2>
        <p style={{ color: '#475569', marginBottom: 24 }}>Upload your first image and see AI in action</p>
        <button onClick={() => navigate('/detect')} className="btn-primary font-display"
          style={{ color: 'white', fontSize: 18, fontWeight: 800, padding: '16px 44px', borderRadius: 18, border: 'none', cursor: 'pointer', position: 'relative', zIndex: 1 }}>
          🚀 Get Started Free
        </button>
      </section>
    </div>
  );
}
