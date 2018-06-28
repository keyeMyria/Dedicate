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
                <Path fill={color} d="M64.15 31.55l-10.25-3.1 10.25-9.9L20.1 5.25.1 23.3l10.6 3.45L.1 36.3l10.6 3.5L.1 49.3l44.15 14.45 19.9-19.2-10.25-3.1 10.25-9.9m-13.55.05l5.85 1.8L43.2 46.2l-27.8-9.05q-.1-.05-.15-.1h-.15L15 37l-7.1-2.35 7.2-6.4 29.15 9.5 6.35-6.15m0 13l5.85 1.8-13.3 12.8-35.2-11.55 7.15-6.45 29.15 9.55 6.35-6.15z"/>
            </SvgIcon>
        );
    }
}