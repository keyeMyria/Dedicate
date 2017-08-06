import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import AppStyles from 'dedicate/AppStyles';
import Body from 'ui/Body';
import DrawerIcon from 'components/UI/DrawerIcon';
import ButtonAdd from 'components/UI/Buttons/ButtonAdd';


export default class OverviewScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            styles: stylesLandscape
        };
        
    }

    componentDidMount() { 
        this.onLayoutChange();
    }

    // Drawer Navigation options
    static navigationOptions = {
        drawerLabel: 'Overview',
        drawerIcon: ({ tintColor }) => DrawerIcon(require('icons/Home.png'), tintColor)
    };

    // Screen Orientation changes
    onLayoutChange = event => {
        var {height, width} = Dimensions.get('window');
        console.log([width, height]);
        if(width > height){
            //landscape
            this.setState({styles: stylesLandscape});
        }else{
            //portrait
            this.setState({styles: stylesPortrait});
        }
    }

    render() {
        return (
            <Body {...this.props} title="Overview" style={styles.body} onLayout={this.onLayoutChange}>
                <View style={[styles.container, styles.body]}>
                    <Image source={require('images/logo.png')} style={[styles.logo, this.state.styles.logo]} resizeMode='contain' />
                    <View style={styles.text}>
                        <Text style={[styles.p, styles.purple, styles.h4]}>
                            "Follow your dreams and dedicate your life to all the things that you truly believe in,
                            for if you don't believe in something, you'll eventually fall for anything."
                        </Text>
                        <Text style={[styles.p, styles.purple, styles.h4]}>
                            - Anonymous
                        </Text>
                    </View>
                </View>
                <Text style={[styles.p, this.state.styles.tooltip]}>
                    To begin, create a task that you'd like to dedicate yourself to.
                </Text>
                <ButtonAdd {...this.props} style={styles.buttonAdd}/>
            </Body>
        );
    }
}

const styles = StyleSheet.create({
    body:{position:'absolute', top:0, bottom:0, left:0, right:0},
    container: {padding: 30 },
    logo: { marginVertical:10, width: 200, alignSelf: 'center', tintColor:AppStyles.logoColor },
    text: {alignSelf:'center'},
    h4: {fontSize:20},
    p: { fontSize:17, paddingBottom:15, color:AppStyles.textColor },
    purple: { color: AppStyles.color},
    buttonAdd:{alignSelf:'flex-end', bottom:20, right:20, position:'absolute'}
});

const stylesLandscape = StyleSheet.create({
    tooltip: {position:'absolute', bottom:5, right:100, height:60, maxWidth:'50%', textAlign:'right'},
    logo: {marginTop:30, marginBottom:20}
});

const stylesPortrait = StyleSheet.create({
    tooltip: {position:'absolute', bottom:15, left:30, maxWidth:250},
    logo: {marginTop:60, marginBottom:30}
});