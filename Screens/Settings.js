import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Body from 'ui/Body';
import CategoriesScreen from 'screens/Settings/Categories';

class DefaultScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Body {...this.props} title="Settings">
                <View>
                    <TouchableOpacity onPress={()=> this.props.navigation.navigate('Categories')}>
                        <View style={styles.listItem}>
                            <Text style={styles.listText}>Manage Categories</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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

//Routing
const SettingsScreen = StackNavigator(
    {
        Default: {screen: DefaultScreen},
        Categories: {screen: CategoriesScreen, path:'settings\categories'}
    },
    {
        initialRouteName: 'Default',
        headerMode:'none'
    }
);

export default SettingsScreen;