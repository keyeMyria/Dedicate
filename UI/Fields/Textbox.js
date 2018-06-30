import React from 'react';
import { TextInput } from 'react-native';
import AppStyles from 'dedicate/AppStyles';

export default class Textbox extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            error:false
        }
    }

    focus = () => {
        this.refs["input"].focus();
    }

    blur = () => {
        this.refs["input"].blur();
    }

    

    render(){
        return (
            <TextInput ref="input" {...this.props} 
            style={[{color:AppStyles.textColor}, this.props.style]} 
            placeholderTextColor={AppStyles.placeholderColor}
            underlineColorAndroid={AppStyles.underlineColor} 
            />
        );
    }
}