import React from "react";
import {Row, Col, Button} from "antd";
import DeviceInfoSection from "../sections/DeviceInfoSection";

interface DeviceInfoCardProps {
    toggleCards: () => void;
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

const DeviceInfoCard: React.FC<DeviceInfoCardProps> = ({toggleCards, device}) => {
    return (
        <div>
            <Row gutter={16}>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <h2>Device Information</h2>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Button
                        type="primary"
                        onClick={() => toggleCards()}
                        style={{display: "block", margin: "10px 0px 10px auto"}}
                    >
                        Back to Devices
                    </Button>
                </Col>
            </Row>
            <DeviceInfoSection device={device}/>
        </div>
    );
};

export default DeviceInfoCard;
