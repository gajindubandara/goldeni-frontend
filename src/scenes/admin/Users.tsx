import React, { useEffect, useState } from "react";
import AppLayout from "../../layout/AppLayout";
import { Table, Avatar } from "antd";
import {avatarPlaceHolder, baseUrl} from '../../services/commonVariables';
import axios from 'axios';

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

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'picture',
            key: 'picture',
            render: (picture: string) => (
                picture !== 'none' ? <Avatar src={picture} /> : <Avatar src={avatarPlaceHolder} />
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        }
    ];

    const paginationConfig = {
        pageSize: 5
    };

    return (
        <AppLayout>
            <div className="section-break">
                <h1>Users</h1>
                <Table dataSource={data} columns={columns} pagination={paginationConfig} loading={loading} />
            </div>
        </AppLayout>
    );
};

export default Users;
