import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import Body from 'ui/Body';
import Textbox from 'forms/Textbox';

export default class NewTaskScreen extends React.Component {
    constructor(props) {
        super(props);
        //var rand = Math.floor(Math.random() * 9999);
        //global.realm.write(() => {
        //    global.realm.create('Task', {name:'A New Task #' + rand, id:rand, icon:2, color:5 })
        //});

        console.log(global.realm.objects('Task'));
    }

    render() {
        return (
            <Body {...this.props} title="New Task">
                <View style={styles.container}>
                    <Text>Label</Text>
                    <Field name="name" component={Textbox} />
                </View>
                <View style={styles.containerInputs}>
                    <View style={styles.inputsHeader}>
                        <Text style={styles.inputsTitle}>Input Fields</Text>
                        <Text style={styles.inputsTitleOptional}>(optional)</Text>
                        <Button style={styles.buttonAddInput}
                            title="Add Input Field"
                            onPress={onPressAddInput}
                        />
                    </View>
                </View>
            </Body>
        );
    }
}

const styles = StyleSheet.create({
    container: {padding:30},
    containerInputs: {padding:30, backgroundColor:'#e0e0e0'}
});