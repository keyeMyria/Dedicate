import React from 'react';
import { TextInput, View, Text } from 'react-native';

export default class Textbox extends React.Component {
    constructor(props){
        super(props);
    }

    focus = () => {
        this.refs["input"].focus();
    }

    blur = () => {
        this.refs["input"].blur();
    }

    render(){
        return (
            <View>
                <TextInput ref="input" {...this.props} />
            </View>
        );
    }
}