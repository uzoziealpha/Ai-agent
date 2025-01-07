import PyPDF2
from docx import Document
import json

def allowed_file(filename):
    """Check if a file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'txt', 'pdf', 'docx', 'xlsx', 'json', 'csv'}

def extract_text_from_pdf(file_path):
    """Extract text from a PDF file."""
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

def extract_text_from_docx(file_path):
    """Extract text from a DOCX file."""
    doc = Document(file_path)
    text = "\n".join(para.text for para in doc.paragraphs)
    return text

def extract_text_from_csv(file_path):
    """Extract data from CSV file."""
    with open(file_path, 'r') as file:
        rows = file.readlines()
        return "\n".join(rows)

def extract_text_from_json(file_path):
    """Extract data from JSON file."""
    with open(file_path, 'r') as file:
        data = json.load(file)
        return json.dumps(data, indent=4)