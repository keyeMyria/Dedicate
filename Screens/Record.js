import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, BackHandler, Alert } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import AppLang from 'dedicate/AppLang';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import Textbox from 'fields/Textbox';
import Picker from 'fields/Picker';
import StopWatch from 'fields/StopWatch';
import LocationPicker from 'fields/LocationPicker';
import DateTimePicker from 'fields/DateTimePicker'
import FiveStars from 'fields/FiveStars';
import Button from 'buttons/Button';
import ButtonSave from 'buttons/ButtonSave';
import ButtonClose from 'buttons/ButtonClose';
import ButtonStopWatch from 'buttons/ButtonStopWatch';
import DbTasks from 'db/DbTasks';
import DbCategories from 'db/DbCategories';
import DbRecords from 'db/DbRecords';
import TimeLength from 'utility/TimeLength';
import IconTasks from 'icons/IconTasks';

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
            edited:false
        };

        var dbTasks = new DbTasks();

        //load a list of tasks
        var dbTasks = new DbTasks();
        this.state.tasks = dbTasks.GetList({filtered:['category=$0 || category.id<=0',null]});

        //load a list of categories
        var dbCategories = new DbCategories();
        this.state.categories = dbCategories.GetCategoriesList();

        //bind events
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        var goback = this.props.navigation.getParam('goback', 'Overview');
        this.props.navigation.navigate(goback);
        return true;
    }

    onSelectCategory = (event, id) => {
        var dbTasks = new DbTasks();
        this.setState({selectedCategory:{
            id:id,
            tasks: dbTasks.GetList({filtered:['category.id=$0', id]})
        }});
    }
    
    render() {
        var that = this;
        // Show List of Tasks to Choose From /////////////////////////////////////////////////////////////////////////////////////
        return (
            <Body {...this.props} style={styles.body} title="Record Event" screen="Record">
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
                        <View style={styles.taskIcon}><IconTasks size="xsmall"></IconTasks></View>
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
            task: props.navigation.state.params ? props.navigation.state.params.task : {id:null},
            record:{
                id:null,
                datestart: new Date(), 
                dateend: new Date(), 
                inputs:[],
                timer:false
            },
            islive:false,
            stopWatch:{show:false, datestart:null, dateend:null},
            layoutChange:false,
            changedDateEnd: false
        }
        
        if(props.navigation.state.params){
            if(typeof props.navigation.state.params.recordId != 'undefined'){
                var db = new DbRecords();
                var record = db.GetRecord(props.navigation.state.params.recordId)
                if(record != null){
                    this.state.record = record;
                    this.state.islive = true;
                    this.state.task = this.state.record.task;
                    this.state.stopWatch.show = record.timer;
                    this.state.stopWatch.datestart = record.timer ? record.datestart : null;
                }

                //check all task inputs and create missing inputs for record
                for(var x = 0; x < this.state.task.inputs.length; x++){
                    var input = this.state.task.inputs[x];
                    var i = record.inputs.map(a => a.inputId).indexOf(input.id);
                    if(i >= 0){continue;}
                    var number = null;
                    var date = null;
                    switch(input.type){
                        case 2: case 3: case 4: date = new Date(); break;
                        case 6: number = 0; break;
                    }
                    global.realm.write(() => {
                        record.inputs.push({
                            number:number, 
                            text:null, 
                            date:date, 
                            type:input.type, 
                            taskId:this.state.task.id,
                            inputId:input.id, 
                            input:input
                        });
                    });
                }
            }
        }
        if(typeof this.state.task != 'undefined' && this.state.task.id != null){
            //select task exists
            if(typeof this.state.record.task == 'undefined'){
                this.state.record.task = this.state.task;
                this.state.record.taskId = this.state.task.id;
            }

            if(this.state.task.inputs.length > 0 && this.state.record.inputs.length == 0){
                for(var x = 0; x < this.state.task.inputs.length; x++){
                    var input = this.state.task.inputs[x];
                    
                    //set default value for input
                    var number = null;
                    var text = null;
                    var date = null;

                    switch(input.type){
                        case 2: case 3: case 4: date = new Date(); break;
                        case 6: number = 0; break;
                    }

                    if(this.state.islive == true){
                        global.realm.write(() => {
                            this.state.record.inputs.push({
                                type: input.type,
                                number:number,
                                text:text,
                                date:date,
                                input:input,
                                inputId: input.id,
                                taskId: this.state.task.id
                            });
                        });
                    }else{
                        this.state.record.inputs.push({
                            type: input.type,
                            number:number,
                            text:text,
                            date:date,
                            input:input,
                            inputId: input.id,
                            taskId: this.state.task.id
                        });
                    }
                    
                }
            }
        }else{
            console.error("Please specify a task to record");
        }
        

        //bind events
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
    }

    appLang = new AppLang();

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        this.validateForm();
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        var goback = this.props.navigation.getParam('goback', 'RecordDefault');
        var params = this.props.navigation.getParam('gobackParams', null);
        this.props.navigation.navigate(goback, params);
        return true;
    }

    onLayoutChange = () => {
        this.setState({ layoutChange:!this.state.layoutChange });
    }

    //validate form
    validateForm = () => {
        var show = true;
        var inputs = this.state.task.inputs;
        if(typeof inputs != 'undefined' && inputs != null && inputs.length > 0){
            for(x = 0; x < inputs.length; x++){
                var i = this.state.record.inputs.map(a => a.inputId).indexOf(inputs[x].id);
                if(i < 0){continue;} //record doesn't contain input
                var input = this.state.record.inputs[i];
                if(typeof input != 'undefined'){
                    var dtype = this.getInputDataType(input.type);
                    if(dtype == 1){ // Number data type
                        if(input.number == null){show = false;}
                        if(isNaN(input.number)){ show = false;}
                    }
                    else if(dtype == 2){ // Text data type
                        if(input.text == null){show = false;}
                        if(input.text == ''){show = false;}
                    }
                    else if(dtype == 3){ // Date data type
                        if(input.date == null){show = false;}
                        try{
                            var d = Date(input.date); 
                        }catch(ex){
                            show = false;
                        }
                    }
                    if(show == false){break;}
                }
            }
        }
        this.setState({edited:show});
    }

    //Input Field Type
    getInputDataType(type){
        switch(type){
            case  0: case 5: case 6: case 7: // Number, Stop Watch, Yes/No, 5 Stars
                return 1;
            case 1: case 8: case 9: case 10: case 11: // Text, Location, URL Link, Photo, Video
                return 2;
            case 2: case 3: case 4: //Date, Time, Date & Time
                return 3;
        }
            return 0;
    }

    // Input Field Events
    onChangeText = (id, type, value) => {
        var record = this.state.record;
        var i = record.inputs.map(a => a.inputId).indexOf(id);
        if(i < 0){return;} //record doesn't contain input
        switch(this.getInputDataType(type)){
            case  1: // Number data type
                var number = typeof value == 'number' ? value : 
                    (typeof value == 'string' ? 
                    (value == '' ? null : parseInt(value)) : value);
                if(this.state.islive == true){
                    global.realm.write(() => {
                        record.inputs[i].number = number;
                    });
                }else{
                    record.inputs[i].number = number;
                }
                break;

            case 2: // Text data type
                if(this.state.islive == true){
                    global.realm.write(() => {
                        record.inputs[i].text = value.toString();
                    });
                }else{
                    record.inputs[i].text = value.toString();
                }
                
                break;

            case 3: // Date/Time data type
                if(this.state.islive == true){
                    global.realm.write(() => {
                        record.inputs[i].text = value.toString();
                    });
                }else{
                    record.inputs[i].text = value.toString();
                }
                break;
        }
        this.setState({record:record});
        this.validateForm();
    }

    onDateChange = (id, date) => {
        var record = this.state.record;
        var i = record.inputs.map(a => a.inputId).indexOf(id);
        if(i < 0){return;} //record doesn't contain input
        if(this.state.islive == true){
            global.realm.write(() => {
                record.inputs[i].date = date;
            });
        }else{
            if(record.inputs == null){record.inputs = [];}
            record.inputs[i].date = date;
        }
        this.setState(record);
        this.validateForm();
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

    //Start & End Dates /////////////////////////////////////////

    onRecordedDateStartChange = (date) => {
        var record = this.state.record;
        if(this.state.changedDateEnd == false){
            //also change end date + 10 minutes
            if(this.state.islive == true){
                global.realm.write(() => {
                    record.dateend = new Date(date);
                });
            }else{
                record.dateend = new Date(date);
            }
        }else{
            if(record.dateend < date){
                Alert.alert("Date Range Error", "Your starting date must use a date that comes before your ending date.");
                this.setState({record:record});
                return;
            }
        }
        if(this.state.islive == true){
            global.realm.write(() => {
                record.datestart = date;
            });
        }else{
            record.datestart = date;
        }
        this.setState({record:record}, () => {
            this.validateForm();
        });
    }

    onRecordedDateEndChange = (date) => {
        var record = this.state.record;
        if(record.datestart > date){
            Alert.alert("Date Range Error", "Your ending date must use a date that comes after your starting date.");
            this.setState({record:record});
            return;
        }
        if(this.state.islive == true){
            global.realm.write(() => {
                record.dateend = date;
            });
        }else{
            record.dateend = date;
        }
        this.setState({record:record, changedDateEnd:true},
        () => {
            this.validateForm();
        })
    }

    onPressButtonStopWatch = () => {
        var stopWatch = this.state.stopWatch;
        stopWatch.show = true;
        this.setState({stopWatch:stopWatch});
    }

    onStopWatchStart = (datestart) => {
        var db = new DbRecords();
        var record = this.state.record;
        var date = new Date(datestart);
        var stopWatch = this.state.stopWatch;
        stopWatch.datestart = date;
        if(this.state.islive == true){
            global.realm.write(() => {
                record.time = 0;
                record.timer = true;
                record.datestart = date;
                record.dateend = date;
            });
            this.setState({stopWatch:stopWatch}, ()=>{
                this.validateForm();
            });
        }else{
            record.time = 0;
            record.timer = true;
            record.datestart = date;
            record.dateend = date;
            this.setState({record:db.CreateRecord(record), islive:true, stopWatch:stopWatch}, () => {
                this.validateForm();
            });
        }
    }

    onStopWatchStop = (datestart, dateend) => {
        var db = new DbRecords();
        var stopWatch = this.state.stopWatch;
        var record = this.state.record;
        stopWatch.show = false;
        if(this.state.islive == true){
            global.realm.write(() => {
                record.datestart = datestart;
                record.dateend = dateend;
                record.timer = false;
            });
        }else{
            record.datestart = datestart;
            record.dateend = dateend;
            record.timer = false;
            record = db.CreateRecord(record);
        }
        this.setState({
            stopWatch:stopWatch, 
            record:record,
            islive:true
        });
    }

    hideStopWatch = () => {
        var stopWatch = this.state.stopWatch;
        stopWatch.show = false;
        this.setState({
            stopWatch:stopWatch
        });
    }

    // 5 Stars ////////////////////////////////////////////////////////////////////////////////////////////////

    onChangeFiveStars = (value, id) => {
        var record = this.state.record;
        var i = record.inputs.map(a => a.inputId).indexOf(id);
        if(i < 0){return;} //record doesn't contain input
        if(this.state.islive){
            global.realm.write(() => {
                record.inputs[i].number = value;
            });
        }else{
            record.inputs[i].number = value;
        }
        this.setState({record:record}, () => {
            this.validateForm();
        });
    }

    // Save Event /////////////////////////////////////////////////////////////////////////////////////////////

    SaveRecord = () => {
        //save to database
        if(this.state.islive == false){
            var db = new DbRecords();
            db.CreateRecord(this.state.record);
        }
        this.hardwareBackPress();
    }

    // Delete Event /////////////////////////////////////////////////////////////////////////////////////////////

    DeleteRecord = () => {
        Alert.alert(
        'Delete Event?',
        'Do you really want to delete this event? All data recorded about this event will be permanently deleted.',
        [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Delete Event', onPress: () => {
                var db = new DbRecords();
                db.DeleteRecord(this.state.record);
                this.hardwareBackPress();
            }}
        ],
        { cancelable: true }
        )
    }

    // TitleBar Button ////////////////////////////////////////////////////////////////////////////////////////
    TitleBarButtons = () => {
        return (
            <View style={styles.titleBarButtons}>
                {this.state.edited == true && (
                    <View key="buttonSave" style={styles.buttonSaveContainer}>
                        <ButtonSave size="smaller" style={styles.buttonSave} onPress={this.SaveRecord} />
                    </View>
                )}
            </View>);
    }

    render(){
        var {width, height} = Dimensions.get('window');
        var that = this;
        var i = 0;
        return (
            <Body {...this.props} style={styles.body} title="Record Event" onLayout={this.onLayoutChange} titleBarButtons={this.TitleBarButtons.call(that)}>
                <View style={styles.taskInfo}>
                    <View style={styles.labelContainer}>
                        <View style={styles.labelIcon}><IconTasks size="small"></IconTasks></View>
                        <Text style={styles.labelText}>{this.state.task.name}</Text>
                    </View>
                    <View style={styles.recordTimeContainer}>
                        <View style={styles.recordTimeTitle}>
                            <Text style={[styles.fieldTitle, {alignSelf:'flex-start'}]}>Event Date & Time</Text>
                            {this.state.stopWatch.show == false && 
                                <View style={styles.buttonStopWatchContainer}>
                                    <ButtonStopWatch size="small" style={styles.buttonStopWatch} onPress={this.onPressButtonStopWatch}/>
                                </View>
                            }
                        </View>
                        
                        {this.state.stopWatch.show == false && // Show Date & Time Pickers /////////////////////////////////////////////////
                            <View>
                                <View style={styles.recordTimeFlex}>
                                    <View style={styles.recordTimeLabel}>
                                        <Text>Start:</Text>
                                    </View>
                                    <View style={styles.recordTimePicker}>
                                        <DateTimePicker
                                            styleTextbox={{minWidth:220}}
                                            date={this.state.record.datestart}
                                            type="datetime"
                                            placeholder="Date & Time"
                                            format={this.appLang.timeFormat}
                                            buttonConfirmText="Select Date & Time"
                                            buttonCancelText="Cancel"
                                            onDateChange={(time, date) => {this.onRecordedDateStartChange.call(that, date)}}
                                        />
                                    </View>
                                </View>

                                <View style={styles.recordTimeFlex}>
                                    <View style={styles.recordTimeLabel}>
                                        <Text>End:</Text>
                                    </View>
                                    <View style={styles.recordTimePicker}>
                                        <DateTimePicker
                                            styleTextbox={{minWidth:220}}
                                            date={this.state.record.dateend}
                                            type="datetime"
                                            placeholder="Date & Time"
                                            format={this.appLang.timeFormat}
                                            buttonConfirmText="Select Date & Time"
                                            buttonCancelText="Cancel"
                                            onDateChange={(time, date) => {this.onRecordedDateEndChange.call(that, date)}}
                                        />
                                    </View>
                                </View>
                                
                                <Text style={styles.recordTimeLength}>
                                    {TimeLength(this.state.record.datestart, this.state.record.dateend)}
                                </Text>
                            </View>
                        }
                        {this.state.stopWatch.show == true && // Show Stop Watch Instead /////////////////////////////////////////////////
                            <View style={styles.stopWatchContainer}>
                                <ButtonClose style={styles.closeStopWatch} size="xxsmall" color={AppStyles.color} onPress={() => this.hideStopWatch.call(that)}></ButtonClose>
                                <StopWatch width={(width > 500 ? 500 : width) - 120} height={(width > 500 ? 500 : width) - 120}
                                    onStart={this.onStopWatchStart} onStop={this.onStopWatchStop} dateStart={this.state.stopWatch.datestart != null ? new Date(this.state.stopWatch.datestart) : null}
                                 />
                            </View>
                        }
                    </View>
                </View>
                <View style={styles.inputsContainer}>
                    {this.state.task.inputs.map((input) => {
                        var recinputIndex = this.state.record.inputs.map(a => a.inputId).indexOf(input.id);
                        var recinput = {number:null, text:null, date:null};
                        if(recinputIndex >= 0){
                            recinput = this.state.record.inputs[recinputIndex];
                        }
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
                                            defaultValue={(recinput.number ? recinput.number.toString() : null) || ''}
                                            keyboardType="numeric"
                                            returnKeyType={keyType} 
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => {that.onSubmitEditing.call(that, keyType, e)}}
                                            onChangeText={(text) => {that.onChangeText.call(that, input.id, input.type, text)}}
                                        />
                                    </View>
                                )
                            case 1: //Text
                                return (
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        <Textbox 
                                            ref={ref}
                                            style={styles.inputField}
                                            placeholder={'Text'}
                                            defaultValue={recinput.text || ''}
                                            returnKeyType={keyType} 
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => {that.onSubmitEditing.call(that, ref, keyType.toString(), e)}}
                                            onChangeText={(text) => {that.onChangeText.call(that, input.id, input.type, text)}}
                                        />
                                    </View>
                                )
                            case 2: //Date
                                return (
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        <DateTimePicker
                                            ref={ref}
                                            style={{width: 200}}
                                            date={recinput.date || that.state.record.date || new Date()}
                                            type="date"
                                            placeholder="Date"
                                            format={that.appLang.dateFormat}
                                            minDate="0-01-01"
                                            buttonConfirmText="Select Date"
                                            buttonCancelText="Cancel"
                                            onDateChange={(time, date) => {that.onDateChange.call(that, input.id, date)}}
                                        />
                                    </View>
                                )
                            case 3: //Time
                                return (
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        <DateTimePicker
                                            ref={ref}
                                            style={{width: 200}}
                                            date={recinput.date || that.state.record.date || new Date()}
                                            type="time"
                                            placeholder="Time"
                                            format={that.appLang.timeFormat}
                                            buttonConfirmText="Select Time"
                                            buttonCancelText="Cancel"
                                            onDateChange={(time, date) => {that.onDateChange.call(that, input.id, date)}}
                                        />
                                    </View>
                                )
                            case 4: //Date & Time
                                return (
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        <DateTimePicker
                                            ref={ref}
                                            style={{width: 200}}
                                            date={recinput.date || that.state.record.date || new Date()}
                                            type="datetime"
                                            placeholder="Date & Time"
                                            format={that.appLang.timeFormat}
                                            buttonConfirmText="Select Time"
                                            buttonCancelText="Cancel"
                                            onDateChange={(time, date) => {that.onDateChange.call(that, input.id, date)}}
                                        />
                                    </View>
                                )
                            case 6: //Yes/No
                                return (
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        <Picker
                                            ref={ref}
                                            items={[
                                                {key:0, label:'No'},
                                                {key:1, label:'Yes'}
                                            ]}
                                            selectedValue={recinput.number || 0}
                                            onValueChange={(key) => {that.onChangeText.call(that, input.id, input.type, key)}}
                                        />
                                    </View>
                                )
                            case 7: //5 Stars
                                return (
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle}>{input.name}</Text>
                                        <FiveStars ref={ref} color={AppStyles.starColor} stars={recinput.number || 0} onChange={(value) => this.onChangeFiveStars.call(that, value, input.id)}></FiveStars>
                                    </View>
                                )
                            case 8: //Location
                                return (
                                    <View key={input.id} style={styles.inputFieldContainer}>
                                        <Text style={[styles.fieldTitle, styles.padding]}>{input.name}</Text>
                                        <LocationPicker 
                                            ref={ref}
                                            style={[styles.inputField, styles.padding]}
                                            mapStyle={{height:height * 0.5}}
                                            placeholder={'search'}
                                            defaultValue={recinput.text || ''}
                                            returnKeyType={keyType} 
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => {that.onSubmitEditing.call(that, keyType, e)}}
                                            onChangeText={(text) => {that.onChangeText.call(that, input.id, input.type, text)}}
                                            markerTitle={this.state.task.name}
                                        />
                                    </View>
                                )
                            case 9: //URL Link
                                return (
                                    <View key={input.id} style={[styles.inputFieldContainer, styles.padding]}>
                                        <Text style={styles.fieldTitle} defaultValue={recinput.text || ''}>{input.name}</Text>
                                        <Textbox 
                                            ref={ref}
                                            style={styles.inputField}
                                            placeholder={'URL link'}
                                            defaultValue={recinput.text || ''}
                                            returnKeyType={keyType} 
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => {that.onSubmitEditing.call(that, keyType, e)}}
                                            onChangeText={(text) => {that.onChangeText.call(that, input.id, input.type, text)}}
                                        />
                                    </View>
                                )
                            case 10: //Photo
                                return (<View></View>);
                            case 11: //Video
                                return (<View></View>);
                        }
                        return (<View key={input.id}></View>)
                    })}
                </View>
                {typeof this.state.record.id != 'undefined' && this.state.record.id > 0 && (
                    <View style={styles.buttonDeleteContainer}>
                        <Button text="Delete Event" onPress={this.DeleteRecord}/>
                    </View>
                )}
            </Body>
        );
    }
}

const styles = StyleSheet.create({
    body:{backgroundColor:AppStyles.altBackgroundColor, position:'absolute', top:0, bottom:0, left:0, right:0},
    container:{paddingVertical:30, paddingBottom:70},
    listContainer:{paddingBottom:75, backgroundColor:AppStyles.backgroundColor},
    tasksTitle:{fontSize:17, color:AppStyles.textColor, paddingBottom:20, paddingHorizontal:15, paddingTop:30},
    labelContainer:{paddingBottom:15, paddingHorizontal:15, flexDirection:'row'},
    labelIcon:{paddingRight:10},
    labelText:{fontSize:30},

    //Categories & Tasks List
    catItem:{
        paddingVertical:15, 
        paddingHorizontal:30, 
        borderBottomWidth:1, 
        borderBottomColor:AppStyles.separatorColor
    },
    catText:{fontSize:22, color:AppStyles.color},
    taskContainer:{flexDirection:'row'},
    taskItem:{
        paddingVertical:15, paddingHorizontal:30, borderBottomWidth:1,
        borderBottomColor:AppStyles.separatorColor, flexDirection:'row'
    },
    taskSubItem:{
        paddingVertical:15, paddingHorizontal:30, borderBottomWidth:1,
        borderBottomColor:AppStyles.separatorColor, flexDirection:'row'
    },
    taskIcon:{paddingRight:10},
    taskText:{fontSize:20},
    subTaskGutter:{backgroundColor:AppStyles.altBackgroundColor, height:60, width:45},

    //Task Input fields
    taskInfo:{backgroundColor:AppStyles.backgroundColor, paddingTop:20},
    inputsContainer:{backgroundColor:AppStyles.altBackgroundColor, paddingTop:20},
    inputFieldContainer:{paddingBottom:15},
    padding:{marginHorizontal:20},
    fieldTitle: {fontSize:16, fontWeight:'bold'},
    inputField: {fontSize:20},

    //Record Task title
    recordTimeTitle:{flex:1, flexDirection:'row', width:'100%'},

    //Stop Watch Button
    buttonStopWatchContainer:{position:'absolute', left:320, top:75},

    //Record Task form
    recordTimeContainer:{paddingBottom:20, paddingHorizontal:20, width:'100%'},
    recordTimeFlex:{flexDirection:'row', paddingTop:10},
    recordTimeLabel:{alignSelf:'flex-start', width:35, paddingTop:17},
    recordTimePicker:{alignSelf:'flex-start', paddingLeft:10},
    recordTimeLength:{paddingTop:10},
    recordTimeField:{width:250, paddingTop:5},

    //Stop Watch UI
    stopWatchContainer:{flex:1, flexDirection:'row', justifyContent:'center', paddingTop:15, paddingHorizontal:30},
    closeStopWatch:{position:'absolute', right:8, top:-18},

    //title bar buttons
    titleBarButtons:{flexDirection:'row'},
    buttonSaveContainer: {width:75, zIndex:1001, paddingLeft:10, paddingBottom:12, backgroundColor:AppStyles.headerDarkColor},
    buttonSave:{padding:12 },

    //delete button
    buttonDeleteContainer:{paddingTop:30, paddingBottom:15, alignItems:'center'}
});

export default createStackNavigator(
    {
        RecordDefault: {screen: DefaultScreen},
        RecordTask: {screen: RecordTaskScreen}
    },
    {
        headerMode:'none'
    }
);