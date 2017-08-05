import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Header from 'components/UI/Header';
import DrawerIcon from 'components/UI/DrawerIcon';
import ButtonAdd from 'components/UI/Buttons/ButtonAdd';

export default class OverviewScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    // Drawer Navigation options
    static navigationOptions = {
        drawerLabel: 'Overview',
        drawerIcon: ({ tintColor }) => DrawerIcon(require('icons/Home.png'), tintColor)
    };


    render() {
        return (
            <View style={styles.overview}>
                <Header {...this.props} title="Overview" />
                <Body {...this.props} />
            </View>
        );
    }
}

const Body = (props) => {
    return (
        <View style={[styles.body, styles.overview]}>
            <ButtonAdd style={styles.buttonAdd}/>
            <Image source={require('images/logo.png')} style={styles.logo} resizeMode='contain' />
            <Text style={[styles.p, styles.purple, styles.spacing, styles.h4]}>
                "Follow your dreams and dedicate your life to all the things that you truly believe in,
                for if you don't believe in something, you'll eventually fall for anything."
            </Text>
            <Text style={[styles.p, styles.purple, styles.h4]}>
                - Anonymous
            </Text>
            <Text style={[styles.p, styles.spacing]}>
                To begin, create a task that you'd like to dedicate yourself to.
            </Text>
        </View>
    );
};

let styles = StyleSheet.create({
    overview:{position:'absolute', top:0, bottom:0, left:0, right:0},
    body: {padding: 30, maxWidth: 500, alignSelf: 'center' },
    logo: { marginTop:60, width: 200, alignSelf: 'center' },
    h4: {fontSize:20},
    p: { fontSize:17, maxWidth: 300, paddingBottom:15 },
    purple: { color: '#6666cc'},
    spacing: {paddingTop:45},
    buttonAdd:{alignSelf:'flex-end', bottom:20, right:20, position:'absolute'}
});