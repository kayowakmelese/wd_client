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
    View
} from 'react-native'
import * as Location from 'expo-location';
import MapView, {Marker} from 'react-native-maps';
import {FontAwesome} from "@expo/vector-icons";

import Colors from "../../../utils/colors";
import {Constants} from "../../../utils/constants";
import Button from "../../../components/Button";
import { changeToString } from "../../../utils/CommonFunction";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    location: any;
}

export default class PickupAddress extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            location: {}
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
                    <View style={{marginVertical: 25}}>
                        {/*<TextInput*/}
                        {/*    style={{*/}
                        {/*        padding: 10, backgroundColor: Colors.white, width: '85%',*/}
                        {/*        borderRadius: Constants.borderRadius * 2,*/}
                        {/*        alignSelf: 'center'*/}
                        {/*    }}*/}
                        {/*/>*/}
                    </View>

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
                                showsUserLocation
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
}

const styles = (props: any) => {
    return StyleSheet.create({
        map: {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
        },
    });
};

