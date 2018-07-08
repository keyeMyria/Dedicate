import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Header from 'ui/Header';


export default class Body extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonType: this.props.buttonType ? this.props.buttonType : 'rec',
            layout:0
        }
    }

    render() {
        return (
            <View style={[this.styles.container, this.props.style]} onLayout={this.props.onLayout}>
                <Header {...this.props} />
                {this.props.noscroll == true ? this.props.children : 
                <ScrollView onScroll={this.props.onScroll} style={[this.styles.ScrollView, this.props.scrollViewStyle || {}]}  keyboardShouldPersistTaps="handled">
                {this.props.children}
                </ScrollView>
                }
            </View>
        );
    }

    styles = StyleSheet.create({
        container:{backgroundColor:AppStyles.backgroundColor},
        recordTooltip:{position:'absolute', bottom:90, right:26},
        buttonRecord:{alignSelf:'flex-end', zIndex:100, position:'relative', bottom:10},
        buttonAdd:{alignSelf:'flex-start', zIndex:100},
        footerStyle:{position:'relative', width:'100%'},
        footerContainer:{position:'absolute', flexDirection: 'row', justifyContent:'space-between', width:'100%', paddingHorizontal:20, bottom:0},
        footerMessageContainer:{position:'absolute', bottom:18, left:80},
        footerMessage:{paddingLeft:30, textAlign:'left', fontSize:16},
        bottomFade:{position:'absolute', left:0, bottom:-1, height:110}
    });
}