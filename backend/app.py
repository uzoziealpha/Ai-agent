from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, send
import requests

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

# Endpoint for DeepSeek API interaction
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # Get user input from the frontend request
        user_input = request.json.get('message')

        # Make the request to the DeepSeek API
        response = requests.post(
            'https://api.deepseek.com/v1/chat/completions',  # Correct DeepSeek API endpoint
            headers={
                'Authorization': 'Bearer ',  # Use your actual DeepSeek API key
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

# Real-time chat monitoring using SocketIO
@socketio.on('message')
def handle_message(data):
    print(f"Received message: {data}")
    send(data, broadcast=True) 



if __name__ == '__main__':
    # Start the Flask app with SocketIO on port 5001
    socketio.run(app, host='0.0.0.0', port=5001)