import React from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./scenes/Login";
import Dashboard from "./scenes/Dashboard";

const App: React.FC = () => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const sessionExpiration = localStorage.getItem("sessionExpiration");
  const isSessionExpired = sessionExpiration
    ? new Date().getTime() > parseInt(sessionExpiration)
    : true;

  // Get the query parameters from the URL
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const accessToken = urlSearchParams.get("access_token");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            isLoggedIn && !isSessionExpired ? (
              // If access_token exists, redirect to /dashboard
              accessToken ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn && !isSessionExpired ? (
              <Dashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        
      </Routes>
    </Router>
  );
};

export default App;

// import React from "react";
// import { HashRouter as Router, Route, Routes, Navigate, } from "react-router-dom";
// import Login from "./scense/Login";
// import Dashboard from "./scense/Dashboard";

// const App: React.FC = () => {
//   const isLoggedIn = localStorage.getItem("loggedIn");
//   const sessionExpiration = localStorage.getItem("sessionExpiration");
//   const isSessionExpired = sessionExpiration ? new Date().getTime() > parseInt(sessionExpiration) : true;
//   return (
//     <Router>
//       <Routes>
//       <Route
//           path="/login"
//           element={<Login />}
//         />
//         <Route
//           path="/"
//           element={isLoggedIn && !isSessionExpired ? <Navigate to="/dashboard" /> : <Login />}
//         />
//         <Route
//           path="/dashboard"
//           element={isLoggedIn && !isSessionExpired ? <Dashboard /> : <Navigate to="/" />}
//         />
//         {/* <Route
//           path="/profile"
//           element={isLoggedIn && !isSessionExpired ? <Profile /> : <Navigate to="/" />}
//         /> */}
//       </Routes>
//     </Router>
//   );
// };

// export default App;
