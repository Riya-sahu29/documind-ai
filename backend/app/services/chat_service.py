from typing import List
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_core.documents import Document

from app.core.config import settings
from app.services.vectorstore_service import vectorstore_service


# SYSTEM_PROMPT = """You are a helpful AI assistant that answers questions based on the provided document context.

# Instructions:
# - Answer questions using ONLY the provided context below
# - If the answer is not in the context, say "I couldn't find that information in the uploaded documents"
# - Be concise, clear, and accurate
# - Cite which part of the document your answer comes from when possible
# - If asked a follow-up question, use the chat history to maintain context

# Context from documents:
# {context}
# """

SYSTEM_PROMPT = """You are a helpful AI assistant that answers questions based on the provided document context.

Instructions:
- Answer questions in a clean, direct and friendly way
- Do NOT say "According to the context" or "According to Source 1" 
- Do NOT mention source numbers in your answer
- Just answer naturally like a human expert would
- Use bullet points or numbered lists when listing multiple items
- Keep answers short and clear
- If the answer is not in the context say "I couldn't find that in the uploaded document"

Context from documents:
{context}
"""


class ChatService:
    def __init__(self):
        self.llm = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model_name=settings.GROQ_MODEL,
            temperature=0.1,
            max_tokens=1024,
        )

    def _format_context(self, docs: List[Document]) -> str:
        """Format retrieved documents into context string"""
        if not docs:
            return "No relevant documents found."

        context_parts = []
        for i, doc in enumerate(docs, 1):
            source = doc.metadata.get("source_file", "Unknown")
            page = doc.metadata.get("page", "")
            page_info = f" (Page {page + 1})" if page != "" else ""
            context_parts.append(
                f"[Source {i}: {source}{page_info}]\n{doc.page_content}"
            )

        return "\n\n---\n\n".join(context_parts)

    def _build_messages(self, query: str, context: str, chat_history: List[dict]):
        """Build message list for LLM"""
        messages = [
            SystemMessage(content=SYSTEM_PROMPT.format(context=context))
        ]

        # Add chat history (last 6 messages = 3 turns)
        for msg in chat_history[-6:]:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))

        # Add current query
        messages.append(HumanMessage(content=query))
        return messages

    async def chat(self, query: str, chat_history: List[dict] = None) -> dict:
        """Main chat function — retrieves docs and generates answer"""
        chat_history = chat_history or []

        # Step 1: Retrieve relevant documents
        docs_with_scores = vectorstore_service.similarity_search_with_score(query)
        docs = [doc for doc, score in docs_with_scores]

        if not vectorstore_service.has_documents():
            return {
                "answer": "Please upload a PDF or text document first before asking questions!",
                "sources": [],
                "has_documents": False,
            }

        # Step 2: Format context
        context = self._format_context(docs)

        # Step 3: Build messages and call Groq
        messages = self._build_messages(query, context, chat_history)
        response = await self.llm.ainvoke(messages)

        # Step 4: Prepare sources for frontend
        sources = []
        for doc, score in docs_with_scores:
            sources.append({
                "file": doc.metadata.get("source_file", "Unknown"),
                "page": doc.metadata.get("page", 0),
                "content_preview": doc.page_content[:200] + "...",
                "relevance_score": round(float(score), 3),
            })

        return {
            "answer": response.content,
            "sources": sources,
            "has_documents": True,
        }


chat_service = ChatService()