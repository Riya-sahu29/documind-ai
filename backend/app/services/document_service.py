import os
from pathlib import Path
from typing import List

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain.schema import Document

from app.core.config import settings


class DocumentService:
    def __init__(self):
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
            separators=["\n\n", "\n", ".", " ", ""],
        )

    def save_file(self, file_content: bytes, filename: str) -> str:
        """Save uploaded file to disk"""
        file_path = self.upload_dir / filename
        with open(file_path, "wb") as f:
            f.write(file_content)
        return str(file_path)

    def load_document(self, file_path: str) -> List[Document]:
        """Load document based on file type"""
        ext = Path(file_path).suffix.lower()

        if ext == ".pdf":
            loader = PyPDFLoader(file_path)
        elif ext == ".txt":
            loader = TextLoader(file_path, encoding="utf-8")
        else:
            raise ValueError(f"Unsupported file type: {ext}")

        return loader.load()

    def split_documents(self, documents: List[Document]) -> List[Document]:
        """Split documents into chunks"""
        return self.text_splitter.split_documents(documents)

    def process_file(self, file_content: bytes, filename: str) -> List[Document]:
        """Full pipeline: save → load → split"""
        file_path = self.save_file(file_content, filename)
        documents = self.load_document(file_path)
        chunks = self.split_documents(documents)

        # Add filename metadata to each chunk
        for chunk in chunks:
            chunk.metadata["source_file"] = filename

        return chunks

    def list_uploaded_files(self) -> List[str]:
        """List all uploaded files"""
        return [f.name for f in self.upload_dir.iterdir() if f.is_file()]

    def delete_file(self, filename: str) -> bool:
        """Delete a file from uploads"""
        file_path = self.upload_dir / filename
        if file_path.exists():
            file_path.unlink()
            return True
        return False


document_service = DocumentService()