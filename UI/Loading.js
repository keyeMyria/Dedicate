import React from 'react';
import {View, Animated, Easing} from 'react-native';
import {Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class Loading extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            rotate: new Animated.Value(1)
        }
    }

    componentDidMount() {
        this.rotateSvg();
    }

    rotateSvg(){
        Animated.sequence([
            Animated.timing(
                this.state.rotate,
                {
                    toValue: 0,
                    duration: 1.5 * 1000,
                    easing: Easing.linear,
                }
            ),
            Animated.timing(
                this.state.rotate,
                {
                    toValue: 1,
                    duration: 0,
                    easing: Easing.none,
                }
            )
        ]).start(() => {
            this.rotateSvg();
        });
    }

    render() {
        const motionStyle = {
            transform: [
                {rotate: this.state.rotate.interpolate(
                    {
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                    }
                )}
            ]
        };
        var color = this.props.color || AppStyles.color;
        return (
            <Animated.View style={[motionStyle, {width:64, height:64}]}>
            <SvgIcon {...this.props} size="large">
                <Path fill={color} d="M19.45 13.6q0-2.5-1.75-4.25-1.8-1.8-4.25-1.75-2.5 0-4.25 1.75-1.8 1.8-1.75 4.25-.05 2.45 1.75 4.25 1.75 1.75 4.25 1.75 2.45.05 4.25-1.75 1.75-1.75 1.75-4.25M10.2 27.85Q8.45 26.1 5.95 26.1T1.7 27.85Q-.05 29.6-.05 32.1t1.75 4.25q1.75 1.75 4.25 1.75t4.25-1.75q1.75-1.75 1.75-4.25t-1.75-4.25m3.5 16.6q-2.5 0-4.25 1.75-1.8 1.8-1.75 4.25 0 2.5 1.75 4.25 1.8 1.8 4.25 1.75 2.45.05 4.25-1.75 1.75-1.75 1.75-4.25.05-2.45-1.75-4.25-1.75-1.75-4.25-1.75m14.15 9.35q-1.75 1.75-1.75 4.25t1.75 4.25q1.75 1.75 4.25 1.75t4.25-1.75q1.75-1.75 1.75-4.25t-1.75-4.25q-1.75-1.75-4.25-1.75t-4.25 1.75m22.65-9.35q-2.45-.05-4.25 1.75-1.75 1.75-1.75 4.25t1.75 4.25q1.8 1.8 4.25 1.75 2.5 0 4.25-1.75 1.8-1.8 1.75-4.25.05-2.45-1.75-4.25-1.75-1.75-4.25-1.75m3.35-8.2Q55.6 38 58.1 38t4.25-1.75Q64.1 34.5 64.1 32t-1.75-4.25Q60.6 26 58.1 26t-4.25 1.75Q52.1 29.5 52.1 32t1.75 4.25M50.4 19.6q2.5 0 4.25-1.75 1.8-1.8 1.75-4.25 0-2.5-1.75-4.25-1.8-1.8-4.25-1.75-2.45-.05-4.25 1.75-1.75 1.75-1.75 4.25-.05 2.45 1.75 4.25 1.75 1.75 4.25 1.75m-14.15-9.35Q38 8.5 38 6t-1.75-4.25Q34.5 0 32 0t-4.25 1.75Q26 3.5 26 6t1.75 4.25Q29.5 12 32 12t4.25-1.75z"/>
            </SvgIcon>
            </Animated.View>
        );
    }
}