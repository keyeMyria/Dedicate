import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

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
            <View style={this.state.error === true ? styles.error : {}}>
                <TextInput ref="input" {...this.props} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    error:{backgroundColor:'#CB9A9A'}
});