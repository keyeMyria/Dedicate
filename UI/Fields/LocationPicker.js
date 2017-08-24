import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Textbox from 'fields/Textbox';
import MapView from 'react-native-maps';
import MapTheme from 'ui/Maps/Themes/Default.js';

export default class LocationPicker extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            location: {
                latitude: 28.040990,
                longitude: -82.693947,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
        }
    }



    render(){
        return (
            <View>
                <View>
                    <Textbox 
                        ref="textinput"
                        style={this.props.textInputStyle || {}}
                        placeholder={this.props.placeholder || 'location'}
                        returnKeyType={this.props.returnKeyType || 'done'} 
                        blurOnSubmit={false}
                        onSubmitEditing={this.props.onSubmitEditing || {}}
                    ></Textbox>
                </View>
                <View style={styles.mapContainer}>
                    <MapView style={styles.mapView}
                        region={this.state.location}
                        
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mapContainer:{width:'100%', height:200, justifyContent: 'flex-end', alignItems: 'center'},
    mapView:{...StyleSheet.absoluteFillObject }


});