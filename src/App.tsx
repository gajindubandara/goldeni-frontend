import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./scense/Login";
import Dashboard from "./scense/Dashboard";
import Profile from "./scense/Profile";

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
          element={isLoggedIn && !isSessionExpired ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn && !isSessionExpired ? <Profile /> : <Navigate to="/login" />}
        />
        {/* <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
        <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/" element={<AppLayout><h2>Welcome</h2></AppLayout>} /> */}
      </Routes>
    </Router>
  );
};

export default App;


// import React, { useEffect } from "react";
// import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
// import Login from "./components/Login";
// import Dashboard from "./components/Dashboard";

// const App:React.FC = () => {
  // const isLoggedIn = localStorage.getItem("loggedIn");
  // const sessionExpiration = localStorage.getItem("sessionExpiration");

  // const isSessionExpired = sessionExpiration ? new Date().getTime() > parseInt(sessionExpiration) : true;

  
//   return (
//     <BrowserRouter>
//       <Routes>
      // <Route
      //     path="/login"
      //     element={<Login />}
      //   />
      //   <Route
      //     path="/"
      //     element={isLoggedIn && !isSessionExpired ? <Navigate to="/dashboard" /> : <Login />}
      //   />
      //   <Route
      //     path="/dashboard"
      //     element={isLoggedIn && !isSessionExpired ? <Dashboard /> : <Navigate to="/login" />}
      //   />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;
