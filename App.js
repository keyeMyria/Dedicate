// import navigation system
import { DrawerNavigator } from 'react-navigation';
import DrawerContent from 'ui/DrawerContent';

// import all screens contained within the application
import OverviewScreen from 'screens/Overview';
import Screens from 'ui/Screens';

// import realm database schema
import Schema from 'db/Schema';
Schema();

// set up navigation
const Navigation = DrawerNavigator(
    {
        Overview: { screen: OverviewScreen, path: '' },
        ...Screens
    },
    {
        initialRouteName: 'Overview',
        contentOptions: { activeTintColor: '#e91e63' },
        contentComponent: DrawerContent
    }
);

export default Navigation;
