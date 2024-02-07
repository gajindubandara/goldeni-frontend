import React, {useEffect, useState} from "react";
import {Card, Button, Col, Row, Dropdown, Menu, Popconfirm, Space, message} from "antd";
import PopupEditForm from "./PopupEditForm";
import ultrasonic from '../assets/ultrasonic-sensor.png';
import temp from '../assets/temprature.png';
import ir from '../assets/infrared-sensor.png';
import {EllipsisOutlined} from "@ant-design/icons";
import {baseUrl} from "../services/commonVariables";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const {Meta} = Card;

interface DeviceInfoSectionProps {
    device: Device;
}

interface Device {
    id: string;
    deviceId: string;
    deviceSecret: string;
    registeredEmail: string;
    registeredUsername: string;
    registeredAddress: string;
    macAddress: string;
    emergencyContactNumbers: string[];
    status: string;
    connected: boolean;
}

const DeviceInfoSection: React.FC<DeviceInfoSectionProps> = ({device}) => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const idToken = localStorage.getItem("idToken");
    const [loading, setLoading] = useState(false);
    const [dataToDisplay, setDataToDisplay] = useState<any>();
    const initialDisplayData: any = {
        name: device.registeredUsername,
        number: device.emergencyContactNumbers[0],
        altNumber: device.emergencyContactNumbers[1],
        address: device.registeredAddress,
    };


    useEffect(() => {
        setDataToDisplay(initialDisplayData);
    }, []);

    const showPopup = () => {
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    const handleUpdateData = (updatedDeviceData: any) => {
        // Update device data in DeviceInfoSection state or perform other actions
        setDataToDisplay(updatedDeviceData)
        // console.log('Updated device data:', updatedDeviceData);
        // You can update state or perform any necessary action here
    };

    const handleDisenroll = (deviceId: string) => {
        setLoading(true);
        const config = {
            method: 'put',
            url: `${baseUrl}/devices/device/disenroll?id=${deviceId}`,
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        };

        axios.request(config)
            .then((response) => {
                // Handle success response
                message.success('Device disenrolled successfully');
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            })
            .catch((error) => {
                // Handle error
                console.error('Error updating device:', error);
                // You can display an error message here using antd message or other means
                message.error('Error updating device. Please try again.');
            }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <>
            <LoadingSpinner loading={loading}/>
            <div>
                <Card style={{background: "#f5f5f5"}}>
                    <Card style={{padding: "0px 24px !important"}}>
                        <Row gutter={16}>
                            <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                <div className="user-detail-item">
                                    <b>User's Name: </b>
                                    <br/>
                                    {dataToDisplay ? dataToDisplay.name : "Loading..."}
                                </div>
                            </Col>
                            <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                <div className="user-detail-item">
                                    <b>Guardian's No: </b>
                                    <br/>
                                    {dataToDisplay ? dataToDisplay.number + ", " + dataToDisplay.altNumber : "Loading..."}
                                </div>
                            </Col>
                            <Col xs={24} sm={10} md={10} lg={10} xl={10}>
                                <div className="user-detail-item">
                                    <b>User's Address: </b>
                                    <br/>
                                    {dataToDisplay ? dataToDisplay.address : "Loading..."}
                                </div>
                            </Col>
                            <Col xs={24} sm={2} md={2} lg={2} xl={2}>
                                <Space size="middle" style={{float: 'right', margin: '10px auto'}}>
                                    <Dropdown
                                        overlay={
                                            <Menu>
                                                <Menu.Item key="update">
                                                    <Button type="link" onClick={showPopup}>Update Info</Button>
                                                </Menu.Item>
                                                <Menu.Item key="disenroll">
                                                    <Popconfirm
                                                        title="Are you sure to disenroll this device?"
                                                        onConfirm={() => handleDisenroll(device.deviceId)}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <Button type="link" danger>Disenroll Device</Button>
                                                    </Popconfirm>
                                                </Menu.Item>
                                            </Menu>
                                        }
                                        placement="bottomLeft"
                                        trigger={['click']}
                                    >
                                        <Button type="text" icon={<EllipsisOutlined style={{fontSize: '24px'}}/>}/>
                                    </Dropdown>
                                </Space>
                            </Col>
                        </Row>
                    </Card>

                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Card style={{marginTop: 16, border: "1px solid #cfcfcf"}}>
                                <Meta
                                    avatar={
                                        <div>
                                            <svg
                                                width="60"
                                                height="60"
                                                fill="none"
                                                stroke="#1db909"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                                                <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                                                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                                                <path d="M12 20h.01"></path>
                                            </svg>
                                        </div>
                                    }
                                    title={<div style={{fontSize: "20px"}}>Connected</div>}
                                    description={
                                        <div style={{fontWeight: "bolder", color: "black"}}>
                                            System Connection
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Card style={{marginTop: 16, border: "1px solid #cfcfcf"}}>
                                <Meta
                                    avatar={
                                        <div>
                                            <img src={temp} alt="Icon" style={{width: "60px"}}/>
                                        </div>
                                    }
                                    title={<div style={{fontSize: "20px"}}>36.00°</div>}
                                    description={
                                        <div style={{fontWeight: "bolder", color: "black"}}>
                                            System Temperature
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Card style={{marginTop: 16, border: "1px solid #cfcfcf"}}>
                                <Meta
                                    avatar={
                                        <div>
                                            <img src={ir} alt="Icon" style={{width: "60px"}}/>
                                        </div>
                                    }
                                    title={<div style={{fontSize: "20px"}}>ON</div>}
                                    description={
                                        <div style={{fontWeight: "bolder", color: "black"}}>
                                            Infrared Sensor
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Card style={{marginTop: 16, border: "1px solid #cfcfcf"}}>
                                <Meta
                                    avatar={
                                        <div>
                                            <img
                                                src={ultrasonic}
                                                alt="Icon"
                                                style={{width: "60px"}}
                                            />
                                        </div>
                                    }
                                    title={<div style={{fontSize: "20px"}}>90.00cm</div>}
                                    description={
                                        <div style={{fontWeight: "bolder", color: "black"}}>
                                            Top Ultrasonic
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Card style={{marginTop: 16, border: "1px solid #cfcfcf"}}>
                                <Meta
                                    avatar={
                                        <div>
                                            <img
                                                src={ultrasonic}
                                                alt="Icon"
                                                style={{width: "60px"}}
                                            />
                                        </div>
                                    }
                                    title={<div style={{fontSize: "20px"}}>90.00cm</div>}
                                    description={
                                        <div style={{fontWeight: "bolder", color: "black"}}>
                                            Middle Ultrasonic
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                            <Card style={{marginTop: 16, border: "1px solid #cfcfcf"}}>
                                <Meta
                                    avatar={
                                        <div>
                                            <img
                                                src={ultrasonic}
                                                alt="Icon"
                                                style={{width: "60px"}}
                                            />
                                        </div>
                                    }
                                    title={<div style={{fontSize: "20px"}}>90.00cm</div>}
                                    description={
                                        <div style={{fontWeight: "bolder", color: "black"}}>
                                            Bottom Ultrasonic
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16}>

                    </Row>
                </Card>
                <PopupEditForm
                    visible={isPopupVisible}
                    onClose={closePopup}
                    deviceData={device}
                    onUpdateDevice={handleUpdateData}
                />
            </div>
        </>
    );
};

export default DeviceInfoSection;
