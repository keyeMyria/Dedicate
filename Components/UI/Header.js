import React from 'react';
import { AppRegistry, View, StyleSheet } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import StatusBarComponent from './StatusBarComponent';
import TitleBar from './TitleBar';

export default class Header extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
        <View style={styles.container}>
            <StatusBarComponent/>
            <TitleBar {...this.props} />
        </View> 
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:AppStyles.color
    }
});

AppRegistry.registerComponent("Header", () => Header);