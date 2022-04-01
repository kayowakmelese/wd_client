import React from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";

export interface Props {
    changeValue: any;
    selected: boolean;
}

interface State {
}

export default class Radio extends React.Component<Props, State> {
    constructor(Props: any) {
        super(Props);
        this.state = {}
    }

    render() {
        return (
            <TouchableOpacity
                onPress={() => this.props.changeValue()}
                style={[{
                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    borderWidth: Constants.borderWidth,
                    borderColor: Colors.gray,
                    alignItems: 'center',
                    justifyContent: 'center',
                }]}>
                {
                    this.props.selected ?
                        <View style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: Colors.secondaryColor,
                        }}/> : null
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {},
});
