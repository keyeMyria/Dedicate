import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableHighlight, BackHandler } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import DbTasks from 'db/DbTasks';
import IconTasks from 'icons/IconTasks';

export default class TasksScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: this.dbTasks.GetList()
        };

        //bind events
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
    }

    dbTasks = new DbTasks()
    
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        this.props.navigation.navigate('Overview');
        return true;
    }

    render() {
        var tasklist = this.state.tasks.map((task) => {
            return (
                <TouchableHighlight key={task.id} underlayColor={AppStyles.listItemPressedColor} onPress={() => {this.props.navigation.navigate('Task', {taskId:task.id})}}>
                    <View style={styles.taskItemContainer}>
                        <View style={styles.taskIcon}><IconTasks size="xsmall"></IconTasks></View>
                        <Text style={styles.taskName}>{task.name}</Text>
                    </View>
                </TouchableHighlight>
            );
        });
        return (
            <Body {...this.props} style={styles.body} title="Tasks" screen="Tasks" buttonAdd={true} buttonRecord={true}>
                <ScrollView>
                    {tasklist}
                </ScrollView>
            </Body>
        );
    }
}

const styles = StyleSheet.create({
    body:{position:'absolute', top:0, bottom:0, left:0, right:0},
    taskListContainer:{top:0, bottom:0, left:0, right:0},
    taskItemContainer:{flex:1, flexDirection:'row', padding:15, borderBottomWidth:1, borderBottomColor:AppStyles.altBackgroundColor},
    taskIcon:{paddingRight:10},
    taskName:{fontSize:20},
});