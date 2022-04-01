import React from "react";
import {BackHandler, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";
import {FontAwesome, FontAwesome5} from "@expo/vector-icons";
// @ts-ignore
import SearchableDropdown from 'react-native-searchable-dropdown';

export interface Props {
    data: any;
    onChangeText: any;
    initialValue: any;
    error: any;
}

interface State {
    initialValue: any;
    secureTextEntryIdx: any;
}

export default class Form extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            secureTextEntryIdx: [],
            initialValue: {}
        }
    }

    handleBackButtonClick = () => {
        // this.props.navigation.goBack();
        return true;
    };

    UNSAFE_componentWillMount() {
        if (this.props.initialValue) {
            this.setState({initialValue: this.props.initialValue})
        }
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    formatPhoneNumber(phoneNumberString: any) {
        let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
        let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            let intlCode = (match[1] ? '+1 ' : '');
            return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
        }
        return phoneNumberString;
    }

    render() {
        return (
            <KeyboardAvoidingView
                style={{backgroundColor: Colors.primaryColor}}
                behavior="padding"
            >
                {
                    this.props.data && this.props.data.map((element: any, idx: number) => {
                        return (
                            <View key={idx} style={{marginHorizontal: 32, marginVertical: 15}}>
                                <Text allowFontScaling={false}
                                      style={{fontSize: 14, color: Colors.textColor_2}}>{element.title}</Text>
                                <View style={{flexDirection: 'row'}}>
                                    {
                                        element.type === 'SearchableDropdown' ?
                                            <SearchableDropdown
                                                onTextChange={(text: any) => {
                                                    // this.setState({[stateName]: text})
                                                    // this.props.onTextChange(stateName, text)
                                                }}
                                                onItemSelect={(item: any) => {
                                                    let initialValue = this.state.initialValue
                                                    initialValue[element.label] = item.name
                                                    this.setState({initialValue})
                                                    this.props.onChangeText(element.label, item.name)
                                                }}
                                                containerStyle={{flex: 1}}
                                                textInputStyle={{
                                                    borderRadius: Constants.radius,
                                                    padding: 10,
                                                    marginVertical: 10,
                                                    borderBottomWidth: Constants.borderWidth,
                                                    borderColor: Colors.gray,
                                                    color: Colors.white,
                                                }}
                                                itemStyle={{
                                                    padding: 10,
                                                    marginTop: 2,
                                                    borderColor: Colors.primaryColor,
                                                    borderBottomWidth: Constants.borderWidth,
                                                    backgroundColor: Colors.primaryColor,
                                                }}
                                                itemTextStyle={{
                                                    color: Colors.white
                                                }}
                                                itemsContainerStyle={{
                                                    maxHeight: 250,
                                                    color: Colors.white
                                                }}
                                                items={Constants.stateOptions}
                                                defaultIndex={0}
                                                placeholder={this.state.initialValue[element.label] || `Type your ${element.label} here`}
                                                placeholderTextColor={Colors.white}
                                                resetValue={false}
                                                underlineColorAndroid="transparent"
                                            /> :
                                            <TextInput
                                                maxLength={element.maxLength || null}
                                                keyboardType={element.type !== 'password' ? element.type : 'default'}
                                                allowFontScaling={false}
                                                onChangeText={(value: string) => {
                                                    let initialValue = this.state.initialValue
                                                    initialValue[element.label] = element.type === 'phone-pad' ? this.formatPhoneNumber(value) : value
                                                    this.setState({initialValue})
                                                    this.props.onChangeText(element.label, element.type === 'phone-pad' ? this.formatPhoneNumber(value) : value)
                                                }}
                                                value={this.state.initialValue[element.label]}
                                                autoFocus={idx === 0}
                                                focusable
                                                underlineColorAndroid={this.props.error.indexOf(element.label) >= 0 ? Colors.secondaryColor : Colors.textColor_2}
                                                // @ts-ignore
                                                style={{
                                                    flex: 1,
                                                    fontWeight: Constants.fontWeight,
                                                    color: Colors.white,
                                                    paddingVertical: 10,
                                                    paddingLeft: 5,
                                                    paddingRight: element.type === 'password' ? 50 : 10
                                                }}
                                                secureTextEntry={element.type === 'password' && this.state.secureTextEntryIdx.indexOf(idx) === -1}
                                                placeholder={element.hint}
                                                // numberOfLines={1}
                                                returnKeyType={this.props.data.length > 1 ? this.props.data.length - 1 === idx ? 'done' : "next" : 'done'}
                                                multiline={element.multiline}
                                                blurOnSubmit={true}
                                                placeholderTextColor={Colors.textColor_2}
                                                ref={(input) => {
                                                    // @ts-ignore
                                                    this[idx] = input;
                                                }}
                                                onSubmitEditing={() => {
                                                    if (this.props.data.length - 1 !== idx) {
                                                        // @ts-ignore
                                                        this[idx + 1]?.focus();
                                                    }
                                                }}
                                            />
                                    }
                                    {
                                        this.props.error.indexOf(element.label) >= 0 ?
                                            <FontAwesome5
                                                style={{position: 'absolute', right: 10}}
                                                name="exclamation-circle" size={20} color={Colors.secondaryColor}/>
                                            : element.type === 'password' ?
                                                <TouchableOpacity
                                                    style={{position: 'absolute', right: 10}}
                                                    onPress={() => {
                                                        let passIdx = this.state.secureTextEntryIdx
                                                        if (passIdx.indexOf(idx) === -1) {
                                                            passIdx.push(idx)
                                                        } else {
                                                            passIdx.splice(passIdx.indexOf(idx), 1)
                                                        }
                                                        this.setState({secureTextEntryIdx: passIdx})
                                                    }}>
                                                    <FontAwesome
                                                        name={this.state.secureTextEntryIdx.indexOf(idx) === -1 ? "eye-slash" : 'eye'}
                                                        size={24}
                                                        color={Colors.textColor_2}/>
                                                </TouchableOpacity>
                                                : null
                                    }
                                </View>
                            </View>
                        )
                    })
                }
            </KeyboardAvoidingView>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

