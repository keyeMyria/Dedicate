import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Text from 'ui/Text';
import Header from 'ui/Header';
import Modal from 'ui/Modal';
import ButtonAdd from 'buttons/ButtonAdd';
import ButtonRecord from 'buttons/ButtonRecord';
import DbTasks from 'db/DbTasks';
import {Svg, Rect, Defs, LinearGradient, Stop} from 'react-native-svg';


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
                    {this.props.buttonRecord == true && this.state.hasTasks ?
                        <ButtonRecord {...this.props} style={this.styles.buttonRecord} buttonType="rec" size="large"
                            onPress={() => {
                                this.props.navigation.navigate('RecordDefault', {goback:this.props.screen}, { type: "Navigate", routeName: "Record", params: { }});
                            }}
                        />
                        : <View></View>
                    }
                    {this.props.footerMessage != null && this.props.footerMessage != '' && !this.state.hasTasks && 
                        (
                            <View style={this.styles.footerMessageContainer}>
                                <Text style={this.styles.footerMessage}>{this.props.footerMessage}</Text>
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
        buttonRecord:{alignSelf:'flex-end', bottom:10, right:20, position:'absolute', zIndex:100},
        buttonAdd:{alignSelf:'flex-start', bottom:20, left:20, position:'absolute', zIndex:100},
        footerStyle:{position:'relative'},
        footerMessageContainer:{position:'absolute', bottom:5, left:60, height:60, maxWidth:270},
        footerMessage:{paddingLeft:30, textAlign:'left', fontSize:16},
        bottomFade:{position:'absolute', left:0, bottom:-1, height:110}
    });
}