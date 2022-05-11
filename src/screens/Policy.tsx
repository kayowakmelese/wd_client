import React from "react";
import {
    Alert,
    BackHandler,
    DeviceEventEmitter,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import Colors from "../utils/colors";
import {Entypo, FontAwesome, MaterialIcons} from "@expo/vector-icons";
import {Constants} from "../utils/constants";
import Button from "../components/Button";
import Transport from "../api/Transport";
import Form from "../components/Form";
import {addToSecureStore} from "../utils/CommonFunction";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    errors: any;
    isLoading: boolean;
    isLogin: boolean;
    isArmed: boolean;
    isMobile:boolean;
    description: string;
    selectedOption: any;
}

export default class Policy extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            errors: [],
            isLoading: false,
            isLogin: false,
            isArmed: false,
            isMobile:false,
            description: "",
            selectedOption: 1
        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    };

    UNSAFE_componentWillMount() {
        this.setState({
            errors: [],
            isLoading: false,
            isLogin: false,
            isArmed: false,
            description: "",
            selectedOption: -1
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        const {policy, button, signupInfo, buttonName} = this.props.route.params
        console.log("iambuttonname",buttonName)

        return (
            <SafeAreaView
                style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                <View
                    style={{paddingHorizontal: 32, marginTop: 50, flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesome
                        name="chevron-left" size={24} color={Colors.white} style={{marginRight: 25}}
                        onPress={() => this.props.navigation.pop()}/>
                    <Text allowFontScaling={false}
                        // @ts-ignore
                          style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                        {policy.title}</Text>
                </View>
                <ScrollView
                    style={{marginVertical: 25}}>
                    {
                        policy.subTitle ?
                            <Text
                                allowFontScaling={false}
                                // @ts-ignore
                                style={{
                                    color: Colors.white,
                                    fontWeight: Constants.fontWeight,
                                    paddingHorizontal: 32,
                                    fontSize: 14
                                }}>{policy.subTitle}</Text>
                            :
                            policy.experiences &&
                            <View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginVertical: 10,
                                    height: 54,
                                    paddingHorizontal: 30,
                                    backgroundColor: '#191919',
                                }}>
                                <View
                                    style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <MaterialIcons name="lock" size={26} color={Colors.secondaryColor}/>
                                    <Text allowFontScaling={false} // @ts-ignore
                                          style={{
                                              marginLeft: 10,
                                              color: Colors.white,
                                              fontSize: 14,
                                              fontWeight: Constants.fontWeight
                                          }}>{'Watch Dogg EPO armed?'}</Text>
                                </View>
                                <Switch
                                    style={{
                                        transform: [{scaleX: 1.2}, {scaleY: 1.2}],
                                        // marginRight: 25
                                    }}
                                    trackColor={{false: '#767577', true: Colors.secondaryColor}}
                                    thumbColor={this.state.isArmed ? Colors.white : '#FFFFFF50'}
                                    ios_backgroundColor={Colors.secondaryColor}
                                    onValueChange={() => this.setState({isArmed: !this.state.isArmed})}
                                    value={this.state.isArmed}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginVertical: 10,
                                    height: 54,
                                    paddingHorizontal: 30,
                                    backgroundColor: '#191919',
                                }}>
                                <View
                                    style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <MaterialIcons name="lock" size={26} color={Colors.secondaryColor}/>
                                    <Text allowFontScaling={false} // @ts-ignore
                                          style={{
                                              marginLeft: 10,
                                              color: Colors.white,
                                              fontSize: 14,
                                              fontWeight: Constants.fontWeight
                                          }}>{'Watch Dogg EPO Mobile?'}</Text>
                                </View>
                                <Switch
                                    style={{
                                        transform: [{scaleX: 1.2}, {scaleY: 1.2}],
                                        // marginRight: 25
                                    }}
                                    trackColor={{false: '#767577', true: Colors.secondaryColor}}
                                    thumbColor={this.state.isMobile ? Colors.white :'#FFFFFF50'}
                                    ios_backgroundColor={Colors.secondaryColor}
                                    onValueChange={() => this.setState({isMobile: !this.state.isMobile})}
                                    value={this.state.isMobile}
                                />
                            </View>
                            </View>
                    }
                    {/* <View style={{width: '90%', marginHorizontal: '5%'}}>
                        {
                            policy.experiences &&
                            policy.experiences.map((option: string, idx: number) => {
                                return (
                                    <View key={idx} style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginVertical: 10
                                    }}>
                                        <Text allowFontScaling={false}
                                              style={{color: Colors.white, fontSize: 14}}>{option}</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({selectedOption: idx})
                                            }}
                                            style={{
                                                width: 37,
                                                height: 37,
                                                borderWidth: Constants.borderWidth,
                                                borderColor: Colors.white,
                                                borderRadius: Constants.borderRadius / 2,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                            {
                                                this.state.selectedOption === idx &&
                                                <View style={{
                                                    height: 28, width: 28, backgroundColor: Colors.secondaryColor,
                                                    alignItems: 'center'
                                                }}>
                                                    <Entypo name="check" size={24} color={Colors.white}/>
                                                </View>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                    </View> */}
                    <Form data={policy.form} onChangeText={(label: string, value: string) => {
                        console.log("vals",value)
                        if (value.split(' ').length < 76) {
                            this.setState({errors: [], description: value})
                        } else {
                            this.setState({errors: "Description"})
                            Alert.alert("Error", "Description can not be more than 75 words!")
                        }
                    }} initialValue={this.state} error={this.state.errors}/>
                    <Text allowFontScaling={false} style={{
                        fontSize: 12.25,
                        textAlign: 'justify',
                        marginTop: 10,
                        paddingHorizontal: 32,
                        color: Colors.textColor_2
                    }}>{policy.body}</Text>
                    {
                        button &&
                        <Button onPress={() => {
                            if (buttonName) {
                                if (!policy.subTitle) {
                                    let value: any = this.state
                                    value.selectedOption = policy.experiences[this.state.selectedOption]
                                    delete value?.errors
                                    delete value?.isLoading
                                    delete value?.isLogin
                                    DeviceEventEmitter.emit('changeIndex', {value})
                                    this.props.navigation.pop()
                                }
                            } else {
                                this.setState({isLoading: true})
                                this.signUp(signupInfo)
                            }
                        }}
                                label={buttonName || 'I Agree'}
                                isLoading={this.state.isLoading}
                            // style={{width: '85%', marginTop: buttonName ? '50%' : null, marginBottom: 25}}
                                style={{
                                    width: '85%',
                                    position: 'relative',
                                    top: buttonName ? 100 : 10,
                                    marginBottom: 200
                                }}
                                noBorder={false}
                                disabled={!buttonName?false:this.state.description.trim().toString() === ""}
                        />
                    }
                </ScrollView>
            </SafeAreaView>
        );
    }

    signUp(signupInfo: any) {
        let data = {
            "userRole": "Client",
            "fullName": `${signupInfo.FirstName} ${signupInfo.LastName}`,
            "email": signupInfo.Email.toLowerCase(),
            "phoneNumber": signupInfo.PhoneNumber,
            "password": signupInfo.Password,
            "city": signupInfo.City,
            "state": signupInfo.State,
            "isAdmin": false
        }

        Transport.Auth.signup(data)
            .then((res: any) => {
                if (res.data.success) {
                    addToSecureStore('token', res.data.token).then(r => {
                        this.props.navigation.navigate('Verification', {
                            signupInfo: {
                                ...signupInfo,
                                isResetPassword: false
                            }
                        })
                    })
                } else {
                    Alert.alert('Error', res.data.data, [
                        {
                            text: "Login",
                            onPress: () => {
                                DeviceEventEmitter.emit('renderLogin')
                                this.props.navigation.navigate('Auth')
                            }
                        }

                    ])
                }
                this.setState({isLoading: false})
            })
            .catch((error: any) => {
                Alert.alert('Error', error)
                this.setState({isLoading: false})

            })
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

