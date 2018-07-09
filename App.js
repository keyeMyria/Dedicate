
import React from 'react';
import {View, Dimensions, StyleSheet, NativeEventEmitter} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import ScreenTransition from 'ui/ScreenTransition';
import Toolbar from 'ui/Toolbar';
import Schema from 'db/Schema';
import {getUserConfig} from 'dedicate/UserConfig';
import SplashScreen from 'react-native-splash-screen'
import Modal from 'ui/Modal';
import Logo from 'ui/Logo';

import AnalyticsScreen from 'screens/Analytics';
import ChartScreen from 'screens/Chart';
import DatabaseScreen from 'screens/Databases';
import EventsScreen from 'screens/Events';
import OverviewScreen from 'screens/Overview';
import {Record, RecordDetails} from 'screens/Record';
import SettingsScreen from 'screens/Settings';
import TaskScreen from 'screens/Task';
import TasksScreen from 'screens/Tasks';

global.proVersion = true;

export default class App extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            toolbar:[],
            reload: false
        }

        //set up global methods
        global.reload = this.reload.bind(this);
        global.updateToolbar = this.updateToolbar.bind(this);
        global.navigate = this.navigate.bind(this);

        //set up event emitters
        this.navigatorEmitter = new NativeEventEmitter();

        //check for existing database
        getUserConfig().then(e => {
            Schema(global.config.database);
            this.forceUpdate();
            SplashScreen.hide();
        }).catch(err => {});
    }

    navigate(sender, screen, props){
        sender.props.navigation.navigate(screen, props);
        this.navigatorEmitter.emit('navigate', screen, props, this.prevScreen);
        this.prevScreen = screen;
    }

    reload(){
        //reload entire app (when changing theme for example)
        this.setState({reload:true});
        setTimeout(()=>{
            this.setState({reload:false});
        }, 10);
    }

    updateToolbar(props){
        this.setState({toolbar:<Toolbar key="toolbar" {...props}/>});
    }

    render(){
        if(global.config && global.config.database && this.state.reload == false){
            //show application
            return [<Navigator key="nav"/>, this.state.toolbar, <Modal key="modal"/>];
        }else{
            //show loading screen
            var {height} = Dimensions.get('window');
            return (
                <View style={[this.styles.loadingContainer, {paddingTop:(height / 2) - 27}]}>
                    <Logo width="280" height="54"></Logo>
                </View>
            );
        }
    }

    styles = StyleSheet.create({
        loadingContainer:{flexDirection:'row', justifyContent:'center', width:'100%', height:'100%', backgroundColor:'#222'},
    });
} 

const Navigator = createStackNavigator(
{
    Analytics: { screen: AnalyticsScreen },
    Chart: { screen: ChartScreen },
    Databases: { screen: DatabaseScreen },
    Events: { screen: EventsScreen },
    Overview: { screen: OverviewScreen },
    Record: { screen: Record },
    RecordDetails: { screen: RecordDetails },
    Settings: { screen: SettingsScreen },
    Task: { screen: TaskScreen },
    Tasks: { screen: TasksScreen },
}, 
{
    headerMode: 'none',
    initialRouteName: 'Overview',
    transitionConfig: ScreenTransition
});
