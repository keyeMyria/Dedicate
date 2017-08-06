import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Body from 'ui/Body';


export default class AnalyticsScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Body {...this.props} title="Analytics">
                <View>
                    
                </View>
            </Body>
        );
    }
}