import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import Text from 'ui/Text';
import AppLang from 'dedicate/AppLang';
import DateTimePicker from 'fields/DateTimePicker'

export default class StartEndDateTimePicker extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            datestart: new Date(), 
            dateend: new Date(),
            changedDateEnd: false
        }
    }

    appLang = new AppLang();

    componentWillMount() {
        //set up initial start & end dates
        var datestart = this.state.datestart;
        var dateend = this.state.dateend;
        if(typeof this.props.initialStartDateTime != 'undefined'){
            datestart = this.props.initialStartDateTime;
        }
        if(typeof this.props.initialTimeSpan != 'undefined' && this.props.initialTimeSpan > 0){
            dateend = new Date((new Date(this.state.dateend)).setMinutes(this.state.dateend.getMinutes() + this.props.initialTimeSpan));
        }
        this.setState({datestart:datestart, dateend:dateend});
    }

    onRecordedDateStartChange = (date) => {
        if(this.state.changedDateEnd == true){
            if(this.state.dateend < date){
                Alert.alert("Date Range Error", "Your starting date must use a date that comes before your ending date.");
                this.setState({dateend:this.state.dateend});
                return;
            }
        }
        this.setState({datestart:date}, () => {
            var dateend = this.state.dateend;
            if(this.state.changedDateEnd == false){
                //also change end date
                if(typeof this.props.initialTimeSpan != 'undefined' && this.props.initialTimeSpan > 0){
                    dateend = new Date((new Date(date)).setMinutes(date.getMinutes() + this.props.initialTimeSpan));
                }else{
                    dateend = date;
                }
                this.setState({dateend:dateend});
            }
            if(typeof this.props.onChange != 'undefined'){
                this.props.onChange(this.state.datestart, dateend);
            }
        });
    }

    onRecordedDateEndChange = (date) => {
        if(this.state.datestart > date){
            Alert.alert("Date Range Error", "Your ending date must use a date that comes after your starting date.");
            this.setState({datestart:this.state.datestart});
            return;
        }
        this.setState({dateend:date, changedDateEnd:true}, () => {
            if(typeof this.props.onChange != 'undefined'){
                this.props.onChange(this.state.datestart, date);
            }
        });
    }

    render(){
        var that = this;
        return (
            <View style={this.props.style || {}}>
                <View style={styles.recordTimeFlex}>
                    <View style={styles.recordTimeLabel}>
                        <Text>Start:</Text>
                    </View>
                    <View style={styles.recordTimePicker}>
                        <DateTimePicker
                            styleTextbox={{minWidth:220}}
                            date={this.state.datestart}
                            type="datetime"
                            placeholder="Date & Time"
                            format={this.appLang.timeFormat}
                            buttonConfirmText="Select Date & Time"
                            buttonCancelText="Cancel"
                            onDateChange={(time, date) => {this.onRecordedDateStartChange.call(that, date)}}
                        />
                    </View>
                </View>

                <View style={styles.recordTimeFlex}>
                    <View style={styles.recordTimeLabel}>
                        <Text>End:</Text>
                    </View>
                    <View style={styles.recordTimePicker}>
                        <DateTimePicker
                            styleTextbox={{minWidth:220}}
                            date={this.state.dateend}
                            type="datetime"
                            placeholder="Date & Time"
                            format={this.appLang.timeFormat}
                            buttonConfirmText="Select Date & Time"
                            buttonCancelText="Cancel"
                            onDateChange={(time, date) => {this.onRecordedDateEndChange.call(that, date)}}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({

    //Record Task form
    recordTimeFlex:{flexDirection:'row', paddingTop:10},
    recordTimeLabel:{alignSelf:'flex-start', width:35, paddingTop:17},
    recordTimePicker:{alignSelf:'flex-start', paddingLeft:10},
});