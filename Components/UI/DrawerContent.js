import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { DrawerItems } from 'react-navigation';

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
        <DrawerItems {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex:1 },
  container_logo: { padding: 15, backgroundColor:'#6666cc'},
  logo: { width:'40%', tintColor: 'white', alignSelf:'center'}
});