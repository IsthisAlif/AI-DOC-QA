import { useEffect, useState } from "react";
import "./App.css";
import { getHealth, uploadDocuments } from "./api";
import type { UploadedDocument } from "./api";

function App() {
  const [healthStatus, setHealthStatus] = useState<string>("checking...");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealth()
      .then((data) => setHealthStatus(data.status))
      .catch(() => setHealthStatus("error"));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError("Please select at least one PDF file.");
      return;
    }
    setError(null);
    setIsUploading(true);
    try {
      const filesArray = Array.from(selectedFiles);
      const response = await uploadDocuments(filesArray);
      setUploadedDocs((prev) => [...prev, ...response.documents]);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Local AI Document Q&A</h1>
        <p>
          Backend health: <strong>{healthStatus}</strong>
        </p>
      </header>

      <main>
        <section className="upload-section">
          <h2>Upload PDFs</h2>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
          />
          <button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </button>
          {error && <p className="error">{error}</p>}
        </section>

        <section className="uploaded-list">
          <h2>Uploaded Documents</h2>
          {uploadedDocs.length === 0 ? (
            <p>No documents uploaded yet.</p>
          ) : (
            <ul>
              {uploadedDocs.map((doc) => (
                <li key={doc.doc_id}>
                  <strong>{doc.filename}</strong> — {doc.size_bytes} bytes
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
