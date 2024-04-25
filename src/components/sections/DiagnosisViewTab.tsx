import React from 'react';
import { Row, Col, Card, Statistic, Empty } from 'antd';
import Simulation from "../simulation/Simulation";
import MapComponent from "../maps/MapComponent";
import map from "../../assets/map.png";

interface DiagnosisViewTabProps {
    connection: boolean;
    socketData: {
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
    };
    center: {
        latitude: number;
        longitude: number;
        zoom: number;
    };
    markers: Array<any>; // Adjust the type according to your markers
}

const DiagnosisViewTab: React.FC<DiagnosisViewTabProps> = ({
                                                               connection,
                                                               socketData,
                                                               center,
                                                               markers,
                                                           }) => {
    return (
        <>
            <Row gutter={16}>
                <Col xs={24} sm={6} md={6} lg={6} xl={6} className="stat-col">
                    <Card className="stats-card">
                        <Statistic
                            title="Connection Status"
                            value={connection ? "Connected" : "Disconnected"}
                            valueStyle={{ color: connection ? '#3f8600' : '#f5222d' }}
                        />
                    </Card>
                    <Card className="stats-card">
                        <Statistic
                            title="Top Ultra Sonic"
                            value={socketData.ultrasonicHead}
                            suffix="cm"
                            precision={2}
                        />
                    </Card>
                    <Card className="stats-card">
                        <Statistic
                            title="IR Sensor"
                            value={socketData.irFront ? "On" : "Off"}
                            valueStyle={{ color: socketData.irFront ? '#3f8600' : '#f5222d' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6} md={6} lg={6} xl={6} className="stat-col">
                    <Card className="stats-card">
                        <Statistic
                            title="System Temperature"
                            value={socketData.temp}
                            suffix="°"
                            precision={2}
                        />
                    </Card>
                    <Card className="stats-card">
                        <Statistic
                            title="Mid Ultra Sonic"
                            value={socketData.ultrasonicMid}
                            suffix="cm"
                            precision={2}
                        />
                    </Card>
                    <Card className="stats-card">
                        <Statistic
                            title="IR Sensor 2"
                            value={socketData.irBack ? "On" : "Off"}
                            valueStyle={{ color: socketData.irBack ? '#3f8600' : '#f5222d' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Card className="simulation-card">
                        <Simulation
                            xAngle={socketData.gyroX}
                            yAngle={socketData.gyroY}
                            zAngle={socketData.gyroZ}
                        />
                    </Card>
                </Col>
            </Row>

            {connection && socketData.latitude !== 0 ? (
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

export default DiagnosisViewTab;
