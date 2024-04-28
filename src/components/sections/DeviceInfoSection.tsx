import React, {useEffect, useMemo, useState} from "react";
import {Card, message, Tabs} from "antd";
import PopupEditForm from "../popups/PopupEditForm";
import LoadingSpinner from "../utils/LoadingSpinner";
import {socketUrl} from "../../services/commonVariables";
import {disenrollDevice} from "../../util/common-api-services";
import BasicViewTab from "./BasicViewTab";
import DiagnosisViewTab from "./DiagnosisViewTab";
import ChartViewTab from "./ChartViewTab";
import {setConnectionState} from "../../util/user-api-services";
import DisconnectedView from "./DisconnectedView";
import UserDataView from "./UserDataView";
import NotificationViewTab from "./NotificationViewTab";


interface DeviceInfoSectionProps {
    device: Device;
}

interface MarkerInfo {
    latitude: number;
    longitude: number;
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
    ultrasonicHead: number;
    ultrasonicMid: number;
    irFront: boolean;
    irBack: boolean;
    latitude: number;
    longitude: number;
    gyroX: number;
    gyroY: number;
    gyroZ: number;
    temp: number;
    isStaircase: number;
    isHeadObstacle: number;
    isMidObstacle: number;
    timestamp: number;

}

const DeviceInfoSection: React.FC<DeviceInfoSectionProps> = ({device}) => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const idToken = localStorage.getItem("idToken");
    const [loading, setLoading] = useState(false);
    const [connection, setConnection] = useState(false);
    const [center, setCenter] = useState({
        latitude: 0,
        longitude: 0,
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
        ultrasonicHead: 0.00,
        ultrasonicMid: 0.00,
        irFront: false,
        irBack: false,
        latitude: 0,
        longitude: 0,
        gyroX: 0,
        gyroY: 0,
        gyroZ: 0,
        temp: 0,
        isStaircase: 0,
        isHeadObstacle: 0,
        isMidObstacle: 0,
        timestamp: 0
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
                            return [...prevNumbers, data.ultrasonicMid].slice(-50);
                        });
                        setHeadSensorValues(prevNumbers => {
                            return [...prevNumbers, data.ultrasonicHead].slice(-50);
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
                            latitude: data.latitude,
                            longitude: data.longitude,
                            zoom: 16
                        }
                        const marker = [{
                            latitude: data.latitude,
                            longitude: data.longitude,
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
                // console.log(event)
                console.log('WebSocket connection closed.');
                setConnection(false);
                // Attempt reconnection after 5 seconds
                setTimeout(connectWebSocket, 5000);
            };
        };

        const startHeartbeat = () => {
            heartbeatInterval = setInterval(() => {
                // Check if the data was received within the last 5 seconds
                const currentTime = Date.now();
                const lastDataTimestamp = socketData.timestamp * 1000; // Convert to milliseconds
                const timeDifference = currentTime - lastDataTimestamp;

                if (timeDifference > 5000) {
                    console.log("Data set not received.");
                    setConnection(false)
                    handleConnectionStateChange(device.deviceId, false);
                } else {
                    // Send a heartbeat message to the server
                    socket.send(JSON.stringify({type: 'heartbeat'}));
                    console.log("Sending heartbeat");
                }
            }, 5000); // Send heartbeat every 5 seconds
        };

        const handleConnectionStateChange = async (deviceId: string, state: boolean) => {
            try {
                await setConnectionState(idToken!, deviceId, state);
            } catch (error) {
                console.error(error);
            }
        };

        // if(!connection){
        //     fetchLastKnownData();
        // }


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
        // eslint-disable-next-line
    }, [initialDisplayData, device.deviceId, device.registeredUsername, device.deviceSecret, idToken]);

    const validateSocketData = (data: any): data is socket => {
        return (
            typeof data.ultrasonicHead === 'number' &&
            typeof data.ultrasonicMid === 'number' &&
            typeof data.irFront === 'boolean' &&
            typeof data.irBack === 'boolean' &&
            typeof data.latitude === 'number' &&
            typeof data.longitude === 'number' &&
            typeof data.gyroX === 'number' &&
            typeof data.gyroY === 'number' &&
            typeof data.gyroZ === 'number' &&
            typeof data.temp === 'number' &&
            typeof data.isStaircase === 'number' &&
            typeof data.isHeadObstacle === 'number' &&
            typeof data.isMidObstacle === 'number' &&
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

            await disenrollDevice(idToken!, deviceId);
            // console.log(response.data);
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
                {connection ? (
                    <div>
                        <div style={{marginTop: '10px', marginBottom: '10px'}}>
                            Last Updated
                            at: {socketData.timestamp !== 0 ? formatDate(socketData.timestamp) : "Time data unavailable"}
                        </div>
                        <Tabs defaultActiveKey="1" type="card">
                            <TabPane tab="Basic View" key="1">
                                <Card style={{background: "#f5f5f5"}}>
                                    <UserDataView
                                        dataToDisplay={dataToDisplay}
                                        showPopup={showPopup}
                                        handleDisenroll={handleDisenroll}
                                        device={device}
                                    />
                                    <BasicViewTab
                                        connection={connection}
                                        socketData={socketData}
                                        center={center}
                                        markers={markers}
                                    />
                                </Card>
                            </TabPane>
                            <TabPane tab="Diagnosis View" key="2">
                                <Card style={{background: "#f5f5f5"}}>
                                    <DiagnosisViewTab
                                        connection={connection}
                                        socketData={socketData}
                                        center={center}
                                        markers={markers}
                                    />
                                </Card>
                            </TabPane>
                            <TabPane tab="Chart View" key="3">
                                <ChartViewTab
                                    timeStamps={timeStamps}
                                    headSensorValues={headSensorValues}
                                    midSensorValues={midSensorValues}
                                    xAngleValues={xAngleValues}
                                    yAngleValues={yAngleValues}
                                    zAngleValues={zAngleValues}
                                    temperature={temperature}
                                />
                            </TabPane>
                            <TabPane tab="Notifications" key="4">
                                    <NotificationViewTab device={device} />
                            </TabPane>
                            <TabPane tab="Previous Data" key="5">
                                <DisconnectedView
                                    device={device}
                                    connection={connection}
                                />
                            </TabPane>
                        </Tabs>
                    </div>
                ) : (
                    <div>
                        <Tabs defaultActiveKey="1" type="card">
                            <TabPane tab="Disconnected view" key="1">
                                <Card style={{background: "#f5f5f5"}}>
                                    <UserDataView
                                        dataToDisplay={dataToDisplay}
                                        showPopup={showPopup}
                                        handleDisenroll={handleDisenroll}
                                        device={device}
                                    />
                                    <h2>Device Disconnected...</h2>
                                    <DisconnectedView
                                        device={device}
                                        connection={connection}
                                    />
                                </Card>
                            </TabPane>
                            <TabPane tab="Notifications" key="2">
                                    <NotificationViewTab device={device} />
                            </TabPane>
                        </Tabs>
                    </div>
                )
                }

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
