import React from 'react';
import { View, StyleSheet, TouchableHighlight, TouchableOpacity, Dimensions, ScrollView, BackHandler } from 'react-native';
import Text from 'text/Text';
import Body from 'ui/Body';
import AppStyles from 'dedicate/AppStyles';
import TouchableBox from 'ui/Touchable/Box';
import DbTasks from 'db/DbTasks';
import DbRecords from 'db/DbRecords';
import DbCharts from 'db/DbCharts';
import DropShadow from 'ui/DropShadow';
import IconTasks from 'icons/IconTasks';
import IconEvents from 'icons/IconEvents';
import IconDatabases from 'icons/IconDatabases';
import IconSettings from 'icons/IconSettings';
import Timer from 'fields/Timer';
import Logo from 'ui/Logo';
import Loading from 'ui/Loading';
import LineChart from 'charts/LineChart';

export default class OverviewScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            styles: null,
            totalTasks:0,
            totalRecords:0,
            charts:[],
            featuredCharts:[],
            timers:[],
            chartList:[],
            timerList:[],
            shadowOpacity:0,
            loading:false,
            layoutWidth:0
        };

        //bind global methods
        global.refreshOverview = this.refreshOverview.bind(this);

        //bind methods
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.loadOverview = this.loadOverview.bind(this);
        this.getTimers = this.getTimers.bind(this);
        this.getCharts = this.getCharts.bind(this);
        this.addChart = this.addChart.bind(this);
        this.onLayout = this.onLayout.bind(this);
        this.onTimerPress = this.onTimerPress.bind(this);
        this.onTitleBarSettingsPress = this.onTitleBarSettingsPress.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        this.loadOverview();
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        BackHandler.exitApp();
        return true;
    }

    loadOverview(){
        global.overviewChanged = false;
        let dbTasks = new DbTasks();
        let dbRecords = new DbRecords();
        this.setState({
            totalTasks:dbTasks.TotalTasks(),
            totalRecords:dbRecords.TotalRecords(),
        }, () => {
            this.loadToolbar();
            this.loadContent();
        });
    }

    // Global Refresh Method

    refreshOverview(){
        if(global.overviewChanged == true){
            this.loadOverview();
        }else{
            //no changes made to database that would affect overview screen
            this.loadToolbar();
        }
    }

    // Load Toolbar ////////////////////////////////////////////////////////////////////////////////////////////////////

    loadToolbar(){
        var hasTasks = this.state.totalTasks > 0;
        var hasRecords = false;
        if(hasTasks == true){
            var dbRecords = new DbRecords();
            hasRecords = dbRecords.hasRecords();
        }

        global.updateToolbar({
            ...this.props, 
            screen:'Overview',
            buttonAdd:true, 
            buttonRecord:true, 
            bottomFade:true, 
            hasTasks:hasTasks, 
            hasRecords:hasRecords,
            footerMessage: hasTasks == false ? "To begin, create a task that you'd like to dedicate yourself to."  : ''
        });
    }

    // Load Content ////////////////////////////////////////////////////////////////////////////////////////////////////

    loadContent(){
        let dbRecords = new DbRecords();
        let dbCharts = new DbCharts();
        this.setState({
            charts:dbRecords.GetListByTask(),
            featuredCharts:dbCharts.GetFeaturedCharts(),
            timers:dbRecords.GetActiveTimers()
        }, () => {
            this.getTimers();
            this.getCharts();
        });
    }

    // Layout Changes ////////////////////////////////////////////////////////////////////////////////////////////////////

    onLayout(){
        const {width} = Dimensions.get('screen');
        if(this.state.layoutWidth != width){
            this.setState({layoutWidth:width});
            this.getTimers();
            this.getCharts();
        }
    }

    scroll = (e) => {
        const y = e.nativeEvent.contentOffset.y;
        let o = (1 / 50) * y;
        if(o < 0){ o = 0;}
        if(y <= 50){
            this.setState({shadowOpacity:o});
        }else if(this.state.shadowOpacity < 1){
            this.setState({shadowOpacity:1});
        }
    }

    // Timers ////////////////////////////////////////////////////////////////////////////////////////////////////

    getTimers() {
        var that = this;
        let timers = this.state.timers;
        let items = [];
        if(timers.length > 0){
            for(let x = 0; x < timers.length; x++){
                let timer = timers[x];
                items.push(
                    <TouchableHighlight key={'timer' + timer.id} onPress={() => { this.onTimerPress(timer.id); }}>
                        <View style={this.styles.timerContainer}>
                            <View style={this.styles.timerTask}>
                                <View style={this.styles.timerTaskIcon}><IconTasks size="xsmall"></IconTasks></View>
                                <Text style={this.styles.timerTaskLabel}>{timer.task.name}</Text>
                            </View>
                            <View style={this.styles.timerCounter}>
                                <Timer startDate={timer.datestart} onStop={(datestart, dateend) => this.onTimerStop.call(that, datestart, dateend, timer)}></Timer>
                            </View>
                        </View>
                    </TouchableHighlight>
                );
                if(x < timers.length - 1){
                    items.push(<View key={'sep' + x} style={this.styles.separator}></View>);
                }
            }
        }
        this.setState({timerList:items});
    }

    onTimerPress = (id) => {
        global.navigate(this, 'RecordDetails', {goback:'Overview', recordId:id});
    }

    onTimerStop = (datestart, dateend, record) => {
        global.realm.write(() => {
            record.dateend = dateend;
            record.time = (dateend - record.datestart) / 1000;
            record.timer = false;
        });
    }

    // Charts ////////////////////////////////////////////////////////////////////////////////////////////////////

    getCharts() {
        //asynchronously get charts
        const {width} = Dimensions.get('window');
        let charts = [];
        const offset = this.state.featuredCharts.length;
        const total = offset + this.state.charts.length;
        let count = 0;

        for(let x = 0; x < this.state.featuredCharts.length; x++){
            this.addFeaturedChart(this.state.featuredCharts[x], width, x).then(result => {
                charts[result.index] = result.chart;
                count++;
                if(count == total){this.setState({chartList:charts});}
            }).catch(ex => {});
        };

        for(let x = 0; x < this.state.charts.length; x++){
            this.addChart(this.state.charts[x], width, x).then(result => {
                if(result != null){
                    charts[result.index + offset] = result.chart;
                }
                count++;
                if(count == total){this.setState({chartList:charts});}
            }).catch(ex => {});
        }
    }

    async addFeaturedChart(chart, width, index){
        return {
            index:index,
            chart:
                <View key={chart.name}>
                    <LineChart
                    chart={chart}
                    days={14}
                    width={width}
                    height={120}
                    update={Math.round(999 * Math.random())}
                    />
                    <View key={'sep' + chart.name} style={this.styles.separator}></View>
                </View>
        };
    }

    async addChart(task, width, index){
        let sources = [];
        let records = [];
        let line = 1;
        let dots = false;
        if(task.records && task.records.length > 0){
            for(let y = 0; y < task.records[0].inputs.length; y++){
                let input = task.records[0].inputs[y];
                let found = false;
                let isline = false;
                if(input.input.type == 0 || input.input.type == 7){
                    if(line <= 2){
                        found = true;
                        isline = true;
                        line++;
                    }
                }else if(input.input.type == 6 && dots == false){
                    found = true;
                    dots = true;
                }else if(line > 2 && dots == true){break;}
                if(found == true){
                    sources.push({
                        id:0,
                        style:1,
                        color:isline ? line - 1 : 1,
                        taskId: task.id,
                        task:task.task,
                        inputId:input.inputId,
                        input:input.input,
                        dayoffset:0,
                        monthoffset:0,
                        filter:''
                    });
                    records.push(task.records);
                }
            }

            //build chart info
            if(records.length > 0){
                return {
                    index:index,
                    chart:[
                    <LineChart key={'chart' + index}
                    chart={{
                        id:0,
                        name:task.name,
                        type:1,
                        featured:true,
                        index:0,
                        sources:sources
                    }}
                    records={records}
                    days={14}
                    width={width}
                    height={120}
                    update={Math.round(999 * Math.random())}
                    />,
                    <View key={'sep' + index} style={this.styles.separator}></View>
                ]};
            }else{
                return null;
            }
        }
    }

    // Buttons ///////////////////////////////////////////////////////////////////////////////////////

    onTitleBarSettingsPress(){
        global.navigate(this, 'Settings');
    }

    render() {
        const {height} = Dimensions.get('window');
        if(this.state.totalTasks > 0){
            return (
                <Body {...this.props} title="Overview" noscroll={true} style={this.styles.body} onLayout={this.onLayout}
                titleBarButtons={
                    <View style={this.styles.titleBarButton}>
                        <TouchableOpacity onPress={this.onTitleBarSettingsPress}>
                        <IconSettings color={AppStyles.headerTextColor} size="xsmall"/>
                        </TouchableOpacity>
                    </View>
                }>
                    <View style={this.styles.counters}>
                        <TouchableBox onPress={() => global.navigate(this, 'Tasks')}>
                            <View style={this.styles.counterContainer}>
                                <View style={this.styles.counterIcon}>
                                    <IconTasks size="small"></IconTasks>
                                </View>
                                <View style={this.styles.counterText}>
                                    <Text style={this.styles.counterName}>{this.state.totalTasks}</Text>
                                    <Text style={this.styles.counterLabel}>{this.state.totalTasks != 1 ? 'Tasks' : 'Task'}</Text>
                                </View>
                            </View>
                        </TouchableBox>
                        <TouchableBox onPress={() => global.navigate(this, 'Events')}>
                        <View style={this.styles.counterContainer}>
                            <View style={this.styles.counterIcon}>
                                <IconEvents size="small"></IconEvents>
                            </View>
                            <View style={this.styles.counterText}>
                                <Text style={this.styles.counterName}>{this.state.totalRecords}</Text>
                                <Text style={this.styles.counterLabel}>{this.state.totalRecords != 1 ? 'Events' : 'Event'}</Text>
                            </View>
                        </View>
                        </TouchableBox>
                        <TouchableBox onPress={() => global.navigate(this, 'Databases')}>
                        <View style={this.styles.counterContainer}>
                            <View style={this.styles.counterIcon}>
                                <IconDatabases size="small"></IconDatabases>
                            </View>
                            <View style={this.styles.counterText}>
                                <Text style={this.styles.counterName}>{global.database.name}</Text>
                                <Text style={this.styles.counterLabel}>Database</Text>
                            </View>
                        </View>
                        </TouchableBox>
                    </View>
                    <DropShadow style={[this.styles.dropshadow]} opacity={0.075 * this.state.shadowOpacity} height={20}></DropShadow>
                    <ScrollView onScroll={this.scroll} keyboardShouldPersistTaps="handled" scrollEventThrottle={1000 / 24.9}>
                        {this.state.loading == true ? 
                            <View style={[this.styles.loading, {paddingTop:(height / 2) - 200}]}><Loading></Loading></View> : 
                            <View>
                                <View style={this.styles.timersContainer}>{this.state.timerList}</View>
                                <View style={this.styles.chartsContainer}>{this.state.chartList}</View>
                            </View>
                        }
                    </ScrollView>
                </Body>
            );
        }else{
            // Show Message instead of Overview of tasks
            return (
                <Body {...this.props} title="Overview" screen="Overview" style={this.styles.body} onLayout={this.onLayout}
                titleBarButtons={
                    <View style={this.styles.titleBarButtons}>
                        <View style={this.styles.titleBarButton}>
                            <TouchableOpacity onPress={()=>{global.navigate(this, 'Databases')}}>
                                <IconDatabases size="xsmall" color={AppStyles.headerTextColor}/>
                            </TouchableOpacity>
                        </View>
                        <View style={this.styles.titleBarButton}>
                            <TouchableOpacity onPress={this.onTitleBarSettingsPress}>
                            <IconSettings color={AppStyles.headerTextColor} size="xsmall"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                }>
                    <View style={[this.styles.container]}>
                        <View style={this.styles.logo}><Logo width="200" height="38.65"></Logo></View>
                        <View style={this.styles.text}>
                            <Text style={[this.styles.p, this.styles.purple, this.styles.h4]}>
                                "Follow your dreams and dedicate your life to what you truly believe in,
                                for if you don't believe in something, you'll eventually fall for anything."
                            </Text>
                            <Text style={[this.styles.p, this.styles.purple, this.styles.h4]}>
                                - Anonymous
                            </Text>
                        </View>
                    </View>
                </Body>
            );
        }
        
    }

    styles = StyleSheet.create({
        container: {padding: 30 },
        body:{position:'absolute', top:0, bottom:0, left:0, right:0},
        titleBarButtons:{flexDirection:'row'},
        titleBarButton:{paddingTop:15, paddingRight:15},
        titleBarDatabases:{paddingTop:12, paddingRight:15},
        logo: { paddingTop:30, paddingBottom:50, flexDirection:'row', justifyContent:'center', width:'100%' },
        text: {alignSelf:'center'},
        h4: {fontSize:20},
        p: { fontSize:17, paddingBottom:15, color:AppStyles.textColor },
        purple: { color: AppStyles.color},
        dropshadow:{zIndex:10},
        loading:{width:'100%', flexDirection:'row', justifyContent:'center'},
        
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
        chart:{height:60, top:15, left:-5},
        chartName: {position:'absolute', bottom:0, fontSize:20, width:'100%', textAlign:'center'},
        chartLine1:{position:'absolute', height:'100%'},
        chartLine1MinMax:{position:'absolute', height:'100%'},
        chartLine1Max:{position:'absolute', top:0},
        chartLine1Min:{position:'absolute', bottom:0},
        chartLine2:{position:'absolute', height:'100%'},
        chartLine2MinMax:{position:'absolute', height:'100%', right:0, alignItems:'flex-end'},
        chartLine2Max:{position:'absolute', top:0},
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
}