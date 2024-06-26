import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import Login from "./scenes/Login";
import { handleAuthentication } from "./services/authService";
import { routes } from "./services/routeService";
import { decodeIdToken } from "./services/decodeService";
import LoadingSpinner from "./components/utils/LoadingSpinner";

const App: React.FC = () => {
    const isLoggedIn = localStorage.getItem("loggedIn");
    const sessionExpiration = localStorage.getItem("sessionExpiration");
    const isSessionExpired = sessionExpiration ? new Date().getTime() > parseInt(sessionExpiration) : true;
    const [routesLoaded, setRoutesLoaded] = useState(false);

    useEffect(() => {
        const userData = decodeIdToken();
        if (userData) {
            const { isAdmin } = userData;
            if (isAdmin) {
                // Set a flag in localStorage to indicate admin status if needed
                localStorage.setItem("isAdmin", "true");
            }
        }
        handleAuthentication();

        // Simulate loading routes (replace with actual code to load routes)
        setTimeout(() => {
            setRoutesLoaded(true);
        }, 1000); // Change 2000 to the actual loading time
    }, []);


    if (!routesLoaded) {
        // Routes are not loaded yet, show loading indicator or splash screen
        return <LoadingSpinner loading={true}/>
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={isLoggedIn && !isSessionExpired ? <Navigate to="/dashboard" /> : <Login />}
                />
                {routes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            isLoggedIn && !isSessionExpired ? (
                                route.adminOnly && !localStorage.getItem("isAdmin") ? (
                                    <AccessDenied />
                                ) : (
                                    <route.component />
                                )
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                ))}
                <Route path="*" element={<InvalidUrl />} />
            </Routes>
        </Router>
    );
};

const AccessDenied: React.FC = () => (
    <div style={{ marginLeft: "20px" }}>
        <h1>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
        <Link to="/">Go back to Home</Link>
    </div>
);

const InvalidUrl: React.FC = () => (
    <div style={{ marginLeft: "20px" }}>
        <h1>Invalid URL</h1>
        <p>The requested URL does not exist.</p>
        <Link to="/">Go back to Home</Link>
    </div>
);

export default App;
