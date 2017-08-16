import React from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Svg, Circle, G, Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';

export default class ButtonAdd extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        var color = '#6666cc';
        if(this.props.color){color = this.props.color;}
        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <SvgIcon {...this.props}>
                        <G>
                            <Path
                                d="m64 32q0-13.25-9.4-22.65-9.35-9.35-22.6-9.35t-22.65 9.35q-9.35 9.4-9.35 22.65t9.35 22.6q9.4 9.4 22.65 9.4t22.6-9.4q9.4-9.35 9.4-22.6m-12.2-19.8q8.2 8.2 8.2 19.8t-8.2 19.8-19.8 8.2-19.8-8.2-8.2-19.8 8.2-19.8 19.8-8.2 19.8 8.2m3.2 20.3q0-0.24883 0-0.5 0-9.55-6.75-16.3-6.7-6.7-16.25-6.7t-16.3 6.7q-6.7 6.75-6.7 16.3 0 0.25117 0 0.5 0.17617 9.2262 6.7 15.75 6.75 6.75 16.3 6.75t16.25-6.75q6.5725-6.5238 6.75-15.75z" 
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