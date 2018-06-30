import React from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback, TextInput, ScrollView, Keyboard  } from 'react-native';
import Text from 'ui/Text';
import AppStyles from 'dedicate/AppStyles';

export default class Modal extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            styles:{
                darkBackgroundContainer:{height:0},
                darkBackground:{height:0},
                modalContainer:{top:30, left:50, opacity:0}
            },
            modalContainer:{width:0, height:0},
            win:{width:0, height:0},
            visible:false,
            opacity:{opacity:0},
            content: <View></View>
        }
        global.Modal = this;

        //bind methods
        this.onLayoutChange = this.onLayoutChange.bind(this);
        this.onOrientationChange = this.onOrientationChange.bind(this);
    }

    ComponentWillMount(){
        Dimensions.addEventListener('change', this.onOrientationChange);
    }

    componentWillUnmount(){
        Dimensions.removeEventListener('change', this.onOrientationChange);
    }

    onLayoutChange(event){
        var {width, height} = Dimensions.get('screen');
        if(this.state.win.width != width || this.state.win.height != height){
            var layout = event.nativeEvent.layout;
            this.setState({
                modalContainer:{width:layout.width, height:layout.height}, 
                win:{width:width, height:height}
            }, () => {
                this.onOrientationChange();
            });
        }
    }

    onOrientationChange(){
        //realign modal window
        var {width, height} = Dimensions.get('window');
        var styles = this.state.styles;
        var modalContainer = this.state.modalContainer;
        styles.darkBackgroundContainer = {height:height};
        styles.darkBackground = {height:height};
        styles.modalContainer = {
            top:Math.round((height - modalContainer.height) / 2), 
            left:Math.round((width - modalContainer.width) / 2),
            maxHeight:height - 60,
            maxWidth:width - 60,
            opacity:1
        };
        this.setState({styles:styles});
    }

    show = () => {
        Keyboard.dismiss();
        TextInput.State.blurTextInput();
        this.setState({visible:true});
    }

    hide = () => {
        this.setState({visible:false})
    }

    setContent = (title, content) => {
        this.setState({title:title, content:content});
    }

    onPressDarkBackground = () => {
        this.setState({visible:false});
    }

    render(){
        if(this.state.visible === true){
            return (
                <View style={[styles.container]}>
                    <View style={[styles.modalContainer, this.state.styles.modalContainer]}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{this.state.title}</Text>
                        </View>
                        <ScrollView onLayout={this.onLayoutChange}>
                            {this.state.content}
                        </ScrollView>
                    </View>
                    <View style={[styles.darkBackgroundContainer, this.state.styles.darkBackgroundContainer]}>
                        <TouchableWithoutFeedback onPress={this.onPressDarkBackground}>
                            <View style={[styles.darkBackground, this.state.styles.darkBackground]}></View>
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
    titleContainer:{paddingTop:15, paddingHorizontal:15},
    title:{fontSize:20},
    darkBackgroundContainer:{position:'absolute', top:0, right:0, bottom:0, left:0},
    darkBackground:{backgroundColor:'rgba(0,0,0,0.7)', position:'absolute', top:0, right:0, bottom:0, left:0, zIndex:5000},
    modalContainer:{position:'absolute', zIndex:5001, backgroundColor:AppStyles.backgroundColor}
});