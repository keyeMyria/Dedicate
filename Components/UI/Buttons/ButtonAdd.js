import React from 'react';
import { 
    AppRegistry, StyleSheet,
    View, TouchableOpacity
} from 'react-native';
import {Svg, Circle, G, Path} from 'react-native-svg';
import IconHome from 'icons/IconHome.js';

//import IconMenu from 'icons/IconMenu';

export default class ButtonAdd extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateTask')}>
                    <Svg viewBox="0 0 64 64" width="48" height="48" preserveAspectRatio="true">
                        <G>
                            <Circle r="32" cx="32" cy="32" fill="#6666cc" />
                            <Path 
                                d="m50 34v-4h-16v-16h-4v16h-16v4h16v16h4v-16h16z" 
                                fill="#fff"
                            />
                        </G>
                    </Svg>
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