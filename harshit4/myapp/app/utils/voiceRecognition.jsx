import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

export const startRecording = async (callback) => {
    try {
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();

        setTimeout(async () => {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            console.log("Recording finished: ", uri);
            
            // Convert to text (Mock: replace with actual STT API)
            const transcribedText = "Hey Companion, open my notes"; // Mock transcription
            callback(transcribedText);
        }, 3000); // Stop after 3 sec
    } catch (error) {
        console.error("Error recording: ", error);
    }
};

export default { startRecording };