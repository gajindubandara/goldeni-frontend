import React from 'react';
import {Card} from 'antd';
import ReactApexChart from "react-apexcharts";
import {ApexOptions} from "apexcharts";

interface ChartViewTabProps {
    timeStamps: string[];
    headSensorValues: number[];
    midSensorValues: number[];
    xAngleValues: number[];
    yAngleValues: number[];
    zAngleValues: number[];
    temperature: number[];
}

const ChartViewTab: React.FC<ChartViewTabProps> = ({
                                                       timeStamps,
                                                       headSensorValues,
                                                       midSensorValues,
                                                       xAngleValues,
                                                       yAngleValues,
                                                       zAngleValues,
                                                       temperature,
                                                   }) => {
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

    return (
        <>
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
    );
};

export default ChartViewTab;
