import axios from "axios";
import axiosRetry from 'axios-retry';
import constants, { Constants } from "../utils/constants";

axiosRetry(axios, {retries: 3});

const baseUrl = "https://rc5bh19lwl.execute-api.us-east-2.amazonaws.com/beta"
// const baseUrl = "http://192.168.170.188:5000/beta"
// const baseUrl = "http://192.168.2.141:5000/beta"
// const baseUrl = "http://192.168.3.200:5000/beta"

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
}

const Transport = {
    Auth: {
        sendOTP: (data: any) => axios.post(`${baseUrl}/auth/sendOTP`, data),
        resetPassword: (data: any) => axios.patch(`${baseUrl}/auth/resetPassword`, data),
        verifyOTP: (data: any) => axios.post(`${baseUrl}/auth/verify`, data),
        signup: (data: any) => axios.post(`${baseUrl}/auth/signup`, data),
        login: (data: any) => axios.post(`${baseUrl}/auth/login`, data),
        facebookLogin:(data:any)=>axios.post(`${baseUrl}/auth/SSOLogin`,data)

    },
    Twilio: {
        sendSMS: (data: any) => axios.post(`${baseUrl}/twilio/send_SMS`, data),
        call: (receiverNo: string) => axios.post(`${baseUrl}/twilio/call`, {receiverNo, "url": "http://demo.twilio.com/docs/voice.xml"}),
    },
    Earnings: {
        sendPayment: (token: string, data: any) => axios.post(`${baseUrl}/earning/send`, data, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
    },
    Card: {
        addCard: (token: string, data: any) => axios.post(`${baseUrl}/card/add_account`, data, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
        getCards: (token: string) => axios.get(`${baseUrl}/card/get_cards`, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
    },
    User: {
        profileDetails: (token: string) => axios.get(`${baseUrl}/user/profile`, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
        updateProfile: (token: string, data: any) => axios.patch(`${baseUrl}/user/updateProfile`, data, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
        allEPOs: (token: string) => axios.get(`${baseUrl}/user/allEPOs`, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
        
    },
    Notifications: {
        getNotifications: (token: string) => axios.get(`${baseUrl}/notification/self`, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
        changeStatus: (token: string, notificationId: string) => axios.patch(`${baseUrl}/notification/read/${notificationId}`, {}, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
    },
    Request: {
        getDetail: (token: string, requestId: string) => axios.get(`${baseUrl}/request/${requestId}`, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
        changeStatus: (token: string, requestId: string, data: any) => axios.patch(`${baseUrl}/request/changeStatus/${requestId}`, data, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
        sendRequest: (token: string, data: any) => axios.post(`${baseUrl}/request/send`, data, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
        getUserRequests: (token: string) => axios.get(`${baseUrl}/request/requests`, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
    },
    maps:{
        getAutoComplete:(city:string)=>axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${city}&types=geocode&key=${Constants.GoogleApiKey}`),
        getCoordinate:(placeId:string)=>axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${Constants.GoogleApiKey}&fields=geometry`)

    }

}

export default Transport;
