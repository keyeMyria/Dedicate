import React from 'react';
import { View, StyleSheet} from 'react-native';
import Textbox from 'fields/Textbox';
import MapView, {Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoder';

// NOTE: Find Google Android Maps Developer API Key within /android/app/src/main/AndroidManifest.xml : com.google.android.geo.API_KEY

export default class LocationPicker extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            location: {
                latitude: 28.040990,
                longitude: -82.693947,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            markers:[],
            timer:null,
            value: props.defaultValue || ''
        }

        //Geocoder fallback 
        Geocoder.fallbackToGoogle('AIzaSyCBmthrFiDHGhNXkLiXFNV_RZuvqBjXKYA');
    }

    componentWillMount() {
        if(this.state.value != ''){
            //load existing location into map
            this.onUpdateLocation(this.state.value);
        }else{
            //load user's current position into map
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    //create a marker for the location
                    var location = {latitude:position.coords.latitude, longitude:position.coords.longitude};
                    var marker = {
                        latlng: location,
                        title: this.props.markerTitle || 'Marker',
                        description: 'Current location'
                    };

                    //get top address based on latitude & longitude
                    Geocoder.geocodePosition({lat:location.latitude, lng:location.longitude}).then(results => {
                        if(results != null && results.length > 0){
                            this.setState({value:results[0].formattedAddress});
                        }
                    })
                    .catch((error) => {});

                    //update location & marker information in state
                    this.setState({
                        location:{
                            ...location,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        },
                        markers:[marker]
                    });
                },
                (error) => {},
                { timeout: 30000 }
            );
        }
    }

    onChangeText(text){
        //get longitude & latitude from location text
        var that = this;
        this.setState({value:text}, () => {
            clearTimeout(this.state.timer);
            this.setState({
                timer:setTimeout(function(){
                    that.onUpdateLocation.call(that, text);
                }, 2000)
            });
        });
    }

    onUpdateLocation(text){
        var that = this;
        //get longitude & latitude from address text
        Geocoder.geocodeAddress(text).then(
            (results) => {
                if(results.length > 0){
                    //get longitudeDelta & latitudeDelta from long & lat
                    var location = getRegionForCoordinates([
                        {latitude:results[0].position.lat, longitude:results[0].position.lng}
                    ]);

                    //create a marker for the location
                    var marker = {
                        latlng: {latitude:location.latitude, longitude:location.longitude},
                        title: this.props.markerTitle || 'Marker',
                        description: text
                    };

                    //check if formatted address is different from TextBox value
                    var value = results[0].formattedAddress;
                    var changed = this.state.value != value;
                    this.setState({ location:location, markers:[marker], value:value },
                        () => {
                            //raise onChangeEvent only if formatted address is different from TextBox value
                            if(changed == true && typeof this.props.onChangeText != 'undefined'){
                                this.props.onChangeText.call(that, value);
                            }
                        }
                    );
                }
            }
        ).catch(err => console.log(err))
    }

    render(){
        var that = this;
        return (
            <View>
                <View>
                    <Textbox {...this.props}
                        value={this.state.value}
                        onChangeText={(text) => {
                            if(typeof this.props.onChangeText != 'undefined'){
                                this.props.onChangeText.call(that, text);
                            }
                            this.onChangeText.call(that, text);
                        }}
                        maxLength={64}
                    ></Textbox>
                </View>
                <View style={[styles.mapContainer, this.props.mapStyle || {}]}>
                    <MapView style={styles.mapView} region={this.state.location}>
                        {this.state.markers.map(marker => (
                            <Marker key={'marker'} coordinate={marker.latlng} title={marker.title} description={marker.description}/>
                        ))}
                    </MapView>
                </View>
            </View>
        );
    }
}

function getRegionForCoordinates(points) {
    let minX, maxX, minY, maxY;

    // init first point
    ((point) => {
        minX = point.latitude;
        maxX = point.latitude;
        minY = point.longitude;
        maxY = point.longitude;
    })(points[0]);

    // calculate rect
    points.map((point) => {
        minX = Math.min(minX, point.latitude);
        maxX = Math.max(maxX, point.latitude);
        minY = Math.min(minY, point.longitude);
        maxY = Math.max(maxY, point.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    let deltaX = (maxX - minX);
    let deltaY = (maxY - minY);
    if(deltaX < 0.0043){deltaX = 0.01;}
    if(deltaY < 0.0043){deltaY = 0.01;}

    return {
        latitude: midX,
        longitude: midY,
        latitudeDelta: deltaX,
        longitudeDelta: deltaY
    };
}

const styles = StyleSheet.create({
    mapContainer:{width:'100%', height:200, justifyContent: 'flex-end', alignItems: 'center'},
    mapView:{position:'absolute', top:0, right:0, bottom:0, left:0 }
});