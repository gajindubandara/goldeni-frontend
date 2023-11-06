import React, { useState } from "react";
import { Row, Col, Card, Button } from "antd";
import AppLayout from "../layout/AppLayout";
import PopupForm from "../components/PopupForm";
import DeviceInfoSection from "../components/DeviceInfoSection";

const Dashboard: React.FC = () => {
  const boxData = [
    // Add your data for clickable boxes here
    { title: "Device 1", id: "00:1A:2B:3C:4D:5E", status: "connected" },
    { title: "Device 2", id: "08:00:27:AA:BB:CC", status: "disconected" },
    { title: "Device 3", id: "3A:4F:7E:1D:2C:0B", status: "connected" },
    { title: "Device 4", id: "B0:E2:35:6F:81:9A", status: "connected" },
    { title: "Device 5", id: "D8:47:3E:FA:52:C6", status: "disconected" },
    { title: "Device 6", id: "09:89:27:AA:G2:CC", status: "connected" },
  ];

  const jwt = localStorage.getItem("idToken");
  console.log(jwt);

  const [isPopupVisible, setPopupVisible] = useState(false);

  const showPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  return (
    <AppLayout>
      <h1>Dashboard</h1>
      <hr />
      <DeviceCards />
      <PopupForm visible={isPopupVisible} onClose={closePopup} />
    </AppLayout>
  );

  function DeviceCards() {
    const [showDeviceCard, setShowDeviceCard] = useState(true);
    const [showDeviceInfoCard, setShowDeviceInfoCard] = useState(false);

    const toggleCards = () => {
      setShowDeviceCard(!showDeviceCard);
      setShowDeviceInfoCard(!showDeviceInfoCard);
    };

    return (
      <div>
        {showDeviceCard && <DeviceListCard toggleCards={toggleCards} />}
        {showDeviceInfoCard && <DeviceInfoCard toggleCards={toggleCards} />}
      </div>
    );
  }

  interface CardProps {
    toggleCards: () => void;
  }

  function DeviceListCard({ toggleCards }: CardProps) {
    return (
      <div className="section-break">
        <h2>Devices</h2>
        <div className="device-msg">
          Please select a device from the options below, or if you don't have a
          device to choose from, kindly click the 'Add a Device' button to add a
          new one.
        </div>
        <div className="device-box">
          <Row gutter={[16, 16]} style={{ padding: "20px" }}>
            {boxData.map((box, index) => (
              <Col key={box.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <Card
                  style={{ cursor: "pointer", position: "relative" }}
                  className="device-card"
                  onClick={() => toggleCards()}
                >
                  <div className="device-name">{box.title}</div>
                  <div className="device-id">ID: {box.id}</div>
                  {box.status === "connected" ? (
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="#1db909"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
                    >
                      <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
                      <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                      <path d="M12 20h.01"></path>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="#d00606"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
                    >
                      <path d="m1 1 22 22"></path>
                      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
                      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
                      <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
                      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                      <path d="M12 20h.01"></path>
                    </svg>
                  )}
                </Card>
              </Col>
            ))}
            <Col xs={24} sm={12} md={8} lg={6} xl={6}>
              <Button
                type="dashed"
                className="btn-add-device"
                onClick={showPopup}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"></path>
                  <path d="M12 8v8"></path>
                  <path d="M8 12h8"></path>
                </svg>
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  function DeviceInfoCard({ toggleCards }: CardProps) {
    return (
      <div className="section-break">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <h2>Device Infomation</h2>
          </Col>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Button
              type="primary"
              onClick={() => toggleCards()}
              style={{ display: "block", margin: "10px 0px 10px auto" }}
            >
              Back to Devices
            </Button>
          </Col>
        </Row>
        <DeviceInfoSection />
      </div>
    );
  }
};

export default Dashboard;
