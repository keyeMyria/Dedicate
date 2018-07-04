import React from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import Text from 'ui/Text';
import Form, {FormHeader, FormBody} from 'ui/Form';
import Textbox from 'fields/Textbox';
import Picker from 'fields/Picker';
import CheckBox from 'fields/CheckBox';
import ToolTip from 'tooltip/Top';


export default class ChartScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chart:{
                id:null,
                name:'',
                type:1,
                featured:false,
                index:0,
                sources:[]
            },
            taskForm:{
                height:250,
                inputsOffset:0
            },
            islive:false,
            title:'New Chart',
            screenTitle:'',
            ButtonAddShow: true,
            ButtonInTitleBar: false,
            visibleHeight:0,
            contentOffset:0,
        }

        this.chartType = [
            {label:'Line Chart', value:1},
            {label:'Time Graph', value:2},
            {label:'Pie Chart', value:3}
        ];

        //bind methods
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.onChartNameChange = this.onChartNameChange.bind(this);
        this.onChartTypeChange = this.onChartTypeChange.bind(this);
        this.onFeaturedChange = this.onFeaturedChange.bind(this);
        this.onPressAddInput = this.onPressAddInput.bind(this);
        this.onPressButtonSave = this.onPressButtonSave.bind(this);
    }

    // Component Events  //////////////////////////////////////////////////////////////////////////////////////
    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        const goback = this.props.navigation.getParam('goback', 'Analytics');
        this.props.navigation.navigate(goback);
        return true;
    }

    // Input Changes //////////////////////////////////////////////////////////////////////////////////////////

    onChartNameChange(value){
        let chart = this.state.chart;
        if(this.state.islive == true){
            global.realm.write(() => {
                chart.name = value;
            });
        }else{
            chart.name = value;
        }
        this.setState({chart:chart});
    }

    onChartTypeChange(value){
        let chart = this.state.chart;
        if(this.state.islive == true){
            global.realm.write(() => {
                chart.type = value;
            });
        }else{
            chart.type = value;
        }
        this.setState({chart:chart});
    }

    onFeaturedChange(checked){
        let chart = this.state.chart;
        if(this.state.islive == true){
            global.realm.write(() => {
                chart.featured = checked;
            });
        }else{
            chart.featured = checked;
        }
        this.setState({chart:chart});
    }

    // Button Press ///////////////////////////////////////////////////////////////////////////////////////////

    onPressAddInput(){
        
    }

    onPressButtonSave(){

    }

    render() {
        let sources = [];
        if(this.state.chart.sources.length > 0){

        }else{
            sources = (
                <View style={this.styles.containerDescription}>
                    <ToolTip background={AppStyles.altBackgroundColor} text="Add data sources from one or more tasks to generate your chart with"/>
                </View>
            );
        }
        return (
            <Form {...this.props} 
            title={this.state.title} screen="Chart"
            bodyTitle="Data Sources"
            edited={this.state.edited}
            onPressAddInput={this.onPressAddInput}
            onPressSave={this.onPressButtonSave}
            >
                <FormHeader>
                    <View style={this.styles.chartContainer}>
                        {this.state.chart.sources.length == 0 && 
                            <Text style={this.styles.noChart}>Empty Chart</Text>
                        }
                    </View>
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
                </FormHeader>
                <FormBody>
                    {sources}
                </FormBody>
            </Form>
        );
    }

    styles = StyleSheet.create({
        body:{position:'absolute', top:0, bottom:0, left:0, right:0, backgroundColor:AppStyles.altBackgroundColor},
        chartContainer:{padding:20, minHeight:80, backgroundColor:AppStyles.backgroundColor},

        noChart:{fontSize:20, paddingTop:20, opacity:0.3, alignSelf:'center'},
        input:{paddingBottom:20},
        fieldTitle: {fontSize:16, fontWeight:'bold'},
        inputField:{fontSize:20},
        pickerStyle:{},
        pickerItemStyle:{fontSize:20},
        containerDescription: {paddingTop:50, paddingHorizontal:30, flexDirection:'column',  alignItems:'center'},

    });
}