import React from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Dimensions, Alert, Picker } from 'react-native';
import Body from 'ui/Body';
import AppStyles from 'dedicate/AppStyles';
import Textbox from 'fields/Textbox';
import ButtonAdd from 'buttons/ButtonAdd';
import ButtonSave from 'buttons/ButtonSave';
import DbTasks from 'db/DbTasks';

export default class NewTaskScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task:{
                name:"New Task",
                inputs:[], // {name:'', type:0}
            },
            taskForm:{
                height:160,
                inputsOffset:0
            },
            styles:stylesLandscape,
            ButtonAddTop: {},
            ButtonAddShow: {},
            nameIndex: Math.floor(Math.random() * (this.names.length))
        }


    }

    componentDidMount() { 
        this.onLayoutChange();
    }

    // Screen Orientation changes
    onLayoutChange = event => {
        var {height, width} = Dimensions.get('window');
        var inputsOffset = 0;
        if(this.state.task.inputs.length > 3){
            inputsOffset -= 50;
        }
        
        if(width > height){
            //landscape
            this.setState({styles: stylesLandscape, taskForm:{inputsOffset:inputsOffset}});
        }else{
            //portrait
            this.setState({styles: stylesPortrait, taskForm:{inputsOffset:inputsOffset}});
        }
    }

    // Element Measurements
    measureTaskForm(event) {
        this.setState({
            taskForm:{ height: event.nativeEvent.layout.height }
        });
    }

    // Save Button
    ButtonSaveTask = () => {
        return(
            <View style={styles.buttonSaveContainer}>
                <ButtonSave size="smaller" style={styles.buttonSave} onPress={this.OnPressButtonSave} />
            </View>
        );

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
        var max = inputs.map(function(attrs){return attrs.key;}).reduce(function (a, b) { return (b > a) ? b : a; }, 0);
        inputs.push({name:'My Input', type:0, key:max + 1});
        this.setState({
           task:{inputs:inputs},
           ButtonAddShow:show //show Button
        });
    }

    onPressButtonSave = event => {
        console.log('wtf');
        console.log(this.state.task);
        //DbTasks.CreateTask(this.state.task);
    }

    onInputLabelChangeText = (index, text) => {
        var inputs = this.state.task.inputs;
        var item = inputs[index - 1];
        item.name = text;
        inputs[index - 1] = item;
        this.setState({
            task: { inputs: inputs }
        });
    }

    onSubmitEditing = (keyType, index) => {
        if(keyType == 'next'){
            this.refs['taskInput' + (index + 1)].refs['inputLabel' + (index + 1)].focus();
        }else{
            this.refs['taskInput' + index].refs['inputLabel' + index].blur();
        }
    }

    onPickerValueChange = (index, itemValue, itemIndex) => {
        var inputs = this.state.task.inputs;
        var item = inputs[index - 1];
        item.type = itemValue;
        inputs[index - 1] = item;
        this.setState({
            task: { inputs: inputs }
        });
    }
    // Placeholder Task Names
    names = [
        "Pushups", "Exercise", "Jogging", "Cook food", "Read a book", "Watch a movie",
        "Go Swimming", "Ride bike", "Go camping", "Go hiking", "Brush teeth"
    ];

    placeholderTaskName() {
        return this.names[this.state.nameIndex];
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
                    onSubmitEditing={() => {this.onSubmitEditing.call(that, keytype.toString(), e)}}
                    onPickerValueChange={(itemValue, itemIndex) => {this.onPickerValueChange.call(that, e, itemValue, itemIndex)}}
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
            <Body {...this.props} title="New Task" onLayout={this.onLayoutChange} titleBarButtons={this.ButtonSaveTask.call(this)} >
                <ScrollView contentContainerStyle={styles.scrollview} onScroll={this.onScrollView} keyboardShouldPersistTaps="handled">
                    <View style={styles.container} onLayout={(event) => this.measureTaskForm(event)} >
                        <Text style={styles.fieldTitle}>Label</Text>
                        <Textbox 
                            ref="tasklabel"
                            style={styles.inputField} 
                            placeholder={this.placeholderTaskName()}
                            returnKeyType={labelKeyType} 
                            blurOnSubmit={false}
                            onSubmitEditing={(event) => { 
                                var ref = this.refs['taskInput1'];
                                if(ref){
                                    ref.refs['inputLabel1'].focus();
                                }else{
                                    this.refs['tasklabel'].blur();
                                }
                             }}
                        />
                    </View>
                    <View style={[styles.containerInputs, {minHeight:height - 160 + this.state.taskForm.inputsOffset}]}>
                        <View>
                            <Text style={styles.inputsTitle}>Input Fields</Text>
                            {this.state.ButtonAddShow && 
                                <ButtonAdd size="small" style={[styles.buttonAddInput, this.state.ButtonAddTop]}
                                    onPress={this.onPressAddInput}
                                    width="25" height="25"
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
        this.state = {nextInputLabel:null};
    }

    componentDidMount(){
        this.setState({nextInputLabel:this.refs.inputLabel2});
    }

    render(){
        var that = this;
        var labelKeyType = 'done';
        var nextInputLabel;
        if(this.props.task.inputs.length > this.props.index){
            labelKeyType = 'next';
            nextInputLabel = this.refs['inputLabel' + (this.props.index + 1)]; 
        }
        return (
            <View style={styles.containerInputField}>
                <View style={[styles.inputFieldLabel, {width:this.props.width - 175}]}>
                    <Textbox 
                        ref={'inputLabel' + this.props.index} 
                        style={styles.inputField} 
                        placeholder={this.props.input.name} 
                        returnKeyType={labelKeyType} 
                        onChangeText={this.props.onChangeText}
                        blurOnSubmit={false}
                        onSubmitEditing={this.props.onSubmitEditing}
                    />
                </View>
                <View style={[styles.inputFieldType, {width:150}]}>
                    <Picker
                        style={styles.pickerStyle}
                        itemStyle={styles.pickerItemStyle}
                        selectedValue={this.props.input.type}
                        onValueChange={this.props.onPickerValueChange}
                        value={this.props.input.type}
                    >
                        <Picker.Item label="Number" value="0" />
                        <Picker.Item label="Text" value="1" />
                        <Picker.Item label="Date" value="2" />
                        <Picker.Item label="Yes/No" value="3" />
                        <Picker.Item label="5 Stars" value="4" />
                    </Picker>
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
    buttonAddInput:{position:'absolute', right:10, zIndex:1},

    //input field
    containerInputField: {flexDirection:'row', paddingHorizontal:30, paddingBottom:20, marginBottom:10, borderBottomColor: AppStyles.altSeparatorColor, borderBottomWidth:1},
    inputField: {fontSize:20},
    inputFieldTitle:{},
    inputFieldType:{},
    pickerStyle:{},
    pickerItemStyle:{fontSize:20},

    //title bar buttons
    buttonSaveContainer: {paddingTop:12, paddingLeft:20, backgroundColor:AppStyles.headerDarkColor},
    buttonSave:{}
});

const stylesLandscape = StyleSheet.create({
    inputsDescription: {top:'-20%', maxWidth:'90%'}
});

const stylesPortrait = StyleSheet.create({
    inputsDescription: {top:'-10%', maxWidth:'100%'},
});