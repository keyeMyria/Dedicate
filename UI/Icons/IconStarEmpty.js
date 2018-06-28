import React from 'react';
import {Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class IconStarEmpty extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        var color = this.props.color || AppStyles.color;
        return (
            <SvgIcon {...this.props}>
                <Path fill={color} d="M45 38.85l19.1-14.7L40 23.5 32 .75 23.9 23.5l-24.1.65 19.1 14.7-6.85 23.1L32 48.25l19.85 13.7L45 38.85m-21.45-1.5l-12.35-9.5 15.55-.45L32 12.7l5.15 14.7 15.6.45-12.35 9.5 4.4 14.9L32 43.4l-12.85 8.85 4.4-14.9z"/>
            </SvgIcon>
        );
    }
}