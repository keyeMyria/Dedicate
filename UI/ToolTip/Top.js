import React from 'react';
import {View} from 'react-native';
import Text from 'ui/Text';
import {Svg, Path} from 'react-native-svg';
import AppStyles from 'dedicate/AppStyles';

export default class ToolTipTop extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        var color = this.props.color || AppStyles.color;
        var bg = this.props.background || AppStyles.backgroundColor;
        return (
            <View style={{position:'relative'}}>
                <Text style={{position:'absolute', textAlign:'center', paddingTop:27, paddingLeft:20, width:335, color:AppStyles.color, fontSize:17, zIndex:1}}>{this.props.text}</Text>
                <Svg viewBox="0 0 350 85" width="350" height="85">
                    <Path fill={color} d="M350.05 20q0-5.25-4.55-5.9-.7-.1-1.45-.1H184.6L174.95.5 165.3 14H6q-6 0-6 6v59q0 6 6 6h338.05q.65 0 1.2-.05 4.8-.6 4.8-5.95V20m-4.8-1.7q.8.45.8 1.7v59q0 1.25-.8 1.75-.45.25-1.2.25H6q-2 0-2-2V20q0-2 2-2h161.95l7-10.5 7.9 10.5h161.2q.75 0 1.2.3z"/>
                    <Path fill={bg} d="M347.5 82.5v-66H184.7l-9.65-12.35-9.75 12.35H2.5v66h345z"/>
                </Svg>
            </View>
        );
    }
}