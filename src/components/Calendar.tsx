import React from "react";
import {BackHandler, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Colors from "../utils/colors";
import Strings from "../utils/strings";
import {AntDesign} from "@expo/vector-icons";
import {Constants} from "../utils/constants";
import moment from "moment";
import Button from "../components/Button";
import HeaderTitle from "./HeaderTitle";
import { computeDates } from "../utils/CommonFunction";

export interface Props {
    plan: number;
    navigation: any
    selectedDates: any;
    datesSelected:any;
}

interface State {
    label: number;
    monthIndex: number;
    weekdays: any;
    selectedDates: any;
}

export default class Calendar extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            label: 0,
            monthIndex: new Date().getMonth() || 0,
            selectedDates: [],
            weekdays: {
                sunday: [],
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
            },
        }
    }

    arrayRemove(arr: any, value: any) {
        return arr.filter(function (ele: any) {
            return ele != value;
        });
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    };

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.props.datesSelected!=='Select date' && this.props.datesSelected!=="Select week"?this.setState({selectedDates:this.props.datesSelected}):null
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        const {plan} = this.props

        const Available = Strings.home.available

        return (
            <ScrollView contentContainerStyle={{
                flex: 1,
                justifyContent: 'space-between'
            }} style={{backgroundColor: Colors.primaryColor}}>
                <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                    <HeaderTitle text={
                        this.state.selectedDates.length > 1 ?
                            `${moment(this.state.selectedDates[0]).format('MMM')} ${moment(computeDates(this.state.selectedDates,true)).format('MM-DD-YYYY dd')} to  ${moment(computeDates(this.state.selectedDates,false)).format('MM-DD-YYYY dd')}`
                            : 'Pickup Date'}/>

                    {
                        plan > 0 &&
                        <View style={{flex: 1, alignItems: 'center', marginVertical: 25}}>
                            {
                                Available.months.map((month: any, idx: number) => {
                                    if (this.state.monthIndex === idx)
                                        return (
                                            <View key={idx} style={{width: '100%', alignItems: 'center'}}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    width: '95%'
                                                }}>
                                                    <Text allowFontScaling={false}
                                                        // @ts-ignore
                                                          style={{
                                                              color: Colors.white,
                                                              fontSize: 18,
                                                              fontWeight: Constants.fontWeight
                                                          }}>{month}
                                                        {/*{new Date().getFullYear()}*/}
                                                    </Text>
                                                    <View style={{
                                                        width: '30%',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-evenly'
                                                    }}>
                                                        {
                                                            Available.buttons.map((button: string, idx: number) => {
                                                                return (
                                                                    <TouchableOpacity
                                                                        disabled={(Available.months.length === this.state.monthIndex + 1 && idx === 1) || (idx === 0 && this.state.monthIndex === 0)}
                                                                        key={idx}
                                                                        onPress={() => {
                                                                            let monthIndex = this.state.monthIndex
                                                                            switch (idx) {
                                                                                case 0:
                                                                                    monthIndex > 0 && this.setState({monthIndex: monthIndex - 1})
                                                                                    break;
                                                                                case 1:
                                                                                    Available.months.length > monthIndex + 1 && this.setState({monthIndex: monthIndex + 1})
                                                                                    break;
                                                                            }
                                                                            this.setState({
                                                                                weekdays: {
                                                                                    sunday: [],
                                                                                    monday: [],
                                                                                    tuesday: [],
                                                                                    wednesday: [],
                                                                                    thursday: [],
                                                                                    friday: [],
                                                                                    saturday: [],
                                                                                }
                                                                            })
                                                                        }}
                                                                        style={{
                                                                            // backgroundColor: (Available.months.length === this.state.monthIndex + 1 && idx === 1)
                                                                            // || (idx === 0 && this.state.monthIndex === 0) ? Colors.gray : Colors.secondaryColor,
                                                                            justifyContent: 'center',
                                                                            borderRadius: Constants.borderRadius * 10,
                                                                            borderWidth: Constants.borderWidth,
                                                                            borderColor: (Available.months.length === this.state.monthIndex + 1 && idx === 1)
                                                                            || (idx === 0 && this.state.monthIndex === 0) ? Colors.gray : Colors.secondaryColor,
                                                                            alignItems: 'center',
                                                                            width: 42,
                                                                            height: 42
                                                                        }}>
                                                                        <AntDesign // @ts-ignore
                                                                            name={button} size={20} color="white"/>
                                                                    </TouchableOpacity>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                })
                            }
                            <View style={{
                                flexDirection: 'row',
                                marginVertical: 25,
                                marginTop: 50,
                                justifyContent: 'space-around',
                                width: '100%'
                            }}>
                                {
                                    Available.days.map((element, idx) => {
                                        return (
                                            <Text key={idx} allowFontScaling={false}
                                                  style={{fontSize: 13, color: Colors.gray}}>{element}</Text>
                                        )
                                    })
                                }
                            </View>

                            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                                {
                                    [...new Array(parseInt(String(new Date(new Date().getFullYear(), this.state.monthIndex + 1, 0).getDate())))]
                                        .map((element: any, idx: number) => {
                                            let year = new Date().getFullYear();
                                            let month = this.state.monthIndex < 9 ? `0${this.state.monthIndex + 1}` : this.state.monthIndex + 1;
                                            let date = idx + 1
                                            let day;
                                            if (idx < 9) {
                                                day = moment(year + "-" + month + "-0" + date).format('ddd')
                                            } else {
                                                day = moment(year + "-" + month + '-' + date).format('ddd')
                                            }

                                            if (idx === 0) {
                                                for (let i = 0; i < Available.days.indexOf(day); i++) {
                                                    if (Available.days[i] != day) {
                                                        switch (Available.days[i]) {
                                                            case 'Sun':
                                                                this.state.weekdays.sunday.push(-1)
                                                                break;
                                                            case 'Mon':
                                                                this.state.weekdays.monday.push(-1)
                                                                break;
                                                            case 'Tue':
                                                                this.state.weekdays.tuesday.push(-1)
                                                                break;
                                                            case 'Wed':
                                                                this.state.weekdays.wednesday.push(-1)
                                                                break;
                                                            case 'Thu':
                                                                this.state.weekdays.thursday.push(-1)
                                                                break;
                                                            case 'Fri':
                                                                this.state.weekdays.friday.push(-1)
                                                                break;
                                                            case 'Sat':
                                                                this.state.weekdays.saturday.push(-1)
                                                                break;
                                                        }
                                                    }
                                                }
                                            }
                                            switch (day) {
                                                case 'Invalid date':
                                                    // this.state.weekdays.sunday.push(-1)
                                                    break;
                                                case 'Sun':
                                                    this.state.weekdays.sunday.push(idx)
                                                    break;
                                                case 'Mon':
                                                    this.state.weekdays.monday.push(idx)
                                                    break;
                                                case 'Tue':
                                                    this.state.weekdays.tuesday.push(idx)
                                                    break;
                                                case 'Wed':
                                                    this.state.weekdays.wednesday.push(idx)
                                                    break;
                                                case 'Thu':
                                                    this.state.weekdays.thursday.push(idx)
                                                    break;
                                                case 'Fri':
                                                    this.state.weekdays.friday.push(idx)
                                                    break;
                                                case 'Sat':
                                                    this.state.weekdays.saturday.push(idx)
                                                    break;
                                            }
                                        })
                                }
                            </View>

                            <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%'}}>
                                {
                                    Object.keys(this.state.weekdays).map((weeks, idx) => {
                                        return (
                                            <View key={idx} style={{}}>
                                                {this.renderDates(this.state.weekdays[weeks])}
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    }

                    <Button onPress={() => {
                        this.props.selectedDates(this.state.selectedDates)
                        this.props.navigation.pop()
                    }}
                            label={Available.button[0]}
                            isLoading={false}
                            style={{width: '80%'}}
                            noBorder={false}
                            disabled={this.state.selectedDates.length === 0}/>
                </SafeAreaView>
            </ScrollView>
        );
    }

    private renderDates(weeks: any[]) {
        return (
            <View style={{justifyContent: 'space-between'}}>
                {
                    weeks.map((days, idx) => {
                        let date = new Date()
                        date.setDate(days + 1)
                        date.setMonth(this.state.monthIndex)
                        return (
                            <TouchableOpacity key={idx}
                                              disabled={(new Date().getDate() > date.getDate() && new Date().getMonth() === date.getMonth())}
                                // @ts-ignore
                                              style={{
                                                  backgroundColor: this.state.selectedDates.indexOf(date.toLocaleDateString()) > -1 ? Colors.secondaryColor : null,
                                                  borderRadius: Constants.borderRadius * 100
                                              }} onPress={() => {
                                let selectedDates = this.state.selectedDates
                                if (selectedDates.indexOf(date.toLocaleDateString()) > -1) {
                                    selectedDates = this.arrayRemove(selectedDates, date.toLocaleDateString())
                                } else {
                                    if (this.props.plan !== 1) {
                                        selectedDates.push(date.toLocaleDateString())
                                    } else {
                                        selectedDates[0] = date.toLocaleDateString()
                                    }
                                }
                                this.setState({
                                    weekdays: {
                                        sunday: [],
                                        monday: [],
                                        tuesday: [],
                                        wednesday: [],
                                        thursday: [],
                                        friday: [],
                                        saturday: [],
                                    }, selectedDates: selectedDates
                                })
                            }}>
                                <Text allowFontScaling={false}                         // @ts-ignore
                                      style={{
                                          fontWeight: Constants.fontWeight,
                                          color: (new Date().getDate() > date.getDate() && new Date().getMonth() === date.getMonth()) ? Colors.gray : Colors.white,
                                          fontSize: 13,
                                          margin: 10,
                                          textAlign: 'center'
                                      }}>{days + 1 === 0 ? ' ' : days + 1}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

