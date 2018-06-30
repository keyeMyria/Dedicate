
import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
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

        this.state = {
            reload: false
        }

        //set up global refresh
        this.reload = this.reload.bind(this);
        global.reload = this.reload;

        //check for existing database
        getUserConfig().then(e => {
            Schema(global.config.database);
            this.forceUpdate();
            SplashScreen.hide();
        }).catch(err => {});
    }

    reload(){
        //reload entire app (when changing theme for example)
        this.setState({reload:true});
        setTimeout(()=>{
            this.setState({reload:false});
        }, 10);
    }

    render(){
        if(global.config && global.config.database && this.state.reload == false){
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




