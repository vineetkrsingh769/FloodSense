import React, { useState, useRef } from 'react';
import { saveToHistory, incrementAnalysisCount } from '../utils/history';
import { predictFlood, uploadModel } from '../utils/config';

const FLOOD_RECOS = [
  '🚨 Move to higher ground immediately',
  '📱 Call emergency services: 112',
  '🔌 Disconnect electrical appliances near water',
  '🧳 Prepare kit: water, food, documents',
  '🚗 Never drive through flooded roads',
];
const SAFE_RECOS = [
  '✅ Area looks safe — keep monitoring',
  '📡 Stay updated with local weather alerts',
  '🌧️ Watch rainfall forecasts coming days',
  '💧 Ensure drainage systems are clear',
  '📋 Review your local emergency flood plan',
];

export default function Detect() {
  const [tab, setTab] = useState('gallery');
  const [preview, setPreview] = useState(null);
  const [modelName, setModelName] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [camActive, setCamActive] = useState(false);
  const [saved, setSaved] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);

  const fileRef = useRef();
  const modelRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();
  const streamRef = useRef(null);

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }

  async function loadModel(e) {
    const f = e.target.files[0];
    if (!f) return;
    setModelLoading(true);
    try {
      await uploadModel(f);
      setModelName(f.name);
      alert('Model uploaded and loaded successfully.');
    } catch (err) {
      alert(`Model upload failed: ${err.message}`);
      setModelName(null);
    } finally {
      setModelLoading(false);
    }
  }

  function loadUrl() {
    const url = document.getElementById('url-input').value.trim();
    if (url) setPreview(url);
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setCamActive(true);
    } catch { alert('Camera access denied. Please allow camera permission.'); }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCamActive(false);
  }

  function capturePhoto() {
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    c.toBlob(blob => {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target.result);
      reader.readAsDataURL(blob);
      stopCamera(); setTab('gallery');
    }, 'image/jpeg', 0.92);
  }

  function switchTab(t) {
    setTab(t);
    if (t === 'camera') startCamera(); else stopCamera();
  }

  async function runDetect() {
    if (!preview) { alert('Please upload or capture an image first!'); return; }
    setLoading(true);
    setResult(null);
    try {
      const payload = preview.startsWith('data:image')
        ? { image_data: preview }
        : { image_url: preview };
      const res = await predictFlood(payload);
      const r = {
        isFlood: res.prediction === 'flood',
        conf: Number(res.confidence ?? 0).toFixed(1),
        water: Math.round(Number(res.water_percent ?? 0)),
        ptime: Number(res.process_time ?? 0).toFixed(2)
      };
      setResult(r);
      incrementAnalysisCount();
      setSaved(false);
    } catch (err) {
      alert(`Detection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function doSave() {
    if (!result) return;
    saveToHistory(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function doShare() {
    if (!result) return;
    const text = `FloodSense AI: ${result.isFlood ? '⚠️ FLOOD DETECTED' : '✅ SAFE'} | Confidence: ${result.conf}%`;
    if (navigator.share) navigator.share({ title: 'FloodSense Result', text, url: window.location.href });
    else navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
  }

  function doDownload() {
    if (!result) return;
    const text = `FloodSense AI Report\n${'─'.repeat(38)}\nDate: ${new Date().toLocaleString()}\nResult: ${result.isFlood ? 'FLOOD DETECTED' : 'SAFE'}\nConfidence: ${result.conf}%\nWater Coverage: ${result.water}%\nProcess Time: ${result.ptime}s\nModel: ${modelName || 'Simulated'}\n\nPowered by FloodSense AI + Gemini`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = 'floodsense-report.txt';
    a.click();
  }

  const tabStyle = active => ({
    flex: 1, padding: '10px', borderRadius: 12, border: 'none', cursor: 'pointer',
    fontSize: 13, fontWeight: 600, transition: '.3s',
    ...(active
      ? { background: 'linear-gradient(135deg,#1e5aff,#0099ff)', color: 'white', position: 'relative', zIndex: 1 }
      : { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', color: '#94a3b8' })
  });

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100, paddingBottom: 100, padding: '100px 1.5rem' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem,5vw,2.4rem)', fontWeight: 900, color: 'white', marginBottom: 8 }}>
            Flood <span className="shimmer-text">Detection</span>
          </h2>
          <p style={{ color: '#64748b' }}>Upload or capture an image to analyze flood risk with AI</p>
        </div>

        {/* Model loader */}
        <div className="glass-card" style={{ borderRadius: 18, padding: 18, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>🧠</span>
            <div style={{ flex: 1 }}>
              <div className="font-display" style={{ fontWeight: 700, color: 'white', fontSize: 15 }}>ML Model (model.pt)</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Upload your PyTorch model file</div>
            </div>
            <div style={{
              background: modelName ? 'rgba(0,255,100,.1)' : 'rgba(255,80,80,.12)',
              border: modelName ? '1px solid rgba(0,255,100,.3)' : '1px solid rgba(255,80,80,.3)',
              color: modelName ? '#4ade80' : '#f87171',
              fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 8
            }}>
              {modelLoading ? 'Uploading...' : modelName ? '✓ ' + modelName.substring(0, 20) : 'Not Loaded'}
            </div>
          </div>
          <label className="upload-zone" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, cursor: 'pointer', borderRadius: 12, padding: 12 }}>
            <input ref={modelRef} type="file" accept=".pt,.pth" style={{ display: 'none' }} onChange={loadModel} />
            <span style={{ fontSize: 16, color: '#60a5fa' }}>📂</span>
            <span style={{ fontSize: 13, color: '#64748b' }}>Click to upload model.pt / model.pth</span>
          </label>
        </div>

        {/* Model loader */}
        <div className="glass-card" style={{ borderRadius: 18, padding: 18, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>🧠</span>
            <div style={{ flex: 1 }}>
              <div className="font-display" style={{ fontWeight: 700, color: 'white', fontSize: 15 }}>ML Model (model.pt)</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Upload your PyTorch model file</div>
            </div>
            <div style={{
              background: modelName ? 'rgba(0,255,100,.1)' : 'rgba(255,80,80,.12)',
              border: modelName ? '1px solid rgba(0,255,100,.3)' : '1px solid rgba(255,80,80,.3)',
              color: modelName ? '#4ade80' : '#f87171',
              fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 8
            }}>
              {modelLoading ? 'Uploading...' : modelName ? '✓ ' + modelName.substring(0, 20) : 'Not Loaded'}
            </div>
          </div>
          <label className="upload-zone" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, cursor: 'pointer', borderRadius: 12, padding: 12 }}>
            <input ref={modelRef} type="file" accept=".pt,.pth" style={{ display: 'none' }} onChange={loadModel} />
            <span style={{ fontSize: 16, color: '#60a5fa' }}>📂</span>
            <span style={{ fontSize: 13, color: '#64748b' }}>Click to upload model.pt / model.pth</span>
          </label>
        </div>

        {/* Image upload card */}
        <div className="glass-card" style={{ borderRadius: 20, padding: 22, marginBottom: 16 }}>
          <h3 className="font-display" style={{ fontWeight: 700, color: 'white', marginBottom: 14, fontSize: 17 }}>📸 Upload Image</h3>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[['gallery', '📁 Gallery'], ['camera', '📷 Camera'], ['url', '🔗 URL']].map(([t, l]) => (
              <button key={t} onClick={() => switchTab(t)} style={tabStyle(tab === t)}>{l}</button>
            ))}
          </div>

          {/* Gallery */}
          {tab === 'gallery' && (
            <label
              className="upload-zone"
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
              onDragLeave={e => e.currentTarget.classList.remove('drag-over')}
              onDrop={e => { e.currentTarget.classList.remove('drag-over'); handleDrop(e); }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 16, padding: 40, cursor: 'pointer', minHeight: 200, position: 'relative', overflow: 'hidden' }}>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              {preview ? (
                <div style={{ width: '100%', position: 'relative' }}>
                  <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 260, objectFit: 'contain', borderRadius: 12 }} />
                  {loading && <div className="scan-line" />}
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🌊</div>
                  <p style={{ color: 'white', fontWeight: 600, marginBottom: 4 }}>Drag & drop or click to upload</p>
                  <p style={{ color: '#475569', fontSize: 13 }}>PNG · JPG · WEBP — aerial/satellite images work best</p>
                </div>
              )}
            </label>
          )}

          {/* Camera */}
          {tab === 'camera' && (
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#000', aspectRatio: '4/3', maxHeight: 280 }}>
              <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay playsInline />
              {camActive && <div className="scan-line" />}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <button onClick={capturePhoto}
                style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', width: 60, height: 60, borderRadius: '50%', border: '3px solid white', background: 'rgba(255,255,255,.2)', cursor: 'pointer', fontSize: 22 }}>
                📸
              </button>
            </div>
          )}

          {/* URL */}
          {tab === 'url' && (
            <div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input id="url-input" type="url" placeholder="https://example.com/flood-image.jpg"
                  style={{ flex: 1, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: '10px 14px', color: 'white', fontSize: 13, outline: 'none' }} />
                <button onClick={loadUrl} className="btn-primary"
                  style={{ border: 'none', color: 'white', padding: '10px 16px', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: 13, position: 'relative', zIndex: 1 }}>
                  Load
                </button>
              </div>
              {preview && tab === 'url' && (
                <img src={preview} alt="url preview" style={{ width: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 12, marginTop: 12 }} />
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button onClick={runDetect} disabled={loading} className="btn-primary font-display"
            style={{ flex: 1, border: 'none', color: 'white', padding: 16, borderRadius: 16, cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative', zIndex: 1, opacity: loading ? 0.8 : 1 }}>
            {loading ? <><span className="spinner" /> Analyzing...</> : <><span>🔍</span> Analyze for Floods</>}
          </button>
          <button onClick={() => { setPreview(null); setResult(null); }} className="btn-ghost"
            style={{ padding: '16px 20px', borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 14 }}>
            Clear
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="slide-up">
            <div className="glass-card" style={{ borderRadius: 20, padding: 22, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div className="float-anim" style={{ fontSize: 44 }}>{result.isFlood ? '⚠️' : '✅'}</div>
                <div style={{ flex: 1 }}>
                  <div className="font-display" style={{ fontSize: 22, fontWeight: 900, marginBottom: 4, color: result.isFlood ? '#f87171' : '#4ade80' }}>
                    {result.isFlood ? 'Flood Detected' : 'No Flood Detected'}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>
                    {result.isFlood ? 'High risk — immediate action may be needed' : 'Area appears safe — no significant flood risk'}
                  </div>
                </div>
                <div style={{
                  background: result.isFlood ? 'rgba(239,68,68,.15)' : 'rgba(74,222,128,.1)',
                  border: result.isFlood ? '1px solid rgba(239,68,68,.35)' : '1px solid rgba(74,222,128,.3)',
                  color: result.isFlood ? '#f87171' : '#4ade80',
                  fontSize: 11, fontWeight: 800, padding: '6px 12px', borderRadius: 8
                }}>
                  {result.isFlood ? 'HIGH RISK' : 'SAFE'}
                </div>
              </div>

              {/* Confidence bar */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: '#64748b' }}>Confidence Score</span>
                  <span style={{ fontWeight: 700, color: 'white' }}>{result.conf}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                  <div className="progress-bar"
                    style={{ width: result.conf + '%', background: result.isFlood ? 'linear-gradient(90deg,#f87171,#ef4444)' : 'linear-gradient(90deg,#4ade80,#22c55e)' }} />
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[
                  [result.isFlood ? 'HIGH' : 'LOW', result.isFlood ? '#f87171' : '#4ade80', 'Risk'],
                  [result.water + '%', '#60a5fa', 'Water %'],
                  [result.ptime + 's', '#34d399', 'Process'],
                ].map(([v, c, l]) => (
                  <div key={l} className="stat-card" style={{ borderRadius: 12, padding: 12, textAlign: 'center' }}>
                    <div className="font-display" style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-card" style={{ borderRadius: 20, padding: 20, marginBottom: 12 }}>
              <h3 className="font-display" style={{ fontWeight: 700, color: 'white', fontSize: 15, marginBottom: 12 }}>🛡️ Safety Recommendations</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(result.isFlood ? FLOOD_RECOS : SAFE_RECOS).map(r => (
                  <div key={r} style={{
                    padding: '10px 12px', borderRadius: 10, fontSize: 13, color: '#cbd5e1',
                    background: result.isFlood ? 'rgba(239,68,68,.06)' : 'rgba(74,222,128,.05)',
                    border: result.isFlood ? '1px solid rgba(239,68,68,.12)' : '1px solid rgba(74,222,128,.12)'
                  }}>{r}</div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={doSave} className="btn-primary"
                style={{ flex: 1, border: 'none', color: 'white', padding: 13, borderRadius: 14, cursor: 'pointer', fontWeight: 600, fontSize: 14, position: 'relative', zIndex: 1 }}>
                {saved ? '✅ Saved!' : '💾 Save'}
              </button>
              <button onClick={doShare} className="btn-ghost"
                style={{ flex: 1, border: '1px solid rgba(255,255,255,.08)', padding: 13, borderRadius: 14, cursor: 'pointer', fontSize: 14 }}>
                📤 Share
              </button>
              <button onClick={doDownload} className="btn-ghost"
                style={{ border: '1px solid rgba(255,255,255,.08)', padding: '13px 16px', borderRadius: 14, cursor: 'pointer', fontSize: 14 }}>
                ⬇️
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
