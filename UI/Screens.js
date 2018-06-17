
import TasksScreen from 'screens/Tasks';
import CalendarScreen from 'screens/Calendar';
import AnalyticsScreen from 'screens/Analytics';
import SettingsScreen from 'screens/Settings';
import TaskScreen from 'screens/Task';
import RecordScreen from 'screens/Record';

const Screens = {
    Tasks: { screen: TasksScreen},
    Calendar: { screen: CalendarScreen },
    Analytics: { screen: AnalyticsScreen },
    Settings: { screen: SettingsScreen },
    Task: { screen: TaskScreen },
    Record: { screen: RecordScreen }
}

export default Screens;