import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";
import {AntDesign, Ionicons, MaterialIcons} from "@expo/vector-icons";

export interface Props {
    activeTab: any
    currentTab: number;
}

interface State {
    navBar: any,
    activeTab: number
}

export default class Footer extends React.Component<Props, State> {
    constructor(Props: any) {
        super(Props);
        this.state = {
            activeTab: this.props.currentTab || 0,
            navBar: [
                {
                    label: 'Home',
                    iconName: 'home'
                },
                {
                    label: 'Notifications',
                    iconName: ''
                },
                {
                    label: 'History',
                    iconName: ''
                },
                {
                    label: 'Settings',
                    iconName: 'settings-outline'
                },
            ]
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
        if (this.state.activeTab !== nextProps.currentTab) {
            this.setState({activeTab: nextProps.currentTab})
        }
    }

    render() {
        return (
            <View style={{
                height: 65,
                alignItems: 'center',
                position: 'absolute',
                bottom: 0,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: Colors.primaryColor,
                paddingBottom:10
            }}>
                {
                    this.state.navBar.map((element: any, idx: number) => {
                        return (
                            <TouchableOpacity key={idx} style={{
                                height: '100%',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                borderTopWidth: idx === this.state.activeTab ? Constants.borderWidth : 0,
                                borderColor: Colors.secondaryColor
                            }}
                                              onPress={() => {
                                                  this.setState({activeTab: idx})
                                                  this.props.activeTab(idx)
                                              }}>
                                {
                                    idx === 2 ?
                                        <MaterialIcons name="history-toggle-off" size={24}
                                                       color={idx === this.state.activeTab ? Colors.white : Colors.gray}
                                                       style={{paddingTop: 5, alignSelf: 'center'}}/> :
                                        idx === 1 ? <AntDesign name="message1" size={24}
                                                               color={idx === this.state.activeTab ? Colors.white : Colors.gray}
                                                               style={{paddingTop: 5, alignSelf: 'center'}}/> :
                                            <Ionicons name={element.iconName} size={24}
                                                      color={idx === this.state.activeTab ? Colors.white : Colors.gray}
                                                      style={{paddingTop: 5, alignSelf: 'center'}}/>
                                }

                                <Text allowFontScaling={false}
                                    // @ts-ignore
                                      style={{
                                          fontSize: 12,
                                          fontWeight: idx === this.state.activeTab ? Constants.fontWeight : 'normal',
                                          color: idx === this.state.activeTab ? Colors.white : Colors.gray,
                                          paddingTop: 5
                                      }}>{element.label}</Text>
                            </TouchableOpacity>
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
