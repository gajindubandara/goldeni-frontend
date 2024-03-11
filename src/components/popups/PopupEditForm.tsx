import React, {useState, useEffect, useMemo} from 'react';
import {Modal, Form, Input, Button, message} from 'antd';
import LoadingSpinner from "../utils/LoadingSpinner";
import {updateUserDevice} from "../../util/user-api-services";


interface PopupFormProps {
    visible: boolean;
    onClose: () => void;
    deviceData: any;
    onUpdateDevice: (updatedDeviceData: any) => void;
}

const PopupEditForm: React.FC<PopupFormProps> = ({visible, onClose, deviceData, onUpdateDevice}) => {
    const [form] = Form.useForm();
    const idToken = localStorage.getItem("idToken");
    const [loading, setLoading] = useState(false);

    const initialFormData = useMemo(() => ({
        name: deviceData.registeredUsername,
        number: deviceData.emergencyContactNumbers[0],
        altNumber: deviceData.emergencyContactNumbers[1],
        address: deviceData.registeredAddress,
    }), [deviceData]);

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (visible) {
            // Reset the form data and set the current step to 0 when the form is opened
            setFormData(initialFormData);
            form.resetFields();
        }
    }, [visible, form, initialFormData]);

    const handleFormSubmit = async (values: any) => {
        setLoading(true);
        try {
            // Your form validation logic here

            const response = await updateUserDevice(idToken!, deviceData, values, onUpdateDevice);
            console.log('Device updated successfully:', response);
            message.success('Device Updated successfully');
        } catch (error) {
            console.error('Error updating device:', error);
            message.error('Failed to update device');
        } finally {
            setLoading(false);
            onClose(); // Close the modal or perform other actions
        }
    };

    return (
        <><LoadingSpinner loading={loading}/>
            <Modal
                visible={visible}
                title="Upadte device details"
                onCancel={onClose}
                footer={null}
                width={800}
            >
                <div style={{margin: '20px 0px'}}>
                    <Form
                        form={form}
                        onFinish={(values) => {
                            handleFormSubmit(values);
                            setFormData({...formData, ...values});
                        }}
                        initialValues={
                            deviceData
                                ? {
                                    name: formData.name,
                                    address: formData.address,
                                    number: formData.number,
                                    altNumber: formData.altNumber,
                                }
                                : {
                                    name: "Loading...",
                                    address: "Loading...",
                                    number: "Loading...",
                                    altNumber: "Loading...",
                                }
                        }
                    >
                        <Form.Item
                            label="Device user's name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter the device user's name",
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Address of the user"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the address of the user',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Contact no of the guardian"
                            name="number"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the contact number of the guardian',
                                },
                                {
                                    pattern: /^(0\d{9})$/, // This regex pattern checks for 10 digits starting with 0
                                    message: 'Please enter a valid 10-digit mobile number starting with 0',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Alternative contact no of the guardian"
                            name="altNumber"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the alternative contact number of the guardian ',
                                },
                                {
                                    pattern: /^(0\d{9})$/, // This regex pattern checks for 10 digits starting with 0
                                    message: 'Please enter a valid 10-digit mobile number starting with 0',
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

export default PopupEditForm;
