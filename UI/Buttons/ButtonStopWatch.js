import React from 'react';
import { AppRegistry, View, TouchableOpacity} from 'react-native';
import {G, Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class ButtonStopWatch extends React.Component {
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
                            <Path d="m41 3v-3h-18v3h7v6.05q-9.9602 0.66465-17.15 7.9-7.85 7.9-7.85 19.05 0 11.25 7.85 19.1 7.9 7.9 19.15 7.9 11.2 0 19.1-7.9 7.9-7.85 7.9-19.1 0-11.15-7.9-19.05-7.185-7.2305-17.1-7.9v-6.05h7m7.3 16.8q6.7 6.7 6.7 16.2 0 9.6-6.7 16.3-6.75 6.7-16.3 6.7t-16.3-6.7q-6.7-6.7-6.7-16.3 0-9.5 6.7-16.2 6.15-6.2 14.6-6.7 0.85-0.1 1.7-0.1t1.7 0.1q8.45 0.5 14.6 6.7m-13.3 16.2q0-1.25-0.85-2.1-0.8-0.85-1.9-0.9-0.1 0-0.25 0-0.1 0-0.2 0-1.1 0.05-1.9 0.9-0.9 0.85-0.9 2.1t0.9 2.1q0.9 0.9 2.1 0.9 1.25 0 2.15-0.9 0.85-0.85 0.85-2.1z" fill={color}/>
                            <Path d="m49.15 46.3l0.95-1.8-12.3-6.6-0.95 1.75 12.3 6.65m-18.15-16.3h2v-10h-2v10z" fill={color}/>
                        </G>
                    </SvgIcon>
                </TouchableOpacity>
            </View>
        );
    }
}

AppRegistry.registerComponent("ButtonStopWatch", () => ButtonStopWatch);

// 
//