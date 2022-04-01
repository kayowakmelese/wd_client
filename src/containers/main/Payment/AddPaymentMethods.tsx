import React from "react";
import {
    Alert,
    BackHandler,
    DeviceEventEmitter,
    Keyboard,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native'
import Colors from "../../../utils/colors";
import {Constants} from "../../../utils/constants";
import {FontAwesome} from "@expo/vector-icons";
import Strings from "../../../utils/strings";
import Button from "../../../components/Button";
// @ts-ignore
import {CreditCardInput} from "react-native-credit-card-input";
import ErrorModal from "../../../components/errorModal";
import SuccessfulCard from "../../../components/SuccessfulCard";
import Transport from "../../../api/Transport";
import {getSecureStoreItem} from "../../../utils/CommonFunction";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    cvc: any;
    isLoading: boolean;
    cardError: boolean;
    index: number;
    success: boolean;
}

export default class AddPaymentMethods extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            cvc: {},
            isLoading: false,
            cardError: false,
            success: false,
            index: 0
        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    };

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {

        const PaymentMethod = Strings.paymentMethod,
            {cards} = this.props.route.params
        return (
            <ScrollView contentContainerStyle={{
                flex: 1,
                justifyContent: 'space-between'
            }} style={{backgroundColor: Colors.primaryColor}}>

                <SuccessfulCard
                    successMessage={PaymentMethod.addPaymentMethod.successMessage}
                    cardViewContent={undefined}
                    height={undefined} width={undefined} style={{}}
                    navigation={this.props.navigation}
                    modalVisible={this.state.success}
                    onRequestClose={() => {
                        this.setState({success: false})
                        DeviceEventEmitter.emit('reRenderCard', {})
                        this.props.navigation.pop()
                    }}/>

                <ErrorModal navigation={this.props.navigation}
                            modalVisible={this.state.cardError}
                            onRequestClose={(index: number) => {
                                if (this.state.index === 0 && index === 0) {
                                    this.props.navigation.goBack()
                                }
                                this.setState({cardError: false, index: 0})
                            }}
                            style={{}}
                            errorMessage={
                                this.state.index === 0 ?
                                    PaymentMethod.addPaymentMethod.exitMessage :
                                    PaymentMethod.addPaymentMethod.errorMessage}
                            idx={this.state.index}/>

                <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                    <View
                        style={{
                            marginVertical: 55,
                            marginBottom: 40,
                            flexDirection: 'row',
                            paddingHorizontal: 32,
                            alignItems: 'center',
                            paddingBottom: 25
                        }}>
                        <FontAwesome name="chevron-left" size={24} color={Colors.white} style={{marginRight: 25}}
                                     onPress={() => {
                                         this.setState({cardError: true})
                                         // this.props.navigation.pop()
                                     }}/>
                        <Text allowFontScaling={false} // @ts-ignore
                              style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                            {PaymentMethod.headers[0]}</Text>
                    </View>
                    <CreditCardInput
                        autoFocus
                        inputStyle={{
                            color: Colors.white,
                            fontSize: 16,
                            marginVertical: 25
                        }}
                        onChange={(form: any) => {
                            //CreditCardInput, LiteCreditCardInput
                            this.setState({cvc: form})
                        }}/>

                    {
                        this.state.cvc.status &&
                        this.state.cvc.status.cvc === 'valid' &&
                        Keyboard.dismiss()
                    }

                    <Button onPress={async () => {
                        if (!this.state.cvc.valid) {
                            this.setState({cardError: true, index: 1})
                        } else {

                            let card = this.state.cvc,
                                newCard = {
                                    cardNumber: card.values.number,
                                    expiryDate: card.values.expiry,
                                    cvc: card.values.cvc,
                                    image: card.values.type
                                }
                            // @ts-ignore
                            const index = cards.findIndex(i => i.cardNumber === newCard.cardNumber
                                && i.cardNumber === newCard.cardNumber)
                            if (index === -1) {
                                cards.push(newCard);
                            }
                            if (cards.length > 0) {
                                await this.addCard(newCard)
                            }
                        }
                    }}
                            label={PaymentMethod.addPaymentMethod.buttons[0]}
                            isLoading={this.state.isLoading}
                            style={{marginVertical: 50, width: '80%'}}
                            noBorder={false}
                            disabled={!(this.state.cvc.status && this.state.cvc.status.cvc === 'valid')}/>

                </SafeAreaView>
            </ScrollView>
        );
    }

    private async addCard(newCard: any) {
        this.setState({isLoading: true})
        let token = await getSecureStoreItem('token')

        await Transport.Card.addCard(JSON.parse(token), newCard)
            .then(res => {
                if (res.status === 201) {
                    this.setState({success: true})
                } else {
                    Alert.alert('Error', 'Couldn\'t add the card. please check the detail.')
                }
            }).finally(() => this.setState({isLoading: false}))
            .catch(err => console.log(err))
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

