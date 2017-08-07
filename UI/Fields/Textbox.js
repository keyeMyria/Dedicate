import React from 'react';
import { TextInput, View, Text } from 'react-native';

export default function Textbox(props) {
    return (
        <View>
            <TextInput {...props} />
        </View>
    );
}