import React from "react";
import {Alert, BackHandler, DeviceEventEmitter, SafeAreaView, ScrollView} from 'react-native'
import Colors from "../utils/colors";
import Footer from "../components/Footer";
import Notifications from "../containers/main/Notifications/Notifications";
import History from "../containers/main/History/History";
import Settings from "../containers/main/Settings";
import Home from "../containers/main/Home/Home";
import * as SecureStore from "expo-secure-store";
import ErrorModal from "../components/errorModal";
import {getSecureStoreItem, removeSecureStoreItem} from "../utils/CommonFunction";
import Transport from "../api/Transport";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    profileDetail: any;
    allFileSubmitted: boolean;
    modalVisible: boolean;
    currentTab: number;
    exit: boolean;
}

export default class Main extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            profileDetail: {},
            allFileSubmitted: false,
            modalVisible: false,
            currentTab: 0,
            exit: false
        }
    }

    handleBackButtonClick = () => {
        // this.props.navigation.goBack();
        this.setState({exit: true})
        return true;
    };

    async UNSAFE_componentWillMount() {
        DeviceEventEmitter.addListener('showHistory', (e: any) => {
            this.setState({currentTab: 2})
        })
        await this.getUserProfile();

        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        this.setState({currentTab: 0})
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    async componentDidMount() {
        let isAllFileSubmitted = await SecureStore.getItemAsync('isAllFileSubmitted')
        if (isAllFileSubmitted === 'True') {
            this.setState({allFileSubmitted: true})
        }
        await this.getUserProfile();
        DeviceEventEmitter.addListener('changeScreen', (e) => {
            this.setState({ currentTab: e.screen })
        })

    }

    render() {
        return (
            <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom: 55}}>
                    {
                        this.changeView(this.state.currentTab, this.props.navigation)
                    }
                </ScrollView>
                <Footer currentTab={this.state.currentTab}
                        activeTab={async (currentTab: number) => {
                            if (currentTab === 3) {
                                await this.getUserProfile()
                            }
                            this.setState({currentTab})
                        }}/>
                <ErrorModal
                    navigation={this.props.navigation}
                    modalVisible={this.state.exit}
                    onRequestClose={(index: number) => {
                        if (index === 0) {
                            this.setState({exit: false})
                            this.props.navigation.goBack()
                        } else {
                            this.setState({exit: false})
                        }
                    }}
                    style={{}}
                    errorMessage={{
                        title: 'Warning',
                        messages: ['Are you sure you want to exit\n' +
                        'from Watch Dogg?'],
                        buttons: ['Yes, Exit', 'Close']
                    }}
                    idx={0}/>
            </SafeAreaView>
        );
    }

    changeView(currentTab: number, navigation: any) {
        switch (currentTab) {
            case 0:
                return <Home
                    changeTab={(tab: number) => this.setState({currentTab: tab})}
                    allFileSubmitted={() => setTimeout(() => this.setState({allFileSubmitted: true}),
                        250)} navigation={navigation}/>
            case 1:
                return <Notifications navigation={navigation}/>
            case 2:
                return <History navigation={navigation}/>
            case 3:
                return <Settings
                    navigation={navigation} profileDetail={this.state.profileDetail}
                    refreshDetail={() => this.getUserProfile()}/>
        }
    }

    private async getUserProfile() {
        let token = await getSecureStoreItem('token')
        if (token !== null) {
            Transport.User.profileDetails(JSON.parse(token))
                .then(async (res: any) => {
                    if (res.data.status) {
                        const profileDetail = res.data.data
                        let usersExponentPushToken = profileDetail.exponentPushToken
                        let exponentPushToken = await getSecureStoreItem('exponentPushToken')
                        if (exponentPushToken) {
                            if (usersExponentPushToken.indexOf(JSON.parse(exponentPushToken)) === -1) {
                                usersExponentPushToken.push(JSON.parse(exponentPushToken))
                                this.addUserDevices(token, usersExponentPushToken)
                            }
                        }
                        this.setState({profileDetail})
                    }
                })
                .catch((err: any) => Alert.alert('Error', `Can not find user detail \n ${err}`, [
                    {
                        style: 'default',
                        text: 'Re-Login',
                        onPress: async () => {
                            await removeSecureStoreItem('token').then(async () => {
                                await removeSecureStoreItem('isAllFileSubmitted').finally(() => {
                                    this.props.navigation.navigate('Auth')
                                })
                            })
                        }
                    }
                ]))

        }
    }

    private addUserDevices(token: any, exponentPushToken: any) {
        Transport.User.updateProfile(JSON.parse(token), {
            exponentPushToken: exponentPushToken.filter((x: string, i: string, a: any) => a.indexOf(x) == i)
        }).catch((err: any) => console.log(err))
    }
}