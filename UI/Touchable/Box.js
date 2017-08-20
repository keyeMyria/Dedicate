import React from 'react';
import {View, StyleSheet, TouchableOpacity, Animated} from 'react-native'

export default class TouchableBox extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            touchable:this.props.pressedInStyle || {},
            colorStart:'rgba(102, 102, 204, 0.0)',
            colorEnd:'rgba(102, 102, 204, 1.0)',
            pressedIn:false,
            fadeIn: new Animated.Value(0)
        }
    }

    onPressIn = () => {
        this.setState({
            pressedIn:true
        });
    }

    onPressOut = () => {
        this.setState({
            pressedIn:false
        });
    }

    render(){
        var color = 'rgba(0,0,0,0)';
        if(this.state.pressedIn == true){
            color = this.state.fadeIn.interpolate({
                inputRange: [0, 300],
                outputRange: ['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)']
            });
        }
        
        return (
            <TouchableOpacity {...this.props} onPressIn={this.onPressIn} onPressOut={this.onPressOut} activeOpacity={0.75} focusedOpacity={0.75}>
                <View style={[styles.touchable, this.state.touchable]}>
                    {this.props.children}
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    touchable:{borderRadius:10}
});