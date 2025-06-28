# ⚡️ Generative UI Playground

> **Build React components on‑the‑fly with GPT‑4o and drag‑and‑drop them into a live canvas.**\
> A full‑stack demo that showcases dynamic code generation, runtime compilation, and modern UX patterns in fewer than 500 lines of code.

---

## ✨ Why It Impresses Recruiters

| Skill                        | Demonstrated How                                                                    |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| **Full‑stack delivery**      | FastAPI backend (Python) + React frontend (Vite).                                   |
| **Generative AI**            | Streams natural‑language prompts to GPT‑4o, receives JSX code back.                 |
| **Runtime code compilation** | Uses *Babel stand‑alone* to transpile unknown JSX on the client in real time.       |
| **Drag & Drop UX**           | Implements drag‑and‑drop with **react‑dnd** so users can arrange generated widgets. |
| **Robust error handling**    | Sanitises GPT output, auto‑wraps raw JSX, safe‑renders compile errors.              |
| **Clean architecture**       | <200 LOC backend & \~300 LOC frontend—readable and interview‑friendly.              |
| **Cloud‑agnostic**           | Works with OpenAI *or* Azure OpenAI via simple env flags.                           |

---

## 🖼 Screenshot



---

## 🏗 Tech Stack

| Layer        | Tech                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| **Frontend** | React 18, Vite, React‑Dnd, Axios, Babel Stand‑alone, Prism Syntax‑Highlighter |
| **Backend**  | FastAPI, Uvicorn (hot‑reload), OpenAI Python SDK                              |
| **Styling**  | Vanilla CSS‑in‑JS (no framework) for minimal footprint                        |

---

## 🚀 Quick Start

```bash
# 1 — Clone
$ git clone https://github.com/yourname/generative-ui.git && cd generative-ui

# 2 — Backend (Python 3.11+)
$ uv venv .venv && source .venv/bin/activate    # ℹ uses uv instead of pip
$ uv pip install fastapi "uvicorn[standard]" python-dotenv openai
$ cp backend/.env.example backend/.env          # add your API key
$ uvicorn backend.main:app --reload --port 8000

# 3 — Frontend
$ cd frontend
$ npm install
$ npm run dev                                   # opens http://localhost:5173
```

Open your browser → type *“A red rounded button that says Click Me”* → watch GPT build & render it live.

---

## 🔍 Project Structure

```
├─ backend/
│  ├─ main.py          # FastAPI routes & OpenAI call
│  └─ .env.example
└─ frontend/
   ├─ src/
   │  ├─ App.jsx       # chat UI, runtime compiler, DnD
   │  └─ main.jsx      # bootstrap
   └─ index.html       # loads Babel via CDN
```

---

## 🧩 Key Implementation Details

1. ``
   - Strips markdown fences (\`\`\`\`jsx`) and `export default\`.
   - Wraps raw JSX snippets in a fallback `GeneratedComponent` function.
   - Transpiles via `Babel.transform` + executes with `new Function`.
2. **Drag‑and‑Drop**\
   `DraggableComponent` + `DroppableCanvas` share the `COMPONENT` DnD type; dropping pushes the component constructor into `canvasComponents`, triggering a re‑render.
3. **CORS‑safe backend**\
   `CORSMiddleware` allows `http://localhost:5173` and handles pre‑flight `OPTIONS` automatically.

---

## ⚙️ Environment Variables

| Name                    | Description                             |
| ----------------------- | --------------------------------------- |
| `OPENAI_API_KEY`        | Secret key for api.openai.com           |
| `AZURE_OPENAI_ENDPOINT` | *(optional)* your Azure OpenAI endpoint |
| `AZURE_OPENAI_KEY`      | *(optional)* key for Azure OpenAI       |

Switching between OpenAI and Azure is a one‑line change in `backend/main.py`—see comments in file.

---

## 🛠 Extending the Demo

- **Add authentication** (e.g., GitHub OAuth) so users can save canvases.
- **Export as code sandbox** – bundle generated components into a downloadable zip or StackBlitz link.
- **Swap runtime compiler** – use `esbuild-wasm` for faster transpile.
- **Component library mode** – pipe compiled components into Storybook for instant documentation.

---

## 📄 License

MIT © 2025 Saksham. Feel free to fork and build bigger things. 🚀

