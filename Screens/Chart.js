import React from 'react';
import { View, StyleSheet, BackHandler, Dimensions, TouchableOpacity } from 'react-native';
import Text from 'text/Text';
import TextLink from 'text/TextLink';
import Form, {FormHeader, FormBody} from 'ui/Form';
import Textbox from 'fields/Textbox';
import Picker from 'fields/Picker';
import CheckBox from 'fields/CheckBox';
import ButtonClose from 'buttons/ButtonClose';
import IconArrowRight from 'icons/IconArrowRight';
import ToolTip from 'tooltip/Top';
import DbTasks from '../Database/DbTasks';
import DbRecords from '../Database/DbRecords';
import DbCharts from '../Database/DbCharts';
import LineChart from 'charts/LineChart';


export default class ChartScreen extends React.Component {
    constructor(props) {
        super(props);

        let dbTasks = new DbTasks();

        this.state = {
            chart: {
                id:null,
                name:'',
                type:1,
                featured:false,
                index:0,
                sources:[]
            },
            chartItem:[], //rendered chart
            sourcesList:[], //rendered
            tasks:dbTasks.GetList(),
            taskForm:{
                height:250,
                inputsOffset:0
            },
            title:'New Chart',
            screenTitle:'',
            ButtonAddShow: true,
            ButtonInTitleBar: false,
            visibleHeight:0,
            contentOffset:0,
            edited:true,
            layoutWidth:0,
            update:1
        }

        this.chartType = [
            {label:'Line Chart', value:1},
            {label:'Time Graph', value:2},
            {label:'Pie Chart', value:3}
        ];

        //load existing chart
        let chart = null;
        let info = this.props.navigation.getParam('chart', null);
        if(info != null){
            chart = {
                id: info.id,
                name:info.name,
                type: info.type,
                featured: info.featured,
                index: info.index,
                sources: []
            }

            for(let x = 0; x < info.sources.length; x++){
                let source = info.sources[x];
                chart.sources.push({
                    id: source.id,
                    style: source.style,
                    color: source.color,
                    taskId: source.taskId,
                    task: source.task || global.realm.objects('Task').filtered('id = $0', source.taskId)[0],
                    inputId: source.inputId,
                    input: source.input,
                    dayoffset: source.dayoffsest,
                    monthoffset: source.monthoffsest,
                    filter: source.filter
                });
            }
            this.state.chart = chart;
            this.state.title = 'Edit Chart';
        }

        //update layout width
        const {width} = Dimensions.get('screen');
        this.state.layoutWidth = width;

        //bind methods
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.onLayout = this.onLayout.bind(this);
        this.loadToolbar = this.loadToolbar.bind(this);
        this.onChartNameChange = this.onChartNameChange.bind(this);
        this.onChartTypeChange = this.onChartTypeChange.bind(this);
        this.onFeaturedChange = this.onFeaturedChange.bind(this);
        this.onPressAddInput = this.onPressAddInput.bind(this);
        this.onPressButtonSave = this.onPressButtonSave.bind(this);
        this.selectDataSource = this.selectDataSource.bind(this);
        this.renderSources = this.renderSources.bind(this);
        this.removeSource = this.removeSource.bind(this);
        this.onChangeSourceInput = this.onChangeSourceInput.bind(this);
        this.onChangeSourceColor = this.onChangeSourceColor.bind(this);
        this.onShowColorModal = this.onShowColorModal.bind(this);
    }

    // Component Events  //////////////////////////////////////////////////////////////////////////////////////
    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        if(this.state.chart.id != null){
            this.renderSources();
        }
        this.loadToolbar();
    }

    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        const goback = this.props.navigation.getParam('goback', 'Analytics');
        this.props.navigation.navigate(goback);
        global.updatePrevScreen();
        return true;
    }

    // Layout Changes ////////////////////////////////////////////////////////////////////////////////////////////////////

    onLayout(){
        const {width} = Dimensions.get('screen');
        if(this.state.layoutWidth != width){
            this.setState({layoutWidth:width}, () => {
                this.renderSources();
            });
        }
    }

    // Load Toolbar ////////////////////////////////////////////////////////////////////////////////////////////////////

    loadToolbar(){
        global.updateToolbar({
            ...this.props, 
            screen:'Tasks',
            buttonAdd:true, 
            buttonRecord:true, 
            bottomFade:true, 
            hasTasks:true, 
            hasRecords:true,
            footerMessage: '',
            onAdd: global.proVersion == true ? this.showCreateChart : null
        });
    }

    // Input Changes //////////////////////////////////////////////////////////////////////////////////////////

    onChartNameChange(value){
        let chart = this.state.chart;
        chart.name = value;
        this.setState({chart:chart});
    }

    onChartTypeChange(value){
        let chart = this.state.chart;
        chart.type = value;
        this.setState({chart:chart});
    }

    onFeaturedChange(checked){
        let chart = this.state.chart;
        chart.featured = checked;
        this.setState({chart:chart});
    }

    // Select Data Source ///////////////////////////////////////////////////////////////////////////////////

    onPressAddInput(){
        let i  =0;
        global.Modal.setContent('Select Data Source', (
            <View style={this.styles.modalMenuContainer}>
                {this.state.tasks.map((task) => {
                    i++;
                    return (
                        <TouchableOpacity key={i} onPress={() => {this.selectDataSource(task);}}>
                        <View style={this.styles.modalItemContainer}>
                            <Text style={this.styles.modalItemText}>{task.name}</Text>
                        </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        ));
        global.Modal.show();
    }

    selectDataSource(task){
        global.Modal.hide();
        var chart = this.state.chart;
        chart.sources.push({
            id: null,
            style: 1,
            color: (chart.sources.length + 1) % 8 || 8,
            taskId: task.id,
            task:task,
            inputId:null,
            input:null,
            dayoffset:null,
            monthoffset:null,
            isnewkey:true,
            filter:''
        });
        this.setState({chart:chart}, () => {
            this.renderSources();
        });
    }

    // Render Sources List /////////////////////////////////////////////////////////////////////////////////

    renderSources(){
        let {width} = Dimensions.get('window');
        let list = this.state.chart.sources.map(source => {return (
            <View key={'src' + source.task.name} style={this.styles.sourceContainer}>
                <View style={this.styles.iconArrow}><IconArrowRight size="xsmall"/></View>
                <View style={this.styles.sourceHeader}>
                    <Text style={this.styles.sourceTitle}>{source.task.name}</Text>
                    <ButtonClose size="xxsmall" color={AppStyles.color} style={this.styles.sourceClose} onPress={() => {this.removeSource(source);}}/>
                </View>
                <View style={this.styles.sourceBody}>
                    <View style={[this.styles.sourceInput,{width:width - 80}]}>
                        <Picker onValueChange={(value) => {this.onChangeSourceInput(source, value)}}
                            items={[{label:'No Input', value:null}].concat(source.task.inputs.map(input => ({label:input.name, value:input.id})))}
                            defaultValue={null}
                            selectedValue={source.inputId}
                        />
                    </View>
                    {source.input != null && source.input.type != 6 && //Yes/No dot only, no color selection available
                        <View style={this.styles.colorBoxContainer}>
                            <TouchableOpacity onPress={() => this.onShowColorModal(source)}>
                                <View style={[this.styles.colorBoxSmall, {backgroundColor:
                                    source.color == 1 ? AppStyles.chartLine1Stroke : 
                                    source.color == 2 ? AppStyles.chartLine2Stroke : 
                                    source.color == 3 ? AppStyles.chartLine3Stroke : 
                                    source.color == 4 ? AppStyles.chartLine4Stroke : 
                                    source.color == 5 ? AppStyles.chartLine5Stroke : 
                                    source.color == 6 ? AppStyles.chartLine6Stroke : 
                                    source.color == 7 ? AppStyles.chartLine7Stroke : 
                                    source.color == 8 ? AppStyles.chartLine8Stroke :
                                    AppStyles.chartLine1Stroke
                                }]}></View>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        );});

        this.setState({sourcesList: list}, () => {
            this.renderChart();
        });
    }

    // Change Data Source Input ////////////////////////////////////////////////////////////////////////////

    onChangeSourceInput(source, inputId){
        var chart = this.state.chart;
        var i = chart.sources.indexOf(source);
        source.inputId = inputId;
        source.input = source.task.inputs.filter(a => a.id == inputId)[0];
        chart.sources[i] = source;
        this.setState({chart:chart}, () => {
            this.renderSources();
        });
    }

    // Change Data Source Color ////////////////////////////////////////////////////////////////////////////

    onShowColorModal(source){
        global.Modal.setContent('Select Color for Data Source', (
            <View style={[this.styles.modalMenuContainer, this.styles.colorBoxes]}>
                <View style={this.styles.colorBoxContainer}>
                    <TouchableOpacity onPress={() => this.onChangeSourceColor(source, 1)}>
                        <View style={[this.styles.colorBox, {backgroundColor:AppStyles.chartLine1Stroke}]}></View>
                    </TouchableOpacity>
                </View>
                <View style={this.styles.colorBoxContainer}>
                    <TouchableOpacity onPress={() => this.onChangeSourceColor(source, 2)}>
                        <View style={[this.styles.colorBox, {backgroundColor:AppStyles.chartLine2Stroke}]}></View>
                    </TouchableOpacity>
                </View>
                <View style={this.styles.colorBoxContainer}>
                    <TouchableOpacity onPress={() => this.onChangeSourceColor(source, 3)}>
                        <View style={[this.styles.colorBox, {backgroundColor:AppStyles.chartLine3Stroke}]}></View>
                    </TouchableOpacity>
                </View>
                <View style={this.styles.colorBoxContainer}>
                    <TouchableOpacity onPress={() => this.onChangeSourceColor(source, 4)}>
                        <View style={[this.styles.colorBox, {backgroundColor:AppStyles.chartLine4Stroke}]}></View>
                    </TouchableOpacity>
                </View>
                <View style={this.styles.colorBoxContainer}>
                    <TouchableOpacity onPress={() => this.onChangeSourceColor(source, 5)}>
                        <View style={[this.styles.colorBox, {backgroundColor:AppStyles.chartLine5Stroke}]}></View>
                    </TouchableOpacity>
                </View>
                <View style={this.styles.colorBoxContainer}>
                    <TouchableOpacity onPress={() => this.onChangeSourceColor(source, 6)}>
                        <View style={[this.styles.colorBox, {backgroundColor:AppStyles.chartLine6Stroke}]}></View>
                    </TouchableOpacity>
                </View>
                <View style={this.styles.colorBoxContainer}>
                    <TouchableOpacity onPress={() => this.onChangeSourceColor(source, 7)}>
                        <View style={[this.styles.colorBox, {backgroundColor:AppStyles.chartLine7Stroke}]}></View>
                    </TouchableOpacity>
                </View>
                <View style={this.styles.colorBoxContainer}>
                    <TouchableOpacity onPress={() => this.onChangeSourceColor(source, 8)}>
                        <View style={[this.styles.colorBox, {backgroundColor:AppStyles.chartLine8Stroke}]}></View>
                    </TouchableOpacity>
                </View>
            </View>
        ));
        global.Modal.show();
    }

    onChangeSourceColor(source, color){
        global.Modal.hide();
        var chart = this.state.chart;
        var i = chart.sources.indexOf(source);
        source.color = color;
        chart.sources[i] = source;
        this.setState({chart:chart}, () => {
            this.renderSources();
        });
    }

    // Remove Data Source ////////////////////////////////////////////////////////////////////////////////////////
    
    removeSource(source){
        var chart = this.state.chart;
        chart.sources = chart.sources.filter(a => a != source);
        this.setState({chart:chart}, () => {
            this.renderSources();
        });
    }

    // Render Chart /////////////////////////////////////////////////////////////////////////////////////////
    renderChart(){
        let {width} = Dimensions.get('window');
        let records = [];
        let chart = this.state.chart;
        let dbRecords = new DbRecords();
        let date = new Date();
        for(var x = 0; x < chart.sources.length; x++){
            let source = chart.sources[x];
            records.push(dbRecords.GetList({taskId:source.taskId, startDate:new Date(date.setDate(date.getDate() - 14))}));
        }
        this.setState({update:this.state.update+1, chartItem:(
            <LineChart key={'chart' + x}
            chart={chart}
            records={records}
            days={14}
            width={width}
            height={120}
            update={this.state.update+1}
            />
        )});
    }

    // Save Chart ///////////////////////////////////////////////////////////////////////////////////////////

    onPressButtonSave(){
        var dbCharts = new DbCharts();
        dbCharts.CreateChart(this.state.chart);
        this.props.navigation.navigate('Analytics')
    }

    render() {
        let sources = [];
        if(this.state.chart.sources.length > 0){
            sources = this.state.sourcesList;
        }else{
            sources = (
                <View style={this.styles.containerDescription}>
                    <ToolTip background={AppStyles.altBackgroundColor} text="Add data sources from one or more tasks to generate your chart with"/>
                </View>
            );
        }
        return (
            <Form {...this.props} title={this.state.title} screen="Chart" bodyTitle="Data Sources" onLayout={this.onLayout}
            edited={this.state.edited} onPressAddInput={this.state.chart.sources.length >= 8 ? null : this.onPressAddInput} onPressSave={this.onPressButtonSave}>
                <FormHeader>
                    <View style={this.styles.chartContainer}>
                        {this.state.chartItem}
                    </View>
                    <View style={this.styles.headerContainer}>
                        <View style={this.styles.input}>
                            <Text style={this.styles.fieldTitle}>Chart Name</Text>
                            <Textbox
                                value={this.state.chart.name}
                                style={this.styles.inputField} 
                                placeholder="My Chart"
                                returnKeyType={'done'}
                                blurOnSubmit={false}
                                onChangeText={this.onChartNameChange}
                                maxLength={24}
                            />
                        </View>
                        <View style={this.styles.input}>
                            <Text style={this.styles.fieldTitle}>Chart Type</Text>
                            <Picker
                                style={this.styles.pickerStyle}
                                itemStyle={this.styles.pickerItemStyle}
                                selectedValue={this.state.chart.type}
                                onValueChange={this.onChartTypeChange}
                                items={this.chartType}
                                title="Select A Chart Type"
                            />
                        </View>
                        <CheckBox text="Featured on the Overview Screen" onChange={this.onFeaturedChange}/>
                    </View>
                </FormHeader>
                <FormBody>
                    {sources}
                </FormBody>
            </Form>
        );
    }

    styles = StyleSheet.create({
        body:{position:'absolute', top:0, bottom:0, left:0, right:0, backgroundColor:AppStyles.altBackgroundColor},
        headerContainer:{paddingHorizontal:20, paddingBottom:20},
        chartContainer:{minHeight:80, paddingTop:20},

        //Chart Information
        noChart:{fontSize:20, paddingTop:20, opacity:0.3, alignSelf:'center'},
        input:{paddingBottom:20},
        fieldTitle: {fontSize:16, fontWeight:'bold'},
        inputField:{fontSize:20},
        pickerStyle:{},
        pickerItemStyle:{fontSize:20},
        containerDescription: {paddingTop:20, paddingHorizontal:30, paddingBottom:100, flexDirection:'column',  alignItems:'center'},

        //Sources
        iconArrow:{position:'absolute', left:0, paddingTop:13},
        sourceContainer:{paddingVertical:10, paddingHorizontal:20, borderBottomColor:AppStyles.altSeparatorColor, borderBottomWidth:1},
        sourceHeader:{flex:1, flexDirection:'row', justifyContent:'space-between', paddingBottom:20},
        sourceBody:{flexDirection:'row', justifyContent:'space-between'},
        sourceInput:{},
        sourceTitle:{fontSize:24},
        sourceClose:{alignSelf:'flex-end'},

        //modal window
        modalContainer:{backgroundColor:AppStyles.backgroundColor, minWidth:'50%', padding:30},
        modalMenuContainer:{backgroundColor:AppStyles.backgroundColor, minWidth:'50%'},
        modalItemContainer:{paddingVertical:15, paddingHorizontal:30, borderBottomColor: AppStyles.separatorColor, borderBottomWidth:1},
        

        //Color Picker
        colorBoxes:{flex:1, flexDirection:'row', justifyContent:'space-between', flexWrap:'wrap', width:300, padding:10},
        colorBoxContainer:{padding:10},
        colorBox:{width:48, height:48},
        colorBoxSmall:{width:32, height:32},
    });
}