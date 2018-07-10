import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, BackHandler, Alert, NativeEventEmitter } from 'react-native';
import Text from 'text/Text';
import Body from 'ui/Body';
import AppStyles from 'dedicate/AppStyles';
import AppLang from 'dedicate/AppLang';
import Textbox from 'fields/Textbox';
import CheckBox from 'fields/CheckBox';
import StopWatch from 'fields/StopWatch';
import LocationPicker from 'fields/LocationPicker';
import DateTimePicker from 'fields/DateTimePicker'
import FiveStars from 'fields/FiveStars';
import Button from 'buttons/Button';
import ButtonSave from 'buttons/ButtonSave';
import ButtonClose from 'buttons/ButtonClose';
import ButtonStopWatch from 'buttons/ButtonStopWatch';
import DbRecords from 'db/DbRecords';
import TimeLength from 'utility/TimeLength';
import IconTasks from 'icons/IconTasks';

export default class RecordDetails extends React.Component{
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
            stopWatch:{show:false, datestart:null, dateend:null},
            layoutChange:false,
            changedDateEnd: false
        }
        
        if(props.navigation.state.params){
            if(typeof props.navigation.state.params.recordId != 'undefined'){
                const db = new DbRecords();
                let record = db.GetRecord(props.navigation.state.params.recordId);
                if(record != null){
                    //build record object from realm object
                    let rec = {
                        id: record.id,
                        taskId: record.taskId,
                        datestart: record.datestart,
                        dateend: record.dateend,
                        time: record.time,
                        timer: record.timer,
                        inputs: [],
                        task: record.task
                    }
                    for(let x = 0; x < record.inputs.length; x++){
                        const input = record.inputs[x];
                        rec.inputs.push({
                            number: input.number,
                            text: input.text,
                            date: input.date,
                            type: input.type,
                            taskId: input.taskId,
                            inputId: input.inputId,
                            input: input.input
                        })
                    }
                    this.state.record = rec;
                    this.state.task = rec.task;
                    this.state.stopWatch.show = rec.timer;
                    this.state.stopWatch.datestart = rec.timer ? rec.datestart : null;
                    this.state.changedDateEnd = true;
                    record = this.state.record;
                }

                //check all task inputs and create missing inputs for record
                for(let x = 0; x < this.state.task.inputs.length; x++){
                    const input = this.state.task.inputs[x];
                    const i = record.inputs.map(a => a.inputId).indexOf(input.id);
                    if(i >= 0){continue;}
                    let number = null;
                    let date = null;
                    switch(input.type){
                        case 2: case 3: case 4: date = new Date(); break;
                        case 6: number = 0; break;
                    }
                    record.inputs.push({
                        number:number, 
                        text:null, 
                        date:date, 
                        type:input.type, 
                        taskId:this.state.task.id,
                        inputId:input.id, 
                        input:input
                    });
                }
            }
        }
        if(typeof this.state.task != 'undefined' && this.state.task.id != null){
            //selected task exists
            if(typeof this.state.record.task == 'undefined'){
                this.state.record.task = this.state.task;
                this.state.record.taskId = this.state.task.id;
            }

            if(this.state.task.inputs.length > 0 && this.state.record.inputs.length == 0){
                //update record with missing inputs from task
                for(let x = 0; x < this.state.task.inputs.length; x++){
                    const input = this.state.task.inputs[x];
                    
                    //set default values for input
                    let number = null;
                    let text = null;
                    let date = null;

                    switch(input.type){
                        case 2: case 3: case 4: date = new Date(); break;
                        case 6: number = 0; break;
                    }

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
        }else{
            console.error("Please specify a task to record");
        }

        //bind methods
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.loadToolbar = this.loadToolbar.bind(this);
        this.TitleBarButtons = this.TitleBarButtons.bind(this);
        this.onRecordedDateStartChange = this.onRecordedDateStartChange.bind(this);
        this.onRecordedDateEndChange = this.onRecordedDateEndChange.bind(this);
        this.hideStopWatch = this.hideStopWatch.bind(this);
        this.onSubmitEditing = this.onSubmitEditing.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.onChangeFiveStars = this.onChangeFiveStars.bind(this);
    }

    appLang = new AppLang();

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        this.loadToolbar();
        this.validateForm();
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        const goback = this.props.navigation.getParam('goback', 'Record');
        const params = this.props.navigation.getParam('gobackParams', null);
        global.navigate(this, goback, params);
        if(goback == 'Overview'){global.refreshOverview();}
        if(typeof global.updatePrevScreen != 'undefined'){ global.updatePrevScreen(); }
        return true;
    }

    onLayoutChange = () => {
        this.setState({ layoutChange:!this.state.layoutChange });
    }

    // Load Toolbar ////////////////////////////////////////////////////////////////////////////////////////////////////

    loadToolbar(){
        global.updateToolbar({
            ...this.props, 
            screen:'RecordDetails',
            buttonAdd:true, 
            buttonRecord:false, 
            bottomFade:true, 
            hasTasks:true, 
            hasRecords:true,
            footerMessage: ''
        });
    }

    // Validate Form ////////////////////////////////////////////////////////////////////////////////////////////////////

    validateForm = () => {
        let show = true;
        const inputs = this.state.task.inputs;
        if(typeof inputs != 'undefined' && inputs != null && inputs.length > 0){
            for(let x = 0; x < inputs.length; x++){
                const i = this.state.record.inputs.map(a => a.inputId).indexOf(inputs[x].id);
                if(i < 0){continue;} //record doesn't contain input
                const input = this.state.record.inputs[i];
                if(typeof input != 'undefined'){
                    let dtype = this.getInputDataType(input.type);
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
                            let d = Date(input.date); 
                        }catch(ex){
                            show = false;
                        }
                    }
                    if(show == false){break;}
                }
            }
        }
        if(this.state.edited != show){
            this.setState({edited:show}, () => {
                this.TitleBarButtons();
            });
        }
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
        let record = this.state.record;
        const i = record.inputs.map(a => a.inputId).indexOf(id);
        if(i < 0){return;} //record doesn't contain input
        switch(this.getInputDataType(type)){
            case  1: // Number data type
                const number = typeof value == 'number' ? value : 
                    (typeof value == 'string' ? 
                    (value == '' ? null : parseInt(value)) : value);
                record.inputs[i].number = number;
                break;

            case 2: // Text data type
                record.inputs[i].text = value.toString();
                break;

            case 3: // Date/Time data type
                record.inputs[i].text = value.toString();
                break;
        }
        this.setState({record:record});
        this.validateForm();
    }

    onDateChange = (id, date) => {
        let record = this.state.record;
        const i = record.inputs.map(a => a.inputId).indexOf(id);
        if(i < 0){return;} //record doesn't contain input
        if(record.inputs == null){record.inputs = [];}
        record.inputs[i].date = date;
        this.setState(record);
        this.validateForm();
    }

    onSubmitEditing = (keyType, index) => {
        if(keyType == 'next'){
            let input = this.refs['input' + (index + 1)];
            if(input){
                if(input.focus){
                    input.focus();
                }
            }
        }else{
            let input = this.refs['input' + (index)];
            if(input){
                if(input.blur){
                    input.blur();
                }
            }
        }
    }

    //Start & End Dates /////////////////////////////////////////

    onRecordedDateStartChange = (date) => {
        let record = this.state.record;
        if(this.state.changedDateEnd == false){
            //also change end date + 10 minutes
            record.dateend = new Date(date);
        }else{
            if(record.dateend < date){
                Alert.alert("Date Range Error", "Your starting date must use a date that comes before your ending date.");
                this.setState({record:record});
                return;
            }
        }
        record.datestart = date;
        this.setState({record:record}, () => {
            this.validateForm();
        });
    }

    onRecordedDateEndChange = (date) => {
        let record = this.state.record;
        if(record.datestart > date){
            Alert.alert("Date Range Error", "Your ending date must use a date that comes after your starting date.");
            this.setState({record:record});
            return;
        }
        record.dateend = date;
        this.setState({record:record, changedDateEnd:true},
        () => {
            this.validateForm();
        })
    }

    onPressButtonStopWatch = () => {
        let stopWatch = this.state.stopWatch;
        stopWatch.show = true;
        this.setState({stopWatch:stopWatch});
    }

    onStopWatchStart = (datestart) => {
        const db = new DbRecords();
        let record = this.state.record;
        const date = new Date(datestart);
        let stopWatch = this.state.stopWatch;
        stopWatch.datestart = date;
        record.time = 0;
        record.timer = true;
        record.datestart = date;
        record.dateend = date;
        this.setState({record:db.CreateRecord(record), islive:true, stopWatch:stopWatch}, () => {
            this.validateForm();
        });
    }

    onStopWatchStop = (datestart, dateend) => {
        const db = new DbRecords();
        let stopWatch = this.state.stopWatch;
        let record = this.state.record;
        stopWatch.show = false;
        record.datestart = datestart;
        record.dateend = dateend;
        record.timer = false;
        record = db.CreateRecord(record);
        this.setState({
            stopWatch:stopWatch, 
            record:record,
            islive:true
        });
    }

    hideStopWatch = () => {
        let stopWatch = this.state.stopWatch;
        let record = this.state.record;
        stopWatch.show = false;
        record.timer = false;
        this.setState({stopWatch:stopWatch, record:record});
    }

    // 5 Stars ////////////////////////////////////////////////////////////////////////////////////////////////

    onChangeFiveStars = (value, id) => {
        let record = this.state.record;
        const i = record.inputs.map(a => a.inputId).indexOf(id);
        if(i < 0){return;} //record doesn't contain input
        record.inputs[i].number = value;
        this.setState({record:record}, () => {
            this.validateForm();
        });
    }

    // Save Event /////////////////////////////////////////////////////////////////////////////////////////////

    SaveRecord = () => {
        //save to database
        const db = new DbRecords();
        db.CreateRecord(this.state.record);
        global.overviewChanged = true;
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
                const db = new DbRecords();
                db.DeleteRecord(global.realm.objects('Record').filtered('id = $0', this.state.record.id)[0]);
                global.overviewChanged = true;
                this.hardwareBackPress();
            }}
        ],
        { cancelable: true }
        )
    }

    // TitleBar Button ////////////////////////////////////////////////////////////////////////////////////////
    TitleBarButtons = () => {
        this.setState({titleBarButtons:
            <View style={this.styles.titleBarButtons}>
                {this.state.edited == true && (
                    <View key="buttonSave" style={this.styles.buttonSaveContainer}>
                        <ButtonSave size="smaller" style={this.styles.buttonSave} color={AppStyles.headerTextColor} onPress={this.SaveRecord} />
                    </View>
                )}
            </View>
        });
    }

    render(){
        const {width, height} = Dimensions.get('window');
        let i = 0;
        return (
            <Body {...this.props} style={this.styles.body} title="Record Event" onLayout={this.onLayoutChange} 
            titleBarButtons={this.state.titleBarButtons} backButton={this.hardwareBackPress}>
                <View style={this.styles.taskInfo}>
                    <View style={this.styles.labelContainer}>
                        <View style={this.styles.labelIcon}><IconTasks size="small"></IconTasks></View>
                        <Text style={this.styles.labelText}>{this.state.task.name}</Text>
                    </View>
                    <View style={this.styles.recordTimeContainer}>
                        <View style={this.styles.recordTimeTitle}>
                            <Text style={[this.styles.fieldTitle, {alignSelf:'flex-start'}]}>Event Date & Time</Text>
                            {this.state.stopWatch.show == false && 
                                <View style={this.styles.buttonStopWatchContainer}>
                                    <ButtonStopWatch size="small" style={this.styles.buttonStopWatch} onPress={this.onPressButtonStopWatch}/>
                                </View>
                            }
                        </View>
                        
                        {this.state.stopWatch.show == false && // Show Date & Time Pickers /////////////////////////////////////////////////
                            <View>
                                <View style={this.styles.recordTimeFlex}>
                                    <View style={this.styles.recordTimeLabel}>
                                        <Text>Start:</Text>
                                    </View>
                                    <View style={this.styles.recordTimePicker}>
                                        <DateTimePicker
                                            styleTextbox={{minWidth:220}}
                                            date={this.state.record.datestart}
                                            type="datetime"
                                            placeholder="Date & Time"
                                            format={this.appLang.timeFormat}
                                            buttonConfirmText="Select Date & Time"
                                            buttonCancelText="Cancel"
                                            onDateChange={(time, date) => {this.onRecordedDateStartChange(date)}}
                                            iconStyle={this.styles.iconStyle}
                                        />
                                    </View>
                                </View>

                                <View style={this.styles.recordTimeFlex}>
                                    <View style={this.styles.recordTimeLabel}>
                                        <Text>End:</Text>
                                    </View>
                                    <View style={this.styles.recordTimePicker}>
                                        <DateTimePicker
                                            styleTextbox={{minWidth:220}}
                                            date={this.state.record.dateend}
                                            type="datetime"
                                            placeholder="Date & Time"
                                            format={this.appLang.timeFormat}
                                            buttonConfirmText="Select Date & Time"
                                            buttonCancelText="Cancel"
                                            onDateChange={(time, date) => {this.onRecordedDateEndChange(date)}}
                                            iconStyle={this.styles.iconStyle}
                                        />
                                    </View>
                                </View>
                                
                                <Text style={this.styles.recordTimeLength}>
                                    {TimeLength(this.state.record.datestart, this.state.record.dateend)}
                                </Text>
                            </View>
                        }
                        {this.state.stopWatch.show == true && // Show Stop Watch Instead /////////////////////////////////////////////////
                            <View style={this.styles.stopWatchContainer}>
                                <ButtonClose style={this.styles.closeStopWatch} size="xxsmall" color={AppStyles.color} onPress={this.hideStopWatch}></ButtonClose>
                                <StopWatch width={(width > 500 ? 500 : width) - 120} height={(width > 500 ? 500 : width) - 120}
                                    onStart={this.onStopWatchStart} onStop={this.onStopWatchStop} dateStart={this.state.stopWatch.datestart != null ? new Date(this.state.stopWatch.datestart) : null}
                                 />
                            </View>
                        }
                    </View>
                </View>
                <View style={this.styles.inputsContainer}>
                    {this.state.task.inputs.map((input) => {
                        let recinputIndex = this.state.record.inputs.map(a => a.inputId).indexOf(input.id);
                        let recinput = {number:null, text:null, date:null};
                        if(recinputIndex >= 0){
                            recinput = this.state.record.inputs[recinputIndex];
                        }
                        let keyType = 'done';
                        if(i < this.state.task.inputs.length - 1){
                            keyType = 'next';
                        }
                        i++;
                        let e = parseInt(i.toString());
                        let ref = 'input' + e;
                        switch(input.type){
                            case 0: //Number
                                return (
                                    <View key={input.id} style={[this.styles.inputFieldContainer, this.styles.padding]}>
                                        <Text style={this.styles.fieldTitle}>{input.name}</Text>
                                        <Textbox 
                                            ref={ref}
                                            style={this.styles.inputField}
                                            placeholder={'10'}
                                            defaultValue={(recinput.number ? recinput.number.toString() : null) || ''}
                                            keyboardType="numeric"
                                            returnKeyType={keyType} 
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => {this.onSubmitEditing(keyType, e)}}
                                            onChangeText={(text) => {this.onChangeText(input.id, input.type, text)}}
                                            maxLength={7}
                                        />
                                    </View>
                                )
                            case 1: //Text
                                return (
                                    <View key={input.id} style={[this.styles.inputFieldContainer, this.styles.padding]}>
                                        <Text style={this.styles.fieldTitle}>{input.name}</Text>
                                        <Textbox 
                                            ref={ref}
                                            style={this.styles.inputField}
                                            placeholder={'Text'}
                                            defaultValue={recinput.text || ''}
                                            returnKeyType={keyType} 
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => {this.onSubmitEditing(ref, keyType.toString(), e)}}
                                            onChangeText={(text) => {this.onChangeText(input.id, input.type, text)}}
                                            maxLength={256}
                                        />
                                    </View>
                                )
                            case 2: //Date
                                return (
                                    <View key={input.id} style={[this.styles.inputFieldContainer, this.styles.padding]}>
                                        <Text style={this.styles.fieldTitle}>{input.name}</Text>
                                        <DateTimePicker
                                            ref={ref}
                                            style={{width: 200}}
                                            date={recinput.date || this.state.record.date || new Date()}
                                            type="date"
                                            placeholder="Date"
                                            format={this.appLang.dateFormat}
                                            minDate="0-01-01"
                                            buttonConfirmText="Select Date"
                                            buttonCancelText="Cancel"
                                            onDateChange={(time, date) => {this.onDateChange(input.id, date)}}
                                        />
                                    </View>
                                )
                            case 3: //Time
                                return (
                                    <View key={input.id} style={[this.styles.inputFieldContainer, this.styles.padding]}>
                                        <Text style={this.styles.fieldTitle}>{input.name}</Text>
                                        <DateTimePicker
                                            ref={ref}
                                            style={{width: 200}}
                                            date={recinput.date || this.state.record.date || new Date()}
                                            type="time"
                                            placeholder="Time"
                                            format={this.appLang.timeFormat}
                                            buttonConfirmText="Select Time"
                                            buttonCancelText="Cancel"
                                            onDateChange={(time, date) => {this.onDateChange(input.id, date)}}
                                        />
                                    </View>
                                )
                            case 4: //Date & Time
                                return (
                                    <View key={input.id} style={[this.styles.inputFieldContainer, this.styles.padding]}>
                                        <Text style={this.styles.fieldTitle}>{input.name}</Text>
                                        <DateTimePicker
                                            ref={ref}
                                            style={{width: 200}}
                                            date={recinput.date || this.state.record.date || new Date()}
                                            type="datetime"
                                            placeholder="Date & Time"
                                            format={this.appLang.timeFormat}
                                            buttonConfirmText="Select Time"
                                            buttonCancelText="Cancel"
                                            onDateChange={(time, date) => {this.onDateChange(input.id, date)}}
                                        />
                                    </View>
                                )
                            case 6: //Yes/No
                                return (
                                    <View key={input.id} style={[this.styles.inputFieldContainer, this.styles.padding]}>
                                        <CheckBox text={input.name} defaultValue={recinput.number == 1}
                                            onChange={(checked) => this.onChangeText(input.id, input.type, checked ? 1 : 0)}
                                        />
                                    </View>
                                )
                            case 7: //5 Stars
                                return (
                                    <View key={input.id} style={[this.styles.inputFieldContainer, this.styles.padding]}>
                                        <Text style={this.styles.fieldTitle}>{input.name}</Text>
                                        <FiveStars ref={ref} color={AppStyles.starColor} stars={recinput.number || 0} onChange={(value) => this.onChangeFiveStars(value, input.id)}></FiveStars>
                                    </View>
                                )
                            case 8: //Location
                                return (
                                    <View key={input.id} style={this.styles.inputFieldContainer}>
                                        <Text style={[this.styles.fieldTitle, this.styles.padding]}>{input.name}</Text>
                                        <LocationPicker 
                                            ref={ref}
                                            style={[this.styles.inputField, this.styles.padding]}
                                            mapStyle={{height:height * 0.5}}
                                            placeholder={'search'}
                                            defaultValue={recinput.text || ''}
                                            returnKeyType={keyType} 
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => {this.onSubmitEditing(keyType, e)}}
                                            onChangeText={(text) => {this.onChangeText(input.id, input.type, text)}}
                                            markerTitle={this.state.task.name}
                                        />
                                    </View>
                                )
                            case 9: //URL Link
                                return (
                                    <View key={input.id} style={[this.styles.inputFieldContainer, this.styles.padding]}>
                                        <Text style={this.styles.fieldTitle} defaultValue={recinput.text || ''}>{input.name}</Text>
                                        <Textbox 
                                            ref={ref}
                                            style={this.styles.inputField}
                                            placeholder={'URL link'}
                                            defaultValue={recinput.text || ''}
                                            returnKeyType={keyType} 
                                            blurOnSubmit={false}
                                            onSubmitEditing={() => {this.onSubmitEditing(keyType, e)}}
                                            onChangeText={(text) => {this.onChangeText(input.id, input.type, text)}}
                                            maxLength={64}
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
                    {typeof this.state.record.id != 'undefined' && this.state.record.id > 0 && (
                        <View style={this.styles.buttonDeleteContainer}>
                            <Button text="Delete Event" onPress={this.DeleteRecord}/>
                        </View>
                    )}
                </View>
            </Body>
        );
    }

    styles = StyleSheet.create({
        body:{backgroundColor:AppStyles.altBackgroundColor, position:'absolute', top:0, bottom:0, left:0, right:0},
        labelContainer:{paddingBottom:15, paddingHorizontal:15, flexDirection:'row'},
        labelIcon:{paddingRight:10},
        labelText:{fontSize:30},
        
        //Task Input fields
        taskInfo:{backgroundColor:AppStyles.backgroundColor, paddingTop:20},
        inputsContainer:{backgroundColor:AppStyles.altBackgroundColor, paddingTop:20, paddingBottom:100},
        inputFieldContainer:{paddingBottom:15},
        padding:{marginHorizontal:20},
        fieldTitle: {fontSize:16, fontWeight:'bold'},
        inputField: {fontSize:20},
        iconStyle:{position:'relative', left:-55, top:-2},
    
        //Record Task title
        recordTimeTitle:{flex:1, flexDirection:'row', width:'100%'},
    
        //Stop Watch Button
        buttonStopWatchContainer:{position:'absolute', left:320, top:75},
    
        //Record Task form
        recordTimeContainer:{paddingBottom:20, paddingHorizontal:20, width:'100%'},
        recordTimeFlex:{flexDirection:'row', paddingTop:10},
        recordTimeLabel:{alignSelf:'flex-start', width:35, paddingTop:17},
        recordTimePicker:{alignSelf:'flex-start', paddingLeft:10, position:'relative'},
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
}