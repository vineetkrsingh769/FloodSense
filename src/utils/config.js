// Frontend talks to backend proxy so Gemini key stays private
export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

function friendlyFetchError(error) {
  if (error instanceof TypeError) {
    return `Cannot reach backend at ${API_BASE}. Start the FastAPI server and try again.`;
  }
  return error.message || 'Request failed';
}

export async function askGemini(userMessage) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || `Chat failed (${res.status})`);
    }
    const data = await res.json();
    return data.reply || 'No response received.';
  } catch (error) {
    throw new Error(friendlyFetchError(error));
  }
}

// ─────────────────────────────────────────────
//  Firebase config  (fill in your project values)
// ─────────────────────────────────────────────
export const firebaseConfig = {
  apiKey:            "YOUR_FIREBASE_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

export async function predictFlood(payload) {
  try {
    const res = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || 'Prediction failed');
    }
    return res.json();
  } catch (error) {
    throw new Error(friendlyFetchError(error));
  }
}

export async function uploadModel(modelFile) {
  const form = new FormData();
  form.append('model_file', modelFile);

  try {
    const res = await fetch(`${API_BASE}/load-model`, {
      method: 'POST',
      body: form
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.detail || 'Model upload failed');
    }

    return res.json();
  } catch (error) {
    throw new Error(friendlyFetchError(error));
  }
}
