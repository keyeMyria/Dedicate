import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight, BackHandler, FlatList, Picker } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
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

export default class EventsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            tasks: this.dbTasks.GetList(),
            start:0,
            refreshing: false,
            nomore: false, //no more records to load
            refresh:0,
            filterForm:false, //toggle filter form
            filterDates:false,
            filter:{
                taskId:-1,
                datestart:null,
                dateend:null
            }
        };

        //bind events
        this.hardwareBackPress = this.hardwareBackPress.bind(this);

    }
    
    dbRecords = new DbRecords();
    dbTasks = new DbTasks();
    paging = 10;
    
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);

        //get initial list of events
        this.getEvents();
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        this.props.navigation.navigate('Overview');
        return true;
    }

    // Get Records from Database ///////////////////////////////////

    getEvents = (callback) => {
        //get events from database
        if(this.state.nomore == true){return;}
        this.setState({refreshing:true});
        var results = this.dbRecords.GetList({
            start:this.state.start, 
            length:this.paging, 
            sorted:'datestart', 
            descending:true, 
            taskId:this.state.filter.taskId >= 0 ? this.state.filter.taskId : undefined,
            startDate: this.state.filter.datestart,
            endDate: this.state.filter.dateend
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
        var filter = this.state.filter;
        filter.taskId = value;
        this.updateFilter(filter);
    }

    // Filter Dates //////////////////////////////////////////////////

    toggleDateFilter = () => {
        this.setState({filterDates:!this.state.filterDates}, 
        () => {
            if(this.state.filterDates == true){
                //update filter with initial dates
                var dateend = new Date();
                var datestart = new Date((new Date()).setDate(dateend.getDate() - 1));
                this.filterDates(datestart, dateend);
            }
        });
    }

    cancelDateFilter = () => {
        this.toggleDateFilter();
        var filter = this.state.filter;
        filter.datestart = null;
        filter.dateend = null;
        this.updateFilter(filter);
    }

    filterDates = (datestart, dateend) => {
        var filter = this.state.filter;
        filter.datestart = datestart;
        filter.dateend = dateend;
        console.warn(JSON.stringify(filter, null, 4));
        this.updateFilter(filter);
    }

    // Flat List Events ////////////////////////////////////////////

    onEndReached = () => {
        //append more events to end of list when user scrolls down to end of list
        this.getEvents();
    }

    render() {
        var that = this;
        var today = new Date();
        today.setDate(today.getDate() + 10);
        var inputIndex = 0;
        return (
            <Body {...this.props} style={styles.body} title="Events" screen="Events" buttonAdd={true} buttonRecord={true} noscroll={true} bottomFade={true}
            titleBarButtons={
                <View style={styles.titlebarButtons}>
                    <ButtonSearch size="xsmall" onPress={() => this.toggleFilterForm.call(that)}></ButtonSearch>
                </View>
            }>
                <Collapsible collapsed={!this.state.filterForm}>
                    <View style={styles.filterFormContainer}>
                        <Text style={styles.formLabel}>Filter by Task</Text>
                        <Picker 
                            selectedValue={this.state.filter.taskId}
                            onValueChange={(value) => this.filterTasks.call(that, value)}
                        >
                            <Picker.Item key="all" label="All Tasks" value={-1}></Picker.Item>
                            {this.state.tasks.map(a => 
                                <Picker.Item key={'item'+a.id} label={a.name} value={a.id}></Picker.Item>
                            )}
                        </Picker>
                        {this.state.filterDates == true && 
                            <View style={styles.filterDates}>
                                <Text style={styles.formLabel}>Filter by Date Range</Text>
                                <StartEndDateTimePicker 
                                    style={styles.filterDates}
                                    onChange={(datestart, dateend) => {this.filterDates.call(that, datestart, dateend)}}
                                    initialStartDateTime={new Date()}
                                    initialTimeSpan={24 * 60}
                                ></StartEndDateTimePicker>
                                <TextLink style={styles.clearDateFilter} onPress={() => this.cancelDateFilter.call(that)}>Clear Date Range Filter</TextLink>
                            </View>
                        }
                        {this.state.filterDates == false &&
                            <View style={styles.filterDates}>
                                <TextLink onPress={() => this.toggleDateFilter.call(that)}>Filter by Date Range</TextLink>
                            </View>
                        }
                    </View>
                </Collapsible>

                {this.state.filterForm && <DropShadow style={[styles.dropshadow]} opacity={0.075} height={20}></DropShadow>}

                <FlatList
                    data={this.state.events}
                    keyExtractor={item => item.id.toString()}
                    onEndReached={() => this.onEndReached.call(that)}
                    onEndReachedThreshold={0.2}
                    refreshing={this.state.refreshing}
                    ListFooterComponent={<View style={{height:60}}></View>}
                    extraData={this.state.refresh}
                    renderItem={
                        ({item}) => {
                            var items = [];
                            var inputs = [];
                            if(!DatesMatch(today, item.datestart)){
                                //render date header
                                today = new Date(item.datestart);
                                var d1 = DayInYear(new Date());
                                var d2 = DayInYear(today);
                                items.push(
                                    <View key={'date_' + today.getMonth() + '_' + today.getDate()} style={styles.dateContainer}>
                                        <Text style={[styles.dateCount, {opacity:0}]}>{d1 - d2}d</Text>
                                        <Text style={styles.dateName}>{DateSentence(today)}</Text>
                                        <Text style={styles.dateCount}>{d1 - d2}d</Text>
                                    </View>
                                )
                            }
                
                            //render inputs for item
                            for(var x = 0; x < item.inputs.length; x++){
                                var input = item.inputs[x];
                                var val = '';
                                inputIndex++;
                                switch(input.type){
                                    case 0: //number
                                        val = input.number;
                                        break;
                                    case 1: //text
                                        val = input.text;
                                        break;
                                    case 2: //date
                                        val = DateFormat(input.date, 'm/d/yyyy');
                                        break;
                                    case 3: //time
                                    val = DateFormat(input.date, 'h:mm:ss tt');
                                        break;
                                    case 4: //date & time
                                        val = DateFormat(input.date, 'm/d/yyyy h:mm:ss tt');
                                        break;
                                    case 6: //Yes/No
                                        val = input.number == 1 ? 'Yes' : 'No';
                                }
                                inputs.push(
                                    <View key={'input' + inputIndex} style={styles.input}>
                                        <Text style={styles.inputText}>{input.input.name}: {val}</Text>
                                    </View>
                                );
                            }
                
                            //render item
                            items.push(
                                <View key={item.id}>
                                    <TouchableHighlight underlayColor={AppStyles.listItemPressedColor} onPress={() => {this.props.navigation.navigate('Event', {eventId:item.id})}}>
                                        <View style={styles.eventItemContainer}>
                                            <Text style={styles.eventName}>{item.task.name}</Text>
                                            <View style={styles.inputs}>{inputs}</View>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            );
                            return items;
                        }
                    }
                ></FlatList>
            </Body>
        );
    }
}

const styles = StyleSheet.create({
    body:{position:'absolute', top:0, bottom:0, left:0, right:0},
    titlebarButtons:{paddingTop:15, paddingRight:15},
    dropshadow:{zIndex:10},

    filterFormContainer:{padding:20},
    formLabel:{fontSize:15, opacity:0.75},
    clearDateFilter:{paddingTop:5},
    
    dateContainer:{flex:1, flexDirection:'row', justifyContent:'space-between', backgroundColor:AppStyles.altBackgroundColor, padding:10},
    dateName:{fontSize:18, fontWeight:'bold', alignSelf:'center'},
    dateCount:{alignSelf:'flex-end', opacity:0.5, fontSize:17},

    eventItemContainer:{paddingHorizontal:30, paddingTop:10, paddingBottom:5, borderBottomWidth:1, borderBottomColor:AppStyles.altBackgroundColor},
    eventName:{fontSize:22},
    
    inputs:{flex:1, flexDirection:'row', flexWrap:'wrap'},
    input:{alignSelf:'flex-start', paddingRight:20, paddingTop:5, paddingBottom:5},
    inputText:{fontSize:17, color:AppStyles.color}
});