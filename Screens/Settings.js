import React from 'react';
import { View, StyleSheet, TouchableOpacity, BackHandler, Picker } from 'react-native';
import Text from 'ui/Text';
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
            <Body {...this.props} title="Settings" screen="Settings">
                <View style={styles.listItem}>
                    <Picker
                        onValueChange={this.onThemeChange}
                        selectedValue={this.state.theme}
                    >
                        <Picker.Item label="Light Theme" value="LightPurple"></Picker.Item>
                        <Picker.Item label="Dark Theme" value="DarkPurple"></Picker.Item>
                    </Picker>
                </View>
                <TouchableOpacity onPress={()=> this.props.navigation.navigate('Categories')}>
                    <View style={styles.listItem}>
                        <Text style={styles.listText}>Manage Categories</Text>
                    </View>
                </TouchableOpacity>
            </Body>
        );
    }
}

const styles = StyleSheet.create({
    listItem:{
        paddingVertical:15, paddingHorizontal:30, borderBottomWidth:1,
        borderBottomColor:AppStyles.separatorColor
    },
    listText:{fontSize:17}
});

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