import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import Header from 'ui/Header';
import Modal from 'ui/Modal';
import ButtonAdd from 'buttons/ButtonAdd';
import ButtonRecord from 'buttons/ButtonRecord';
import DbTasks from 'db/DbTasks';


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
                <ScrollView ref='scrollinputs' onScroll={this.props.onScroll} style={[styles.scrollView, this.props.scrollViewStyle || {}]}  keyboardShouldPersistTaps="handled">
                {this.props.children}
                </ScrollView>
                <View style={[styles.footerStyle, this.props.footerStyle || {}]}>
                    {this.props.buttonRecord == true && this.state.hasTasks ?
                        <ButtonRecord {...this.props} style={styles.buttonRecord} buttonType="rec"
                            onPress={() => {
                            that.props.navigation.navigate('Record');}}
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
                            this.props.navigation.navigate('Task', {taskId:null});}}/>
                        : <View></View>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{backgroundColor:AppStyles.backgroundColor},
    buttonRecord:{alignSelf:'flex-start', bottom:20, left:20, position:'absolute'},
    buttonAdd:{alignSelf:'flex-end', bottom:20, right:20, position:'absolute'},
    footerStyle:{position:'relative'},
    footerMessageContainer:{position:'absolute', bottom:0, right:100, height:60, maxWidth:250},
    footerMessage:{paddingLeft:30, textAlign:'right'}
});