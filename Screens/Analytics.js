import React from 'react';
import { View, StyleSheet, BackHandler, Dimensions, Alert, Platform } from 'react-native';
import Text from 'text/Text';
import Body from 'ui/Body';
import IconAnalytics from 'icons/IconAnalytics';
import ButtonClose from 'buttons/ButtonClose';
import ButtonOutline from 'buttons/ButtonOutline';
import DbCharts from 'db/DbCharts';
import LineChart from 'charts/LineChart';
import AppLink from 'react-native-app-link';


export default class AnalyticsScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            charts:this.dbCharts.GetList(),
            layoutWidth:0,
            update:1
        }

        //update layout width
        const {width} = Dimensions.get('screen');
        this.state.layoutWidth = width;

        //bind global methods
        global.updatePrevScreen = this.updateScreen.bind(this);

        //bind methods
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.onLayout = this.onLayout.bind(this);
        this.loadToolbar = this.loadToolbar.bind(this);
        this.showCreateChart = this.showCreateChart.bind(this);
        this.removeChart = this.removeChart.bind(this);
        this.editChart = this.editChart.bind(this);
    }

    dbCharts = new DbCharts()

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        this.loadToolbar();
    }

    componentDidMount(){
        this.mounted = true;
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
        this.mounted = false;
    }

    hardwareBackPress() {
        global.navigate(this, 'Overview');
        global.refreshOverview();
        return true;
    }

    updateScreen(){
        if(this.mounted == false){return;}
        this.loadToolbar();
        this.setState({charts:this.dbCharts.GetList(), update:this.state.update + 1});
    }

    // Layout Changes ////////////////////////////////////////////////////////////////////////////////////////////////////

    onLayout(){
        const {width} = Dimensions.get('screen');
        if(this.state.layoutWidth != width){
            this.setState({layoutWidth:width, update:this.state.update+1});
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
            onAdd: global.proVersion == true ? this.showCreateChart : null,
            addToolTip: global.proVersion == true && this.state.charts.length == 0 ? 'Start by adding a newly customized chart' : null,
        });
    }

    // Charts ////////////////////////////////////////////////////////////////////////////////////////////////////

    showCreateChart(){
        global.navigate(this, 'Chart', {goback:'Analytics'});
    }

    removeChart(chart){
        Alert.alert('Delete Chart', 'Do you really want to delete this chart? This cannot be undone!', [
            {text: 'Cancel', onPress: () => {}, style: 'cancel'},
            {text: 'Delete', onPress: () => {
                global.realm.write(() => {
                    global.realm.delete(chart);
                });
                this.setState({charts:this.dbCharts.GetList()});
            }}
          ],
          { cancelable: true }
        );
    }

    editChart(chart){
        global.navigate(this, 'Chart', {goback:'Analytics', chart:chart});
    }

    // Purchase Pro Version ////////////////////////////////////////////////////////////////////////////////////////
    onPressPurchase(){
        //TODO: Get App Store & Play Store IDs for Dedicate
        AppLink.openInStore('appStoreId', 'playStoreId').then(() => {

        });
    }

    render() {
        let {width} = Dimensions.get('window');
        return (
            <Body {...this.props} style={this.styles.body} title="Analytics" screen="Analytics" buttonAdd={true} onAdd={this.showCreateChart}
                footerMessage={this.state.charts.length == 0 ? "Create your first chart and track what is most important to you" : ''}
                onLayout={this.onLayout} backButton={this.hardwareBackPress}
            >
                {global.proVersion == true ? 
                    this.state.charts.length == 0 ? 
                        <View style={this.styles.introContainer}>
                            <View style={this.styles.largeIcon}><IconAnalytics size="gigantic"/></View>
                            <Text style={this.styles.introText}>
                                You can build charts to visualize the data that you've been collecting over time. 
                            </Text>
                            <Text style={this.styles.introText}>
                                This will help you understand emerging trends and allow you to make neccessary
                                changes to maximize the performance of your experiments.
                            </Text>
                        </View>
                    :
                        <View style={this.styles.chartsContainer}>
                            {this.state.charts.map( chart => {
                                return (
                                    <View key={chart.name}>
                                        <LineChart
                                        chart={chart}
                                        days={14}
                                        width={width}
                                        height={120}
                                        update={this.state.update}
                                        extraPage={
                                            <View>
                                                <View style={this.styles.removeChartContainer}>
                                                    <ButtonClose size="xxsmall" color={AppStyles.color} onPress={() => this.removeChart(chart)}/>
                                                </View>
                                                <View style={this.styles.editChartContainer}>
                                                    <ButtonOutline style={{alignSelf:'flex-start'}} onPress={() => this.editChart(chart)} text="Edit Chart"/>
                                                </View>
                                            </View>
                                        }
                                        />
                                        <View key={'sep' + chart.name} style={this.styles.separator}></View>
                                    </View>
                                )
                            })}
                        </View>
                    : //Free Version

                    <View style={this.styles.introContainer}>
                        <View style={this.styles.largeIcon}><IconAnalytics size="gigantic"/></View>
                        <Text style={this.styles.introText}>
                            You can design custom charts to visualize the data that 
                            you've been collecting over time, allowing you to 
                            maximize the performance of your experiments. 
                        </Text>
                        <Text style={this.styles.introText}>
                            In order to unlock Analytics, you should first export your database, then purchase
                            the Pro version of Dedicate on the {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}
                            and import your database within the Pro version.
                        </Text>
                        <View style={this.styles.purchaseContainer}>
                            <ButtonOutline text="Purchase Dedicate Pro" onPress={this.onPressPurchase}/>
                        </View>
                    </View>
                }
            </Body>
        );
    }

    styles = StyleSheet.create({
        body:{position:'absolute', top:0, bottom:0, left:0, right:0},
        introContainer:{width:380, alignSelf:'center', paddingBottom:100},
        largeIcon:{paddingTop:20, width:'100%', flexDirection:'row', justifyContent:'center'},
        introText:{paddingTop:20, fontSize:20, color:AppStyles.textColor, textAlign:'justify'},
        separator:{borderTopWidth:1, borderTopColor:AppStyles.separatorColor, paddingBottom:10},
        purchaseContainer:{paddingTop:30, alignSelf:'center'},

        chartsContainer:{paddingTop:20},
        removeChartContainer:{position:'absolute', right:0, top:-20},
        editChartContainer:{alignSelf:'center'}
    });
}