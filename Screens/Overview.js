import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import DrawerIcon from 'ui/DrawerIcon';
import DbTasks from 'db/DbTasks';
import DbRecords from 'db/DbRecords';

export default class OverviewScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            styles: stylesLandscape,
            totalTasks:this.dbTasks.TotalTasks(),
            totalRecords:this.dbRecords.TotalRecords()
        };
        
    }

    componentDidMount() { 
        this.onLayoutChange();
    }

    dbTasks = new DbTasks();
    dbRecords = new DbRecords();

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
        if(this.dbTasks.HasTasks() === true){
            return (
                <Body {...this.props} title="Overview" style={styles.body} onLayout={this.onLayoutChange} buttonAdd={true} buttonRecord={true}>
                    <View style={styles.counters}>
                        <View style={styles.counterContainer}>
                            <Text style={styles.counter}>{this.state.totalTasks}</Text>
                            <Text style={styles.counterLabel}>Task{() => {return this.state.totalTasks != 1 ? 's' : ''}}</Text>
                        </View>
                        <View style={styles.counterContainer}>
                            <Text style={styles.counter}>{this.state.totalRecords}</Text>
                            <Text style={styles.counterLabel}>Events{() => {return this.state.totalTasks != 1 ? 's' : ''}}</Text>
                        </View>
                    </View>
                    
                </Body>
            );
        }else{
            return (
                <Body {...this.props} title="Overview" style={styles.body} onLayout={this.onLayoutChange} buttonAdd={true}>
                    <View style={[styles.container, styles.body]}>
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
                    <Text style={[styles.p, this.state.styles.tooltip]}>
                        To begin, create a task that you'd like to dedicate yourself to.
                    </Text>
                </Body>
            );
        }
        
    }
}

const styles = StyleSheet.create({
    body:{position:'absolute', top:0, bottom:0, left:0, right:0},
    container: {padding: 30 },
    logo: { marginVertical:10, width: 200, alignSelf: 'center', tintColor:AppStyles.logoColor },
    text: {alignSelf:'center'},
    h4: {fontSize:20},
    p: { fontSize:17, paddingBottom:15, color:AppStyles.textColor },
    purple: { color: AppStyles.color},
    
    counters:{flexDirection:'row', padding: 30, width:'100%' },
    counterContainer:{alignSelf:'flex-start', paddingHorizontal:20},
    counterLabel:{fontSize:17, paddingBottom:20},
    counter:{fontSize:40}
});

const stylesLandscape = StyleSheet.create({
    tooltip: {position:'absolute', bottom:5, right:100, height:60, maxWidth:250, textAlign:'right'},
    logo: {marginTop:30, marginBottom:20}
});

const stylesPortrait = StyleSheet.create({
    tooltip: {position:'absolute', bottom:10, left:30, height:60, maxWidth:250},
    logo: {marginTop:60, marginBottom:30}
});