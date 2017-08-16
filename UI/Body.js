import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from 'ui/Header';
import Modal from 'ui/Modal';
import ButtonAdd from 'buttons/ButtonAdd';
import ButtonRecord from 'buttons/ButtonRecord';


export default class Body extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var that = this;
        return (
            <View style={this.props.style} onLayout={this.props.onLayout}>
                <Header {...this.props} />
                <Modal/>
                {this.props.children}
                {this.props.buttonRecord == true ?
                    <ButtonRecord {...this.props} style={styles.buttonRecord} onPress={() => this.props.navigation.navigate('RecordTask')}/>
                    : <View></View>
                }
                {this.props.buttonAdd == true ?
                    <ButtonAdd {...this.props} style={styles.buttonAdd} onPress={() => this.props.navigation.navigate('NewTask')}/>
                    : <View></View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonRecord:{alignSelf:'flex-start', bottom:20, left:20, position:'absolute'},
    buttonAdd:{alignSelf:'flex-end', bottom:20, right:20, position:'absolute'}
});