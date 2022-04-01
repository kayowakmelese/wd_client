import React from "react";
import {BackHandler, StyleSheet, Text, View} from 'react-native'
import Colors from "../utils/colors";
import Button from "../components/Button";
import {Constants} from "../utils/constants";
import {FontAwesome} from "@expo/vector-icons";

export interface Props {
    navigation: any;
    header: any;
    onSignUp: any;
    isLogin: boolean
}

interface State {
}

export default class AuthHeader extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {}
    }

    handleBackButtonClick = () => {
        // this.props.navigation.goBack();
        return true;
    };

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        return (
            <View style={styles(this.props).container}>
                {
                    this.props.isLogin ? null
                        : <FontAwesome name="close" size={24} color={Colors.white} style={{marginRight: '7.5%'}}
                                       onPress={() => this.props.onSignUp()}/>
                }
                <Text allowFontScaling={false} style={styles(this.props).headerTitle}>
                    {this.props.isLogin ? this.props.header.title : this.props.header.signUpTitle}</Text>
                {
                    this.props.isLogin ?
                        <Button onPress={() => this.props.onSignUp()} label={this.props.header.button} isLoading={false}
                                style={styles(this.props).signupButton} noBorder={false} disabled={false}/>
                        : null
                }
            </View>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({
        container: {
            backgroundColor: Colors.primaryColor,
            marginHorizontal: 32,
            marginVertical: 65.5,
            flexDirection: 'row',
            justifyContent: props.isLogin ? 'space-between' : 'flex-start',
            alignItems: 'center'
        },
        headerTitle: {
            color: Colors.white,
            fontSize: 24, // @ts-ignore
            fontWeight: Constants.fontWeight
        },
        signupButton: {
            backgroundColor: Colors.primaryColor,
            borderColor: Colors.secondaryColor,
            borderWidth: Constants.borderWidth,
            width: 125,
            height: 40
        }

    });
};

