import React from 'react';
import {View} from 'react-native';
import Text from 'text/Text';
import {Svg, Path} from 'react-native-svg';
import AppStyles from 'dedicate/AppStyles';

export default class ToolTipBottomRight extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        var color = this.props.color || AppStyles.color;
        var bg = this.props.background || AppStyles.backgroundColor;
        return (
            <View style={{position:'relative'}}>
                <Text style={{position:'absolute', paddingTop:12, paddingLeft:20, width:335, color:AppStyles.color, fontSize:17, zIndex:1}}>{this.props.text}</Text>
                <Svg viewBox="0 0 350 85" width="350" height="85">
                    <Path fill={color} d="M350.05 6q0-5.35-4.8-5.95-.55-.05-1.2-.05H6Q0 0 0 6v59q0 6 6 6h309l9.65 13.5L334.3 71h9.75q.75 0 1.45-.1 4.55-.65 4.55-5.9V6m-4.8-1.75q.8.5.8 1.75v59q0 1.25-.8 1.7-.45.3-1.2.3h-11.5l-7.9 10.5-7-10.5H6q-2 0-2-2V6q0-2 2-2h338.05q.75 0 1.2.25z"/>
                    <Path fill={bg} d="M324.45 81.05l10.2-12.55h12.85v-66H2.5v66h312.7l9.25 12.55z"/>
                </Svg>
            </View>
        );
    }
}