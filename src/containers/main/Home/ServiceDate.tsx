import React from "react";
import {DeviceEventEmitter, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native'
import Colors from "../../../utils/colors";
import {FontAwesome} from "@expo/vector-icons";
import {Constants} from "../../../utils/constants";
import Calendar from "../../../components/Calendar";

export interface Props {
    navigation: any;
    route: any;
    data:any;
}

interface State {
    plans: any;
}

export default class ServiceDate extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            plans: ['Hourly', 'Daily', 'Weekly']
        }
    }

    render() {
        
        const {plan} = this.props.route.params || 0
        console.log("data9",this.props.route.params)
        return (
            <ScrollView contentContainerStyle={{
                flex: 1,
                backgroundColor: Colors.primaryColor,
                justifyContent: 'space-between'
            }}>
                <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                    <View
                        style={{
                            marginTop: 55,
                            marginBottom: 20,
                            flexDirection: 'row',
                            paddingHorizontal: 32,
                            alignItems: 'center'
                        }}>
                        <FontAwesome name="chevron-left" size={24} color={Colors.white} style={{marginRight: 25}}
                                     onPress={() => this.props.navigation.pop()}/>
                        <Text allowFontScaling={false}
                            // @ts-ignore
                              style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                            {`${this.state.plans[plan || 0]} Plan`}</Text>
                    </View>
                    <Calendar plan={plan || 0} datesSelected={this.props.route.params.data} navigation={this.props.navigation} selectedDates={(dates: any) => {
                        DeviceEventEmitter.emit('changeDate', {value: dates})
                    }}/>
                </SafeAreaView>
            </ScrollView>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

