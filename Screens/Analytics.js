import React from 'react';
import { View, Image, StyleSheet, BackHandler } from 'react-native';
import Text from 'text/Text';
import Body from 'ui/Body';
import DbCharts from 'db/DbCharts';
import IconAnalytics from '../UI/Icons/IconAnalytics';


export default class AnalyticsScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            charts:[]
        }

        //bind methods
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.showCreateChart = this.showCreateChart.bind(this);
    }

    dbCharts = new DbCharts()

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        this.setState({charts:this.dbCharts.GetList()});
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        this.props.navigation.dispatch({ type: 'Navigation/BACK' });
        return true;
    }

    showCreateChart(){
        this.props.navigation.navigate('Chart', {goback:'Analytics'});
    }

    render() {
        return (
            <Body {...this.props} style={this.styles.body} title="Analytics" screen="Analytics" buttonAdd={true} onAdd={this.showCreateChart}
                footerMessage={this.state.charts.length == 0 ? "Create your first chart and track what is most important to you" : ''}
            >
                {this.state.charts.length == 0 ? 
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
                    <View>

                    </View>
                }
            </Body>
        );
    }

    styles = StyleSheet.create({
        body:{position:'absolute', top:0, bottom:0, left:0, right:0},
        introContainer:{width:380, alignSelf:'center', paddingBottom:110},
        largeIcon:{paddingTop:30, width:'100%', flexDirection:'row', justifyContent:'center'},
        introText:{paddingTop:20, fontSize:20, color:AppStyles.textColor, textAlign:'justify'}
    });
}