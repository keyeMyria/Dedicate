import React from 'react';
import {View, StyleSheet, PanResponder} from 'react-native';
import IconStar from 'icons/IconStar';
import IconStarHalf from 'icons/IconStarHalf';
import IconStarEmpty from 'icons/IconStarEmpty';
import AppStyles from 'dedicate/AppStyles';

export default class FiveStars extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            value: this.props.stars || 0,
            stars: [],
            width:0,
            height:0,
            startX:0
        };

        this.viewPanResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                this.setState({startX:evt.nativeEvent.locationX + 10},
                () => {
                    this.gesture.call(this, evt, gestureState);
                });
                
            }, 
            onPanResponderMove: (evt, gestureState) => {
                this.gesture.call(this, evt, gestureState);
            },
            onPanResponderRelease:() => {
                if(typeof this.props.onChange != 'undefined'){
                    this.props.onChange(this.state.value);
                }
            },
            onPanResponderTerminate: () => false,
            onPanResponderTerminationRequest:() => false
        });
    }

    gesture(evt, gestureState){
        if(this.props.locked == true){return;}
        var value = (5 / this.state.width) * (this.state.startX + gestureState.dx);
        value = value > 5 ? 5 : value < 0 ? 0 : value; //clamp
        if(value % 0.5 != 0){
            var mod = (value % 0.5);
            value = value - mod;
        }
        this.setState({value:value},  () => {
            this.getStars();
        });
    }

    componentWillMount(){
        this.getStars();
    }

    getStars(){
        var stars = [];
        var val = this.state.value;
        var size = this.props.size || 'small';
        var color = this.props.color || AppStyles.color;
        for(var x = 0; x <= 4; x++){
            if(val - x > 0.5){
                //full star
                stars.push(<IconStar key={x} size={size} color={color}></IconStar>);
            }else if(val - x <= 0){
                //empty star
                stars.push(<IconStarEmpty key={x} size={size} color={color}></IconStarEmpty>);
            }else if(val - x <= 0.5 && val - x > 0){
                //half star
                stars.push(<IconStarHalf key={x} size={size} color={color}></IconStarHalf>);
            }
        }
        this.setState({stars:stars});
    }

    onViewLayout(layout){
        const {width, height} = layout;
        this.setState({width:width, height:height});
        
    }

    render(){
        var that = this;
        return (
            <View
                onLayout={(e) => this.onViewLayout.call(that, e.nativeEvent.layout)} 
                style={{opacity:this.state.width == 0 ? 0 : 1}} 
                style={styles.container}
            >
                <View style={[styles.hidden,{width:this.state.width, height:this.state.height}]} {...this.viewPanResponder.panHandlers}></View>
                <View style={styles.stars}>
                    {this.state.stars}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{alignSelf:'flex-start'},
    hidden:{position:'absolute', zIndex:2},
    stars:{flexDirection:'row'},
    star:{paddingRight:10}
});