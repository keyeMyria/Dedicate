import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ButtonOutline from 'buttons/ButtonOutline';

export default class Timer extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            time: '00:00',
            interval:null
        }
    }

    componentWillMount(){
        //start timer
        var that = this;
        this.setState({interval:setInterval(() => this.updateCounter.call(that), 1000 / 30)});
    }

    componentWillUnmount(){
        clearInterval(this.state.interval);
    }

    updateCounter(){
        var ms = new Date() - this.props.startDate;
        var seconds = ms / 1000;
        var modMs = Math.floor(ms % 1000);
        var modSecs = Math.floor(seconds % 60);
        var modMins = Math.floor((seconds / 60) % 60);
        var modHours = Math.floor((seconds / 3600) % 24);
        var modDays = Math.floor(seconds / 86400);
        var time = 
            (modDays > 0 ? modDays + ':' : '') + 
            (modDays > 0 || modHours > 0 ? ('0' + modHours).slice(-2) + ':' : '') + 
            (modDays > 0 || modHours > 0 || modMins > 0 ? ('0' + modMins).slice(-2) + ':' : '') + 
            ('0' + modSecs).slice(-2) + ':' + ('00' + modMs.toString()).slice(-3).slice(0,2);

        this.setState({time:time});
        return ms;
    }

    onStop(){
        this.updateCounter();
        clearInterval(this.state.interval);
        this.setState({interval:null});
        if(typeof this.props.onStop != 'undefined'){
            this.props.onStop(this.props.startDate, new Date());
        }
    }

    render(){
        var that = this;
        return(
            <View style={styles.container}>
                <Text style={styles.timer}>{this.state.time}</Text>
                {this.state.interval != null && <ButtonOutline text="Stop" onPress={() => this.onStop.call(that)} />}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{flexDirection:'row'},
    timer:{fontSize:20, paddingRight:15, paddingTop:6}
});