import React from 'react';
import { StatusBar } from 'react-native';
import AppStyles from 'dedicate/AppStyles';

export default class MyStatusBar extends React.Component {

    render() {
        return <StatusBar backgroundColor={AppStyles.color} translucent={false} hidden={true} />
    }
}