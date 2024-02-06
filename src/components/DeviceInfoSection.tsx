import React, {useState } from "react";
import { Card, Button, Col, Row} from "antd";
import PopupEditForm from "./PopupEditForm";
import ultrasonic from '../assets/ultrasonic-sensor.png';
import temp from '../assets/temprature.png';
import ir from '../assets/infrared-sensor.png';

const { Meta } = Card;

interface DeviceInfoSectionProps {
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

const DeviceInfoSection: React.FC<DeviceInfoSectionProps> = ({device}) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const showPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <div>
      <Card style={{ background: "#f5f5f5" }}>
        <Card style={{ padding: "0px 24px !important" }}>
          <Row gutter={16}>
            <Col xs={24} sm={6} md={6} lg={6} xl={6}>
              <div className="user-detail-item">
                <b>User's Name: </b>
                <br />
                {device ? device.registeredUsername : "Loading..."}
              </div>
            </Col>
            <Col xs={24} sm={6} md={6} lg={6} xl={6}>
              <div className="user-detail-item">
                <b>Guardian's No: </b>
                <br />
                {device ? device.emergencyContactNumbers.join(', ') : "Loading..."}
              </div>
            </Col>
            <Col xs={24} sm={10} md={10} lg={10} xl={10}>
              <div className="user-detail-item">
                <b>User's Address: </b>
                <br />
                {device ? device.registeredAddress : "Loading..."}
              </div>
            </Col>
            <Col xs={24} sm={2} md={2} lg={2} xl={2}>
              <Button htmlType="submit" onClick={showPopup}>
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </Button>
            </Col>
          </Row>
        </Card>

        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card style={{ marginTop: 16, border: "1px solid #cfcfcf" }}>
              <Meta
                  avatar={
                    <div>
                      <svg
                          width="60"
                          height="60"
                          fill="none"
                          stroke="#1db909"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                        <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                        <path d="M12 20h.01"></path>
                      </svg>
                    </div>
                  }
                  title={<div style={{fontSize: "20px"}}>Connected</div>}
                  description={
                    <div style={{fontWeight: "bolder", color: "black"}}>
                      System Connection
                    </div>
                  }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card style={{marginTop: 16, border: "1px solid #cfcfcf"}}>
              <Meta
                  avatar={
                    <div>
                      <img src={temp} alt="Icon" style={{width: "60px"}}/>
                    </div>
                  }
                  title={<div style={{fontSize: "20px"}}>36.00°</div>}
                  description={
                    <div style={{fontWeight: "bolder", color: "black"}}>
                      System Temperature
                    </div>
                  }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card style={{marginTop: 16, border: "1px solid #cfcfcf"}}>
              <Meta
                  avatar={
                    <div>
                      <img src={ir} alt="Icon" style={{ width: "60px" }} />
                    </div>
                  }
                  title={<div style={{ fontSize: "20px" }}>ON</div>}
                  description={
                    <div style={{ fontWeight: "bolder", color: "black" }}>
                      Infrared Sensor
                    </div>
                  }
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card style={{ marginTop: 16, border: "1px solid #cfcfcf" }}>
              <Meta
                  avatar={
                    <div>
                      <img
                          src={ultrasonic}
                          alt="Icon"
                          style={{ width: "60px" }}
                      />
                    </div>
                  }
                  title={<div style={{ fontSize: "20px" }}>90.00cm</div>}
                  description={
                    <div style={{ fontWeight: "bolder", color: "black" }}>
                      Top Ultrasonic
                    </div>
                  }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card style={{ marginTop: 16, border: "1px solid #cfcfcf" }}>
              <Meta
                  avatar={
                    <div>
                      <img
                          src={ultrasonic}
                          alt="Icon"
                          style={{ width: "60px" }}
                      />
                    </div>
                  }
                  title={<div style={{ fontSize: "20px" }}>90.00cm</div>}
                  description={
                    <div style={{ fontWeight: "bolder", color: "black" }}>
                      Middle Ultrasonic
                    </div>
                  }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card style={{ marginTop: 16, border: "1px solid #cfcfcf" }}>
              <Meta
                  avatar={
                    <div>
                      <img
                          src={ultrasonic}
                          alt="Icon"
                          style={{ width: "60px" }}
                      />
                    </div>
                  }
                  title={<div style={{ fontSize: "20px" }}>90.00cm</div>}
                  description={
                    <div style={{ fontWeight: "bolder", color: "black" }}>
                      Bottom Ultrasonic
                    </div>
                  }
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>

        </Row>
      </Card>
      <PopupEditForm
        visible={isPopupVisible}
        onClose={closePopup}
        data={device}
      />
    </div>
  );
};

export default DeviceInfoSection;
