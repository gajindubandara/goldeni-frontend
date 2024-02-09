import React, {useEffect, useMemo, useState} from "react";
import {Card, Button, Col, Row, Dropdown, Menu, Popconfirm, Space, message, Statistic, Empty} from "antd";
import PopupEditForm from "../popups/PopupEditForm";
import {EllipsisOutlined} from "@ant-design/icons";
import {baseUrl} from "../../services/commonVariables";
import axios from "axios";
import LoadingSpinner from "../utils/LoadingSpinner";
import MapComponent from "../maps/MapComponent";
import Simulation from "../simulation/Simulation";
import {socketUrl} from "../../services/commonVariables";
import map from "../../assets/map.png"


interface DeviceInfoSectionProps {
    device: Device;
}

interface MarkerInfo {
    lat: number;
    long: number;
    username: string;
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

interface socket {
    ut: number;
    um: number;
    ub: number;
    ir: boolean;
    lat: number;
    long: number;
    gyroX: number;
    gyroY: number;
    gyroZ: number;
    temp: number;

}

const DeviceInfoSection: React.FC<DeviceInfoSectionProps> = ({device}) => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const idToken = localStorage.getItem("idToken");
    const [loading, setLoading] = useState(false);
    const [connection, setConnection] = useState(false);
    const [center, setCenter] = useState({
        lat: 0,
        long: 0,
        zoom: 16,
    })

    const [markers, setMakers] = useState<MarkerInfo[]>([]);
    const initialSocketData = {
        ut: 0.00,
        um: 0.00,
        ub: 0.00,
        ir: false,
        lat: 0,
        long: 0,
        gyroX: 0,
        gyroY: 0,
        gyroZ: 0,
        temp: 0,
    }
    const [dataToDisplay, setDataToDisplay] = useState<any>();
    const [socketData, setSocketData] = useState<socket>(initialSocketData);

    const initialDisplayData = useMemo(() => ({
        name: device.registeredUsername,
        number: device.emergencyContactNumbers[0],
        altNumber: device.emergencyContactNumbers[1],
        address: device.registeredAddress,
    }), [device]);


    useEffect(() => {
        setDataToDisplay(initialDisplayData);

        let socket = new WebSocket(`${socketUrl}/device?id=${device.deviceId}`);
        const connectWebSocket = () => {

            socket.onopen = () => {
                console.log('WebSocket connection established.');
            };

            socket.onmessage = (event) => {
                // console.log('Received message:', event.data);
                try {
                    const data: socket = JSON.parse(event.data);
                    if (validateSocketData(data)) {
                        setSocketData(data)
                        const center = {
                            lat: data.lat,
                            long: data.long,
                            zoom: 16
                        }
                        const marker = [{
                            lat: data.lat,
                            long: data.long,
                            username: device.registeredUsername
                        }]
                        setCenter(center);
                        setMakers(marker)
                        setConnection(true);
                    } else {
                        console.log('Invalid data format:', data);
                    }
                } catch (error) {
                    console.log('Error parsing JSON:', error);
                }
            };

            socket.onclose = () => {
                console.log('WebSocket connection closed.');
                setConnection(false);
                // Attempt reconnection after 5 seconds
                setTimeout(connectWebSocket, 5000);
            };
        };

        connectWebSocket(); // Initial connection

        return () => {
            socket.close();
        };
    }, [initialDisplayData, device.deviceId, device.registeredUsername]);


    const validateSocketData = (data: any): data is socket => {
        return (
            typeof data.ut === 'number' &&
            typeof data.um === 'number' &&
            typeof data.ub === 'number' &&
            typeof data.ir === 'boolean' &&
            typeof data.lat === 'number' &&
            typeof data.long === 'number' &&
            typeof data.gyroX === 'number' &&
            typeof data.gyroY === 'number' &&
            typeof data.gyroZ === 'number' &&
            typeof data.temp === 'number'
        );
    };

    const showPopup = () => {
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    const handleUpdateData = (updatedDeviceData: any) => {
        setDataToDisplay(updatedDeviceData)
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
                                                        <Button type="link" danger>Dis-enroll Device</Button>
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
                                    <Statistic title="Connection Status"
                                               value={connection ? "Connected" : "Disconnected"}
                                               valueStyle={{color: connection ? '#3f8600' : '#f5222d'}}
                                    />
                                </Card>
                            </Col>
                            <Col>
                                <Card className="stats-card">
                                    <Statistic title="System Temprature" value={socketData.temp} suffix="°"
                                               precision={2}/>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="stats-card">
                                    <Statistic
                                        title="IR Sensor"
                                        value={socketData.ir ? "On" : "Off"}
                                        valueStyle={{color: socketData.ir ? '#3f8600' : '#f5222d'}}
                                    />
                                </Card>
                            </Col>
                        </Col>
                        <Col xs={24} sm={6} md={6} lg={6} xl={6} className="stat-col">
                            <Col>
                                <Card className="stats-card">
                                    <Statistic title="Top Ultra Sonic" value={socketData.ut} suffix="cm" precision={2}/>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="stats-card">
                                    <Statistic title="Mid Ultra Sonic" value={socketData.um} suffix="cm" precision={2}/>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="stats-card">
                                    <Statistic title="Bottom Ultra Sonic" value={socketData.ub} suffix="cm"
                                               precision={2}/>
                                </Card>
                            </Col>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                            <Card className="simulation-card">
                                <Simulation xAngle={socketData.gyroX} yAngle={socketData.gyroY}
                                            zAngle={socketData.gyroZ}/>
                            </Card>
                        </Col>
                    </Row>

                    {connection ? (
                            <div>
                                <MapComponent center={center} markers={markers}
                                              classname="map-container"/>{/*<MapComponent classname={"map-container"} username={device.registeredUsername} location={locationData}/>*/}
                            </div>
                        ) :
                        (
                            <div>
                                <div className="map-container map-placeholder">
                                    <div>
                                    <Empty
                                        image={map}
                                        imageStyle={{
                                            height: 60,
                                        }}

                                        description={
                                            <span>Unable to load the map...</span>
                                        }
                                    >
                                    </Empty>
                                    </div>
                                </div>
                            </div>
                        )
                    }

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
