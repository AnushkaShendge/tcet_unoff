import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import AudioWaveform from '../components/AudioWaveform';

export default function HomeScreen() {
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState();
    const [hasPermission, setHasPermission] = useState(false);
    const [sound, setSound] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [recordedURI, setRecordedURI] = useState(null);
    const [transcription, setTranscription] = useState('');
    const [language, setLanguage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Audio.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    async function startRecording() {
        try {
            if (!hasPermission) {
                const { status } = await Audio.requestPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permission for audio recording is required.');
                    return;
                }
                setHasPermission(true);
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true
            });
            
            const { recording } = await Audio.Recording.createAsync({
                android: {
                    extension: '.webm',
                    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_WEBM,
                    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_VORBIS,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.m4a',
                    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                    linearPCM: false,
                    audioFileType: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
                },
            });
            setRecording(recording);
            setIsRecording(true);
        } catch (err) {
            console.error('Error recording: ', err);
        }
    }

    async function stopRecording() {
        try {
            if (!recording) return;
            
            setIsRecording(false);
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecordedURI(uri);
            setRecording(undefined);
            
            // Send to backend
            await sendAudioToBackend(uri);
        } catch (err) {
            console.error('Error stopping recording: ', err);
        }
    }

    async function sendAudioToBackend(uri) {
        setIsLoading(true);
        try {
            // Get file extension from URI
            const extension = uri.split('.').pop();
            const mimeType = extension === 'webm' ? 'audio/webm' : 
                           extension === 'm4a' ? 'audio/m4a' : 
                           'audio/3gpp'; // default for .3gp files

            const formData = new FormData();
            formData.append('file', {
                uri: uri,
                type: mimeType,
                name: `recording.${extension}`
            });

            const response = await fetch('https://lioness-superb-emu.ngrok-free.app/transcribe', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = await response.json();
            setTranscription(data.transcription);
            setLanguage(data.detected_language.name);
        } catch (error) {
            console.error('Error sending audio:', error);
            alert('Error sending audio: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function playSound() {
        try {
            if (isPlaying) {
                if (sound) {
                    await sound.stopAsync();
                    setIsPlaying(false);
                }
                return;
            }

            if (recordedURI) {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: recordedURI }
                );
                setSound(newSound);

                // Add playback status listener
                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.didJustFinish) {
                        setIsPlaying(false);
                    }
                });

                await newSound.playAsync();
                setIsPlaying(true);
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    // Cleanup sound when component unmounts
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Voice Recognition</Text>
                
                <View style={styles.waveformContainer}>
                    <AudioWaveform isRecording={isRecording} />
                </View>

                <TouchableOpacity 
                    style={[styles.recordButton, isRecording && styles.recordingButton]}
                    onPress={isRecording ? stopRecording : startRecording}
                >
                    <Ionicons 
                        name={isRecording ? "stop" : "mic"} 
                        size={32} 
                        color="white" 
                    />
                </TouchableOpacity>

                {isLoading && (
                    <ActivityIndicator size="large" color="#4CAF50" />
                )}

                {transcription && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.languageText}>
                            Detected Language: {language}
                        </Text>
                        <Text style={styles.transcriptionText}>
                            {transcription}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
    },
    waveformContainer: {
        height: 120,
        justifyContent: 'center',
        marginBottom: 40,
    },
    recordButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    recordingButton: {
        backgroundColor: '#f44336',
    },
    resultContainer: {
        marginTop: 40,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        width: '100%',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    languageText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    transcriptionText: {
        fontSize: 18,
        color: '#333',
        lineHeight: 24,
    },
});
