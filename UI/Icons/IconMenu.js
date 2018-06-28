import React from 'react';
import {Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class IconOverview extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        var color = this.props.color || AppStyles.color;
        return (
            <SvgIcon {...this.props}>
                <Path fill={color} d="M64 11V0H0v11h64M0 53v11h64V53H0m64-15V27H0v11h64z"/>
            </SvgIcon>
        );
    }
}