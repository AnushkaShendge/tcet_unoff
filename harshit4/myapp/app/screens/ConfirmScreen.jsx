import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const ConfirmScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { action } = params;

    const handleConfirm = () => {
        // Handle confirmation logic
        router.back();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Confirm Action:</Text>
            <Text style={styles.actionText}>{action}</Text>
            <Button title="Confirm" onPress={handleConfirm} />
            <Button title="Cancel" onPress={() => router.back()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
    actionText: {
        fontSize: 18,
        marginBottom: 30,
        fontWeight: 'bold',
    },
});

export default ConfirmScreen;
