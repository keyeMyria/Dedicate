import React from 'react';
import {Circle} from 'react-native-svg';
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
                <Circle r="32" cx="32" cy="32" fill={color} />
            </SvgIcon>
        );
    }
}