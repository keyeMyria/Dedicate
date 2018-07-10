import React from 'react';
import { View, StyleSheet, Dimensions, Alert, BackHandler, NativeEventEmitter  } from 'react-native';
import Text from 'text/Text';
import Form, {FormHeader, FormBody} from 'ui/Form';
import AppStyles from 'dedicate/AppStyles';
import Textbox from 'fields/Textbox';
import Picker from 'fields/Picker';
import ButtonClose from 'buttons/ButtonClose';
import ButtonPlus from 'buttons/ButtonPlus';
import Button from 'buttons/Button';
import DbTasks from 'db/DbTasks';
import DbCategories from 'db/DbCategories';
import ToolTip from 'tooltip/Top';

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
            categoryList:[],
            title:'New Task',
            focusIndex:null,
            nameIndex: Math.floor(Math.random() * (this.placeHolderNames.length)),
            categoryIndex: Math.floor(Math.random() * (this.categories.length)),
            edited: false,
            newcat: {name:''}
        }

        if(this.state.task.id != null){
            //load task details
            const dbTasks = new DbTasks();
            let task = this.state.task;
            const dbtask = dbTasks.GetTask(task.id);
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
        this.state.categoryList = this.getCategoriesForPicker();

        //bind methods
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.navigate = this.navigate.bind(this);
        this.loadToolbar = this.loadToolbar.bind(this);
        this.onPressCreateCategory = this.onPressCreateCategory.bind(this);
        this.shouldFocusInputField = this.shouldFocusInputField.bind(this);
        this.onFocusInputField = this.onFocusInputField.bind(this);
        this.onFocusTaskLabel = this.onFocusTaskLabel.bind(this);
        this.onInputLabelChangeText = this.onInputLabelChangeText.bind(this);
        this.onPickerValueChange = this.onPickerValueChange.bind(this);
        this.onSubmitEditing = this.onSubmitEditing.bind(this);
        this.onRemoveInputField = this.onRemoveInputField.bind(this);
        this.onNewCategoryTitleChangeText = this.onNewCategoryTitleChangeText.bind(this);
    }

    // Component Events  //////////////////////////////////////////////////////////////////////////////////////
    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        this.loadToolbar();

        //listen to navigation emitter
        this.navigatorEmitter = new NativeEventEmitter();
        this.navigatorSubscription = this.navigatorEmitter.addListener('navigate', this.navigate);
    }

    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
        this.navigatorSubscription.remove();
    }

    hardwareBackPress() {
        const goback = this.props.navigation.getParam('goback', 'Tasks');
        global.navigate(this, goback);
        if(goback == 'Overview') {global.refreshOverview();}
        if(typeof global.updatePrevScreen != 'undefined'){ global.updatePrevScreen(); }
        return true;
    }

    navigate(screen, props, prevScreen){
        if(screen == 'Task' && prevScreen != screen){
            this.loadToolbar();
        }
    }

    // Load Toolbar ////////////////////////////////////////////////////////////////////////////////////////////////////

    loadToolbar(){
        global.updateToolbar({
            ...this.props, 
            screen:'Task',
            buttonAdd:false, 
            buttonRecord:true, 
            bottomFade:true, 
            hasTasks:true, 
            hasRecords:true,
            footerMessage: ''
        });
    }

    // Categories ////////////////////////////////////////////////////////////////////////////////////////////////

    categories = ['Personal Tasks', 'Side Projects', 'Exercise Routines', 'Dieting', 'Shopping', 'Research', 
    'Web Design', 'College', 'Cooking Recipes', 'Video Games', 'Vacation', 'Before Bed', 'Good Morning', 
    'Finances', 'Vehicle Maintenance', 'Medicine', 'Cleaning', 'Conventions', 'Concerts', 'Weekend Projects'];
    
    getDbCategories(){
        const dbCat = new DbCategories;
        return dbCat.GetCategoriesList().map((cat) => {
            return {id:cat.id, name:cat.name}  
        });
    }

    getCategoriesForPicker(){
        return this.state.categories.length > 0 ? 
            [{id:-1, name:'None'}, ...this.state.categories].map((cat) => {
                return {value: cat.id, label:cat.name};
            }) :
            [{value:-1, label:'None'}];
    }

    onPressAddCategory = () => {
        this.setState({categoryIndex: Math.floor(Math.random() * (this.categories.length))});
        global.Modal.setContent('Add A New Category',(
            <View style={[this.styles.modalContainer, {minWidth:300}]}>
                <Text style={this.styles.fieldTitle}>Label</Text>
                <Textbox 
                    defaultValue={this.state.newcat.name}
                    style={this.styles.inputField} 
                    placeholder={this.categories[this.state.categoryIndex]}
                    returnKeyType={'done'}
                    onChangeText={this.onNewCategoryTitleChangeText}
                    maxLength={25}
                />
                <View style={this.styles.createCategoryButton}>
                    <Button text="Create Category" onPress={this.onPressCreateCategory}/>
                </View>
            </View>
        ));
        global.Modal.show();
    }

    onNewCategoryTitleChangeText = (text) => {
        let newcat = this.state.newcat;
        newcat.name = text;
        this.setState({newcat:newcat});
    }

    onPressCreateCategory(){
        if(this.state.newcat.name == ''){
            Alert.alert('Create Category Error', 'You must provide a label for your new category');
            return;
        }
        const dbCat = new DbCategories;
        let task = this.state.task;
        
        const id = dbCat.CreateCategory(this.state.newcat);
        task.category.id = id;
        task.category.name = this.state.newcat.name;
        let cats = this.getDbCategories();
        this.setState({newcat:{name:''}, task:task, categories:cats}, 
        () => {
            this.setState({categoryList:this.getCategoriesForPicker()});
            this.validateForm();
            global.Modal.hide();
        });

    }

    onCategoryValueChange = (value, index, label) => {
        let task = this.state.task;
        if(task.category == null){ task.category = {}; }
        task.category.name = label;
        task.category.id = value;
        this.setState({task:task});
        this.validateForm();
    }

    // Add Input ////////////////////////////////////////////////////////////////////////////////////////////////

    onPressAddInput = () => {
        const inputs = this.state.task.inputs;
        let show = true;
        if(inputs.length == 9){
            show = false;
        }
        let task = this.state.task;
        let max = inputs.map(function(attrs){return attrs.key;}).reduce(function (a, b) { return (b > a) ? b : a; }, 0);
        task.inputs.push({name:'', type:0, key:max + 1, isnew:true, isnewkey:true});
        this.setState({
           task:task,
           ButtonAddShow:show //show Button
        }, () => {
            this.validateForm();
        });
        
    }

    // Input Changes ////////////////////////////////////////////////////////////////////////////////////////////////

    onLabelChangeText = text => {
        let task = this.state.task;
        task.name = text;
        this.setState({task:task});
        this.validateForm();
    }

    onInputLabelChangeText = (index, text) => {
        let task = this.state.task;
        task.inputs[index - 1].name = text;
        this.setState({ task: task });
        this.validateForm();
    }

    onPickerValueChange = (index, itemValue) => {
        let task = this.state.task;
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

    shouldFocusInputField = (index) => {
        let task = this.state.task;
        if(task.inputs[index-1].isnew === true){
            task.inputs[index-1].isnew = false;
            this.setState({task:task, focusIndex:index});
            return true;
        }
        return false;
    }

    onFocusInputField(event, index){
        if(this.state.focusIndex != index){
            this.setState({focusIndex:index});
        }
    }

    onFocusTaskLabel(){}

    // Remove Input ////////////////////////////////////////////////////////////////////////////////////////////////

    onRemoveInputField = (index) => {
        let task = this.state.task;
        task.inputs.splice(index - 1, 1);
        this.setState({task:task, ButtonAddShow:true});
        this.validateForm();
    }

    // Delete Task ////////////////////////////////////////////////////////////////////////////////////////////////

    onDeleteTask = () => {
        Alert.alert(
        'Delete Task?',
        'Do you really want to delete this task? All data recorded about this task will also be permanently deleted as well.',
        [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Delete Task', onPress: () => {
                const db = new DbTasks();
                db.DeleteTask(this.state.task.id);
                global.overviewChanged = true;
                global.navigate(this, 'Tasks')
            }}
        ],
        { cancelable: true }
        )
    }

    // Form Validation ////////////////////////////////////////////////////////////////////////////////////////

    validateForm = () => {
        //validate form fields in order to show save button
        let show = false;
        if(this.state.task.name.length > 0){
            show = true;
            for(x = 0; x < this.state.task.inputs.length; x++){
                if(this.state.task.inputs[x].name == ''){show = false; break;}
            }
        }
        if(this.state.edited != show){
            this.setState({edited:show});
        }
    }

    // Save Task ////////////////////////////////////////////////////////////////////////////////////////////////

    onPressButtonSave = () => {
        const dbTasks = new DbTasks();
        let task = Object.assign({},this.state.task);
        task = dbTasks.CreateTask(task);
        global.overviewChanged = true;
        global.navigate(this, 'Tasks')
    }

    // Placehold Random Names ////////////////////////////////////////////////////////////////////////////////////////////////

    placeHolderNames = [
        "Pushups", "Exercise", "Jogging", "Cook food", "Read a book", "Watch a movie",
        "Go Swimming", "Ride bike", "Go camping", "Go hiking"
    ];

    placeHolderInputs = [
        "Count", "Sets", "Miles", "Recipe", "Pages", "Minutes",
        "Laps", "Miles", "Miles", "Miles"
    ];

    placeholderTaskName() {
        return this.placeHolderNames[this.state.nameIndex];
    }

    placeholderInputName() {
        return this.placeHolderInputs[this.state.nameIndex];
    }

    //Render Component ////////////////////////////////////////////////////////////////////////////////////////
    render() {
        const {width} = Dimensions.get('window');
        //generate input field list
        let inputFields = [];
        if(this.state.task.inputs.length > 0){
            // show list of Input Fields ///////////////////////////
            let i = 0;
            inputFields = this.state.task.inputs.map((input) => {
                i++;
                let e = parseInt(i.toString());
                let keytype = 'next';
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
                    placeholder={this.placeholderInputName()}
                    focus={() => {return this.shouldFocusInputField(e)}}
                    onFocus={(event) => {this.onFocusInputField(event, e)}}
                    onChangeText={(text) => {this.onInputLabelChangeText(e, text)}}
                    onPickerValueChange={(itemValue, itemIndex) => {this.onPickerValueChange(e, itemValue, itemIndex)}}
                    onSubmitEditing={() => {this.onSubmitEditing(keytype.toString(), e)}}
                    onRemoveInputField={() => {this.onRemoveInputField(e)}}
                />;
            });

        }else{
            // show description about Input Fields //////////////////
            inputFields = (
                <View style={this.styles.containerDescription}>
                    <ToolTip background={AppStyles.altBackgroundColor} text="You can record data about your task by adding one or more input fields above"/>
                </View>
            );
        }

        // Render Body ////////////////////////////////////////////////////////////////////////////////////////
        
        let i = 0;
        let labelKeyType = 'done';
        if(this.state.task.inputs.length >= 1)
        {
            labelKeyType = 'next';
        }
        return (
            <Form {...this.props} 
            title={this.state.title} screen="Task" bodyTitle="Input Fields" edited={this.state.edited}
            onPressAddInput={this.onPressAddInput} onPressSave={this.onPressButtonSave} backButton={this.hardwareBackPress}
            >
                <FormHeader>
                    <View style={this.styles.headerContainer}>
                        <Text style={this.styles.fieldTitle}>Label</Text>
                        <Textbox 
                            ref="tasklabel"
                            value={this.state.task.name}
                            style={this.styles.inputField} 
                            placeholder={this.placeholderTaskName()}
                            returnKeyType={labelKeyType} 
                            onFocus={(e)=>{return this.onFocusTaskLabel(e)}}
                            blurOnSubmit={false}
                            onChangeText={this.onLabelChangeText}
                            onSubmitEditing={(event) => { 
                                let ref = this.refs['taskInput1'];
                                if(ref){
                                    ref.refs['inputLabel'].focus();
                                }else{
                                    this.refs['tasklabel'].blur();
                                }
                                }}
                                maxLength={24}
                        />
                        <View style={this.styles.categoryContainer}>
                            <View style={this.styles.categoryColumnOne}>
                                <Text style={[this.styles.fieldTitle, this.styles.fieldCategory]}>Category</Text>
                            </View>
                            <View style={this.styles.categoryColumnTwo}>
                                <ButtonPlus style={this.styles.buttonAddCategory} color={AppStyles.color} size="xsmall"
                                    onPress={this.onPressAddCategory}
                                />
                            </View>
                            <View style={this.styles.categoryPicker}>
                                <Picker
                                    style={this.styles.pickerStyle}
                                    itemStyle={this.styles.pickerItemStyle}
                                    selectedValue={this.state.task.category ? this.state.task.category.id : -1}
                                    onValueChange={this.onCategoryValueChange}
                                    items={this.state.categoryList}
                                    title="Select A Category"
                                />
                            </View>
                        </View>
                    </View>
                </FormHeader>
                <FormBody>
                    <View style={this.styles.inputsContainer}>
                    {inputFields}

                    {this.state.task.id != null && (
                        <View style={this.styles.buttonDeleteContainer}>
                            <Button text="Delete Task" onPress={this.onDeleteTask}/>
                        </View>
                    )}
                    </View>
                </FormBody>
            </Form>
        );
    }

    styles = StyleSheet.create({
        body:{backgroundColor:AppStyles.altBackgroundColor},
        
        //task form
        headerContainer: {padding:20},
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
        inputsContainer:{paddingBottom:100},
        inputsTitle: {fontSize:24, paddingTop:2, paddingRight:15, paddingLeft:30, paddingBottom:30 },
        containerDescription: {paddingTop:50, paddingHorizontal:30, flexDirection:'column',  alignItems:'center'},
        inputsDescription: { fontSize:16, paddingHorizontal:10, position:'relative', color: AppStyles.color },
        buttonAddInput:{position:'absolute', right:12, zIndex:1},
        pickerItemStyle:{fontSize:20},
        pickerStyle:{width:140},
        inputField: {fontSize:20},
    
        //title bar buttons
        titleBarButtons:{flexDirection:'row'},
        titleBarButtonAddInput:{paddingTop:3, paddingRight:8, zIndex:1002},
        buttonSaveContainer: {width:75, zIndex:1001, paddingLeft:10, paddingBottom:12, backgroundColor:AppStyles.headerDarkColor},
        buttonSave:{padding:12 },
    
        //delete button
        buttonDeleteContainer:{paddingTop:30, paddingBottom:15, alignItems:'center'},
    
        //new category modal window
        modalContainer:{backgroundColor:AppStyles.backgroundColor, minWidth:'50%', padding:30}
    });
}

// Input Field /////////////////////////////////////////////////////////////////////////////////////////////////
class TaskInputField extends React.Component{
    constructor(props){
        super(props);
        this.state = {label:props.input.name, labelKeyType:'done'};

        //bind methods
        this.onLayout = this.onLayout.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }

    onLayout(){
        if(this.props.focus() === true){
            try{
            this.refs['inputLabel'].focus();
            }catch(ex){}
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
        let labelKeyType = 'done';
        if(this.props.task.inputs.length > this.props.index){
            labelKeyType = 'next';
        }
        let typeLabel = '';
        switch(this.props.input.type){
            case 0: typeLabel = 'Number'; break;
            case 1: typeLabel = 'Text'; break;
            case 2: typeLabel = 'Date'; break;
            case 3: typeLabel = 'Time'; break;
            case 4: typeLabel = 'Date & Time'; break;
            //case 5: typeLabel = 'Stop Watch'; break;
            case 6: typeLabel = 'Yes/No'; break;
            case 7: typeLabel = 'Rating'; break;
            case 8: typeLabel = 'Location'; break;
            case 9: typeLabel = 'URL Link'; break;
            //case 10: typeLabel = 'Photo'; break;
            //case 11: typeLabel = 'Video'; break;

        }
        return (
            <View style={this.styles.containerInputField} onLayout={this.onLayout}>
                <View style={[this.styles.inputFieldLabel, {width:this.props.width - 210}]}>
                    <Textbox 
                        ref={'inputLabel'} 
                        style={this.styles.inputField} 
                        placeholder={this.props.placeholder} 
                        returnKeyType={labelKeyType} 
                        onChangeText={(text) => this.onChangeText(text)}
                        onFocus={this.props.onFocus}
                        blurOnSubmit={false}
                        onSubmitEditing={this.props.onSubmitEditing}
                        value={this.state.label}
                        maxLength={16}
                    />
                </View>
                <View style={this.styles.inputFieldType}>
                    {this.props.input.isnewkey == true ?
                        <Picker
                            ref={'inputType'}
                            style={this.styles.pickerStyle}
                            itemStyle={this.styles.pickerItemStyle}
                            selectedValue={this.props.input.type}
                            onValueChange={this.props.onPickerValueChange}
                            items={
                                [
                                    {label:"Number", value:0},
                                    {label:"Text", value:1},
                                    {label:"Date", value:2},
                                    {label:"Time", value:3},
                                    {label:"Date & Time", value:4},
                                    //{label:"Stop Watch", value:5},
                                    {label:"Yes/No", value:6},
                                    {label:"Rating", value:7},
                                    {label:"Location", value:8},
                                    {label:"URL Link", value:9},
                                    //{label:"Photo", value:10},
                                    //{label:"Video", value:11}
                                ]
                            }
                            title="Select A Data Type"
                        />
                    :
                        <Text style={this.styles.typeLabel}>{typeLabel}</Text>
                    }
                </View>
                <View style={this.styles.buttonRemoveContainer}>
                    <ButtonClose size="xxsmall" color={AppStyles.color} style={this.styles.buttonRemoveInput}
                        onPress={this.props.onRemoveInputField}
                    />
                </View>
            </View>
        );
    }

    styles = StyleSheet.create({
        //input field
        containerInputField: {width:'100%', flexDirection:'row', paddingHorizontal:30, paddingBottom:20, marginBottom:10, borderBottomColor: AppStyles.altSeparatorColor, borderBottomWidth:1},
        inputField: {fontSize:20},
        inputFieldTitle:{},
        inputFieldType:{},
        pickerStyle:{width:140},
        pickerItemStyle:{fontSize:20},
        buttonRemoveContainer:{position:'absolute', right:12},
        buttonRemoveInput:{paddingVertical:15, paddingHorizontal:10},
        typeLabel:{ fontSize:20, paddingTop:10, paddingLeft:10, opacity:0.5}
    });
}
