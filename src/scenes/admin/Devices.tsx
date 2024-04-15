import React, {useCallback, useEffect, useState} from "react";
import AppLayout from "../../layout/AppLayout";
import {Button, Input, Table, Tag, Space, Popconfirm, Dropdown, Menu, message, Row} from "antd";
import {SearchOutlined} from '@ant-design/icons';
import {EllipsisOutlined} from '@ant-design/icons';
import PopupEnrollForm from "../../components/popups/PopupEnrollForm";
import PopupAddDeviceForm from "../../components/popups/PopupAddDeviceForm";
import LoadingSpinner from "../../components/utils/LoadingSpinner";
import {deleteDevice, fetchDevices} from "../../util/admin-api-services";
import {disenrollDevice} from "../../util/common-api-services";

interface Device {
    deviceId: string;
    deviceSecret: string;
    registeredEmail: string;
    emergencyContactNumbers: string[];
    macAddress: string;
    status: string;
    connected: boolean;
}

const Devices: React.FC = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrollDevice, setEnrollDevice] = useState<any>();
    const idToken = localStorage.getItem("idToken");
    const [showEnrollPopup, setShowEnrollPopup] = useState(false);
    const [showAddDevicePopup, setShowAddDevicePopup] = useState(false);
    let isAdmin = true;

    const fetchData = useCallback(async () => {
        if (idToken) {
            try {
                const deviceResponse = await fetchDevices(idToken);
                setData(deviceResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching device data:", error);
                setLoading(false);
                message.error('Failed to fetch devices');
            }
        }
    }, [idToken]);

    useEffect(() => {
        if (idToken) {
            fetchData();
        } else {
            console.error("idToken is null or undefined");
        }
    }, [idToken,fetchData]);


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
            title: 'Contact Numbers',
            dataIndex: 'emergencyContactNumbers',
            key: 'emergencyContactNumbers',
            render: (emergencyContactNumbers: string[] | undefined) => (
                <span>{emergencyContactNumbers && emergencyContactNumbers.length > 0 ? emergencyContactNumbers.join(', ') : '-'}</span>
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
            render: (connection: boolean) => {
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
                return (
                    <Space size="middle">
                        <Dropdown
                            overlay={
                                <Menu>
                                    {record.status === 'NEW' && (
                                        <Menu.Item key="delete">
                                            <Popconfirm
                                                title="Are you sure to delete this device?"
                                                onConfirm={() => handleDelete(record.deviceId)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button type="link" danger>Delete</Button>
                                            </Popconfirm>
                                        </Menu.Item>
                                    )}
                                    {record.status === 'NEW' && (
                                        <Menu.Item key="enroll">
                                            <Button type="link"
                                                    onClick={() => handleEnroll(record)}>Enroll</Button>
                                        </Menu.Item>
                                    )}
                                    {record.status === 'ENROLLED' && (
                                        <Menu.Item key="disenroll">
                                            <Popconfirm
                                                title="Are you sure to disenroll this device?"
                                                onConfirm={() => handleDisenroll(record.deviceId)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button type="link" danger>Dis-enroll</Button>
                                            </Popconfirm>
                                        </Menu.Item>
                                    )}
                                </Menu>
                            }
                            placement="bottomLeft"
                            trigger={['click']}
                        >
                            <Button type="text" icon={<EllipsisOutlined/>}/>
                        </Dropdown>
                    </Space>
                );
            },
        },
    ];


    const paginationConfig = {
        pageSize: 5, // Display 5 items per page
    };


    const handleDelete = async (deviceId: string) => {
        setLoading(true);
        try {
            const response = await deleteDevice(idToken!, deviceId);

            if (response.status === 200) {
                // Device deleted successfully
                console.log(`Device with ID ${deviceId} deleted successfully.`);
                message.success('Device deleted successfully');
                handleFetchData();
            } else {
                // Failed to delete device
                console.error(`Failed to delete device with ID ${deviceId}.`);
                message.error('Failed to delete device');
            }
        } catch (error) {
            console.error('Error deleting device:', error);
            message.error('Error deleting device');
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = (record: Device) => {
        const enrollDeviceData = {
            deviceId: record.deviceId,
            deviceSecret: record.deviceSecret
        }
        setEnrollDevice(enrollDeviceData)
        setShowEnrollPopup(true);
        // console.log(enrollDevice)
    };

    const handleDisenroll = async (deviceId: string) => {
        setLoading(true);
        try {
            const response = await disenrollDevice(idToken!, deviceId);

            // Handle success response
            message.success('Device dis-enrolled successfully');
            // console.log(response.data); // Log or handle response data
            handleFetchData();
        } catch (error) {
            // Handle error
            console.error('Error updating device:', error);
            // You can display an error message here using antd message or other means
            message.error('Error updating device. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const handleAddDevice = () => {
        setShowAddDevicePopup(true)
    };

    const handleFetchData = () => {
        fetchData();
    };


    return (
        <AppLayout>
            <LoadingSpinner loading={loading}/>
            <Row>
                <h1>Devices</h1>
                <Button
                    type="primary"
                    onClick={() => handleAddDevice()}
                    style={{display: "block", margin: "10px 0px 20px auto"}}
                >
                    Add Device
                </Button>
            </Row>
            <div>Total Devices: {data.length}</div>
            <Table
                dataSource={data}
                columns={columns}
                pagination={paginationConfig}
                rowKey={(record) => record.deviceId}
            />

            {showEnrollPopup && (
                <PopupEnrollForm
                    visible={showEnrollPopup}
                    isAdmin={isAdmin}
                    onClose={() => setShowEnrollPopup(false)}
                    onSuccess={handleFetchData}
                    data={enrollDevice}
                />
            )}
            {showAddDevicePopup && (
                <PopupAddDeviceForm
                    visible={showAddDevicePopup}
                    onClose={() => setShowAddDevicePopup(false)}
                    onSuccess={handleFetchData}
                />
            )}
        </AppLayout>
    );
};

export default Devices;
