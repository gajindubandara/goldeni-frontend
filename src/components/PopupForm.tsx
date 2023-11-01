import React, { useState,useEffect } from 'react';
import { Modal, Form, Input, Button, message, Steps,Card,Row,Col } from 'antd';


const { Step } = Steps;

interface PopupFormProps {
  visible: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  address: string;
  deviceName: string;
  deviceSecret: string;
}

const initialFormData: FormData = {
    name: '',
    email: '',
    address: '',
    deviceName: '',
    deviceSecret: '',
  };

const PopupForm: React.FC<PopupFormProps> = ({ visible, onClose }) => {
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
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please enter your name',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please enter your email address',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: 'Please enter your address',
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
                <p><b>Name: </b>{formData.name}</p>
                <p><b>Email: </b>{formData.email}</p>
                <p><b>Address: </b>{formData.address}</p>
                </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <Card title="Device Information">
                <p><b>Device Name: </b>{formData.deviceName}</p>
                <p><b>Device Secret: </b>{formData.deviceSecret}</p>
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
      title="Multi-Step Form"
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

export default PopupForm;
