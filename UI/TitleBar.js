import React from 'react';
import { 
    AppRegistry, StyleSheet,
    Text, View, Image,
    TouchableOpacity
} from 'react-native';

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
                <View style={styles.container_buttons}>
                    <TitleBarButtons/>
                </View>
            </View>
        );
    }
}

const TitleBarButtons = (props) => {
    if(props.titleBarButtons){
        return props.titleBarButtons;
    }else{
        return <View></View>
    }
}

const styles = StyleSheet.create({
    container: { },
    container_menu: { alignSelf: 'flex-start', padding: 15 },
    container_title: { position:'absolute', top: 14, alignSelf: 'center' },
    container_buttons: {position: 'absolute', top:0, right:0, width:50, height:55},
    menu: { width:25, height:25, tintColor: 'white' },
    title:{ fontSize:19, color:'white' }
});

AppRegistry.registerComponent("TitleBar", () => TitleBar);