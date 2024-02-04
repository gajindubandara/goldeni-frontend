import React, { useState } from "react";
import AppLayout from "../layout/AppLayout";
import PopupEnrollForm from "../components/PopupEnrollForm";
import DeviceListCard from "../components/DeviceListCard";
import DeviceInfoCard from "../components/DeviceInfoCard";

const Dashboard: React.FC = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [showDeviceCard, setShowDeviceCard] = useState(true);
  const [showDeviceInfoCard, setShowDeviceInfoCard] = useState(false);
  let showEmailInput= false;

  const showPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const toggleCards = () => {
    setShowDeviceCard(!showDeviceCard);
    setShowDeviceInfoCard(!showDeviceInfoCard);
  };

  return (
      <AppLayout>
        <h1>Dashboard</h1>
        <hr />
        {showDeviceCard && (
            <DeviceListCard
                toggleCards={toggleCards}
                showPopup={showPopup}
            />
        )}
        {showDeviceInfoCard && <DeviceInfoCard toggleCards={toggleCards} />}
        <PopupEnrollForm visible={isPopupVisible} showEmailInput={showEmailInput}onClose={closePopup} />
      </AppLayout>
  );
};

export default Dashboard;
