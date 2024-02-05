import React, {useEffect} from 'react';
import {Modal, Form, Input, Button, message} from 'antd';
import axios from "axios";
import {baseUrl} from "../services/commonVariables";

interface PopupFormProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void; // Define a prop for the success callback
}

const PopupAddDeviceForm: React.FC<PopupFormProps> = ({visible, onClose, onSuccess}) => {
    const [form] = Form.useForm();
    const idToken = localStorage.getItem("idToken");

    useEffect(() => {
        if (visible) {
            // Reset the form fields when the modal is opened
            form.resetFields();
        }
    }, [visible, form]);

    const handleFormSubmit = (values: any) => {
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

        axios.post(`${baseUrl}/admin/devices/add`, requestBody, {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        })
            .then(response => {
                // Handle successful response
                console.log('Device added successfully:', response.data);
                message.success('Device added successfully')

                onSuccess();

                // Close the modal or perform other actions
                onClose();
            })
            .catch(error => {
                // Handle error
                if (error.response && error.response.status === 409) {
                    // If the status code is 409, handle the conflict
                    console.error('Device already exists:', error.response.data);
                    message.error(error.response.data);
                    // Handle the conflict response data as needed
                } else {
                    // For other errors, log and display a general error message
                    console.error('Error adding device:', error);
                    message.error('Failed to add device');
                }
                // Close the modal or perform other actions
                onClose();
            });
        // form
        //     .validateFields()
        //     .then((values) => {
        //         // Log the form values to the console
        //         console.log('Secret:', values.secret);
        //         console.log('ID:', values.id);
        //         console.log('MAC Address:', values.macAddress);
        //         message.success('Form submitted successfully');
        //         console.log(values); // You can handle form data here
        //         onClose();
        //     })
        //     .catch((error) => {
        //         message.error('Form submission failed');
        //     });
    };

    return (
        <Modal
            visible={visible}
            title="Add New Device"
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <div style={{margin: '20px 0px'}}>
                <Form
                    form={form}
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        label="Device ID"
                        name="deviceId"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the device ID',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Device Secret"
                        name="deviceSecret"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the device secret',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="MAC Address"
                        name="macAddress"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the MAC address',
                            },
                            {
                                pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
                                message: 'Please enter a valid MAC address',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form>
            </div>
        </Modal>
    );
};

export default PopupAddDeviceForm;
