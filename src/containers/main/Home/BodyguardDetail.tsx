import React from "react";
import {BackHandler, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Colors from "../../../utils/colors";
import {AntDesign, FontAwesome} from "@expo/vector-icons";
import {Constants} from "../../../utils/constants";
import Reviews from "../../../components/Reviews";
import Button from "../../../components/Button";
import ImagePreview from "../../../components/ImagePreview";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    index: number;
    reviews: any;
    showFullScreen: boolean;
    profileImages: any;
}

export default class BodyguardDetail extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            index: 0,
            reviews: [
                //TODO:
                // {
                //     avatar: require('../../../assets/img_4.png'),
                //     name: 'Savannah Nguyen',
                //     rate: '100%',
                //     date: 'August 2021',
                //     comment: 'Odio porttitor viverra dolor, risus nibh ut vitae. Arcu lobortis habitasse in sit morbi mattis dui ante. Suspendisse bibendum in nunc pharetra at eget.',
                // }
            ],
            showFullScreen: false,
            profileImages: []
        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    };

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        const {userProfile} = this.props.route.params

        return (
            <View style={{flex: 1, backgroundColor: Colors.primaryColor}}>

                <ImagePreview navigation={this.props.navigation}
                              imageUrl={userProfile.profilePicture}
                              isVisible={this.state.showFullScreen}
                              onChangeVisibility={() => this.setState({showFullScreen: false, index: -1})}/>

                <ScrollView contentContainerStyle={{justifyContent: 'space-between'}}
                            style={{backgroundColor: Colors.primaryColor}}>

                    <View style={{paddingHorizontal: 32, marginTop: 40, flexDirection: 'row', alignItems: 'center'}}>
                        <FontAwesome name="close" size={30} color={Colors.white} style={{marginRight: 25}}
                                     onPress={() => this.props.navigation.pop()}/>
                        <Text allowFontScaling={false}
                            // @ts-ignore
                              style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                            {userProfile.fullName}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => this.setState({index: -1, showFullScreen: true})}>
                        <Image
                            source={userProfile.profilePicture === "" ? require('../../../assets/userIcon.png') : {uri: userProfile.profilePicture}}
                            resizeMode={'cover'} style={{
                            borderRadius: Constants.borderRadius * 100,
                            marginVertical: 50, width: 139, height: 139, alignSelf: 'center',
                        }}/>
                    </TouchableOpacity>

                    <Text allowFontScaling={false}
                          style={{color: Colors.gray, textAlign: 'center', marginHorizontal: 25, fontSize: 14}}>
                        {'In eu magna integer curabitur aliquet pretium nisl, cursus. Pharetra dignissim vitae mauris placerat. Neque, dictum aenean mi et velit, odio non ornare. Sit aliquam aliquam.'}
                    </Text>

                    <View style={{
                        borderBottomWidth: Constants.borderWidth,
                        borderColor: Colors.gray,
                        marginHorizontal: 25,
                        marginVertical: 30
                    }}/>

                    <ScrollView scrollEnabled={false}>
                        <View style={{
                            flexDirection: 'row',
                            flex: 1,
                            justifyContent: 'space-around',
                            alignItems: 'center'
                        }}>
                            {
                                ['Height', 'Weight', 'Age'].map((about: string, idx: number) => {
                                    return (
                                        <Text key={idx} allowFontScaling={false} style={{
                                            flex: 1 / 3,
                                            fontSize: 12,
                                            textAlign: 'center',
                                            color: Colors.white
                                        }}>{about}</Text>
                                    )
                                })
                            }
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            flex: 1,
                            marginTop: 15,
                            justifyContent: 'space-around',
                            alignItems: 'center'
                        }}>
                            {
                                userProfile.aboutData &&
                                userProfile.aboutData.map((aboutData: string, idx: number) => {
                                    return (
                                        <Text key={idx} allowFontScaling={false}
                                            // @ts-ignore
                                              style={{
                                                  fontSize: 18,
                                                  flex: 1 / 3,
                                                  textAlign: 'center',
                                                  color: Colors.white,
                                                  fontWeight: Constants.fontWeight
                                              }}>{aboutData}</Text>
                                    )
                                })
                            }
                        </View>
                        {
                            this.state.profileImages.length < 3 ?
                                <View style={{margin: 25}}>
                                    {
                                        this.state.profileImages.map((image: any, idx: number) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => this.setState({index: idx, showFullScreen: true})}>
                                                    <Image key={idx} source={image}
                                                           style={{marginVertical: 15, height: 232, width: '100%'}}
                                                           resizeMode={'cover'}/>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                                : <View style={{
                                    marginHorizontal: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                }}>
                                    {
                                        this.state.profileImages.map((image: any, idx: number) => {
                                            return (
                                                <View key={idx} style={{alignItems: 'center'}}>
                                                    <TouchableOpacity
                                                        onPress={() => this.setState({index: idx, showFullScreen: true})}>
                                                        <Image source={image}
                                                               style={{width: 119, height: 119, marginVertical: 10}}/>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                        }
                    </ScrollView>

                    <View style={{
                        borderBottomWidth: Constants.borderWidth,
                        borderColor: Colors.gray,
                        marginHorizontal: 25,
                        marginTop: 20
                    }}/>
                    {
                        this.state.reviews.length > 0 &&
                        (
                            <>
                                <Reviews reviews={this.state.reviews}/>
                                <Button onPress={() => this.props.navigation.navigate('ReviewLists')}
                                        label={'View all reviews'}
                                        isLoading={false} style={{color: Colors.secondaryColor}}
                                        noBorder disabled={false}/>
                            </>
                        )
                    }
                    <View style={{
                        borderBottomWidth: Constants.borderWidth,
                        borderColor: Colors.gray,
                        marginHorizontal: 25,
                    }}/>

                    <View style={{
                        // position: 'relative',
                        // top: 50,
                        marginVertical: 10,
                        marginHorizontal: 30,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <View>
                            <Text allowFontScaling={false} // @ts-ignore
                                  style={{
                                      color: Colors.white,
                                      fontSize: 17,
                                      fontWeight: Constants.fontWeight
                                  }}>{`$ ${userProfile.reqDetail[3]} `}
                                <Text allowFontScaling={false} style={{
                                    color: Colors.gray, fontSize: 14, fontWeight: 'normal'
                                }}>{
                                    '/  Hour'
                                }</Text></Text>
                            <View style={{flexDirection: 'row', paddingTop: 5}}>
                                <AntDesign name="star" size={15} color={Colors.secondaryColor}/>
                                <Text allowFontScaling={false} // @ts-ignore
                                      style={{
                                          color: Colors.secondaryColor,
                                          fontWeight: Constants.fontWeight
                                      }}>{' 98%'}</Text>
                                <Text allowFontScaling={false} style={{color: Colors.gray}}>{' (117)'}</Text>
                            </View>
                        </View>

                        <Button onPress={() => {
                            this.props.navigation.navigate('ServiceDetail', {
                                offerDetail: {
                                    ...userProfile
                                },
                                isSend: true
                            })
                        }}
                                label={'Send Offer'}
                                isLoading={false}
                                style={{width: '35%'}}
                                noBorder={false}
                                disabled={false}/>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

