from pydantic import BaseModel
from typing import List


class HealthResponse(BaseModel):
    status: str


class UploadedDocument(BaseModel):
    doc_id: str
    filename: str
    size_bytes: int


class UploadResponse(BaseModel):
    message: str
    documents: List[UploadedDocument]


class ErrorResponse(BaseModel):
    detail: str
