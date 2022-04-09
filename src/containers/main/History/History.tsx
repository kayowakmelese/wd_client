import React from "react";
import {ActivityIndicator, BackHandler, DeviceEventEmitter, StyleSheet, Text, View} from 'react-native'
import Colors from "../../../utils/colors";
import {Constants} from "../../../utils/constants";
import Strings from "../../../utils/strings";
import HistoryItem from "../../../components/HistoryItem";
import {getSecureStoreItem} from "../../../utils/CommonFunction";
import Transport from "../../../api/Transport";
import moment from "moment";
import { diff } from "react-native-reanimated";

export interface Props {
    navigation: any
}

interface State {
    historyList: any;
    isEmpty: boolean;
    index: number
}

export default class History extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            historyList: [],
            isEmpty: true,
            index: 0
        }
    }

    handleBackButtonClick = () => {
        return true;
    };

    componentWillMount() {
        DeviceEventEmitter.addListener('reloadHistory', (e: any) => {
            this.getAllHistory().finally(() => {
            })
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    async componentDidMount() {
        await this.getAllHistory()
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        const History = Strings.history
        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1,}}>
                <View style={{marginTop: 55, flexDirection: 'row', paddingHorizontal: 32, alignItems: 'center'}}>
                    <Text allowFontScaling={false}
                        // @ts-ignore
                          style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                        {History.headers[0]}</Text>
                </View>
                <View style={{
                    height: 54,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#191919',
                    marginTop: 35,
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
                          }}>{History.title}</Text>
                </View>

                {
                    this.state.isEmpty ?
                        (
                            <ActivityIndicator color={Colors.white} size={'large'} style={{margin: '25%'}}/>
                        )
                        : this.state.historyList.length === 0 ?
                            (
                                <Text // @ts-ignore
                                    style={{
                                        color: Colors.gray, alignSelf: 'center', marginVertical: '65%', fontStyle: 'italic',
                                        fontSize: 24, fontWeight: Constants.fontWeight
                                    }}>{'There is no request yet'}</Text>
                            )
                            : this.state.historyList.length > 0 &&
                            this.state.historyList.map((element: any, idx: number) => {
                                let offerDetail = {
                                    ...element.profile,
                                    rate: "100",
                                    reqDetail: [
                                        element.detail.serviceDate || "",
                                        element.pickupAddress,
                                        element.serviceType || "",
                                        {
                                            id: element.id || "",
                                            status: element.status || ""
                                        },
                                        element.detail
                                    ]
                                }
                                return (
                                    <HistoryItem key={idx}
                                                 serviceDetail={() => this.props.navigation.navigate('ServiceDetail', {
                                                     offerDetail,
                                                     isSend: false
                                                 })} history={element}/>
                                )
                            })
                }
            </View>
        );
    }

    async getAllHistory() {
        let token = await getSecureStoreItem('token')
        Transport.Request.getUserRequests(JSON.parse(token))
            .then((res) => {
                if (res.status === 200) {
                    console.log("historys",res.data.data)
                    let arr=res.data.data;
                    if(arr.length>0){
                        arr.sort(function(a:any,b:any){

                            return moment(b.createdAt).diff(moment(a.createdAt),'minutes');
                        })
                    }
                    console.log("historys2",res.data.data)
                    // this.sortHistory(res.data.data)
                    this.setState({historyList: arr})
                }
            }).finally(() => this.setState({isEmpty: false}))
            .catch(err => console.log(err))
    }
   
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

