import React from 'react';
import { StyleSheet, View, TouchableOpacity} from 'react-native';
import {Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class ButtonBack extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const color = this.props.color || AppStyles.color;
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={[styles.container, this.props.style]}>
                    <SvgIcon {...this.props}>
                            <Path d="M43.95 4.55q.24-1.616-.75-2.95Q42.206.28 40.55.05 38.937-.189 37.6.8l-36 27q-.998.752-1.4 1.95-.39 1.188-.05 2.35.381 1.23 1.35 2l36 29q1.29 1.057 2.9.85 1.662-.155 2.7-1.45 1.047-1.288.85-2.95-.158-1.622-1.45-2.7l-32-25.75L42.4 7.2q1.318-.996 1.55-2.65z" fill={color}/>
                    </SvgIcon>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container:{width:48, height:48}
});