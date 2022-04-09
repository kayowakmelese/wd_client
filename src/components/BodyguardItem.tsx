import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View,ActivityIndicator} from 'react-native'
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";
import {AntDesign} from "@expo/vector-icons";

export interface Props {
    details: any;
    navigation: any;
}

interface State {
    loaderImage:boolean
}

export default class BodyguardItem extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            loaderImage:false
        }
    }


    render() {
        return (
            <>
                {
                    this.props.details.map((detail: any, idx: number) => {
                        return (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => this.props.navigation.navigate('BodyguardDetail', {userProfile: detail})}
                                style={{
                                    marginBottom: 35,
                                    flexDirection: 'row', borderBottomWidth: Constants.borderWidth,
                                    borderColor: Colors.gray, paddingBottom: 15, marginHorizontal: 15,
                                    alignItems: 'center', justifyContent: 'space-around'
                                }}>
                                    {
                                        !this.state.loaderImage?<Image
                                        source={require('../assets/userIcon.png')}
                                        style={{
                                            borderWidth: detail.profilePicture === "" ? 1 : 0,
                                            borderColor: Colors.white,
                                            borderRadius: Constants.borderRadius * 10,
                                            width: 46, height: 46,position:'absolute',top:0
                                        }} resizeMode={'cover'}/>:null}
                                          <Image onLoadEnd={(ayo:void)=>{this.setState({loaderImage:true})}}
                                        source={{uri: detail.profilePicture}}
                                        style={{
                                            borderWidth: detail.profilePicture === "" ? 1 : 0,
                                            borderColor: Colors.white,
                                            borderRadius: Constants.borderRadius * 10,
                                            width: 46, height: 46
                                        }} resizeMode={'cover'}/>
                                    
                              
                                <View style={{width: '50%', paddingHorizontal: 25}}>
                                    <Text allowFontScaling={false}        // @ts-ignore
                                          style={{
                                              color: Colors.white, fontSize: 18,
                                              fontWeight: Constants.fontWeight, paddingBottom: 5
                                          }}>{`${detail.fullName}`}</Text>
                                    <Text allowFontScaling={false}
                                          style={{color: Colors.gray, fontSize: 14}}>{`$ ${detail.price}/day`}</Text>
                                </View>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <AntDesign name="star" size={15} color={Colors.secondaryColor}/>
                                    <Text allowFontScaling={false}         // @ts-ignore
                                          style={{
                                              color: Colors.secondaryColor,
                                              fontSize: 14,
                                              fontWeight: Constants.fontWeight
                                          }}>
                                        {` ${detail.rate}`}
                                    </Text>
                                    <Text allowFontScaling={false}
                                          style={{color: Colors.white, fontSize: 14}}>{` (${detail.rateCount})`}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};
