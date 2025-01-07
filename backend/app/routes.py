from flask import request, jsonify
from . import app
from .utils import allowed_file, extract_text_from_pdf, extract_text_from_docx, extract_text_from_csv, extract_text_from_json
import requests
import os

@app.route('/api/chat', methods=['POST'])
def chat():
    """Endpoint to interact with DeepSeek API."""
    try:
        user_input = request.json.get('message')
        if not user_input:
            return jsonify({'error': 'No message provided'}), 400

        # DeepSeek API request
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {app.config["DEEPSEEK_API_KEY"]}',
                'Content-Type': 'application/json',
            },
            json={
                'model': 'deepseek-chat',
                'messages': [{'role': 'user', 'content': user_input}]
            }
        )

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'Failed to get response from DeepSeek API'}), response.status_code

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Request error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Endpoint for file uploads and text extraction."""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in request'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400

        # Save file securely
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Extract text from the file
        extracted_text = ""
        if filename.endswith('.pdf'):
            extracted_text = extract_text_from_pdf(file_path)
        elif filename.endswith('.docx'):
            extracted_text = extract_text_from_docx(file_path)
        elif filename.endswith('.csv'):
            extracted_text = extract_text_from_csv(file_path)
        elif filename.endswith('.json'):
            extracted_text = extract_text_from_json(file_path)

        if not extracted_text:
            return jsonify({'error': 'Unable to extract text from the file'}), 400

        return jsonify({
            'success': True,
            'message': 'File uploaded and processed successfully!',
            'extracted_text': extracted_text[:500]
        })

    except Exception as e:
        return jsonify({'error': f'Unexpected error: {str(e)}'}), 500