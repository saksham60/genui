# backend/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
from dotenv import load_dotenv

# ────────────────────────────────
#  Load your OpenAI API key
# ────────────────────────────────
load_dotenv()                           # reads .env if present
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is missing – set it in .env")

client = OpenAI(api_key=OPENAI_API_KEY)

# ────────────────────────────────
#  FastAPI setup
# ────────────────────────────────
app = FastAPI()

# Allow the React dev server to reach us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """
You are an expert React developer. Return ONLY a default-exported functional
component called GeneratedComponent, written in JSX with simple inline styles.
No import statements, no extra text.
"""

# ────────────────────────────────
#  Pydantic models
# ────────────────────────────────
class PromptReq(BaseModel):
    prompt: str

class ComponentResp(BaseModel):
    component: str

# ────────────────────────────────
#  Endpoint
# ────────────────────────────────
@app.post("/generate-component", response_model=ComponentResp)
async def generate_component(req: PromptReq):
    """
    Receives a UI description, asks GPT-4o for JSX, and returns it.
    """
    try:
        # synchronous call (no await) fixes the TypeError / 500
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": req.prompt},
            ],
            temperature=0.3,
        )
        jsx = completion.choices[0].message.content.strip()
        return ComponentResp(component=jsx)

    except Exception as exc:
        # surface the error to the frontend
        raise HTTPException(status_code=500, detail=str(exc))
