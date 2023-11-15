import React from "react";
import { Row, Col, Button } from "antd";
import DeviceInfoSection from "./DeviceInfoSection";

interface DeviceInfoCardProps {
    toggleCards: () => void;
}
const DeviceInfoCard: React.FC<DeviceInfoCardProps> = ({ toggleCards }) => {
    return (
        <div className="section-break">
            <Row gutter={16}>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <h2>Device Information</h2>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Button
                        type="primary"
                        onClick={() => toggleCards()}
                        style={{ display: "block", margin: "10px 0px 10px auto" }}
                    >
                        Back to Devices
                    </Button>
                </Col>
            </Row>
            <DeviceInfoSection />
        </div>
    );
};

export default DeviceInfoCard;
