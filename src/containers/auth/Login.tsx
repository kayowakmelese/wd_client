import React from "react";
import {Alert, BackHandler, Text, View} from 'react-native'
// @ts-ignore
import * as GoogleSignIn from 'expo-google-sign-in';
// @ts-ignore
import * as AuthSession from 'expo-auth-session';
import Colors from "../../utils/colors";
import Form from "../../components/Form";
import Button from "../../components/Button";
import ErrorModal from "../../components/errorModal";
import Strings from "../../utils/strings";
import {Constants} from "../../utils/constants";
import Transport from "../../api/Transport";
import {addToSecureStore, removeSecureStoreItem} from "../../utils/CommonFunction";
import CustomModal from "../../components/CustomModal";
import Card from "../../components/Card";
import Numbers from "../../components/Number";
import * as Facebook from 'expo-facebook'
export interface Props {
    navigation: any;
    loginData: any;
    onSignUp: any;
}

interface State {
    isLoading: boolean;
    codeValues: any;
    showVerification: boolean;
    loginInfo: any;
    error: boolean;
    disabled: boolean;
    loading: boolean;
    errors: any;
    user: any;
    fbLoading:boolean;

}

export default class Login extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            user: null,
            error: false,
            disabled: true,
            loading: false,
            errors: [],
            isLoading: false,
            codeValues: [],
            loginInfo: {},
            showVerification: false,
            fbLoading:false
        }
    }

    handleBackButtonClick = () => {
        // this.props.navigation.goBack();
        return true;
    };
    initAsync = async () => {
        await GoogleSignIn.initAsync({
            clientId: Constants.CLIENT_ID,
        });
        this._syncUserWithStateAsync().then(r => {
        });
    };

    _syncUserWithStateAsync = async () => {
        const user = await GoogleSignIn.signInSilentlyAsync();
        this.setState({user});
    };

    signOutAsync = async () => {
        await GoogleSignIn.signOutAsync();
        this.setState({user: null});
    };

    signInAsync = async () => {
        try {
            await GoogleSignIn.askForPlayServicesAsync();
            const {type, user} = await GoogleSignIn.signInAsync();
            if (type === 'success') {
                Alert.alert('User Info', JSON.stringify(user))
                this._syncUserWithStateAsync().then(r => {
                });
            }
        } catch ({message}) {
            alert('login: Error:' + message);
        }
    };
    facebookSignIn=async ()=>{
        try {
            this.setState({fbLoading:true})
            await Facebook.initializeAsync({
              appId: '685920829262126',
            });
            const { type, token, expirationDate, permissions, declinedPermissions }:any =
              await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile','email'],
              });
            if (type === 'success') {
              // Get the user's name
              
              const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
              let rsp=await response.json();
              const respo = await fetch(`https://graph.facebook.com/${rsp.id}?fields=id,name,email,picture&access_token=${token}`);

              let rspo=await respo.json();

            
            //   Alert.alert('Logged in!', `Hi ${rsp.name}!`);
              console.log("Logged info",JSON.stringify(rspo))
              this.facebookLogin(rspo.email).finally(()=>{
                this.setState({fbLoading:false})

              })
            } else {
              // type === 'cancel'
            }
          } catch ({ message }) {
            alert(`Facebook Login Error: ${message}`);
          }
    }

    onPress = () => {
        if (this.state.user) {
            this.signOutAsync().then(r => {
            });
        } else {
            this.signInAsync().then(r => {
            });
        }
    };

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {

        const {loginData, navigation} = this.props

        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1}}>

                <CustomModal
                    navigation={navigation} modalVisible={this.state.showVerification}
                    onRequestClose={() => this.setState({showVerification: false})}
                    renderView={() => {
                        return (
                            <Card cardViewContent={() => {
                                return (
                                    <View style={{
                                        width: '100%',
                                        backgroundColor: Colors.primaryColor,
                                        alignItems: 'center',
                                        padding: '5%'
                                    }}>
                                        <Text allowFontScaling={false}
                                            // @ts-ignore
                                              style={{
                                                  color: Colors.white,
                                                  fontSize: 24,
                                                  fontWeight: Constants.fontWeight
                                              }}>
                                            {Strings.auth.verification.header}</Text>
                                        <View
                                            style={{marginTop: '5%', marginBottom: '3%', marginLeft: -75}}>
                                            <Text allowFontScaling={false}
                                                  style={{
                                                      marginBottom: 10,
                                                      fontSize: 14,
                                                      color: Colors.white
                                                  }}>{Strings.auth.verification.title}</Text>
                                            <Text allowFontScaling={false}
                                                // @ts-ignore
                                                  style={{
                                                      // marginBottom: 19,
                                                      fontSize: 14,
                                                      textAlign: 'left',
                                                      fontWeight: Constants.fontWeight,
                                                      color: Colors.white
                                                  }}>{this.state.loginInfo.Email.toLowerCase() || ' --- '}</Text>
                                        </View>

                                        <Numbers error={this.state.error}
                                                 codeSubmitted={(codeValues: any) => {
                                                     this.setState({codeValues, disabled: false})
                                                 }} resetValue={false}
                                                 valueChanging={() => {
                                                     this.setState({
                                                         disabled: true,
                                                         error: false
                                                     })
                                                 }} isSecure={false}/>
                                        <Button onPress={() => {
                                            let pass = this.state.codeValues
                                            let verifyData: any = {
                                                "email": this.state.loginInfo.Email.toLowerCase(),
                                                "otp": parseInt(pass.join(''))
                                            }
                                            this.verifyCode(verifyData).finally(() => this.setState({isLoading: false}))
                                        }} label={'Verify'} isLoading={this.state.isLoading}
                                                style={{marginTop: 25}} noBorder={false}
                                                disabled={this.state.disabled}/>
                                    </View>
                                )
                            }} height={undefined} width={'110%'}
                                  style={{backgroundColor: Colors.primaryColor}}/>
                        )
                    }} center={false} style={{backgroundColor: Colors.primaryColor}}/>


                <ErrorModal
                    modalVisible={this.state.error}
                    onRequestClose={() => this.setState({error: false})}
                    style={{}}
                    errorMessage={loginData.errorMessage}
                    navigation={navigation}
                    idx={0}/>
                <Form
                    initialValue={this.state.loginInfo} data={loginData.forms}
                    onChangeText={(label: string, value: any) => {
                        let loginInfo = this.state.loginInfo
                        if (value.length !== 0) {
                            let errors = this.state.errors
                            const index = errors.indexOf(label);
                            if (index > -1) {
                                errors.splice(index, 1);
                                this.setState({errors})
                            }
                            loginInfo[label] = value
                        } else {
                            delete loginInfo[label]
                        }
                        this.setState({loginInfo})
                    }} error={this.state.errors}/>
                {
                    this.props.loginData.buttons.map((element: any, idx: number) => {
                        return <Button
                            key={idx}
                            disabled={idx === 0 && Object.keys(this.state.loginInfo).length !== 2}
                            onPress={() => {
                                switch (idx) {
                                    case 0:
                                        this.setState({isLoading: true})
                                        this.login().finally(() => this.setState({isLoading: false}))
                                        break;
                                    case 1:
                                        this.props.navigation.navigate('Reset', {
                                            reset: {
                                                ...Strings.auth.resetPassword,
                                                buttons: ['Next'],
                                            }
                                        })
                                        break
                                }
                            }} label={element} isLoading={idx === 0 && this.state.isLoading}
                            style={{width: '80%', marginTop: idx === 0 ? '12.5%' : '5%'}}
                            noBorder={idx === 1}/>
                    })
                }

                {/*//TODO: google sign in*/}

                <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: '5%'}}>
                    <View style={{
                        alignSelf: 'center',
                        borderBottomWidth: Constants.borderWidth,
                        borderColor: Colors.white,
                        width: '40%'
                    }}/>
                    <Text allowFontScaling={false} style={{color: Colors.white}}>{'OR'}</Text>
                    <View style={{
                        alignSelf: 'center',
                        borderBottomWidth: Constants.borderWidth,
                        borderColor: Colors.white,
                        width: '40%'
                    }}/>
                </View>
                {
                    [
                        {
                            icon: '',
                            name: 'Continue with Google'
                        },
                        {
                            icon: '',
                            name: 'Continue with Facebook'
                        }
                    ].map((button: any, idx: number) => {
                        return (
                            <Button
                                icon={idx === 0 ? 'google' : 'fb'}
                                key={idx} onPress={() => {
                                switch (idx) {
                                    case 1:
                                        this.facebookSignIn()
                                        break;
                                    case 0:
                                       
                                        this.signInAsync()
                                        break;
                                }
                            }}
                                label={button.name}
                                isLoading={idx===1?this.state.fbLoading:false}
                                style={{
                                    width: '80%',
                                    backgroundColor: idx === 0 ? Colors.white : Colors.fbColor,
                                    color: idx === 0 ? Colors.primaryColor : Colors.white
                                }}
                                noBorder={false}
                                disabled={false}/>
                        )
                    })
                }
            </View>
        );
    }

    async verifyCode(verifyData: any) {
        this.setState({isLoading: true})
        await Transport.Auth.verifyOTP(verifyData)
            .then((res: any) => {
                if (res.data.success) {
                    addToSecureStore('token', res.data.token).finally(() => this.props.navigation.navigate('Main'))
                } else {
                    removeSecureStoreItem('token')
                    this.setState({error: true, codeValues: []})
                }
            })
            .catch((error: any) => {
                removeSecureStoreItem('token')
                Alert.alert('Verification Error', "Invalid Verification Code!")
            })
    }

    async login() {
        let data = {
            "email": this.state.loginInfo.Email.toLowerCase(),
            "password": this.state.loginInfo.Password.toString(),
            "userRole": "Client"
        }
        await Transport.Auth.login(data).then(async (res: any) => {
            if (res.data.success) {
                await Transport.User.profileDetails(res.data.token).then(async (resProfile: any) => {
                    await addToSecureStore('profileDetail', JSON.stringify(resProfile.data.data))
                    if (resProfile.data?.data?.isVerified) {
                        addToSecureStore('token', res.data.token).finally(() => {
                            this.props.navigation.navigate('Main')
                            this.setState({
                                error: false,
                                errors: []
                            })
                        })
                    } else {
                        await Transport.Auth.sendOTP({
                            "email": this.state.loginInfo.Email.toLowerCase()
                        }).then((otpres: any) => {
                            if (otpres.data.success) {
                                this.setState({showVerification: true})
                            }
                        }).catch(err => Alert.alert('OTP Error', err.message))
                    }
                }).catch(err => Alert.alert('Error', err.message))
            } else {
                this.setState({error: true, errors: ["Email", "Password"]})
            }
        }).catch(() => this.setState({error: true, errors: ["Email", "Password"]}))
    }
    async facebookLogin(email:string) {
        let data = {
            "email": email,
            "userRole": "Client"
        }
        await Transport.Auth.facebookLogin(data).then(async (res: any) => {
            if (res.data.success) {
                await Transport.User.profileDetails(res.data.token).then(async (resProfile: any) => {
                    await addToSecureStore('profileDetail', JSON.stringify(resProfile.data.data))
                    if (resProfile.data?.data?.isVerified) {
                        addToSecureStore('token', res.data.token).finally(() => {
                            this.props.navigation.navigate('Main')
                            this.setState({
                                error: false,
                                errors: []
                            })
                        })
                    } else {
                        await Transport.Auth.sendOTP({
                            "email": this.state.loginInfo.Email.toLowerCase()
                        }).then((otpres: any) => {
                            if (otpres.data.success) {
                                this.setState({showVerification: true})
                            }
                        }).catch(err => Alert.alert('OTP Error', err.message))
                    }
                }).catch(err => Alert.alert('Error', err.message))
            } else {
                this.setState({error: true, errors: ["Email"]})
            }
        }).catch(() => this.setState({error: true, errors: ["Email"]}))
    }
}
