import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import IconPickerArrow from 'icons/IconPickerArrow';

export default class Picker extends React.Component {
    constructor(props){
        super(props);
        var selectedIndex = 0;
        for(var x = 0; x < this.props.items.length;x++){
            if(this.props.items[x].selected === true || 
                (this.props.selectedValue != null && this.props.items[x].value == this.props.selectedValue)
            ){
                selectedIndex = x; break;
            }
        }

        this.state = {
            items:this.props.items,
            selectedIndex:selectedIndex
        }
    }

    Update(items){
        this.setState({items:items});
    }

    selectItem(index){
        global.Modal.hide();
        this.props.onValueChange(this.state.items[index].key, index, this.state.items[index].label);
        this.setState({selectedIndex:index});
    }

    ShowModal = event => {
        if(this.state.items.length <= 1){return;}
        var that = this;
        global.Modal.setContent(this.props.title, () => {
            var i = 0;
            return (
                <View style={styles.modalContainer}>
                    {this.state.items.map((input) => {
                        i++;
                        var e = parseInt(i.toString());
                        return (
                            <TouchableOpacity key={input.key} onPress={() => {this.selectItem.call(that, e-1)}}>
                            <View style={styles.modalItemContainer}>
                                <Text style={styles.modalItemText}>{input.label}</Text>
                            </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )
        });
        global.Modal.show();
    }

    render(){
        return (
            <View>
                <TouchableOpacity onPress={this.ShowModal}>
                    <View style={[styles.selectedItem, this.props.styleItem]}>
                        <Text style={[styles.selectedText, this.props.styleText]}>
                            {this.state.items[this.state.selectedIndex] ? (this.state.items[this.state.selectedIndex].label) : ''}
                        </Text>
                    </View>
                    {this.state.items.length >= 1 && 
                        (
                            <View style={[styles.arrowButton, this.props.styleArrow]}>
                                <IconPickerArrow/>
                            </View>
                        )
                    }
                    
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    selectedItem:{paddingTop:11, paddingBottom:10, paddingRight:35, paddingLeft:7},
    selectedText:{fontSize:20, color:'#333'},
    arrowButton:{position:'absolute', right:10, top:23},

    //Modal styling
    modalContainer:{backgroundColor:AppStyles.backgroundColor, minWidth:'50%'},
    modalItemContainer:{paddingVertical:15, paddingHorizontal:30, borderBottomColor: AppStyles.separatorColor, borderBottomWidth:1},
    modalItemText:{}
});