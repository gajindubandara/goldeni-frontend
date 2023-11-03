import React, { useEffect, useState } from "react";
import { Card, Button, Col, Row } from "antd";
import PopupEditForm from "./PopupEditForm";

interface userData {
  name: string;
  deviceName: string;
  address: string;
  number: string;
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
    let data={"name":"Tony Stark","deviceName":"stick 2","address":"River street","number":"0766520481",}
    setUserData(data)
    // axios.get(`https://www.boredapi.com/api/activity`)
    //   .then((response) => {
    //     setUserData(response.data);
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });
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
              {userData ? userData.name : "Loading..."}
            </div>
            <div className="user-detail-item">
              <b>User's Name: </b><br/>
              {userData ? userData.deviceName : "Loading..."}
            </div>
            <div className="user-detail-item">
              <b>User's Address: </b><br/>
              {userData ? userData.address : "Loading..."}
            </div>
            <div className="user-detail-item">
              <b>Guardian's Number: </b><br/>
              {userData ? userData.number : "Loading..."}
            </div>
            <Button type="primary" onClick={showPopup}>Edit</Button>
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
