import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import StatusBarComponent from 'ui/StatusBarComponent';
import TitleBar from 'ui/TitleBar';

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