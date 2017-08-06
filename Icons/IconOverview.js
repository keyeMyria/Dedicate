import React from 'react';
import {View} from 'react-native';
import {Svg, G, Path, Circle} from 'react-native-svg';

export default function IconOverview(props) {
    return (
        <View style={props.style}>
            <Svg viewBox="0 0 64 64" width={props.width} height={props.height} preserveAspectRatio="true">
                <G>
                    <Circle r="32" cx="32" cy="32" fill="#6666cc" />
                </G>
            </Svg>
        </View>
    );
}