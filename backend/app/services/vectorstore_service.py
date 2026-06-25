import os
from pathlib import Path
from typing import List, Optional

from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.schema import Document

from app.core.config import settings


class VectorStoreService:
    def __init__(self):
        self.vectorstore_path = Path(settings.VECTORSTORE_PATH)   
        self.vectorstore_path.mkdir(parents=True, exist_ok=True)
        self.index_path = str(self.vectorstore_path / "faiss_index")
        self.vectorstore: Optional[FAISS] = None

        # FREE HuggingFace Embeddings — runs locally
        print("Loading embedding model (first time may take ~1 min)...")
        self.embeddings = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )

        # Load existing vectorstore if available
        self._load_existing()

    def _load_existing(self):
        """Load existing FAISS index from disk if it exists"""
        if os.path.exists(self.index_path):
            try:
                self.vectorstore = FAISS.load_local(
                    self.index_path,
                    self.embeddings,
                    allow_dangerous_deserialization=True,
                )
                print(f"Loaded existing vector store from {self.index_path}")
            except Exception as e:
                print(f"Could not load existing vector store: {e}")

    def add_documents(self, documents: List[Document]) -> int:
        """Add documents to vector store"""
        if not documents:
            return 0

        if self.vectorstore is None:
            self.vectorstore = FAISS.from_documents(documents, self.embeddings)
        else:
            self.vectorstore.add_documents(documents)

        # Save to disk
        self.vectorstore.save_local(self.index_path)
        return len(documents)

    def similarity_search(self, query: str, k: int = None) -> List[Document]:
        """Search for similar documents"""
        if self.vectorstore is None:
            return []

        k = k or settings.TOP_K_RESULTS
        return self.vectorstore.similarity_search(query, k=k)

    def similarity_search_with_score(self, query: str, k: int = None):
        """Search with relevance scores"""
        if self.vectorstore is None:
            return []

        k = k or settings.TOP_K_RESULTS
        return self.vectorstore.similarity_search_with_relevance_scores(query, k=k)

    def clear_vectorstore(self):
        """Delete all vectors"""
        import shutil
        if os.path.exists(self.index_path):
            shutil.rmtree(self.index_path, ignore_errors=True)
        self.vectorstore = None

    def has_documents(self) -> bool:
        return self.vectorstore is not None

    def get_document_count(self) -> int:
        if self.vectorstore is None:
            return 0
        return self.vectorstore.index.ntotal


vectorstore_service = VectorStoreService()
