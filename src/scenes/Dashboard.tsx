import React, {useState, useEffect} from "react";
import AppLayout from "../layout/AppLayout";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import {decodeIdToken} from "../services/decodeService";

const Dashboard: React.FC = () => {

    const [userData, setUser] = useState({
        email: '',
        name: '',
        picture: '',
        isAdmin: false // Default to non-admin
    });

    useEffect(() => {
        const userData = decodeIdToken();
        if (userData) {
            setUser(userData);
        }
    }, []);

    return (
        <AppLayout>
            {userData.isAdmin ? (
                <AdminDashboard/>
            ) : (
                <UserDashboard/>
            )}
        </AppLayout>
    );
};

export default Dashboard;
