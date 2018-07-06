import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from 'text/Text';
import AppStyles from 'dedicate/AppStyles';
import IconPickerArrow from 'icons/IconPickerArrow';

export default class Picker extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            selectedIndex: this.props.items.map(a => a.selected == true || (a.value || a.key) == this.props.selectedValue).indexOf(true) || 0
        }
    }

    componentDidUpdate(){
        var index = this.props.items.map(a => a.selected == true || (a.value || a.key) == this.props.selectedValue).indexOf(true) || 0;
        if(this.state.selectedIndex != index){
            this.setState({selectedIndex:index});
        }
    }

    selectItem(index){
        global.Modal.hide();
        if(this.props.onValueChange){
            this.props.onValueChange(this.props.items[index].value, this.props.items[index].key, index, this.props.items[index].label);
        }
        this.setState({selectedIndex:index});
    }

    ShowModal = () => {
        if(this.props.items.length <= 1){return;}
        var that = this;
        var i = 0;
        global.Modal.setContent(this.props.title, (
            <View style={this.styles.modalContainer}>
                {this.props.items.map((input) => {
                    i++;
                    var e = parseInt(i.toString());
                    return (
                        <TouchableOpacity key={'item' + input.key} onPress={() => {this.selectItem.call(that, e-1)}}>
                        <View style={this.styles.modalItemContainer}>
                            <Text style={this.styles.modalItemText}>{input.label}</Text>
                        </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        ));
        global.Modal.show();
    }

    render(){
        return (
            <View>
                <TouchableOpacity onPress={this.ShowModal}>
                    <View style={[this.styles.selectedItem, this.props.styleItem]}>
                        <Text style={[this.styles.selectedText, this.props.styleText]}>
                            {this.props.items[this.state.selectedIndex] ? (this.props.items[this.state.selectedIndex].label) : this.props.items[0].label}
                        </Text>
                    </View>
                    {this.props.items.length >= 1 && 
                        (
                            <View style={[this.styles.arrowButton, this.props.styleArrow]}>
                                <IconPickerArrow/>
                            </View>
                        )
                    }
                    
                </TouchableOpacity>
            </View>
        );
    }

    styles = StyleSheet.create({
        selectedItem:{paddingTop:11, paddingBottom:10, paddingRight:35, paddingLeft:7},
        selectedText:{fontSize:20, color:AppStyles.textColor},
        arrowButton:{position:'absolute', right:10, top:23},
    
        //Modal styling
        modalContainer:{backgroundColor:AppStyles.backgroundColor, minWidth:'50%'},
        modalItemContainer:{paddingVertical:15, paddingHorizontal:30, borderBottomColor: AppStyles.separatorColor, borderBottomWidth:1},
        modalItemText:{}
    });
}