import React from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Svg, Circle, G, Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';

export default class ButtonClose extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        var color = this.props.color || "#fff";
        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <SvgIcon {...this.props}>
                        <G>
                            <Path 
                                d=" M 64 8.4 L 55.3 0 31.7 23.6 8.4 0.3 0 8.7 23.3 32 0 55.3 8.4 63.7 31.7 40.4 55.3 64 63.7 55.6 40.4 32.3 64 8.4 Z" 
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