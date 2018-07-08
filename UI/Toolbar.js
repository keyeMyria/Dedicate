
import React from 'react';
import {View, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';

import {Svg, Rect, Defs, LinearGradient, Stop} from 'react-native-svg';
import ButtonAdd from 'buttons/ButtonAdd';
import ButtonRecord from 'buttons/ButtonRecord';
import ToolTip from 'tooltip/Left';
import ToolTipBottom from 'tooltip/BottomRight';
import IconTasks from 'icons/IconTasks';
import IconEvents from 'icons/IconEvents';
import IconAnalytics from 'icons/IconAnalytics';

export default class Toolbar extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const {width} = Dimensions.get('window');
        return (
            <View key="buttons" style={this.styles.footerStyle}>
                {this.props.bottomFade == true && 
                    <View style={[this.styles.bottomFade, {width:width}]} pointerEvents="none">
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
                }
                <View style={this.styles.footerContainer}>
                    
                    {this.props.buttonAdd == true ?
                        <ButtonAdd {...this.props} style={this.styles.buttonAdd} onPress={() => {
                            if(this.props.onAdd){
                                this.props.onAdd();
                            }else{
                                this.props.navigation.navigate('Task', {taskId:null, goback:this.props.screen});
                            }
                            }}/>
                        : <View></View>
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

                    {this.props.buttonRecord == true && this.props.hasTasks ? [
                        (this.props.hasRecords != true && 
                            <View key="tooltip" style={this.styles.recordTooltip}>
                                <ToolTipBottom text="Finally, record an event using the task that you have just created."/>
                            </View>
                        ),
                        <ButtonRecord key="btnrec" {...this.props} style={this.styles.buttonRecord} buttonType="rec" size="large"
                            onPress={() => {
                                this.props.navigation.navigate('Record', {goback:this.props.screen});
                            }}
                        />
                        ] : null
                    }
                    
                    {this.props.footerMessage != null && this.props.footerMessage != '' &&
                        <View style={this.styles.footerMessageContainer}>
                            <ToolTip text={this.props.footerMessage}/>
                        </View>
                    }
                </View>
            </View>
        );
    }

    styles = StyleSheet.create({
        container:{backgroundColor:AppStyles.backgroundColor},
        recordTooltip:{position:'absolute', bottom:90, right:26},
        buttonRecord:{alignSelf:'flex-end', zIndex:100, position:'relative', marginBottom:10, marginTop: -10},
        buttonAdd:{alignSelf:'flex-start', zIndex:100},
        footerStyle:{position:'relative', width:'100%'},
        footerContainer:{position:'absolute', flexDirection: 'row', justifyContent:'space-between', width:'100%', paddingHorizontal:20, bottom:10},
        footerMessageContainer:{position:'absolute', bottom:0, left:80},
        footerMessage:{paddingLeft:30, textAlign:'left', fontSize:16},
        bottomFade:{position:'absolute', left:0, bottom:-1, height:110}
    });
}