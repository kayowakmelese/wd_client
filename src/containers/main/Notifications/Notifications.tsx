import React from "react";
import {
    ActivityIndicator,
    BackHandler,
    DeviceEventEmitter,
    Linking,
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native'
import Colors from "../../../utils/colors";
import Strings from "../../../utils/strings";
import {Constants} from "../../../utils/constants";
import Button from "../../../components/Button";
import CustomModal from "../../../components/CustomModal";
import Card from "../../../components/Card";
import Transport from "../../../api/Transport";
import {getSecureStoreItem} from "../../../utils/CommonFunction";

export interface Props {
    navigation: any
}

interface State {
    contact: boolean;
    isLoading: boolean;
    isDetailLoading: boolean;
    notifications: any;
    phoneNumber: any;
    isLoadingId:any;
    isLoadingCategory:any;
    isLoadingCategory2:any;

}

export default class Notifications extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            contact: false,
            isLoading: true,
            notifications: [],
            isDetailLoading: false,
            phoneNumber: undefined,
            isLoadingId:null,
            isLoadingCategory:null,
            isLoadingCategory2:null

        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    };

    UNSAFE_componentWillMount() {
        this.getNotificationLists().then(r => {})
        DeviceEventEmitter.addListener('reloadHistory', async (e) => {
            this.setState({
                isLoading: true
            })
            await this.getNotificationLists().finally(() => {
                this.setState({isLoading: false})
            })
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    dialCall = () => {

        let phoneNumber = '';

        if (Platform.OS === 'android') {
            phoneNumber = `tel:${+251927721147}`;
        } else {
            phoneNumber = `telprompt:${+251927721147}`;
        }

        Linking.openURL(phoneNumber).then(r => {
        });
    };

    sendSMS = () => {

        let SMS = '';

        if (Platform.OS === 'android') {
            SMS = `sms:251927721147?body=This is a test message from the Watch Dogg`;
        } else {
            SMS = `sms:251927721147&body=This is a test message from the Watch Dogg?`;
        }

        Linking.openURL(SMS).then(r => {
        });
    };

    render() {
        const Notifications = Strings.notifications

        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1,}}>

                <CustomModal navigation={this.props.navigation}
                             modalVisible={this.state.contact && this.state.phoneNumber}
                             onRequestClose={() => this.setState({contact: false})}
                             renderView={() => {
                                 return (
                                     <>
                                         <Card cardViewContent={() => {
                                             return (
                                                 <View style={{width: '100%', flexDirection: 'column'}}>
                                                     <Text allowFontScaling={false}
                                                         // @ts-ignore
                                                           style={{
                                                               fontSize: 14, marginVertical: 20, textAlign: 'center',
                                                               fontWeight: Constants.fontWeight
                                                           }}>{Notifications.contact.title}</Text>
                                                     {
                                                         Notifications.contact.buttons.map((element: string, idx: number) => {
                                                             return (
                                                                 <Button key={idx} onPress={async () => {
                                                                     switch (idx) {
                                                                         case 0:
                                                                             this.setState({contact: false})
                                                                             this.sendSMS()
                                                                             break;
                                                                         case 1:
                                                                             this.setState({contact: false})
                                                                             this.dialCall()
                                                                             break
                                                                     }
                                                                 }}
                                                                         label={element}
                                                                         isLoading={false}
                                                                         style={{}}
                                                                         noBorder={false}
                                                                         disabled={false}/>
                                                             )
                                                         })
                                                     }
                                                 </View>
                                             )
                                         }} height={undefined} width={undefined} style={{}}/>
                                         <Button onPress={() => this.setState({contact: false})}
                                                 label={Notifications.contact.button}
                                                 isLoading={false}
                                                 style={{backgroundColor: Colors.white, color: Colors.primaryColor}}
                                                 noBorder={false} disabled={false}/>
                                     </>
                                 )
                             }}
                             center={false}
                             style={{}}/>


                <View style={{marginTop: 55, flexDirection: 'row', paddingHorizontal: 32, alignItems: 'center'}}>
                    <Text allowFontScaling={false}
                        // @ts-ignore
                          style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                        {Notifications.headers[0]}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center', marginVertical: 25}}>
                    {
                        this.state.isLoading ?
                            <ActivityIndicator size={'large'} color={Colors.secondaryColor}
                                               style={{paddingTop: '75%'}}/>
                            : this.state.notifications.length === 0 ?
                                <Text // @ts-ignore
                                    style={{
                                        color: Colors.gray, alignSelf: 'center', marginVertical: '75%', fontStyle: 'italic',
                                        fontSize: 24, fontWeight: Constants.fontWeight
                                    }}>{'There is no notifications yet!'}</Text>
                                : this.state.notifications.map((notification: any, idx: number) => {

                                    return (
                                        <View key={idx} style={{width: '100%', alignItems: 'center'}}>
                                            <View style={{
                                                height: 65,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                backgroundColor: '#191919',
                                                marginTop: 15,
                                                width: '100%',
                                                borderColor: Colors.gray,
                                                borderTopWidth: Constants.borderWidth / 2,
                                                borderBottomWidth: Constants.borderWidth / 2
                                            }}>
                                                <Text allowFontScaling={false}
                                                    // @ts-ignore
                                                      style={{
                                                          marginLeft: '7.5%',
                                                          color: Colors.white,
                                                          fontSize: 14,
                                                          fontWeight: Constants.fontWeight
                                                      }}>{notification.title}</Text>
                                                {
                                                    notification.title === 'New' &&
                                                    <View style={{
                                                        position: 'absolute',
                                                        right: '7.5%',
                                                        borderWidth: Constants.borderWidth,
                                                        borderColor: Colors.secondaryColor,
                                                        borderRadius: Constants.borderRadius * 10,
                                                        width: 26,
                                                height: 26,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: Colors.secondaryColor
                                            }}>
                                                <Text allowFontScaling={false}
                                                    // @ts-ignore
                                                      style={{
                                                          color: Colors.white,
                                                          fontSize: 14,
                                                          fontWeight: Constants.fontWeight
                                                      }}>{notification.lists.length}</Text>
                                            </View>
                                        }
                                    </View>
                                    <View style={{width: '100%', marginVertical: 15}}>
                                        {
                                            notification.lists.map((notificationDetail: any, index: number) => {

                                                return (
                                                    <View
                                                        key={index}
                                                        style={{
                                                            alignSelf: 'center',
                                                            width: '87.5%',
                                                            marginVertical: '2.5%',
                                                            paddingBottom: notification.lists.length !== index + 1 ? 15 : 0,
                                                            borderBottomWidth: notification.lists.length !== index + 1 ?
                                                                Constants.borderWidth : 0,
                                                            borderColor: Colors.gray
                                                        }}>
                                                        <Text allowFontScaling={false} // @ts-ignore
                                                              style={{
                                                                  paddingBottom: 5,
                                                                  color: Colors.white,
                                                                  fontSize: 18,
                                                                  fontWeight: Constants.fontWeight,
                                                              }}>{notificationDetail.title}</Text>
                                                        <Text allowFontScaling={false}
                                                              style={{color: Colors.white}}>{notificationDetail.body}
                                                            <Text allowFontScaling={false} // @ts-ignore
                                                                  style={{
                                                                      color: Colors.secondaryColor,
                                                                      fontSize: 14,
                                                                      fontWeight: Constants.fontWeight
                                                                  }}> {notificationDetail.price}</Text>
                                                        </Text>
                                                        <View style={{flexDirection: 'row', marginTop: 10}}>
                                                            {
                                                                Notifications.buttons.map((button: string, index2: number) => {
                                                                    console.log("btindex",index2+" "+index+button)

                                                                    if (notificationDetail.status.toLowerCase().includes('accepted') && index2 !== 2) {
                                                                        

                                                                        return (
                                                                            <Button
                                                                                key={index}
                                                                                onPress={async () => {

                                                                                    this.setState({isLoadingId:index,isLoadingCategory:index2,isLoadingCategory2:idx})
                                                                                    console.log("i am clicked",index2)
                                                                                    switch (index2) {
                                                                                        case 0:
                                                                                            this.setState({
                                                                                                contact: true,
                                                                                                phoneNumber: notificationDetail.phoneNumber
                                                                                            })
                                                                                            break;
                                                                                        case 1:
                                                                                            this.setState({isDetailLoading: true})
                                                                                            let offerDetail = await this.getNotificationDetail(notificationDetail.requestId)
                                                                                                .finally(() => {
                                                                                                    this.changeNotificationStatus(notificationDetail.requestId).finally(() => {
                                                                                                        this.setState({isDetailLoading: false})
                                                                                                    })
                                                                                                })
                                                                                            if (offerDetail) {
                                                                                                this.props.navigation.navigate('ServiceDetail',
                                                                                                    {
                                                                                                        offerDetail,
                                                                                                        isSend: false,
                                                                                                        isAccept: true
                                                                                                    })
                                                                                            }
                                                                                            break;
                                                                                    }
                                                                                }}
                                                                                label={button}
                                                                                isLoading={(this.state.isDetailLoading && this.state.isLoadingId===index && this.state.isLoadingCategory === index2 && this.state.isLoadingCategory2===idx)}
                                                                                style={{
                                                                                    width: '45%',
                                                                                    marginRight: 25
                                                                                }}
                                                                                noBorder={false}
                                                                                    disabled={false}/>
                                                                        )
                                                                    } else if (!notificationDetail.status.toLowerCase().includes('accepted') && index === 2) {
                                                                        return (
                                                                            <Button
                                                                                key={index}
                                                                                onPress={async () => {
                                                                                    let offerDetail = await this.getNotificationDetail(notificationDetail.requestId)
                                                                                    if (offerDetail) {
                                                                                        this.changeNotificationStatus(notificationDetail.requestId).finally(() => {
                                                                                            this.props.navigation.navigate('ServiceDetail',
                                                                                                {
                                                                                                    offerDetail,
                                                                                                    isSend: false
                                                                                                })
                                                                                        })
                                                                                    }
                                                                                }}
                                                                                label={button}
                                                                                isLoading={false}
                                                                                style={{width: '40%'}}
                                                                                noBorder={false}
                                                                                disabled={false}/>
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                        </View>
                                    )
                                })
                    }
                </View>
            </View>
        );
    }

    async changeNotificationStatus(notificationID: string) {
        let token = await getSecureStoreItem('token');
        Transport.Notifications.changeStatus(JSON.parse(token), notificationID)
        .catch(e => console.log(e))
    }

    private async getNotificationLists() {
        let token = await getSecureStoreItem('token');
        Transport.Notifications.getNotifications(JSON.parse(token))
            .then(async (res: any) => {
                if (res.status === 200) {
                    let notifications: any = [],
                        readNotifications: any = [],
                        unReadNotifications: any = []
                    await Promise.all(
                        res.data.Items.map(async function (item: any) {
                            if (item.isRead) {
                                readNotifications.push({
                                    status: item.type,
                                    requestId: item.id,
                                    title: item.messageTitle,
                                    body: item.messageBody,
                                    price: ''
                                })
                            } else {
                                unReadNotifications.push(
                                    {
                                        status: item.type,
                                        requestId: item.id,
                                        title: item.messageTitle,
                                        body: item.messageBody,
                                        date: new Date(item.createdAt).toLocaleDateString()
                                    }
                                )
                            }
                            return
                        })
                    ).catch(err => console.log(err))

                    if (unReadNotifications.length > 0) {
                        notifications[0] = {
                            title: 'New',
                            lists: unReadNotifications
                        }
                    }
                    if (readNotifications.length > 0) {
                        notifications[1] = {
                            title: 'Previous',
                            lists: readNotifications
                        }
                    }
                    this.setState({notifications})
                }
            }).finally(() => this.setState({isLoading: false}))
            .catch(err => console.log(err))
    }

    private async getNotificationDetail(requestId: string) {
        let token = await getSecureStoreItem('token'),
            offerDetail = undefined

        await Transport.Request.getDetail(JSON.parse(token), requestId)
            .then(res => {
                let data = res.data
                console.log("data",data)
                if (data.status) {
                    let element = data.data
                    offerDetail = {
                        ...element.profile,
                        isPayed: element.payed,
                        rate: element.hourlyOffer,
                        reqDetail: [
                            element.detail.serviceDate || "",
                            element.pickupAddress,
                            element.serviceType || "",
                            {
                                id: element.id || "",
                                status: element.status || ""
                            },
                            element.detail,
                        ]
                    }
                }
            })
            .catch(err => console.log(err))

        return offerDetail
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

