import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Body from 'ui/Body';
import CategoriesScreen from 'screens/Settings/Categories';

class DefaultScreen extends React.Component {
    constructor(props) {
        super(props);

        //bind events
        this.hardwareBackPress = this.hardwareBackPress.bind(this);
    }

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

    render() {
        return (
            <Body {...this.props} title="Settings" screen="Settings">
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