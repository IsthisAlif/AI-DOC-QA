from pathlib import Path
import uuid


def generate_doc_id() -> str:
    return str(uuid.uuid4())


def save_upload_file(upload_dir: Path, file_obj):
    doc_id = generate_doc_id()
    ext = Path(file_obj.filename).suffix or ".pdf"
    new_name = f"{doc_id}{ext}"
    dest_path = upload_dir / new_name

    with dest_path.open("wb") as buffer:
        buffer.write(file_obj.file.read())

    return dest_path
