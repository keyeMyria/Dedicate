import React from 'react';
import {Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class IconStarHalf extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        var color = this.props.color || AppStyles.color;
        return (
            <SvgIcon {...this.props}>
                <Path fill={color} d="M45 38.85l19.1-14.7L40 23.5 32 .75 23.9 23.5l-24.1.65 19.1 14.7-6.85 23.1L32 48.25l19.85 13.7L45 38.85M32 43.4l.05-30.45 5.1 14.45 15.6.45-12.35 9.5 4.4 14.9L32 43.4z"/>
            </SvgIcon>
        );
    }
}