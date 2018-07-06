import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Text from 'text/Text';
import {Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class IconAnalytics extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            checked:this.props.defaultValue === true
        }

        this.onPress = this.onPress.bind(this);
    }

    onPress(){
        this.setState({checked:!this.state.checked}, () => {
            if(this.props.onChange){
                this.props.onChange(this.state.checked);
            }
        });
    }

    render(){
        var color = this.props.color || AppStyles.color;
        var colorNot = this.props.colorNot || AppStyles.textColor
        var border = this.props.borderColor || AppStyles.textColor;
        var size = this.props.size || {};

        return (
            <View>
                {this.props.nonchecked == true ?
                    <View style={{flexDirection:'row', flexWrap:'nowrap', overflow:'hidden', height:30}}>
                        <View style={[{position:'relative', top:-10 + (this.props.offsetTop || 0), left:-5}, this.props.style]}>
                            {this.state.checked === true ? 
                                <SvgIcon size={size}>
                                    <Path fill={border} d="M49 32l-4.05 4.05v6.35q0 2.55-2.55 2.55H19.6q-2.55 0-2.55-2.55v-8.5L13 29.25V42.4q0 6.6 6.6 6.6h22.8q6.6 0 6.6-6.6V32m-6.6-14.95h.5l3.3-3.25q-1.505-.8-3.8-.8H19.6Q13 13 13 19.6V28l4.05-4.05V19.6q0-2.55 2.55-2.55h22.8z"/>
                                    <Path fill={color} d="M55.35 19.65L51.1 15.4 32 34.5l-9.2-9.2-4.25 4.25 13.5 13.4 23.3-23.3z"/>
                                </SvgIcon>
                            : 
                                <SvgIcon size={size}>
                                    <Path fill={border} d="M42.4 49q6.6 0 6.6-6.6V19.6q0-6.6-6.6-6.6H19.6Q13 13 13 19.6v22.8q0 6.6 6.6 6.6h22.8m0-31.95q2.55 0 2.55 2.55v22.8q0 2.55-2.55 2.55H19.6q-2.55 0-2.55-2.55V19.6q0-2.55 2.55-2.55h22.8z"/>
                                    <Path fill={colorNot} fillOpacity={0.5} d="M23.25 20.45L20.4 23.3l7.75 7.75-7.7 7.8 2.8 2.8L31 33.9l7.8 7.8 2.8-2.9-7.75-7.75 7.75-7.75-2.8-2.8-6.65 6.65-.05-.05-1.1 1.1-7.75-7.75z"/>
                                </SvgIcon>
                            }
                        </View>
                        <Text style={[{fontSize:17, paddingTop:1}, this.props.textStyle]}>{this.props.text}</Text>
                    </View>
                :
                    <TouchableOpacity onPress={this.onPress}>
                        <View style={{flexDirection:'row', flexWrap:'nowrap', overflow:'hidden', height:30}}>
                            <View style={[{position:'relative', top:-10 + (this.props.offsetTop || 0), left:-5}, this.props.style]}>
                            {this.state.checked === true ? 
                                <SvgIcon size={size}>
                                    <Path fill={border} d="M49 32l-4.05 4.05v6.35q0 2.55-2.55 2.55H19.6q-2.55 0-2.55-2.55v-8.5L13 29.25V42.4q0 6.6 6.6 6.6h22.8q6.6 0 6.6-6.6V32m-6.6-14.95h.5l3.3-3.25q-1.505-.8-3.8-.8H19.6Q13 13 13 19.6V28l4.05-4.05V19.6q0-2.55 2.55-2.55h22.8z"/>
                                    <Path fill={color} d="M55.35 19.65L51.1 15.4 32 34.5l-9.2-9.2-4.25 4.25 13.5 13.4 23.3-23.3z"/>
                                </SvgIcon>
                            : 
                                <SvgIcon size={size}>
                                    <Path fill={border} d="M42.4 49q6.6 0 6.6-6.6V19.6q0-6.6-6.6-6.6H19.6Q13 13 13 19.6v22.8q0 6.6 6.6 6.6h22.8m0-31.95q2.55 0 2.55 2.55v22.8q0 2.55-2.55 2.55H19.6q-2.55 0-2.55-2.55V19.6q0-2.55 2.55-2.55h22.8z"/>
                                </SvgIcon>
                            }
                            </View>
                            <Text style={[{fontSize:17, paddingTop:1}, this.props.textStyle]}>{this.props.text}</Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>
        );
    }
}