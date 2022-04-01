import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';

// screens
import Intro from "../screens/Intro"
import Auth from "../screens/Auth";
import Main from "../screens/Main";
import Login from "../containers/auth/Login";
import SignUp from "../containers/auth/SignUp";
import Notifications from "../containers/main/Notifications/Notifications";
import History from "../containers/main/History/History";
import Settings from "../containers/main/Settings";
import Policy from "../screens/Policy";
import Verification from "../containers/auth/Verification";
import Profile from "../containers/auth/Profile";
import Reset from "../containers/Reset";
import CustomCamera from "../screens/Other/CustomCamera";
import Invite from "../containers/main/Invite";
import PaymentMethods from "../containers/main/Payment/PaymentMethods";
import ServiceDetail from "../containers/main/History/ServiceDetail";
import AddPaymentMethods from "../containers/main/Payment/AddPaymentMethods";
import ServiceDate from "../containers/main/Home/ServiceDate";
import PickupAddress from "../containers/main/Home/PickupAddress";
import Match from "../containers/main/Home/Match";
import BodyguardDetail from "../containers/main/Home/BodyguardDetail";
import ReviewLists from "../containers/main/Home/ReviewLists";
import linking from './linking';
const Stack = createStackNavigator();

export interface Props {
}

interface State {
    routeName: string
}

export default class Routes extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            routeName: "Intro"
        }
    }

    render() {
        return (
            <NavigationContainer linking={linking}>
                <Stack.Navigator initialRouteName={this.state.routeName}
                                 screenOptions={{headerShown: false, gestureEnabled: false}}>
                    <Stack.Screen name="Intro" component={Intro}/>

                    <Stack.Screen name="Auth" component={Auth}/>
                    <Stack.Screen name="Login" component={Login}/>
                    <Stack.Screen name="Reset" component={Reset}/>
                    <Stack.Screen name="SignUp" component={SignUp}/>
                    <Stack.Screen name="Verification" component={Verification}/>

                    <Stack.Screen name="Profile" component={Profile}/>
                    <Stack.Screen name="CustomCamera" component={CustomCamera}/>

                    <Stack.Screen name="Main" component={Main}/>
                    <Stack.Screen name="ServiceDate" component={ServiceDate}/>
                    <Stack.Screen name="PickupAddress" component={PickupAddress}/>
                    <Stack.Screen name="Match" component={Match}/>
                    <Stack.Screen name="BodyguardDetail" component={BodyguardDetail}/>
                    <Stack.Screen name="ReviewLists" component={ReviewLists}/>

                    <Stack.Screen name="Notifications" component={Notifications}/>

                    <Stack.Screen name="History" component={History}/>
                    <Stack.Screen name="ServiceDetail" component={ServiceDetail}/>

                    <Stack.Screen name="Settings" component={Settings}/>
                    <Stack.Screen name="Invite" component={Invite}/>
                    <Stack.Screen name="PaymentMethods" component={PaymentMethods}/>
                    <Stack.Screen name="AddPaymentMethods" component={AddPaymentMethods}/>

                    <Stack.Screen name="Policy" component={Policy}/>

                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
