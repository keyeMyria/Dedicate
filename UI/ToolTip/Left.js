import React from 'react';
import {View} from 'react-native';
import Text from 'ui/Text';
import {Svg, Path} from 'react-native-svg';
import AppStyles from 'dedicate/AppStyles';

export default class ToolTipLeft extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        var color = this.props.color || AppStyles.color;
        var bg = this.props.background || AppStyles.backgroundColor;
        return (
            <View style={{position:'relative'}}>
                <Text style={{position:'absolute', paddingTop:14, paddingLeft:30, width:285, color:AppStyles.color, fontSize:17, zIndex:1}}>{this.props.text}</Text>
                <Svg viewBox="0 0 300 75" width="300" height="75">
                    <Path fill={color} d="M300 6q0-6-6-6H19.5q-6 0-6 6v35.85L0 51.5l13.5 9.65V69q0 6 6 6H294q6 0 6-6V6m-6-2q2 0 2 2v63q0 2-2 2H19.5q-2 0-2-2V58.5L7 51.5l10.5-7.9V6q0-2 2-2H294z"/>
                    <Path fill={bg} d="M297.5 72.5v-70h-281v39.7L4.05 51.4l12.45 9.35V72.5h281z"/>
                </Svg>
            </View>
        );
    }
}