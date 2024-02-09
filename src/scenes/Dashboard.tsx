import React, {useState, useEffect} from "react";
import AppLayout from "../layout/AppLayout";
import UserDashboard from "../components/dashboards/UserDashboard";
import AdminDashboard from "../components/dashboards/AdminDashboard";
import {decodeIdToken} from "../services/decodeService";
import LoadingSpinner from "../components/utils/LoadingSpinner";

const Dashboard: React.FC = () => {

    const [userData, setUser] = useState({
        email: '',
        name: '',
        picture: '',
        isAdmin: false // Default to non-admin
    });
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userData = decodeIdToken();
        if (userData) {
            setUser(userData);
            setLoading(false);
        }
    }, []);

    return (
        <AppLayout>
            {loading ? (
                <LoadingSpinner loading={loading}/>
            ) : (
                userData.isAdmin ? (
                    <AdminDashboard/>
                ) : (
                    <UserDashboard/>
                )
            )}
        </AppLayout>
    );
};

export default Dashboard;
