🧠 DocuMind AI — Chat With Your Documents
[![Python](https://img.shields.io/badge/Python-3.10+-blue...)]
[![React](https://img.shields.io/badge/React-18-61DAFB...)]
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688...)]
[![Groq](https://img.shields.io/badge/Groq-LLaMA3-orange...)]
[![License](https://img.shields.io/badge/License-MIT-green...)]
[![APIs](https://img.shields.io/badge/APIs-100%25Free-brightgreen...)]

An intelligent RAG-powered chatbot that lets you chat with any PDF or document using AI

📸 Screenshots
<div align="center">
🏠 Main Interface
Show Image
💬 Chat in Action
Show Image
📄 Sources Panel
Show Image
</div>

🌟 What is DocuMind AI?
DocuMind AI is a Retrieval-Augmented Generation (RAG) chatbot that allows users to upload any PDF or text document and have an intelligent conversation with it. Instead of reading through long documents manually, just ask questions and get accurate answers instantly — with source references showing exactly where the answer came from.

💡 Real World Use Case: Imagine uploading a 100-page legal contract and asking "What are the termination clauses?" — DocuMind AI finds and answers it in seconds!


❓ Why Was This Project Built?
The Problem
Every day, people struggle with:

📚 Reading through hundreds of pages of PDFs manually
🔍 Spending hours searching for specific information in documents
😓 Missing important details buried deep in long reports
🏢 Businesses needing to query internal documents quickly

The Solution
DocuMind AI solves this by:

✅ Letting you upload any document and chat with it instantly
✅ Using AI to find exact answers from your specific document
✅ Showing source references so you can verify every answer
✅ Running on 100% free APIs — no expensive subscriptions needed


🎯 Purpose & Use Cases
Use CaseExample📄 Resume AnalysisUpload your resume → Ask "What are my strongest skills?"📚 Study HelperUpload textbook → Ask "Explain the concept of photosynthesis"⚖️ Legal DocumentsUpload contract → Ask "What are the penalty clauses?"🔬 Research PapersUpload paper → Ask "What is the conclusion of this study?"🏢 Business ReportsUpload report → Ask "What was the revenue in Q3?"📋 Policy DocumentsUpload HR policy → Ask "How many leave days do I get?"

✨ Features

🚀 Instant PDF Upload — Drag and drop any PDF or TXT file
🤖 AI-Powered Chat — Ask questions in natural language
📍 Source References — See exactly which page the answer came from
💬 Chat History — Maintains conversation context across questions
🗑️ Document Management — Upload, list, and delete documents easily
🌐 Modern UI — Clean React + Tailwind CSS interface
⚡ Super Fast — Groq API delivers responses in under 2 seconds
🆓 100% Free — No paid APIs, no credit card required

🛠️ Tech Stack
<div align="center">
LayerTechnologyPurpose🤖 LLMGroq API + LLaMA 3 70BGenerate intelligent answers🔢 EmbeddingsHuggingFace all-MiniLM-L6-v2Convert text to vectors🗄️ Vector DBFAISS (Local)Store and search document chunks🔗 OrchestrationLangChainConnect all AI components⚙️ BackendFastAPI + Python 3.10REST API server⚛️ FrontendReact 18 + ViteUser interface🎨 StylingTailwind CSSModern responsive design📄 PDF ProcessingPyPDF + pdfplumberExtract text from PDFs
</div>

🧠 How It Works
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

📁 Project Structure
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

⚙️ Installation & Setup
Prerequisites
ToolVersionPython3.10+Node.js18+GitAny
🔑 Get Free API Keys
Groq API Key (2 minutes, no credit card)

Visit → console.groq.com
Sign up with Google
API Keys → Create API Key → Copy it

HuggingFace Token (optional — embeddings run locally)

Visit → huggingface.co
Settings → Access Tokens → New Token (READ)

🚀 Run Locally
1. Clone the repository
bashgit clone https://github.com/YOURUSERNAME/documind-ai.git
cd documind-ai
2. Setup Backend
bashcd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
cp .env.example .env
# Add your GROQ_API_KEY in .env
uvicorn app.main:app --reload
3. Setup Frontend
bashcd frontend
npm install
npm run dev
4. Open in browser
Frontend  → http://localhost:5173
API Docs  → http://localhost:8000/docs

🔌 API Endpoints
MethodEndpointDescriptionPOST/api/upload/Upload & index documentGET/api/upload/filesList all documentsDELETE/api/upload/{filename}Delete a documentDELETE/api/upload/clear/allClear everythingPOST/api/chat/Chat with documentsGET/api/chat/statusSystem statusGET/docsSwagger API docs

🆓 Free Tier Limits
ServiceFree LimitCostGroq API14,400 requests/day$0 ForeverHuggingFace EmbeddingsUnlimited (runs locally)$0 ForeverFAISS Vector DBUnlimited (runs locally)$0 Forever

🚀 Deployment Options
PlatformServiceCostRenderBackend (FastAPI)Free tierVercelFrontend (React+Vite)Free tierRailwayFull stackFree tier

🤝 Contributing

Fork the repository
Create your feature branch git checkout -b feature/AmazingFeature
Commit your changes git commit -m "Add AmazingFeature"
Push to the branch git push origin feature/AmazingFeature
Open a Pull Request


📝 License
Distributed under the MIT License.

<div align="center">
⭐ If you found this project helpful, please give it a star! ⭐
Built with ❤️ as a portfolio project demonstrating RAG, LLM integration, and full-stack AI development
</div>
