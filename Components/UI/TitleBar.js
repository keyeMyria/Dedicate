import React from 'react';
import { 
    AppRegistry, StyleSheet,
    Text, View, Image,
    TouchableOpacity
} from 'react-native';
//import IconMenu from 'icons/IconMenu';

export default class TitleBar extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.container_menu}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerOpen')}>
                        <Image style={styles.menu} source={require('icons/Menu.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.container_title}>
                    <Text style={styles.title}>{this.props.title}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    container_menu: {
        alignSelf: 'flex-start'
    },
    container_title: {
        position:'absolute',
        paddingTop: 14,
        alignSelf: 'center'
    },
    menu: {
        width:25,
        height:25,
        tintColor: 'white'
    },
    title:{
        fontSize:19,
        color:'white'
    }
});

AppRegistry.registerComponent("TitleBar", () => TitleBar);