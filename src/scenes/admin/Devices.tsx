import React, { useEffect, useState } from "react";
import AppLayout from "../../layout/AppLayout";
import { Button, Input, Table, Tag, Space, Popconfirm, Dropdown, Menu } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { baseUrl } from '../../services/commonVariables';
import { EllipsisOutlined } from '@ant-design/icons';
import PopupEnrollForm from "../../components/PopupEnrollForm";

const Devices: React.FC = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const idToken = localStorage.getItem("idToken");
    const [showEnrollPopup, setShowEnrollPopup] = useState(false); // State to manage popup visibility
    let showEmailInput =true;

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
    }, [idToken]);

    interface Device {
        deviceId: string;
        registeredEmail: string;
        emergencyContactNumbers: string[];
        macAddress: string;
        status: string;
        connected: boolean;
    }


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
        {
            title: 'Device ID',
            dataIndex: 'deviceId',
            key: 'deviceId',
            ...getColumnSearchProps('deviceId')
        },
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
                <span>{emergencyContactNumbers.join(', ')}</span>
            ),
        },
        {
            title: 'Mac Address',
            dataIndex: 'macAddress',
            key: 'macAddress'
        },
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
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Device) => {
                if (record.status === 'ENROLLED') {
                    return null; // Return null if status is 'ENROLLED' to hide the action buttons
                }

                return (
                    <Space size="middle">
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item key="delete">
                                        <Popconfirm
                                            title="Are you sure to delete this device?"
                                            onConfirm={() => handleDelete(record.deviceId)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <a>Delete</a>
                                        </Popconfirm>
                                    </Menu.Item>
                                    {record.status === 'NEW' && (
                                        <Menu.Item key="enroll">
                                            <a onClick={() => handleEnroll(record.deviceId)}>Enroll</a>
                                        </Menu.Item>
                                    )}
                                </Menu>
                            }
                            placement="bottomLeft"
                            trigger={['click']}
                        >
                            <Button type="text" icon={<EllipsisOutlined />} />
                        </Dropdown>
                    </Space>
                );
            },
        },
    ];


    const paginationConfig = {
        pageSize: 5, // Display 5 items per page
    };

    const handleDelete = (deviceId: string) => {
        console.log(`Deleting device with ID: ${deviceId}`);
        // Implement your delete logic here
    };

    const handleEnroll = (deviceId: string) => {
        console.log(`Enrolling device with ID: ${deviceId}`);
        // Implement your logic to show the popup here
        setShowEnrollPopup(true);
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
                    rowKey={(record) => record.deviceId}
                />
                {/* Render the PopupEnrollForm component based on showEnrollPopup state */}
                {showEnrollPopup && (
                    <PopupEnrollForm
                        visible={showEnrollPopup}
                        showEmailInput={showEmailInput}
                        onClose={() => setShowEnrollPopup(false)}
                    />
                )}
            </div>
        </AppLayout>
    );
};

export default Devices;
