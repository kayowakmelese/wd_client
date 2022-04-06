import React from "react";
import {
    BackHandler,
    DeviceEventEmitter,
    Image,
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View
} from 'react-native'
import Colors from "../../../utils/colors";
import {AntDesign, FontAwesome} from "@expo/vector-icons";
import {Constants} from "../../../utils/constants";
import Strings from "../../../utils/strings";
import Button from "../../../components/Button";
import ErrorModal from "../../../components/errorModal";
import SuccessfulCard from "../../../components/SuccessfulCard";
import {changeToString, getSecureStoreItem, getType} from "../../../utils/CommonFunction";
import Transport from "../../../api/Transport";
import CustomModal from "../../../components/CustomModal";
import MapView, {Marker} from "react-native-maps";
import Card from "../../../components/Card";
import moment from "moment";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    index: number;
    isLoading: boolean;
    canceled: boolean;
    success: boolean;
    viewOnMap: boolean;
    showCounter: boolean;
    moneyOffer: number;
    locationName:any;
}

export default class ServiceDetail extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            index: 0,
            success: false,
            canceled: false,
            isLoading: false,
            viewOnMap: false,
            showCounter: false,
            moneyOffer: 0.00,
            locationName:""
        }
    }

    handleBackButtonClick = () => {
        DeviceEventEmitter.emit('reloadHistory')
        this.props.navigation.goBack();
        return true;
    };
    changesToString=async (lat:any,long:any)=>{
        let data=await changeToString(lat,long);
        this.setState({locationName:data})
    }

    UNSAFE_componentWillMount=async()=>{
        // await this.changesToString(this.props.route.params.offerDetail.reqDetail[1].latitude,this.props.route.params.offerDetail.reqDetail[1].longitude)

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
        const {offerDetail, isSend, isAccept} = this.props.route.params,
            Services = Strings.services
            console.log("offerdetail",offerDetail)
            
            this.changesToString(offerDetail.reqDetail[1].latitude,offerDetail.reqDetail[1].longitude)
        return (
            <ScrollView contentContainerStyle={{
                flex: 1,
                justifyContent: 'space-between'
            }} style={{backgroundColor: Colors.primaryColor}}>

                <CustomModal navigation={this.props.navigation}
                             modalVisible={this.state.viewOnMap}
                             onRequestClose={() => this.setState({viewOnMap: false})}
                             renderView={() => {
                                 return (
                                     <View style={{backgroundColor:'white',borderRadius:Constants.radius}}>
                                     <Card cardViewContent={() => {
                                         return (
                                             <>
                                                 {
                                                     
                                                    offerDetail.reqDetail[1] !== "Select location" &&
                                                     <MapView
                                                         zoomControlEnabled
                                                         region={
                                                             getType(offerDetail.reqDetail[1]) === "object" ?
                                                                 offerDetail.reqDetail[1] :
                                                                 JSON.parse(offerDetail.reqDetail[1]) || {
                                                                     "latitude": 0,
                                                                     "longitude": 0
                                                                 }
                                                         }
                                                         showsUserLocation
                                                         showsMyLocationButton
                                                         style={{
                                                             width: '100%',
                                                             height: '100%',
                                                             
                                                         }}>
                                                         <Marker
                                                             style={{borderColor: 'blue'}}
                                                             coordinate={
                                                                 getType(offerDetail.reqDetail[1]) === "object" ?
                                                                     offerDetail.reqDetail[1] : JSON.parse(offerDetail.reqDetail[1]) || {
                                                                     "latitude": 0,
                                                                     "longitude": 0
                                                                 }
                                                             }
                                                             title={"Pickup Address"}
                                                             // description={JSON.stringify(this.state.location)}
                                                         />
                                                     </MapView>
                                                  
                                                    }
                                                    </>
                                             
                                         )
                                     }} height={'85%'} width={'100%'} style={{borderWidth:0,elevation:0}}/>
                                     <Button disabled={false} style={{}} onPress={() => this.setState({viewOnMap: false})} label="Close map" noBorder={false} isLoading={false}/>
                                                    </View>
                                 )
                             }} center={false} style={{backgroundColor:'#00000050',borderRadius:0}}/>
                <SuccessfulCard
                    successMessage={Services.successMessage}
                    cardViewContent={undefined}
                    height={undefined}
                    width={undefined} style={{}}
                    navigation={this.props.navigation}
                    modalVisible={this.state.success}
                    onRequestClose={() => {
                        this.setState({success: false})
                        // DeviceEventEmitter.emit('resetData')
                        DeviceEventEmitter.emit('showHistory')
                        this.props.navigation.navigate('Main')
                    }}/>

                <ErrorModal navigation={this.props.navigation}
                            modalVisible={this.state.canceled}
                            onRequestClose={async (index: number) => {
                                if (index === 0) {
                                    await this.cancelRequest(offerDetail)
                                }
                                this.handleBackButtonClick()
                                this.setState({canceled: false})
                            }}
                            style={{}}
                            errorMessage={Services.errorMessage}
                            idx={this.state.index}/>

                <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1,}}>
                    <View
                        style={{
                            marginTop: 55,
                            marginBottom: 40,
                            flexDirection: 'row',
                            paddingHorizontal: 32,
                            alignItems: 'center',
                            borderBottomWidth: Constants.borderWidth,
                            borderColor: Colors.gray,
                            paddingBottom: 25
                        }}>
                        <FontAwesome name="chevron-left" size={24} color={Colors.white} style={{marginRight: 25}}
                                     onPress={() => this.handleBackButtonClick()}/>
                        <Text allowFontScaling={false} // @ts-ignore
                              style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                            {Services.headers[0]}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        width: '80%',
                        alignSelf: 'center',
                        alignItems: 'stretch',
                        marginBottom: 30
                    }}>
                        <Image
                            source={offerDetail.profilePicture === "" ? require('../../../assets/userIcon.png') : {uri: offerDetail.profilePicture}}
                            style={{
                                width: 55,
                                height: 55,
                                borderRadius: Constants.borderRadius * 100,
                                marginRight: 25
                            }}/>
                        <View style={{}}>
                            <Text allowFontScaling={false} // @ts-ignore
                                  style={{
                                      color: Colors.white,
                                      fontSize: 24,
                                      fontWeight: Constants.fontWeight
                                  }}>{offerDetail.fullName}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <AntDesign name="star" size={15} color={Colors.secondaryColor}/>
                                <Text allowFontScaling={false} // @ts-ignore
                                      style={{
                                          color: Colors.secondaryColor,
                                          fontWeight: Constants.fontWeight
                                      }}>{`  ${offerDetail.rate}`}</Text>
                                <Text allowFontScaling={false} style={{color: Colors.gray}}>{' (117)'}</Text>
                            </View>
                        </View>
                    </View>
                    <ScrollView style={{paddingHorizontal: 25}}>
                        {
                            [
                                {
                                    label: 'Date',
                                    value: offerDetail?.reqDetail[0] || []
                                },
                                {
                                    label: 'Pick up address',
                                    value: offerDetail?.reqDetail[1] || "   -"
                                },
                                {
                                    label: 'Type',
                                    value: offerDetail?.reqDetail[2] || "   -"
                                },
                                {
                                    label: 'Description',
                                    value: offerDetail?.reqDetail[4]?.description || {}
                                },
                                {
                                    label: 'Is Watch Dogg EPO armed?',
                                    value: offerDetail?.reqDetail[4]?.isArmed || false
                                }
                            ].map((service: any, idx: number) => {
                                console.log("service",service)
                                return (
                                    <View key={idx} style={{
                                        flexDirection: 'row',
                                        borderColor: Colors.gray,
                                        borderTopWidth: Constants.borderWidth / 2,
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingVertical: 20
                                    }}>
                                        <View style={{width: idx === 0 ? '80%' : '100%'}}>
                                            <View style={{justifyContent: 'space-between'}}>
                                                <Text allowFontScaling={false} // @ts-ignore
                                                      style={{
                                                          fontSize: 12, color:  Colors.gray,
                                                          fontWeight:  'normal'
                                                      }}>{service.label}</Text>

                                                {
                                                    typeof service.value == "boolean" &&
                                                    <Text allowFontScaling={false} // @ts-ignore
                                                                  style={{
                                                                      fontSize: 14,
                                                                      fontWeight: Constants.fontWeight,
                                                                      color: Colors.white
                                                                  }}>
                                                                {
                                                                    service.value?'EPO is Armed':'EPO is not armed'
                                                                }
                                                            </Text>
                                                        // <Switch
                                                        //     style={{
                                                        //         transform: [{scaleX: 1.5}, {scaleY: 1.5}],
                                                        //         marginRight: 25
                                                        //     }}
                                                        //     trackColor={{false: '#767577', true: Colors.secondaryColor}}
                                                        //     thumbColor={service.value ? Colors.white : Colors.white}
                                                        //     ios_backgroundColor={Colors.white}
                                                        //     disabled
                                                        //     value={service.value}
                                                        // />
                                                }
                                            </View>
                                            {
                                                idx === 0 ?
                                                    service?.value.length > 0 &&
                                                    service.value.map((date: string) => {
                                                        return (
                                                            <Text allowFontScaling={false} // @ts-ignore
                                                                  style={{
                                                                      fontSize: 14,
                                                                      fontWeight: Constants.fontWeight,
                                                                      color: Colors.white
                                                                  }}>
                                                                {
                                                                    moment(date).format('MM/DD/YYYY') || '-'
                                                                }
                                                            </Text>
                                                        )
                                                    })
                                                    :
                                                idx === 1 ?
                                                <View>
                                                <Text allowFontScaling={false} // @ts-ignore
                                                                  style={{
                                                                      fontSize: 14,
                                                                      fontWeight: Constants.fontWeight,
                                                                      color: Colors.white
                                                                  }}>
                                                               {this.state.locationName}
                                                            </Text>
                                                    
                                                        <Button onPress={() => this.setState({viewOnMap: true})}
                                                                label={'View On Map'} isLoading={false}
                                                                style={{}} noBorder disabled={false}/>
                                                    </View>
                                                    :
                                                    <Text allowFontScaling={false} // @ts-ignore
                                                          style={{
                                                              fontSize: 14,
                                                              fontWeight: Constants.fontWeight,
                                                              color: Colors.white
                                                          }}>{idx!==4?service.value.toString():null}</Text>
                                            }
                                        </View>
                                    </View>
                                )
                            })
                        }

                        {
                            (isAccept && !offerDetail.isPayed) &&
                            <View style={{
                                paddingVertical: 20,
                                borderTopWidth: Constants.borderWidth, borderColor: Colors.gray,
                                flexDirection: 'row', justifyContent: 'space-between'
                            }}>
                                <View style={{alignSelf: 'center'}}>
                                    <Text allowFontScaling={false} style={{color: Colors.white, fontSize: 14}}>
                                        <Text allowFontScaling={false} // @ts-ignore
                                              style={{
                                                  fontSize: 16,
                                                  paddingBottom: 5,
                                                  fontWeight: Constants.fontWeight
                                              }}>{offerDetail.rate}</Text> / Hour</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <AntDesign name="star" size={15} color={Colors.secondaryColor}/>
                                        <Text allowFontScaling={false} // @ts-ignore
                                              style={{
                                                  color: Colors.secondaryColor,
                                                  fontWeight: Constants.fontWeight
                                              }}>{' 98%'}</Text>
                                        <Text allowFontScaling={false} style={{color: Colors.gray}}>{' (117)'}</Text>
                                    </View>
                                </View>
                                <Button
                                    onPress={() => this.props.navigation.navigate('PaymentMethods', {
                                        isPaymentProcess: true,
                                        offerDetail
                                    })}
                                    label={`Accept & Pay $ ${offerDetail.rate} / hr`}
                                    isLoading={false}
                                    style={{width: '50%'}}
                                    noBorder={false}
                                    disabled={false}/>
                            </View>
                        }

                        {
                            offerDetail.reqDetail[3]?.status !== "Canceled" &&
                            (
                                <>
                                    <Button onPress={async () => {
                                        if (isSend) {
                                            await this.sendRequest(offerDetail, isSend)
                                        } else {
                                            this.setState({canceled: true})
                                        }
                                    }}
                                            label={isSend ? `Send $ ${offerDetail.reqDetail[3].toString()} Offer` : 'Cancel Job'}
                                            isLoading={this.state.isLoading}
                                            style={{
                                                backgroundColor: isSend ? Colors.secondaryColor : Colors.primaryColor,
                                                borderWidth: Constants.borderWidth * 1.5,
                                                borderColor: Colors.secondaryColor
                                            }}
                                            noBorder={false}
                                            disabled={false}/>
                                    <View
                                        style={{backgroundColor: '#191919', marginVertical: 25, alignItems: 'center'}}>
                                        <Text allowFontScaling={false} // @ts-ignore
                                              style={{
                                                  paddingVertical: 15,
                                                  color: Colors.white,
                                                  fontWeight: Constants.fontWeight
                                              }}>{Services.footer.title}</Text>
                                        <Text allowFontScaling={false} style={{
                                            color: Colors.gray,
                                            paddingHorizontal: 25,
                                            textAlign: 'center'
                                        }}>{Services.footer.body}</Text>
                                        <Button onPress={() => this.props.navigation.navigate('Policy', {
                                            policy: Strings.policy.cancelationPolicy,
                                            button: false
                                        })}
                                                label={Services.footer.button}
                                                isLoading={false}
                                                style={{color: Colors.secondaryColor}}
                                                noBorder
                                                disabled={false}/>
                                    </View>
                                </>
                            )
                        }
                    </ScrollView>
                </SafeAreaView>
            </ScrollView>
        );
    }

    async sendRequest(offerDetail: any, isSend: boolean) {
        if (isSend) {
            this.setState({isLoading: true})
            let token = await getSecureStoreItem('token'),
                data = {
                    "serviceType": offerDetail.reqDetail[2],
                    "hourlyOffer": offerDetail.reqDetail[3],
                    "receiverID": offerDetail.userID,
                    "receiverEmail": offerDetail.id,
                    "pickupAddress": JSON.parse(offerDetail.reqDetail[1]),
                    "detail": {
                        "serviceDate": getType(offerDetail.reqDetail[0]) === "array" ? offerDetail.reqDetail[0] : [offerDetail.reqDetail[0]],
                        "isArmed": offerDetail.reqDetail[4].isArmed,
                        "experiences": offerDetail.reqDetail[4].selectedOption,
                        "description": offerDetail.reqDetail[4].description
                    }
                }

            await Transport.Request.sendRequest(JSON.parse(token), data)
                .then(res => {
                    if (res.status === 201) {
                        this.setState({canceled: !isSend, success: isSend})
                    }
                }).finally(() => this.setState({isLoading: false}))
                .catch(err => console.log(err.message))
        } else {
            this.setState({canceled: true})
        }
    }

    async cancelRequest(offerDetail: any) {
        let data = {
            status: 'Canceled'
        }, token = await getSecureStoreItem('token')

        Transport.Request.changeStatus(JSON.parse(token), offerDetail.reqDetail[3]?.id || "", data)
            .then(res => {
                if (res.data.code === 200) {
                    this.setState({canceled: false})
                }
            }).finally(() => this.setState({isLoading: false}))
            .catch(err => console.log(err.message))
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};