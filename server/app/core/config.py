# app/core/config.py
import os
import google.generativeai as genai
from dotenv import load_dotenv

def init_config():
    # Load environment variables
    load_dotenv()
    
    # Get API key
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
        
    # Configure Gemini
    genai.configure(api_key=api_key)