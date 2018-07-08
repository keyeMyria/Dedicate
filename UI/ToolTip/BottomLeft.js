import React from 'react';
import {View} from 'react-native';
import Text from 'text/Text';
import {Svg, Path} from 'react-native-svg';
import AppStyles from 'dedicate/AppStyles';

export default class ToolTipBottomLeft extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        var color = this.props.color || AppStyles.color;
        var bg = this.props.background || AppStyles.backgroundColor;
        return (
            <View style={{position:'relative'}}>
                <Svg viewBox="0 0 350 85" width="350" height="85">
                    <Path fill={bg} d="M347.5 68.5v-66H2.5v66h12.8l10.25 12.6 9.2-12.6H347.5z"/>
                    <Path fill={color} d="M350 6q0-6-6-6H5.95q-.65 0-1.2.05Q-.05.65-.05 6v59q0 5.25 4.55 5.9.7.1 1.45.1h9.75l9.65 13.5L35 71h309q6 0 6-6V6m-6-2q2 0 2 2v59q0 2-2 2H32.35l-7 10.5-7.9-10.5H5.95q-.75 0-1.2-.3-.8-.45-.8-1.7V6q0-1.25.8-1.75Q5.2 4 5.95 4H344z"/>
                </Svg>
                <Text style={{position:'absolute', paddingTop:12, paddingLeft:20, width:335, color:AppStyles.color, fontSize:17, zIndex:1}}>{this.props.text}</Text>
            </View>
        );
    }
}