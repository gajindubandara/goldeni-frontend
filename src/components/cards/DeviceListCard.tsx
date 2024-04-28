import React, {useState, useEffect, useCallback} from "react";
import {Card, Row, Col, Button, message} from "antd";
import LoadingSpinner from "../utils/LoadingSpinner";
import {fetchMyDevices, setConnectionState} from "../../util/user-api-services";
import {socketUrl} from "../../services/commonVariables";

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

interface DeviceListCardProps {
    toggleCards: () => void;
    showPopup: () => void; // Assuming showPopup is a function, adjust the type accordingly
    onSelectDevice: (device: Device) => void;
}

const DeviceListCard: React.FC<DeviceListCardProps> = ({toggleCards, showPopup, onSelectDevice}) => {
    const [devices, setDevices] = useState<Device[]>([]);
    const idToken = localStorage.getItem("idToken");
    const [loading, setLoading] = useState(true);


    const connectWebSocketCallback = useCallback((data:any) => {
        if (data.length > 0) {
            data.forEach((device: Device) => {
                // console.log(device.deviceId)
                let socket = new WebSocket(`${socketUrl}/device?id=${device.deviceId}&secret=${device.deviceSecret}`);

                socket.onopen = () => {
                    console.log('WebSocket connection established.',device.deviceId);
                };

                socket.onmessage = (event) => {
                    try {
                        JSON.parse(event.data);
                        console.log('Connected');
                        device.connected=true;
                        setDevices(data);
                        socket.close();
                        handleConnectionStateChange(device.deviceId,true);
                    } catch (error) {
                        handleConnectionStateChange(device.deviceId,false);
                        console.log(error)

                    }
                };

                socket.onclose = (event) => {
                    console.log(event)
                    console.log('WebSocket connection closed.');
                };
            });
        }
        else{console.log("no")
            setTimeout( connectWebSocketCallback, 5000);}
        // eslint-disable-next-line
    }, []);

    const handleConnectionStateChange = async (deviceId: string,state:boolean) => {
        try {
            await setConnectionState(idToken!, deviceId,state);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchData = useCallback(async () => {
        if (idToken) {
            try {
                const deviceResponse = await fetchMyDevices(idToken);
                setDevices(deviceResponse.data);
                connectWebSocketCallback(deviceResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching device data:", error);
                setLoading(false);
                message.error('Failed to fetch devices');
            }
        }
    }, [idToken,  connectWebSocketCallback]);

    useEffect(() => {
        if (idToken) {
            fetchData();
        } else {
            console.error("idToken is null or undefined");
        }

        // if (devices.length > 0) {
        //     console.log("Devices are set. Running forEach function...");
        //     devices.forEach((device: Device) => {
        //         console.log("Device ID:", device.deviceId);
        //         // Call other functions or perform actions with each device here
        //     });
        // } else {
        //     console.log("Devices are not set yet.");
        // }
    }, [idToken,fetchData]);


    const handleDeviceCardClick = (device: Device) => {
        onSelectDevice(device);
        toggleCards();
    };

    return (
        <>
            <LoadingSpinner loading={loading}/>
            <div>

                <h2>Devices</h2>
                <div className="device-msg">
                    Please select a device from the options below, or if you don't have a
                    device to choose from, kindly click the 'Add a Device' button to add a
                    new one.
                </div>
                <div className="device-box">
                    <Row gutter={[16, 16]} style={{padding: "20px"}}>
                        {devices.map((device, index) => (
                            <Col key={device.registeredUsername} xs={24} sm={12} md={8} lg={6} xl={6}>
                                <Card
                                    style={{cursor: "pointer", position: "relative"}}
                                    className="device-card"
                                    onClick={() => handleDeviceCardClick(device)}
                                >
                                    <div className="device-name">{device.registeredUsername}</div>
                                    <div className="device-id">ID: {device.deviceId}</div>
                                    {/*<div className="device-status">Status: {device.status}</div>*/}
                                    {device.connected ? (
                                        <svg
                                            width="20"
                                            height="20"
                                            fill="none"
                                            stroke="#1db909"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                            style={{
                                                position: "absolute",
                                                top: "10px",
                                                right: "10px",
                                            }}
                                        >
                                            <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                                            <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                                            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                                            <path d="M12 20h.01"></path>
                                        </svg>
                                    ) : (
                                        <svg
                                            width="20"
                                            height="20"
                                            fill="none"
                                            stroke="#d00606"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                            style={{
                                                position: "absolute",
                                                top: "10px",
                                                right: "10px",
                                            }}
                                        >
                                            <path d="m1 1 22 22"></path>
                                            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                                            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                                            <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                                            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                                            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                                            <path d="M12 20h.01"></path>
                                        </svg>
                                    )}
                                </Card>
                            </Col>
                        ))}
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Button
                                type="dashed"
                                className="btn-add-device"
                                onClick={showPopup}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"></path>
                                    <path d="M12 8v8"></path>
                                    <path d="M8 12h8"></path>
                                </svg>
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
};

export default DeviceListCard;
