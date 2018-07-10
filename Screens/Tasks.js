import React from 'react';
import { View, StyleSheet, ScrollView, TouchableHighlight, BackHandler, NativeEventEmitter } from 'react-native';
import Text from 'text/Text';
import Body from 'ui/Body';
import AppStyles from 'dedicate/AppStyles';
import DbTasks from 'db/DbTasks';
import IconTasks from 'icons/IconTasks';

export default class TasksScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: []
        };

        //bind methods
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.navigate = this.navigate.bind(this);
        this.loadToolbar = this.loadToolbar.bind(this);
    }

    dbTasks = new DbTasks()
    
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        this.loadToolbar();

        //listen to navigation emitter
        this.navigatorEmitter = new NativeEventEmitter();
        this.navigatorSubscription = this.navigatorEmitter.addListener('navigate', this.navigate);

        //get list of tasks
        this.setState({tasks:this.dbTasks.GetList()});
    }

    componentDidMount(){
        this.mounted = true;
    }

    componentWillUnmount(){
        this.mounted = false;
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
        this.navigatorSubscription.remove();
    }

    hardwareBackPress() {
        global.navigate(this, 'Overview');
        global.refreshOverview();
        return true;
    }

    updateScreen(){
        if(this.mounted == false){return;}
        this.loadToolbar();
        this.setState({tasks:this.dbTasks.GetList()});
    }

    navigate(screen, props, prevScreen){
        if(screen == 'Tasks' && prevScreen != screen){
            this.updateScreen();
        }
    }

    // Load Toolbar ////////////////////////////////////////////////////////////////////////////////////////////////////

    loadToolbar(){
        global.updateToolbar({
            ...this.props, 
            screen:'Tasks',
            buttonAdd:true, 
            buttonRecord:true, 
            bottomFade:true, 
            hasTasks:true, 
            hasRecords:true,
            footerMessage: ''
        });
    }

    render() {
        return (
            <Body {...this.props} style={this.styles.body} title="Tasks" backButton={this.hardwareBackPress}>
                <ScrollView>
                    {this.state.tasks.map((task) => 
                        <TouchableHighlight key={task.id} underlayColor={AppStyles.listItemPressedColor} onPress={() => {global.navigate(this, 'Task', {taskId:task.id})}}>
                            <View style={this.styles.taskItemContainer}>
                                <View style={this.styles.taskIcon}><IconTasks size="xsmall"></IconTasks></View>
                                <Text style={this.styles.taskName}>{task.name}</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                </ScrollView>
            </Body>
        );
    }

    styles = StyleSheet.create({
        body:{position:'absolute', top:0, bottom:0, left:0, right:0},
        taskListContainer:{top:0, bottom:0, left:0, right:0},
        taskItemContainer:{flex:1, flexDirection:'row', padding:15, borderBottomWidth:1, borderBottomColor:AppStyles.separatorColor},
        taskIcon:{paddingRight:10},
        taskName:{fontSize:20},
    });
}