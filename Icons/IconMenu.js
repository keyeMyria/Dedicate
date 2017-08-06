import React from 'react';
import Svg,{ G, Path} from 'react-native-svg';

export function IconMenu(onPress) {
    return (
        <Svg width="32" height="32">
            <G onPress={onPress}>
                <Path d="m15 0h-15v15h15v-15m-14 1h13v13h-13v-13m3 1h-2v11h2v-11z"/>
                <Path d="m15 0h-15v15h15v-15z" fill-opacity="0"/>
            </G>
        </Svg>
    );
}