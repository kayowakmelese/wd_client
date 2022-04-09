import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";
import {Entypo} from "@expo/vector-icons";

export interface Props {
    serviceDetail: any;
    history: any;
}

interface State {
}

export default class HistoryItem extends React.Component<Props, State> {
    constructor(Props: any) {
        super(Props);
        this.state = {}
    }

    render() {
        const {history} = this.props

        return (
            <TouchableOpacity
                onPress={() => this.props.serviceDetail()}
                style={{
                    flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 10, alignItems: 'center',
                    paddingVertical: 25, borderBottomWidth: Constants.borderWidth, borderColor: Colors.gray
                }}>
                <Image
                    source={history?.profile?.profilePicture === "" ? require('../assets/userIcon.png') : {uri: history.profile.profilePicture || ""}}
                    style={{
                        height: 55, width: 55,
                        borderRadius: Constants.borderRadius * 100
                    }} resizeMode={'cover'}/>
                <View style={{width: '50%', paddingLeft: 10}}>
                    <Text allowFontScaling={false} // @ts-ignore
                          style={{
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: Constants.fontWeight
                          }}>{history.profile.fullName}</Text>
                    <Text allowFontScaling={false} style={{color: Colors.white, fontSize: 12}}>{'Skills: '}
                        <Text allowFontScaling={false} // @ts-ignore
                              style={{fontWeight: Constants.fontWeight}}>{history.detail.experiences}</Text>
                    </Text>
                    <Text allowFontScaling={false} style={{color: Colors.white, fontSize: 12}}>{'Hourly Rate: '}
                        <Text allowFontScaling={false} // @ts-ignore
                              style={{fontWeight: Constants.fontWeight}}>{history.hourlyOffer}</Text>
                    </Text>
                </View>
                <View
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{flexDirection:'row'}}>
                        <Text allowFontScaling={false}
                          style={{
                              color: history?.status.toLowerCase() == "pending" ? Colors.pending :
                                  history?.status.toLowerCase() == "accepted" ?
                                      Colors.active : Colors.secondaryColor, fontSize: 13
                          }}>{'Detail'}</Text>
                         
                        </View>
                    
                    <Entypo name="chevron-right" size={24}
                            color={history?.status.toLowerCase() == "pending" ? Colors.pending : history?.status.toLowerCase() == "accepted" ?
                                Colors.active : Colors.secondaryColor}/>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {},
});
