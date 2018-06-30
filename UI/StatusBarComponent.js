import React from 'react';
import { View, StatusBar} from 'react-native';

export default class StatusBarComponent extends React.Component {

    render() {
        return (
            <View>
                <StatusBar
                    backgroundColor='#6666cc'
                    translucent={false}
                    hidden={true}
                />
            </View>
        );
    }
}