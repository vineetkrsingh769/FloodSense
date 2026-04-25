# FloodSense AI

> Real-time flood detection powered by PyTorch + FastAPI + React 

---

## 📁 Project Structure

```
floodsense/
├── src/                        # React frontend
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── RainBackground.jsx
│   │   └── Chatbot.jsx         # Gemini AI chatbot
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Detect.jsx          # Upload + ML detection
│   │   ├── History.jsx
│   │   └── About.jsx           # QR code + deploy guide
│   ├── utils/
│   │   ├── config.js           # Gemini key + Firebase + API base
│   │   └── history.js          # localStorage helpers
│   ├── App.jsx
│   ├── index.js
│   └── index.css               # All animations + custom styles
├── backend/
│   ├── main.py                 # FastAPI server
│   ├── requirements.txt
│   └── model.pt                # ← Place YOUR model here
├── public/
│   └── index.html
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

---

## 🚀 Quick Start

### 1. Frontend (React)

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

Open: http://localhost:3000

---

### 2. Backend (FastAPI)

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Optional: if your file is outside backend, copy it:
# Windows example:
# copy "C:\Users\devan\OneDrive\Desktop\model.pt\model" ".\model.pt"

# Start server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

API docs: http://localhost:8000/docs

---

### 3. Frontend environment variables

Create `.env` in project root:

```bash
REACT_APP_API_BASE=http://localhost:8000
```

### 4. Backend Gemini proxy key

Create `backend/.env`:

```bash
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 5. Connect Frontend to Backend

`Detect` now sends gallery/camera images as base64 (`image_data`) and URL tab input as `image_url`.
You can also upload `model.pt` directly from the Detect page, which calls backend `/load-model`.

---

## 🔑 API Keys Setup

### Gemini AI
Gemini key is stored only in `backend/.env` and used through `POST /chat`.

### Firebase Setup
1. Go to: https://console.firebase.google.com
2. Create project → Enable Storage + Firestore
3. Copy config to `src/utils/config.js`:
   ```js
   export const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

---

## 📱 Mobile (QR Code)

1. Deploy your site to Vercel (see below)
2. Go to **About** page → click **Generate QR**
3. Share or print the QR code

---

## ☁️ Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Build
npm run build

# Deploy
vercel --prod
```

You'll get a URL like: `https://floodsense.vercel.app`

---

## 🧠 Model Integration

Place your `model.pt` in the `backend/` folder.

The FastAPI server expects:
- **Input**: 224×224 RGB image tensor
- **Output**: Binary classification (index 0 = no flood, index 1 = flood)

If your model has a different output format, update `backend/main.py` accordingly.

---

## ✨ Features

| Feature | Status |
|---|---|
| Gallery image upload | ✅ |
| Camera capture | ✅ |
| URL image load | ✅ |
| model.pt file loader | ✅ |
| ML flood detection (FastAPI) | ✅ |
| Confidence score + water % | ✅ |
| Safety recommendations | ✅ |
| Gemini AI chatbot | ✅ |
| Save / Share / Download report | ✅ |
| History with filter | ✅ |
| QR code generator | ✅ |
| Responsive mobile design | ✅ |
| Animated rain background | ✅ |
| Dark theme + glassmorphism | ✅ |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Tailwind CSS |
| Backend | FastAPI + Python |
| ML Model | PyTorch (model.pt) |
| AI Chatbot | Google Gemini 1.5 Flash |
| Storage | Firebase Storage |
| Database | Firestore |
| Deployment | Vercel (frontend) |

---
