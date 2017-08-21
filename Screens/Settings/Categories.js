import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Body from 'ui/Body';

export default class CategoriesScreen extends React.Component {
    constructor(props){
        super(props);
    }
  render() {
    return (
        <Body {...this.props} title="Categories">
            <View style={styles.container}>
                <Text>Categories used to organize Tasks</Text>
            </View>
        </Body>
    )
  }
}

const styles = StyleSheet.create({
   container:{padding:30} 
});