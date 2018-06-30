import React from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import Text from 'ui/Text';
import Body from 'ui/Body';

export default class CategoriesScreen extends React.Component {
    constructor(props){
        super(props);

        //bind events
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        this.props.navigation.dispatch({ type: 'Navigation/BACK' });
        return true;
    }

    render() {
        return (
            <Body {...this.props} style={this.styles.body} title="Categories" screen="Settings">
                <View style={this.styles.container}>
                    <Text>Categories used to organize Tasks</Text>
                </View>
            </Body>
        )
    }

    styles = StyleSheet.create({
        body:{position:'absolute', top:0, bottom:0, left:0, right:0},
        container:{padding:30} 
    });
}