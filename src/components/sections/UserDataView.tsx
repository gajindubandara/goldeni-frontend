import React from 'react';
import { Card, Row, Col, Space, Button, Dropdown, Menu, Popconfirm } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

interface UserData {
    name: string;
    number: string;
    altNumber: string;
    address: string;
}

interface Device {
    deviceId: string;
    registeredUsername: string;
}

interface Props {
    dataToDisplay: UserData | null;
    showPopup: () => void;
    handleDisenroll: (deviceId: string) => void;
    device: Device;
}

const UserDataView: React.FC<Props> = ({ dataToDisplay, showPopup, handleDisenroll, device }) => {
    return (
        <Card style={{ padding: "0px 24px !important" }}>
            <Row gutter={16}>
                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <div className="user-detail-item">
                        <b>User's Name: </b>
                        <br />
                        {dataToDisplay ? dataToDisplay.name : "Loading..."}
                    </div>
                </Col>
                <Col xs={24} sm={6} md={6} lg={6} xl={6}>
                    <div className="user-detail-item">
                        <b>Guardian's No: </b>
                        <br />
                        {dataToDisplay ? dataToDisplay.number + ", " + dataToDisplay.altNumber : "Loading..."}
                    </div>
                </Col>
                <Col xs={24} sm={10} md={10} lg={10} xl={10}>
                    <div className="user-detail-item">
                        <b>User's Address: </b>
                        <br />
                        {dataToDisplay ? dataToDisplay.address : "Loading..."}
                    </div>
                </Col>
                <Col xs={24} sm={2} md={2} lg={2} xl={2}>
                    <Space size="middle" style={{ float: 'right', margin: '10px auto' }}>
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item key="update">
                                        <Button type="link" onClick={showPopup}>Update Info</Button>
                                    </Menu.Item>
                                    <Menu.Item key="disenroll">
                                        <Popconfirm
                                            title="Are you sure to disenroll this device?"
                                            onConfirm={() => handleDisenroll(device.deviceId)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button type="link" danger>Dis-enroll Device</Button>
                                        </Popconfirm>
                                    </Menu.Item>
                                </Menu>
                            }
                            placement="bottomLeft"
                            trigger={['click']}
                        >
                            <Button type="text" icon={<EllipsisOutlined style={{ fontSize: '24px' }} />} />
                        </Dropdown>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
}

export default UserDataView;
