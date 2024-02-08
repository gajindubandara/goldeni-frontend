import React, {useEffect, useMemo, useState} from "react";
import {Card, Button, Col, Row, Dropdown, Menu, Popconfirm, Space, message, Statistic} from "antd";
import PopupEditForm from "./PopupEditForm";
import ultrasonic from '../assets/ultrasonic-sensor.png';
import temp from '../assets/temprature.png';
import ir from '../assets/infrared-sensor.png';
import {EllipsisOutlined} from "@ant-design/icons";
import {baseUrl} from "../services/commonVariables";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import MapComponent from "./MapComponent";

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
    const [lat, setLat] = useState(7.2955);
    const [long, setLong] = useState(80.6356);
    const [dataToDisplay, setDataToDisplay] = useState<any>();

    const initialDisplayData = useMemo(() => ({
        name: device.registeredUsername,
        number: device.emergencyContactNumbers[0],
        altNumber: device.emergencyContactNumbers[1],
        address: device.registeredAddress,
    }), [device]);

    useEffect(() => {
        setDataToDisplay(initialDisplayData);
    }, [initialDisplayData]);


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

                        <Col xs={24} sm={6} md={6} lg={6} xl={6} className="stat-col">

                            <Col>
                                <Card className="stats-card">
                                    <Statistic title="Connection" value={"Connected"} valueStyle={{color: '#3f8600'}}/>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="stats-card">
                                    <Statistic title="Systme Temp" value={36.78} suffix="°" precision={2}/>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="stats-card">
                                    <Statistic title="IR Sensor" value={"On"} valueStyle={{color: '#3f8600'}}/>
                                </Card>
                            </Col>
                        </Col>
                        <Col xs={24} sm={6} md={6} lg={6} xl={6} className="stat-col">
                            <Col>
                                <Card className="stats-card">
                                    <Statistic title="Top Ultra Sonic" value={80.34} suffix="cm" precision={2}/>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="stats-card">
                                    <Statistic title="Mid Ultra Sonic" value={45.56} suffix="cm" precision={2}/>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="stats-card">
                                    <Statistic title="Bottom Ultra Sonic" value={50.56} suffix="cm" precision={2}/>
                                </Card>
                            </Col>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                            <Card className="simulation-card">
                                <div>For 3D simulation</div>
                            </Card>
                        </Col>
                    </Row>

                    <div>
                        <MapComponent lat={lat} long={long} username={device.registeredUsername}/>
                    </div>

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
