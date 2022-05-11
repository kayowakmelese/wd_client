import React from "react";
import {
    Alert,
    BackHandler,
    DeviceEventEmitter,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import Colors from "../../../utils/colors";
import {AntDesign} from "@expo/vector-icons";
import {Constants} from "../../../utils/constants";
import Strings from "../../../utils/strings";
import Button from "../../../components/Button";
import HeaderTitle from "../../../components/HeaderTitle";
import Card from "../../../components/Card";
import CustomModal from "../../../components/CustomModal";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Permissions from "expo-permissions";
import { changeToString, computeDates } from "../../../utils/CommonFunction";
import moment from "moment";

export interface Props {
    changeTab: any;
    navigation: any;
    allFileSubmitted: any;
}

interface State {
    idx: number;
    rate: number;
    doneIndex: any;
    selectedOptions: any;
    description: any;
    showTimePicker: boolean;
    plan: number;
    plans: any;
    type: boolean;
    data: any;
    selectedTime:any;
    selectedPlace:any;
    selectedText:any;
    progress:number;
}

export default class Home extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            idx: 2,
            plan: 0,
            rate: 0,
            selectedTime:new Date(),
            type: false,
            doneIndex: [],
            description: {},
            showTimePicker: false,
            plans: ['Hourly', 'Daily', 'Weekly'],
            selectedOptions: [],
            data: [
                'Select hour',
                'Select location',
                'Select one type'
            ],
            selectedPlace:"",
            selectedText:Strings.home.Home.required[3].subTitle[0],
            progress:0

        }
    }

    handleBackButtonClick = () => {
        // this.props.navigation.goBack();
        return true;
    };

    updateIndex = (doneIndex: any = this.state.doneIndex, idx: number = this.state.idx) => {
        if (doneIndex.indexOf(idx) === -1) {
            doneIndex.push(idx)
        }
        this.setState({doneIndex})
    }

    updateData = (id:any,value: any) => {
        let data = this.state.data
        data[id] = value
        console.log("insane",data)
        this.setState({data})
    }
    resetValue = (idx: number = this.state.idx) => {
        this.setState({
            idx: 2,
            plan: idx,
            rate: 0,
            type: false,
            doneIndex: [],
            showTimePicker: false,
            selectedPlace:"",

            selectedOptions: [],
            data: [
                `Select ${this.returnText(idx)}`,
                'Select location',
                'Select one type'
            ],
            selectedText:Strings.home.Home.required[3].subTitle[idx],
            progress:0

            
        })
    }
    returnText=(idx:number)=>{
        switch(idx){
            case 0:
                return "hour";
                case 1:
                    return "date";
                    default:
                        return "week";
        }
    }

    UNSAFE_componentWillMount() {
        let data = this.state.data
        DeviceEventEmitter.addListener('changeDate', (e) => {
            this.updateIndex()
            data[0] = e.value
            data[2] = 'Select one type'
            this.setState({data})
        })

        DeviceEventEmitter.addListener('changeIndex', (e) => {
            this.updateIndex()
            this.setState({description: e.value, selectedOptions: e.value.selectedOptions})
        })

        DeviceEventEmitter.addListener('changeLocation', (e) => {
            this.updateIndex()
            data[1] = JSON.stringify(e.value)
            // data[2] = 'Select one type'
            this.setState({data})
        })

        DeviceEventEmitter.addListener('resetData', () => {
            this.resetValue(0)
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {

        const Pending = Strings.home.Home,
            {detail} = Strings.home.Home.required[2]

        return (
            <ScrollView contentContainerStyle={{
                flex: 1,
                justifyContent: 'space-between'
            }} style={{backgroundColor: Colors.primaryColor}}>
                {
                    this.state.plan===0 && Platform.OS==='ios'?<>
                    <CustomModal 
                    style={{borderRadius:Constants.radius}}
                    modalVisible={this.state.plan===0 && this.state.showTimePicker && Platform.OS==='ios'}
                    center={false}                    
                    onRequestClose={() => this.setState({type: false})}
                    navigation={this.props.navigation} 
                    renderView={()=>{
                        
                        return <View style={{backgroundColor:Colors.white,borderRadius:Constants.radius,width:'100%',padding:10}}>
                            
                        <DateTimePicker
                        textColor="black"
                        style={{width:'100%',elevation:10,backgroundColor:'white'}}
                        value={this.state.data[0]==='Select hour'?new Date():new Date(this.state.data[0][this.state.data[0].length-1])}
                        mode={'time'}
                        is24Hour={false}
                        minimumDate={new Date()}
                        display='spinner'
                        onChange={(e: any) => {
                            let data = this.state.data
                            console.log("datais",this.state.data)
                            if (Platform.OS==='android'?e.type === "set":true) {
                                let selectedTime = new Date()
                                selectedTime.setTime(e.nativeEvent?.timestamp)
                                console.log("selected time",selectedTime)
                                if (new Date(moment().add(59,'minutes').toISOString()).getTime() < new Date(selectedTime).getTime()) {
                                    console.log("data length",data[0].length)
                                    data[0] = [new Date(selectedTime).toISOString()] || []
                                    // data[2] = 'Select one type'
                                    console.log("data2",data)
                                     this.setState({data})
                                    this.updateIndex()
                                } else {
                                    Alert.alert('Warning', 'Selected Time needs to have a one hour window!')
                                    // this.setState({showTimePicker: false})
                                }
                            } else {
                                  this.setState({data})
                            }
                        }}
                    />
                    <Button isLoading={false} style={{}} noBorder={false} disabled={false} onPress={()=>this.setState({showTimePicker:false})} label={"Continue"}/>
                    </View>
                    }}/>
                    
                   { Platform.OS!=='ios' && this.state.showTimePicker && <DateTimePicker
                        
                        value={new Date()}
                        mode={'time'}
                        is24Hour
                        style={{backgroundColor:'white',height:200}}
                        display="default"
                        onChange={(e: any) => {
                            let data = this.state.data
                            if (e.type === "set") {
                                let selectedTime = new Date()
                                selectedTime.setTime(e.nativeEvent?.timestamp)
                                if (new Date(moment().add(30,'minute').toISOString()).getTime() < new Date(selectedTime).getTime()) {
                                    data[0] = [new Date(selectedTime).toLocaleString()] || []
                                    // data[2] = 'Select one type'
                                    this.setState({data, showTimePicker: false})
                                    this.updateIndex()
                                } else {
                                    Alert.alert('Warning', 'Selected Time can not be past!')
                                    this.setState({showTimePicker: false})
                                }
                            } else {
                                this.setState({data, showTimePicker: false})
                            }
                        }}
                    />}</>
                    :null
                    
                }
                <CustomModal
                    navigation={this.props.navigation}
                    modalVisible={this.state.type}
                    onRequestClose={() => this.setState({type: false})}
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
                                                  }}>{// @ts-ignore
                                                detail.header}</Text>
                                            {
                                                // @ts-ignore
                                                detail.types.map((element: string, idx: number) => {
                                                    return (
                                                        <Button key={idx} onPress={() => {
                                                            this.updateData(1,element)
                                                            this.setState({type: false})
                                                            this.updateIndex()
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
                                {/*<Button onPress={() => this.setState({type: false})}*/}
                                {/*        label={detail.button.toString()}*/}
                                {/*        isLoading={false}*/}
                                {/*        style={{backgroundColor: Colors.white, color: Colors.primaryColor}}*/}
                                {/*        noBorder={false} disabled={false}/>*/}
                            </>
                        )
                    }} center={false} style={{}}/>

                <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                    <Image source={require("../../../assets/logo.png")}
                           style={{marginTop: 15, alignSelf: 'center', height: 100, width: 116}}
                           resizeMode={'contain'}/>
                    <HeaderTitle text={Pending.message}/>
                    <View style={{marginVertical: 25, flexDirection: 'row', justifyContent: 'space-evenly'}}>
                        {
                            this.state.plans.map((plan: any, idx: number) => {
                                return (
                                    <Button
                                        key={idx}
                                        onPress={() => this.resetValue(idx)}
                                        label={plan}
                                        isLoading={false}
                                        style={{
                                            width: '25%',
                                            backgroundColor: this.state.plan === idx ? Colors.secondaryColor
                                                : Colors.primaryColor,
                                            borderColor: Colors.secondaryColor,
                                            borderWidth: Constants.borderWidth,
                                            height: 35
                                        }}
                                        noBorder={false}
                                        disabled={false}/>
                                )
                            })
                        }
                    </View>
                    <View>
                        {this.state.progress!==0?
                            Pending.required.map((data: any, idx: number) => {
                                console.log("dataa",idx+JSON.stringify(data))
                                if (idx < 2 || idx > 3 ){
                                    return (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[styles(this.props).menus]}
                                            onPress={async () => {
                                                switch (idx) {
                                                    case 0:
                                                        if (this.state.plan === 0) {
                                                            this.setState({showTimePicker: true})
                                                        } else {
                                                            this.props.navigation.navigate('ServiceDate', {plan: this.state.plan,data:this.state.data[0]})
                                                        }
                                                        break;
                                                    case 1:
                                                        const {status} = await Permissions.getAsync(Permissions.LOCATION_BACKGROUND, Permissions.LOCATION_FOREGROUND, Permissions.LOCATION);
                                                        if (status !== 'granted') {
                                                            setTimeout(async () => {
                                                                await Permissions.askAsync(
                                                                    Permissions.LOCATION_BACKGROUND, Permissions.LOCATION_FOREGROUND, Permissions.LOCATION
                                                                )
                                                            }, 250)
                                                        }
                                                        this.state.doneIndex.indexOf(idx - 1) > -1 &&
                                                        this.props.navigation.navigate('PickupAddress', {value: this.state.data[1]})
                                                        break;
                                                    case 2:
                                                        if (this.state.doneIndex.indexOf(idx - 1) > -1) {
                                                            this.setState({type: true})
                                                        }
                                                        break;
                                                    case 4:
                                                        this.state.doneIndex.indexOf(idx - 1) > -1 &&
                                                        this.props.navigation.navigate('Policy', data.detail)
                                                        break;
                                                }
                                                this.setState({idx})
                                            }}>
                                            <View style={{alignItems: 'center'}}>
                                                {/*<Text allowFontScaling={false} style={{color: Colors.white, paddingBottom: 5}}>{'Step'}</Text>*/}
                                                <View style={styles(this.state.doneIndex.indexOf(idx)).order}>
                                                    <Text allowFontScaling={false}
                                                          style={{color: Colors.white, fontSize: 12}}>{idx + 1}</Text>
                                                </View>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                width: '75%'
                                            }}>
                                                <View>
                                                    <Text allowFontScaling={false}
                                                          style={{color: Colors.gray}}>{data.title}</Text>
                                                    {this.renderSubTitle(idx, this.state.plan, this.state.data)}
                                                </View>
                                                <View style={{position:'absolute',right:0,alignSelf:'center'}}>
                                                <AntDesign name='right' size={22} color={Colors.gray}
                                                           style={{alignSelf: 'center'}}/>
                                                           </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }else if(idx>=3){
                                return (
                                    <View key={idx}>
                                        <View style={[styles(this.props).menus]}>
                                            <View style={styles(this.state.doneIndex.indexOf(idx)).order}>
                                                <Text allowFontScaling={false}
                                                      style={{color: Colors.white, fontSize: 12}}>{idx + 1}</Text>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                width: '75%'
                                            }}>
                                                <Text allowFontScaling={false}
                                                      style={{color: Colors.gray}}>{this.state.selectedText}</Text>
                                                <View style={{
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <TouchableOpacity
                                                        disabled={this.state.doneIndex.indexOf(idx - 1) === -1}
                                                        style={{paddingHorizontal: 5}}
                                                        onPress={() => {
                                                            if (this.state.rate > 1) {
                                                                this.setState({rate: this.state.rate - 25, idx: 3})
                                                                this.updateIndex(this.state.doneIndex, 3)
                                                            }
                                                        }}>
                                                        <Text allowFontScaling={false}
                                                              style={{color: Colors.white, fontSize: 15}}>{'-'}</Text>
                                                    </TouchableOpacity>
                                                    <TextInput
                                                        value={"$ " + this.state.rate}
                                                        keyboardType={'decimal-pad'}
                                                        maxLength={9}
                                                        editable={this.state.doneIndex.indexOf(idx - 1) > -1}
                                                        onChangeText={(value) => {
                                                            if (value.length > 2) {
                                                                this.setState({
                                                                    rate: parseInt(value.replace('$ ', '')),
                                                                    idx: 3
                                                                })
                                                            } else {
                                                                this.setState({rate: 0, idx: 3})
                                                            }
                                                            this.updateIndex(this.state.doneIndex, 3)
                                                        }}
                                                        allowFontScaling={false}
                                                        style={{color: Colors.white, marginHorizontal: 25}}/>
                                                    <TouchableOpacity
                                                        disabled={this.state.doneIndex.indexOf(idx - 1) === -1}
                                                        style={{paddingHorizontal: 5}}
                                                        onPress={() => {
                                                            this.setState({rate: this.state.rate + 25, idx: 3})
                                                            this.updateIndex(this.state.doneIndex, 3)
                                                        }}>
                                                        <Text allowFontScaling={false}
                                                              style={{color: Colors.white, fontSize: 15}}>{'+'}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                                                    }
                            }):
                            <>
                            
                                    <View style={{width: '100%', flexDirection: 'column'}}>
                                        <Text allowFontScaling={false}
                                            // @ts-ignore
                                              style={{color:Colors.white,
                                                  fontSize: 14, marginVertical: 20, textAlign: 'center',
                                                  fontWeight: Constants.fontWeight
                                              }}>{// @ts-ignore
                                            detail.header}</Text>
                                        {
                                            // @ts-ignore
                                            detail.types.map((element: string, idx: number) => {
                                                return (
                                                    <TouchableOpacity key={idx} onPress={() => {
                                                        this.updateData(2,element)
                                                        this.setState({type: false,progress:1,idx:0})
                                                        this.updateIndex(this.state.doneIndex,2)
                                                    }}
                                                            style={[styles(this.props).menus]}
                                                           
                                                            disabled={false}>
                                                                <View style={{alignItems: 'center'}}>
                                                {/*<Text allowFontScaling={false} style={{color: Colors.white, paddingBottom: 5}}>{'Step'}</Text>*/}
                                                <View style={styles(this.state.doneIndex.indexOf(idx)).order}>
                                                    <Text allowFontScaling={false}
                                                          style={{color: Colors.white, fontSize: 12}}>{idx + 1}</Text>
                                                </View>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                width: '75%'
                                            }}>
                                                <View>
                                                    <Text allowFontScaling={false}
                                                          style={{color: Colors.white}}>{element}</Text>
                                                    {/* {this.renderSubTitle(idx, this.state.plan, this.state.data)} */}
                                                </View>
                                                <View style={{position:'absolute',right:0,alignSelf:'center'}}>
                                                <AntDesign name='right' size={22} color={Colors.gray}
                                                           style={{alignSelf: 'center'}}/>
                                                           </View>
                                            </View>
                                                            </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                
                          
                            {/*<Button onPress={() => this.setState({type: false})}*/}
                            {/*        label={detail.button.toString()}*/}
                            {/*        isLoading={false}*/}
                            {/*        style={{backgroundColor: Colors.white, color: Colors.primaryColor}}*/}
                            {/*        noBorder={false} disabled={false}/>*/}
                        </>}
                        
                    </View>
                    {
                        this.state.progress!==0?
                        <Button
                        onPress={() => {
                            if (this.state.rate !== 0) {
                                let detail = this.state.data
                                detail[3] = this.state.rate
                                detail[4] = this.state.description
                                console.log("thisisdetail",detail)
                                this.state.doneIndex.indexOf(4) > -1 &&
                                this.props.navigation.navigate('Match', {detail})
                            } else {
                                Alert.alert('Error', 'Offer per week can not be $ 0.00')
                            }
                        
                            
                        }}
                        label={'Continue'}
                        isLoading={false}
                        style={{width: '80%', marginVertical: 30}}
                        noBorder={false}
                        disabled={this.state.doneIndex.indexOf(4) === -1}/>:null
                    }
                    
                </SafeAreaView>
            </ScrollView>
        );
    }

    renderSubTitle(idx: number, plan: number, data: any) {
        switch (idx) {
            case 0:
                if (plan === 2 && typeof data[0] === 'object') {
                    return (
                        <View style={{flexDirection: 'column'}}>
                            {
                                data[0].map((date: string, idx: number) => {
                                    return (
                                        <Text key={idx} allowFontScaling={false}
                                              style={{color: Colors.white}}>{date}
                                        </Text>
                                    )
                                })
                            }
                        </View>
                    )
                }
                return (
                    <Text key={idx} allowFontScaling={false}
                          style={{color: Colors.white}}>{plan===0?data[0]!=='Select date' && data[0]!=='Select hour' && data[0]!=='Select week'?moment(data[0][0]).format('hh:mm a'):data[0]:data[0] || `Select ${this.state.plans[plan]}`}
                    </Text>
                )
            case 1:
                if (data[1].includes('Select')){
                    return (
                        <Text allowFontScaling={false}
                              style={{color: Colors.white}}>
                            {data[idx]}
                        </Text>
                    )
                }
                else{
                    console.log("data1",JSON.parse(data[1]))
                    return (
                        <Text allowFontScaling={false}
                              style={{color: Colors.white}}>
                            {JSON.parse(data[1]).name}
                        </Text>
                    )
                    
                   return undefined;
                
                }
            case 4:
                return undefined
            default:
                return (
                    <Text allowFontScaling={false}
                          style={{color: Colors.white}}>
                        {data[idx] || ''}
                    </Text>
                )
        }
    }
}

const styles = (index: any) => {
    return StyleSheet.create({
        menus: {
            // height: 58,
            borderWidth: Constants.borderWidth / 2,
            borderColor: Colors.gray,
            marginHorizontal: 25,
            marginVertical: 10,
            paddingVertical: 10.5,
            borderRadius: Constants.borderRadius / 1.5,
            flexDirection: 'row',
            alignItems: 'center',
        },
        order: {
            marginHorizontal: 25,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 26,
            width: 26,
            backgroundColor: index > -1 ? Colors.secondaryColor : Colors.gray,
            borderRadius: Constants.borderRadius * 100
        }
    });
};


