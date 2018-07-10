import React from 'react';
import { View, StyleSheet, TouchableHighlight, BackHandler, FlatList, Dimensions, NativeEventEmitter } from 'react-native';
import Text from 'text/Text';
import Picker from 'fields/Picker';
import Body from 'ui/Body';
import AppStyles from 'dedicate/AppStyles';
import DbRecords from 'db/DbRecords';
import DbTasks from 'db/DbTasks';
import DateFormat from 'utility/DateFormat';
import DatesMatch from 'utility/DatesMatch';
import DayInYear from 'utility/DayInYear';
import DateSentence from 'utility/DateSentence';
import ButtonSearch from 'buttons/ButtonSearch';
import Collapsible from 'react-native-collapsible';
import DropShadow from 'ui/DropShadow';
import StartEndDateTimePicker from 'fields/StartEndDateTimePicker';
import TextLink from 'text/TextLink';
import IconEvents from 'icons/IconEvents';
import CheckBox from 'fields/CheckBox';
import FiveStars from 'fields/FiveStars';
import Loading from 'ui/Loading';

export default class EventsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            tasks: [],
            start:0,
            refreshing: false,
            nomore: false, //no more records to load
            refresh:0,
            filterForm:this.props.navigation.getParam('filterForm', false), //toggle filter form
            filterDates:this.props.navigation.getParam('filterDates', false), //toggle dates within filter form
            filter:{
                taskId:-1,
                datestart:null,
                dateend:null
            },
            loading:false
        };

        let filter = this.props.navigation.getParam('filter', null);
        if(filter != null){
            this.state.filter = filter;
        }

        //bind methods
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.navigate = this.navigate.bind(this);
        this.loadToolbar = this.loadToolbar.bind(this);
        this.filterTasks = this.filterTasks.bind(this);
        this.toggleFilterForm = this.toggleFilterForm.bind(this);
        this.filterDates = this.filterDates.bind(this);
        this.cancelDateFilter = this.cancelDateFilter.bind(this);
        this.toggleDateFilter = this.toggleDateFilter.bind(this);
        this.onEndReached = this.onEndReached.bind(this);
    }
    
    dbRecords = new DbRecords();
    dbTasks = new DbTasks();
    paging = 10;
    
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        this.loadToolbar();

        //listen to navigation emitter
        this.navigatorEmitter = new NativeEventEmitter();
        this.navigatorSubscription = this.navigatorEmitter.addListener('navigate', this.navigate);

        //get initial list of events
        this.setState({tasks:this.dbTasks.GetList()});
        this.getEvents();
    }

    componentWillUnmount(){
        //remove all listeners
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
        this.navigatorSubscription.remove();
    }

    hardwareBackPress() {
        global.navigate(this, 'Overview');
        global.refreshOverview();
        return true;
    }

    navigate(screen, props, prevScreen){
        if(screen == 'Events' && prevScreen != screen){
            this.updateScreen();
        }
    }

    // Load Toolbar ////////////////////////////////////////////////////////////////////////////////////////////////////

    loadToolbar(){
        global.updateToolbar({
            ...this.props, 
            screen:'Events',
            buttonAdd:true, 
            buttonRecord:true, 
            bottomFade:true, 
            hasTasks:true, 
            hasRecords:true,
            footerMessage: ''
        });
    }

    // Update Screen after Navigation ///////////////////////////////////

    updateScreen(){
        this.loadToolbar();
        this.setState({events:[], start:0, nomore:false, refreshing:false}, 
        () => {
            this.getEvents(() => {
                //after reloading events, refresh flat list
                this.setState({refresh:this.state.refresh+1});
            });
        });
    }

    // Get Records from Database ///////////////////////////////////

    getEvents(callback){
        //get events from database
        if(this.state.nomore == true || this.state.refreshing == true){return;}
        this.setState({refreshing:true});
        let records = this.dbRecords.GetList({
            start:this.state.start, 
            length:this.paging, 
            sorted:'datestart', 
            descending:true, 
            taskId:this.state.filter.taskId >= 0 ? this.state.filter.taskId : undefined,
            startDate: this.state.filter.datestart,
            endDate: this.state.filter.dateend
        });
        //detatch results from realm object
        var results = [];
        records.map(record => {
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
            results.push(rec);
        });
        
        this.setState({
            events:this.state.events.concat(results),
            nomore: results.length < this.paging, 
            start: this.state.start + this.paging
        }, 
        () => {
            this.setState({refreshing:false});
            if(typeof callback != 'undefined'){
                callback();
            }
        });
    }

    // Filter Form //////////////////////////////////////////////////

    toggleFilterForm = () => {
        this.setState({filterForm:!this.state.filterForm});
    }

    updateFilter = (filter) => {
        this.setState({filter:filter, events:[], start:0, nomore:false}, 
        () => {
            this.getEvents(() => {
                //after reloading events, refresh flat list
                this.setState({refresh:this.state.refresh+1});
            });
        });
    }

    // Filter Tasks /////////////////////////////////////////////////

    filterTasks = (value) => {
        let filter = this.state.filter;
        filter.taskId = value;
        this.updateFilter(filter);
    }

    // Filter Dates //////////////////////////////////////////////////

    toggleDateFilter = () => {
        this.setState({filterDates:!this.state.filterDates}, 
        () => {
            if(this.state.filterDates == true){
                //update filter with initial dates
                let dateend = new Date();
                let datestart = new Date((new Date()).setDate(dateend.getDate() - 1));
                this.filterDates(datestart, dateend);
            }
        });
    }

    cancelDateFilter = () => {
        this.toggleDateFilter();
        let filter = this.state.filter;
        filter.datestart = null;
        filter.dateend = null;
        this.updateFilter(filter);
    }

    filterDates = (datestart, dateend) => {
        let filter = this.state.filter;
        filter.datestart = datestart;
        filter.dateend = dateend;
        this.updateFilter(filter);
    }

    // Flat List Events ////////////////////////////////////////////

    onEndReached = () => {
        //append more events to end of list when user scrolls down to end of list
        this.getEvents();
    }

    render() {
        let today = new Date();
        today.setDate(today.getDate() + 10);
        let inputIndex = 0;
        let {height} = Dimensions.get('window');
        return (
            <Body {...this.props} style={this.styles.body} title="Events" noscroll={true} backButton={this.hardwareBackPress}
            titleBarButtons={
                <View style={this.styles.titlebarButtons}>
                    <ButtonSearch size="xsmall" color={AppStyles.headerTextColor} onPress={() => this.toggleFilterForm()}></ButtonSearch>
                </View>
            }>
                <Collapsible collapsed={!this.state.filterForm}>
                    <View style={this.styles.filterFormContainer}>
                        <Text style={this.styles.formLabel}>Filter by Task</Text>
                        <Picker 
                            selectedValue={this.state.filter.taskId}
                            onValueChange={(value) => this.filterTasks(value)}
                            items={[{key:'all', value:-1, label:'All Tasks'}].concat(
                                this.state.tasks.map(a => {return {key:'item'+a.id, label:a.name, value:a.id};})
                            )}
                        >
                        </Picker>
                        {this.state.filterDates == true && 
                            <View style={this.styles.filterDates}>
                                <Text style={this.styles.formLabel}>Filter by Date Range</Text>
                                <StartEndDateTimePicker 
                                    style={this.styles.filterDates}
                                    onChange={(datestart, dateend) => {this.filterDates(datestart, dateend)}}
                                    initialStartDateTime={new Date()}
                                    initialTimeSpan={24 * 60}
                                ></StartEndDateTimePicker>
                                <TextLink style={this.styles.clearDateFilter} onPress={() => this.cancelDateFilter()}>Clear Date Range Filter</TextLink>
                            </View>
                        }
                        {this.state.filterDates == false &&
                            <View style={this.styles.filterDates}>
                                <TextLink onPress={() => this.toggleDateFilter()}>Filter by Date Range</TextLink>
                            </View>
                        }
                    </View>
                </Collapsible>

                {this.state.filterForm && <DropShadow style={[this.styles.dropshadow]} opacity={0.075} height={20}></DropShadow>}
                        

                {this.state.loading ? 
                    <View style={[this.styles.loading, {paddingTop:(height / 2) - 100, paddingBottom:(height / 2) - 19}]}><Loading></Loading></View> : 
                    <FlatList
                        data={this.state.events}
                        keyExtractor={item => item.id.toString()}
                        onEndReached={() => this.onEndReached()}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={<View style={{height:90}}></View>}
                        extraData={this.state.refresh}
                        renderItem={
                            ({item}) => {
                                let items = [];
                                let inputs = [];
                                if(!DatesMatch(today, item.datestart)){
                                    //render date header
                                    today = new Date(item.datestart);
                                    let d1 = DayInYear(new Date());
                                    let d2 = DayInYear(today);
                                    items.push(
                                        <View key={'date_' + today.getMonth() + '_' + today.getDate()} style={this.styles.dateContainer}>
                                            <View style={{opacity:0.35}}><IconEvents size="xsmall" color={AppStyles.textColor} backgroundColor={AppStyles.altBackgroundColor}></IconEvents></View>
                                            <Text style={this.styles.dateName}>{DateSentence(today)}</Text>
                                            <Text style={this.styles.dateCount}>{d1 - d2}d</Text>
                                        </View>
                                    )
                                }
                    
                                //render inputs for item
                                for(let x = 0; x < item.inputs.length; x++){
                                    let input = item.inputs[x];
                                    let val = '';
                                    let extraStyles = {};
                                    inputIndex++;

                                    //get value for input
                                    switch(input.type){
                                        case 0: case 7: //number
                                            val = input.number;
                                            break;
                                        case 1: case 8: case 9: //text
                                            val = input.text;
                                            break;
                                        case 2: //date
                                            val = DateFormat(input.date, 'm/d/yyyy');
                                            break;
                                        case 3: //time
                                        val = DateFormat(input.date, 'h:MM:ss tt');
                                            break;
                                        case 4: //date & time
                                            val = DateFormat(input.date, 'm/d/yyyy @ h:MM:ss tt');
                                            break;
                                        case 6: //Yes/No
                                            val = input.number == 1 ? 'Yes' : 'No';
                                            break;
                                    }

                                    //get extra styling for input
                                    switch(input.type){
                                        case 7: case 9: // 5 stars, URL link
                                        extraStyles['width'] = '100%';
                                    }

                                    //render input
                                    switch(input.type){
                                        case 0: case 1: case 2: case 3: case 4: case 8: case 9:
                                            inputs.push(
                                                <View key={'input' + inputIndex} style={[this.styles.input, extraStyles]}>
                                                    <Text style={this.styles.inputText}>{input.input.name}: {val}</Text>
                                                </View>
                                            );
                                            break;
                                        case 6: //Yes/No
                                            inputs.push(
                                                <View key={'input' + inputIndex} style={[this.styles.input, extraStyles]}>
                                                    <CheckBox text={input.input.name} nonchecked={true} size="small" offsetTop={5} defaultValue={input.number == 1}/>
                                                </View>
                                            );
                                            break;
                                        case 7: // 5 stars
                                            inputs.push(
                                                <View key={'input' + inputIndex} style={[this.styles.input, extraStyles]}>
                                                    <FiveStars size="xxsmall" stars={input.number} color={AppStyles.starColor} locked={true}></FiveStars>
                                                </View>
                                            );
                                            break;

                                    }
                                    
                                }
                    
                                //render item
                                items.push(
                                    <View key={item.id}>
                                        <TouchableHighlight underlayColor={AppStyles.listItemPressedColor} 
                                            onPress={() => {
                                                global.navigate(this, 'RecordDetails', {
                                                    goback:'Events', 
                                                    gobackParams:{
                                                        filter:this.state.filter,
                                                        filterForm: this.state.filterForm,
                                                        filterDates: this.state.filterDates
                                                    }, 
                                                    recordId:item.id});
                                            }}
                                        >
                                            <View style={this.styles.eventItemContainer}>
                                                <Text style={this.styles.eventName}>{item.task.name}</Text>
                                                <View style={this.styles.inputs}>{inputs}</View>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                );
                                return items;
                            }
                        }
                    ></FlatList>
                }

                
            </Body>
        );
    }

    styles = StyleSheet.create({
        body:{position:'absolute', top:0, bottom:0, left:0, right:0},
        titlebarButtons:{paddingTop:15, paddingRight:15},
        dropshadow:{zIndex:10},
        loading:{width:'100%', flexDirection:'row', justifyContent:'center'},
    
        filterFormContainer:{padding:20},
        formLabel:{fontSize:15, opacity:0.75},
        clearDateFilter:{paddingTop:5},
        
        dateContainer:{flex:1, flexDirection:'row', justifyContent:'space-between', backgroundColor:AppStyles.altBackgroundColor, padding:10},
        dateName:{fontSize:18, fontWeight:'bold', alignSelf:'center'},
        dateCount:{alignSelf:'flex-end', opacity:0.65, fontSize:17},
    
        eventItemContainer:{paddingHorizontal:15, paddingTop:13, paddingBottom:10, borderBottomWidth:1, borderBottomColor:AppStyles.altBackgroundColor},
        eventName:{fontSize:22},
        
        inputs:{flex:1, flexDirection:'row', flexWrap:'wrap'},
        input:{alignSelf:'flex-start', paddingRight:20, paddingVertical:3},
        inputText:{fontSize:18, color:AppStyles.textColor, opacity:0.7}
    });
}