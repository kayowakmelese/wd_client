import * as SecureStore from "expo-secure-store";
import {AWSConfig, Constants} from "./constants";
import {RNS3} from 'react-native-aws3';
import moment from "moment";
import axios from "axios";

export function checkEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function getType(param: any) {
    if (Array.isArray(param)) return 'array';
    else if (typeof param == 'string') return 'string';
    else if (param != null && typeof param == 'object') return 'object';
    else return 'other';
}

export async function addToSecureStore(key: string, data: any) {
    await SecureStore.setItemAsync(key, JSON.stringify(data)).then(() => {
        return true
    })
}

export async function getSecureStoreItem(key: string) {
    let data: any = await SecureStore.getItemAsync(key)
    return data
}

export async function removeSecureStoreItem(key: string) {
    let data: any = await SecureStore.deleteItemAsync(key)
    return true
}

export async function uploadFile(file: any) {
    return RNS3.put(file, AWSConfig);
}

export function decamelize(str: string, separator: any) {
    separator = typeof separator === 'undefined' ? '_' : separator;

    return str.charAt(0).toUpperCase() +
        str.slice(1)
            .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
            .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
    // .toLowerCase();
}

export function camelize(text: string) {
    if (text && text.includes(' ')) {
        text = text.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
        let camelize = text.substr(0, 1).toLowerCase() + text.substr(1)
        return camelize.replace(/\s/g, "")
    }
    return text.toLowerCase()
}
export function computeDates(dates:any,min:boolean){
    if(dates){
        let max=dates[0];
        for(var i=0;i<dates.length;i++){
            console.log("writing",dates[i])
            if(min?moment(dates[i]).diff(max)<0:moment(dates[i]).diff(max)>0){
                max=dates[i];
            }
        }
        return max;
    }else{
        return null
    }
    
}
export async function changeToString(latitude:any,longitude:any){
    let res=await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Constants.GoogleApiKey}`)
    if(res){
        let cityName=res.data.results[0].formatted_address
        console.log("cityname",cityName)
        return cityName;
    }else{
        return "unable to load city name";
    }
 }