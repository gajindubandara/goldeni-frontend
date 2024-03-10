import React, { useEffect } from "react";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./scenes/Login";
import {handleAuthentication} from "./services/authService";
import { routes } from "./services/routeService";

const App: React.FC = () => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const sessionExpiration = localStorage.getItem("sessionExpiration");
  const isSessionExpired = sessionExpiration ? new Date().getTime() > parseInt(sessionExpiration) : true;

  useEffect(() => {
    const { hostname } = window.location;
    console.log(hostname);
    if (hostname === 'ap-southeast-1.amazonaws.com') {
      window.location.href = 'https://goldeni.s3.ap-southeast-1.amazonaws.com/index.html';
    }
    handleAuthentication();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
            path="/login"
            element={<Login />}
        />
        <Route
            path="/"
            element={isLoggedIn && !isSessionExpired ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/"
          element={isLoggedIn && !isSessionExpired ? <Navigate to="/dashboard" /> : <Login />}
        />
        {routes.map((route) => (
            <Route
                key={route.path}
                path={route.path}
                element={isLoggedIn && !isSessionExpired ? <route.component /> : <Navigate to="/" />}
            />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
