from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pathlib import Path

from .config import UPLOAD_DIR, FRONTEND_ORIGINS
from .models.schemas import HealthResponse, UploadResponse, UploadedDocument, ErrorResponse
from .utils.file_utils import save_upload_file


# FastAPI instance
app = FastAPI(
    title="Local AI Document Q&A Backend",
    version="0.1.0",
    description="Backend for local document Q&A system",
)


# CORS (for frontend connection) 
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root route
@app.get("/")
async def root():
    return {"message": "Local AI Document Q&A API running. Go to /docs for API docs."}


# Health check
@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="ok")


# Upload PDF(s)
@app.post(
    "/upload",
    response_model=UploadResponse,
    responses={400: {"model": ErrorResponse}},
)
async def upload_documents(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    uploaded_docs = []

    for f in files:
        if not f.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail=f"{f.filename} is not a PDF")

        saved_path = save_upload_file(UPLOAD_DIR, f)
        doc_id = saved_path.stem
        size_bytes = saved_path.stat().st_size

        uploaded_docs.append(
            UploadedDocument(
                doc_id=doc_id,
                filename=f.filename,
                size_bytes=size_bytes,
            )
        )

    return UploadResponse(
        message=f"Uploaded {len(uploaded_docs)} document(s)",
        documents=uploaded_docs,
    )


# To run in powershell,cmd = uvicorn app.main:app --reload