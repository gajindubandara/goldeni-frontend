import React, {useState} from "react";
import PopupEnrollForm from "../popups/PopupEnrollForm";
import DeviceListCard from "../cards/DeviceListCard";
import DeviceInfoCard from "../cards/DeviceInfoCard";

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
    let isAdmin = false;
    const data: any = {
        deviceId: "",
        deviceSecret: ""
    };

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
            {showDeviceCard && (
                <DeviceListCard
                    toggleCards={toggleCards}
                    showPopup={showPopup}
                    onSelectDevice={handleDeviceSelection}
                />
            )}
            {showDeviceInfoCard && selectedDevice &&
                <DeviceInfoCard toggleCards={toggleCards} device={selectedDevice}/>}
            <PopupEnrollForm visible={isPopupVisible} isAdmin={isAdmin} onClose={closePopup}
                             onSuccess={handleFetchData} data={data}/>
        </div>
    );
};

export default UserDashboard;
