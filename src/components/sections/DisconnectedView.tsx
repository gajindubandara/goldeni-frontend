import React, {useEffect, useState} from 'react';
import {Card, Col, DatePicker, Empty, message, Row, Statistic} from 'antd';
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";
import Simulation from "../simulation/Simulation";
import dayjs, {Dayjs} from "dayjs";
import {fetchLastKnownDeviceData} from "../../util/user-api-services";
import MapComponent from "../maps/MapComponent";
import map from "../../assets/map.png";
import noData from "../../assets/no-data.png";
import LoadingSpinner from "../utils/LoadingSpinner";

interface DisconnectedViewProps {
    device: Device;
    connection: boolean;
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

interface MarkerInfo {
    latitude: number;
    longitude: number;
    username: string;
}

const DisconnectedView: React.FC<DisconnectedViewProps> = ({device, connection}) => {
    const [midSensorValues, setMidSensorValues] = useState<number[]>([]);
    const [headSensorValues, setHeadSensorValues] = useState<number[]>([]);
    const [xAngleValues, setXAngleValues] = useState<number[]>([]);
    const [yAngleValues, setYAngleValues] = useState<number[]>([]);
    const [zAngleValues, setZAngleValues] = useState<number[]>([]);
    const [temperature, setTemperature] = useState<number[]>([]);
    const [timeStamps, setTimeStamps] = useState<any[]>([]);
    const [socketData, setSocketData] = useState<socket>();
    const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(10, 'days'));
    const [endDate, setEndDate] = useState<Dayjs>(dayjs());
    const today = dayjs();
    const idToken = localStorage.getItem("idToken");
    const [markers, setMakers] = useState<MarkerInfo[]>([]);
    const [center, setCenter] = useState({
        latitude: 7.8731,
        longitude: 80.7718,
        zoom: 7,
    })
    const [loading, setLoading] = useState(false);
    const [hasLastKnownData, setHasLastKnownData] = useState(true);
    const initialStartDateTimeStamp = startDate.startOf('day').valueOf() / 1000;
    const initialEndDateTimeStamp = Math.floor(endDate.endOf('day').valueOf() / 1000)


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
            max: 125,
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
    ];

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
    ];

    const tempSeries = [{
        name: 'Temperature',
        data: temperature
    }
    ];

    // eslint-disable-next-line
    const fetchLastKnownData = async (start: number, end: number) => {
        setLoading(true)
        setMidSensorValues([]);
        setHeadSensorValues([]);
        setXAngleValues([]);
        setYAngleValues([]);
        setZAngleValues([]);
        setTemperature([]);
        setTimeStamps([]);

        if (idToken) {
            try {
                // Await the asynchronous operation
                const response = await fetchLastKnownDeviceData(idToken, device.deviceId, start, end);
                console.log(JSON.stringify(response.data[0])); // Accessing data property after awaiting the promise
                // const lastData = response.data[0];
                const lastData = response.data.reduce((latest:any, current:any) => {
                    const currentTimestamp = parseInt(current.timestamp);
                    if (currentTimestamp > latest.timestamp) {
                        return current;
                    } else {
                        return latest;
                    }
                }, { timestamp: 0 });
                console.log(lastData)

                if (response.data.length === 0) {
                    setHasLastKnownData(false);
                }

                response.data.forEach((item: {
                    ultrasonicMid: number;
                    ultrasonicHead: number;
                    gyroX: number;
                    gyroY: number;
                    gyroZ: number;
                    temp: number;
                    timestamp: any;
                }) => {
                    setMidSensorValues(prevState => [...prevState, item.ultrasonicMid]);
                    setHeadSensorValues(prevState => [...prevState, item.ultrasonicHead]);
                    setXAngleValues(prevState => [...prevState, item.gyroX]);
                    setYAngleValues(prevState => [...prevState, item.gyroY]);
                    setZAngleValues(prevState => [...prevState, item.gyroZ]);
                    setTemperature(prevState => [...prevState, item.temp]);
                    setTimeStamps(prevState => [...prevState, new Date(parseInt(String(item.timestamp)) * 1000).toLocaleString()]);

                });
                setSocketData(lastData);
                setLoading(false)

                if (response.data) {
                    const center = {
                        latitude: response.data[0].latitude,
                        longitude: response.data[0].longitude,
                        zoom: 16
                    }
                    const markers = response.data
                        .filter((item: any) => item.latitude !== 0 && item.longitude !== 0) // Filter out items with latitude and longitude as 0
                        .map((item: any) => ({
                            latitude: item.latitude,
                            longitude: item.longitude,
                            username: device.registeredUsername
                        }));

                    setCenter(center);
                    setMakers(markers);


                }
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


    useEffect(() => {
        fetchLastKnownData(initialStartDateTimeStamp, initialEndDateTimeStamp);
// eslint-disable-next-line
    }, [initialEndDateTimeStamp, initialStartDateTimeStamp]);


    const disabledEndDate = (current: Dayjs) => {
        return current && current > today.endOf('day');
    };

    const onRangeChange = (dates: [Dayjs | null, Dayjs | null], dateStrings: [string, string]) => {
        if (dates && dates[0] && dates[1]) {
            const newStartDate = dates[0] as Dayjs;
            const newEndDate = dates[1] as Dayjs;
            const startTimestamp = newStartDate.startOf('day').valueOf() / 1000;
            const endTimestamp = (Math.floor(newEndDate.endOf('day').valueOf() / 1000));
            // const endTimestamp = newEndDate.endOf('day').valueOf();
            setStartDate(newStartDate);
            setEndDate(newEndDate);

            fetchLastKnownData(startTimestamp, endTimestamp);
        } else {
            console.log('Clear');
            // Handle the case when the user clears the date range
        }
    };

    return (
        <>
            <LoadingSpinner loading={loading}/>
            {hasLastKnownData ? (
                    <>
                        {!connection && (
                            <>
                                Device is currently unavailable. It seems to be disconnected at the
                                moment. The last known location displayed on the map.
                                <Row gutter={16} align="middle" style={{marginTop: "40px"}}>
                                    <Col span={12}>
                                        <h3>Last known data</h3>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col xs={24} sm={6} md={6} lg={6} xl={6} className="stat-col">
                                        <Card className="stats-card">
                                            <Statistic
                                                title="Connection Status"
                                                value="Disconnected"
                                                valueStyle={{color: "#f5222d"}}
                                            />
                                        </Card>
                                        <Card className="stats-card">
                                            <Statistic
                                                title="Top Ultra Sonic"
                                                value={socketData?.ultrasonicHead}
                                                suffix="cm"
                                                precision={2}
                                            />
                                        </Card>
                                        <Card className="stats-card">
                                            <Statistic
                                                title="IR Sensor"
                                                value={socketData?.irFront ? "On" : "Off"}
                                                valueStyle={{color: socketData?.irFront ? '#3f8600' : '#f5222d'}}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={6} md={6} lg={6} xl={6} className="stat-col">
                                        <Card className="stats-card">
                                            <Statistic
                                                title="System Temperature"
                                                value={socketData?.temp}
                                                suffix="°"
                                                precision={2}
                                            />
                                        </Card>
                                        <Card className="stats-card">
                                            <Statistic
                                                title="Mid Ultra Sonic"
                                                value={socketData?.ultrasonicMid}
                                                suffix="cm"
                                                precision={2}
                                            />
                                        </Card>
                                        <Card className="stats-card">
                                            <Statistic
                                                title="IR Sensor 2"
                                                value={socketData?.irBack ? "On" : "Off"}
                                                valueStyle={{color: socketData?.irBack ? '#3f8600' : '#f5222d'}}
                                            />
                                        </Card>
                                    </Col>
                                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                                        <Card className="simulation-card">
                                            {socketData ? (
                                                <Simulation
                                                    xAngle={socketData?.gyroX}
                                                    yAngle={socketData?.gyroY}
                                                    zAngle={socketData?.gyroZ}
                                                />
                                            ):(
                                                <Simulation
                                                    xAngle={0}
                                                    yAngle={0}
                                                    zAngle={0}
                                                />
                                            )}

                                        </Card>
                                    </Col>
                                </Row>
                            </>
                        )}

                        {markers ? (
                                <MapComponent center={center} markers={markers} classname="map-container"/>
                            )
                            :
                            (
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
                            )
                        }

                        <Row gutter={16} align="middle" style={{marginTop: "40px"}}>
                            <Col span={12}>
                                <h3>Device data history</h3>
                            </Col>
                            <Col span={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
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
                    </>


                ) :
                (
                    <>

                        <div className="map-container map-placeholder">
                            <div>
                                <Empty
                                    image={noData}
                                    imageStyle={{
                                        height: 60,
                                    }}
                                    description={<span>No available data...</span>}
                                />
                            </div>
                        </div>
                    </>
                )
            }

        </>
    )
        ;
};

export default DisconnectedView;
