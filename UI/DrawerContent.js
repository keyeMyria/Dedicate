import React from "react";
import { View, Text, Image, StyleSheet, TouchableHighlight } from "react-native";
import IconOverview from 'icons/IconOverview';
import IconTasks from 'icons/IconTasks';
import IconEvents from 'icons/IconEvents';
import IconDatabases from 'icons/IconDatabases';

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
        <DrawerItem {...this.props} text="Overview" screen="Overview" icon={IconOverview} />
        <DrawerItem {...this.props} text="Tasks" screen="Tasks" icon={IconTasks} />
        <DrawerItem {...this.props} text="Events" screen="Events" icon={IconEvents} />
        <DrawerItem {...this.props} text="Analytics" screen="Analytics" icon={IconOverview} />
        <DrawerItem {...this.props} text="Settings" screen="Settings" icon={IconOverview} />
        <DrawerItem {...this.props} text="Databases" screen="Databases" icon={IconDatabases} />
      </View>
    );
  }
}

const DrawerItem = props => {
  const Icon = props.icon;
  var selectedStyle = {};
  if(props.activeItemKey == props.text){ selectedStyle = styles.drawerItemSelected; }
  return (
    <TouchableHighlight underlayColor={AppStyles.listItemPressedColor} onPress={() => props.navigation.navigate(props.screen)}>
    <View style={[styles.drawerItem, selectedStyle]}>
      <View style={styles.drawerItemIcon}><Icon size="small" /></View>
        <Text style={styles.drawerItemText}>{props.text}</Text>
    </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: { flex:1 },
  container_logo: { padding: 15, backgroundColor:'#6666cc', marginBottom:20},
  logo: { width:'40%', tintColor: 'white', alignSelf:'center'},
  drawerItem: {flexDirection:'row', flexWrap:'wrap', paddingVertical: 15, paddingHorizontal:20},
  drawerItemSelected: { backgroundColor:'#C9E4FF'},
  drawerItemIcon:{paddingRight:20},
  drawerItemText: {fontSize:17, fontWeight:'bold', paddingTop:7, color: AppStyles.textColor}
});