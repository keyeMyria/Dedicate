import React from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import Body from 'ui/Body';
import AppStyles from 'dedicate/AppStyles';
import Textbox from 'fields/Textbox';
import ButtonAdd from 'buttons/ButtonAdd';

export default class NewTaskScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task:{
                name:"New Task",
                inputs:[], // {name:'', type:0}
            },
            taskForm:{
                height:160
            },
            styles:stylesLandscape,
            styleForButtonAdd: {}
        }
    }

    componentDidMount() { 
        this.onLayoutChange();
    }

    // Screen Orientation changes
    onLayoutChange = event => {
        var {height, width} = Dimensions.get('window');
        if(width > height){
            //landscape
            this.setState({styles: stylesLandscape});
        }else{
            //portrait
            this.setState({styles: stylesPortrait});
        }
    }

    // Element Measurements
    measureTaskForm(event) {
        this.setState({
            taskForm:{ height: event.nativeEvent.layout.height }
        });
    }

    // Button Events
    onPressAddInput = event => {
        var inputs = this.state.task.inputs;
        if(inputs.length == 10){
            Alert.alert(
                'Maximum Supported Inputs', 
                'Your task can only have a maximum of 10 input fields.',
                [{text: 'Okay'}],
                { cancelable: false }
            );
            return;
        }
        var max = inputs.map(function(attrs){return attrs.key;}).reduce(function (a, b) { return (b > a) ? b : a; }, 0);
        inputs.push({name:'My Input', type:0, key:max + 1});
        this.setState({
           task:{inputs:inputs} 
        });
    }

    onScrollView = event => {
        var offset = event.nativeEvent.contentOffset.y;
        if(offset > this.state.taskForm.height){
            //lock button to top of screen
            this.setState({
                styleForButtonAdd:{position:'absolute', top: (offset - this.state.taskForm.height) }
            });
        }
    }

    //Render Component
    render() {
        var {height, width} = Dimensions.get('window');
        return (
            <Body {...this.props} title="New Task" onLayout={this.onLayoutChange}>
                <ScrollView contentContainerStyle={styles.scrollview} onScroll={this.onScrollView} keyboardShouldPersistTaps="handled">
                    <View style={styles.container} onLayout={(event) => this.measureTaskForm(event)} >
                        <Text style={styles.fieldTitle}>Label</Text>
                        <Textbox placeholder="New Task" />
                    </View>
                    <View style={[styles.containerInputs, {minHeight:height}]}>
                        <View>
                            <Text style={styles.inputsTitle}>Input Fields</Text>
                            <ButtonAdd size="small" style={[styles.buttonAddInput, this.state.styleForButtonAdd]}
                                onPress={this.onPressAddInput}
                                width="25" height="25"
                            />
                        </View>
                        <RenderInputFields {...this.props} state={this.state} />
                    </View>
                </ScrollView>
            </Body>
        );
    }
}

const RenderInputFields = (props) => {
    if(props.state.task.inputs.length > 0){
        // show list of Input Fields /////////////////////////////////////////////
        var i = 0;
        return (
        <View style={{paddingBottom:40}}>
            {props.state.task.inputs.map((input) => {
                i++;
                return (
                    <View key={input.key} style={styles.containerInputField}>
                        <Textbox placeholder={input.name} />
                    </View>
                );
            })}
        </View>
        );
    }else{
        // show description about Input Fields ////////////////////////////////////
        return (
            <View style={styles.containerDescription}>
                <Text style={[styles.inputsDescription, props.state.styles.inputsDescription]}>
                    Your can record data about your task by adding one or more input fields above. 
                    {"\n\n"}
                    For example, a task labeled "Pushups" would have an input field labeled "How Many" or "Count".
                </Text>
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
    inputsTitle: {fontSize:AppStyles.titleFontSize, paddingTop:4, paddingRight:15, paddingLeft:30, paddingBottom:30 },
    containerDescription: {paddingHorizontal:30, flex:1, flexDirection:'column', justifyContent: 'center', alignItems:'center'},
    inputsDescription: { fontSize:16, paddingHorizontal:10, position:'relative', color: AppStyles.color },
    buttonAddInput:{position:'absolute', right:10, zIndex:1},

    //input field
    containerInputField: {paddingHorizontal:30, paddingBottom:20, marginBottom:10, borderBottomColor: AppStyles.altSeparatorColor, borderBottomWidth:1},
});

const stylesLandscape = StyleSheet.create({
    inputsDescription: {top:'-20%', maxWidth:'90%'}
});

const stylesPortrait = StyleSheet.create({
    inputsDescription: {top:'-10%', maxWidth:'100%'},
});