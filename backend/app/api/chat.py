from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from app.services.chat_service import chat_service
from app.services.vectorstore_service import vectorstore_service

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    query: str
    chat_history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    answer: str
    sources: List[dict]
    has_documents: bool


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send a message and get an AI response based on uploaded documents"""

    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    # Convert Pydantic models to dicts for chat history
    history = [{"role": m.role, "content": m.content} for m in request.chat_history]

    try:
        result = await chat_service.chat(
            query=request.query,
            chat_history=history,
        )
        return ChatResponse(**result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@router.get("/status")
async def get_status():
    """Get current status of the RAG system"""
    return {
        "has_documents": vectorstore_service.has_documents(),
        "total_chunks": vectorstore_service.get_document_count(),
        "ready": vectorstore_service.has_documents(),
    }