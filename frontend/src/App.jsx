import React, { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import ChatWindow from "./components/ChatWindow";
import { getFiles, getStatus } from "./utils/api";
import { Brain, Zap } from "lucide-react";

export default function App() {
  const [files, setFiles] = useState([]);
  const [hasDocuments, setHasDocuments] = useState(false);
  const [totalChunks, setTotalChunks] = useState(0);

  const refreshFiles = async () => {
    try {
      const data = await getFiles();
      setFiles(data.files);
      setTotalChunks(data.total_chunks_indexed);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  };

  const refreshStatus = async () => {
    try {
      const status = await getStatus();
      setHasDocuments(status.has_documents);
    } catch (err) {
      console.error("Failed to fetch status:", err);
    }
  };

  useEffect(() => {
    refreshFiles();
    refreshStatus();
  }, []);

  const handleFilesChange = () => {
    refreshFiles();
    refreshStatus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">   
      {/* Navbar */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">DocuMind AI</h1>
              <p className="text-xs text-gray-400">
                RAG Chatbot • Powered by Groq + HuggingFace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Stats */}
            {files.length > 0 && (
              <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                  {files.length} file{files.length !== 1 ? "s" : ""} indexed
                </span>
                <span className="flex items-center gap-1">
                  <Zap size={12} className="text-yellow-500" />
                  {totalChunks} chunks
                </span>
              </div>
            )}

            {/* Free badge */}
            <span className="hidden sm:inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-200">
              ✓ 100% Free APIs
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-6 py-6 h-[calc(100vh-65px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

          {/* Left Panel — File Upload */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <FileUpload files={files} onFilesChange={handleFilesChange} />

            {/* How it works Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">
                How it works
              </h3>
              <div className="space-y-2 text-xs text-gray-500">
                {[
                  { step: "1", label: "Upload a PDF or TXT file" },
                  { step: "2", label: "AI indexes it using HuggingFace embeddings" },
                  { step: "3", label: "Ask any question about your document" },
                  { step: "4", label: "Groq (Llama 3) answers using only your content" },
                ].map(({ step, label }) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {step}
                    </span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80 mb-2">
                Tech Stack
              </p>
              <div className="space-y-1 text-sm">
                {[
                  { label: "LLM", value: "Groq / Llama 3" },
                  { label: "Embeddings", value: "HuggingFace" },
                  { label: "Vector DB", value: "FAISS (Local)" },
                  { label: "Backend", value: "FastAPI" },
                  { label: "Frontend", value: "React + Tailwind" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="opacity-80">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel — Chat */}
          <div className="lg:col-span-2 h-full min-h-[500px]">
            <ChatWindow hasDocuments={hasDocuments} />
          </div>
        </div>
      </main>
    </div>
  );
}
