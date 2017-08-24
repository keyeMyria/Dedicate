import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { StackNavigator } from 'react-navigation';
import AppLang from 'dedicate/AppLang';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import TouchableBox from 'ui/Touchable/Box';
import Textbox from 'fields/Textbox';
import Picker from 'fields/Picker';
import LocationPicker from 'fields/LocationPicker';
import DateTimePicker from 'fields/DateTimePicker'
import ButtonAdd from 'buttons/ButtonAdd';
import ButtonSave from 'buttons/ButtonSave';
import ButtonClose from 'buttons/ButtonClose';
import ButtonPlus from 'buttons/ButtonPlus';
import Button from 'buttons/Button';
import DbTasks from 'db/DbTasks';
import DbCategories from 'db/DbCategories';
import DbRecords from 'db/DbRecords';


class DefaultScreen extends React.Component {
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
            edited:true,
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

    componentDidMount() { 
        this.onLayoutChange();
    }

    componentWillUpdate() {
        
    }

    // Screen Orientation changes
    onLayoutChange = event => {
        //var {height, width} = Dimensions.get('window');
        //var reload = this.props.navigation.state.params ? this.props.navigation.state.params.reload : false;
        //if(reload == true){
        //    this.props.navigation.navigate('Default', {taskId:0});
        //}
    }

    onSelectCategory = (event, id) => {
        var dbTasks = new DbTasks();
        this.setState({selectedCategory:{
            id:id,
            tasks: dbTasks.GetTasksList({filtered:['category.id=$0', id]})
        }});
    }
    
    render() {
        var that = this, i = 0;
        // Show List of Tasks to Choose From /////////////////////////////////////////////////////////////////////////////////////
        return (
            <Body {...this.props} style={styles.body} title="Record Event" onLayout={this.onLayoutChange}>
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
        
    }

    taskItem = (task, catId) => {
        var that = this;
        return (
            <TouchableOpacity key={task.id} onPress={(event)=>{this.props.navigation.navigate('RecordTask', {task:task})}}>
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class RecordTaskScreen extends React.Component{ ///////////////////////////////////////////////////////////////////
    constructor(props){
        super(props);

        this.state = {
            task: props.navigation.state.params ? props.navigation.state.params.task : {},
            record:{date: new Date()}
        }
    }

    appLang = new AppLang();

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
    }

    onRecordedDateChange = (time, date) => {
        var record = this.state.record;
        record.date = date;
        this.setState({record:record})
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

    render(){
        var that = this;
        var i = 0;
        return (
            <Body {...this.props} style={styles.body} title="Record Event" onLayout={this.onLayoutChange} 
            titleBarButtons={this.TitleBarButtons.call(that)}>
                <View style={styles.taskInfo}>
                    <View style={styles.labelContainer}>
                        <Text style={styles.labelText}>{this.state.task.name}</Text>
                    </View>
                    <View style={styles.recordTimeContainer}>
                        <Text style={styles.fieldTitle}>Recorded Date & Time</Text>
                        <DateTimePicker
                                styleTextbox={{minWidth:200}}
                                date={this.state.record.date}
                                type="datetime"
                                placeholder="Date & Time"
                                format={this.appLang.timeFormat}
                                buttonConfirmText="Select Date & Time"
                                buttonCancelText="Cancel"
                                onDateChange={(date) => {this.onRecordedDateChange.call(that, date)}}
                            />
                    </View>
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
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        <Textbox 
                                            ref={ref}
                                            style={styles.inputField}
                                            placeholder={'10'}
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
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        <Textbox 
                                            style={styles.inputField}
                                            placeholder={'Text'}
                                            returnKeyType={keyType} 
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => {that.onSubmitEditing.call(that, ref, keyType.toString(), e)}}
                                            onKeyPress={() => {that.onKeyPress.call(that, e)}}
                                        />
                                    </View>
                                )
                                break;
                            case 2: //Date
                                return (
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        <DateTimePicker
                                            style={{width: 200}}
                                            date={that.state.record.date || new Date()}
                                            type="date"
                                            placeholder="Date"
                                            format={that.appLang.dateFormat}
                                            minDate="0-01-01"
                                            buttonConfirmText="Select Date"
                                            buttonCancelText="Cancel"
                                            onDateChange={(date) => {that.onDateChange.call(that, ref, input.id, date)}}
                                        />
                                    </View>
                                )
                                break;
                            case 3: //Time
                                return (
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        <DateTimePicker
                                            style={{width: 200}}
                                            date={that.state.record.date || new Date()}
                                            type="time"
                                            placeholder="Time"
                                            format={that.appLang.timeFormat}
                                            buttonConfirmText="Select Time"
                                            buttonCancelText="Cancel"
                                            onDateChange={(date) => {that.onDateChange.call(that, ref, input.id, date)}}
                                        />
                                    </View>
                                )
                                break;
                            case 4: //Date & Time
                                return (
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        <DateTimePicker
                                            style={{width: 200}}
                                            date={that.state.record.date || new Date()}
                                            type="datetime"
                                            placeholder="Date & Time"
                                            format={that.appLang.timeFormat}
                                            buttonConfirmText="Select Time"
                                            buttonCancelText="Cancel"
                                            onDateChange={(date) => {that.onDateChange.call(that, ref, input.id, date)}}
                                        />
                                    </View>
                                )
                                break;
                            case 5: //Stop Watch
                                return (
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        <Textbox 
                                            ref={ref}
                                            style={styles.inputField}
                                            placeholder={'30'}
                                            keyboardType="numeric"
                                            returnKeyType={keyType} 
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => {that.onSubmitEditing.call(that, keyType, e)}}
                                            onKeyPress={() => {that.onKeyPress.call(that, e)}}
                                        />
                                    </View>
                                )
                                break;
                            case 6: //Yes/No
                                return (
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        <Picker
                                            items={[
                                                {key:0, label:'No'},
                                                {key:1, label:'Yes'}
                                            ]}
                                        />
                                    </View>
                                )
                                break;
                            case 7: //5 Stars
                                return (
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        
                                    </View>
                                )
                                break;
                            case 8: //Location
                                return (
                                    <View key={input.id} style={styles.inputFieldContainer}>
                                        <Text style={[styles.fieldTitle, styles.padding]}>{input.name}</Text>
                                        <LocationPicker 
                                            ref={ref}
                                            textInputStyle={[styles.inputField, styles.padding]}
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
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
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
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        
                                    </View>
                                )
                                break;
                            case 11: //Video
                                return (
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        
                                    </View>
                                )
                                break;
                        }
                        return (<View key={input.id}></View>)
                    })}
                </View>
            </Body>
        );
    }
}

const styles = StyleSheet.create({
    body:{backgroundColor:AppStyles.altBackgroundColor},
    container:{paddingVertical:30, paddingBottom:70},
    listContainer:{paddingBottom:75, backgroundColor:AppStyles.backgroundColor},
    tasksTitle:{fontSize:17, color:AppStyles.color, paddingBottom:20, paddingHorizontal:30, paddingTop:30},
    labelContainer:{paddingBottom:30, paddingHorizontal:30},
    labelText:{fontSize:24},

    //Categories & Tasks List
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
    subTaskGutter:{backgroundColor:AppStyles.color, height:60, width:45},

    //task input fields
    taskInfo:{backgroundColor:AppStyles.backgroundColor, paddingTop:20},
    inputsContainer:{backgroundColor:AppStyles.altBackgroundColor, paddingTop:20, paddingBottom:70},
    inputFieldContainer:{paddingBottom:15},
    padding:{marginHorizontal:30},
    fieldTitle: {fontSize:16, fontWeight:'bold'},
    inputField: {fontSize:20},

    //Record Task form
    recordTimeContainer:{paddingBottom:20, paddingHorizontal:30, width:'100%'},
    recordTimeField:{width:250, paddingTop:5},

    //title bar buttons
    titleBarButtons:{flexDirection:'row'},
    buttonSaveContainer: {width:75, zIndex:1001, paddingLeft:10, paddingBottom:12, backgroundColor:AppStyles.headerDarkColor},
    buttonSave:{padding:12 },
});

const RecordScreen = StackNavigator( 
    {
        Default: {screen: DefaultScreen},
        RecordTask: {screen: RecordTaskScreen, path:'recordtask'}
    },
    {
        initialRouteName: 'Default',
        headerMode:'none'
    }
);

export default RecordScreen;