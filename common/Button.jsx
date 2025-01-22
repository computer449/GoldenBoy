import React from 'react';
import { useFonts } from 'expo-font';
import { Button as ReactButton } from 'react-native'

export const Button = ({ children, title, color, onPress }) => {
    const [loaded] = useFonts({
        VarelaRound: require('../assets/fonts/VarelaRound-Regular.ttf'),
    });

    if (!loaded) {
        return null;
    }

    return (
        <ReactButton
            style={{ fontFamily: 'VarelaRound' }}
            title={title}
            color={color}
            onPress={onPress}>
            {children}
        </ReactButton>
    )
}
