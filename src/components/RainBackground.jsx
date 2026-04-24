import React, { useEffect, useRef } from 'react';

export default function RainBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    for (let i = 0; i < 45; i++) {
      const d = document.createElement('div');
      d.className = 'rain-drop';
      d.style.cssText = `left:${Math.random() * 100}%;height:${55 + Math.random() * 90}px;animation-duration:${0.5 + Math.random() * 1.3}s;animation-delay:${Math.random() * 2.5}s;opacity:${0.07 + Math.random() * 0.22}`;
      container.appendChild(d);
    }
  }, []);

  return (
    <div ref={ref} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} />
  );
}
