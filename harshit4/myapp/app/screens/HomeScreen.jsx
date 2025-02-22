import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { executeTask } from '../utils/api';
import RecordButton from '../components/RecordButton';

const HomeScreen = () => {
    const [recognizedText, setRecognizedText] = useState('');
    const [suggestedAction, setSuggestedAction] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [recording, setRecording] = useState();

    async function startRecording() {
        try {
            const perm = await Audio.requestPermissionsAsync();
            if (perm.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });
                const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                setRecording(recording);
                setIsRecording(true);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function stopRecording() {
        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped and stored at', uri);
        // Add logic to handle the recorded audio file
    }

    const confirmAction = async () => {
        setShowModal(false);
        await executeTask(suggestedAction);
        alert('Task executed successfully!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Say your command:</Text>
            <RecordButton onPress={isRecording ? stopRecording : startRecording} isRecording={isRecording} />
            <Text style={styles.recognizedText}>Recognized: {recognizedText}</Text>

            {/* Confirmation Modal */}
            <Modal visible={showModal} transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Do you want to: {suggestedAction}?</Text>
                        <Button title="Yes" onPress={confirmAction} />
                        <Button title="No" onPress={() => setShowModal(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    recognizedText: {
        fontSize: 18,
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
});

export default HomeScreen;