import React from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Dimensions, Alert, Picker } from 'react-native';
import Body from 'ui/Body';
import AppStyles from 'dedicate/AppStyles';
import Textbox from 'fields/Textbox';
import ButtonAdd from 'buttons/ButtonAdd';
import ButtonSave from 'buttons/ButtonSave';

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
    ButtonSave = () => {
        return (
            <ButtonSave style={styles.buttonSave} />
        );
    }

    // Events
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

    onPickerValueChange = (index, itemValue, itemIndex) => {
        var inputs = this.state.task.inputs;
        var item = inputs[index - 1];
        item.type = itemValue;
        inputs[index - 1] = item;
        this.setState({
            task: { inputs: inputs }
        });
    }

    // Generate Input Fields List
    RenderInputFields = () => {
        if(this.state.task.inputs.length > 0){
            // show list of Input Fields /////////////////////////////////////////////
            var i = 0;
            var keytype = 'next';
            return (
            <View style={{paddingBottom:40}}>
                {this.state.task.inputs.map((input) => {
                    i++;
                    if(i == this.state.task.inputs.length){
                        keytype='done';
                    }else{
                        keytype='next';
                    }
                    return this.RenderInputField(i, input, keytype);
                })}
            </View>
            );
        }else{
            // show description about Input Fields ////////////////////////////////////
            return (
                <View style={styles.containerDescription}>
                    <Text style={[styles.inputsDescription, this.state.styles.inputsDescription]}>
                        Your can record data about your task by adding one or more input fields above. 
                        {"\n\n"}
                        For example, a task labeled "Pushups" would have an input field labeled "How Many" or "Count".
                    </Text>
                </View>
            );
        }
    }

    // Input Field
    RenderInputField = (index, input, keytype) => {
        var that = this;
        return (
            <View key={input.key} style={styles.containerInputField}>
                <View style={styles.inputFieldLabel}>
                    <Textbox style={styles.inputField} placeholder={input.name} returnKeyType={keytype} />
                </View>
                <View style={styles.inputFieldType}>
                    <Picker
                        selectedValue={input.type}
                        onValueChange={(itemValue, itemIndex) => {that.onPickerValueChange.call(that, index, itemValue, itemIndex);}}>
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
        return (
            <Body {...this.props} title="New Task" onLayout={this.onLayoutChange} titleBarButtons={ButtonSave} >
                <ScrollView contentContainerStyle={styles.scrollview} onScroll={this.onScrollView} keyboardShouldPersistTaps="handled">
                    <View style={styles.container} onLayout={(event) => this.measureTaskForm(event)} >
                        <Text style={styles.fieldTitle}>Label</Text>
                        <Textbox style={styles.inputField} placeholder={this.placeholderTaskName()} />
                    </View>
                    <View style={[styles.containerInputs, {minHeight:height - 160 - this.state.taskForm.inputsOffset}]}>
                        <View>
                            <Text style={styles.inputsTitle}>Input Fields</Text>
                            {this.state.ButtonAddShow && 
                                <ButtonAdd size="small" style={[styles.buttonAddInput, this.state.ButtonAddTop]}
                                    onPress={this.onPressAddInput}
                                    width="25" height="25"
                                />
                            }
                        </View>
                        {this.RenderInputFields()}
                    </View>
                </ScrollView>
            </Body>
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
    containerInputField: {paddingHorizontal:30, paddingBottom:20, marginBottom:10, borderBottomColor: AppStyles.altSeparatorColor, borderBottomWidth:1},
    inputField: {fontSize:20},
    inputFieldTitle:{},
    inputFieldType:{}
});

const stylesLandscape = StyleSheet.create({
    inputsDescription: {top:'-20%', maxWidth:'90%'}
});

const stylesPortrait = StyleSheet.create({
    inputsDescription: {top:'-10%', maxWidth:'100%'},
});