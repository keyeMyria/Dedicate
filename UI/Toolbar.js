
import React from 'react';
import {View, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
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

        this.state = {
            layoutWidth:width,
            update:0
        }

        //bind methods
        this.onLayout = this.onLayout.bind(this);
    }

    onLayout(){
        let {width} = Dimensions.get('window');
        if(width != this.state.layoutWidth){
            this.setState({layoutWidth:width, update:this.state.update+1});
        }
    }

    render(){
        const {width} = Dimensions.get('window');
        return [
            //Drop Shadow
            this.props.bottomFade == true && 
            <View key="shadow" style={[this.styles.bottomFade, {width:width}]} pointerEvents="none">
                <Svg width={width} height="110">
                    <Defs>
                        <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="110">
                            <Stop offset="0" stopColor={AppStyles.backgroundColor} stopOpacity="0" />
                            <Stop offset="0.9" stopColor={AppStyles.backgroundColor} stopOpacity="1" />
                        </LinearGradient>
                    </Defs>
                    <Rect x="0" y="0" width={width} height="110" fill="url(#fade)" />
                </Svg>
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
                    
                    {this.props.buttonAdd == true ?
                        <ButtonAdd key="btnAdd" {...this.props} style={this.styles.buttonAdd} onPress={() => {
                            if(this.props.onAdd != null){
                                this.props.onAdd();
                            }else{
                                this.props.navigation.navigate('Task', {taskId:null, goback:this.props.screen});
                            }
                        }}/>
                        : <View style={this.styles.buttonAdd}></View>
                    }

                    {this.props.hasTasks && this.props.hasRecords &&
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Tasks')}>
                            <IconTasks/>
                        </TouchableOpacity>
                    }
                    {this.props.hasTasks && this.props.hasRecords &&
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Events')}>
                            <IconEvents/>
                        </TouchableOpacity>
                    }
                    {this.props.hasTasks && this.props.hasRecords &&
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Analytics')}>
                            <IconAnalytics/>
                        </TouchableOpacity>
                    }

                    {this.props.buttonRecord == true && this.props.hasTasks ? 
                        <ButtonRecord key="btnrec" {...this.props} style={this.styles.buttonRecord} buttonType="rec" size="large"
                            onPress={() => {
                                this.props.navigation.navigate('Record', {goback:this.props.screen});
                            }}
                        />
                         : <View style={this.styles.buttonRecord}></View>
                    }
                </ViewOverflow>
            </View>
        ];
    }

    styles = StyleSheet.create({
        footerStyle:{position:'relative', width:'100%'},
        footerContainer:{position:'absolute', flexDirection: 'row', justifyContent:'space-between', width:'100%', paddingHorizontal:20, bottom:10, overflow:"visible"},
        addTooltip:{position:'absolute', bottom:90, left:18, zIndex:100},
        recordTooltip:{position:'absolute', bottom:90, right:26, zIndex:100},
        buttonAdd:{alignSelf:'flex-start', zIndex:100, width:48, height:48},
        buttonRecord:{alignSelf:'flex-end', zIndex:100, position:'relative', marginTop: -5, marginRight:-10, width:64, height:64},
        footerMessageContainer:{position:'absolute', bottom:20, left:80, zIndex:100},
        footerMessage:{paddingLeft:30, textAlign:'left', fontSize:16},
        bottomFade:{position:'absolute', left:0, bottom:-1, height:110}
    });
}