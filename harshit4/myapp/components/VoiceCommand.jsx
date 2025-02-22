import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import Voice from '@react-native-voice/voice';
import axios from 'axios';
import BackgroundService from 'react-native-background-actions';

const VoiceCommand = () => {
    const [recognizedText, setRecognizedText] = useState('');
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        Voice.onSpeechResults = (e) => {
            const text = e.value[0];
            setRecognizedText(text);
            checkForTrigger(text);
        };

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const checkForTrigger = async (text) => {
        if (text.toLowerCase().includes("companion")) {
            console.log('Trigger detected, sending text to backend...');
            sendToBackend(text);
        }
    };

    const sendToBackend = async (text) => {
        try {
            const response = await axios.post('http://YOUR_FLASK_SERVER/api/command', { text });
            console.log('Backend Response:', response.data);
        } catch (error) {
            console.error('Error sending data to backend:', error);
        }
    };

    const backgroundVoiceTask = async () => {
        try {
            while (true) {
                await Voice.start('en-US');
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Keep listening
            }
        } catch (error) {
            console.error('Error in background voice task:', error);
        }
    };

    const startBackgroundListening = async () => {
        const options = {
            taskName: 'VoiceRecognition',
            taskTitle: 'Listening for Commands',
            taskDesc: 'Voice recognition is running in the background.',
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            linkingURI: 'yourapp://home',
            parameters: {},
        };

        await BackgroundService.start(backgroundVoiceTask, options);
        setIsListening(true);
    };

    const stopBackgroundListening = async () => {
        await BackgroundService.stop();
        setIsListening(false);
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>Recognized: {recognizedText}</Text>
            <Button title={isListening ? "Stop Listening" : "Start Listening"} onPress={isListening ? stopBackgroundListening : startBackgroundListening} />
        </View>
    );
};

export default VoiceCommand;
