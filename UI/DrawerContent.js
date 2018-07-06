import React from "react";
import { View, StyleSheet, TouchableHighlight, ScrollView } from "react-native";
import Text from 'text/Text';
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
      <View style={[this.styles.container]}>
        <View style={this.styles.header}>
          <Logo width="129" height="25" color={AppStyles.headerTextColor}/>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <DrawerItem {...this.props} text="Overview" screen="Overview" icon={<IconOverview size="small"/>} />
          <DrawerItem {...this.props} text="Tasks" screen="Tasks" icon={<IconTasks size="small"/>} />
          <DrawerItem {...this.props} text="Events" screen="Events" icon={<IconEvents size="small"/>} />
          <DrawerItem {...this.props} text="Analytics" screen="Analytics" icon={<IconAnalytics size="small"/>} />
          <DrawerItem {...this.props} text="Settings" screen="Settings" icon={<IconSettings size="small"/>} />
          <DrawerItem {...this.props} text="Databases" screen="Databases" icon={<IconDatabases size="small"/>} />
        </ScrollView>
      </View>
    );
  }

  styles = StyleSheet.create({
    container: { flex:1, backgroundColor:AppStyles.backgroundColor },
    header: { padding: 15, backgroundColor:AppStyles.headerColor, marginBottom:20, flexDirection:'row', justifyContent:'center', width:'100%'}
  });
}

class DrawerItem extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    var selectedStyle = {};
    var selectedTextStyle = {};
    if(this.props.activeItemKey == this.props.text){ 
      selectedStyle = this.styles.drawerItemSelected; 
      selectedTextStyle = this.styles.drawerItemSelectedText;
    }

    return (
      <TouchableHighlight underlayColor={AppStyles.listItemPressedColor} 
      onPress={() => this.props.navigation.navigate(this.props.screen)}
      >
      <View style={[this.styles.drawerItem, selectedStyle]}>
        <View style={this.styles.drawerItemIcon}>{this.props.icon}</View>
          <Text style={[this.styles.drawerItemText, selectedTextStyle]}>{this.props.text}</Text>
      </View>
      </TouchableHighlight>
    );
  }
    
  styles = StyleSheet.create({
    drawerItem: {flexDirection:'row', flexWrap:'wrap', paddingVertical: 15, paddingHorizontal:20, backgroundColor:AppStyles.backgroundColor},
    drawerItemSelected: { backgroundColor:AppStyles.listItemSelectedColor},
    drawerItemSelectedText: {color:AppStyles.listItemSelectedTextColor},
    drawerItemIcon:{paddingRight:20},
    drawerItemText: {fontSize:17, fontWeight:'bold', paddingTop:7, color: AppStyles.textColor}
  });
};