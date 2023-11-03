import React, { useState,useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';



interface PopupFormProps {
  visible: boolean;
  onClose: () => void;
  data:any;
}

interface FormData {
  name: string;
  num: number;
  address: string;
  deviceName: string;
  deviceSecret: string;
}

const initialFormData: FormData = {
    name: '',
    num: 0,
    address: '',
    deviceName: '',
    deviceSecret: '',
  };

const PopupEditForm: React.FC<PopupFormProps> = ({ visible, onClose,data }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<FormData>(initialFormData);



//   const handleFormSubmit = () => {
//     form
//       .validateFields()
//       .then(() => {
//         message.success('Form submitted successfully');
//         onClose();
//       })
//       .catch((error) => {
//         message.error('Form submission failed');
//       });
//   };

  useEffect(() => {
    if (visible) {
      // Reset the form data and set the current step to 0 when the form is opened
      setFormData(initialFormData);
      form.resetFields();
    //   setCurrentStep(0);
    }
  }, [visible, form]);

  return (
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
            setFormData({ ...formData, ...values });
            setCurrentStep(currentStep + 1);
          }}
        >
          <Form.Item
            label="Device  name"
            name="deviceName"
            rules={[
              {
                required: true,
                message: "Please enter the device name",
              },
            ]}
          >
            <Input />
          </Form.Item>
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
            <Button type="primary" htmlType="submit">
              Save
            </Button>
  
        </Form>
      </div>
    </Modal>
  );
};

export default PopupEditForm;
