import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
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
            buttonType: this.props.buttonType ? this.props.buttonType : 'rec'
        }
        if(this.props.buttonRecord == true){
            var dbTasks = new DbTasks();
            this.state.hasTasks = dbTasks.HasTasks();
        }
    }

    render() {
        var that = this;
        return (
            <View style={[styles.container, this.props.style]} onLayout={this.props.onLayout}>
                <Header {...this.props} />
                <Modal/>
                {this.props.noscroll == 'true' ? this.props.children : 
                <ScrollView onScroll={this.props.onScroll} style={[styles.ScrollView, this.props.scrollViewStyle || {}]}  keyboardShouldPersistTaps="handled">
                {this.props.children}
                </ScrollView>
                }
                <View style={[styles.footerStyle, this.props.footerStyle || {}]}>
                    {this.props.bottomFade == true && 
                        <View style={styles.bottomFade} pointerEvents="none">
                            <Svg width="100%" height="110">
                                <Defs>
                                    <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="110">
                                        <Stop offset="0" stopColor={AppStyles.backgroundColor} stopOpacity="0" />
                                        <Stop offset="0.9" stopColor={AppStyles.backgroundColor} stopOpacity="1" />
                                    </LinearGradient>
                                </Defs>
                                <Rect x="0" y="0" width="100%" height="110" fill="url(#fade)" />
                            </Svg>
                        </View>
                    }
                    {this.props.buttonRecord == true && this.state.hasTasks ?
                        <ButtonRecord {...this.props} style={styles.buttonRecord} buttonType="rec" size="large"
                            onPress={() => {
                            that.props.navigation.navigate('Record', {goback:this.props.screen});}}
                        />
                        : <View></View>
                    }
                    {this.props.footerMessage != null && this.props.footerMessage != '' && 
                        (
                            <View style={styles.footerMessageContainer}>
                                <Text style={styles.footerMessage}>{this.props.footerMessage}</Text>
                            </View>
                        )
                    }
                    {this.props.buttonAdd == true ?
                        <ButtonAdd {...this.props} style={styles.buttonAdd} onPress={() => {
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
}

const styles = StyleSheet.create({
    container:{backgroundColor:AppStyles.backgroundColor},
    buttonRecord:{alignSelf:'flex-end', bottom:10, right:20, position:'absolute'},
    buttonAdd:{alignSelf:'flex-start', bottom:20, left:20, position:'absolute'},
    footerStyle:{position:'relative'},
    footerMessageContainer:{position:'absolute', bottom:5, right:100, height:60, maxWidth:270},
    footerMessage:{paddingLeft:30, textAlign:'right', fontSize:16},
    bottomFade:{width:'100%', position:'absolute', left:0, bottom:0, height:110, right:0}
});