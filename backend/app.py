from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, send
import requests
import os
from werkzeug.utils import secure_filename
import PyPDF2
from docx import Document

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

# Configure file upload settings
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'docx', 'xlsx'}  # Allowed file types
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Max file size 16MB

# DeepSeek API Key - Replace with your actual API key
DEEPSEEK_API_KEY = 'sk-7df095967fcd40fb9942443e2d9fadce'

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Helper function to extract text from PDF
def extract_text_from_pdf(file_path):
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

# Helper function to extract text from DOCX
def extract_text_from_docx(file_path):
    doc = Document(file_path)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

# Endpoint for DeepSeek API interaction
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # Get user input from the frontend request
        user_input = request.json.get('message')

        if not user_input:
            return jsonify({'error': 'No message provided'}), 400

        # Make the request to the DeepSeek API
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',  # Correct DeepSeek API endpoint
            headers={
                'Authorization': f'Bearer {DEEPSEEK_API_KEY}',  # Use your actual DeepSeek API key securely
                'Content-Type': 'application/json',
            },
            json={
                'model': 'deepseek-chat',  # Adjust as needed based on DeepSeek documentation
                'messages': [{'role': 'user', 'content': user_input}]
            }
        )

        # Check if the response is successful
        if response.status_code == 200:
            data = response.json()
            return jsonify(data)
        else:
            return jsonify({'error': 'Failed to get response from DeepSeek API'}), response.status_code

    except requests.exceptions.RequestException as e:
        # Handle request errors
        return jsonify({'error': str(e)}), 500


# File upload endpoint
@app.route('/api/upload', methods=['POST'])
def upload_file():
    try:
        # Check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400

        file = request.files['file']

        # If no file is selected
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Check if the file has an allowed extension
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400

        # Secure the filename and save it to the upload folder
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Extract text based on file type
        extracted_text = ""
        if filename.endswith('.pdf'):
            extracted_text = extract_text_from_pdf(file_path)
        elif filename.endswith('.docx'):
            extracted_text = extract_text_from_docx(file_path)

        # Check if text extraction was successful
        if not extracted_text:
            return jsonify({'error': 'Unable to extract text from the file'}), 400

        # Optionally, send the extracted text for summarization or further processing
        return jsonify({
            'success': True,
            'message': 'File uploaded and processed successfully!',
            'extracted_text': extracted_text[:500]  # Preview the first 500 characters
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Real-time chat monitoring using SocketIO
@socketio.on('message')
def handle_message(data):
    try:
        send(data, broadcast=True)
    except Exception as e:
        print(f"Error during socket message broadcast: {str(e)}")


if __name__ == '__main__':
    # Ensure the upload folder exists
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Start the Flask app with SocketIO on port 5001
    socketio.run(app, host='0.0.0.0', port=5001)