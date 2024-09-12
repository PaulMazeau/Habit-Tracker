import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle , View} from 'react-native';
import CheckLight from '../../assets/icons/Check-light.svg';

interface CheckInputProps {
    id : string ;
    onChange ?: () => void;
    content : string;
    checked ?: boolean;
}

const CheckInput : React.FC<CheckInputProps> = ({id, onChange, content, checked }) => {
    return (
        <TouchableOpacity onPress={onChange} style={styles.container}>
            <View style={ styles.check}>
                {checked && 
                        <CheckLight style={styles.checkLogo} width={'100%'} height={'auto'}></CheckLight>
                }
            </View>
            <Text style={styles.text}>{content}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        display : 'flex',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor : '#F3EFEE',
        gap : 10,
        width : '80%',
        justifyContent : 'flex-start',
        marginBottom : 10,
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
    },
    check: {
        position : 'relative',
        fontSize: 16,
        fontWeight: '500',
        aspectRatio : 1,
        height : 'auto',
        width : '8%',
        backgroundColor : "white",
        borderColor : '#BBB5B5',
        borderWidth : 1,
        borderRadius : 4,
    },
    checkLogo: {
        aspectRatio : 1,
        width : '100%',
        height : 'auto',
        position : "absolute",
        top : 0,
    }
});

export default CheckInput;
