import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import AppStyles from 'dedicate/AppStyles';

export default class ButtonOutline extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            button:{},
            buttonText:{}
        }
    }

    onPressIn = event => {
        this.setState({
            button:{borderColor:AppStyles.buttonOutlinePressColor},
            buttonText:{color:AppStyles.buttonOutlinePressTextColor}
        })
        if(this.props.onPressIn){this.props.onPressIn(event);}
    }

    onPressOut = event => {
        this.setState({
            button:{},
            buttonText:{}
        })
        if(this.props.onPressOut){this.props.onPressOut(event);}
        if(this.props.onPress){this.props.onPress(event);}
    }

    render(){
        return (
            <TouchableOpacity onPressIn={this.onPressIn} onPressOut={this.onPressOut} activeOpacity={1}>
                <View style={[this.styles.button, this.state.button]}>
                    <Text style={[this.styles.buttonText, this.state.buttonText]}>{this.props.text}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    styles = StyleSheet.create({
        button:{
            borderWidth:2,
            borderColor:AppStyles.buttonOutlineColor,
            paddingHorizontal:25,
            paddingTop:6,
            paddingBottom:7,
            alignItems:'center',
            borderRadius:7
        },
        buttonText:{
            color:AppStyles.buttonOutlineTextColor, 
            fontSize:17
        }
    });
}