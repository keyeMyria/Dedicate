import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Body from 'ui/Body';


export default class SettingsScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Body {...this.props} title="Settings">
                <View>
                    
                </View>
            </Body>
        );
    }
}