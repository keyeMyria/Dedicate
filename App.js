import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import AppStyles from 'dedicate/AppStyles';
import DrawerContent from 'ui/DrawerContent';
import OverviewScreen from 'screens/Overview';
import Screens from 'ui/Screens';
import Schema from 'db/Schema';
import {getUserConfig} from 'dedicate/UserConfig';
import Logo from 'ui/Logo';
import SplashScreen from 'react-native-splash-screen'

export default class App extends React.Component{
    constructor(props) {
        super(props);

        //asynchronously get user config & database schema
        getUserConfig().then(e => {
            Schema(global.config.database);

            //after loading database, load UI
            this.forceUpdate();
            setTimeout(function(){
                SplashScreen.hide();
            }, 0);

        }).catch(err => {});
    }

    render(){
        if(global.config){
            //show application
            return (<Navigator></Navigator>)
        }else{
            //show loading screen
            var {height} = Dimensions.get('window');
            return (
                <View style={[styles.container, {paddingTop:(height / 2) - 27}]}>
                    <Logo width="280" height="54"></Logo>
                </View>
            );
        }
    }
} 

const styles = StyleSheet.create({
    container:{flexDirection:'row', justifyContent:'center', width:'100%', height:'100%', backgroundColor:'#222'}
});

Navigator = createDrawerNavigator(
    {
        Overview: { screen: OverviewScreen, path: '' },
        ...Screens
    },
    {
        initialRouteName: 'Overview',
        contentComponent: DrawerContent
    }
);




