import React from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import AppStyles from '../AppStyles';

export default class TitleBar extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <View style={this.styles.container}>
                <View style={this.styles.container_menu}>
                </View>
                <View style={this.styles.container_title}>
                    <Text style={this.styles.title}>{this.props.title}</Text>
                </View>
                
                <View style={this.styles.container_leftbtns}>
                    {this.props.titleBarLeftButtons}
                </View>
                <View style={this.styles.container_buttons}>
                    {this.props.titleBarButtons}
                </View>
            </View>
        );
    }

    styles = StyleSheet.create({
        container: { zIndex:100, height:55},
        container_menu: { alignSelf: 'flex-start', padding: 15 },
        container_title: { position:'absolute', top: 12, alignSelf: 'center' },
        container_leftbtns:{position: 'absolute', top:0, left:0, height:55},
        container_buttons: {position: 'absolute', top:0, right:0, height:55},
        title:{ fontSize:22, color:AppStyles.headerTextColor }
    });
}

AppRegistry.registerComponent("TitleBar", () => TitleBar);