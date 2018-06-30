import React from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Circle, G} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class ButtonDots extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        var fill = this.props.fill || "#6666cc";
        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <SvgIcon {...this.props}>
                        <G>
                            <Circle 
                                r={5} cx={13} cy={28} fill={fill} 
                            />
                            <Circle 
                                r={5} cx={32} cy={28} fill={fill} 
                            />
                            <Circle 
                                r={5} cx={51} cy={28} fill={fill} 
                            />
                        </G>
                    </SvgIcon>
                </TouchableOpacity>
            </View>
        );
    }
}

AppRegistry.registerComponent("ButtonAdd", () => ButtonAdd);