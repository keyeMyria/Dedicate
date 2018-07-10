import React from 'react';
import { View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import ScreenTransition from 'ui/ScreenTransition';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import Text from 'text/Text';
import Picker from 'fields/Picker';
import CategoriesScreen from 'screens/Settings/Categories';
import {UserConfig} from 'dedicate/UserConfig';

class DefaultScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            theme:global.config.theme
        }

        //bind methods
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
        this.loadToolbar = this.loadToolbar.bind(this);
        this.onThemeChange = this.onThemeChange.bind(this);
    }

    config = new UserConfig();

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
        this.loadToolbar();
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        global.navigate(this, "Overview");
        global.refreshOverview();
        return true;
    }

    updateScreen(){
        this.loadToolbar();
    }

    // Load Toolbar ////////////////////////////////////////////////////////////////////////////////////////////////////

    loadToolbar(){
        global.updateToolbar({
            ...this.props, 
            screen:'Settings',
            buttonAdd:false, 
            buttonRecord:false, 
            bottomFade:false, 
            hasTasks:false, 
            hasRecords:false,
            footerMessage: ''
        });
    }

    onThemeChange(value){
        this.config.setTheme(value);
        this.setState({theme:value});
    }

    render() {
        return (
            <Body {...this.props} style={this.styles.body} title="Settings" backButton={this.hardwareBackPress}>
                <View style={this.styles.listItem}>
                    <Text style={this.styles.listTitle}>Current Theme</Text>
                    <Picker
                        onValueChange={this.onThemeChange}
                        selectedValue={this.state.theme}
                        items={[
                            {value:'LightPurple', label:'Light Purple'},
                            {value:'DarkPurple', label:'Dark Purple'},
                        ]}
                        title="Select Theme"
                    />
                </View>
                <TouchableOpacity onPress={()=> global.navigate(this, 'Categories')}>
                    <View style={this.styles.listItem}>
                        <Text style={this.styles.listText}>Manage Categories</Text>
                    </View>
                </TouchableOpacity>
            </Body>
        );
    }

    styles = StyleSheet.create({
        body:{position:'absolute', top:0, bottom:0, left:0, right:0},
        listItem:{
            paddingVertical:15, paddingHorizontal:30, borderBottomWidth:1,
            borderBottomColor:AppStyles.separatorColor
        },
        listTitle:{fontSize:17, opacity:0.75},
        listText:{fontSize:17}
    });
}

export default createStackNavigator(
    {
        Default: {screen: DefaultScreen},
        Categories: {screen: CategoriesScreen, path:'settings\categories'}
    },
    {
        initialRouteName: 'Default',
        headerMode:'none',
        transitionConfig: ScreenTransition
    }
);;