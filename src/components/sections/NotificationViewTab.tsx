import React, {useEffect, useState} from 'react';
import {Table, Input, Space, Button, message, Empty} from 'antd';
import LoadingSpinner from "../utils/LoadingSpinner";
import {SearchOutlined} from "@ant-design/icons";
import {fetchMyEmergencyData} from "../../util/user-api-services";
import noData from "../../assets/no-data.png";

interface NotificationViewProps {
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

const NotificationViewTab: React.FC<NotificationViewProps> = ({device}) => {

    const [loading, setLoading] = useState(true);
    const idToken = localStorage.getItem("idToken");
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            if (idToken) {
                try {
                    const alertResponse = await fetchMyEmergencyData(idToken, device.deviceId);
                    setData(alertResponse.data);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching device data:", error);
                    setLoading(false);
                    message.error('Failed to fetch devices');
                }
            }

        }
        fetchAlerts();
        // eslint-disable-next-line
    }, [idToken]);


    const handleSearch = (selectedKeys: React.Key[], confirm: () => void, dataIndex: string) => {
        confirm();
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
    };

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}: any) => (
            <div style={{padding: 8}}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    });
    const columns = [
        {
            title: 'Time',
            dataIndex: 'timestamp',
            key: 'timestamp',
            ...getColumnSearchProps('timestamp'),
            render: (timestamp: number) => {
                // Convert timestamp to local date and time
                const localDateTime = new Date(timestamp * 1000).toLocaleString();
                return <span>{localDateTime}</span>;
            }
        },
        {
            title: 'Notification',
            dataIndex: 'alertMessage',
            key: 'alertMessage',
            ...getColumnSearchProps('alertMessage')
        }
    ];

    const paginationConfig = {
        pageSize: 5
    };


    return (
        <>
            <LoadingSpinner loading={loading}/>
            <h1>Notifications</h1>
            {data.length !== 0 ? (
                    <>
                        <div>Total Notifications: {data.length}</div>
                        <Table dataSource={data} columns={columns} pagination={paginationConfig}/>
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
                )}

        </>
    );
};

export default NotificationViewTab;
