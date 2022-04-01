import React, {useEffect, useRef, useState} from 'react';
import {Alert, LogBox, Platform, StatusBar,DeviceEventEmitter} from "react-native";
import Routes from "./src/routes/routes";
import {Colors} from "react-native/Libraries/NewAppScreen";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import {addToSecureStore} from "./src/utils/CommonFunction";


Notifications.setNotificationHandler({
    handleSuccess: () => {
    },
    handleError: () => {
    },
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
    }),
});

export default function App() {

    const [expoPushToken, setExpoPushToken] = useState(''),
        [notification, setNotification]: any = useState(false),
        notificationListener: any = useRef(),
        responseListener: any = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then((token: any) =>{ setExpoPushToken(token);console.log("tokeno",token)});

        notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
            console.log("notificationResponse",response);
            DeviceEventEmitter.emit("changeScreen",{screen:response.notification.request.content.data?response.notification.request.content.data.screen:0})
        });
      

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    LogBox.ignoreAllLogs(true)
    LogBox.ignoreLogs(['Remote debugger']);

    // removeSecureStoreItem('token').then(r => {})
    return (
        <>
            <StatusBar backgroundColor={Colors.primaryColor}/>
            <Routes/>
        </>
    )
}


async function registerForPushNotificationsAsync() {
    let exponentPushToken;
    if (Constants.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            Alert.alert('Warning', 'Failed to get push token for push notification!',
                [
                    {
                        text: 'Give Permission',
                        onPress: async () => {
                            await Notifications.requestPermissionsAsync();
                            // const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS)
                        }
                    }
                ])

            return;
        }
        exponentPushToken = (await Notifications.getExpoPushTokenAsync()).data;
        if (exponentPushToken) {
            await addToSecureStore('exponentPushToken', exponentPushToken)
        }
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return exponentPushToken;
}
