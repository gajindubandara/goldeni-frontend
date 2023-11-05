import React from "react";
import { HashRouter as Router, Route, Routes, Navigate, } from "react-router-dom";
import Login from "./scenes/Login";
import Dashboard from "./scenes/Dashboard";

const App: React.FC = () => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const sessionExpiration = localStorage.getItem("sessionExpiration");
  const isSessionExpired = sessionExpiration ? new Date().getTime() > parseInt(sessionExpiration) : true;
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
          path="/dashboard"
          element={isLoggedIn && !isSessionExpired ? <Dashboard /> : <Navigate to="/" />}
        />
        {/* <Route
          path="/profile"
          element={isLoggedIn && !isSessionExpired ? <Profile /> : <Navigate to="/" />}
        /> */}
      </Routes>
    </Router>
  );
};

export default App;
