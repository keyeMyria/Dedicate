import React from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity} from 'react-native';
import {G, Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class ButtonAdd extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={[styles.container, this.props.style]}>
                    <SvgIcon {...this.props}>
                            <Path d="m64 6l-10-6-28 46-18-18-8 8 28 28 36-58z" fill={AppStyles.buttonTextColor}/>
                    </SvgIcon>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container:{width:48, height:48}
});

AppRegistry.registerComponent("ButtonAdd", () => ButtonAdd);