import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, 
    StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { StackNavigator } from 'react-navigation';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import DrawerIcon from 'ui/DrawerIcon';
import TouchableBox from 'ui/Touchable/Box';
import DbTasks from 'db/DbTasks';
import DbRecords from 'db/DbRecords';
import DbTaskAnalytics from 'db/Analytics/DbTaskAnalytics';
import LineChart from 'charts/LineChart';

export default class OverviewScreen extends React.Component {
    constructor(props) {
        super(props);

        var dbTasks = new DbTasks();
        var dbRecords = new DbRecords();
        var dbTaskAnalytics = new DbTaskAnalytics();

        this.state = {
            styles: stylesLandscape,
            ...this.dbState(),
            analytics:dbTaskAnalytics.GetChart({datestart:(new Date(+new Date - 12096e5)), dateend:new Date()})
        };
    }

    componentDidMount() { 
        this.onLayoutChange();
    }

    componentWillReceiveProps() {
        var dbTasks = new DbTasks();
        var dbRecords = new DbRecords();
        
        this.setState(this.dbState());
    };

    dbState(){ //updates state from database
        var dbTasks = new DbTasks();
        var dbRecords = new DbRecords();

        return {
            totalTasks:dbTasks.TotalTasks(),
            totalRecords:dbRecords.TotalRecords(),
            hasTask:dbTasks.HasTasks()
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

    render() {
        if(this.state.hasTask === true){
            return (
                <Body {...this.props} title="Overview" style={styles.body} onLayout={this.onLayoutChange} buttonAdd={true} buttonRecord={true}>
                    <View style={styles.counters}>
                        <TouchableBox onPress={() => this.props.navigation.navigate('Tasks')}>
                            <View style={styles.counterContainer}>
                                <Text style={styles.counter}>{this.state.totalTasks}</Text>
                                <Text style={styles.counterLabel}>{this.state.totalTasks != 1 ? 'Tasks' : 'Task'}</Text>
                            </View>
                        </TouchableBox>
                        <TouchableBox onPress={() => this.props.navigation.navigate('Records')}>
                        <View style={styles.counterContainer}>
                            <Text style={styles.counter}>{this.state.totalRecords}</Text>
                            <Text style={styles.counterLabel}>{this.state.totalRecords != 1 ? 'Events' : 'Event'}</Text>
                        </View>
                        </TouchableBox>
                    </View>
                    
                </Body>
            );
        }else{
            return (
                <Body {...this.props} title="Overview" style={styles.body} onLayout={this.onLayoutChange} buttonAdd={true}
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
    
    counters:{flexDirection:'row', padding: 30, width:'100%' },
    counterContainer:{alignSelf:'flex-start', paddingHorizontal:20},
    counterLabel:{fontSize:17, paddingBottom:20},
    counter:{fontSize:40, color:AppStyles.numberColor}
});

const stylesLandscape = StyleSheet.create({
    tooltip: {position:'absolute', bottom:5, right:100, height:60, maxWidth:250, textAlign:'right'},
    logo: {marginTop:30, marginBottom:20}
});

const stylesPortrait = StyleSheet.create({
    tooltip: {position:'absolute', bottom:10, left:30, height:60, maxWidth:250},
    logo: {marginTop:60, marginBottom:30}
});