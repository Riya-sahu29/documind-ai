import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { sendMessage } from "../utils/api";

function SourceCard({ source }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-blue-100 rounded-lg overflow-hidden text-xs"> 
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100"
      >
        <span className="font-medium truncate">
          📄 {source.file} {source.page > 0 ? `— Page ${source.page + 1}` : ""}
        </span>
        <span className="ml-2 shrink-0 flex items-center gap-1">
          Score: {source.relevance_score}
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </span>
      </button>
      {open && (
        <div className="px-3 py-2 bg-white text-gray-600 leading-relaxed">
          {source.content_preview}
        </div>
      )}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? "bg-blue-500" : "bg-gray-700"
        }`}
      >
        {isUser ? (
          <User size={16} className="text-white" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>
      <div
        className={`max-w-[80%] space-y-2 ${
          isUser ? "items-end" : "items-start"
        } flex flex-col`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-blue-500 text-white rounded-tr-sm"
              : "bg-gray-100 text-gray-800 rounded-tl-sm"
          }`}
        >
          {isUser ? (
            msg.content
          ) : (
            <ReactMarkdown>
              {msg.content}
            </ReactMarkdown>
          )}
        </div> 
        {msg.sources && msg.sources.length > 0 && (
          <div className="w-full space-y-1">
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <BookOpen size={11} /> Sources
            </p>
            {msg.sources.map((s, i) => (
              <SourceCard key={i} source={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatWindow({ hasDocuments }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: hasDocuments
        ? "Hello! I'm ready to answer questions about your uploaded documents. What would you like to know?"
        : "Hello! Please upload a PDF or text document on the left to get started.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input.trim() };
    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const result = await sendMessage(userMsg.content, history);
      setMessages((prev) => [ 
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          sources: result.sources,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Document AI</h2>
          <p className="text-xs text-gray-400">
            {hasDocuments
              ? "Ready to answer questions"
              : "Upload a document to start"}
          </p>
        </div>
        <div
          className={`ml-auto w-2 h-2 rounded-full ${
            hasDocuments ? "bg-green-400" : "bg-yellow-400"
          }`}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}  
            placeholder={
              hasDocuments
                ? "Ask about your documents..."
                : "Upload a document first..."
            }
            disabled={loading || !hasDocuments}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim() || !hasDocuments}
            className="p-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 text-white rounded-xl transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
