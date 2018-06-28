import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Dimensions, ScrollView, BackHandler } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import TouchableBox from 'ui/Touchable/Box';
import DbTasks from 'db/DbTasks';
import DbRecords from 'db/DbRecords';
import {Svg, Line, Polyline, Circle} from 'react-native-svg';
import DatesMatch from 'utility/DatesMatch';
import DropShadow from 'ui/DropShadow';
import IconTasks from 'icons/IconTasks';
import IconEvents from 'icons/IconEvents';
import IconDatabases from 'icons/IconDatabases';
import Timer from 'fields/Timer';
import Logo from 'ui/Logo';

export default class OverviewScreen extends React.Component {
    constructor(props) {
        super(props);

        var dbTasks = new DbTasks();
        var dbRecords = new DbRecords();

        this.state = {
            styles: null,
            totalTasks:dbTasks.TotalTasks(),
            totalRecords:dbRecords.TotalRecords(),
            hasTask:dbTasks.HasTasks(),
            charts:dbRecords.GetListByTask(),
            timers:dbRecords.GetActiveTimers(),
            chartList:[],
            timerList:[],
            shadowOpacity:0
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

    // Screen Orientation changes
    onLayoutChange = () => {
        var {height, width} = Dimensions.get('window');
        var styles = stylesPortrait;
        if(width > height){
            styles = stylesLandscape;
        }
        if(this.state.styles != styles){
            this.setState({styles: styles},
            () => {
                //get rendered timers & charts
                this.getTimers();
                this.getCharts();
            });
        }
    }

    scroll = (e) => {
        var y = e.nativeEvent.contentOffset.y;
        if(y <= 50){
            this.setState({shadowOpacity:(1 / 50) * y});
        }else if(this.state.shadowOpacity < 1){
            this.setState({shadowOpacity:1});
        }
    }

    getTimers = () => {
        var that = this;
        var timers = this.state.timers;
        var items = [];
        if(timers.length > 0){
            for(var x = 0; x < timers.length; x++){
                var timer = timers[x];
                items.push(
                    <TouchableHighlight key={'timer' + timer.id} onPress={() => {
                        this.props.navigation.navigate('RecordTask', {goback:'Overview', recordId:timer.id}, { type: "Navigate", routeName: "Record", params: { }});
                    }}>
                        <View style={styles.timerContainer}>
                            <View style={styles.timerTask}>
                                <View style={styles.timerTaskIcon}><IconTasks size="xsmall"></IconTasks></View>
                                <Text style={styles.timerTaskLabel}>{timer.task.name}</Text>
                            </View>
                            <View style={styles.timerCounter}>
                                <Timer startDate={timer.datestart} onStop={(datestart, dateend) => this.onTimerStop.call(that, datestart, dateend, timer)}></Timer>
                            </View>
                        </View>
                    </TouchableHighlight>
                );
                if(x < timers.length - 1){
                    items.push(<View key={'sep' + x} style={styles.separator}></View>);
                }
            }
        }
        this.setState({timerList:items});
    }

    onTimerStop = (datestart, dateend, record) => {
        global.realm.write(() => {
            record.dateend = dateend;
            record.time = (dateend - record.datestart) / 1000;
            record.timer = false;
        });
        
        //var dbRecords = new DbRecords();
        //this.setState({timers:dbRecords.GetActiveTimers()},
        //() =>{
        //    this.getTimers();
        //});
    }

    getCharts = () => {
        var items = [];
        var {width} = Dimensions.get('window');
        var maxCharts = 6;
        for(var x = 0; x < (this.state.charts.length < maxCharts ? this.state.charts.length : maxCharts); x++){
            var chart = this.state.charts[x];
            if(chart.name != ''){
                var item = this.chartItem(chart, width);
                if(item != null){
                    items.push(item);
                    if(x < this.state.charts.length - 1){
                        items.push(<View key={'sep' + x} style={styles.separator}></View>);
                    }
                }
            }
        }
        this.setState({chartList:items});
    }

    //render 14 day chart
    chartItem = (chart, width) => {
        var line1 = (<View></View>);
        var line1Min = "";
        var line1Max = "";
        var line1Legend = (<View></View>);
        var line2 = (<View></View>);
        var line2Min = "";
        var line2Max = "";
        var line2Legend = (<View></View>);
        var dots = (<View></View>);
        var dotsLegend = (<View></View>);

        //get lines and dots for chart
        var curr = 1;
        var hasdots = false;
        var cwidth = width;
        var height = 60;
        var days = 14;
        var record = chart.records[0];
        var haspoints = false;
        for(var x = 0; x < record.inputs.length; x++){
            var input = record.inputs[x];
            if(input.type === 0){ //number
                var info = this.chartPoints(chart, x, days);
                if(info.points.length == 0){ continue; }
                haspoints = true;
                if(curr == 1){
                    line1 = (
                        <Svg width={cwidth} height={height + 20}>
                            {this.chartLine(info.points, days, cwidth, height, info.min, info.max, AppStyles.chartLine1Stroke)}
                        </Svg>
                    );
                    line1Legend = (
                        <View style={styles.legendItem}>
                            <View style={styles.legendItemIcon}>
                                <Svg width="20" height="10">
                                    <Line x1="0" x2="20" y1="4" y2="4" strokeWidth="5" stroke={AppStyles.chartLine1Stroke}></Line>
                                </Svg>
                            </View>
                            <View style={styles.legendItemLabel}>
                                <Text style={styles.legendItemText}>{input.input.name}</Text>
                            </View>
                        </View>
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
                    line2Legend = (
                        <View style={styles.legendItem}>
                            <View style={styles.legendItemIcon}>
                                <Svg width="20" height="10">
                                    <Line x1="0" x2="20" y1="4" y2="4" strokeWidth="5" stroke={AppStyles.chartLine2Stroke}></Line>
                                </Svg>
                            </View>
                            <View style={styles.legendItemLabel}>
                                <Text style={styles.legendItemText}>{input.input.name}</Text>
                            </View>
                        </View>
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
                dotsLegend = (
                    <View style={styles.legendItem}>
                        <View style={styles.legendItemIcon}>
                            <Svg width="20" height="10">
                                <Circle cx={10} cy={5} r={5} fill={AppStyles.chartDotFill}></Circle>
                            </Svg>
                        </View>
                        <View style={styles.legendItemLabel}>
                            <Text style={styles.legendItemText}>{input.input.name}</Text>
                        </View>
                    </View>
                );
            }
        }

        if(haspoints == false && hasdots == false){return null;}

        return (
            <ScrollView key={chart.id} horizontal={true} pagingEnabled={true} showsHorizontalScrollIndicator={false}>
                <View style={[styles.chartContainer, {width:width}]}>
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
                <View style={[styles.legendContainer, {width:width}]}>
                    <View style={styles.legendLines}>
                        {line1Legend}
                        {line2Legend}
                    </View>
                    <View style={styles.legendDot}>
                        {dotsLegend}
                    </View>
                    <Text style={styles.legendName}>{chart.name}</Text>
                </View>
            </ScrollView>
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
        for(var x = 0; x < days; x++){
            var date = new Date();
            date = new Date(date.setDate(date.getDate() - (days - 1 - x)));
            for(var y = 0; y < chart.records.length; y++){
                var rec = chart.records[y];
                if(DatesMatch(date, new Date(rec.datestart))){
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
        if(this.state.hasTask === true){
            return (
                <Body {...this.props} title="Overview" screen="Overview" noscroll={true} style={styles.body}
                    onLayout={this.onLayoutChange} buttonAdd={true} buttonRecord={true} bottomFade={true}
                    >
                    <View style={styles.counters}>
                        <TouchableBox onPress={() => this.props.navigation.navigate('Tasks')}>
                            <View style={styles.counterContainer}>
                                <View style={styles.counterIcon}>
                                    <IconTasks size="small"></IconTasks>
                                </View>
                                <View style={styles.counterText}>
                                    <Text style={styles.counterName}>{this.state.totalTasks}</Text>
                                    <Text style={styles.counterLabel}>{this.state.totalTasks != 1 ? 'Tasks' : 'Task'}</Text>
                                </View>
                            </View>
                        </TouchableBox>
                        <TouchableBox onPress={() => this.props.navigation.navigate('Events')}>
                        <View style={styles.counterContainer}>
                            <View style={styles.counterIcon}>
                                <IconEvents size="small"></IconEvents>
                            </View>
                            <View style={styles.counterText}>
                                <Text style={styles.counterName}>{this.state.totalRecords}</Text>
                                <Text style={styles.counterLabel}>{this.state.totalRecords != 1 ? 'Events' : 'Event'}</Text>
                            </View>
                        </View>
                        </TouchableBox>
                        <TouchableBox onPress={() => this.props.navigation.navigate('Databases')}>
                        <View style={styles.counterContainer}>
                            <View style={styles.counterIcon}>
                                <IconDatabases size="small"></IconDatabases>
                            </View>
                            <View style={styles.counterText}>
                                <Text style={styles.counterName}>{global.database.name}</Text>
                                <Text style={styles.counterLabel}>Database</Text>
                            </View>
                        </View>
                        </TouchableBox>
                    </View>
                    <DropShadow style={[styles.dropshadow]} opacity={0.075 * this.state.shadowOpacity} height={20}></DropShadow>
                    <ScrollView onScroll={this.scroll} keyboardShouldPersistTaps="handled" scrollEventThrottle={1000 / 24.9}>
                        <View style={styles.timersContainer}>{this.state.timerList}</View>
                        <View style={styles.chartsContainer}>{this.state.chartList}</View>
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
                        <View style={styles.logo}><Logo width="200" height="38.65"></Logo></View>
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
    logo: { marginVertical:10, flexDirection:'row', justifyContent:'center', width:'100%' },
    text: {alignSelf:'center'},
    h4: {fontSize:20},
    p: { fontSize:17, paddingBottom:15, color:AppStyles.textColor },
    purple: { color: AppStyles.color},
    dropshadow:{zIndex:10},
    
    counters:{flexDirection:'row', padding: 7, width:'100%' },
    counterContainer:{flexDirection:"row", alignSelf:'flex-start', paddingHorizontal:10, paddingTop:13},
    counterIcon:{paddingRight:8},
    counterName:{fontSize:20, color:AppStyles.numberColor, position:'relative', top:-5},
    counterLabel:{fontSize:17, position:'relative', top:-8},

    timersContainer:{},
    timerContainer:{flexDirection:'row', justifyContent:'space-between', width:'100%', paddingHorizontal:15, paddingTop:10, paddingBottom:20},
    timerTask:{flexDirection:'row'},
    timerTaskIcon:{paddingRight:10, paddingTop:6},
    timerTaskLabel:{fontSize:20, paddingTop:6},
    timerTaskCounter:{alignSelf:'flex-end'},

    chartsContainer:{paddingBottom:70},
    chartContainer: {paddingLeft:25, paddingRight:25, paddingBottom:20, paddingTop:5, width:'100%'},
    chartArea:{height:120},
    chart:{height:60, top:15, left:-25},
    chartName: {position:'absolute', bottom:0, fontSize:20, width:'100%', textAlign:'center'},
    chartLine1:{position:'absolute', height:'100%'},
    chartLine1MinMax:{position:'absolute', height:'100%'},
    chartLine1Min:{position:'absolute', bottom:0},
    chartLine2:{position:'absolute', height:'100%'},
    chartLine2MinMax:{position:'absolute', height:'100%', right:0, alignItems:'flex-end'},
    chartLine2Min:{position:'absolute', bottom:0},
    chartLabel:{fontSize:20, opacity:0.5},
    chartTextRight:{textAlign:'right'},
    chartDots:{position:'absolute'},

    separator:{borderTopWidth:1, borderTopColor:AppStyles.separatorColor, paddingBottom:10},

    legendContainer:{flex:1, flexDirection:'row', justifyContent:'space-between', padding:30, height:125},
    legendLines:{alignSelf:'flex-start'},
    legendDot:{alignSelf:'flex-end'},
    legendItem:{flex:1, flexDirection:'row'},
    legendItemIcon:{paddingRight:10, paddingTop:7, height:20},
    legendItemLabel:{},
    legendItemText:{fontSize:17},
    legendName:{position:'absolute', width:'100%', bottom:0, paddingLeft:55, fontSize:20, textAlign:'center', alignSelf:'center'}
});

const stylesLandscape = StyleSheet.create({
    tooltip: {position:'absolute', bottom:5, right:100, height:60, maxWidth:250, textAlign:'right'},
    logo: {marginTop:30, marginBottom:20}
});

const stylesPortrait = StyleSheet.create({
    tooltip: {position:'absolute', bottom:10, left:30, height:60, maxWidth:250},
    logo: {marginTop:60, marginBottom:30}
});