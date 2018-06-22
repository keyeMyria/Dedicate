import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableHighlight, BackHandler } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import DbRecords from 'db/DbRecords';
import DatesMatch from 'utility/DatesMatch';
import DateFormat from 'utility/DateFormat';
import DateSentence from 'utility/DateSentence';

export default class EventsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: this.dbRecords.GetList({length:25, sorted:'datestart', descending:true})
        };

        //bind events
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        //console.warn(JSON.stringify(this.state.events.map(a => {return {name:a.task.name, id:a.id, date:a.datestart};}), null, 4));
    }
    
    dbRecords = new DbRecords();
    
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        this.props.navigation.navigate('Overview');
        return true;
    }

    render() {
        var today = new Date();
        today.setDate(today.getDate() + 10);
        var eventlist = this.state.events.map((event) => {
            var items = [];
            if(!DatesMatch(today, event.datestart)){
                today = new Date(event.datestart);
                items.push(
                    <View key={'date_' + today.getMonth() + '_' + today.getDate()} style={styles.dateContainer}>
                        <Text style={styles.dateName}>{DateSentence(today)}</Text>
                    </View>
                )
            }

            items.push(
                <TouchableHighlight key={event.id} underlayColor={AppStyles.listItemPressedColor} onPress={() => {this.props.navigation.navigate('Event', {eventId:event.id})}}>
                    <View style={styles.eventItemContainer}>
                        <Text style={styles.eventName}>{event.task.name}</Text>
                    </View>
                </TouchableHighlight>
            );
            return items;
        });
        return (
            <Body {...this.props} style={styles.body} title="Events" screen="Events" buttonAdd={true} buttonRecord={true}>
                <ScrollView>
                    {eventlist}
                </ScrollView>
            </Body>
        );
    }
}

const styles = StyleSheet.create({
    body:{position:'absolute', top:0, bottom:0, left:0, right:0},
    eventListContainer:{top:0, bottom:0, left:0, right:0},
    
    dateContainer:{backgroundColor:AppStyles.altBackgroundColor, padding:10},
    dateName:{fontSize:18, fontWeight:'bold', textAlign:'center'},

    eventItemContainer:{paddingHorizontal:30, paddingVertical:15, borderBottomWidth:1, borderBottomColor:AppStyles.altBackgroundColor},
    eventName:{fontSize:20},
    
});