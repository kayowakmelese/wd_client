import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";
import Radio from "./Radio";
import {AntDesign} from "@expo/vector-icons";
import ErrorModal from "./errorModal";
import Strings from "../utils/strings";
import * as SecureStore from "expo-secure-store";

export interface Props {
    cards: any;
    onChangeCard: any;
    isSelect: boolean;
    navigation: any;
}

interface State {
    idx: number;
    deleteCard: boolean;
    removedCard: any;
}

//card images
const master = require("../assets/mastercard.png")
const visa = require("../assets/visa.png")
const jcb = require("../assets/jcb.png")
const cardPlaceholder = require("../assets/card.png")
const diners = require("../assets/diners-club.png")
const americanExpress = require("../assets/americanExpress.png")

export default class PaymentCard extends React.Component<Props, State> {
    constructor(Props: any) {
        super(Props);
        this.state = {
            idx: -1,
            deleteCard: false,
            removedCard: {}
        }
    }

    render() {
        return (
            <>
                <ErrorModal navigation={this.props.navigation}
                            modalVisible={this.state.deleteCard}
                            onRequestClose={async (index: number) => {
                                if (index === 0) {
                                    let removeCard = this.state.removedCard
                                    let cardsString: any = await SecureStore.getItemAsync('cards')
                                    if (cardsString !== null) {
                                        let cards = JSON.parse(cardsString)
                                        // @ts-ignore
                                        const index = cards.findIndex(i => i.number === removeCard.number
                                            && i.name === removeCard.name)
                                        if (index > -1) {
                                            cards.splice(index, 1);
                                        }
                                        await SecureStore.setItemAsync('cards', JSON.stringify(cards))
                                            .finally(() => {
                                                this.props.onChangeCard()
                                            })
                                    }
                                }
                                this.setState({deleteCard: false})
                            }}
                            style={{}}
                            errorMessage={Strings.paymentMethod.deleteMessage}
                            idx={0}/>

                {
                    this.props.cards.length === 0 &&
                    <View style={{alignSelf: 'center', marginTop: '55%'}}>
                        <Text allowFontScaling={false} style={{textAlign: 'center', color: Colors.white}}>
                            {'You dont have any cards added\n' +
                            'Please add a card to process payments.'}
                        </Text>
                    </View>
                }
                {
                    this.props.cards.map((card: any, idx: number) => {
                        return (
                            <TouchableOpacity
                                key={idx} style={{
                                flexDirection: 'row',
                                marginHorizontal: 32,
                                marginVertical: 15,
                                borderWidth: Constants.borderWidth,
                                borderColor: Colors.gray,
                                padding: 15,
                                borderRadius: Constants.borderRadius * 1.5,
                                justifyContent: 'space-around',
                                alignItems: 'center'
                            }} onPress={() => {
                                this.setState({idx})
                                this.props.onChangeCard(idx)
                            }}>
                                <Image source={
                                    card.image === 'master-card' ? master :
                                        card.image === 'visa' ? visa :
                                            card.image === 'american-express' ? americanExpress :
                                                card.image === 'jcb' ? jcb :
                                                    card.image === 'diners-club' ? diners :
                                                        cardPlaceholder
                                }
                                       style={{width: 65, height: 51}} resizeMode={'center'}/>

                                <View style={{}}>
                                    <Text allowFontScaling={false}
                                          style={{color: Colors.white}}>{card.holderInfo}</Text>
                                    <Text allowFontScaling={false} // @ts-ignore
                                          style={{
                                              color: Colors.white,
                                              fontWeight: Constants.fontWeight
                                          }}>{`**** **** **** ${card.id.substr(card.id.length - 4, 4)}`}</Text>
                                </View>
                                {
                                    this.props.isSelect ?
                                        <Radio changeValue={() => {
                                            this.setState({idx})
                                            this.props.onChangeCard(idx)
                                        }} selected={idx === this.state.idx}/>
                                        : <AntDesign name="close" size={24} color={Colors.white}
                                                     onPress={() => this.setState({
                                                         deleteCard: true,
                                                         removedCard: card
                                                     })}/>
                                }
                            </TouchableOpacity>
                        )
                    })
                }
            </>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {},
});
