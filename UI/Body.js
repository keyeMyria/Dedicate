import React from 'react';
import { View } from 'react-native';
import Header from 'ui/Header';
import Modal from 'ui/Modal';


export default class Body extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={this.props.style} onLayout={this.props.onLayout}>
                <Header {...this.props} />
                <Modal/>
                {this.props.children}
            </View>
        );
    }
}