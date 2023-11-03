import React, { useEffect, useState } from "react";
import { Card, Button, Col, Row } from "antd";
import axios from "axios";
import PopupEditForm from "./PopupEditForm";

interface userData {
  type: string;
  participants: string;
  key: number;
  price: number;
}

const DeviceInfoSection: React.FC = () => {
  const [userData, setUserData] = useState<userData | null>(null);

  const [isPopupVisible, setPopupVisible] = useState(false);

  const showPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };
  // https://www.boredapi.com/api/activity
  // Get data form the API
  useEffect(() => {
    axios.get(`https://www.boredapi.com/api/activity`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div>
    <Card>
      {/* <h3>User details</h3> */}
      <Row gutter={16}>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Card title="User details" bordered={false}>
            <div className="user-detail-item">
              <b>Device Name: </b><br/>
              {userData ? userData.type : "Loading..."}
            </div>
            <div className="user-detail-item">
              <b>User's Name: </b><br/>
              {userData ? userData.participants : "Loading..."}
            </div>
            <div className="user-detail-item">
              <b>User's Address: </b><br/>
              {userData ? userData.key : "Loading..."}
            </div>
            <div className="user-detail-item">
              <b>Guardian's Number: </b><br/>
              {userData ? userData.price : "Loading..."}
            </div>
            <Button onClick={showPopup}>Edit</Button>
          </Card>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Card title="Card title" bordered={false}>
                Card content
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Card
                style={{ margin: "13px 0px 0px 0px" }}
                title="Card title"
                bordered={false}
              >
                Card content
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={8} md={8} lg={8} xl={8}>
          <Card title="Card title" bordered={false}>
            Card content
          </Card>
        </Col>
      </Row>

    </Card>
    <PopupEditForm visible={isPopupVisible} onClose={closePopup} data={userData} />
    </div>
  );
};

export default DeviceInfoSection;
