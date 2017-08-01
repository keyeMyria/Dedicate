import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Header from 'components/UI/Header';
import DrawerIcon from 'components/UI/DrawerIcon';

export default class TasksScreen extends React.Component {
  constructor(props){
    super(props);
  }

  // Drawer Navigation options
  static navigationOptions = {
    drawerLabel: 'Tasks',
    drawerIcon: ({ tintColor }) => DrawerIcon(require('icons/Home.png'), tintColor),
  };


  render() {
    return (
      <View>
        <Header {...this.props} title="Tasks" />
      </View> 
    );
  }
}