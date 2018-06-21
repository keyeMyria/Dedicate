
import TasksScreen from 'screens/Tasks';
import CalendarScreen from 'screens/Calendar';
import AnalyticsScreen from 'screens/Analytics';
import SettingsScreen from 'screens/Settings';
import TaskScreen from 'screens/Task';
import RecordScreen from 'screens/Record';
import EventsScreen from 'screens/Events';
import DatabaseScreen from 'screens/Database';

const Screens = {
    Tasks: { screen: TasksScreen},
    Calendar: { screen: CalendarScreen },
    Analytics: { screen: AnalyticsScreen },
    Settings: { screen: SettingsScreen },
    Task: { screen: TaskScreen },
    Record: { screen: RecordScreen },
    Events: { screen: EventsScreen },
    Databases: { screen: DatabaseScreen }
}

export default Screens;