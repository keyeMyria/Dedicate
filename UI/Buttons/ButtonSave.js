import React from 'react';
import { AppRegistry, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Svg, Circle, G, Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';

//import IconMenu from 'icons/IconMenu';

export default class ButtonAdd extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <SvgIcon {...this.props}>
                        <G>
                            <Path d="m4 14l-4 4 14 14 18-29-5-3-14 23-9-9z" fill="#fff"/>
                            <Path d="m32 0h-32v32h32v-32z" fill="#fff" fill-opacity="0"/>
                        </G>
                    </SvgIcon>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{width:48, height:48},
    circle: { padding: 15 },
    icon: {width:32, height:32}
});

AppRegistry.registerComponent("ButtonAdd", () => ButtonAdd);