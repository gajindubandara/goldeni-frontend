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
