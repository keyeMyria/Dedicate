import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, BackHandler } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import TouchableBox from 'ui/Touchable/Box';
import DbTasks from 'db/DbTasks';
import DbRecords from 'db/DbRecords';
import {Svg, Polyline, Circle} from 'react-native-svg';
import DatesMatch from 'utility/DatesMatch';
import Files from 'react-native-fs';

export default class OverviewScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            styles: stylesLandscape,
            ...this.dbState()
        };
        //bind events
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        BackHandler.exitApp();
        return true;
    }

    componentDidMount() { 
        this.onLayoutChange();
    }

    dbState(){ //updates state from database
        var dbTasks = new DbTasks();
        var dbRecords = new DbRecords();

        return {
            totalTasks:dbTasks.TotalTasks(),
            totalRecords:dbRecords.TotalRecords(),
            hasTask:dbTasks.HasTasks(),
            charts:dbRecords.GetListByTask()
        };
    }

    // Screen Orientation changes
    onLayoutChange = event => {
        var {height, width} = Dimensions.get('window');
        if(width > height){
            //landscape
            this.setState({styles: stylesLandscape});
        }else{
            //portrait
            this.setState({styles: stylesPortrait});
        }
    }

    getCharts = () => {
        var items = [];
        var {height, width} = Dimensions.get('window');
        var maxCharts = 6;
        for(var x = 0; x < (this.state.charts.length < maxCharts ? this.state.charts.length : maxCharts); x++){
            var chart = this.state.charts[x];
            if(chart.name != ''){
                items.push(this.chartItem(chart, width));
            }
            if(x < this.state.charts.length - 1){
                items.push(<View key={'sep' + x} style={styles.separator}></View>);
            }
        }
        return items;
    }

    //render 14 day chart
    chartItem = (chart, width) => {
        var line1 = (<View></View>);
        var line1Min = "";
        var line1Max = "";
        var line2 = (<View></View>);
        var line2Min = "";
        var line2Max = "";
        var dots = (<View></View>);

        //get lines and dots for chart
        var curr = 1;
        var hasdots = false;
        var cwidth = width - 40;
        var height = 60;
        var days = 14;
        var record = chart.records[chart.records.length - 1];

        for(var x = 0; x < record.inputs.length; x++){
            var input = record.inputs[x];
            if(input.type === 0){ //number
                var info = this.chartPoints(chart, x, days);
                if(curr == 1){
                    line1 = (
                        <Svg width={cwidth} height={height + 20}>
                            {this.chartLine(info.points, days, cwidth, height, info.min, info.max, AppStyles.chartLine1Stroke)}
                        </Svg>
                    );
                    line1Min = info.min;
                    line1Max = info.max;
                    curr++;
                }else if(curr == 2){
                    line2 = (
                        <Svg width={cwidth} height={height + 20}>
                            {this.chartLine(info.points, days, cwidth, height, info.min, info.max, AppStyles.chartLine2Stroke)}
                        </Svg>
                    );
                    line2Min = info.min;
                    line2Max = info.max;
                    curr++;
                }
            }else if(input.type == 6 && hasdots == false){ //yes/no
                hasdots = true;
                dots = (
                    <Svg width={cwidth} height={height + 20}>
                        {this.chartDots(chart, x, days, cwidth, height)}
                    </Svg>
                );
            }
        }

        return (
            <View key={chart.id} style={styles.chartContainer}>
                <View style={styles.chartArea}>
                    <View style={styles.chartLine1MinMax}>
                        <Text style={styles.chartLabel}>{line1Max}</Text>
                        <Text style={[styles.chartLabel, styles.chartLine1Min]}>{line1Min}</Text>
                    </View>
                    <View style={styles.chartLine2MinMax}>
                        <Text style={styles.chartLabel}>{line2Max}</Text>
                        <Text style={[styles.chartLabel, styles.chartLine2Min]}>{line2Min}</Text>
                    </View>
                    <View style={[styles.chartLine2, styles.chart]}>
                        {line2}
                    </View>
                    <View style={[styles.chartLine1, styles.chart]}>
                        {line1}
                    </View>
                    <View style={[styles.chartDots, styles.chart]}>
                        {dots}
                    </View>
                    <Text style={styles.chartName}>{chart.name}</Text>
                </View>
            </View>
        );
    }

    chartPoints = (chart, index, days) => {
        var min = 999999;
        var max = 0;
        var points = [];

        //get totals for each day
        for(var x = 0; x < days; x++){
            var count = 0;
            var date = new Date();
            date = new Date(date.setDate(date.getDate() - (days - 1 - x)));
            for(var y = 0; y < chart.records.length; y++){
                var rec = chart.records[y];
                if(DatesMatch(date, new Date(rec.datestart))){
                    if(rec.inputs.length > index){
                        if(rec.inputs[index].number != null){
                            count += rec.inputs[index].number;
                        }
                    }
                }
            }
            points.push(count);
        }

        //check totals for min & max
        for(var x = 1; x < points.length; x++){
            if(points[x] < min){ min = points[x];}
            if(points[x] > max){ max = points[x];}
        }

        return {points:points, min:min, max:max};
    }

    chartLine = (points, days, width, height, min, max, stroke) => {
        //draw lines
        var lines = [];
        for(var x = 1; x < points.length; x++){
            lines.push(Math.round((width / days) * (x)) + ',' + Math.round(height + 10 - (height / (max - min)) * (points[x] - min)));
        }

        return (
            <Polyline key={'line' + x}
                stroke={stroke}
                strokeWidth="5"
                fill="none"
                points={lines.join(' ')}
            ></Polyline>
        );
    }

    chartDots = (chart, index, days, width, height) => {
        var dots = [];
        var log = [chart.name];
        for(var x = 0; x < days; x++){
            var date = new Date();
            date = new Date(date.setDate(date.getDate() - (days - 1 - x)));
            for(var y = 0; y < chart.records.length; y++){
                var rec = chart.records[y];
                if(DatesMatch(date, new Date(rec.datestart))){
                    log.push('match! ' + date.getDate() + ' = ' + rec.inputs[index].number);
                    if(rec.inputs.length > index){
                        if(rec.inputs[index].number != null){
                            if(rec.inputs[index].number == 1){
                                dots.push(
                                    <Circle key={'dot' + x}
                                        cx={Math.round((width / days) * (x))}
                                        cy={height + 5}
                                        r={5}
                                        fill={AppStyles.chartDotFill}
                                    ></Circle>
                                )
                            }
                        }
                    }
                }
            }
        }
        return dots;
    }

    render() {
        var that = this;
        if(this.state.hasTask === true){
            return (
                <Body {...this.props} title="Overview" screen="Overview" noscroll="true" style={styles.body}
                    onLayout={this.onLayoutChange} buttonAdd={true} buttonRecord={true} bottomFade={true}
                    >
                    <View style={styles.counters}>
                        <TouchableBox onPress={() => this.props.navigation.navigate('Tasks')}>
                            <View style={styles.counterContainer}>
                                <Text style={styles.counter}>{this.state.totalTasks}</Text>
                                <Text style={styles.counterLabel}>{this.state.totalTasks != 1 ? 'Tasks' : 'Task'}</Text>
                            </View>
                        </TouchableBox>
                        <TouchableBox onPress={() => this.props.navigation.navigate('Events')}>
                        <View style={styles.counterContainer}>
                            <Text style={styles.counter}>{this.state.totalRecords}</Text>
                            <Text style={styles.counterLabel}>{this.state.totalRecords != 1 ? 'Events' : 'Event'}</Text>
                        </View>
                        </TouchableBox>
                        <TouchableBox onPress={() => this.props.navigation.navigate('Databases')}>
                        <View style={styles.counterContainerRight}>
                            <Text style={styles.counterName}>{global.database.name}</Text>
                            <Text style={styles.counterLabel}>Database</Text>
                        </View>
                        </TouchableBox>
                    </View>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <View style={styles.chartsContainer}>{this.getCharts.call(that)}</View>
                    </ScrollView>
                </Body>
            );
        }else{
            // Show Message instead of Overview of tasks
            return (
                <Body {...this.props} title="Overview" screen="Overview" style={styles.body} onLayout={this.onLayoutChange} buttonAdd={true}
                    footerMessage="To begin, create a task that you'd like to dedicate yourself to." 
                >
                    <View style={[styles.container]}>
                        <Image source={require('images/logo.png')} style={[styles.logo, this.state.styles.logo]} resizeMode='contain' />
                        <View style={styles.text}>
                            <Text style={[styles.p, styles.purple, styles.h4]}>
                                "Follow your dreams and dedicate your life to all the things that you truly believe in,
                                for if you don't believe in something, you'll eventually fall for anything."
                            </Text>
                            <Text style={[styles.p, styles.purple, styles.h4]}>
                                - Anonymous
                            </Text>
                        </View>
                    </View>
                </Body>
            );
        }
        
    }
}

const styles = StyleSheet.create({
    container: {padding: 30 },
    body:{position:'absolute', top:0, bottom:0, left:0, right:0},
    logo: { marginVertical:10, width: 200, alignSelf: 'center', tintColor:AppStyles.logoColor },
    text: {alignSelf:'center'},
    h4: {fontSize:20},
    p: { fontSize:17, paddingBottom:15, color:AppStyles.textColor },
    purple: { color: AppStyles.color},
    
    counters:{flexDirection:'row', padding: 15, width:'100%' },
    counterContainer:{alignSelf:'flex-start', paddingHorizontal:20},
    counterContainerRight:{alignSelf:'flex-end', paddingHorizontal:20, paddingTop:13},
    counter:{fontSize:30, color:AppStyles.numberColor},
    counterName:{fontSize:20, color:AppStyles.numberColor},
    counterLabel:{fontSize:17},

    chartsContainer:{paddingBottom:70},
    chartContainer: {paddingLeft:30, paddingRight:30, paddingBottom:20, paddingTop:5, width:'100%'},
    chartArea:{height:120},
    chart:{height:60, top:15},
    chartName: {position:'absolute', bottom:0, fontSize:20, width:'100%', textAlign:'center'},
    chartLine1:{position:'absolute', height:'100%'},
    chartLine1MinMax:{position:'absolute', height:'100%'},
    chartLine1Min:{position:'absolute', bottom:0},
    chartLine2:{position:'absolute', height:'100%'},
    chartLine2MinMax:{position:'absolute', height:'100%', right:0},
    chartLine2Min:{position:'absolute', bottom:0},
    chartLabel:{fontSize:20, opacity:0.5},
    chartDots:{position:'absolute'},

    separator:{borderTopWidth:1, borderTopColor:AppStyles.separatorColor, paddingBottom:10}
});

const stylesLandscape = StyleSheet.create({
    tooltip: {position:'absolute', bottom:5, right:100, height:60, maxWidth:250, textAlign:'right'},
    logo: {marginTop:30, marginBottom:20}
});

const stylesPortrait = StyleSheet.create({
    tooltip: {position:'absolute', bottom:10, left:30, height:60, maxWidth:250},
    logo: {marginTop:60, marginBottom:30}
});