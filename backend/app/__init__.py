from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from .config import Config  # Import Config class

# Initialize Flask app and enable CORS
app = Flask(__name__)
app.config.from_object(Config)  # Load configuration from Config class
CORS(app)
socketio = SocketIO(app)

# Import routes and sockets after app initialization
from . import routes, sockets