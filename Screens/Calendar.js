import React from 'react';
import { View, BackHandler } from 'react-native';
import Body from 'ui/Body';


export default class CalendarScreen extends React.Component {
    constructor(props) {
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
        this.props.navigation.navigate("Overview");
        return true;
    }

    render() {
        return (
            <Body {...this.props} title="Calendar" screen="Calendar">
                <View>
                    
                </View>
            </Body>
        );
    }
}