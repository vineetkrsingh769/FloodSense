"""
FloodSense AI — FastAPI Backend
Run: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

from pathlib import Path
import tempfile
import shutil
import base64
import os
import zipfile

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import torch
import torchvision.transforms as transforms
from PIL import Image
import requests
from io import BytesIO
import time

app = FastAPI(title="FloodSense AI API", version="1.1.0")

# ── CORS (allow React dev server + production) ───────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Restrict to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load model ───────────────────────────────────────────────────────────────
BACKEND_DIR = Path(__file__).resolve().parent
load_dotenv(BACKEND_DIR / ".env")
MODEL_PATH = BACKEND_DIR / "model.pt"
MODEL_DIR_PATH = BACKEND_DIR / "model"
model = None
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-latest")
FLOOD_CLASS_INDEX = int(os.getenv("FLOOD_CLASS_INDEX", "0"))

def _load_torch_model(model_path: Path):
    try:
        loaded = torch.jit.load(str(model_path), map_location=torch.device("cpu"))
    except Exception:
        loaded = torch.load(model_path, map_location=torch.device("cpu"), weights_only=False)
    loaded.eval()
    return loaded

def _pack_model_dir_to_temp_archive(model_dir: Path) -> Path:
    if not model_dir.exists() or not model_dir.is_dir():
        raise FileNotFoundError(f"Model directory not found: {model_dir}")

    # Some exports unpack as backend/model/model/...; normalize to inner folder.
    source_dir = model_dir / "model" if (model_dir / "model").is_dir() else model_dir

    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pt")
    temp_file.close()
    archive_path = Path(temp_file.name)

    with zipfile.ZipFile(archive_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for file_path in source_dir.rglob("*"):
            if file_path.is_file():
                arcname = "model/" + file_path.relative_to(source_dir).as_posix()
                zf.write(file_path, arcname=arcname)
    return archive_path

def load_model(model_path: Path = MODEL_PATH):
    global model
    temp_archive = None
    try:
        source = model_path
        if source.exists() and source.is_dir():
            temp_archive = _pack_model_dir_to_temp_archive(source)
            source = temp_archive
        elif not source.exists() and MODEL_DIR_PATH.exists():
            temp_archive = _pack_model_dir_to_temp_archive(MODEL_DIR_PATH)
            source = temp_archive

        model = _load_torch_model(source)
        print(f"Loaded model from {source}")
        return True
    except FileNotFoundError:
        model = None
        print("model.pt/model directory not found - running in demo mode")
    except Exception as exc:
        model = None
        print(f"Failed to load model ({exc}) - running in demo mode")
    finally:
        if temp_archive is not None:
            temp_archive.unlink(missing_ok=True)
    return False

load_model()

# ── Image preprocessing ──────────────────────────────────────────────────────
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

# ── Schemas ──────────────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    image_url: str | None = None
    image_data: str | None = None

class PredictResponse(BaseModel):
    prediction: str        # "flood" | "no_flood"
    confidence: float      # 0.0 – 100.0
    water_percent: float
    process_time: float
    message: str

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str


def decode_base64_image(image_data: str) -> Image.Image:
    """Decode data URL or raw base64 image data."""
    try:
        payload = image_data.split(",", 1)[1] if "," in image_data else image_data
        image_bytes = base64.b64decode(payload, validate=True)
        return Image.open(BytesIO(image_bytes)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid image_data: {exc}") from exc

# ── Endpoints ────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "status": "FloodSense AI API running",
        "model_loaded": model is not None,
        "model_path": str(MODEL_PATH),
        "model_dir_path": str(MODEL_DIR_PATH),
    }

@app.get("/health")
def health():
    return {
        "ok": True,
        "model_loaded": model is not None,
        "gemini_configured": bool(GEMINI_API_KEY),
        "flood_class_index": FLOOD_CLASS_INDEX,
    }


@app.post("/chat", response_model=ChatResponse)
def chat_with_gemini(req: ChatRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini key is missing on backend")

    message = req.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    prompt = (
        "You are FloodSense AI, a helpful assistant specializing in flood detection, "
        "disaster preparedness, water safety, and the FloodSense app "
        "(built with React + FastAPI + PyTorch + Firebase). "
        "Keep answers concise (2-4 sentences). Be friendly, practical and empathetic. "
        f"User asked: {message}"
    )

    candidate_models = [GEMINI_MODEL, "gemini-flash-latest", "gemini-2.0-flash", "gemini-2.0-flash-lite"]
    # Keep order, drop duplicates.
    unique_models = list(dict.fromkeys(candidate_models))
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"maxOutputTokens": 220, "temperature": 0.7},
    }

    try:
        last_error = None
        data = None
        for model_name in unique_models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={GEMINI_API_KEY}"
            try:
                resp = requests.post(url, json=payload, timeout=35)
                if not resp.ok:
                    last_error = f"{model_name}: {resp.status_code} {resp.text[:180]}"
                    continue
                data = resp.json()
                break
            except Exception as exc:
                last_error = f"{model_name}: {exc}"
                continue

        if data is None:
            raise HTTPException(status_code=502, detail=f"Gemini request failed: {last_error}")
        reply = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text")
        if not reply:
            raise HTTPException(status_code=502, detail="No response received from Gemini")
        return ChatResponse(reply=reply)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Gemini request failed: {exc}") from exc


@app.post("/load-model")
async def load_model_endpoint(model_file: UploadFile = File(...)):
    suffix = Path(model_file.filename or "").suffix.lower()
    if suffix not in {".pt", ".pth"}:
        raise HTTPException(status_code=400, detail="Only .pt or .pth files are supported")

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(model_file.file, tmp)
        temp_path = Path(tmp.name)

    try:
        # Validate before replacing the active model file.
        _load_torch_model(temp_path)
        shutil.copyfile(temp_path, MODEL_PATH)
        load_model(MODEL_PATH)
        return {"ok": True, "message": f"Model uploaded and loaded: {model_file.filename}"}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to load model: {exc}") from exc
    finally:
        temp_path.unlink(missing_ok=True)

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    start = time.time()

    if req.image_data:
        img = decode_base64_image(req.image_data)
    elif req.image_url:
        try:
            resp = requests.get(req.image_url, timeout=10)
            resp.raise_for_status()
            img = Image.open(BytesIO(resp.content)).convert("RGB")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Could not load image_url: {e}") from e
    else:
        raise HTTPException(status_code=400, detail="Provide either image_url or image_data")

    # Run model or demo
    if model is not None:
        tensor = transform(img).unsqueeze(0)
        with torch.no_grad():
            output = model(tensor)
            probs = torch.softmax(output, dim=1)[0].detach().cpu()

            if probs.numel() < 2:
                raise HTTPException(status_code=500, detail="Model output must have at least 2 classes")

            flood_idx = FLOOD_CLASS_INDEX if FLOOD_CLASS_INDEX in (0, 1) else 0
            flood_prob = float(probs[flood_idx]) * 100
            no_flood_prob = float(probs[1 - flood_idx]) * 100
    else:
        # Demo mode — random result
        import random
        flood_prob = random.uniform(40, 95)
        no_flood_prob = 100 - flood_prob

    is_flood = flood_prob >= 50
    water_pct = round(flood_prob * 0.6, 1) if is_flood else round(flood_prob * 0.1, 1)
    elapsed = round(time.time() - start, 2)

    return PredictResponse(
        prediction="flood" if is_flood else "no_flood",
        confidence=round(flood_prob if is_flood else no_flood_prob, 1),
        water_percent=water_pct,
        process_time=elapsed,
        message="High flood risk detected!" if is_flood else "Area appears safe.",
    )
