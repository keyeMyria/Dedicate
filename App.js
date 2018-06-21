import React from 'react';
import {View} from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import DrawerContent from 'ui/DrawerContent';
import OverviewScreen from 'screens/Overview';
import Screens from 'ui/Screens';
import Schema from 'db/Schema';
import {getUserConfig} from 'utility/UserConfig';

export default class App extends React.Component{
    constructor(props) {
        super(props);

        //asynchronously get user config & database schema
        getUserConfig().then(e => {
            Schema(global.config.database);

            //after loading database, load UI
            this.forceUpdate();

        }).catch(err => {});
    }

    render(){
        if(global.config){
            return (<Navigator></Navigator>)
        }else{
            //show loading screen
            return (<View></View>);
        }
    }
} 

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




