import React from 'react';
import {Text} from 'react-native';
import AppStyles from 'dedicate/AppStyles';

export default class Label extends React.Component{
    constructor(props){
        super(props);
    }

    render(){return (<Text{...this.props} style={[{color:AppStyles.textColor}, this.props.style]} />);}
}