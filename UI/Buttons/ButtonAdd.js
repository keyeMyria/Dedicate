import React from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Svg, Circle, G, Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';

export default class ButtonAdd extends React.Component {
    constructor(props){
        super(props);
    }

    outline = () => {
        return this.props.outline ? (
            <Circle 
                r="40" cx="32" cy="32" fill={this.props.outline}
            />
        ) : (
            <G></G>
        );
    }

    render() {
        var fill = this.props.fill || "#6666cc";
        var color = this.props.color || "#fff";
        var offsetWidth = 0, offsetHeight = 0;
        var offsetSize = 1, offsetX = 0, offsetY = 0;
        if(this.props.outline ){
            offsetWidth=6;
            offsetHeight=6;
            offsetSize=0.8;
            offsetX = 6;
            offsetY = 6;
        }
        var radius = 32 - offsetWidth;
        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <SvgIcon {...this.props} offsetWidth={offsetWidth} offsetHeight={offsetHeight}>
                        <G>
                            {this.outline()}
                            <Circle 
                                r={radius} cx={32} cy={32} fill={fill} 
                            />
                            <Path scale={offsetSize} x={offsetX} y={offsetY}
                                d="m50 34v-4h-16v-16h-4v16h-16v4h16v16h4v-16h16z" 
                                fill={color}
                            />
                        </G>
                    </SvgIcon>
                </TouchableOpacity>
            </View>
        );
    }
}

AppRegistry.registerComponent("ButtonAdd", () => ButtonAdd);