import {Dimensions, Platform} from "react-native";
// @ts-ignore
import * as AppAuth from 'expo-app-auth';

export const Constants = {
    CLIENT_ID: '725232741041-vjslj6hg4kof6am2h4a5m8dd21imiuh3.apps.googleusercontent.com',
    URLSchemes: AppAuth.URLSchemes,
    borderWidth: Platform.OS === 'ios' ? 1 : .5,
    fontWeight: Platform.OS === 'ios' ? 'bold' : 'bold',
    borderRadius: 10,
    radius: 15,
    opacity: .7,
    elevation: 0,
    shadowRadius: 3.5,
    deviceHeight: Dimensions.get('window').height,
    deviceWidth: Dimensions.get('window').width,
    GoogleApiKey:"AIzaSyCYmzkSmnXo6mWqSp6sMZfCZFTE5Zy5rFo",
    
    stateOptions: [
        {
            "id": 0,
            "name": "Alabama"
        },
        {
            "id": 1,
            "name": "Alaska"
        },
        {
            "id": 2,
            "name": "American Samoa"
        },
        {
            "id": 3,
            "name": "Arizona"
        },
        {
            "id": 4,
            "name": "Arkansas"
        },
        {
            "id": 5,
            "name": "California"
        },
        {
            "id": 6,
            "name": "Colorado"
        },
        {
            "id": 7,
            "name": "Connecticut"
        },
        {
            "id": 8,
            "name": "Delaware"
        },
        {
            "id": 9,
            "name": "District of Columbia"
        },
        {
            "id": 10,
            "name": "Federated States of Micronesia"
        },
        {
            "id": 11,
            "name": "Florida"
        },
        {
            "id": 12,
            "name": "Georgia"
        },
        {
            "id": 13,
            "name": "Guam"
        },
        {
            "id": 14,
            "name": "Hawaii"
        },
        {
            "id": 15,
            "name": "Idaho"
        },
        {
            "id": 16,
            "name": "Illinois"
        },
        {
            "id": 17,
            "name": "Indiana"
        },
        {
            "id": 18,
            "name": "Iowa"
        },
        {
            "id": 19,
            "name": "Kansas"
        },
        {
            "id": 20,
            "name": "Kentucky"
        },
        {
            "id": 21,
            "name": "Louisiana"
        },
        {
            "id": 22,
            "name": "Maine"
        },
        {
            "id": 23,
            "name": "Marshall Islands"
        },
        {
            "id": 24,
            "name": "Maryland"
        },
        {
            "id": 25,
            "name": "Massachusetts"
        },
        {
            "id": 26,
            "name": "Michigan"
        },
        {
            "id": 27,
            "name": "Minnesota"
        },
        {
            "id": 28,
            "name": "Mississippi"
        },
        {
            "id": 29,
            "name": "Missouri"
        },
        {
            "id": 30,
            "name": "Montana"
        },
        {
            "id": 31,
            "name": "Nebraska"
        },
        {
            "id": 32,
            "name": "Nevada"
        },
        {
            "id": 33,
            "name": "New Hampshire"
        },
        {
            "id": 34,
            "name": "New Jersey"
        },
        {
            "id": 35,
            "name": "New Mexico"
        },
        {
            "id": 36,
            "name": "New York"
        },
        {
            "id": 37,
            "name": "North Carolina"
        },
        {
            "id": 38,
            "name": "North Dakota"
        },
        {
            "id": 39,
            "name": "Northern Mariana Islands"
        },
        {
            "id": 40,
            "name": "Ohio"
        },
        {
            "id": 41,
            "name": "Oklahoma"
        },
        {
            "id": 42,
            "name": "Oregon"
        },
        {
            "id": 43,
            "name": "Palau"
        },
        {
            "id": 44,
            "name": "Pennsylvania"
        },
        {
            "id": 45,
            "name": "Puerto Rico"
        },
        {
            "id": 46,
            "name": "Rhode Island"
        },
        {
            "id": 47,
            "name": "South Carolina"
        },
        {
            "id": 48,
            "name": "South Dakota"
        },
        {
            "id": 49,
            "name": "Tennessee"
        },
        {
            "id": 50,
            "name": "Texas"
        },
        {
            "id": 51,
            "name": "Utah"
        },
        {
            "id": 52,
            "name": "Vermont"
        },
        {
            "id": 53,
            "name": "Virgin Island"
        },
        {
            "id": 54,
            "name": "Virginia"
        },
        {
            "id": 55,
            "name": "Washington"
        },
        {
            "id": 56,
            "name": "West Virginia"
        },
        {
            "id": 57,
            "name": "Wisconsin"
        },
        {
            "id": 58,
            "name": "Wyoming"
        }
    ],     // SearchableDropdown
}


export const AWSConfig = {
    keyPrefix: "upload/",
    bucket: "watchdogg",
    // bucket: "watchdogg-backend-dev-serverlessdeploymentbucket-dy84ofkogbeb",
    region: "us-east-1",
    accessKey: "AKIA4EHMW5AA3YE5XKX5",
    secretKey: "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",
    successActionStatus: 201
}

// const AWSBucketUrl = "s3://arn:aws:s3:us-east-2:833720084481:accesspoint/publicaccess"
const AWSBucketUrl = "s3://arn:aws:s3:us-east-1:833720084481:accesspoint/watchdogg"

export default {
    Constants,
    AWSConfig,
    AWSBucketUrl
};
