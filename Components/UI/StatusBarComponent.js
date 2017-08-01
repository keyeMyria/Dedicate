import React from 'react';
import { 
    AppRegistry, 
    Text, View, StatusBar 
} from 'react-native';

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

AppRegistry.registerComponent("StatusBarComponent", () => StatusBarComponent);