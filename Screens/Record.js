import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import DatePicker from 'react-native-datepicker'
import AppLang from 'dedicate/AppLang';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import TouchableBox from 'ui/Touchable/Box';
import Textbox from 'fields/Textbox';
import Picker from 'fields/Picker';
import ButtonAdd from 'buttons/ButtonAdd';
import ButtonSave from 'buttons/ButtonSave';
import ButtonClose from 'buttons/ButtonClose';
import ButtonPlus from 'buttons/ButtonPlus';
import Button from 'buttons/Button';
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
            categories:[],
            selectedCategory:{
                id:0,
                tasks:[]
            },
            record:[],
            edited:true
        };
        

        var dbTasks = new DbTasks();
        var dbRecords = new DbRecords();

        //load a list of tasks
        var dbTasks = new DbTasks();
        this.state.tasks = dbTasks.GetTasksList({filtered:['category=$0 || category.id<=0',null]});

        //load a list of categories
        var dbCategories = new DbCategories();
        this.state.categories = dbCategories.GetCategoriesList({filtered:'tasks > 0'});
    }

    appLang = new AppLang();

    componentDidMount() { 
        this.onLayoutChange();
    }

    // Screen Orientation changes
    onLayoutChange = event => {
        var {height, width} = Dimensions.get('window');
    }

    onSelectCategory = (event, id) => {
        var dbTasks = new DbTasks();
        this.setState({selectedCategory:{
            id:id,
            tasks: dbTasks.GetTasksList({filtered:['category.id=$0', id]})
        }});
    }

    onSelectTask = (event, id) => {
        var dbTasks = new DbTasks();
        var dbtask = dbTasks.GetTask(id);
        var task = {
            id:id,
            name:dbtask.name,
            category:dbtask.category,
            inputs:dbtask.inputs ? dbtask.inputs.map((input) => {
                return {name:input.name, key:input.id, id:input.id, type:input.type}
            }) : []
        };
        var record = {taskId:task.id, inputs:task.inputs};
        this.setState({task:task, record:record});
    }

    onSubmitEditing = (keyType, index) => {
        if(keyType == 'next'){
            var input = this.refs['input' + (index + 1)];
            if(input){
                if(input.focus){
                    input.focus();
                }
            }
            
        }else{
            var input = this.refs['input' + (index)];
            if(input){
                if(input.blur){
                    input.blur();
                }
            }
        }
    }

    onPressButtonSave = () => {
        //validate form

        //save to database

    }

    // Input Field Events

    onDateChange = (ref, id, date) => {
        var record = this.state.record;
        if(record.inputs == null){record.inputs = [];}
        record.inputs[id].date = date;
        this.setState(record);
        console.log(this.state.record);
    }

    // TitleBar Button ////////////////////////////////////////////////////////////////////////////////////////
    TitleBarButtons = () => {
        var that = this;
        return (
            <View style={styles.titleBarButtons}>
                {this.state.edited == true && (
                    <View key="buttonSave" style={styles.buttonSaveContainer}>
                        <ButtonSave size="smaller" style={styles.buttonSave} onPress={this.onPressButtonSave} />
                    </View>
                )}
            </View>);
    }

    render() {
        var that = this, i = 0;
        if(!this.state.task.id){
            // Show List of Tasks to Choose From /////////////////////////////////////////////////////////////////////////////////////
            return (
                <Body {...this.props} title="Record Event" onLayout={this.onLayoutChange}>
                    <View style={styles.listContainer}>
                        <Text style={styles.tasksTitle}>Select a task to record your event with.</Text>
                        {this.state.categories.map((cat) => {
                            //load list of Categories
                            var tasks = null;
                            if(cat.id == this.state.selectedCategory.id){
                                tasks = (
                                    <View key={cat.id}>
                                        {this.state.selectedCategory.tasks.map((task) => {
                                            //load list of Tasks within selected Category
                                            return this.taskItem.call(that, task, cat.id);
                                        })}
                                    </View>
                                );
                            }
                            
                            if(cat.name != ''){
                                return (
                                    //load Category item
                                    <View key={cat.id}>
                                        <TouchableOpacity onPress={(event)=>{that.onSelectCategory.call(that, event, cat.id)}}>
                                            <View style={styles.catItem}>
                                                <Text style={styles.catText}>{cat.name}</Text>
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
                                return this.taskItem.call(that, task, 0);
                            }
                            return <View key={task.id}></View>
                        })}
                    </View>
                </Body>
            );
        }else{
            // Show Task Input Fields /////////////////////////////////////////////////////////////////////////////////////
            var i = 0;
            return (
                <Body {...this.props} title="Record Event" onLayout={this.onLayoutChange} 
                titleBarButtons={this.TitleBarButtons.call(that)}>
                    <View style={styles.container}>
                        <View style={styles.labelContainer}>
                            <Text style={styles.labelText}>{this.state.task.name}</Text>
                        </View>
                        <View style={styles.inputsContainer}>
                            {this.state.task.inputs.map((input) => {
                                var keyType = 'done';
                                if(i < this.state.task.inputs.length - 1){
                                    keyType = 'next';
                                }
                                i++;
                                var e = parseInt(i.toString());
                                var ref = 'input' + e;
                                switch(input.type){
                                    case 0: //Number
                                        return (
                                            <View key={input.id} style={styles.inputFieldContainer}>
                                                <Text style={styles.fieldTitle}>{input.name}</Text>
                                                <Textbox 
                                                    ref={ref}
                                                    style={styles.inputField}
                                                    placeholder={'Number'}
                                                    keyboardType="numeric"
                                                    returnKeyType={keyType} 
                                                    blurOnSubmit={false}
                                                    onSubmitEditing={() => {that.onSubmitEditing.call(that, keyType, e)}}
                                                    onKeyPress={() => {that.onKeyPress.call(that, e)}}
                                                />
                                            </View>
                                        )
                                        break;
                                    case 1: //Text
                                        return (
                                            <View key={input.id} style={styles.inputFieldContainer}>
                                                <Text style={styles.fieldTitle}>{input.name}</Text>
                                                <Textbox 
                                                    style={styles.inputField}
                                                    placeholder={'Text'}
                                                    returnKeyType={keyType} 
                                                    blurOnSubmit={false}
                                                    onSubmitEditing={() => {that.onSubmitEditing.call(that, ref, keytype.toString(), e)}}
                                                    onKeyPress={() => {that.onKeyPress.call(that, e)}}
                                                />
                                            </View>
                                        )
                                        break;
                                    case 2: //Date
                                        return (
                                            <View key={input.id} style={styles.inputFieldContainer}>
                                                <Text style={styles.fieldTitle}>{input.name}</Text>
                                                <DatePicker
                                                    style={{width: 200}}
                                                    date={that.state.record.date || new Date()}
                                                    mode="date"
                                                    placeholder="Date"
                                                    format={that.appLang.dateFormat}
                                                    minDate="0-01-01"
                                                    confirmBtnText="Select Date"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        dateIcon: { position: 'absolute', left: 0, top: 4, marginLeft: 0 },
                                                        dateInput: { marginLeft: 36 }
                                                    }}
                                                    onDateChange={(date) => {that.onDateChange.call(that, ref, input.id, date)}}
                                                />
                                            </View>
                                        )
                                        break;
                                    case 3: //Time
                                        return (
                                            <View key={input.id} style={styles.inputFieldContainer}>
                                                <Text style={styles.fieldTitle}>{input.name}</Text>
                                                <DatePicker
                                                    style={{width: 200}}
                                                    date={that.state.record.date || new Date()}
                                                    mode="time"
                                                    placeholder="Time"
                                                    format={that.appLang.timeFormat}
                                                    confirmBtnText="Select Time"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        dateIcon: { position: 'absolute', left: 0, top: 4, marginLeft: 0 },
                                                        dateInput: { marginLeft: 36 }
                                                    }}
                                                    onDateChange={(date) => {that.onDateChange.call(that, ref, input.id, date)}}
                                                />
                                            </View>
                                        )
                                        break;
                                    case 4: //Date & Time
                                        return (
                                            <View key={input.id} style={styles.inputFieldContainer}>
                                                <Text style={styles.fieldTitle}>{input.name}</Text>
                                                
                                            </View>
                                        )
                                        break;
                                    case 5: //Stop Watch
                                        return (
                                            <View key={input.id} style={styles.inputFieldContainer}>
                                                <Text style={styles.fieldTitle}>{input.name}</Text>
                                                
                                            </View>
                                        )
                                        break;
                                    case 6: //Yes/No
                                        return (
                                            <View key={input.id} style={styles.inputFieldContainer}>
                                                <Text style={styles.fieldTitle}>{input.name}</Text>
                                                
                                            </View>
                                        )
                                        break;
                                    case 7: //5 Stars
                                        return (
                                            <View key={input.id} style={styles.inputFieldContainer}>
                                                <Text style={styles.fieldTitle}>{input.name}</Text>
                                                
                                            </View>
                                        )
                                        break;
                                    case 8: //Location
                                        return (
                                            <View key={input.id} style={styles.inputFieldContainer}>
                                                <Text style={styles.fieldTitle}>{input.name}</Text>
                                                <Textbox 
                                                    ref={ref}
                                                    style={styles.inputField}
                                                    placeholder={'location'}
                                                    returnKeyType={keyType} 
                                                    blurOnSubmit={false}
                                                    onSubmitEditing={() => {that.onSubmitEditing.call(that, keyType, e)}}
                                                />
                                            </View>
                                        )
                                        break;
                                    case 9: //URL Link
                                        return (
                                            <View key={input.id} style={styles.inputFieldContainer}>
                                                <Text style={styles.fieldTitle}>{input.name}</Text>
                                                <Textbox 
                                                    ref={ref}
                                                    style={styles.inputField}
                                                    placeholder={'URL link'}
                                                    returnKeyType={keyType} 
                                                    blurOnSubmit={false}
                                                    onSubmitEditing={() => {that.onSubmitEditing.call(that, keyType, e)}}
                                                />
                                            </View>
                                        )
                                        break;
                                    case 10: //Photo
                                        return (
                                            <View key={input.id} style={styles.inputFieldContainer}>
                                                <Text style={styles.fieldTitle}>{input.name}</Text>
                                                
                                            </View>
                                        )
                                        break;
                                    case 11: //Video
                                        return (
                                            <View key={input.id} style={styles.inputFieldContainer}>
                                                <Text style={styles.fieldTitle}>{input.name}</Text>
                                                
                                            </View>
                                        )
                                        break;
                                }
                                return (<View key={input.id}></View>)
                            })}
                        </View>
                    </View>
                </Body>
            );
        }
        
    }

    taskItem = (task, catId) => {
        var that = this;
        return (
            <TouchableOpacity key={task.id} onPress={(event)=>{this.onSelectTask.call(that, event, task.id)}}>
                <View style={styles.taskContainer}>
                    {catId > 0 && <View style={styles.subTaskGutter}></View>}
                    <View style={catId > 0 ? styles.taskSubItem : styles.taskItem}>
                        
                        <Text style={styles.taskText}>{task.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container:{padding:30, paddingBottom:70},
    listContainer:{paddingBottom:75},
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
    taskContainer:{flexDirection:'row'},
    taskItem:{
        paddingVertical:15, paddingHorizontal:30, borderBottomWidth:1,
        borderBottomColor:AppStyles.separatorColor
    },
    taskSubItem:{
        paddingVertical:15, paddingHorizontal:30, borderBottomWidth:1,
        borderBottomColor:AppStyles.separatorColor, flexDirection:'row'
    },
    taskText:{fontSize:20},
    subTaskGutter:{backgroundColor:AppStyles.color, height:60, width:60},
    fieldTitle: {fontSize:16, fontWeight:'bold'},
    inputField: {fontSize:20},
    inputFieldContainer:{paddingBottom:10},

    //title bar buttons
    titleBarButtons:{flexDirection:'row'},
    buttonSaveContainer: {width:75, zIndex:1001, paddingLeft:10, paddingBottom:12, backgroundColor:AppStyles.headerDarkColor},
    buttonSave:{padding:12 },
});