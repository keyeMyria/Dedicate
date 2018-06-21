import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableHighlight, BackHandler } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import DbRecords from 'db/DbRecords';

export default class EventsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: this.dbRecords.GetList({length:25})
        };

        //bind events
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
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
        var eventlist = this.state.events.map((event) => {
            return (
                <TouchableHighlight key={event.id} underlayColor={AppStyles.listItemPressedColor} onPress={() => {this.props.navigation.navigate('Event', {eventId:event.id})}}>
                    <View style={styles.eventItemContainer}>
                        <Text style={styles.eventName}>{event.task.name}</Text>
                    </View>
                </TouchableHighlight>
            );
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
    eventItemContainer:{paddingHorizontal:30, paddingVertical:15, borderBottomWidth:1, borderBottomColor:AppStyles.altBackgroundColor},
    eventName:{fontSize:20},
});