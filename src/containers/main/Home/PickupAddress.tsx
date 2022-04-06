import React from "react";
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    DeviceEventEmitter,
    Dimensions,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity
} from 'react-native'
import * as Location from 'expo-location';
import MapView, {Marker} from 'react-native-maps';
import {FontAwesome} from "@expo/vector-icons";

import Colors from "../../../utils/colors";
import {Constants} from "../../../utils/constants";
import Button from "../../../components/Button";
import { changeToString } from "../../../utils/CommonFunction";
import Transport from "../../../api/Transport";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    location: any;
    hintData:any;
    isLoading:boolean;
    searchString:any;
}

export default class PickupAddress extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            location: {},
            hintData:[],
            isLoading:false,
            searchString:""
        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    };

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    async componentDidMount() {
        await this.getUserLocation()
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{
                flex: 1,
                justifyContent: 'space-between'
            }} style={{backgroundColor: Colors.primaryColor}}>

                <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                    <View
                        style={{marginTop: 55, flexDirection: 'row', paddingHorizontal: 32, alignItems: 'center'}}>
                        <FontAwesome name="chevron-left" size={24} color={Colors.white} style={{marginRight: 25}}
                                     onPress={() => this.props.navigation.pop()}/>
                        <Text allowFontScaling={false}
                            // @ts-ignore
                              style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                            {'Select Pickup Location'}</Text>
                    </View>
                    <View style={{marginVertical: 25,flexDirection:'row', backgroundColor: Colors.white, width: '85%',alignSelf:'center',borderRadius: Constants.borderRadius * 2,}}>
                        <TextInput placeholder="search location" value={this.state.searchString} onChangeText={(e)=>{
                            this.setState({searchString:e})
                            e.length>0?this.getPlaceholder(e):this.setState({searchString:""})
                        }} style={{ padding: 15, width: '90%',borderRadius: Constants.borderRadius * 2, alignSelf: 'center'}}
                        
                        />
                        <ActivityIndicator size={'small'} color={'gray'} animating={this.state.isLoading}/>
                    </View>
                    {
                        this.state.hintData.length>0?<View style={{width:'85%',alignSelf:'center',backgroundColor:Colors.primaryColor,position:'absolute',top:175,borderRadius:Constants.borderRadius,zIndex:10,padding:10}}>
                        {
                            this.state.hintData.map((dat:any,i:number)=>{
                                return <TouchableOpacity onPress={()=>{
                                    this.getCoordinates(dat.place_id)
                                }} style={{backgroundColor:Colors.primaryColor,padding:10}}>
                                        <Text style={{color:Colors.textColor,fontWeight:'bold'}}>{dat.description}</Text>
                                        <Text style={{color:Colors.textColor_2}}>{dat.structured_formatting.secondary_text}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>:null
                    }
                    

                    {
                        Object.keys(this.state.location).length > 0 ?
                            <MapView
                                mapType={Platform.OS == "android" ? "mutedStandard" : "standard"}
                                zoomEnabled
                                zoomTapEnabled
                                zoomControlEnabled
                                region={this.state.location?.coords || this.state.location}
                                onPress={(event) => {
                                    let location = this.state.location?.coords
                                    location = event.nativeEvent.coordinate
                                    this.setState({location})
                                }}
                                minZoomLevel={12}
                                showsUserLocation 
                                showsCompass={true}
                                showsMyLocationButton
                                
                                style={styles(this.props).map}>
                                <Marker
                                    style={{borderColor: 'blue'}}
                                    coordinate={this.state.location?.coords || this.state.location}
                                    title={"Pickup Address"}
                                    // description={JSON.stringify(this.state.location)}
                                />
                            </MapView>
                            :
                            <ActivityIndicator size={'large'} color={Colors.secondaryColor}
                                               style={{paddingTop: '75%'}}/>
                    }
                    <Button onPress={() => {
                        changeToString(this.state.location.latitude,this.state.location.longitude).then((data)=>{
                            console.log("datax",data)
                            let arr={"latitude":this.state.location.latitude,"longitude":this.state.location.longitude,"name":data};
                            console.log("datay",arr)

                           

                            this.setState({location:arr})
                            console.log("fixhouse",arr)
                            DeviceEventEmitter.emit('changeLocation', {value: this.state.location})
                            this.props.navigation.pop()
                        })
                       
                    }}
                            label={'Continue'}
                            isLoading={false}
                            style={{position: 'absolute', bottom: 10, width: '60%', height: 40}}
                            noBorder={false}
                            disabled={this.state.location.coords}/>

                </SafeAreaView>
            </ScrollView>
        );
    }

    private async getUserLocation() {

        const {value} = this.props.route.params,
            {status} = await Location.requestForegroundPermissionsAsync();
        if (value === "Select location") {
            if (status !== 'granted') {
                Alert.alert('Permission Error', 'Permission to access location was denied', [
                    {
                        text: 'Retry',
                        onPress: async () => {
                            await this.getUserLocation()
                        }
                    },
                    {
                        text: 'Cancel',
                        onPress: () => this.props.navigation.pop()
                    },
                ]);
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            this.setState({location});
        } else {
            this.setState({location: JSON.parse(value)})
        }
    }
    async getPlaceholder(city:string) {
        this.setState({isLoading:true})
        Transport.maps.getAutoComplete(city).then((res)=>{
            if(res.status===200){
                    this.setState({hintData:res.data.predictions,isLoading:false})
            }
        })
    }
    async getCoordinates(cityId:string) {
        this.setState({searchString:""})
        Transport.maps.getCoordinate(cityId).then((res)=>{
            if(res.status===200){
                console.log("server",cityId)

                console.log("server",JSON.stringify(res.data))
                     this.setState({isLoading:false,hintData:[],location:{latitude:res.data.result.geometry.location.lat,longitude:res.data.result.geometry.location.lng}})
            
                    }
        })
    }
}

const styles = (props: any) => {
    return StyleSheet.create({
        map: {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        },
    });
};

