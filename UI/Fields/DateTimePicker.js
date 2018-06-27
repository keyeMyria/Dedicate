import React from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import DatePicker from 'react-native-datepicker'
import Textbox from 'fields/Textbox';

export default class DateTimePicker extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            date: this.props.date,
            datestring:this.getDateString(this.props.date),
            location: {
                latitude: 28.040990,
                longitude: -82.693947,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        
        }
    }

    getDateString = (d) => {
        var hour = d.getHours() % 12;
        hour = hour < 1 ? 12 : hour;
        return (this.props.type.indexOf('date') >= 0 ? ((d.getMonth()+1) + '/' + d.getDate() + '/' + d.getFullYear()) + ' ' : '') +
                (this.props.type.indexOf('date') >= 0 && this.props.type.indexOf('time') >= 0 ? '@ ' : '') +
        (this.props.type.indexOf('time') >= 0 ? 
            (hour + ':' + ('0' + d.getMinutes()).slice(-2) + ':' + ('0' + d.getSeconds()).slice(-2)
            + ' ' + (d.getHours() >= 12 ? 'pm' : 'am')) : '');
    }

    onDateChange = (...args) => { //args = time, date
        this.setState({
            date:args[1],
            datestring:this.getDateString(args[1])
        });
        if(typeof this.props.onDateChange != 'undefined'){
            this.props.onDateChange(...args);
        }
    }

    onTextboxFocus = () => {
        Keyboard.dismiss();
        this.refs['datepicker'].onPressDate();
    }

    componentWillReceiveProps = (props) => {
        if(this.state.date != props.date){
            this.setState({
                date:props.date,
                datestring:this.getDateString(props.date)
            });
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.column_one}>
                    <DatePicker
                        ref="datepicker"
                        style={this.props.style}
                        date={this.props.date}
                        mode={this.props.type}
                        placeholder={this.props.placeholder}
                        format={this.props.format}
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        confirmBtnText={this.props.buttonConfirmText}
                        cancelBtnText={this.props.buttonCancelText}
                        customStyles={{
                            dateIcon: { position: 'absolute', left: 0, top: 4, marginLeft: 0 },
                            dateInput: { display:'none' },
                            datePicker: {backgroundColor:'#000' }
                        }}
                        onDateChange={this.onDateChange}
                        />
                </View>
                <View style={styles.column_two}>
                    <Textbox 
                        ref="textbox"
                        onFocus={this.onTextboxFocus}
                        style={[styles.textbox, this.props.styleTextbox]} 
                        placeholder={this.props.placeholder} 
                        value={this.state.datestring}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{flexDirection:'row'},
    column_one:{paddingTop:9, width:40, overflow:'hidden'},
    column_two:{},
    textbox:{fontSize:17, minWidth:100}
});