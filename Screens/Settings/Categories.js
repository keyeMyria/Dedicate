import React from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import Text from 'text/Text';
import Body from 'ui/Body';

export default class CategoriesScreen extends React.Component {
    constructor(props){
        super(props);

        //bind events
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.loadToolbar = this.loadToolbar.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        this.loadToolbar();
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        global.navigate(this, 'Settings');
        if(typeof global.updatePrevScreen != 'undefined'){ global.updatePrevScreen(); }
        return true;
    }

    // Load Toolbar ////////////////////////////////////////////////////////////////////////////////////////////////////

    loadToolbar(){
        global.updateToolbar({
            ...this.props, 
            screen:'Task Catgories',
            buttonAdd:true, 
            buttonRecord:false, 
            bottomFade:true, 
            hasTasks:false, 
            hasRecords:false,
            footerMessage: ''
        });
    }

    render() {
        return (
            <Body {...this.props} style={this.styles.body} title="Categories">
                <View style={this.styles.container}>
                    <Text>Categories used for organizing Tasks</Text>
                </View>
            </Body>
        )
    }

    styles = StyleSheet.create({
        body:{position:'absolute', top:0, bottom:0, left:0, right:0},
        container:{padding:30} 
    });
}