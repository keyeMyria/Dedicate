import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Header from 'components/UI/Header';
import DrawerIcon from 'components/UI/DrawerIcon';

export default class AnalyticsScreen extends React.Component {
  constructor(props){
    super(props);
  }

  // Drawer Navigation options
  static navigationOptions = {
    drawerLabel: 'Analytics',
    drawerIcon: ({ tintColor }) => DrawerIcon(require('icons/Home.png'), tintColor),
  };


  render() {
    return (
      <View>
        <Header {...this.props} title="Analytics" />
      </View> 
    );
  }
}