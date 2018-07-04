import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Header from 'ui/Header';
import Modal from 'ui/Modal';
import ButtonAdd from 'buttons/ButtonAdd';
import ButtonRecord from 'buttons/ButtonRecord';
import DbTasks from 'db/DbTasks';
import DbRecords from 'db/DbRecords';
import {Svg, Rect, Defs, LinearGradient, Stop} from 'react-native-svg';
import ToolTip from 'tooltip/Left';
import ToolTipBottom from 'tooltip/BottomRight';


export default class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonType: this.props.buttonType ? this.props.buttonType : 'rec',
            layout:0
        }
        if(this.props.buttonRecord == true){
            var dbTasks = new DbTasks();
            this.state.hasTasks = dbTasks.HasTasks();
            if(this.state.hasTasks == true){
                var dbRecords = new DbRecords();
                this.state.hasRecords = dbRecords.hasRecords();
            }
        }
    }

    render() {
        var {width} = Dimensions.get('window');
        return (
            <View style={[this.styles.container, this.props.style]} onLayout={this.props.onLayout}>
                <Header {...this.props} />
                <Modal/>
                {this.props.noscroll == true ? this.props.children : 
                <ScrollView onScroll={this.props.onScroll} style={[this.styles.ScrollView, this.props.scrollViewStyle || {}]}  keyboardShouldPersistTaps="handled">
                {this.props.children}
                </ScrollView>
                }
                <View style={[this.styles.footerStyle, this.props.footerStyle || {}]}>
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
                    {this.props.buttonRecord == true && this.state.hasTasks ? [
                        (this.state.hasRecords != true && 
                            <View key="tooltip" style={this.styles.recordTooltip}>
                                <ToolTipBottom text="Finally, record an event using the task that you have just created."/>
                            </View>
                        ),
                        <ButtonRecord key="btnrec" {...this.props} style={this.styles.buttonRecord} buttonType="rec" size="large"
                            onPress={() => {
                                this.props.navigation.navigate('RecordDefault', {goback:this.props.screen}, { type: "Navigate", routeName: "Record", params: { }});
                            }}
                        />
                        ] : <View></View>
                    }
                    {this.props.footerMessage != null && this.props.footerMessage != '' && 
                        (
                            <View style={this.styles.footerMessageContainer}>
                                <ToolTip text={this.props.footerMessage}/>
                            </View>
                        )
                    }
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
                </View>
            </View>
        );
    }

    styles = StyleSheet.create({
        container:{backgroundColor:AppStyles.backgroundColor},
        recordTooltip:{position:'absolute', bottom:90, right:26},
        buttonRecord:{alignSelf:'flex-end', bottom:10, right:20, position:'absolute', zIndex:100},
        buttonAdd:{alignSelf:'flex-start', bottom:20, left:20, position:'absolute', zIndex:100},
        footerStyle:{position:'relative'},
        footerMessageContainer:{position:'absolute', bottom:18, left:80},
        footerMessage:{paddingLeft:30, textAlign:'left', fontSize:16},
        bottomFade:{position:'absolute', left:0, bottom:-1, height:110}
    });
}