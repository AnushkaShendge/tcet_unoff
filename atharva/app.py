from flask import Flask, request, jsonify
from speechbrain.inference.classifiers import EncoderClassifier
from werkzeug.utils import secure_filename
import os
import subprocess
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'm4a', 'flac', 'ogg'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize the language identification model
language_id = None

def load_model():
    global language_id
    if language_id is None:
        language_id = EncoderClassifier.from_hparams(
            source="speechbrain/lang-id-voxlingua107-ecapa",
            savedir="tmp"
        )

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_language_name(lang_code_and_name):
    """Extract just the language name from the format 'code: Name'"""
    return lang_code_and_name.split(': ')[1] if ': ' in lang_code_and_name else lang_code_and_name

def convert_m4a_to_mp3(input_path):
    """Convert m4a file to mp3 using ffmpeg"""
    output_path = input_path.rsplit('.', 1)[0] + '.mp3'
    try:
        # Run ffmpeg command to convert m4a to mp3
        cmd = ['ffmpeg', '-i', input_path, '-acodec', 'libmp3lame', '-ab', '192k', output_path, '-y']
        subprocess.run(cmd, check=True, capture_output=True)
        logger.info(f"Converted {input_path} to {output_path}")
        return output_path
    except subprocess.CalledProcessError as e:
        logger.error(f"FFmpeg conversion failed: {e.stderr.decode()}")
        raise Exception(f"Failed to convert audio: {e}")
    except Exception as e:
        logger.error(f"Conversion error: {str(e)}")
        raise

@app.route('/identify_language', methods=['POST'])
def identify_language():
    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400

    converted_file = None
    try:
        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Convert m4a to mp3 if needed
        if filename.lower().endswith('.m4a'):
            logger.info(f"Converting m4a file: {filepath}")
            converted_file = convert_m4a_to_mp3(filepath)
            processing_path = converted_file
        else:
            processing_path = filepath

        # Load the model if not already loaded
        load_model()

        try:
            # Use SpeechBrain's audio loading
            signal = language_id.load_audio(processing_path)
            prediction = language_id.classify_batch(signal)
            
        finally:
            # Clean up the uploaded and converted files
            if os.path.exists(filepath):
                os.remove(filepath)
            if converted_file and os.path.exists(converted_file):
                os.remove(converted_file)

        # Extract just the language name and return it
        language_name = extract_language_name(prediction[3][0])
        return jsonify({
            'language': language_name,
            'file_processed': os.path.basename(processing_path)
        })

    except Exception as e:
        # Add detailed error logging
        logger.error(f"Error processing request: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        
        # Clean up files in case of error
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        if converted_file and os.path.exists(converted_file):
            os.remove(converted_file)
            
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Check if ffmpeg is installed
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        logger.info("FFmpeg is installed and working")
    except (subprocess.SubprocessError, FileNotFoundError):
        logger.error("FFmpeg is not installed or not in PATH. Please install FFmpeg to convert m4a files.")
        print("ERROR: FFmpeg is required for m4a conversion. Please install it before running this app.")
        print("  - Ubuntu/Debian: sudo apt-get install ffmpeg")
        print("  - macOS: brew install ffmpeg")
        print("  - Windows: Download from ffmpeg.org and add to PATH")
        exit(1)
        
    # Load the model when starting the server
    load_model()
    app.run(debug=True, port=4000)