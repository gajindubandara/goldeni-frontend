import React, {useEffect, useMemo, useState} from "react";
import {Button, Card, Col, Dropdown, Empty, Menu, message, Popconfirm, Row, Space, Statistic, Tabs} from "antd";
import PopupEditForm from "../popups/PopupEditForm";
import {EllipsisOutlined} from "@ant-design/icons";
import LoadingSpinner from "../utils/LoadingSpinner";
import MapComponent from "../maps/MapComponent";
import Simulation from "../simulation/Simulation";
import {socketUrl} from "../../services/commonVariables";
import map from "../../assets/map.png"
import {disenrollDevice} from "../../util/common-api-services";
import {ApexOptions} from "apexcharts";
import ReactApexChart from "react-apexcharts";


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
    ir1: boolean;
    ir2: boolean;
    lat: number;
    long: number;
    gyroX: number;
    gyroY: number;
    gyroZ: number;
    temp: number;
    stair: number;
    headObj: number;
    midObj: number;
    timestamp: number;

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
    const [midSensorValues, setMidSensorValues] = useState<number[]>([]);
    const [headSensorValues, setHeadSensorValues] = useState<number[]>([]);
    const [xAngleValues, setXAngleValues] = useState<number[]>([]);
    const [yAngleValues, setYAngleValues] = useState<number[]>([]);
    const [zAngleValues, setZAngleValues] = useState<number[]>([]);
    const [temperature, setTemperature] = useState<number[]>([]);
    const [timeStamps, setTimeStamps] = useState<any[]>([]);


    const [markers, setMakers] = useState<MarkerInfo[]>([]);
    const initialSocketData = {
        ut: 0.00,
        um: 0.00,
        ir1: false,
        ir2: false,
        lat: 0,
        long: 0,
        gyroX: 0,
        gyroY: 0,
        gyroZ: 0,
        temp: 0,
        stair: 0,
        headObj: 0,
        midObj: 0,
        timestamp: 0.
    }

    const ultraChartOptions: ApexOptions = {
        chart: {
            height: 350,
            type: "line",
            zoom: {
                enabled: true,
            },
        },
        xaxis: {
            categories: timeStamps
        },
        yaxis: {
            max: 300,
        },
    };

    const tempChartOptions: ApexOptions = {
        chart: {
            height: 350,
            type: "line",
            zoom: {
                enabled: true,
            },
        },
        xaxis: {
            categories: timeStamps
        },
        yaxis: {
            labels: {
                formatter: function (value: number) {
                    return value.toFixed(2);
                },
            },
        },
    };

    const angleChartOptions: ApexOptions = {
        chart: {
            height: 350,
            type: "line",
            zoom: {
                enabled: true,
            },
        },
        xaxis: {
            categories: timeStamps
        },
        yaxis: {
            labels: {
                formatter: function (value: number) {
                    return value.toFixed(2);
                },
            },
        },
    };

    const ultraSeries = [{
        name: 'Head Ultra',
        data: headSensorValues
    },
        {
            name: 'Mid Ultra',
            data: midSensorValues
        }
    ]

    const angleSeries = [{
        name: 'X axis',
        data: xAngleValues
    },
        {
            name: 'Y axis',
            data: yAngleValues
        },
        {
            name: 'Z axis',
            data: zAngleValues
        }
    ]

    const tempSeries = [{
        name: 'Temperature',
        data: temperature
    }
    ]

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

        let socket = new WebSocket(`${socketUrl}/device?id=${device.deviceId}&secret=${device.deviceSecret}`);
        let heartbeatInterval: any;
        const connectWebSocket = () => {

            socket.onopen = () => {
                console.log('WebSocket connection established.');
                startHeartbeat();
            };

            socket.onmessage = (event) => {
                // console.log('Received message:', event.data);
                try {
                    const data: socket = JSON.parse(event.data);
                    if (validateSocketData(data)) {
                        resetHeartbeat();
                        setSocketData(data);
                        setMidSensorValues(prevNumbers => {
                            return [...prevNumbers, data.um].slice(-50);
                        });
                        setHeadSensorValues(prevNumbers => {
                            return [...prevNumbers, data.ut].slice(-50);
                        });

                        setXAngleValues(prevNumbers => {
                            return [...prevNumbers, data.gyroX].slice(-50);
                        });
                        setYAngleValues(prevNumbers => {
                            return [...prevNumbers, data.gyroY].slice(-50);
                        });

                        setZAngleValues(prevNumbers => {
                            return [...prevNumbers, data.gyroZ].slice(-50);
                        });
                        setTemperature(prevNumbers => {
                            return [...prevNumbers, data.temp].slice(-50);
                        });
                        setTimeStamps(prevNumbers => {
                            const options = {hour12: false};
                            const formattedTimestamp = new Date(data.timestamp * 1000).toLocaleTimeString([], options);
                            return [...prevNumbers, formattedTimestamp].slice(-50);
                        });


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

            socket.onclose = (event) => {
                console.log(event)
                console.log('WebSocket connection closed.');
                setConnection(false);
                // Attempt reconnection after 5 seconds
                setTimeout(connectWebSocket, 5000);
            };
        };

        const startHeartbeat = () => {
            heartbeatInterval = setInterval(() => {
                // Send a heartbeat message to the server
                socket.send(JSON.stringify({type: 'heartbeat'}));
            }, 5000); // Send heartbeat every 5 seconds
        };

        const resetHeartbeat = () => {
            clearInterval(heartbeatInterval);
            startHeartbeat();
        };

        const stopHeartbeat = () => {
            clearInterval(heartbeatInterval);
        };

        connectWebSocket(); // Initial connection

        return () => {
            socket.close();
            stopHeartbeat();
        };
    }, [initialDisplayData, device.deviceId, device.registeredUsername,device.deviceSecret]);


    const validateSocketData = (data: any): data is socket => {
        return (
            typeof data.ut === 'number' &&
            typeof data.um === 'number' &&
            typeof data.ir1 === 'boolean' &&
            typeof data.ir2 === 'boolean' &&
            typeof data.lat === 'number' &&
            typeof data.long === 'number' &&
            typeof data.gyroX === 'number' &&
            typeof data.gyroY === 'number' &&
            typeof data.gyroZ === 'number' &&
            typeof data.temp === 'number' &&
            typeof data.stair === 'number' &&
            typeof data.headObj === 'number' &&
            typeof data.midObj === 'number' &&
            typeof data.timestamp === 'number'


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

    const {TabPane} = Tabs;


    const handleDisenroll = async (deviceId: string) => {
        setLoading(true);
        try {

            const response = await disenrollDevice(idToken!, deviceId);
            console.log(response.data);
            // Handle success response
            message.success('Device dis-enrolled successfully');
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            // Handle error
            console.error('Error updating device:', error);
            // You can display an error message here using antd message or other means
            message.error('Error updating device. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const day = date.getDate();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${day} ${monthNames[monthIndex]}, ${year} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <>
            <LoadingSpinner loading={loading}/>
            <div>
                <div>
                    <div style={{marginTop: '10px', marginBottom: '10px'}}> Last Updated at
                        : {formatDate(socketData.timestamp)}</div>
                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab="Basic View" key="1">
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
                                                                <Button type="link" onClick={showPopup}>Update
                                                                    Info</Button>
                                                            </Menu.Item>
                                                            <Menu.Item key="disenroll">
                                                                <Popconfirm
                                                                    title="Are you sure to disenroll this device?"
                                                                    onConfirm={() => handleDisenroll(device.deviceId)}
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                >
                                                                    <Button type="link" danger>Dis-enroll
                                                                        Device</Button>
                                                                </Popconfirm>
                                                            </Menu.Item>
                                                        </Menu>
                                                    }
                                                    placement="bottomLeft"
                                                    trigger={['click']}
                                                >
                                                    <Button type="text"
                                                            icon={<EllipsisOutlined style={{fontSize: '24px'}}/>}/>
                                                </Dropdown>
                                            </Space>
                                        </Col>
                                    </Row>
                                </Card>

                                <Row gutter={16}>
                                    <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                        <Card className="stats-card">
                                            <Statistic title="Connection Status"
                                                       value={connection ? "Connected" : "Disconnected"}
                                                       valueStyle={{color: connection ? '#3f8600' : '#f5222d'}}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                        <Card className="stats-card">
                                            <Statistic title="Head Level Obstacles"
                                                       value={socketData.headObj ? "Obstacle Detected" : "Clear"}
                                                       valueStyle={{color: socketData.headObj ? '#f5222d' : '#3f8600'}}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                        <Card className="stats-card">
                                            <Statistic title="Mid Level Obstacles"
                                                       value={socketData.midObj ? "Obstacle Detected" : "Clear"}
                                                       valueStyle={{color: socketData.midObj ? '#f5222d' : '#3f8600'}}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                                        <Card className="stats-card">
                                            <Statistic title="Low Level Obstacles"
                                                       value={socketData.stair ? "Obstacle Detected" : "Clear"}
                                                       valueStyle={{color: socketData.stair ? '#f5222d' : '#3f8600'}}
                                            />
                                        </Card>
                                    </Col>
                                </Row>


                                {connection && socketData.lat !== 0 ? (
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
                        </TabPane>
                        <TabPane tab="Diagnosis View" key="2">
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
                                                                <Button type="link" onClick={showPopup}>Update
                                                                    Info</Button>
                                                            </Menu.Item>
                                                            <Menu.Item key="disenroll">
                                                                <Popconfirm
                                                                    title="Are you sure to disenroll this device?"
                                                                    onConfirm={() => handleDisenroll(device.deviceId)}
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                >
                                                                    <Button type="link" danger>Dis-enroll
                                                                        Device</Button>
                                                                </Popconfirm>
                                                            </Menu.Item>
                                                        </Menu>
                                                    }
                                                    placement="bottomLeft"
                                                    trigger={['click']}
                                                >
                                                    <Button type="text"
                                                            icon={<EllipsisOutlined style={{fontSize: '24px'}}/>}/>
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
                                                <Statistic title="Top Ultra Sonic" value={socketData.ut} suffix="cm"
                                                           precision={2}/>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card className="stats-card">
                                                <Statistic
                                                    title="IR Sensor"
                                                    value={socketData.ir1 ? "On" : "Off"}
                                                    valueStyle={{color: socketData.ir1 ? '#3f8600' : '#f5222d'}}
                                                />
                                            </Card>
                                        </Col>
                                    </Col>
                                    <Col xs={24} sm={6} md={6} lg={6} xl={6} className="stat-col">
                                        <Col>
                                            <Card className="stats-card">
                                                <Statistic title="System Temprature" value={socketData.temp} suffix="°"
                                                           precision={2}/> </Card>
                                        </Col>
                                        <Col>
                                            <Card className="stats-card">
                                                <Statistic title="Mid Ultra Sonic" value={socketData.um} suffix="cm"
                                                           precision={2}/>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card className="stats-card">
                                                <Statistic
                                                    title="IR Sensor 2"
                                                    value={socketData.ir2 ? "On" : "Off"}
                                                    valueStyle={{color: socketData.ir2 ? '#3f8600' : '#f5222d'}}
                                                />
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

                                {connection && socketData.lat !== 0 ? (
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
                        </TabPane>
                        <TabPane tab="Chart View" key="3">
                            <Card style={{background: "#f5f5f5", marginTop: "10px"}}>
                                <h3>Ultra-Sonic Readings</h3>
                                <ReactApexChart
                                    options={ultraChartOptions}
                                    series={ultraSeries}
                                    type="line"
                                    height={350}
                                />
                            </Card>
                            <Card style={{background: "#f5f5f5", marginTop: "10px"}}>
                                <h3>Orientation Readings</h3>
                                <ReactApexChart
                                    options={angleChartOptions}
                                    series={angleSeries}
                                    type="line"
                                    height={350}
                                />
                            </Card>
                            <Card style={{background: "#f5f5f5", marginTop: "10px"}}>
                                <h3>System Temperature Readings</h3>
                                <ReactApexChart
                                    options={tempChartOptions}
                                    series={tempSeries}
                                    type="line"
                                    height={350}
                                />
                            </Card>
                        </TabPane>
                    </Tabs>
                </div>

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
