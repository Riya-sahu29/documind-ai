from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import List

from app.services.document_service import document_service
from app.services.vectorstore_service import vectorstore_service
from app.core.config import settings

router = APIRouter(prefix="/upload", tags=["Upload"])


@router.post("/")
async def upload_document(file: UploadFile = File(...)):
    """Upload a PDF or TXT file and index it"""

    # Validate file extension
    ext = file.filename.split(".")[-1].lower()
    if ext not in settings.get_allowed_extensions():
        raise HTTPException(
            status_code=400,
            detail=f"File type '.{ext}' not supported. Allowed: {settings.ALLOWED_EXTENSIONS}",
        )

    # Validate file size
    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > settings.MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File too large: {size_mb:.1f}MB. Max allowed: {settings.MAX_FILE_SIZE_MB}MB",
        )

    try:
        # Process and index document
        chunks = document_service.process_file(content, file.filename)
        num_indexed = vectorstore_service.add_documents(chunks)

        return JSONResponse({
            "success": True,
            "message": f"Successfully indexed '{file.filename}'",
            "filename": file.filename,
            "chunks_indexed": num_indexed,
            "file_size_mb": round(size_mb, 2),
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


@router.get("/files")
async def list_files():
    """List all uploaded files"""
    files = document_service.list_uploaded_files()
    doc_count = vectorstore_service.get_document_count()
    return {
        "files": files,
        "total_files": len(files),
        "total_chunks_indexed": doc_count,
    }


@router.delete("/{filename}")
async def delete_file(filename: str):
    """Delete an uploaded file"""
    deleted = document_service.delete_file(filename)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"File '{filename}' not found")
    return {"success": True, "message": f"Deleted '{filename}'"}


@router.delete("/clear/all")
async def clear_all():
    """Clear all documents and vector store"""
    vectorstore_service.clear_vectorstore()
    files = document_service.list_uploaded_files()
    for f in files:
        document_service.delete_file(f)
    return {"success": True, "message": "All documents cleared"}