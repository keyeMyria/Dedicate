
import React from 'react';
import {View, Dimensions, StyleSheet, TouchableOpacity, Animated, Easing} from 'react-native';
import ViewOverflow from 'react-native-view-overflow';
import {Svg, Rect, Defs, LinearGradient, Stop} from 'react-native-svg';
import ButtonAdd from 'buttons/ButtonAdd';
import ButtonRecord from 'buttons/ButtonRecord';
import ToolTip from 'tooltip/Left';
import ToolTipBottom from 'tooltip/BottomRight';
import ToolTipBottomLeft from 'tooltip/BottomLeft';
import IconTasks from 'icons/IconTasks';
import IconEvents from 'icons/IconEvents';
import IconAnalytics from 'icons/IconAnalytics';

export default class Toolbar extends React.Component{
    constructor(props){
        super(props);

        let {width} = Dimensions.get('window');
        let showButtons = this.props.hasTasks && this.props.hasRecords;

        this.state = {
            layoutWidth:width,
            update:0,
            buttons:{
                add: {show: this.props.buttonAdd || false, y: new Animated.Value(0)},
                tasks: {show: showButtons, y: new Animated.Value(0)},
                events: {show: showButtons, y: new Animated.Value(0)},
                analytics: {show: showButtons, y: new Animated.Value(0)},
                record: {show: showButtons && this.props.buttonRecord, y: new Animated.Value(0)}
            },
            fadedY: new Animated.Value(0)
        }

        //bind methods
        this.onLayout = this.onLayout.bind(this);
    }

    componentDidMount(){
        let start = 2000;
        let diff = 150;
        setTimeout(()=>this.animateFaded(), start / 2);
        setTimeout(()=>this.animateAdd(), start + (diff * 2));
        setTimeout(()=>this.animateTasks(), start + diff);
        setTimeout(()=>this.animateEvents(), start);
        setTimeout(()=>this.animateAnalytics(), start + diff);
        setTimeout(()=>this.animateRecord(), start + (diff * 2));
    }

    componentDidUpdate(){
        let showButtons = this.props.hasTasks && this.props.hasRecords;
        let buttons = this.state.buttons;
        let callbacks = [];
        //check add button
        if(this.state.buttons.add.show != this.props.buttonAdd){
            buttons.add.show = this.props.buttonAdd;
            callbacks.push(() => {this.animateAdd()});
        }
        //check middle buttons
        if(this.state.buttons.tasks.show != showButtons){
            buttons.tasks.show = showButtons;
            buttons.events.show = showButtons;
            buttons.analytics.show = showButtons;
            callbacks.push(() => {
                this.animateTasks();
                this.animateEvents();
                this.animateAnalytics();
            });
        }
        //check record button
        if(this.state.buttons.record.show != this.props.buttonRecord){
            buttons.record.show = this.props.buttonRecord;
            callbacks.push(() => {this.animateRecord()});
        }

        if(callbacks.length > 0){
            //finally, execute animations
            this.setState({buttons:buttons}, () => {
                for(let x = 0; x < callbacks.length; x++){
                    callbacks[x]();
                }
            });
        }
        
    }

    onLayout(){
        let {width} = Dimensions.get('window');
        if(width != this.state.layoutWidth){
            this.setState({layoutWidth:width, update:this.state.update+1});
        }
    }

    animateFaded(){
        Animated.timing(
            this.state.fadedY,
            {
                toValue: 1,
                duration:1000,
                easing:Easing.inOut(Easing.quad)
            }
        ).start();
    }

    animateAdd(){
        Animated.timing(
            this.state.buttons.add.y,
            {
                toValue: this.state.buttons.add.show === true ? 1 : 0,
                duration:300,
                easing:Easing.out(Easing.quad)
            }
        ).start();
    }

    animateTasks(){
        Animated.timing(
            this.state.buttons.tasks.y,
            {
                toValue: this.state.buttons.tasks.show === true ? 1 : 0,
                duration:300,
                easing:Easing.out(Easing.quad)
            }
        ).start();
    }

    animateEvents(){
        Animated.timing(
            this.state.buttons.events.y,
            {
                toValue: this.state.buttons.events.show === true ? 1 : 0,
                duration:300,
                easing:Easing.out(Easing.quad)
            }
        ).start();
    }

    animateAnalytics(){
        Animated.timing(
            this.state.buttons.analytics.y,
            {
                toValue: this.state.buttons.analytics.show === true ? 1 : 0,
                duration:300,
                easing:Easing.out(Easing.quad)
            }
        ).start();
    }

    animateRecord(){
        Animated.timing(
            this.state.buttons.record.y,
            {
                toValue: this.state.buttons.record.show === true ? 1 : 0,
                duration:300,
                easing:Easing.out(Easing.quad)
            }
        ).start();
    }

    startY = 70
    fadedY = 125

    render(){
        const {width} = Dimensions.get('window');
        const buttons = {
            add: {
                y: this.state.buttons.add.y.interpolate({
                    inputRange:[0, 1],
                    outputRange:[this.startY, 0]
                })
            },
            tasks: {
                y: this.state.buttons.tasks.y.interpolate({
                    inputRange:[0, 1],
                    outputRange:[this.startY, 0]
                })
            },
            events: {
                y: this.state.buttons.events.y.interpolate({
                    inputRange:[0, 1],
                    outputRange:[this.startY, 0]
                })
            },
            analytics: {
                y: this.state.buttons.analytics.y.interpolate({
                    inputRange:[0, 1],
                    outputRange:[this.startY, 0]
                })
            },
            record: {
                y: this.state.buttons.record.y.interpolate({
                    inputRange:[0, 1],
                    outputRange:[this.startY, 0]
                })
            }
        }
        const fadedY = this.state.fadedY.interpolate({
            inputRange:[0, 1],
            outputRange:[this.fadedY, 0]
        });
        return [
            //Drop Shadow
            this.props.bottomFade == true && 
            <View key="shadow" style={[this.styles.bottomFade, {width:width}]} pointerEvents="none">
                <Animated.View style={{position:'relative', top:fadedY}}>
                    <Svg width={width} height={this.fadedY}>
                        <Defs>
                            <LinearGradient id="fade" x1="0" y1="0" x2="0" y2={this.fadedY}>
                                <Stop offset="0" stopColor={AppStyles.backgroundColor} stopOpacity="0" />
                                <Stop offset="0.75" stopColor={AppStyles.backgroundColor} stopOpacity="1" />
                            </LinearGradient>
                        </Defs>
                        <Rect x="0" y="0" width={width} height={this.fadedY} fill="url(#fade)" />
                    </Svg>
                </Animated.View>
            </View>
            ,

            //ToolTips
            this.props.buttonAdd == true && this.props.addToolTip != null && 
            <View key="tooltip1" style={this.styles.addTooltip}>
                <ToolTipBottomLeft text={this.props.addToolTip}/>
            </View>
            , this.props.buttonRecord == true && this.props.hasRecords != true && this.props.hasTasks == true && 
                <View key="tooltip2" style={this.styles.recordTooltip}>
                    <ToolTipBottom text="Finally, record an event using the task that you have just created."/>
                </View>
            , this.props.footerMessage != null && this.props.footerMessage != '' &&
            <View key="tooltip3" style={this.styles.footerMessageContainer}>
                <ToolTip text={this.props.footerMessage}/>
            </View>
        
            , //Toolbar

            <View key="toolbar" style={this.styles.footerStyle}>
                <ViewOverflow style={this.styles.footerContainer} onLayout={this.onLayout}>
                    
                    <Animated.View style={[this.styles.button, {top:buttons.add.y}]}>
                        <ButtonAdd key="btnAdd" {...this.props} style={this.styles.buttonAdd} onPress={() => {
                            if(this.props.onAdd != null){
                                this.props.onAdd();
                            }else{
                                global.navigate(this, 'Task', {taskId:null, goback:this.props.screen});
                            }
                        }}/>
                    </Animated.View>

                    <Animated.View style={[this.styles.button, {top:buttons.tasks.y}]}>
                        <TouchableOpacity onPress={() => global.navigate(this, 'Tasks')}>
                            <IconTasks/>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View style={[this.styles.button, {top:buttons.events.y}]}>
                        <TouchableOpacity onPress={() => global.navigate(this, 'Events')}>
                            <IconEvents/>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View style={[this.styles.button, {top:buttons.analytics.y}]}>
                        <TouchableOpacity onPress={() => global.navigate(this, 'Analytics')}>
                            <IconAnalytics/>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={[this.styles.button, {top:buttons.record.y}]}>
                        <ButtonRecord key="btnrec" {...this.props} style={this.styles.buttonRecord} buttonType="rec" size="large"
                            onPress={() => {
                                global.navigate(this, 'Record', {goback:this.props.screen});
                            }}
                        />
                    </Animated.View>
                </ViewOverflow>
            </View>
        ];
    }

    styles = StyleSheet.create({
        footerStyle:{position:'relative', width:'100%'},
        footerContainer:{position:'absolute', flexDirection: 'row', justifyContent:'space-between', width:'100%', paddingHorizontal:20, bottom:10, overflow:"visible"},
        addTooltip:{position:'absolute', bottom:90, left:18, zIndex:100},
        recordTooltip:{position:'absolute', bottom:90, right:26, zIndex:100},
        button:{position:'relative'},
        buttonAdd:{alignSelf:'flex-start', zIndex:100, width:48, height:48},
        buttonRecord:{alignSelf:'flex-end', zIndex:100, position:'relative', marginTop: -5, marginRight:-10, width:64, height:64},
        footerMessageContainer:{position:'absolute', bottom:20, left:80, zIndex:100},
        footerMessage:{paddingLeft:30, textAlign:'left', fontSize:16},
        bottomFade:{position:'absolute', left:0, bottom:-1, height:this.fadedY}
    });
}