import React from 'react';
import { Row, Col, Card, Statistic, Empty } from 'antd';
import MapComponent from "../maps/MapComponent";
import map from "../../assets/map.png";

interface basicViewTabProps {
    connection: boolean;
    socketData: {
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
    };
    center: {
        lat: number;
        long: number;
        zoom: number;
    };
    markers: Array<any>;
}

const BasicViewTab: React.FC<basicViewTabProps> = ({
                                                     connection,
                                                     socketData,
                                                     center,
                                                     markers,
                                                 }) => {
    return (
        <>
            <Row gutter={16}>
                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Card className="stats-card">
                        <Statistic
                            title="Connection Status"
                            value={connection ? "Connected" : "Disconnected"}
                            valueStyle={{ color: connection ? '#3f8600' : '#f5222d' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Card className="stats-card">
                        <Statistic
                            title="Head Level Obstacles"
                            value={socketData.headObj ? "Detected" : "Clear"}
                            valueStyle={{ color: socketData.headObj ? '#f5222d' : '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Card className="stats-card">
                        <Statistic
                            title="Mid Level Obstacles"
                            value={socketData.midObj ? "Detected" : "Clear"}
                            valueStyle={{ color: socketData.midObj ? '#f5222d' : '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Card className="stats-card">
                        <Statistic
                            title="Low Level Obstacles"
                            value={socketData.stair ? "Detected" : "Clear"}
                            valueStyle={{ color: socketData.stair ? '#f5222d' : '#3f8600' }}
                        />
                    </Card>
                </Col>
            </Row>

            {connection && socketData.lat !== 0 ? (
                <MapComponent center={center} markers={markers} classname="map-container" />
            ) : (
                <div className="map-container map-placeholder">
                    <div>
                        <Empty
                            image={map}
                            imageStyle={{
                                height: 60,
                            }}
                            description={<span>Unable to load the map...</span>}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default BasicViewTab;
