import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from 'ui/Text';
import AppStyles from 'dedicate/AppStyles';
import {Svg, Path} from 'react-native-svg';
import ButtonOutline from 'buttons/ButtonOutline';
export default class StopWatch extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            color: this.props.color ? this.props.color : AppStyles.stopWatchColor,
            started:this.props.dateStart || null,
            ended:null,
            total:0,
            time:'00:00',
            timeTips:'        sec        ms',
            buttonTitle:'Start',
            interval:null
        }
    }

    componentWillMount(){
        var that = this;
        if(this.state.started != null){
            this.setState({
                buttonTitle:'Stop',
                total:0
            }, ()=> {
                this.setState({
                    interval:setInterval(() => this.updateCounter.call(that), 1000 / 30)
                });
            });
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.interval);
    }

    onPressCounterButton = () => {
        var that = this;
        if(this.state.interval != null){
            //stop
            var ms = this.updateCounter(true);
            clearInterval(this.state.interval);
            this.setState({
                ended:new Date(),
                buttonTitle:'Start',
                interval:null
            });
            if(this.props.onStop){
                var dateend = new Date();
                dateend.setTime(ms + this.state.started.getTime());
                this.props.onStop(this.state.started, dateend, this.state.total);
            }
        }else{
            //start
            this.setState({
                started:new Date(),
                buttonTitle:'Stop',
                total:0
            }, ()=> {
                this.setState({
                    interval:setInterval(() => this.updateCounter.call(that), 1000 / 30)
                });
                if(this.props.onStart){
                    this.props.onStart(this.state.started);
                }
            });
        }
        
    }

    updateCounter(saveTotal){
        var ms = this.state.total + (new Date() - this.state.started);
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
        var timeTips = 
            (modDays > 0 ? 'days  ' : '') + 
            (modDays > 0 || modHours > 0 ? '    hours' : '') + 
            (modDays > 0 || modHours > 0 || modMins > 0 ? '      mins' : '') + 
            '       sec       ms';
        
        this.setState({time:time, timeTips:timeTips});
        if(saveTotal === true){
            this.setState({total:ms});
        }
        return ms;
    }

    render(){
        return (
            <View style={[styles.container, {width:this.props.width, height:this.props.height}]}>
                <View style={styles.clockContainer}>
                    <Svg viewBox="0 0 512 512" width={this.props.width} height={this.props.height} preserveAspectRatio="true">
                        <Path d="m6.75 198.65q-0.35 0.45-0.9 2.85t-0.75 3l13 0.4-11.35-6.25m-4.75 27.35q-0.3 0.45-0.55 2.95-0.3 2.45-0.45 3.05l13-1-12-5m20.45-74.5q-0.4 0.35-1.35 2.65-1.05 2.25-1.4 2.8l12.7 2.9-9.95-8.35m-8.8 22.7q-0.4 0.4-1.2 2.8-0.75 2.35-1 2.9l12.9 1.7-10.7-7.4m24.4-52.5q-1.3 2.2-2.6 4.3-1.25 2.2-2.5 4.35l43.85 20.05-38.75-28.7m22.7-10.85l-7.8-10.45q-0.45 0.25-1.95 2.3-1.5 1.95-1.95 2.35l11.7 5.8m10.3-31.5q-0.55 0.2-2.2 2-1.75 1.75-2.2 2.15l10.95 7-6.55-11.15m23.85-5.65l-5.4-11.9q-0.55 0.15-2.5 1.85-1.85 1.65-2.3 1.95l10.2 8.1m13.8-26.9q-0.55 0.05-2.6 1.6-2.05 1.35-2.6 1.65l9.45 9-4.25-12.25m25.7-16.05q-2.15 1.15-4.35 2.35-2.15 1.25-4.35 2.55l28 39.25-19.3-44.15m25.95 1.55l-1.45-12.9q-0.5-0.05-2.85 0.9-2.3 0.95-2.85 1.1l7.15 10.9m24.8-22.05q-0.6-0.1-2.95 0.6-2.4 0.7-2.95 0.8l5.95 11.55-0.05-12.95m48.85-9.15q-0.45-0.25-2.95 0.05-2.45 0.2-3.1 0.2l3.6 12.5 2.45-12.75m-24.15 3.3q-0.55-0.15-3.05 0.35-2.4 0.45-3 0.5l4.8 12.1 1.25-12.95m46.15 43.6l5-47.95q-2.5-0.05-5-0.05t-5 0.05l5 47.95m-182.3 369.1l-11.9 5.4q0.15 0.55 1.85 2.5 1.65 1.85 1.95 2.3l8.1-10.2m-26.9-13.8q0.05 0.55 1.6 2.6 1.35 2.05 1.65 2.6l9-9.45-12.25 4.25m74.9 70.65q2.2 1.3 4.3 2.6 2.2 1.25 4.35 2.5l20.05-43.85-28.7 38.75m29.8 15.6q0.35 0.4 2.65 1.35 2.25 1.05 2.8 1.4l2.9-12.7-8.35 9.95m-40.65-38.3l-10.45 7.8q0.25 0.45 2.3 1.95 1.95 1.5 2.35 1.95l5.8-11.7m-27.35-5.9l7-10.95-11.15 6.55q0.2 0.55 2 2.2 1.75 1.75 2.15 2.2m90.7 53q0.4 0.4 2.8 1.2 2.35 0.75 2.9 1l1.7-12.9-7.4 10.7m24.45 6.9q0.45 0.35 2.85 0.9t3 0.75l0.4-13-6.25 11.35m27.35 4.75q0.45 0.3 2.95 0.55 2.45 0.3 3.05 0.45l-1-13-5 12m-195.25-132.4q1.15 2.15 2.35 4.35 1.25 2.15 2.55 4.35l39.25-28-44.15 19.3m1.55-25.95l-12.9 1.45q-0.05 0.5 0.9 2.85 0.95 2.3 1.1 2.85l10.9-7.15m-22.05-24.8q-0.1 0.6 0.6 2.95 0.7 2.4 0.8 2.95l11.55-5.95-12.95 0.05m-5.85-24.7q-0.15 0.55 0.35 3.05 0.45 2.4 0.5 3l12.1-4.8-12.95-1.25m-3.3-24.15q-0.25 0.45 0.05 2.95 0.2 2.45 0.2 3.1l12.5-3.6-12.75-2.45m-1.05-27q-0.05 2.5-0.05 5t0.05 5l47.95-5-47.95-5m326.8 250.75q0.6 0.1 2.95-0.6 2.4-0.7 2.95-0.8l-5.95-11.55 0.05 12.95m50.75-20.5q2.15-1.15 4.35-2.35 2.15-1.25 4.35-2.55l-28-39.25 19.3 44.15m-25.95-1.55l1.45 12.9q0.5 0.05 2.85-0.9 2.3-0.95 2.85-1.1l-7.15-10.9m70.85-29.5q0.55-0.15 2.5-1.85 1.85-1.65 2.3-1.95l-10.2-8.1 5.4 11.9m-16.6 13.4q2.05-1.35 2.6-1.65l-9.45-9 4.25 12.25q0.55-0.05 2.6-1.6m35.05-30.95q0.55-0.2 2.2-2 1.75-1.75 2.2-2.15l-10.95-7 6.55 11.15m10.3-31.5l7.8 10.45q0.45-0.25 1.95-2.3 1.5-1.95 1.95-2.35l-11.7-5.8m-173.25 109.75q0.45 0.25 2.95-0.05 2.45-0.2 3.1-0.2l-3.6-12.5-2.45 12.75m-27 1.05q2.5 0.05 5 0.05t5-0.05l-5-47.95-5 47.95m51.15-4.35q0.55 0.15 3.05-0.35 2.4-0.45 3-0.5l-4.8-12.1-1.25 12.95m187.4-147.1q0.4-0.35 1.35-2.65 1.05-2.25 1.4-2.8l-12.7-2.9 9.95 8.35m8.8-22.7q0.4-0.4 1.2-2.8 0.75-2.35 1-2.9l-12.9-1.7 10.7 7.4m6.9-24.45q0.35-0.45 0.9-2.85t0.75-3l-13-0.4 11.35 6.25m4.75-27.35q0.3-0.45 0.55-2.95 0.3-2.45 0.45-3.05l-13 1 12 5m-36.05 104.3q1.3-2.2 2.6-4.3 1.25-2.2 2.5-4.35l-43.85-20.05 38.75 28.7m36.95-156.3q0.25-0.45-0.05-2.95-0.2-2.45-0.2-3.1l-12.5 3.6 12.75 2.45m-3.3-24.15q0.15-0.55-0.35-3.05-0.45-2.4-0.5-3l-12.1 4.8 12.95 1.25m-5.85-24.7q0.1-0.6-0.6-2.95-0.7-2.4-0.8-2.95l-11.55 5.95 12.95-0.05m-9.15-26.25q0.05-0.5-0.9-2.85-0.95-2.3-1.1-2.85l-10.9 7.15 12.9-1.45m-27.4-50.2q-0.05-0.55-1.6-2.6-1.35-2.05-1.65-2.6l-9 9.45 12.25-4.25m-15-19.2q-0.15-0.55-1.85-2.5-1.65-1.85-1.95-2.3l-8.1 10.2 11.9-5.4m-17.55-18.45q-0.2-0.55-2-2.2-1.75-1.75-2.15-2.2l-7 10.95 11.15-6.55m-21.05-18.1q-0.25-0.45-2.3-1.95-1.95-1.5-2.35-1.95l-5.8 11.7 10.45-7.8m-51.1-30.5q-0.35-0.4-2.65-1.35-2.25-1.05-2.8-1.4l-2.9 12.7 8.35-9.95m-80.5-21.45l1 13 5-12q-0.45-0.3-2.95-0.55-2.45-0.3-3.05-0.45m33.35 5.75q-0.45-0.35-2.85-0.9t-3-0.75l-0.4 13 6.25-11.35m24.45 6.9q-0.4-0.4-2.8-1.2-2.35-0.75-2.9-1l-1.7 12.9 7.4-10.7m48.2 21.8q-2.2-1.25-4.35-2.5l-20.05 43.85 28.7-38.75q-2.2-1.3-4.3-2.6m92.9 94.6q-1.25-2.15-2.55-4.35l-39.25 28 44.15-19.3q-1.15-2.15-2.35-4.35m33.05 130.95q0.05-2.5 0.05-5t-0.05-5l-47.95 5 47.95 5z"
                            fill={this.state.color}/>
                    </Svg>
                </View>
                <View style={[styles.centerpiece, {top:(this.props.height / 2) - 30}]}>
                    <Text style={styles.stopWatchCounter}>{this.state.time}</Text>
                    <Text style={styles.stopWatchTips}>{this.state.timeTips}</Text>
                    <ButtonOutline text={this.state.buttonTitle} onPress={this.onPressCounterButton} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{},
    clockContainer:{position:'absolute'},
    centerpiece:{position:'absolute', alignSelf:'center', alignItems:'center'},
    stopWatchCounter:{fontSize:30},
    stopWatchTips:{fontSize:12, color:'#aaa', paddingBottom:10, paddingRight:15, alignSelf:'flex-end' }
});