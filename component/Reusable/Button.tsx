import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';

interface ButtonProps {
    onPress?: () => void;
    backgroundColor?: string;
    title: string;
}

const Button: React.FC<ButtonProps> = ({ onPress, backgroundColor = '#0049AC', title }) => {
    const buttonStyle: ViewStyle = {
        backgroundColor,
        padding: 10,
        borderRadius: 5,
    };

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, buttonStyle]}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Button;