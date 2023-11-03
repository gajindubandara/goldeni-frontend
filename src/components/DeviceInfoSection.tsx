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

  // Get data form the API
  useEffect(() => {
    let data = {
      name: "Tony Stark",
      deviceName: "stick 2",
      address: "21/A,Wasanakanda Road Katugastota",
      number: "0766520481",
    };
    setUserData(data);
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
      <Card style={{ background: "#f5f5f5" }}>
        {/* <h3>User details</h3> */}
        <Card style={{ padding: "0px 24px !important" }}>
          <Row gutter={16}>
            <Col xs={24} sm={4} md={4} lg={4} xl={4}>
              <div className="user-detail-item">
                <b>Device Name: </b>
                <br />
                {userData ? userData.name : "Loading..."}
              </div>
            </Col>
            <Col xs={24} sm={4} md={4} lg={4} xl={4}>
              <div className="user-detail-item">
                <b>User's Name: </b>
                <br />
                {userData ? userData.deviceName : "Loading..."}
              </div>
            </Col>
            <Col xs={24} sm={4} md={4} lg={4} xl={4}>
              <div className="user-detail-item">
                <b>Guardian's No: </b>
                <br />
                {userData ? userData.number : "Loading..."}
              </div>
            </Col>
            <Col xs={24} sm={10} md={10} lg={10} xl={10}>
              <div className="user-detail-item">
                <b>User's Address: </b>
                <br />
                {userData ? userData.address : "Loading..."}
              </div>
            </Col>
            <Col xs={24} sm={2} md={2} lg={2} xl={2}>
              <Button htmlType="submit" onClick={showPopup}>
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </Button>
            </Col>
          </Row>
        </Card>

        <div className="section-break">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6} lg={6} xl={6}>
              <div className="sensor-data-card">
                <p className="sensor-text">
                  <span>90</span>
                  <span className="sensor-sub-text">CM</span>
                </p>
                <p className="sensor-item-text">Top sensor</p>
                <div className="sensor">Ultra sonic</div>
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" stroke-width="0" fill="currentColor" stroke="currentColor" className="moon"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path></svg> */}
              </div>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6} xl={6}>
              <div className="sensor-data-card">
                <p className="sensor-text">
                  <span>75</span>
                  <span className="sensor-sub-text">CM</span>
                </p>
                <p className="sensor-item-text">MIddle sensor</p>
                <div className="sensor">Ultra sonic</div>
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" stroke-width="0" fill="currentColor" stroke="currentColor" className="moon"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path></svg> */}
              </div>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6} xl={6}>
              <div className="sensor-data-card">
                <p className="sensor-text">
                  <span>60</span>
                  <span className="sensor-sub-text">CM</span>
                </p>
                <p className="sensor-item-text">Bottom sensor</p>
                <div className="sensor">Ultra sonic</div>
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" stroke-width="0" fill="currentColor" stroke="currentColor" className="moon"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path></svg> */}
              </div>
            </Col>
            <Col xs={24} sm={12} md={6} lg={6} xl={6}>
              <div className="sensor-data-card">
                <p className="sensor-text">
                  <span>ON</span>
                  {/* <span className="sensor-sub-text">CM</span> */}
                </p>
                <p className="sensor-item-text">Sensor 1</p>
                <div className="sensor">IR</div>
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" stroke-width="0" fill="currentColor" stroke="currentColor" className="moon"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path><path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path></svg> */}
              </div>
            </Col>
          </Row>
        </div>
      </Card>
      <PopupEditForm
        visible={isPopupVisible}
        onClose={closePopup}
        data={userData}
      />
    </div>
  );
};

export default DeviceInfoSection;
