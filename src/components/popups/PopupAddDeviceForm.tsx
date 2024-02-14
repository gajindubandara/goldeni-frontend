import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Button, message} from 'antd';
import LoadingSpinner from "../utils/LoadingSpinner";
import {addDevice} from "../../util/admin-api-services";

interface PopupFormProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void; // Define a prop for the success callback
}

const PopupAddDeviceForm: React.FC<PopupFormProps> = ({visible, onClose, onSuccess}) => {
    const [form] = Form.useForm();
    const idToken = localStorage.getItem("idToken");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            // Reset the form fields when the modal is opened
            form.resetFields();
        }
    }, [visible, form]);


    const handleFormSubmit = async (values: any) => {
        setLoading(true);
        try {
            const response = await addDevice(idToken!, values, onSuccess);
            console.log('Device added successfully:', response);
            message.success('Device added successfully');
            onClose();
        } catch (error:any) {
            if (error.response && error.response.status === 409) {
                console.error('Device already exists:', error.response.data);
                message.error(error.response.data);
            } else {
                console.error('Error adding device:', error);
                message.error('Failed to add device');
            }
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <LoadingSpinner loading={loading}/>

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
        </>
    );
};

export default PopupAddDeviceForm;
