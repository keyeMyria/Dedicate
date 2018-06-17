import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import AppStyles from 'dedicate/AppStyles';

export default class Button extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            button:{},
            buttonText:{}
        }
    }

    onPressIn = event => {
        this.setState({
            button:{backgroundColor:AppStyles.buttonPressColor},
            buttonText:{color:AppStyles.buttonPressTextColor}
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
                <View style={[styles.button, this.state.button]}>
                    <Text style={[styles.buttonText, this.state.buttonText]}>{this.props.text}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    button:{
        backgroundColor:AppStyles.buttonColor,
        paddingHorizontal:25,
        paddingTop:6,
        paddingBottom:7,
        alignItems:'center',
        borderRadius:7
    },
    buttonText:{
        color:AppStyles.buttonTextColor, 
        fontSize:AppStyles.buttonFontSize
    }
});