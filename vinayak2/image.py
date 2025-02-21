import os
from dotenv import load_dotenv
import requests
import logging
from datetime import datetime
from PIL import Image
import io

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize API key
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
if not HUGGINGFACE_API_KEY:
    raise ValueError("HUGGINGFACE_API_KEY not found in environment variables")

# API configuration
HF_API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev"
HF_HEADERS = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}

def generate_and_save_image(prompt):
    """Generate image from text and save it as PNG."""
    try:
        logger.info(f"Generating image with prompt: {prompt}")
        
        # Make API request
        response = requests.post(
            HF_API_URL,
            headers=HF_HEADERS,
            json={"inputs": prompt},
            timeout=300
        )
        
        if response.status_code != 200:
            logger.error(f"Image generation failed with status code: {response.status_code}")
            return None
            
        # Convert response to image
        image = Image.open(io.BytesIO(response.content))
        
        # Create filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"generated_image_{timestamp}.png"
        
        # Save image
        image.save(filename, "PNG")
        logger.info(f"Image saved as: {filename}")
        return filename
        
    except Exception as e:
        logger.error(f"Error generating image: {str(e)}")
        return None

# Example usage
if __name__ == "__main__":
    # Get user input
    prompt = input("Enter text to generate image: ")
    
    # Generate and save image
    saved_file = generate_and_save_image(prompt)
    
    if saved_file:
        print(f"Image successfully saved as: {saved_file}")
    else:
        print("Failed to generate and save image")