// noinspection JSAnnotator

import axios from 'axios';

import {baseUrl} from '../services/commonVariables';

//Get Users
export const fetchUsers = (idToken: string) => {
    return axios.get(`${baseUrl}/admin/users`, {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    });
};

//Get Devices
export const fetchDevices = (idToken: string) => {
    return axios.get(`${baseUrl}/admin/devices`, {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    });
};

//Delete Device
export const deleteDevice = async (idToken: string, deviceId: string) => {
    try {
        // Construct the URL with the device ID as a query parameter
        const url = `${baseUrl}/admin/devices?id=${deviceId}`;

        // Define the request headers
        const headers = {
            Authorization: `Bearer ${idToken}`
        };

        // Make the DELETE request using Axios
        return await axios.delete(url, { headers });
    } catch (error) {
        throw error;
    }
};

//Add Device
export const addDevice = async (idToken: string, values: any, onSuccess: () => void) => {
    try {
        const requestBody = {
            deviceId: values.deviceId,
            deviceSecret: values.deviceSecret,
            registeredEmail: '',
            registeredUsername: '',
            registeredAddress: '',
            macAddress: values.macAddress,
            isConnected: false,
            emergencyContactNumbers: [],
            status: 'NEW'
        };

        const response = await axios.post(`${baseUrl}/admin/devices/add`, requestBody, {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        });

        onSuccess();
        return response.data;
    } catch (error) {
        throw error;
    }
};


//Get analytics
export const fetchAnalytics = (idToken: string) => {
    return axios.get(`${baseUrl}/admin/analytics`, {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    });
};
