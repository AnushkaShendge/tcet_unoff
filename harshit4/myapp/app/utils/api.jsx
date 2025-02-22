import axios from 'axios';

const API_URL = "http://YOUR_FLASK_SERVER/api";

export const sendVoiceCommand = async (text) => {
    return await axios.post(`${API_URL}/transcribe`, { text });
};

export const executeTask = async (action) => {
    return await axios.post(`${API_URL}/execute`, { action });
};

export default { sendVoiceCommand, executeTask };