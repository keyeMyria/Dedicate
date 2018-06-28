import React from 'react';
import {View} from 'react-native';
import {Svg, G, Path, Circle} from 'react-native-svg';

export default class IconPickerArrow extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        var color = this.props.color || '#666';
        return (
            <View style={this.props.style}>
                <Svg viewBox="0 0 64 64" width="16" height="16" preserveAspectRatio="true">
                    <G>
                        <Path d=" M 0 0.05 L 20.75 24 41.55 0 0 0.05 Z" fill={color}/>
                    </G>
                </Svg>
            </View>
        );
    }
}