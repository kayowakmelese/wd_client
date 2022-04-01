import React from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import Colors from "../../../utils/colors";
import {Constants} from "../../../utils/constants";
import {FontAwesome} from "@expo/vector-icons";
import Reviews from "../../../components/Reviews";

export interface Props {
    reviews: any;
    navigation: any;
}

interface State {
    reviews: any;
}

export default class ReviewLists extends React.Component<Props, State> {
    constructor(Props: any) {
        super(Props);
        this.state = {
            reviews: [
                {
                    avatar: require('../../../assets/img_4.png'),
                    name: 'Darrell Steward',
                    rate: '100%',
                    date: 'August 2021',
                    comment: 'Odio porttitor viverra dolor, risus nibh ut vitae. Arcu lobortis habitasse in sit morbi mattis dui ante. Suspendisse bibendum in nunc pharetra at eget.',
                },
                {
                    avatar: require('../../../assets/img_5.png'),
                    name: 'Savannah Nguyen',
                    rate: '100%',
                    date: 'August 2021',
                    comment: 'Odio porttitor viverra dolor, risus nibh ut vitae. Arcu lobortis habitasse in sit morbi mattis dui ante. Suspendisse bibendum in nunc pharetra at eget.',
                },
                {
                    avatar: require('../../../assets/img_6.png'),
                    name: 'Leif Floyd',
                    rate: '100%',
                    date: 'August 2021',
                    comment: 'Odio porttitor viverra dolor, risus nibh ut vitae. Arcu lobortis habitasse in sit morbi mattis dui ante. Suspendisse bibendum in nunc pharetra at eget.',
                },
                {
                    avatar: require('../../../assets/img_4.png'),
                    name: 'Darrell Steward',
                    rate: '100%',
                    date: 'August 2021',
                    comment: 'Odio porttitor viverra dolor, risus nibh ut vitae. Arcu lobortis habitasse in sit morbi mattis dui ante. Suspendisse bibendum in nunc pharetra at eget.',
                },
                {
                    avatar: require('../../../assets/img_5.png'),
                    name: 'Savannah Nguyen',
                    rate: '100%',
                    date: 'August 2021',
                    comment: 'Odio porttitor viverra dolor, risus nibh ut vitae. Arcu lobortis habitasse in sit morbi mattis dui ante. Suspendisse bibendum in nunc pharetra at eget.',
                },
                {
                    avatar: require('../../../assets/img_6.png'),
                    name: 'Leif Floyd',
                    rate: '100%',
                    date: 'August 2021',
                    comment: 'Odio porttitor viverra dolor, risus nibh ut vitae. Arcu lobortis habitasse in sit morbi mattis dui ante. Suspendisse bibendum in nunc pharetra at eget.',
                }
            ]
        }
    }

    render() {

        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                <View
                    style={{
                        marginTop: 55,
                        paddingBottom: 10,
                        flexDirection: 'row',
                        paddingHorizontal: 32,
                        alignItems: 'center'
                    }}>
                    <FontAwesome name="close" size={30} color={Colors.white} style={{marginRight: 25}}
                                 onPress={() => this.props.navigation.pop()}/>
                    <Text allowFontScaling={false}
                        // @ts-ignore
                          style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                        {'Watch Dogg Reviews'}</Text>
                </View>
                <ScrollView>
                    <Reviews reviews={this.state.reviews}/>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {},
});
