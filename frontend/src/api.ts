const API_BASE_URL = "http://localhost:8000";

export async function getHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) {
    throw new Error("Failed to fetch health");
  }
  return res.json();
}

export interface UploadedDocument {
  doc_id: string;
  filename: string;
  size_bytes: number;
}

export interface UploadResponse {
  message: string;
  documents: UploadedDocument[];
}

export async function uploadDocuments(files: File[]): Promise<UploadResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({} as any));
    throw new Error(errorBody.detail || "Upload failed");
  }

  return res.json();
}
