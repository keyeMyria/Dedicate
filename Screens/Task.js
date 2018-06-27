import React from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, 
    Keyboard, KeyboardAvoidingView, BackHandler  } from 'react-native';
import Body from 'ui/Body';
import AppStyles from 'dedicate/AppStyles';
import Textbox from 'fields/Textbox';
import Picker from 'fields/Picker';
import ButtonAdd from 'buttons/ButtonAdd';
import ButtonSave from 'buttons/ButtonSave';
import ButtonClose from 'buttons/ButtonClose';
import ButtonPlus from 'buttons/ButtonPlus';
import Button from 'buttons/Button';
import DbTasks from 'db/DbTasks';
import DbCategories from 'db/DbCategories';

export default class TaskScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task:{
                id: props.navigation.state.params ? props.navigation.state.params.taskId : null,
                name:"",
                inputs:[], // {name:'', type:0},
                category:{id:-1, name:''}
            },
            existingTask:{},
            categories:[],
            taskForm:{
                height:250,
                inputsOffset:0
            },
            styles:stylesLandscape,
            title:'New Task',
            ButtonAddShow: true,
            ButtonInTitleBar: false,
            focusIndex:null,
            visibleHeight:0,
            contentOffset:0,
            nameIndex: Math.floor(Math.random() * (this.names.length)),
            categoryIndex: Math.floor(Math.random() * (this.categories.length)),
            edited: false,
            newcat: {name:''}
        }

        //bind events
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.keyboardDidShow = this.keyboardDidShow.bind(this);
        this.keyboardDidHide = this.keyboardDidHide.bind(this);

        if(this.state.task.id != null){
            //load task details
            var dbTasks = new DbTasks();
            var task = this.state.task;
            var dbtask = dbTasks.GetTask(task.id);
            task.name = dbtask.name;
            task.inputs = dbtask.inputs ? dbtask.inputs.map((input) => {
                return {name:input.name, key:input.id, type:input.type}
            }) : [];
            if(dbtask.category){
                task.category = {id:dbtask.category.id, name:dbtask.category.name};
            }else{
                task.category = {id:-1, name:''}
            }
            
            this.state.task = task;
            this.state.existingTask = JSON.parse(JSON.stringify(task));
            this.state.title = 'Edit Task';
        }

        this.state.categories = this.getDbCategories();
    }

    // Component Events  //////////////////////////////////////////////////////////////////////////////////////
    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    }

    componentDidMount() { 
        this.onLayoutChange();
    }

    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
        Keyboard.removeListener('keyboardDidShow', this.keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this.keyboardDidHide);
        this.onScrollView();
    }

    hardwareBackPress() {
        var goback = this.props.navigation.getParam('goback', 'Tasks');
        this.props.navigation.navigate(goback);
        return true;
    }

    // Keyboard Events  //////////////////////////////////////////////////////////////////////////////////////
    keyboardDidShow (e) {
        let newSize = Dimensions.get('window').height - e.endCoordinates.height
        this.setState({
            visibleHeight: newSize
        })
        this.onScrollView();
    }
    
    keyboardDidHide (e) {
        this.setState({
            visibleHeight: Dimensions.get('window').height
        })
        this.onScrollView();
    }  

    // Database Calls ////////////////////////////////////////////////////////////////////////////////////////
    getDbCategories(){
        var dbCat = new DbCategories;
        return dbCat.GetCategoriesList().filter((cat) => {
            if(!cat || (cat && cat.name=='')  || (cat && cat.id && cat.id==0)){
                global.realm.write(()=>{
                    global.realm.delete(cat);
                });
                return false;
            }
            return true;
            }
        ).map((cat) => {
            return {id:cat.id, name:cat.name}  
        });
    }

    // Screen Orientation changes  //////////////////////////////////////////////////////////////////////////////////////
    onLayoutChange = event => {
        var {height, width} = Dimensions.get('window');
        var taskForm = this.state.taskForm;
    
        if(width > height){
            //landscape
            if(this.state.task.inputs.length > 1){
                taskForm.inputsOffset = 100;
            }
            this.setState({styles: stylesLandscape, taskForm:taskForm});
        }else{
            //portrait
            if(this.state.task.inputs.length > 3){
                taskForm.inputsOffset = 100;
            }
            this.setState({styles: stylesPortrait, taskForm:taskForm});
        }
    }

    // Element Measurements  //////////////////////////////////////////////////////////////////////////////////////
    measureTaskForm(event) {
        var taskForm = this.state.taskForm;
        taskForm.height = Math.floor(event.nativeEvent.layout.height);
        this.setState({taskForm:taskForm});
    }

    // Categories ////////////////////////////////////////////////////////////////////////////////////////////////

    categories = ['Personal Tasks', 'Side Projects', 'Exercise Routines', 'Dieting', 'Shopping', 'Research', 
    'Web Design', 'College', 'Cooking Recipes', 'Video Games', 'Vacation', 'Before Bed', 'Good Morning', 
    'Finances', 'Vehicle Maintenance', 'Medicine', 'Cleaning', 'Conventions', 'Concerts', 'Weekend Projects'];

    getCategoriesForPicker(){
        return this.state.categories.length > 0 ? 
            ([{id:-1, name:'None'}, ...this.state.categories]).map((cat) => {
                var newcat = cat;
                newcat.key = newcat.id;
                newcat.label = newcat.name;
                return newcat;
            }) :
            [{key:-1, label:'None'}];
    }
    onPressAddCategory = event => {
        var that = this;
        this.setState({categoryIndex: Math.floor(Math.random() * (this.categories.length))});
        global.Modal.setContent('Add A New Category',() => {
            return (
                <View style={[styles.modalContainer, {minWidth:300}]}>
                    <Text style={styles.fieldTitle}>Label</Text>
                    <Textbox 
                        ref="tasklabel"
                        value={that.state.newcat.name}
                        style={styles.inputField} 
                        placeholder={that.placeholderCategoryName()}
                        returnKeyType={'done'}
                        onChangeText={that.onNewCategoryTitleChangeText}
                    />
                    <View style={styles.createCategoryButton}>
                        <Button text="Create Category" onPress={() => that.onPressCreateCategory()}/>
                    </View>
                </View>
            );
        });
        global.Modal.show();
    }

    onNewCategoryTitleChangeText = (text) => {
        var newcat = this.state.newcat;
        newcat.name = text;
        this.setState({newcat:newcat});
    }

    placeholderCategoryName(){
        return this.categories[this.state.categoryIndex];
    }

    onPressCreateCategory(){
        if(this.state.newcat.name == ''){
            Alert.alert('Create Category Error', 'You must provide a label for your new category');
            return;
        }
        var dbCat = new DbCategories;
        var task = this.state.task;
        
        var id = dbCat.CreateCategory(this.state.newcat);
        task.category.id = id;
        task.category.name = this.state.newcat.name;
        var catRef = this.refs['categoryPicker'];
        var cats = this.getDbCategories();
        this.setState({newcat:{name:''}, task:task, categories:cats});

        catRef.Update(cats, 0);
        this.validateForm();
        global.Modal.hide();
    }

    onCategoryValueChange = (value, index, label) => {
        var task = this.state.task;
        if(task.category == null){ task.category = {}; }
        task.category.name = label;
        task.category.id = value;
        this.setState({task:task});
        this.validateForm();
    }

    // Child Events //////////////////////////////////////////////////////////////////////////////////////
    onScrollView = event => {
        var offset = event ? event.nativeEvent.contentOffset.y : this.state.contentOffset;
        var headerOffset = this.state.taskForm.height + 15;
        if(offset > 0 && offset > headerOffset){
            //lock button to top of screen
            this.setState({ButtonInTitleBar:true, contentOffset:offset});
        }else{
            this.setState({ButtonInTitleBar:false, contentOffset:offset});
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
        task.inputs.push({name:'', type:0, key:max + 1, isnew:true, isnewkey:true});
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
        this.validateForm();
    }

    onSubmitEditing = (keyType, index) => {
        if(keyType == 'next'){
            this.refs['taskInput' + (index + 1)].refs['inputLabel'].focus();
        }else{
            this.refs['taskInput' + index].refs['inputLabel'].blur();
        }
        this.validateForm();
    }

    onRemoveInputField = (index) => {
        var task = this.state.task;
        task.inputs.splice(index - 1, 1);
        this.setState({task:task, ButtonAddShow:true});
        this.validateForm();
    }

    onPressButtonSave = () => {
        var dbTasks = new DbTasks();
        var task = Object.assign({},this.state.task);
        task = dbTasks.CreateTask(task);
        this.props.navigation.navigate('Tasks')
    }

    onDeleteTask = () => {
        var that = this;
        Alert.alert(
        'Delete Task?',
        'Do you really want to delete this task? All data recorded about this task will also be permanently deleted as well.',
        [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Delete Task', onPress: () => {
                var db = new DbTasks();
                db.DeleteTask(this.state.task.id);
                that.props.navigation.navigate('Tasks')
            }}
        ],
        { cancelable: true }
        )
    }

    shouldFocusInputField = (index) => {
        var task = this.state.task;
        if(task.inputs[index-1].isnew === true){
            task.inputs[index-1].isnew = false;
            this.setState({task:task, focusIndex:index});
            return true;
        }
        return false;
    }

    onFocusInputField(event, index){
        this.onScrollView();
        var that = this;
        if(this.state.focusIndex != index){
            this.setState({focusIndex:index});
        }
    }

    onFocusTaskLabel(event){
        this.onScrollView();
    }

    // Form Validation ////////////////////////////////////////////////////////////////////////////////////////

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

    // TitleBar Button ////////////////////////////////////////////////////////////////////////////////////////
    TitleBarButtons = () => {
        var that = this;
        return (
            <View style={styles.titleBarButtons}>
                {this.state.ButtonInTitleBar && (
                    <View key="buttonAdd" style={styles.titleBarButtonAddInput}>
                        <ButtonAdd onPress={this.onPressAddInput}
                        />
                    </View>
                )}
                {this.state.edited == true && (
                    <View key="buttonSave" style={styles.buttonSaveContainer}>
                        <ButtonSave size="smaller" style={styles.buttonSave} onPress={this.onPressButtonSave} />
                    </View>
                )}
            </View>);
    }

    //Render Component ////////////////////////////////////////////////////////////////////////////////////////
    render() {
        var {height, width} = Dimensions.get('window');
        var that = this;
        //generate input field list
        var inputFields = [];
        if(this.state.task.inputs.length > 0){
            // show list of Input Fields ///////////////////////////
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
                    focus={() => {return this.shouldFocusInputField.call(that, e)}}
                    onFocus={(event) => {this.onFocusInputField.call(that, event, e)}}
                    onChangeText={(text) => {this.onInputLabelChangeText.call(that, e, text)}}
                    onPickerValueChange={(itemValue, itemIndex) => {this.onPickerValueChange.call(that, e, itemValue, itemIndex)}}
                    onSubmitEditing={() => {this.onSubmitEditing.call(that, keytype.toString(), e)}}
                    onRemoveInputField={() => {this.onRemoveInputField.call(that, e)}}
                />;
            });

        }else{
            // show description about Input Fields //////////////////
            inputFields = (
                <View style={styles.containerDescription}>
                    <Text style={[styles.inputsDescription, this.state.styles.inputsDescription]}>
                        Your can record data about your task by adding one or more input fields above. 
                    </Text>
                </View>
            );
        }

        // Render Body ////////////////////////////////////////////////////////////////////////////////////////
        
        var i = 0;
        var labelKeyType = 'done';
        if(this.state.task.inputs.length >= 1)
        {
            labelKeyType = 'next';
        }
        return (
                <Body {...this.props} title={this.state.title} screen="Task" onLayout={this.onLayoutChange} 
                    titleBarButtons={this.TitleBarButtons.call(that)} onScroll={this.onScrollView}
                >
                    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-500}>
                    <View style={styles.container} onLayout={(event) => this.measureTaskForm(event)} >
                        <Text style={styles.fieldTitle}>Label</Text>
                        <Textbox 
                            ref="tasklabel"
                            value={this.state.task.name}
                            style={styles.inputField} 
                            placeholder={this.placeholderTaskName()}
                            returnKeyType={labelKeyType} 
                            onFocus={(e)=>{return this.onFocusTaskLabel.call(that, e)}}
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
                        <View style={styles.categoryContainer}>
                            <View style={styles.categoryColumnOne}>
                                <Text style={[styles.fieldTitle, styles.fieldCategory]}>Category</Text>
                            </View>
                            <View style={styles.categoryColumnTwo}>
                                <ButtonPlus style={styles.buttonAddCategory} color={AppStyles.color} size="xsmall"
                                    onPress={this.onPressAddCategory}
                                />
                            </View>
                            <View style={styles.categoryPicker}>
                                <Picker
                                    ref='categoryPicker'
                                    style={styles.pickerStyle}
                                    itemStyle={styles.pickerItemStyle}
                                    selectedValue={this.state.task.category ? this.state.task.category.id : -1}
                                    onValueChange={this.onCategoryValueChange}
                                    items={this.getCategoriesForPicker()}
                                    title="Select A Category"
                                />
                            </View>
                        </View>
                    </View>
                    <View style={[styles.containerInputs, {minHeight:height - this.state.taskForm.height, paddingBottom:this.state.taskForm.inputsOffset}]}>
                        <View>
                            <Text style={styles.inputsTitle}>Input Fields</Text>
                            {this.state.ButtonAddShow && this.state.ButtonInTitleBar == false &&
                                <ButtonAdd size="small" style={[styles.buttonAddInput]}
                                    outline={AppStyles.altBackgroundColor}
                                    onPress={this.onPressAddInput}
                                />
                            }
                        </View>
                        {inputFields}

                        {this.state.task.id != null && (
                            <View style={styles.buttonDeleteContainer}>
                                <Button text="Delete Task" onPress={this.onDeleteTask}/>
                            </View>
                        )}
                    </View>
                    </KeyboardAvoidingView >
                </Body>
        );
    }
}

// Input Field /////////////////////////////////////////////////////////////////////////////////////////////////
class TaskInputField extends React.Component{
    constructor(props){
        super(props);
        this.state = {label:props.input.name, labelKeyType:'done'};
    }

    componentDidMount(){
        if(this.props.focus() === true){
            this.refs['inputLabel'].focus();
        }
    }

    onChangeText(text){
        this.setState({label:text});
        this.props.onChangeText(text);
    }

    saveState(state){
        this.setState(state);
    }

    render(){
        var that = this;
        var labelKeyType = 'done';
        if(this.props.task.inputs.length > this.props.index){
            labelKeyType = 'next';
        }
        var typeLabel = '';
        switch(this.props.input.type){
            case 0: typeLabel = 'Number'; break;
            case 1: typeLabel = 'Text'; break;
            case 2: typeLabel = 'Date'; break;
            case 3: typeLabel = 'Time'; break;
            case 4: typeLabel = 'Date & Time'; break;
            //case 5: typeLabel = 'Stop Watch'; break;
            case 6: typeLabel = 'Yes/No'; break;
            case 7: typeLabel = '5 Stars'; break;
            case 8: typeLabel = 'Location'; break;
            case 9: typeLabel = 'URL Link'; break;
            case 10: typeLabel = 'Photo'; break;
            case 11: typeLabel = 'Video'; break;

        }
        return (
            <View style={styles.containerInputField}>
                <View style={[styles.inputFieldLabel, {width:this.props.width - 210}]}>
                    <Textbox 
                        ref={'inputLabel'} 
                        style={styles.inputField} 
                        placeholder="How many?" 
                        returnKeyType={labelKeyType} 
                        onChangeText={(text) => this.onChangeText.call(that, text)}
                        onFocus={this.props.onFocus}
                        blurOnSubmit={false}
                        onSubmitEditing={this.props.onSubmitEditing}
                        value={this.state.label}
                    />
                </View>
                <View style={styles.inputFieldType}>
                    {this.props.input.isnewkey == true ?
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
                                    //{label:"Stop Watch", key:5},
                                    {label:"Yes/No", key:6},
                                    {label:"5 Stars", key:7},
                                    {label:"Location", key:8},
                                    {label:"URL Link", key:9},
                                    {label:"Photo", key:10},
                                    {label:"Video", key:11}
                                ]
                            }
                            title="Select A Data Type"
                        />
                    :
                        <Text style={styles.typeLabel}>{typeLabel}</Text>
                    }
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


// StyleSheet ////////////////////////////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
    //task form
    container: {padding:30, backgroundColor:AppStyles.backgroundColor},
    keyboardavoidingview:{},
    fieldTitle: {fontSize:16, fontWeight:'bold'},

    //category field
    categoryContainer:{width:'100%', paddingTop:20},
    categoryColumnOne:{paddingTop:5, height:25},
    categoryColumnTwo:{position:'absolute', right:-10, top:24},
    categoryPicker:{paddingTop:5},

    // create category modal
    createCategoryButton:{paddingTop:20, alignSelf:'center'},

    // inputs form
    containerInputs: {minHeight:100, paddingTop:15, paddingBottom:70, backgroundColor:AppStyles.altBackgroundColor},
    inputsTitle: {fontSize:AppStyles.titleFontSize, paddingTop:2, paddingRight:15, paddingLeft:30, paddingBottom:30 },
    containerDescription: {paddingTop:50, paddingHorizontal:30, flexDirection:'column',  alignItems:'center'},
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
    typeLabel:{ fontSize:20, paddingTop:10, paddingLeft:10},

    //title bar buttons
    titleBarButtons:{flexDirection:'row'},
    titleBarButtonAddInput:{paddingTop:3, zIndex:1002},
    buttonSaveContainer: {width:75, zIndex:1001, paddingLeft:10, paddingBottom:12, backgroundColor:AppStyles.headerDarkColor},
    buttonSave:{padding:12 },

    //delete button
    buttonDeleteContainer:{paddingTop:30, paddingBottom:15, alignItems:'center'},

    //new category modal window
    modalContainer:{backgroundColor:AppStyles.backgroundColor, minWidth:'50%', padding:30}
});

const stylesLandscape = StyleSheet.create({
    inputsDescription: {top:'-20%', maxWidth:'90%'}
});

const stylesPortrait = StyleSheet.create({
    inputsDescription: {top:'-10%', maxWidth:'100%'},
});