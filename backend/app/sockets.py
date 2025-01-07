from flask_socketio import send
from . import socketio

@socketio.on('message')
def handle_message(data):
    """SocketIO event to handle real-time chat messages."""
    try:
        send(data, broadcast=True)
    except Exception as e:
        print(f"Error during socket message broadcast: {str(e)}")