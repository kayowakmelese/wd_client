import React from "react";
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    DeviceEventEmitter,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import Colors from "../../../utils/colors";
import {Constants} from "../../../utils/constants";
import {FontAwesome} from "@expo/vector-icons";
import Strings from "../../../utils/strings";
import PaymentCard from "../../../components/PaymentCard";
import Button from "../../../components/Button";
import SuccessfulCard from "../../../components/SuccessfulCard";
import {getSecureStoreItem} from "../../../utils/CommonFunction";
import Transport from "../../../api/Transport";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    isLoading: boolean;
    cardIndex: number;
    isProcessing: boolean
    cards: any;
    success: boolean;
}


export default class PaymentMethods extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            isProcessing: false,
            isLoading: true,
            success: false,
            cardIndex: -1,
            cards: []
        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    };

    async getCardList() {
        let token = await getSecureStoreItem('token')
        Transport.Card.getCards(JSON.parse(token))
            .then(res => {
                let data = res.data
                if (data.status) {
                    this.setState({
                        cards: data.Items || []
                    })
                }
            }).finally(() => this.setState({isLoading: false}))
            .catch(err => console.log(err))
    }

    UNSAFE_componentWillMount() {
        DeviceEventEmitter.addListener('reRenderCard', (e: any) => {
            this.getCardList().then(r => {
            })
        })
        this.getCardList().then(r => {
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {

        const {isPaymentProcess, offerDetail} = this.props.route.params,
            PaymentMethod = Strings.paymentMethod

        return (
            <ScrollView contentContainerStyle={{
                flex: 1,
                justifyContent: 'space-between'
            }} style={{backgroundColor: Colors.primaryColor}}>

                <SuccessfulCard
                    successMessage={PaymentMethod.successMessage}
                    cardViewContent={undefined}
                    height={undefined} width={undefined} style={{}}
                    navigation={this.props.navigation}
                    modalVisible={this.state.success}
                    onRequestClose={() => {
                        this.setState({success: false})
                        this.props.navigation.navigate('Main')
                    }}/>
                <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                    <View
                        style={{
                            marginTop: 55,
                            marginBottom: 40,
                            flexDirection: 'row',
                            paddingHorizontal: 32,
                            alignItems: 'center',
                            paddingBottom: 25
                        }}>
                        <FontAwesome name="chevron-left" size={24} color={Colors.white} style={{marginRight: 25}}
                                     onPress={() => this.props.navigation.pop()}/>
                        <Text allowFontScaling={false} // @ts-ignore
                              style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                            {PaymentMethod.headers[0]}</Text>
                    </View>
                    {
                        this.state.isLoading ?
                            <ActivityIndicator style={{paddingVertical: '50%'}} size={"large"}
                                               color={Colors.secondaryColor}/> :
                            <ScrollView>
                                <PaymentCard cards={this.state.cards} onChangeCard={(cardIndex: number) => {
                                    this.setState({cardIndex})
                                    this.getCardList().then(r => {
                                    })
                                }} isSelect={isPaymentProcess} navigation={this.props.navigation}/>

                                <Button
                                    onPress={() => this.props.navigation.navigate('AddPaymentMethods', {cards: this.state.cards})}
                                    label={'+ Add new payment method'}
                                    isLoading={false}
                                    style={{
                                        borderWidth: Constants.borderWidth, borderColor: Colors.secondaryColor,
                                        backgroundColor: Colors.primaryColor, width: '85%', marginVertical: 25
                                    }}
                                    noBorder={false}
                                    disabled={false}/>
                                {
                                    isPaymentProcess &&
                                    <>
                                        <View style={{
                                            borderTopWidth: Constants.borderWidth, paddingVertical: 25,
                                            borderColor: Colors.gray, width: '85%', alignSelf: 'center'
                                        }}>
                                            <Text allowFontScaling={false} // @ts-ignore
                                                  style={{
                                                      color: Colors.secondaryColor,
                                                      fontSize: 12,
                                                      fontWeight: Constants.fontWeight
                                                  }}>{'PRICE'}</Text>
                                            {
                                                [
                                                    {
                                                        label: 'Total service cost',
                                                        value: `$ ${offerDetail.rate}`
                                                    },
                                                    {
                                                        label: 'Tax',
                                                        value: `$ ${offerDetail.rate * .15}`
                                                    },
                                                    {
                                                        label: 'Total',
                                                        value: `$ ${(offerDetail.rate * .15) + offerDetail.rate}`
                                                    },
                                                ].map((element: any, index: number) => {
                                                    return (
                                                        <View key={index} style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between',
                                                            marginVertical: 15
                                                        }}>
                                                            <Text allowFontScaling={false} // @ts-ignore
                                                                  style={{
                                                                      color: Colors.white,
                                                                      fontWeight: index === 2 ? Constants.fontWeight : 'normal'
                                                                  }}>{element.label}</Text>
                                                            <Text allowFontScaling={false} // @ts-ignore
                                                                  style={{
                                                                      color: Colors.white,
                                                                      fontWeight: index === 2 ? Constants.fontWeight : "normal"
                                                                  }}>{element.value}</Text>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>

                                        <View style={{alignSelf: 'center', marginVertical: 25}}>
                                            <Text allowFontScaling={false} style={{color: Colors.white}}>
                                                {'By placing this order, you agree to our'}
                                            </Text>
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <TouchableOpacity
                                                    onPress={() => this.props.navigation.navigate('Policy', {
                                                        policy: Strings.policy.terms,
                                                        button: false
                                                    })}>
                                                    <Text allowFontScaling={false}
                                                          style={{color: Colors.secondaryColor}}>
                                                        {'Condition of Use'}
                                                    </Text>
                                                </TouchableOpacity>
                                                <Text allowFontScaling={false}
                                                      style={{color: Colors.white, paddingVertical: 5}}>
                                                    {' and '}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => this.props.navigation.navigate('Policy', {
                                                        policy: Strings.policy.privacy,
                                                        button: false
                                                    })}>
                                                    <Text allowFontScaling={false}
                                                          style={{color: Colors.secondaryColor}}>
                                                        {'Privacy Notice'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <Button
                                            onPress={() => this.payWithStripe(offerDetail, this.state.cards[this.state.cardIndex])}
                                            label={`Pay $ ${(offerDetail.rate * .15) + offerDetail.rate}`}
                                            isLoading={this.state.isProcessing}
                                            style={{marginVertical: 25, width: '85%'}}
                                            noBorder={false}
                                            disabled={this.state.cardIndex === -1}/>

                                        <View style={{
                                            backgroundColor: '#191919',
                                            marginVertical: 25,
                                            alignItems: 'center'
                                        }}>
                                            <Text allowFontScaling={false} // @ts-ignore
                                                  style={{
                                                      paddingVertical: 15,
                                                      color: Colors.white,
                                                      fontWeight: Constants.fontWeight
                                                  }}>
                                                {Strings.services.footer.title}</Text>
                                            <Text allowFontScaling={false} style={{
                                                color: Colors.gray,
                                                textAlign: 'center', paddingHorizontal: 25
                                            }}>
                                                {Strings.services.footer.body}</Text>
                                            <Button onPress={() => this.props.navigation.navigate('Policy', {
                                                policy: Strings.policy.cancelationPolicy,
                                                button: false
                                            })}
                                                    label={Strings.services.footer.button}
                                                    isLoading={false}
                                                    style={{color: Colors.secondaryColor}}
                                                    noBorder
                                                    disabled={false}/>
                                        </View>

                                    </>
                                }
                            </ScrollView>
                    }
                </SafeAreaView>
            </ScrollView>
        );
    }

    async payWithStripe(offerDetail: any, cardDetail: any) {
        this.setState({isProcessing: true})

        let token = await getSecureStoreItem('token'),
            data = {
                receiverFullName: offerDetail.fullName,
                requestId: offerDetail.reqDetail[3]?.id,
                cardId: cardDetail.id,
                receiverEmail: offerDetail.email
            }

        Transport.Earnings.sendPayment(JSON.parse(token), data)
            .then(res => {
                let data = res.data
                if (data.code === 200) {
                    this.setState({success: true})
                } else {
                    Alert.alert('Error', 'Payment not sent to the EPO.')
                }
            })
            .finally(() => this.setState({isProcessing: false}))
            .catch(err => console.log(err))
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

