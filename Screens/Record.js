import React from 'react';
import { View, TouchableOpacity, StyleSheet, BackHandler, NativeEventEmitter } from 'react-native';
import Text from 'text/Text';
import Body from 'ui/Body';
import AppStyles from 'dedicate/AppStyles';
import DbTasks from 'db/DbTasks';
import DbCategories from 'db/DbCategories';
import IconTasks from 'icons/IconTasks';
import ToolTipBottom from 'tooltip/Bottom';

export default class Record extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task:{
                id: props.navigation.state.params ? props.navigation.state.params.taskId : null,
                name:'', 
                inputs:[]
            },
            tasks:[],
            categories:[],
            selectedCategory:{
                id:0,
                tasks:[]
            },
            edited:false
        };

        //load a list of tasks
        const dbTasks = new DbTasks();
        this.state.tasks = dbTasks.GetList({filtered:['category=$0 || category.id<=0',null]});

        //load a list of categories
        const dbCategories = new DbCategories();
        this.state.categories = dbCategories.GetCategoriesList();

        //bind global methods
        global.updatePrevScreen = this.updateScreen.bind(this);

        //bind methods
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.navigate = this.navigate.bind(this);
        this.taskItem = this.taskItem.bind(this);
        this.onSelectCategory = this.onSelectCategory.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        this.loadToolbar();

        //listen to navigation emitter
        this.navigatorEmitter = new NativeEventEmitter();
        this.navigatorSubscription = this.navigatorEmitter.addListener('navigate', this.navigate);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
        this.navigatorSubscription.remove();
    }

    hardwareBackPress() {
        const goback = this.props.navigation.getParam('goback', 'Overview');
        global.navigate(this, goback);
        if(goback == 'Overview'){global.refreshOverview();}
        return true;
    }

    navigate(screen, props, prevScreen){
        if(screen == 'Record' && prevScreen != screen){
            this.updateScreen();
        }
    }

    updateScreen(){
        this.loadToolbar();
    }

    // Load Toolbar ////////////////////////////////////////////////////////////////////////////////////////////////////

    loadToolbar(){
        global.updateToolbar({
            ...this.props, 
            screen:'Record',
            buttonAdd:true, 
            buttonRecord:false, 
            bottomFade:true, 
            hasTasks:true, 
            hasRecords:true,
            footerMessage: ''
        });
    }

    onSelectCategory = (event, id) => {
        const dbTasks = new DbTasks();
        this.setState({selectedCategory:{
            id:id,
            tasks: dbTasks.GetList({filtered:['category.id=$0', id]})
        }});
    }
    
    render() {
        // Show List of Tasks to Choose From /////////////////////////////////////////////////////////////////////////////////////
        return (
            <Body {...this.props} style={this.styles.body} title="Record Event" backButton={this.hardwareBackPress}>
                <View style={this.styles.listContainer}>
                    <View style={this.styles.tasksTitle}>
                        <ToolTipBottom text="Select a task to record your event with."/>
                    </View>
                    {this.state.categories.map((cat) => {
                        //load list of Categories
                        let tasks = null;
                        if(cat.id == this.state.selectedCategory.id){
                            tasks = (
                                <View key={cat.id}>
                                    {this.state.selectedCategory.tasks.map((task) => {
                                        //load list of Tasks within selected Category
                                        return this.taskItem(task, cat.id);
                                    })}
                                </View>
                            );
                        }
                        
                        if(cat.name != ''){
                            return (
                                //load Category item
                                <View key={cat.id}>
                                    <TouchableOpacity onPress={(event)=>{this.onSelectCategory(event, cat.id)}}>
                                        <View style={this.styles.catItem}>
                                            <Text style={this.styles.catText}>{cat.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    {tasks}
                                </View>
                            );
                        }
                        return <View key={cat.id}></View>
                    })}

                    {this.state.tasks.map((task) => {
                        if(task.name != ''){
                            return this.taskItem(task, 0);
                        }
                        return <View key={task.id}></View>
                    })}
                </View>
            </Body>
        );
        
    }

    taskItem = (task, catId) => {
        return (
            <TouchableOpacity key={task.id} onPress={()=>{global.navigate(this, 'RecordDetails', {task:task})}}>
                <View style={this.styles.taskContainer}>
                    {catId > 0 && <View style={this.styles.subTaskGutter}></View>}
                    <View style={catId > 0 ? this.styles.taskSubItem : this.styles.taskItem}>
                        <View style={this.styles.taskIcon}><IconTasks size="xsmall"></IconTasks></View>
                        <Text style={this.styles.taskText}>{task.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    styles = StyleSheet.create({
        body:{backgroundColor:AppStyles.altBackgroundColor, position:'absolute', top:0, bottom:0, left:0, right:0},
        container:{paddingVertical:30, paddingBottom:70},
        listContainer:{paddingBottom:75, backgroundColor:AppStyles.backgroundColor},
        tasksTitle:{flexDirection:'row', justifyContent:'center', width:'100%', paddingTop:20},
    
        //Categories & Tasks List
        catItem:{
            width:'100%', paddingVertical:15,  paddingHorizontal:30, 
            borderBottomWidth:1, borderBottomColor:AppStyles.separatorColor
        },
        catText:{fontSize:22, color:AppStyles.textColor},
        taskContainer:{flexDirection:'row'},
        taskItem:{
            width:'100%', paddingVertical:15, paddingHorizontal:30, borderBottomWidth:1,
            borderBottomColor:AppStyles.separatorColor, flexDirection:'row'
        },
        taskSubItem:{
            width:'100%', paddingVertical:15, paddingHorizontal:30, borderBottomWidth:1,
            borderBottomColor:AppStyles.separatorColor, flexDirection:'row'
        },
        taskIcon:{paddingRight:10},
        taskText:{fontSize:20},
        subTaskGutter:{backgroundColor:AppStyles.altBackgroundColor, height:60, width:45},
    });
}