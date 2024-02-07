import React, {useState, useEffect} from 'react';
import {Modal, Form, Input, Button, message, Steps, Card, Row, Col} from 'antd';
import {baseUrl} from "../services/commonVariables";
import axios from "axios";
import {decodeIdToken} from "../services/decodeService";
import LoadingSpinner from "./LoadingSpinner";


const {Step} = Steps;

interface PopupFormProps {
    visible: boolean;
    onClose: () => void;
    showEmailInput: boolean;
    onSuccess: () => void;
}

interface FormData {
    name: string;
    num: number;
    altNum: number;
    address: string;
    deviceId: string;
    deviceSecret: string;
    email: string;
}

const initialFormData: FormData = {
    name: '',
    num: 0,
    altNum: 0,
    address: '',
    deviceId: '',
    deviceSecret: '',
    email: '',
};

const PopupEnrollForm: React.FC<PopupFormProps> = ({visible, onClose, onSuccess, showEmailInput}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const idToken = localStorage.getItem("idToken");
    const [loading, setLoading] = useState(false)
    const [userData, setUser] = useState({
        email: '',
        name: '',
        picture: '',
        isAdmin: false // Default to non-admin
    });

    useEffect(() => {
        const userData = decodeIdToken();
        if (userData) {
            setUser(userData);
        }

        if (visible) {
            // Reset the form data and set the current step to 0 when the form is opened
            setFormData(initialFormData);
            form.resetFields();
            setCurrentStep(0);
        }
    }, [visible, form]);

    const steps = [
        {
            title: 'Personal Information',
            content: (
                <Form
                    form={form}
                    onFinish={(values) => {
                        setFormData({...formData, ...values});
                        setCurrentStep(currentStep + 1);
                    }}
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
                    {showEmailInput && (
                        <Form.Item
                            label="User's Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter the user's email",
                                },
                                {
                                    type: 'email',
                                    message: 'Please enter a valid email address',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                    )}
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
                        name="num"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the contact number of the guardian address',
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
                        name="altNum"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter the contact number of the guardian address',
                            },
                            {
                                pattern: /^(0\d{9})$/, // This regex pattern checks for 10 digits starting with 0
                                message: 'Please enter a valid 10-digit mobile number starting with 0',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    {currentStep === 0 && (
                        <Button type="primary" htmlType="submit">
                            Next
                        </Button>
                    )}
                </Form>
            ),
        },
        {
            title: 'Device Information',
            content: (
                <Form
                    form={form}
                    onFinish={(values) => {
                        setFormData({...formData, ...values});
                        setCurrentStep(currentStep + 1);
                    }}
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
                    {currentStep > 0 && (
                        <Button style={{marginRight: 8}} onClick={() => setCurrentStep(currentStep - 1)}>
                            Previous
                        </Button>
                    )}
                    {currentStep === 1 && (
                        <Button type="primary" htmlType="submit">
                            Next
                        </Button>
                    )}
                </Form>
            ),
        },
        {
            title: 'Review and Submit',
            content: (

                <div>
                    <div style={{margin: '0px 0px 20px 0px'}}>
                        <Row gutter={16}>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <Card title="Personal Information">
                                    <p><b>Name of the device user: </b><br/>{formData.name}</p>
                                    <p><b>Address of the user: </b><br/>{formData.address}</p>
                                    <p><b>Contact no of the guardian: <br/></b>{formData.num}</p>
                                    <p><b>Alternative Contact no of the guardian: <br/></b>{formData.altNum}</p>
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                <Card title="Device Information">
                                    <p><b>Device ID: </b><br/>{formData.deviceId}</p>
                                    <p><b>Device Secret: </b><br/>{formData.deviceSecret}</p>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                    {currentStep > 0 && (
                        <Button style={{marginRight: 8}} onClick={() => setCurrentStep(currentStep - 1)}>
                            Previous
                        </Button>
                    )}
                    <Button type="primary" onClick={() => handleFormSubmit()}>
                        Submit
                    </Button>
                </div>
            ),
        },
    ];

    const handleFormSubmit = () => {
        setLoading(true);
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

        console.log(requestBody)

        const config = {
            method: 'put',
            url: `${baseUrl}/devices/device/enroll`,
            headers: {
                'Authorization': `Bearer ${idToken}`
            },
            data: requestBody
        };

        axios.request(config)
            .then((response) => {
                // Handle successful response
                console.log('Device enrolled successfully:', response.data);
                message.success('Device enrolled successfully');
                onSuccess();
                onClose();
                if (!userData.isAdmin) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
            })
            .catch((error) => {
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
                onClose();
            })
            .finally(() => {
                setLoading(false);
            });
    };


    return (
        <>
            <LoadingSpinner loading={loading}/>
            <Modal
                visible={visible}
                title="Enroll New Device"
                onCancel={onClose}
                footer={null}
                width={800}
            >
                <div style={{margin: '20px 0px'}}>
                    <Steps current={currentStep}>
                        {steps.map((item, index) => (
                            <Step key={index} title={item.title}/>
                        ))}
                    </Steps>
                </div>
                {steps[currentStep].content}
            </Modal>
        </>
    );
};

export default PopupEnrollForm;
