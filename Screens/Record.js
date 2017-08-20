import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import TouchableBox from 'ui/Touchable/Box';
import DbTasks from 'db/DbTasks';
import DbCategories from 'db/DbCategories';
import DbRecords from 'db/DbRecords';

export default class RecordScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task:{
                id: props.navigation.state.params ? props.navigation.state.params.taskId : null,
                name:'', 
                inputs:[]
            },
            tasks:[],
            categories:[]
        };

        //load a list of tasks
        var dbTasks = new DbTasks();
        this.state.tasks = dbTasks.GetTasksList();

        //load a list of categories
        var dbCategories = new DbCategories();
        this.state.categories = dbCategories.GetCategoriesList();
    }

    componentDidMount() { 
        this.onLayoutChange();
    }

    dbTasks = new DbTasks();
    dbRecords = new DbRecords();

    // Screen Orientation changes
    onLayoutChange = event => {
        var {height, width} = Dimensions.get('window');
    }

    onSelectCategory = (event, index) => {

    }

    onSelectTask = (event, index) => {
        var dbTasks = new DbTasks();
        var task = this.state.task;
        var dbtask = dbTasks.GetTask(task.id);
        setState({task:{
            id:task.id,
            name:dbtask.name,
            category:dbtask.category,
            inputs:dbtask.inputs ? dbtask.inputs.map((input) => {
                return {name:input.name, key:input.id, id:input.id, type:input.type}
            }) : []
        }});
    }

    render() {
        if(!this.state.task.id){
            // Show List of Tasks to Choose From
            return (
                <Body {...this.props} title="Record Event" onLayout={this.onLayoutChange}>
                    <View>
                        <Text style={styles.tasksTitle}>Select a task to record your event with.</Text>
                        {this.state.categories.map((cat) => {
                            return (
                                <TouchableOpacity key={cat.id} onPress={this.onSelectCategory}>
                                    <View style={styles.catItem}>
                                        <Text style={styles.catText}>{cat.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}

                        {this.state.tasks.map((task) => {
                            return (<View key={task.id} style={styles.taskItem}>
                                <Text style={styles.taskText}>{task.name}</Text>
                            </View>);
                        })}
                    </View>
                </Body>
            );
        }else{
            // Show Task Input Fields
            return (
                <Body {...this.props} title="Record Event" onLayout={this.onLayoutChange}>
                    <View style={styles.container}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.labelText}>{this.state.task.name}</Text>
                        </View>
                    </View>
                </Body>
            );
        }
        
    }
}

const styles = StyleSheet.create({
    container:{padding:30},
    tasksTitle:{fontSize:17, color:AppStyles.color, paddingBottom:20, paddingHorizontal:30, paddingTop:30},
    labelContainer:{paddingBottom:30},
    labelText:{fontSize:24},
    catItem:{
        paddingVertical:15, 
        paddingHorizontal:30, 
        borderBottomWidth:1, 
        borderBottomColor:AppStyles.color + '55'
    },
    catText:{fontSize:22, color:AppStyles.color},
    taskItem:{
        paddingVertical:15, 
        paddingHorizontal:30, 
        borderBottomWidth:1, 
        borderBottomColor:AppStyles.separatorColor
    },
    taskText:{fontSize:20}
});