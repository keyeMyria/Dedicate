import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

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
            <View style={this.props.style} onLayout={this.props.onLayout}>
                <Header {...this.props} />
                <Modal/>
                <ScrollView ref='scrollinputs' onScroll={this.props.onScroll}  keyboardShouldPersistTaps="handled">
                {this.props.children}
                </ScrollView>
                <View>
                    {this.props.buttonRecord == true && this.state.hasTasks ?
                        <ButtonRecord {...this.props} style={styles.buttonRecord} buttonType="rec"
                            onPress={() => this.props.navigation.navigate('Record')}
                        />
                        : <View></View>
                    }
                    {this.props.buttonAdd == true ?
                        <ButtonAdd {...this.props} style={styles.buttonAdd} onPress={() => this.props.navigation.navigate('Task', {taskId:null})}/>
                        : <View></View>
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonRecord:{alignSelf:'flex-start', bottom:20, left:20, position:'absolute'},
    buttonAdd:{alignSelf:'flex-end', bottom:20, right:20, position:'absolute'}
});