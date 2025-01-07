from flask import Flask, request, jsonify
import requests
import json
import pandas as pd
from sqlalchemy import create_engine

app = Flask(__name__)

# DeepSeek API Configuration
DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'  # Replace with the correct URL
DEEPSEEK_API_KEY = 'sk-7df095967fcd40fb9942443e2d9fadce'  # Replace with your actual API key

# Database Configuration
DB_URI = 'mysql+pymysql://user:password@localhost/data_dashboard'  # Update with your DB credentials
engine = create_engine(DB_URI)


# Route 1: File Upload and Data Ingestion
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename.endswith(('.csv', '.xlsx')):
        try:
            # Read and store the data in the database
            data = pd.read_csv(file) if file.filename.endswith('.csv') else pd.read_excel(file)
            data.to_sql('uploaded_data', con=engine, if_exists='replace', index=False)
            return jsonify({'message': 'File uploaded and data stored successfully'}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Invalid file type. Only CSV and Excel files are allowed.'}), 400


# Route 2: Query Handling via DeepSeek API
@app.route('/query', methods=['POST'])
def handle_query():
    user_query = request.json.get('query', '')
    if not user_query:
        return jsonify({'error': 'Query not provided'}), 400

    payload = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": user_query}]
    }

    headers = {
        'Authorization': f'Bearer {DEEPSEEK_API_KEY}',
        'Content-Type': 'application/json',
    }

    try:
        response = requests.post(DEEPSEEK_API_URL, json=payload, headers=headers)
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({'error': 'Error from DeepSeek API', 'details': response.text}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500


# Route 3: Data Retrieval for Visualization
@app.route('/data', methods=['GET'])
def get_data():
    try:
        # Fetch the data from the database
        data = pd.read_sql('SELECT * FROM uploaded_data', con=engine)
        return jsonify(data.to_dict(orient='records')), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Health Check Route
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'message': 'Backend is running successfully'}), 200


if __name__ == '__main__':
    app.run(debug=True)