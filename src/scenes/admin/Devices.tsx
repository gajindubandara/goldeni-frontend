import React, { useEffect, useState } from "react";
import AppLayout from "../../layout/AppLayout";
import { Button, Input, Table, Tag, Space } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { baseUrl } from '../../services/commonVariables';

const Devices: React.FC = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const idToken = localStorage.getItem("idToken");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/admin/devices`, {
                    headers: {
                        Authorization: `Bearer ${idToken}`                    }
                });
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = (selectedKeys: React.Key[], confirm: () => void, dataIndex: string) => {
        confirm();
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
    };

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    });

    const columns = [
        { title: 'Device ID', dataIndex: 'deviceId', key: 'deviceId', ...getColumnSearchProps('deviceId') },
        {
            title: 'Registered Email',
            dataIndex: 'registeredEmail',
            key: 'registeredEmail',
            ...getColumnSearchProps('registeredEmail'),
            render: (registeredEmail: string) => (registeredEmail ? registeredEmail : '-'),
        },
        {
            title: 'Emergency Contact Numbers',
            dataIndex: 'emergencyContactNumbers',
            key: 'emergencyContactNumbers',
            render: (emergencyContactNumbers: string[]) => (
                <>
                    {emergencyContactNumbers.map((number, index) => (
                        <div key={index}>{number}</div>
                    ))}
                </>
            ),
        },
        { title: 'Mac Address', dataIndex: 'macAddress', key: 'macAddress' },
        {
            title: 'Enrollment Status',
            key: 'status',
            dataIndex: 'status',
            render: (status: string) => {
                let color = status === 'ENROLLED' ? 'geekblue' : status === 'NEW' ? 'green' : 'volcano';
                return (
                    <Tag color={color} key={status}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Connectivity',
            key: 'connection',
            dataIndex: 'connected',
            render: (connection: boolean) =>  {
                let value = connection ? 'Connected' : 'Disconnected'
                let color = connection ? 'green' : 'red';
                return (
                    <Tag color={color} key={value}>
                        {value.toUpperCase()}
                    </Tag>
                );
            },
        },
    ];

    const paginationConfig = {
        pageSize: 5, // Display 5 items per page
    };

    return (
        <AppLayout>
            <div className="section-break">
                <h1>Devices</h1>
                <Table
                    dataSource={data}
                    columns={columns}
                    pagination={paginationConfig}
                    loading={loading}
                    rowKey={(record) => record.id}
                />
            </div>
        </AppLayout>
    );
};

export default Devices;
