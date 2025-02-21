from flask import Flask, request, jsonify
from speechbrain.inference.classifiers import EncoderClassifier
from werkzeug.utils import secure_filename
import os
import subprocess
import logging
import requests
from flask_cors import CORS


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'm4a', 'flac', 'ogg', 'webm'}
TARGET_FORMAT = 'wav'  # The format we'll convert to for processing

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

def convert_audio_to_target_format(input_path):
    """Convert any audio file to the target format using ffmpeg"""
    output_path = input_path.rsplit('.', 1)[0] + f'.{TARGET_FORMAT}'
    try:
        # Run ffmpeg command to convert audio to target format
        # Using PCM 16-bit format for maximum compatibility
        cmd = ['ffmpeg', '-i', input_path, '-acodec', 'pcm_s16le', '-ar', '16000', output_path, '-y']
        subprocess.run(cmd, check=True, capture_output=True)
        logger.info(f"Converted {input_path} to {output_path}")
        return output_path
    except subprocess.CalledProcessError as e:
        logger.error(f"FFmpeg conversion failed: {e.stderr.decode()}")
        raise Exception(f"Failed to convert audio: {e}")
    except Exception as e:
        logger.error(f"Conversion error: {str(e)}")
        raise

def get_language_code(language_name):
    """Convert language name to code for transcription"""
    # Add mappings as needed
    language_mappings = {
        'English': 'en',
        'Hindi': 'hi',
        'Marathi': 'mr',
        'Spanish': 'es',
        'French': 'fr',
        'German': 'de',
        'Chinese': 'zh',
        'Japanese': 'ja',
        'Korean': 'ko',
        'Russian': 'ru',
        'Italian': 'it',
        'Portuguese': 'pt',
        'Arabic': 'ar',
        'Bengali': 'bn',
        'Punjabi': 'pa',
        'Gujarati': 'gu',
        'Tamil': 'ta',
        'Telugu': 'te',
        'Malayalam': 'ml',
        'Urdu': 'ur',
        'Thai': 'th',
        'Turkish': 'tr',
        'Vietnamese': 'vi',
        'Persian': 'fa',
        'Greek': 'el',
        'Hebrew': 'he',
        'Dutch': 'nl',
        'Swedish': 'sv',
        'Polish': 'pl',
        'Danish': 'da',
        'Finnish': 'fi',
        'Hungarian': 'hu',
        'Czech': 'cs',
        'Romanian': 'ro',
        'Indonesian': 'id',
        'Filipino': 'tl',
        'Swahili': 'sw',
        'Afrikaans': 'af',
        'Ukrainian': 'uk',
        'Serbian': 'sr',
        'Bulgarian': 'bg',
        'Slovak': 'sk',
        'Lithuanian': 'lt',
        'Latvian': 'lv',
        'Estonian': 'et',
    }

    return language_mappings.get(language_name, 'en')  # Default to English if not found

def convert_webm_to_mp3(input_path):
    """Convert WebM file to MP3 format using ffmpeg"""
    output_path = input_path.rsplit('.', 1)[0] + '.mp3'
    try:
        # Run ffmpeg command to convert WebM to MP3
        cmd = ['ffmpeg', '-i', input_path, '-vn', '-acodec', 'libmp3lame', '-ab', '192k', '-ar', '44100', output_path, '-y']
        subprocess.run(cmd, check=True, capture_output=True)
        logger.info(f"Converted WebM to MP3: {input_path} -> {output_path}")
        return output_path
    except subprocess.CalledProcessError as e:
        logger.error(f"FFmpeg conversion failed: {e.stderr.decode()}")
        raise Exception(f"Failed to convert WebM to MP3: {e}")
    except Exception as e:
        logger.error(f"Conversion error: {str(e)}")
        raise

@app.route('/identify_language', methods=['POST'])
def identify_language():
    converted_file = None
    try:
        # Check if a file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Enhanced file information logging
        file_extension = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'no extension'
        file_mimetype = file.content_type
        logger.info("=" * 50)
        logger.info("FILE INFORMATION:")
        logger.info(f"Original filename: {file.filename}")
        logger.info(f"File extension: {file_extension}")
        logger.info(f"File MIME type: {file_mimetype}")
        logger.info(f"Content type from request: {request.content_type}")
        logger.info("=" * 50)
        
        if not file_extension in {'wav', 'mp3', 'm4a', 'flac', 'ogg', 'webm'}:
            logger.warning(f"File type {file_extension} not in allowed types")
            return jsonify({'error': 'Invalid file type'}), 400

        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Log file size and path
        file_size = os.path.getsize(filepath)
        logger.info("=" * 50)
        logger.info("SAVED FILE INFORMATION:")
        logger.info(f"Saved file path: {filepath}")
        logger.info(f"File size: {file_size} bytes")
        logger.info("=" * 50)
        
        # Handle different input formats
        if filename.lower().endswith('.webm'):
            logger.info(f"Converting webm file: {filepath}")
            converted_file = convert_webm_to_mp3(filepath)
            processing_path = converted_file
            logger.info(f"Converted webm to mp3: {converted_file}")
        elif filename.lower().endswith('.m4a'):
            logger.info(f"Converting m4a file: {filepath}")
            converted_file = convert_m4a_to_mp3(filepath)
            processing_path = converted_file
        elif filename.lower().endswith('.ogg'):
            logger.info(f"Converting ogg file: {filepath}")
            converted_file = convert_ogg_to_mp3(filepath)
            processing_path = converted_file
        else:
            processing_path = filepath
            logger.info(f"Using original file format: {file_extension}")

        logger.info("=" * 50)
        logger.info("PROCESSING FILE INFORMATION:")
        logger.info(f"Processing path: {processing_path}")
        logger.info(f"Final format: {os.path.splitext(processing_path)[1]}")
        logger.info("=" * 50)

        # Load the model if not already loaded
        load_model()

        try:
            # Use SpeechBrain's audio loading
            signal = language_id.load_audio(processing_path)
            prediction = language_id.classify_batch(signal)
            
        finally:
            # Clean up the uploaded and converted files
            for file_path in [filepath, converted_file]:
                if file_path and os.path.exists(file_path):
                    try:
                        os.remove(file_path)
                    except Exception as e:
                        logger.error(f"Error removing file {file_path}: {e}")

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
        for file_path in [filepath, converted_file]:
            if file_path and os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception as cleanup_error:
                    logger.error(f"Error during cleanup: {cleanup_error}")
            
        return jsonify({'error': str(e)}), 500

@app.route('/transcribe', methods=['POST'])
def transcribe():
    converted_file = None
    wav_file = None
    try:
        # Check if a file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Enhanced file information logging
        file_extension = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else 'no extension'
        file_mimetype = file.content_type
        logger.info("=" * 50)
        logger.info("FILE INFORMATION:")
        logger.info(f"Original filename: {file.filename}")
        logger.info(f"File extension: {file_extension}")
        logger.info(f"File MIME type: {file_mimetype}")
        logger.info(f"Content type from request: {request.content_type}")
        logger.info("=" * 50)
        
        if not file_extension in {'wav', 'mp3', 'm4a', 'flac', 'ogg', 'webm'}:
            logger.warning(f"File type {file_extension} not in allowed types")
            return jsonify({'error': 'Invalid file type'}), 400

        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Log file size and path
        file_size = os.path.getsize(filepath)
        logger.info("=" * 50)
        logger.info("SAVED FILE INFORMATION:")
        logger.info(f"Saved file path: {filepath}")
        logger.info(f"File size: {file_size} bytes")
        logger.info("=" * 50)
        
        # Handle different input formats
        if filename.lower().endswith('.webm'):
            logger.info(f"Converting webm file: {filepath}")
            converted_file = convert_webm_to_mp3(filepath)
            processing_path = converted_file
            logger.info(f"Converted webm to mp3: {converted_file}")
        elif filename.lower().endswith('.m4a'):
            logger.info(f"Converting m4a file: {filepath}")
            converted_file = convert_m4a_to_mp3(filepath)
            processing_path = converted_file
        elif filename.lower().endswith('.ogg'):
            logger.info(f"Converting ogg file: {filepath}")
            converted_file = convert_ogg_to_mp3(filepath)
            processing_path = converted_file
        else:
            processing_path = filepath
            logger.info(f"Using original file format: {file_extension}")

        logger.info("=" * 50)
        logger.info("PROCESSING FILE INFORMATION:")
        logger.info(f"Processing path: {processing_path}")
        logger.info(f"Final format: {os.path.splitext(processing_path)[1]}")
        logger.info("=" * 50)

        # First detect the language
        load_model()
        signal = language_id.load_audio(processing_path)
        prediction = language_id.classify_batch(signal)
        detected_language = extract_language_name(prediction[3][0])
        language_code = get_language_code(detected_language)

        # Make request to the transcription service
        transcription_url = "https://5d3b-34-145-52-224.ngrok-free.app/transcribe/"
        
        # Open and close the file properly using a context manager
        with open(processing_path, 'rb') as audio_file:
            files = {
                'file': audio_file
            }
            data = {
                'language': language_code
            }
            response = requests.post(transcription_url, files=files, data=data)
        
        # Now that the file handle is closed, we can safely remove the files
        if os.path.exists(filepath):
            os.remove(filepath)
        if converted_file and os.path.exists(converted_file):
            os.remove(converted_file)
        
        # Add language detection information to response
        print(response)
        result = response.json()
        result['detected_language'] = {
            'name': detected_language,
            'code': language_code
        }
        return jsonify(result)

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        
        # Clean up files in case of error
        try:
            if 'filepath' in locals() and os.path.exists(filepath):
                os.remove(filepath)
            if converted_file and os.path.exists(converted_file):
                os.remove(converted_file)
        except Exception as cleanup_error:
            logger.error(f"Error during cleanup: {cleanup_error}")
            
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Check if ffmpeg is installed
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        logger.info("FFmpeg is installed and working")
    except (subprocess.SubprocessError, FileNotFoundError):
        logger.error("FFmpeg is not installed or not in PATH. Please install FFmpeg to convert audio files.")
        print("ERROR: FFmpeg is required for audio conversion. Please install it before running this app.")
        print("  - Ubuntu/Debian: sudo apt-get install ffmpeg")
        print("  - macOS: brew install ffmpeg")
        print("  - Windows: Download from ffmpeg.org and add to PATH")
        exit(1)
        
    # Load the model when starting the server
    load_model()
    app.run(debug=True, port=4000)