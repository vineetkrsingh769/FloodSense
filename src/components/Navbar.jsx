import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const links = [
  { path: '/', label: 'Home' },
  { path: '/detect', label: 'Detect' },
  { path: '/history', label: 'History' },
  { path: '/about', label: 'About' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <>
      {/* Desktop nav */}
      <nav className="glass desktop-nav fixed top-0 left-0 right-0 z-50 px-6 py-3.5">
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="btn-primary" style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, position: 'relative', zIndex: 1 }}>🌊</div>
            <span className="font-display" style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>
              Flood<span className="shimmer-text">Sense</span>
            </span>
          </div>

          <div className="flex gap-8">
            {links.map(({ path, label }) => (
              <button key={path} onClick={() => navigate(path)}
                className={`nav-link bg-transparent border-0 cursor-pointer text-sm ${pathname === path ? 'active' : ''}`}>
                {label}
              </button>
            ))}
          </div>

          <button onClick={() => navigate('/detect')} className="btn-primary"
            style={{ color: 'white', fontSize: 13, fontWeight: 700, padding: '8px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative', zIndex: 1 }}>
            Try Now →
          </button>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav glass fixed bottom-0 left-0 right-0 z-50" style={{ display: 'none' }}>
        <div className="flex justify-around py-2.5 pb-4">
          {[['/', '🏠', 'Home'], ['/detect', '🔍', 'Detect'], ['/history', '📊', 'History'], ['/about', 'ℹ️', 'About']].map(([p, e, l]) => (
            <button key={p} onClick={() => navigate(p)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: pathname === p ? '#60a5fa' : '#475569', fontSize: 11 }}>
              <span style={{ fontSize: 20 }}>{e}</span>{l}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
