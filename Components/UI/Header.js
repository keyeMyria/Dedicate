import React from 'react';
import { AppRegistry, View, StyleSheet } from 'react-native';
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
        backgroundColor:'#6666cc'
    }
});

AppRegistry.registerComponent("Header", () => Header);