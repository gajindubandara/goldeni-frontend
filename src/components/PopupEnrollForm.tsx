import React, { useState,useEffect } from 'react';
import { Modal, Form, Input, Button, message, Steps,Card,Row,Col } from 'antd';


const { Step } = Steps;

interface PopupFormProps {
  visible: boolean;
  onClose: () => void;
  showEmailInput: boolean;
}

interface FormData {
  name: string;
  num: number;
  address: string;
  deviceName: string;
  deviceSecret: string;
  email: string;
}

const initialFormData: FormData = {
    name: '',
    num: 0,
    address: '',
    deviceName: '',
    deviceSecret: '',
    email: '',
  };

const PopupEnrollForm: React.FC<PopupFormProps> = ({ visible, onClose,showEmailInput  }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<FormData>(initialFormData);


    const steps = [
    {
      title: 'Personal Information',
      content: (
        <Form
          form={form}
          onFinish={(values) => {
            setFormData({ ...formData, ...values });
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
            <Input />
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
                    <Input />
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
            <Input />
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
            <Input />
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
            setFormData({ ...formData, ...values });
            setCurrentStep(currentStep + 1);
          }}
        >
          <Form.Item
            label="Device Name"
            name="deviceName"
            rules={[
              {
                required: true,
                message: 'Please enter the device name',
              },
            ]}
          >
            <Input />
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
            <Input />
          </Form.Item>
          {currentStep > 0 && (
          <Button style={{ marginRight: 8 }} onClick={() => setCurrentStep(currentStep - 1)}>
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

        <div >
            <div style={{margin:'0px 0px 20px 0px'}}>
            <Row gutter={16} >
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <Card title="Personal Information">
                <p><b>Name of the device user: </b><br/>{formData.name}</p>
                <p><b>Address of the user: </b><br/>{formData.address}</p>
                <p><b>Contact no of the guardian: <br/></b>{formData.num}</p>
                </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <Card title="Device Information">
                <p><b>Device Name: </b><br/>{formData.deviceName}</p>
                <p><b>Device Secret: </b><br/>{formData.deviceSecret}</p>
                </Card>
            </Col>
            </Row>
            </div>
          {currentStep > 0 && (
          <Button style={{ marginRight: 8 }} onClick={() => setCurrentStep(currentStep - 1)}>
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
    form
      .validateFields()
      .then(() => {
        message.success('Form submitted successfully');
        onClose();
      })
      .catch((error) => {
        message.error('Form submission failed');
      });
  };

  useEffect(() => {
    if (visible) {
      // Reset the form data and set the current step to 0 when the form is opened
      setFormData(initialFormData);
      form.resetFields();
      setCurrentStep(0);
    }
  }, [visible, form]);

  return (
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
          <Step key={index} title={item.title} />
        ))}
      </Steps>
      </div>
      {steps[currentStep].content}
    </Modal>
  );
};

export default PopupEnrollForm;
