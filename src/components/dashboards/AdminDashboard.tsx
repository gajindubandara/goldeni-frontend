import React, {useEffect, useState} from "react";
import MapComponent from "../maps/MapComponent";
import {Card, Col, Empty, message, Row, Statistic} from "antd";
import map from "../../assets/map.png";
import {Interface} from "node:readline";
import {fetchAnalytics, fetchUsers} from "../../util/admin-api-services";
import LoadingSpinner from "../utils/LoadingSpinner";


interface adminStats{
        noOfUsers: number;
        noOfDevices: number;
        noOfNewDevices: number;
        noOfEnrolledDevices: number;
        noOfActiveDevices: number;
        locations: any[];
}
const AdminDashboard: React.FC = () => {
    const center = { lat: 7.8774222 , long: 80.7003428 ,zoom:7}; // Example center
    const idToken = localStorage.getItem("idToken");
    const [loading, setLoading] = useState(false);
    const initialAdminStatsData={
        noOfUsers: 0,
        noOfDevices: 0,
        noOfNewDevices: 0,
        noOfEnrolledDevices: 0,
        noOfActiveDevices: 0,
        locations: []
    }
    const [adminStats, setAdminStats] = useState<adminStats>(initialAdminStatsData);


    useEffect(() => {
        const fetchData = async () => {
            if (idToken) {
                try {
                    const response = await fetchAnalytics(idToken);
                    setAdminStats(response.data)
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                    message.error('Failed to fetch data');
                }
            } else {
                console.error("idToken is null or undefined");
            }
        };

        fetchData();
    }, [idToken]);

    return (

        <>
            <LoadingSpinner loading={loading}/>
            <Row gutter={16}>

                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Card className="stats-card">
                        <Statistic
                            title="Total Devices"
                            value={adminStats.noOfDevices}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Card className="stats-card">
                        <Statistic
                            title="New Devices"
                            value={adminStats.noOfNewDevices}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Card className="stats-card">
                        <Statistic
                            title="Enrolled devices"
                            value={adminStats.noOfEnrolledDevices}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Card className="stats-card">
                        <Statistic
                            title="Active devices"
                            value={adminStats.noOfActiveDevices}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <Card className="stats-card">
                        <Statistic
                            title="Users"
                            value={adminStats.noOfUsers}
                        />
                    </Card>
                </Col>
            </Row>

            {adminStats.locations.length != 0 ? (
                <MapComponent center={center} markers={adminStats.locations.map(item => ({
                    long: item.longitude,
                    lat: item.latitude,
                    username: "anonymous"
                }))} classname="admin-map-container" />
            ) : (
                <div className="admin-map-container map-placeholder admin-map-placeholder">
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

export default AdminDashboard;
