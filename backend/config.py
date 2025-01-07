import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Configuration settings for the app."""
    UPLOAD_FOLDER = 'uploads/'
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx', 'xlsx', 'json', 'csv'}
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB limit for uploads
    DEEPSEEK_API_KEY = os.getenv('sk-7df095967fcd40fb9942443e2d9fadce')  # Make sure .env has this key