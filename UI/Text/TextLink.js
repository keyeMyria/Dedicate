import React from 'react';
import {StyleSheet} from 'react-native';
import Text from 'ui/Text';
import AppStyles from 'dedicate/AppStyles';

export default class TextLink extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (<Text {...this.props} style={[this.props.style || {}, styles.text]}>{this.props.children}</Text>);
    }
}

const styles = StyleSheet.create({
    text:{textDecorationLine:'underline', color:AppStyles.linkColor, fontSize:15}
});