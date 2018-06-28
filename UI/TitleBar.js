import React from 'react';
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import { DrawerActions } from 'react-navigation';
import IconMenu from 'icons/IconMenu';

export default class TitleBar extends React.Component {
    constructor(props){
        super(props);
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container_menu}>
                    <TouchableOpacity onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                        <IconMenu size="xsmall" color={AppStyles.headerTextColor}></IconMenu>
                    </TouchableOpacity>
                </View>
                <View style={styles.container_title}>
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
                <View style={styles.container_buttons}>
                    <TitleBarButtons {...this.props} />
                </View>
            </View>
        );
    }
}

const TitleBarButtons = (props) => {
    if(props.titleBarButtons){
        return props.titleBarButtons;
    }else{
        return <View></View>
    }
}

const styles = StyleSheet.create({
    container: { zIndex:100},
    container_menu: { alignSelf: 'flex-start', padding: 15 },
    container_title: { position:'absolute', top: 14, alignSelf: 'center' },
    container_buttons: {position: 'absolute', top:0, right:0, height:55},
    title:{ fontSize:19, color:'white' }
});

AppRegistry.registerComponent("TitleBar", () => TitleBar);