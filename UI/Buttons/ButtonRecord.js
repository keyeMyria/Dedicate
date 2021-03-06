import React from 'react';
import { View, TouchableOpacity} from 'react-native';
import {G, Circle, Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class ButtonRecord extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        var color = this.props.color || AppStyles.color;

        var Icon = () => {
            if(this.props.buttonType == 'rec'){
                return (
                    <Path
                        d="m64 32q0-13.25-9.4-22.65-9.35-9.35-22.6-9.35t-22.65 9.35q-9.35 9.4-9.35 22.65t9.35 22.6q9.4 9.4 22.65 9.4t22.6-9.4q9.4-9.35 9.4-22.6m-12.2-19.8q8.2 8.2 8.2 19.8t-8.2 19.8-19.8 8.2-19.8-8.2-8.2-19.8 8.2-19.8 19.8-8.2 19.8 8.2m3.2 20.3q0-0.24883 0-0.5 0-9.55-6.75-16.3-6.7-6.7-16.25-6.7t-16.3 6.7q-6.7 6.75-6.7 16.3 0 0.25117 0 0.5 0.17617 9.2262 6.7 15.75 6.75 6.75 16.3 6.75t16.25-6.75q6.5725-6.5238 6.75-15.75m-14.25-5q0.55 0 0.95 0.05t0.8 0.2q0.3 0.05 0.65 0.2t0.55 0.3v2.05h-0.2q-0.15-0.15-0.4-0.3-0.25-0.2-0.55-0.4t-0.65-0.3q-0.4-0.15-0.8-0.15-0.45 0-0.85 0.15t-0.75 0.5-0.55 0.9q-0.2 0.6-0.2 1.35 0 0.8 0.2 1.35 0.25 0.55 0.6 0.9t0.75 0.5 0.85 0.15q0.4 0 0.8-0.15t0.65-0.35q0.3-0.15 0.55-0.35 0.2-0.2 0.35-0.35h0.2v2.05q-0.2 0.15-0.55 0.3-0.3 0.1-0.65 0.2-0.4 0.15-0.75 0.2t-1 0.05q-1.95 0-3.1-1.15-1.15-1.2-1.15-3.35 0-2.1 1.15-3.3 1.15-1.25 3.1-1.25m-5.25 0.2v1.65h-3.7v1.5h3.4v1.7h-3.4v2.2h3.7v1.65h-5.9v-8.7h5.9m-8.1 1.2q0.3 0.45 0.3 1.15 0 1-0.45 1.65-0.45 0.6-1.2 1l2.9 3.7h-2.65l-2.45-3.2h-0.75v3.2h-2.2v-8.7h3.5q0.75 0 1.3 0.05 0.5 0.1 0.95 0.4 0.5 0.3 0.75 0.75m-3.6 0.4h-0.7v2.35h0.6q0.45 0 0.8-0.05 0.3-0.1 0.55-0.25 0.2-0.2 0.3-0.4 0.1-0.25 0.1-0.6t-0.15-0.55q-0.1-0.25-0.4-0.4-0.2-0.05-0.45-0.1-0.25 0-0.65 0z"
                        fill={color}
                    />
                );
            }
            return (<Path
                d="m64 32q0-13.25-9.4-22.65-9.35-9.35-22.6-9.35t-22.65 9.35q-9.35 9.4-9.35 22.65t9.35 22.6q9.4 9.4 22.65 9.4t22.6-9.4q9.4-9.35 9.4-22.6m-12.2-19.8q8.2 8.2 8.2 19.8t-8.2 19.8-19.8 8.2-19.8-8.2-8.2-19.8 8.2-19.8 19.8-8.2 19.8 8.2m3.2 20.3q0-0.24883 0-0.5 0-9.55-6.75-16.3-6.7-6.7-16.25-6.7t-16.3 6.7q-6.7 6.75-6.7 16.3 0 0.25117 0 0.5 0.17617 9.2262 6.7 15.75 6.75 6.75 16.3 6.75t16.25-6.75q6.5725-6.5238 6.75-15.75z" 
                fill={color}
            />);
        }
        
        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <SvgIcon {...this.props}>
                        <G>
                            <Circle cx="32" cy="32" r="32" fill={this.props.fill || AppStyles.backgroundColor}></Circle>
                            <Icon/>
                        </G>
                    </SvgIcon>
                </TouchableOpacity>
            </View>
        );
    }
}