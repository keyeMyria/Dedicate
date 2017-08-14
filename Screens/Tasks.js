import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import ButtonAdd from 'buttons/ButtonAdd';
import DbTasks from 'db/DbTasks';
import DbTaskAnalytics from 'db/Analytics/DbTaskAnalytics';

export default class TasksScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            analytics: this.dbTaskAnalytics.GetTaskChart()
        };
        console.log(this.state.analytics);
    }

    dbTasks = new DbTasks();
    dbTaskAnalytics = new DbTaskAnalytics();

    render() {
        var tasks = this.dbTasks.GetTasksList();
        var tasklist = tasks.map((task) => {
            return (
                <View key={task.id} style={styles.taskItemContainer}>
                    <Text style={styles.taskName}>{task.name}</Text>
                    <Text>
                        {this.state.analytics.map((item) => {
                            return <Text style={styles.taskName}>{item.task.name}</Text>
                        })}
                    </Text>
                </View>
            );
        });
        return (
            <Body {...this.props} style={styles.body} title="Tasks">
                <ButtonAdd {...this.props} style={styles.buttonAdd} onPress={() => this.props.navigation.navigate('NewTask')}/>
                <View style={styles.taskListContainer}>
                    {tasklist}
                </View>
            </Body>
        );
    }
}

const styles = StyleSheet.create({
    body:{position:'absolute', top:0, bottom:0, left:0, right:0},
    taskListContainer:{top:0, bottom:0, left:0, right:0},
    taskItemContainer:{paddingHorizontal:30, paddingVertical:15, borderBottomWidth:1, borderBottomColor:AppStyles.altBackgroundColor},
    taskName:{fontSize:20},
    buttonAdd:{alignSelf:'flex-end', bottom:20, right:20, position:'absolute', zIndex:100}
});