// noinspection JSAnnotator

import axios from 'axios';

import {baseUrl} from '../services/commonVariables';

//Fetch My Devices
export const fetchMyDevices = (idToken: string) => {
    return axios.get(`${baseUrl}/devices`, {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    });
};

//Update device
export const updateUserDevice = async (idToken: string, deviceData: any, values: any, onUpdateDevice: (data: FormData) => void) => {
    try {
        const apiData = {
            deviceId: deviceData.deviceId,
            registeredEmail: deviceData.registeredEmail,
            registeredUsername: values.name,
            registeredAddress: values.address,
            emergencyContactNumbers: [
                values.number.toString(),
                values.altNumber.toString()
            ]
        };

        const config = {
            method: 'put',
            url: `${baseUrl}/devices/device`,
            headers: {
                'Authorization': `Bearer ${idToken}`
            },
            data: apiData
        };

        const response = await axios.request(config);
        onUpdateDevice(values); // Update the local state with the new form data
        return response.data;
    } catch (error) {
        throw error;
    }
};

//Update device state
export const setConnectionState = async (idToken: string, deviceId: string,state:boolean) => {
    try {

        const config = {
            method: 'put',
            url: `${baseUrl}/devices/device/connection-state?id=${deviceId}`,
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            data: state
        };

        return await axios.request(config);
    } catch (error) {
        throw error;
    }
};

//Fetch last known device data
export const fetchLastKnownDeviceData = (idToken: string) => {
    // return axios.get(`${baseUrl}/devices`, {
    //     headers: {
    //         Authorization: `Bearer ${idToken}`
    //     }
    // });
};