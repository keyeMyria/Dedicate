import React from 'react';
import { View, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import Text from 'text/Text';
import Picker from 'fields/Picker';
import { createStackNavigator } from 'react-navigation';
import Body from 'ui/Body';
import AppStyles from 'dedicate/AppStyles';
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
        this.onThemeChange = this.onThemeChange.bind(this);
    }

    config = new UserConfig();

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.hardwareBackPress);
    }

    hardwareBackPress() {
        this.props.navigation.navigate("Overview");
        return true;
    }

    onThemeChange(value){
        this.config.setTheme(value);
        this.setState({theme:value});
    }

    render() {
        return (
            <Body {...this.props} style={this.styles.body} title="Settings" screen="Settings">
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
                <TouchableOpacity onPress={()=> this.props.navigation.navigate('Categories')}>
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
        headerMode:'none'
    }
);;