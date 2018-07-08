import React from 'react';
import { StatusBar} from 'react-native';

export default class StatusBarComponent extends React.Component {

    render() {
        return <StatusBar backgroundColor='#6666cc' translucent={false} hidden={true} />
    }
}