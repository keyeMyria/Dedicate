import React from 'react';
import {View, Dimensions} from 'react-native';
import {Svg, Rect, LinearGradient, Defs, Stop} from 'react-native-svg';

export default class DropShadow extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            layout: 0,
            width: props.width || 0
        }
    }

    // Screen Orientation changes
    onLayoutChange = event => {
        var {height, width} = Dimensions.get('window');
        if(width > height){
            //landscape
            this.setState({layout: 1});
        }else{
            //portrait
            this.setState({layout: 2});
        }
    }

    render(){
        var width = this.state.width;
        var height = this.props.height || 15;
        var opacity = this.props.opacity >= 0 ? this.props.opacity : 0.25;
        var color = this.props.color || '#000';
        if(this.state.width == 0){
            width = Dimensions.get('window').width;
        }
        return (
            <View style={[this.props.style, {
                position:'relative', marginBottom: height * -1, width:width, height:height, opacity: opacity
            }]} pointerEvents="none">
                <Svg width={width} height={height}>
                    <Defs>
                        <LinearGradient id="fade" x1="0" y1="0" x2="0" y2={height}>
                            <Stop offset="0" stopColor={color} stopOpacity="1" />
                            <Stop offset="1" stopColor={color} stopOpacity="0" />
                        </LinearGradient>
                    </Defs>
                    <Rect x="0" y="0" width={width} height={height} fill="url(#fade)" />
                </Svg>
            </View>
        );
    }
}