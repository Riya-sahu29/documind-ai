# 🧠 DocuMind AI — Chat With Your Documents

<div align="center">

![DocuMind AI Banner](assets/screenshot1.png)

**An intelligent RAG-powered chatbot that lets you chat with any PDF or document using AI**

[![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![Groq](https://img.shields.io/badge/Groq-LLaMA3-orange?style=for-the-badge)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![APIs](https://img.shields.io/badge/APIs-100%25%20Free-brightgreen?style=for-the-badge)](https://groq.com)

[🚀 Live Demo](#) • [📖 Documentation](#how-it-works) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>

---

## 📸 Screenshots

<div align="center">

### 🏠 Main Interface
![Main Interface](assets/screenshot1.png)

### 💬 Chat in Action
![Chat in Action](assets/screenshot2.png)

### 📄 Sources Panel
![Sources Panel](assets/screenshot3.png)

</div>

---

## 🌟 What is DocuMind AI?

DocuMind AI is a **Retrieval-Augmented Generation (RAG)** chatbot that allows users to upload any PDF or text document and have an intelligent conversation with it. Instead of reading through long documents manually, just ask questions and get accurate answers instantly — with source references showing exactly where the answer came from.

> 💡 **Real World Use Case:** Imagine uploading a 100-page legal contract and asking *"What are the termination clauses?"* — DocuMind AI finds and answers it in seconds!

---

## ❓ Why Was This Project Built?

### The Problem
Every day, people struggle with:
- 📚 Reading through **hundreds of pages** of PDFs manually
- 🔍 Spending hours **searching for specific information** in documents
- 😓 **Missing important details** buried deep in long reports
- 🏢 Businesses needing to **query internal documents** quickly

### The Solution
DocuMind AI solves this by:
- ✅ Letting you **upload any document** and chat with it instantly
- ✅ Using **AI to find exact answers** from your specific document
- ✅ Showing **source references** so you can verify every answer
- ✅ Running on **100% free APIs** — no expensive subscriptions needed

---

## 🎯 Purpose & Use Cases

| Use Case | Example |
|----------|---------|
| 📄 **Resume Analysis** | Upload your resume → Ask "What are my strongest skills?" |
| 📚 **Study Helper** | Upload textbook → Ask "Explain the concept of photosynthesis" |
| ⚖️ **Legal Documents** | Upload contract → Ask "What are the penalty clauses?" |
| 🔬 **Research Papers** | Upload paper → Ask "What is the conclusion of this study?" |
| 🏢 **Business Reports** | Upload report → Ask "What was the revenue in Q3?" |
| 📋 **Policy Documents** | Upload HR policy → Ask "How many leave days do I get?" |

---

## ✨ Features

- 🚀 **Instant PDF Upload** — Drag and drop any PDF or TXT file
- 🤖 **AI-Powered Chat** — Ask questions in natural language
- 📍 **Source References** — See exactly which page the answer came from
- 💬 **Chat History** — Maintains conversation context across questions
- 🗑️ **Document Management** — Upload, list, and delete documents easily
- 🌐 **Modern UI** — Clean React + Tailwind CSS interface
- ⚡ **Super Fast** — Groq API delivers responses in under 2 seconds
- 🆓 **100% Free** — No paid APIs, no credit card required

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|-------|-----------|---------|
| 🤖 **LLM** | Groq API + LLaMA 3 70B | Generate intelligent answers |
| 🔢 **Embeddings** | HuggingFace all-MiniLM-L6-v2 | Convert text to vectors |
| 🗄️ **Vector DB** | FAISS (Local) | Store and search document chunks |
| 🔗 **Orchestration** | LangChain | Connect all AI components |
| ⚙️ **Backend** | FastAPI + Python 3.10 | REST API server |
| ⚛️ **Frontend** | React 18 + Vite | User interface |
| 🎨 **Styling** | Tailwind CSS | Modern responsive design |
| 📄 **PDF Processing** | PyPDF + pdfplumber | Extract text from PDFs |

</div>

---

## 🧠 How It Works

```
┌─────────────────────────────────────────────────────────┐
│                    RAG PIPELINE                          │
│                                                         │
│  📄 PDF Upload                                          │
│       ↓                                                 │
│  📝 Text Extraction (PyPDF)                             │
│       ↓                                                 │
│  ✂️  Text Chunking (500 chars, 50 overlap)               │
│       ↓                                                 │
│  🔢 Embedding Generation (HuggingFace - FREE & LOCAL)   │
│       ↓                                                 │
│  🗄️  Vector Storage (FAISS - saved to disk)             │
│                                                         │
│  💬 User Question                                       │
│       ↓                                                 │
│  🔢 Question Embedding                                  │
│       ↓                                                 │
│  🔍 Similarity Search → Top 2 relevant chunks           │
│       ↓                                                 │
│  🤖 Groq LLaMA 3 → Generate Answer with Context        │
│       ↓                                                 │
│  ✅ Answer + Sources shown to User                      │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
documind-ai/
│
├── 📁 backend/
│   ├── 📁 app/
│   │   ├── 📁 api/
│   │   │   ├── chat.py              ← Chat endpoints
│   │   │   └── upload.py            ← File upload endpoints
│   │   ├── 📁 core/
│   │   │   └── config.py            ← Settings & env vars
│   │   ├── 📁 services/
│   │   │   ├── chat_service.py      ← Groq LLM + RAG logic
│   │   │   ├── document_service.py  ← PDF processing
│   │   │   └── vectorstore_service.py ← FAISS vector store
│   │   └── main.py                  ← FastAPI entry point
│   ├── .env.example                 ← API keys template
│   └── requirements.txt             ← Python dependencies
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── ChatWindow.jsx       ← Chat UI
│   │   │   └── FileUpload.jsx       ← Upload UI
│   │   ├── 📁 utils/
│   │   │   └── api.js               ← API calls
│   │   ├── App.jsx                  ← Main layout
│   │   └── main.jsx                 ← Entry point
│   └── package.json
│
├── 📁 assets/                       ← Screenshots for README
│   ├── screenshot1.png              ← Main interface
│   ├── screenshot2.png              ← Chat in action
│   └── screenshot3.png              ← Sources panel
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
| Tool | Version |
|------|---------|
| Python | 3.10+ |
| Node.js | 18+ |
| Git | Any |

### 🔑 Get Free API Keys

**Groq API Key** *(2 minutes, no credit card)*
1. Visit → [console.groq.com](https://console.groq.com)
2. Sign up with Google
3. API Keys → Create API Key → Copy it

**HuggingFace Token** *(optional — embeddings run locally)*
1. Visit → [huggingface.co](https://huggingface.co)
2. Settings → Access Tokens → New Token (READ)

### 🚀 Run Locally

**1. Clone the repository**
```bash
git clone https://github.com/YOURUSERNAME/documind-ai.git
cd documind-ai
```

**2. Setup Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
cp .env.example .env
# Add your GROQ_API_KEY in .env
uvicorn app.main:app --reload
```

**3. Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

**4. Open in browser**
```
Frontend  → http://localhost:5173
API Docs  → http://localhost:8000/docs
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/upload/` | Upload & index document |
| `GET` | `/api/upload/files` | List all documents |
| `DELETE` | `/api/upload/{filename}` | Delete a document |
| `DELETE` | `/api/upload/clear/all` | Clear everything |
| `POST` | `/api/chat/` | Chat with documents |
| `GET` | `/api/chat/status` | System status |
| `GET` | `/docs` | Swagger API docs |

---

## 🆓 Free Tier Limits

| Service | Free Limit | Cost |
|---------|-----------|------|
| Groq API | 14,400 requests/day | $0 Forever |
| HuggingFace Embeddings | Unlimited (runs locally) | $0 Forever |
| FAISS Vector DB | Unlimited (runs locally) | $0 Forever |

---

## 🚀 Deployment Options

| Platform | Service | Cost |
|----------|---------|------|
| **Render** | Backend (FastAPI) | Free tier |
| **Vercel** | Frontend (React+Vite) | Free tier |
| **Railway** | Full stack | Free tier |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch `git checkout -b feature/AmazingFeature`
3. Commit your changes `git commit -m "Add AmazingFeature"`
4. Push to the branch `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License.

---

<div align="center">

⭐ **If you found this project helpful, please give it a star!** ⭐

**Built with ❤️ as a portfolio project demonstrating RAG, LLM integration, and full-stack AI development**

</div>
