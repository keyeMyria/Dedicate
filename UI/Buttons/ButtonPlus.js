import React from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Svg, Circle, G, Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class ButtonPlus extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        var color = this.props.color || AppStyles.buttonColor;
        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <SvgIcon {...this.props}>
                        <G>
                            <Path 
                                d="m64 35.55v-7.1h-28.45v-28.45h-7.1v28.45h-28.45v7.1h28.45v28.45h7.1v-28.45h28.45z" 
                                fill={color}
                            />
                        </G>
                    </SvgIcon>
                </TouchableOpacity>
            </View>
        );
    }
}

AppRegistry.registerComponent("ButtonPlus", () => ButtonPlus);