import React from 'react';
import { View, TouchableOpacity} from 'react-native';
import {G, Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class ButtonSearch extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const color = this.props.color || AppStyles.backgroundColor;
        return (
            <View style={this.props.style}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <SvgIcon {...this.props}>
                        <G>
                            <Path
                                d="M41.95 21.05v-.1q0-8.7-6.1-14.8Q29.7 0 21 0T6.15 6.15Q.05 12.25 0 21q.05 8.75 6.15 14.85Q12.3 42 21 42q6.6 0 11.75-3.55l25 25 4.95-4.95-24.9-24.9q4.15-5.45 4.15-12.55M21 5q6.65.05 11.3 4.7T37 21q-.05 6.65-4.7 11.3T21 37q-6.65-.05-11.3-4.7T4.95 21.05v-.1q.1-6.6 4.75-11.25T21 5z" 
                                fill={color}
                            />
                        </G>
                    </SvgIcon>
                </TouchableOpacity>
            </View>
        );
    }
}