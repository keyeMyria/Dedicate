import React from 'react';
import {Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class IconTasks extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        var color = this.props.color || AppStyles.color;
        var bg = this.props.backgroundColor || AppStyles.backgroundColor;
        return (
            <SvgIcon {...this.props}>
                <Path fill={bg} d="M55.5 12.5h-11v-5h-8v-4l-4-3-5 3v4h-8v5h-10v49h46v-49z" />
                <Path fill={color} d="M51.5 10H46V6h-8q-.097-.267-.1-.5v-.7l-.05-.4q-.05-.175-.1-.4-.05-.175-.1-.4l-.1-.2q-.411-1.065-1.3-2.05l-.2-.15-.1-.15Q34.275-.396 32-.4q-2.219-.001-3.9 1.45l-.05.1-.2.2q-1.014.998-1.4 2.1-.088.304-.15.55l-.05.4q-.155.55-.15 1.1-.003.233-.1.5h-8v4h-5.5Q7 10 7 15.5v43Q7 64 12.5 64h39q5.5 0 5.5-5.5v-43q0-5.5-5.5-5.5M43 9v5H21V9l7.9.05.1-1.5q.103-1.795.1-2.05.005-.15.05-.3v-.05q.06-.21.05-.45l.05-.05.1-.25q.155-.488.6-.95l.2-.2-.05.05q.819-.699 1.9-.7 1.022-.004 1.8.6.13.158.3.3.433.459.65.95.06.165.1.3.025.125.05.2v.55q-.003.255.1 2.05l.1 1.5L43 9m3 9v-3.9h4.6q2.4 0 2.4 2.4v41.05q0 2.4-2.4 2.4H13.4q-2.4 0-2.4-2.4V16.5q0-2.4 2.4-2.4H18V18h28z"/>
                <Path fill={color} d="M47.05 32.35L44.7 30 29.55 45.1l-8.45-8.45-2.4 2.4L29.55 49.9l17.5-17.55z" fill-opacity="0"/>
            </SvgIcon>
        );
    }
}