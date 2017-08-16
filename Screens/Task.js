import React from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import Body from 'ui/Body';
import AppStyles from 'dedicate/AppStyles';
import Textbox from 'fields/Textbox';
import Picker from 'fields/Picker';
import ButtonAdd from 'buttons/ButtonAdd';
import ButtonSave from 'buttons/ButtonSave';
import ButtonClose from 'buttons/ButtonClose';
import DbTasks from 'db/DbTasks';

export default class TaskScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task:{
                name:"",
                inputs:[], // {name:'', type:0}
            },
            taskForm:{
                height:160,
                inputsOffset:0
            },
            styles:stylesLandscape,
            ButtonAddTop: {},
            ButtonAddShow: {},
            nameIndex: Math.floor(Math.random() * (this.names.length)),
            edited: false
        }


    }

    componentDidMount() { 
        this.onLayoutChange();
    }

    // Screen Orientation changes
    onLayoutChange = event => {
        var {height, width} = Dimensions.get('window');
        var taskForm = this.state.taskForm;
        
        if(width > height){
            //landscape
            if(this.state.task.inputs.length > 1){
                taskForm.inputsOffset = 50;
            }
            this.setState({styles: stylesLandscape, taskForm:taskForm});
        }else{
            //portrait
            if(this.state.task.inputs.length > 3){
                taskForm.inputsOffset = 50;
            }
            this.setState({styles: stylesPortrait, taskForm:taskForm});
        }
    }

    // Element Measurements
    measureTaskForm(event) {
        var taskForm = this.state.taskForm;
        taskForm.height = Math.floor(event.nativeEvent.layout.height);
        this.setState({taskForm:taskForm});
    }

    // Events
    onScrollView = event => {
        var offset = event.nativeEvent.contentOffset.y;
        if(offset > this.state.taskForm.height){
            //lock button to top of screen
            this.setState({
                ButtonAddTop:{top: (offset - this.state.taskForm.height) }
            });
        }else{
            this.setState({
                ButtonAddTop:{top:0}
            });
        }
    }

    onPressAddInput = event => {
        var inputs = this.state.task.inputs;
        var show = true;
        if(inputs.length == 9){
            show = false;
        }
        var task = this.state.task;
        var max = inputs.map(function(attrs){return attrs.key;}).reduce(function (a, b) { return (b > a) ? b : a; }, 0);
        task.inputs.push({name:'', type:0, key:max + 1, isnew:true});
        this.setState({
           task:task,
           ButtonAddShow:show //show Button
        });
        this.validateForm();
        this.onLayoutChange(event);
    }

    onLabelChangeText = text => {
        var task = this.state.task;
        task.name = text;
        this.setState({task:task});
        this.validateForm();
    }

    onInputLabelChangeText = (index, text) => {
        var task = this.state.task;
        task.inputs[index - 1].name = text;
        this.setState({ task: task });
        this.validateForm();
    }

    onPickerValueChange = (index, itemValue, itemIndex) => {
        var task = this.state.task;
        task.inputs[index - 1].type = itemValue;
        this.setState({task: task});
    }

    onSubmitEditing = (keyType, index) => {
        if(keyType == 'next'){
            this.refs['taskInput' + (index + 1)].refs['inputLabel'].focus();
        }else{
            this.refs['taskInput' + index].refs['inputLabel'].blur();
        }
    }

    onRemoveInputField = (index) => {
        var task = this.state.task;
        task.inputs.splice(index - 1, 1);
        this.setState({task:task});
    }

    onPressButtonSave = event => {
        var db = new DbTasks();
        var task = Object.assign({},this.state.task);

        for(var x = 0; x < task.inputs.length; x++){
            delete task.inputs[x].key;
        }
        db.CreateTask(task);

    }

    // Form Validation

    validateForm = () => {
        //validate form fields in order to show save button
        var show = false;
        if(this.state.task.name.length > 0){
            show = true;
            for(x = 0; x < this.state.task.inputs.length; x++){
                if(this.state.task.inputs[x].name == ''){show = false; break;}
            }
        }
        this.setState({edited:show});
    }

    // Placeholder Task Names
    names = [
        "Pushups", "Exercise", "Jogging", "Cook food", "Read a book", "Watch a movie",
        "Go Swimming", "Ride bike", "Go camping", "Go hiking", "Brush teeth"
    ];

    placeholderTaskName() {
        return this.names[this.state.nameIndex];
    }

    // Save Button
    ButtonSaveTask = () => {
        var that = this;
        if(this.state.edited == true){
            return(
                <View style={styles.buttonSaveContainer}>
                    <ButtonSave size="smaller" style={styles.buttonSave} onPress={this.onPressButtonSave} />
                </View>
            );
        }
    }

    onFocusInputField = (index) => {
        var task = this.state.task;
        if(task.inputs[index-1].isnew === true){
            task.inputs[index-1].isnew = false;
            this.setState({task:task})
            return true;
        }
        return false;
    }

    //Render Component
    render() {
        var {height, width} = Dimensions.get('window');
        var that = this;
        //generate input field list
        var inputFields = [];
        if(this.state.task.inputs.length > 0){
            // show list of Input Fields /////////////////////////////////////////////
            var i = 0;
            inputFields = this.state.task.inputs.map((input) => {
                i++;
                var e = parseInt(i.toString());
                var keytype = 'next';
                if(i == this.state.task.inputs.length){
                    keytype='done';
                }else{
                    keytype='next';
                }
                return <TaskInputField ref={'taskInput' + i}
                    key={input.key} 
                    index={i} 
                    input={input} 
                    keytype={keytype} 
                    width={width} 
                    task={this.state.task} 
                    focus={() => this.onFocusInputField(e)}
                    onChangeText={(text) => {this.onInputLabelChangeText.call(that, e, text)}}
                    onPickerValueChange={(itemValue, itemIndex) => {this.onPickerValueChange.call(that, e, itemValue, itemIndex)}}
                    onSubmitEditing={() => {this.onSubmitEditing.call(that, keytype.toString(), e)}}
                    onRemoveInputField={() => {this.onRemoveInputField.call(that, e)}}
                />;
            });

        }else{
            // show description about Input Fields ////////////////////////////////////
            inputFields = (
                <View style={styles.containerDescription}>
                    <Text style={[styles.inputsDescription, this.state.styles.inputsDescription]}>
                        Your can record data about your task by adding one or more input fields above. 
                        {"\n\n"}
                        For example, a task labeled "Pushups" would have an input field labeled "How Many" or "Count".
                    </Text>
                </View>
            );
        }

        var labelKeyType = 'done';
        if(this.state.task.inputs.length >= 1)
        {
            labelKeyType = 'next';
        }
        return (
            <Body {...this.props} title="New Task" onLayout={this.onLayoutChange} titleBarButtons={this.ButtonSaveTask.call(that)} >
                <ScrollView onScroll={this.onScrollView} keyboardShouldPersistTaps="handled">
                    <View style={styles.container} onLayout={(event) => this.measureTaskForm(event)} >
                        <Text style={styles.fieldTitle}>Label</Text>
                        <Textbox 
                            ref="tasklabel"
                            style={styles.inputField} 
                            placeholder={this.placeholderTaskName()}
                            returnKeyType={labelKeyType} 
                            blurOnSubmit={false}
                            onChangeText={this.onLabelChangeText}
                            onSubmitEditing={(event) => { 
                                var ref = this.refs['taskInput1'];
                                if(ref){
                                    ref.refs['inputLabel'].focus();
                                }else{
                                    this.refs['tasklabel'].blur();
                                }
                             }}
                        />
                    </View>
                    <View style={[styles.containerInputs, {minHeight:height - this.state.taskForm.height, paddingBottom:this.state.taskForm.inputsOffset}]}>
                        <View>
                            <Text style={styles.inputsTitle}>Input Fields</Text>
                            {this.state.ButtonAddShow && 
                                <ButtonAdd size="small" style={[styles.buttonAddInput, this.state.ButtonAddTop]}
                                    outline={AppStyles.altBackgroundColor}
                                    onPress={this.onPressAddInput}
                                />
                            }
                        </View>
                        {inputFields}
                    </View>
                </ScrollView>
            </Body>
        );
    }
}

// Input Field
class TaskInputField extends React.Component{
    constructor(props){
        super(props);
        this.state = {nextInputLabel:null, labelKeyType:'done'};
    }

    componentDidMount(){
        if(this.props.focus() === true){
            this.refs['inputLabel'].focus();
        }
    }

    render(){
        var labelKeyType = 'done';
        if(this.props.task.inputs.length > this.props.index){
            labelKeyType = 'next';
        }
        return (
            <View style={styles.containerInputField}>
                <View style={[styles.inputFieldLabel, {width:this.props.width - 210}]}>
                    <Textbox 
                        ref={'inputLabel'} 
                        style={styles.inputField} 
                        placeholder="How Many?" 
                        returnKeyType={labelKeyType} 
                        onChangeText={this.props.onChangeText}
                        blurOnSubmit={false}
                        onSubmitEditing={this.props.onSubmitEditing}
                    />
                </View>
                <View style={styles.inputFieldType}>
                    <Picker
                        ref={'inputType'}
                        style={styles.pickerStyle}
                        itemStyle={styles.pickerItemStyle}
                        selectedValue={this.props.input.type}
                        onValueChange={this.props.onPickerValueChange}
                        value={this.props.input.type}
                        items={
                            [
                                {label:"Number", key:0},
                                {label:"Text", key:1},
                                {label:"Date", key:2},
                                {label:"Time", key:3},
                                {label:"Date & Time", key:4},
                                {label:"Stop Watch", key:5},
                                {label:"Yes/No", key:6},
                                {label:"5 Stars", key:7},
                                {label:"Address", key:8},
                                {label:"URL Link", key:9},
                                {label:"Photo", key:10},
                                {label:"Video", key:11}
                            ]
                        }
                    />
                </View>
                <View style={styles.buttonRemoveContainer}>
                    <ButtonClose size="xxsmall" color={AppStyles.color} style={styles.buttonRemoveInput}
                        onPress={this.props.onRemoveInputField}
                    />
                </View>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    //task form
    container: {padding:30, backgroundColor:AppStyles.backgroundColor},
    fieldTitle: {fontSize:16, fontWeight:'bold'},

    // inputs form
    containerInputs: {minHeight:100, paddingVertical:15, backgroundColor:AppStyles.altBackgroundColor},
    inputsTitle: {fontSize:AppStyles.titleFontSize, paddingTop:2, paddingRight:15, paddingLeft:30, paddingBottom:30 },
    containerDescription: {paddingHorizontal:30, flex:1, flexDirection:'column', justifyContent: 'center', alignItems:'center'},
    inputsDescription: { fontSize:16, paddingHorizontal:10, position:'relative', color: AppStyles.color },
    buttonAddInput:{position:'absolute', right:12, zIndex:1},

    //input field
    containerInputField: {width:'100%', flexDirection:'row', paddingHorizontal:30, paddingBottom:20, marginBottom:10, borderBottomColor: AppStyles.altSeparatorColor, borderBottomWidth:1},
    inputField: {fontSize:20},
    inputFieldTitle:{},
    inputFieldType:{},
    pickerStyle:{width:140},
    pickerItemStyle:{fontSize:20},
    buttonRemoveContainer:{position:'absolute', right:12},
    buttonRemoveInput:{paddingVertical:15, paddingHorizontal:10},

    //title bar buttons
    buttonSaveContainer: {width:75, paddingLeft:10, paddingBottom:12, backgroundColor:AppStyles.headerDarkColor},
    buttonSave:{padding:12 }
});

const stylesLandscape = StyleSheet.create({
    inputsDescription: {top:'-20%', maxWidth:'90%'}
});

const stylesPortrait = StyleSheet.create({
    inputsDescription: {top:'-10%', maxWidth:'100%'},
});