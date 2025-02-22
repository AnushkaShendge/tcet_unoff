import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const BAR_COUNT = 30;

const AudioWaveform = ({ isRecording }) => {
    const animations = [...Array(BAR_COUNT)].map(() => 
        React.useRef(new Animated.Value(0)).current
    );

    React.useEffect(() => {
        if (isRecording) {
            animations.forEach((anim, i) => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(anim, {
                            toValue: Math.random(),
                            duration: 500 + Math.random() * 500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(anim, {
                            toValue: 0,
                            duration: 500 + Math.random() * 500,
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            });
        } else {
            animations.forEach(anim => {
                anim.setValue(0);
                anim.stopAnimation();
            });
        }
    }, [isRecording]);

    return (
        <View style={styles.container}>
            {animations.map((anim, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.bar,
                        {
                            transform: [
                                {
                                    scaleY: anim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.3, 1],
                                    }),
                                },
                            ],
                        },
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 100,
        gap: 2,
    },
    bar: {
        width: 3,
        height: 40,
        backgroundColor: '#4CAF50',
        borderRadius: 2,
    },
});

export default AudioWaveform;
