import React from 'react';
import { Button } from 'react-native';

const RecordButton = ({ onPress, isRecording }) => (
  <Button title={isRecording ? "Listening..." : "Record"} onPress={onPress} />
);

export default RecordButton;