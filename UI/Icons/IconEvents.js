import React from 'react';
import {Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class IconEvents extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        var color = this.props.color || AppStyles.color;
        var bg = this.props.backgroundColor || AppStyles.backgroundColor;
        return (
            <SvgIcon {...this.props}>
                <Path fill={bg} d="M56 9.5h-2.5V7h-43v2.5H7V60h49V9.5z" />
                <Path fill={color} d="M17 0q-1.25 0-2.15.85Q14 1.75 14 3v10q0 1.25.85 2.1.9.9 2.15.9t2.1-.9q.9-.85.9-2.1V3q0-1.25-.9-2.15Q18.25 0 17 0m32.1.85Q48.25 0 47 0t-2.15.85Q44 1.75 44 3v10q0 1.25.85 2.1.9.9 2.15.9t2.1-.9q.9-.85.9-2.1V3q0-1.25-.9-2.15m4.6 6.2H52v7.2q0 1.55-1.5 2.65Q49.1 18 47 18t-3.6-1.1Q42 15.8 42 14.25V7H22v7.25q0 1.55-1.5 2.65Q19.1 18 17 18t-3.6-1.1Q12 15.8 12 14.25v-7.2h-1.75Q4 7.05 4 13.3v44.4Q4 64 10.25 64H53.7q6.3 0 6.3-6.3V13.3q0-6.25-6.3-6.25M9.5 60q-.5 0-.8-.15Q8 59.5 8 58.5V22h48v36.55q-.005.249-.05.45-.11.517-.5.8-.35.2-.95.2h-45M18 32v8h8v-8h-8z"/>
                <Path fill={color} fillOpacity={0.25} d="M48 22h-2v8h-8v-8h-2v8h-8v-8h-2v8h-8v-8h-2v8H8v2h8v8H8v2h8v8H8v2h8v8h2v-8h8v8h2v-8h8v8h2v-8h8v8h2v-8h8v-2h-8v-8h8v-2h-8v-8h8v-2h-8v-8m-2 10v8h-8v-8h8m-28 8v-8h8v8h-8m18-8v8h-8v-8h8m-8 10h8v8h-8v-8m-10 0h8v8h-8v-8m28 0v8h-8v-8h8z"></Path>
            </SvgIcon>
        );
    }
}