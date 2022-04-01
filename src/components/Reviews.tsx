import React from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";
import {AntDesign} from "@expo/vector-icons";

export interface Props {
    reviews: any;
}

interface State {
}

export default class Reviews extends React.Component<Props, State> {
    constructor(Props: any) {
        super(Props);
        this.state = {}
    }

    render() {

        return (
            <View style={{marginHorizontal: 25, marginBottom: 10}}>
                {
                    this.props.reviews.length < 1 &&
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text allowFontScaling={false} // @ts-ignore
                              style={{
                                  color: Colors.white,
                                  fontSize: 25,
                                  fontWeight: Constants.fontWeight
                              }}>{'Reviews'}</Text>
                    </View>
                }
                {
                    this.props.reviews.length > 0 &&
                    this.props.reviews.map((review: any, idx: number) => {
                        return (
                            <View key={idx}>
                                <View style={{marginTop: 25}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Image source={review.avatar} style={{width: 46, height: 46}}
                                               resizeMode={'cover'}/>
                                        <View style={{marginLeft: 25, width: '63%'}}>
                                            <Text allowFontScaling={false} // @ts-ignore
                                                  style={{
                                                      color: Colors.white,
                                                      fontSize: 16,
                                                      fontWeight: Constants.fontWeight
                                                  }}>{review.name}</Text>
                                            <Text allowFontScaling={false}
                                                  style={{color: Colors.gray, fontSize: 14}}>{review.date}</Text>
                                        </View>
                                        <View style={{flexDirection: 'row'}}>
                                            <AntDesign name="star" size={15} color={Colors.secondaryColor}/>
                                            <Text allowFontScaling={false}         // @ts-ignore
                                                  style={{
                                                      color: Colors.secondaryColor,
                                                      fontSize: 14,
                                                      fontWeight: Constants.fontWeight
                                                  }}>
                                                {review.rate}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text allowFontScaling={false} style={{
                                        color: Colors.white,
                                        fontSize: 14,
                                        marginTop: 25
                                    }}>{review.comment}</Text>
                                </View>
                                <View style={{
                                    borderBottomWidth: idx < this.props.reviews.length - 1 ? Constants.borderWidth / 2 : 0,
                                    borderColor: Colors.gray,
                                    paddingVertical: 10
                                }}/>
                            </View>
                        )
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {},
});
