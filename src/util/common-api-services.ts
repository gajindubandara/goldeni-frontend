// noinspection JSAnnotator

import axios from 'axios';

import {baseUrl} from '../services/commonVariables';


//Dis-enroll device
export const disenrollDevice = async (idToken: string, deviceId: string) => {
    try {
        const config = {
            method: 'put',
            url: `${baseUrl}/devices/device/disenroll?id=${deviceId}`,
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        };

        return await axios.request(config);
    } catch (error) {
        throw error;
    }
};

//Enroll Device
export const enrollDevice = async (idToken: string, userData: any, formData: any, onSuccess: () => void) => {
    try {
        let email;
        if (userData.isAdmin) {
            email = formData.email;
        } else {
            email = userData.email;
        }

        const requestBody = {
            deviceId: formData.deviceId,
            deviceSecret: formData.deviceSecret,
            registeredEmail: email,
            registeredUsername: formData.name,
            registeredAddress: formData.address,
            emergencyContactNumbers: [formData.num.toString(), formData.altNum.toString()],
        };

        const config = {
            method: 'put',
            url: `${baseUrl}/devices/device/enroll`,
            headers: {
                'Authorization': `Bearer ${idToken}`
            },
            data: requestBody
        };

        const response = await axios.request(config);
        onSuccess();
        return response.data;
    } catch (error) {
        throw error;
    }
};
