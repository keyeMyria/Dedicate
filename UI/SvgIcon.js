import React from 'react';
import {Svg} from 'react-native-svg';

export default function SvgIcon(props) {
    var width = 48, height = 48;
    if(props.width){width = props.width;}
    if(props.height){height = props.height;}

    switch(props.size){
        case 'small':
            width = 36; height = 36;
            break;

        case 'smaller':
            width = 32; height = 32;
            break;
    }

    return (
        <Svg viewBox="0 0 64 64" width={width} height={height} preserveAspectRatio="true">
            {props.children}
        </Svg>
    );
}