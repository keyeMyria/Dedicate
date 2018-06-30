import React from 'react';
import { View, Image, StyleSheet, BackHandler } from 'react-native';
import Text from 'ui/Text';
import Body from 'ui/Body';


export default class AnalyticsScreen extends React.Component {
    constructor(props) {
        super(props);
        //bind events
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        this.props.navigation.dispatch({ type: 'Navigation/BACK' });
        return true;
    }

    render() {
        return (
            <Body {...this.props} title="Analytics" screen="Analytics">
                <View>
                    
                </View>
            </Body>
        );
    }
}