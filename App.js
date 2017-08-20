import React from 'react';
import { View } from 'react-native';

// import navigation system
import { DrawerNavigator } from 'react-navigation';
import DrawerContent from 'ui/DrawerContent';
import ScreenTransition from 'ui/ScreenTransition';

// import all screens contained within the application
import OverviewScreen from './Screens/Overview';
import TasksScreen from './Screens/Tasks';
import CalendarScreen from './Screens/Calendar';
import AnalyticsScreen from './Screens/Analytics';
import SettingsScreen from './Screens/Settings';
import TaskScreen from './Screens/Task';
import RecordScreen from './Screens/Record';

// import realm database schema
import Schema from 'db/Schema';
Schema();

// set up navigation
const Navigation = DrawerNavigator(
    {
        Overview: { screen: OverviewScreen, path: '' },
        Tasks: { screen: TasksScreen, path: 'tasks' },
        Calendar: { screen: CalendarScreen, path: 'calendar' },
        Analytics: { screen: AnalyticsScreen, path: 'analytics' },
        Settings: { screen: SettingsScreen, path: 'settings' },
        Task: { screen: TaskScreen, path: 'task' },
        Record: { screen: RecordScreen, path: 'record' }
    },
    {
        initialRouteName: 'Overview',
        contentOptions: { activeTintColor: '#e91e63' },
        contentComponent: DrawerContent,
        transitionConfig: ScreenTransition
    }
);

export default Navigation;
