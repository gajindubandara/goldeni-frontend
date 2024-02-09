import React, {useEffect, useState} from "react";
import AppLayout from "../../layout/AppLayout";
import {Table, Avatar, Input, Space, Button} from "antd";
import {avatarPlaceHolder, baseUrl} from '../../services/commonVariables';
import axios from 'axios';
import {SearchOutlined} from "@ant-design/icons";
import LoadingSpinner from "../../components/utils/LoadingSpinner";

const Users: React.FC = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const idToken = localStorage.getItem("idToken");


    useEffect(() => {
        const fetchData = () => {
            axios.get(`${baseUrl}/admin/users`, {
                headers: {
                    Authorization: `Bearer ${idToken}`
                }
            })
                .then(response => {
                    setData(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
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
            <div className="section-break">
                <span>Total Users: {data.length}</span>
                <Table dataSource={data} columns={columns} pagination={paginationConfig}/>
            </div>
        </AppLayout>
    );
};

export default Users;
