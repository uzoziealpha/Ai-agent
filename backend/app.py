from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, send
import requests
import os
from werkzeug.utils import secure_filename
import PyPDF2
from docx import Document
import json
import csv
import pandas as pd
import logging
from datetime import datetime
import uuid

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

# Configure file upload settings
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'docx', 'xlsx', 'json', 'csv'}  # Allowed file types
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max file size 16MB

# DeepSeek API Key (Replace with your actual API key)
DEEPSEEK_API_KEY = ''

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for file metadata (replace with a database in production)
file_metadata_store = []

# Helper function to check allowed file extensions
def allowed_file(filename):
    """Check if a file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Helper function to extract text from PDF
def extract_text_from_pdf(file_path):
    """Extract text from a PDF file."""
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
            return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        return None

# Helper function to extract text from DOCX
def extract_text_from_docx(file_path):
    """Extract text from a DOCX file."""
    try:
        doc = Document(file_path)
        text = "\n".join(para.text for para in doc.paragraphs)
        return text
    except Exception as e:
        logger.error(f"Error extracting text from DOCX: {str(e)}")
        return None

# Helper function to parse CSV file and extract relevant data
def extract_text_from_csv(file_path):
    """Extract data from CSV file."""
    try:
        data = []
        with open(file_path, mode='r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)  # Read as a dictionary to handle columns by name
            for row in csv_reader:
                data.append(row)  # Append each row as a dictionary
        return data
    except Exception as e:
        logger.error(f"Error extracting data from CSV: {str(e)}")
        return None

# Helper function to parse XLSX file and extract relevant data
def extract_text_from_xlsx(file_path):
    """Extract data from an XLSX file."""
    try:
        data = pd.read_excel(file_path)  # Read the Excel file
        return data.to_dict(orient='records')  # Convert to list of dictionaries (rows)
    except Exception as e:
        logger.error(f"Error extracting data from XLSX: {str(e)}")
        return None

# Helper function to parse JSON file and extract relevant data
def extract_text_from_json(file_path):
    """Extract data from JSON file."""
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
            return data
    except Exception as e:
        logger.error(f"Error extracting data from JSON: {str(e)}")
        return None

# Helper function to store uploaded file metadata
def store_file_metadata(filename, file_type, upload_time, file_id):
    """
    Store metadata about the uploaded file.
    """
    file_metadata_store.append({
        'file_id': file_id,
        'filename': filename,
        'file_type': file_type,
        'upload_time': upload_time,
    })
    logger.info(f"Stored metadata for file: {filename}, ID: {file_id}, Type: {file_type}, Uploaded at: {upload_time}")

# Endpoint for DeepSeek API interaction
@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Endpoint to interact with DeepSeek API.
    Expects a JSON payload with a 'message' key and 'file_id'.
    """
    try:
        user_input = request.json.get('message')
        file_id = request.json.get('file_id')  # Get file ID from frontend

        if not user_input:
            return jsonify({'error': 'No message provided'}), 400

        # Find the file metadata using the file_id
        file_metadata = next((file for file in file_metadata_store if file['file_id'] == file_id), None)
        if not file_metadata:
            return jsonify({'error': 'File not found'}), 404

        # Load the file content based on the file type
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file_metadata['filename'])
        file_content = None

        if file_metadata['file_type'] == 'pdf':
            file_content = extract_text_from_pdf(file_path)
        elif file_metadata['file_type'] == 'docx':
            file_content = extract_text_from_docx(file_path)
        elif file_metadata['file_type'] == 'csv':
            file_content = extract_text_from_csv(file_path)
        elif file_metadata['file_type'] == 'xlsx':
            file_content = extract_text_from_xlsx(file_path)
        elif file_metadata['file_type'] == 'json':
            file_content = extract_text_from_json(file_path)

        if not file_content:
            return jsonify({'error': 'Unable to extract data from the file'}), 400

        # Prepare data for AI
        payload = {
            'model': 'deepseek-chat',  # Adjust model based on DeepSeek documentation
            'messages': [
                {'role': 'system', 'content': f'You are analyzing the file: {file_metadata["filename"]}'},
                {'role': 'user', 'content': user_input},
                {'role': 'assistant', 'content': f'File content: {str(file_content)}'},
            ],
        }

        # DeepSeek API request
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
                'Content-Type': 'application/json',
            },
            json=payload
        )

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            logger.error(f"DeepSeek API error: {response.status_code} - {response.text}")
            return jsonify({'error': 'Failed to get response from DeepSeek API'}), response.status_code

    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        return jsonify({'error': f'Request error: {str(e)}'}), 500
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

# File upload endpoint
@app.route('/api/upload', methods=['POST'])
def upload_file():
    """
    Endpoint for file uploads.
    Supports text extraction from PDF, DOCX, CSV, JSON, XLSX files.
    """
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in request'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400

        # Generate a unique ID for the file
        file_id = str(uuid.uuid4())

        # Save file securely
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Extract data based on file type
        extracted_data = None
        if filename.endswith('.xlsx'):
            extracted_data = extract_text_from_xlsx(file_path)
        elif filename.endswith('.pdf'):
            extracted_data = extract_text_from_pdf(file_path)
        elif filename.endswith('.docx'):
            extracted_data = extract_text_from_docx(file_path)
        elif filename.endswith('.csv'):
            extracted_data = extract_text_from_csv(file_path)
        elif filename.endswith('.json'):
            extracted_data = extract_text_from_json(file_path)

        if not extracted_data:
            return jsonify({'error': 'Unable to extract data from the file'}), 400

        # Store file metadata
        upload_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        file_type = filename.split('.')[-1]  # Extract file extension
        store_file_metadata(filename, file_type, upload_time, file_id)

        return jsonify({
            'success': True,
            'message': 'File uploaded and processed successfully!',
            'file_id': file_id,  # Return the unique file ID
            'filename': filename,
            'file_type': file_type,  # Return the file type
            'upload_time': upload_time,  # Return the upload time
            'extracted_data': extracted_data  # Return processed data as JSON
        })

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

# Endpoint to fetch file metadata
@app.route('/api/files', methods=['GET'])
def get_files():
    """
    Endpoint to fetch metadata for all uploaded files.
    """
    try:
        return jsonify({'success': True, 'files': file_metadata_store})
    except Exception as e:
        logger.error(f"Error fetching file metadata: {str(e)}")
        return jsonify({'error': 'Failed to fetch file metadata'}), 500

# Ensure upload folder exists and start the app
if __name__ == '__main__':
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    logger.info("Starting Flask app...")
    socketio.run(app, host='0.0.0.0', port=5001)