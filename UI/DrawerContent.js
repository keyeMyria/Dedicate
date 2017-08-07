import React, { Component } from "react";
import { View, Text, Image, StyleSheet, TouchableHighlight } from "react-native";
import { DrawerItems } from 'react-navigation';
import IconOverview from 'icons/IconOverview';

export default class DrawerContent extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.container_logo}>
          <Image style={styles.logo} source={require('images/logo_sm.png')} resizeMode='contain'/>
        </View>
        <DrawerItem {...this.props} text="Overview" icon={IconOverview} />
        <DrawerItem {...this.props} text="Tasks" icon={IconOverview} />
        <DrawerItem {...this.props} text="Calendar" icon={IconOverview} />
        <DrawerItem {...this.props} text="Analytics" icon={IconOverview} />
        <DrawerItem {...this.props} text="Settings" icon={IconOverview} />
      </View>
    );
  }
}

const DrawerItem = props => {
  const Icon = props.icon;
  var path = props.path ? props.path : props.text;
  var selectedStyle = {};
  if(props.activeItemKey == props.text){ selectedStyle = styles.drawerItemSelected; }
  return (
    <TouchableHighlight onPress={() => props.navigation.navigate(props.text)}>
    <View style={[styles.drawerItem, selectedStyle]}>
      <View style={styles.column}>
        <Icon width="25" height="25" style={styles.drawerItemIcon} />
      </View>
      <View style={styles.column}>
        <Text style={styles.drawerItemText}>
          {props.text}
        </Text>
      </View>
    </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: { flex:1 },
  container_logo: { padding: 15, backgroundColor:'#6666cc', marginBottom:20},
  logo: { width:'40%', tintColor: 'white', alignSelf:'center'},
  column: {flexDirection:'column'},
  drawerItem: {flexDirection:'row', flexWrap:'wrap', paddingVertical: 15, paddingHorizontal:20},
  drawerItemSelected: { backgroundColor:'#C9E4FF'},
  drawerItemIcon:{marginRight:30, height:25},
  drawerItemText: {fontSize:15, fontWeight:'bold', height:25, color:'#000'}
});