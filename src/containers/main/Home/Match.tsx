import React from "react";
import {ActivityIndicator, BackHandler, DeviceEventEmitter, ScrollView, StyleSheet, Text, View} from 'react-native'
import Colors from "../../../utils/colors";
import {FontAwesome} from "@expo/vector-icons";
import {Constants} from "../../../utils/constants";
import BodyguardItem from "../../../components/BodyguardItem";
import Transport from "../../../api/Transport";
import {getSecureStoreItem} from "../../../utils/CommonFunction";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    sort: number;
    isLoading: boolean;
    bodyguardList: any;
}

export default class Match extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            sort: -1,
            isLoading: true,
            bodyguardList: []
        }
    }

    handleBackButtonClick = () => {
        // DeviceEventEmitter.emit('resetData')
        this.props.navigation.navigate('Main')
        return true;
    };

    async UNSAFE_componentWillMount() {
        const token = await getSecureStoreItem('token'),
            reqDetail = this.props.route.params?.detail || {}
            // console.log("changed",this.props.route.params)
            console.log("tokeno",token)
        Transport.User.allEPOs(JSON.parse(token))
            .then(async res => {
                let data = res.data.data
                let arr:any=[];
                data.map(async function (detail: any) {
                    console.log("detailst",JSON.stringify(detail.email))

                    // if (parseInt(detail.hourlyRate) < parseInt(reqDetail.reqDetail[3]))
                    // let min=parseInt(reqDetail[4].selectedOption[12])
                    // let max=parseInt(reqDetail[4].selectedOption[16])
                   
                    detail.reqDetail = reqDetail
                    detail.price = detail.hourlyRate
                    // let rates=await Transport.Request.getRating(token,detail.email,{}).catch((e)=>console.log("eras",e))
                    // console.log("rates",rates)
                     detail.rate = '98%'
                    detail.rateCount = 45
                    detail.aboutData = [detail.height, detail.weight, detail.age]
                    //  if(detail.status===0){
                        if(detail.isVerified){
                            console.log("details",reqDetail)
                            if(parseInt(detail.hourlyRate)<=parseInt(reqDetail[3])){
                                console.log("details","i was here")

                                if((detail.weaponCarrying!==null)===reqDetail[4].isArmed ){
                                    if(reqDetail[4].isMobile===detail.isMobile){
                                        arr.push(detail)
                                    }
                                }
                               
                            }
                            return detail;
                        }
                        
                        
                    //  }
                   
                   
                })
                console.log("bodyguards",arr)
                this.setState({bodyguardList: arr})
            }).finally(() => this.setState({isLoading: false}))
            .catch(err => console.log("matcherror",err))
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                <View style={{paddingHorizontal: 32, marginTop: 50, flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesome name="chevron-left" size={24} color={Colors.white} style={{marginRight: 25}}
                                 onPress={() => this.handleBackButtonClick()}/>
                    <Text allowFontScaling={false}
                        // @ts-ignore
                          style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                        {`EPO availability`}</Text>
                </View>
                {/*//TODO: User filter*/}
                {/*<View style={{*/}
                {/*    height: 54,*/}
                {/*    alignItems: 'center',*/}
                {/*    justifyContent: 'space-evenly',*/}
                {/*    backgroundColor: '#191919',*/}
                {/*    marginVertical: 25,*/}
                {/*    width: '100%',*/}
                {/*    flexDirection: 'row'*/}
                {/*}}>*/}
                {/*    <Text allowFontScaling={false} style={{color: Colors.white}}>{'Sort : '}</Text>*/}
                {/*    {*/}
                {/*        [*/}
                {/*            'Top Rated', 'Lowest'*/}
                {/*        ].map((sort: string, idx: number) => {*/}
                {/*            return (*/}
                {/*                <Button key={idx} onPress={() => {*/}
                {/*                    this.setState({sort: idx})*/}
                {/*                }}*/}
                {/*                        label={sort}*/}
                {/*                        isLoading={false}*/}
                {/*                        style={{*/}
                {/*                            height: 35,*/}
                {/*                            width: '25%',*/}
                {/*                            backgroundColor: this.state.sort === idx ? Colors.secondaryColor :*/}
                {/*                                Colors.primaryColor,*/}
                {/*                            borderColor: Colors.gray,*/}
                {/*                            borderRadius: Constants.borderRadius * 1.5,*/}
                {/*                            borderWidth: Constants.borderWidth*/}
                {/*                        }}*/}
                {/*                        noBorder={false}*/}
                {/*                        disabled={false}/>*/}
                {/*            )*/}
                {/*        })*/}
                {/*    }*/}
                {/*</View>*/}
                <ScrollView style={{marginVertical: 50}}>
                    {
                        this.state.isLoading ?
                            (
                                <ActivityIndicator color={Colors.white} size={'large'} style={{
                                    marginVertical: Constants.deviceHeight / 3,
                                    alignSelf: 'center',
                                    justifyContent: 'center'
                                }}/>
                            ) :
                            this.state.bodyguardList.length === 0 ?
                                (
                                    <Text // @ts-ignore
                                        style={{
                                            textAlign: 'center',
                                            marginVertical: Constants.deviceHeight / 3,
                                            color: Colors.gray,
                                            fontStyle: 'italic',
                                            fontSize: 24,
                                            fontWeight: Constants.fontWeight,
                                        }}>
                                        {"There is no Active EPO for now. \nplease try again"}
                                    </Text>
                                ) :
                                <BodyguardItem details={this.state.bodyguardList} navigation={this.props.navigation}/>
                    }
                </ScrollView>
            </View>
        );
    }
    
}


const styles = (props: any) => {
    return StyleSheet.create({});
};

