import React from 'react';
import { View } from 'react-native';
import { DrawerNavigator } from 'react-navigation';
import DrawerContent from './Components/UI/DrawerContent';

// import all screens contained within the application
import OverviewScreen from './Screens/Overview';
import TasksScreen from './Screens/Tasks';
import CalendarScreen from './Screens/Calendar';
import AnalyticsScreen from './Screens/Analytics';
import SettingsScreen from './Screens/Settings';

// import realm database schema
//import Schema from './Database/Schema';

// set up navigation
const Navigation = DrawerNavigator(
    {
        Overview: { screen: OverviewScreen, path: '' },
        Tasks: { screen: TasksScreen, path: 'tasks' },
        Calendar: { screen: CalendarScreen, path: 'calendar' },
        Analytics: { screen: AnalyticsScreen, path: 'analytics' },
        Settings: { screen: SettingsScreen, path: 'settings' }
    },
    {
        initialRouteName: 'Overview',
        contentOptions: { activeTintColor: '#e91e63' },
        contentComponent: DrawerContent
    }
);

export default Navigation;
