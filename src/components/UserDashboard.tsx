import React, { useState } from "react";
import PopupEnrollForm from "./PopupEnrollForm";
import DeviceListCard from "./DeviceListCard";
import DeviceInfoCard from "./DeviceInfoCard";

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

const UserDashboard: React.FC = () => {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [showDeviceCard, setShowDeviceCard] = useState(true);
    const [showDeviceInfoCard, setShowDeviceInfoCard] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    let showEmailInput = false;

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

    const handleFetchData = () => {
        // Implement your fetch data logic here
    };
    const handleDeviceSelection = (device: Device) => {
        setSelectedDevice(device);
    };

    return (
        <div>
            <h1>User Dashboard</h1>
            <hr />
            {showDeviceCard && (
                <DeviceListCard
                    toggleCards={toggleCards}
                    showPopup={showPopup}
                    onSelectDevice={handleDeviceSelection}
                />
            )}
            {showDeviceInfoCard && selectedDevice && <DeviceInfoCard toggleCards={toggleCards} device={selectedDevice} />}
            <PopupEnrollForm visible={isPopupVisible} showEmailInput={showEmailInput} onClose={closePopup}
                             onSuccess={handleFetchData} />
        </div>
    );
};

export default UserDashboard;
