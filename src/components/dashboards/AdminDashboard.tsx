import React from "react";
import MapComponent from "../maps/MapComponent";

const AdminDashboard: React.FC = () => {
    const center = { lat: 7.8774222 , long: 80.7003428 ,zoom:7}; // Example center
    const markers = [
        { id: 'marker1', lat: 7.291418, long: 80.636696, username: 'User1' },
        { id: 'marker2', lat: 7.4666648 , long: 80.6166642, username: 'User2' },
        // Add more marker objects as needed
    ];
    return (
            <div>
                <MapComponent center={center} markers={markers} classname="admin-map-container" />
            </div>
    );
};

export default AdminDashboard;
