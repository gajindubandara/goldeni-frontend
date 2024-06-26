import React, {useEffect, useState} from "react";
import AppLayout from "../../layout/AppLayout";
import {Table, Avatar, Input, Space, Button, message} from "antd";
import {avatarPlaceHolder} from '../../services/commonVariables';
import {SearchOutlined} from "@ant-design/icons";
import LoadingSpinner from "../../components/utils/LoadingSpinner";
import {fetchUsers} from "../../util/admin-api-services";

const Users: React.FC = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const idToken = localStorage.getItem("idToken");


    useEffect(() => {
        const fetchData = async () => {
            if (idToken) {
                try {
                    const response = await fetchUsers(idToken);
                    setData(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                    message.error('Failed to fetch users');
                }
            } else {
                console.error("idToken is null or undefined");
            }
        };

        fetchData();
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
            title: 'Avatar',
            dataIndex: 'picture',
            key: 'picture',
            render: (picture: string) => (
                picture !== 'none' ? <Avatar src={picture}/> : <Avatar src={avatarPlaceHolder}/>
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email')
        }
    ];

    const paginationConfig = {
        pageSize: 5
    };

    return (
        <AppLayout>
            <LoadingSpinner loading={loading}/>
            <h1>Users</h1>
                <div>Total Users: {data.length}</div>
                <Table dataSource={data} columns={columns} pagination={paginationConfig}/>
        </AppLayout>
    );
};

export default Users;
