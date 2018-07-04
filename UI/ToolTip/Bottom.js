import React from 'react';
import {View} from 'react-native';
import Text from 'ui/Text';
import {Svg, Path} from 'react-native-svg';
import AppStyles from 'dedicate/AppStyles';

export default class ToolTipBottom extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        var color = this.props.color || AppStyles.color;
        var bg = this.props.background || AppStyles.backgroundColor;
        return (
            <View style={{position:'relative'}}>
                <Text style={{position:'absolute', paddingTop:12, paddingLeft:20, width:335, color:AppStyles.color, fontSize:17, zIndex:1}}>{this.props.text}</Text>
                <Svg viewBox="0 0 350 65" width="350" height="65">
                    <Path fill={color} d="M350.05 6q0-5.35-4.8-5.95-.55-.05-1.2-.05H6Q0 0 0 6v39q0 6 6 6h159.5l9.65 13.5L184.8 51h159.25q.75 0 1.45-.1 4.55-.65 4.55-5.9V6m-4.8-1.75q.8.5.8 1.75v39q0 1.25-.8 1.7-.45.3-1.2.3h-161l-7.9 10.5-7-10.5H6q-2 0-2-2V6q0-2 2-2h338.05q.75 0 1.2.25z"/>
                    <Path fill={bg} d="M347.5 48.5v-46H2.5v46h164l8 13 10-13h163z"/>
                </Svg>
            </View>
        );
    }
}