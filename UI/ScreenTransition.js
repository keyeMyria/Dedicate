import { Easing, Animated } from 'react-native';

export default ScreenTransition = () => ({
    transitionSpec: {
        duration: 250,
        easing: Easin.out(Easing.poly(4)),
        timing: Animated.timing,
    },
    screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps
        const { index } = scene

        const height = layout.initHeight
        const translateY = position.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [height, 0, 0],
        })

        const opacity = position.interpolate({
            inputRange: [index - 1, index - 0.99, index],
            outputRange: [0, 1, 1],
        })

        return { opacity, transform: [{ translateY }] }
    }
});