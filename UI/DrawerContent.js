import React from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import AppStyles from 'dedicate/AppStyles';
import IconOverview from 'icons/IconOverview';
import IconTasks from 'icons/IconTasks';
import IconEvents from 'icons/IconEvents';
import IconAnalytics from 'icons/IconAnalytics';
import IconSettings from 'icons/IconSettings';
import IconDatabases from 'icons/IconDatabases';
import Logo from 'ui/Logo';

export default class DrawerContent extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Logo width="129" height="25" color={AppStyles.backgroundColor}/>
        </View>
        <DrawerItem {...this.props} text="Overview" screen="Overview" icon={IconOverview} />
        <DrawerItem {...this.props} text="Tasks" screen="Tasks" icon={IconTasks} />
        <DrawerItem {...this.props} text="Events" screen="Events" icon={IconEvents} />
        <DrawerItem {...this.props} text="Analytics" screen="Analytics" icon={IconAnalytics} />
        <DrawerItem {...this.props} text="Settings" screen="Settings" icon={IconSettings} />
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
  header: { padding: 15, backgroundColor:'#6666cc', marginBottom:20, flexDirection:'row', justifyContent:'center', width:'100%'},
  drawerItem: {flexDirection:'row', flexWrap:'wrap', paddingVertical: 15, paddingHorizontal:20},
  drawerItemSelected: { backgroundColor:AppStyles.listItemHoverColor},
  drawerItemIcon:{paddingRight:20},
  drawerItemText: {fontSize:17, fontWeight:'bold', paddingTop:7, color: AppStyles.textColor}
});