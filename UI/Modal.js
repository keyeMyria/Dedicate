import React from 'react';

import { AppRegistry, View, StyleSheet, Text, 
    Dimensions, TouchableWithoutFeedback, TextInput, ScrollView, Keyboard  } from 'react-native';
import FadeView from 'react-native-fade-view';
import AppStyles from 'dedicate/AppStyles';

export default class Modal extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            styles:{
                darkBackgroundContainer:{height:0},
                darkBackground:{height:0},
                modalContainer:{top:30, left:50}
            },
            visible:false,
            content: <View></View>
        }
        global.Modal = this;
    }

    ComponentDidMount = () => {
        this.onLayoutChange();
    }

    onLayoutChange = event => {
        var win = Dimensions.get('window');
        var modalContainer = event.nativeEvent.layout;
        console.log(modalContainer);
        var styles = this.state.styles;
        styles.darkBackgroundContainer = {height:win.height};
        styles.darkBackground = {height:win.height};
        styles.modalContainer = {
            top:(win.height - modalContainer.height) / 2, 
            left:(win.width - modalContainer.width) / 2,
            maxHeight:win.height - 60,
            maxWidth:win.width - 60
        };
        this.setState({styles:styles});
    }

    show = () => {
        //console.log(TextInput);
        Keyboard.dismiss();
        TextInput.State.blurTextInput();
        this.setState({visible:true});
    }

    hide = () => {
        this.setState({visible:false})
    }

    setContent = (content) => {
        this.setState({content:content});
    }

    onPressDarkBackground = () => {
        this.setState({visible:false});
    }

    render(){
        if(this.state.visible === true){
            return (
                <View style={styles.container}>
                    <ScrollView 
                        style={[styles.modalContainer, this.state.styles.modalContainer]}
                        onLayout={this.onLayoutChange}
                    >
                        {this.state.content(this)}
                    </ScrollView>
                    <View style={[styles.darkBackgroundContainer, this.state.styles.darkBackgroundContainer]}>
                        <TouchableWithoutFeedback onPress={this.onPressDarkBackground}>
                            <View 
                                style={[styles.darkBackground, this.state.styles.darkBackground]} 
                                onLayout={this.onLayoutChange}
                            ></View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            );
        }
        return <View></View>
    }
}

const styles = StyleSheet.create({
    container:{position:'absolute', top:0, right:0, bottom:0, left:0},
    darkBackgroundContainer:{position:'absolute', top:0, right:0, bottom:0, left:0},
    darkBackground:{backgroundColor:'rgba(0,0,0,0.7)', position:'absolute', top:0, right:0, bottom:0, left:0, zIndex:5000},
    modalContainer:{position:'absolute', zIndex:5001, backgroundColor:AppStyles.backgroundColor}
});