from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    APP_NAME: str = "RAG Chatbot"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # API Keys
    GROQ_API_KEY: str
    HUGGINGFACE_API_KEY: str = ""

    # Models
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"

    # Paths
    VECTORSTORE_PATH: str = "./vectorstore"
    UPLOAD_DIR: str = "./uploads"

    # Upload limits
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_EXTENSIONS: str = "pdf,txt"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:3000"

    # RAG settings
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    TOP_K_RESULTS: int = 2

    class Config:
        env_file = ".env"

    def get_allowed_extensions(self) -> List[str]:
        return [ext.strip() for ext in self.ALLOWED_EXTENSIONS.split(",")]


settings = Settings()