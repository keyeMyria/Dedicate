
import TasksScreen from 'screens/Tasks';
import TaskScreen from 'screens/Task';
import AnalyticsScreen from 'screens/Analytics';
import ChartScreen from 'screens/Chart';
import SettingsScreen from 'screens/Settings';
import RecordScreen from 'screens/Record';
import EventsScreen from 'screens/Events';
import DatabaseScreen from 'screens/Databases';

const Screens = {
    Tasks: { screen: TasksScreen},
    Task: { screen: TaskScreen },
    Analytics: { screen: AnalyticsScreen },
    Chart: { screen: ChartScreen },
    Settings: { screen: SettingsScreen },
    Record: { screen: RecordScreen },
    Events: { screen: EventsScreen },
    Databases: { screen: DatabaseScreen }
}

export default Screens;