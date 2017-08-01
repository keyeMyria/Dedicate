import React from 'react';
import { Image, StyleSheet } from 'react-native';

const  DrawerIcon = (icon, color) => (
    <Image
    source={icon}
    style={[styles.icon, {tintColor: color}]}
    />
);

const styles = StyleSheet.create({
  icon:{
    width:25,
    height:25
  }
});
export default DrawerIcon;