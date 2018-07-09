import React from 'react';
import {View, Animated} from 'react-native';
import {Path} from 'react-native-svg';
import SvgIcon from 'ui/SvgIcon';
import AppStyles from 'dedicate/AppStyles';

export default class IconSwipeArrow extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            x:new Animated.Value(0)
        }

        //bind methods
        this.animate = this.animate.bind(this);
    }

    componentDidMount(){
        //start animation
        this.animate();
    }

    animate(){
        Animated.sequence([
            Animated.timing(
                this.state.x,
                {
                    toValue:1,
                    duration:1000
                }
            ),
            Animated.timing(
                this.state.x,
                {
                    toValue:0,
                    duration:0
                }
            )
        ]).start(this.animate);
    }

    render(){
        const color = this.props.color || AppStyles.textColor;
        let opacity = this.state.x.interpolate({
            inputRange:[0,1],
            outputRange:[this.props.opacity || 1, 0]
        });
        let x = 0;
        switch(this.props.direction){
            case null: case 'left': case 'back':
                x = this.state.x.interpolate({
                    inputRange:[0,1],
                    outputRange:[0, 20]
                });
                return (
                    <Animated.View style={{position:'relative', left:x, opacity:opacity}}>
                        <SvgIcon {...this.props}>
                            <Path fill={color} d="M43.95 4.55q.24-1.616-.75-2.95Q42.206.28 40.55.05 38.937-.189 37.6.8l-36 27q-.998.752-1.4 1.95-.39 1.188-.05 2.35.381 1.23 1.35 2l36 29q1.29 1.057 2.9.85 1.662-.155 2.7-1.45 1.047-1.288.85-2.95-.158-1.622-1.45-2.7l-32-25.75L42.4 7.2q1.318-.996 1.55-2.65z"/>
                        </SvgIcon>
                    </Animated.View>
                );
            case 'next': case 'right':
                x = this.state.x.interpolate({
                    inputRange:[0,1],
                    outputRange:[0, -20]
                });
                return (
                    <Animated.View style={{position:'relative', left:x, opacity:opacity}}>
                        <SvgIcon {...this.props}>
                            <Path fill={color} d="M63.8 32.15q.4-1.2 0-2.4t-1.4-1.95l-36-27q-1.35-1-3-.75-1.6.25-2.6 1.55-1 1.35-.75 3 .25 1.6 1.55 2.6l31.85 23.9L21.5 56.9q-1.3 1.05-1.5 2.7-.15 1.6.9 2.9 1.05 1.3 2.65 1.5 1.65.15 2.95-.85l36-29q.95-.8 1.3-2z"/>
                        </SvgIcon>
                    </Animated.View>
                );
        }
        
    }
}