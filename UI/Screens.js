
import TasksScreen from 'screens/Tasks';
import CalendarScreen from 'screens/Calendar';
import AnalyticsScreen from 'screens/Analytics';
import SettingsScreen from 'screens/Settings';
import TaskScreen from 'screens/Task';
import RecordScreen from 'screens/Record';

const Screens = {
    Tasks: { screen: TasksScreen, path: 'tasks' },
    Calendar: { screen: CalendarScreen, path: 'calendar' },
    Analytics: { screen: AnalyticsScreen, path: 'analytics' },
    Settings: { screen: SettingsScreen, path: 'settings' },
    Task: { screen: TaskScreen, path: 'task' },
    Record: { screen: RecordScreen, path: 'record' }
}

export default Screens;