import React from "react";
import {StyleSheet, Text, View} from "react-native";
import Colors from "../utils/colors";

export interface Props {
    text: string
    height?: number
}

interface State {
}

export default class HeaderTitle extends React.Component<Props, State> {
    constructor(Props: any) {
        super(Props);
        this.state = {}
    }

    render() {
        return (
            <View style={{
                height: this.props.height || 54,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#191919',
                marginVertical: 25,
                width: '100%'
            }}>
                <Text allowFontScaling={false}
                      style={{color: Colors.white, fontSize: 14}}>{this.props.text}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {},
});
