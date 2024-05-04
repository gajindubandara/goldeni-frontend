import React, {useCallback, useEffect, useState} from "react";
import MapComponent from "../maps/MapComponent";
import {Card, Col, DatePicker, Empty, message, Row, Statistic} from "antd";
import map from "../../assets/map.png";
import {fetchActivity, fetchAnalytics} from "../../util/admin-api-services";
import LoadingSpinner from "../utils/LoadingSpinner";
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';


interface adminStats{
        noOfUsers: number;
        noOfDevices: number;
        noOfNewDevices: number;
        noOfEnrolledDevices: number;
        noOfActiveDevices: number;
        locations: any[];
}

interface DeviceActivity {
    date: string;
    noOfDevices: number;
}

const AdminDashboard: React.FC = () => {
    const center = { latitude: 7.8774222 , longitude: 80.7003428 ,zoom:7}; // Example center
    const idToken = localStorage.getItem("idToken");
    const [isStatLoaded, setIsStatLoaded] = useState(false);
    const [isActivityLoaded, setIsActivityLoaded] = useState(false);

    const initialAdminStatsData={
        noOfUsers: 0,
        noOfDevices: 0,
        noOfNewDevices: 0,
        noOfEnrolledDevices: 0,
        noOfActiveDevices: 0,
        locations: []
    }
    const [adminStats, setAdminStats] = useState<adminStats>(initialAdminStatsData);
    const [dates, setDates] = useState();
    const [noOfDevices, setNoOfDevices] = useState<number[]>([]);
    const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(10, 'days'));
    const [endDate, setEndDate] = useState<Dayjs>(dayjs());
    const [maxYAxisValue, setMaxYAxisValue] = useState<number>(0);
    const today = dayjs();
    const initialStartDateTimeStamp =startDate.startOf('day').valueOf()/1000;
    const initialEndDateTimeStamp =Math.floor(endDate.endOf('day').valueOf()/1000)


    const fetchAnalyticsData = useCallback(async () => {
        setIsStatLoaded(true);
        if (idToken) {
            try {
                const response = await fetchAnalytics(idToken);
                setAdminStats(response.data)
                setIsStatLoaded(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                message.error('Failed to fetch data');
            }
        } else {
            console.error("idToken is null or undefined");
        }
    }, [idToken]);

    const fetchActivityData = useCallback(async (startTimeStamp: number, endTimeStamp: number) => {
        setIsActivityLoaded(true);
        if (idToken) {
            try {
                const response = await fetchActivity(idToken, startTimeStamp, endTimeStamp);
                const extractedDates = response.data.map((item: DeviceActivity) => item.date);
                setDates(extractedDates);
                const extractedNoOfDevices = response.data.map((item: DeviceActivity) => item.noOfDevices);
                setNoOfDevices(extractedNoOfDevices);
                const maxNoOfDevices = Math.max(...extractedNoOfDevices.map(Number));
                const maxYAxisValue = maxNoOfDevices + 1;
                setMaxYAxisValue(maxYAxisValue);
                setIsActivityLoaded(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                message.error('Failed to fetch data');
            }
        } else {
            console.error("idToken is null or undefined");
        }
    }, [idToken]);

    useEffect(() => {
        fetchAnalyticsData();
        fetchActivityData(initialStartDateTimeStamp, initialEndDateTimeStamp);
    }, [idToken, initialStartDateTimeStamp, initialEndDateTimeStamp, fetchAnalyticsData, fetchActivityData]);

    const activityOptions: ApexOptions = {
        chart: {
            height: 350,
            type: "line",
            zoom: {
                enabled: true,
            },
        },
        xaxis: {
            categories: dates
        },
        yaxis: {
            max: maxYAxisValue,
        },
    };

    const activitySeries = [{
        name: 'Active Device(s)',
        data: noOfDevices
    },
    ];

    const disabledEndDate = (current: Dayjs) => {
        return current && current > today.endOf('day');
    };

    const onRangeChange = (dates: [Dayjs | null, Dayjs | null], dateStrings: [string, string]) => {
        if (dates && dates[0] && dates[1]) {
            const newStartDate = dates[0] as Dayjs;
            const newEndDate = dates[1] as Dayjs;
            const startTimestamp = newStartDate.startOf('day').valueOf()/1000;
            const endTimestamp = (Math.floor(newEndDate.endOf('day').valueOf()/1000));
            // const endTimestamp = newEndDate.endOf('day').valueOf();
            setStartDate(newStartDate);
            setEndDate(newEndDate);

            fetchActivityData(startTimestamp,endTimestamp);
        } else {
            console.log('Clear');
            // Handle the case when the user clears the date range
        }
    };

    return (

        <>
            <LoadingSpinner loading={isStatLoaded || isActivityLoaded}/>
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
            </Row>

            <Card style={{background: "#f5f5f5", marginTop: "10px"}}>
                <Row gutter={16} align="middle">
                    <Col span={12}>
                        <h3>Device Activity</h3>
                    </Col>
                    <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <DatePicker.RangePicker
                            value={[startDate, endDate]}
                            onChange={(dates) => {
                                if (dates) {
                                    setStartDate(dates[0] as Dayjs);
                                    setEndDate(dates[1] as Dayjs);
                                }
                                onRangeChange(dates as [Dayjs | null, Dayjs | null], [startDate.format('YYYY/MM/DD'), endDate.format('YYYY/MM/DD')]);
                            }}
                            disabledDate={disabledEndDate}
                        />
                    </Col>
                </Row>
                <ReactApexChart
                    options={activityOptions}
                    series={activitySeries}
                    type="line"
                    height={350}
                />
            </Card>

            {adminStats.locations.length !== 0 ? (
                <MapComponent center={center} markers={adminStats.locations.map(item => ({
                    longitude: item.longitude,
                    latitude: item.latitude,
                    username: "Anonymous"
                }))} classname="admin-map-container"/>
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
