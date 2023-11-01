import React from "react";
import { HashRouter as Router, Route, Routes, Link, } from "react-router-dom";
import Login from "./scense/Login";
import Dashboard from "./scense/Dashboard";
import Profile from "./scense/Profile";

const App: React.FC = () => {
  // const isLoggedIn = localStorage.getItem("loggedIn");
  // const sessionExpiration = localStorage.getItem("sessionExpiration");
  // const isSessionExpired = sessionExpiration ? new Date().getTime() > parseInt(sessionExpiration) : true;
  return (
    // <Router>
      // <nav>
      //   <ul>
      //     <li>
      //       <Link to="/login">Login</Link>
      //     </li>
      //     <li>
      //       <Link to="/dashboard">Dashboard</Link>
      //     </li>
      //     <li>
      //       <Link to="/profile">Profile</Link>
      //     </li>
      //   </ul>
      // </nav>

    //   <Routes>
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/dashboard" element={<Dashboard />} />
    //     <Route path="/profile" element={<Profile />} />
    //   </Routes>
    // </Router>





    // <div className="App">
    //   <header className="App-header">
    //     {/* <img src={logo} className="App-logo" alt="logo" /> */}
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>







    // <Router>
      //  <nav>
      //   <ul>
      //     <li>
      //       <Link to="/login">Login</Link>
      //     </li>
      //     <li>
      //       <Link to="/dashboard">Dashboard</Link>
      //     </li>
      //     <li>
      //       <Link to="/profile">Profile</Link>
      //     </li>
      //   </ul>
      // </nav>
    //   <Routes>
    //   <Route
    //       path="/login"
    //       element={<Login />}
    //     />
    //     <Route
    //       path="/"
    //       element={isLoggedIn && !isSessionExpired ? <Navigate to="/dashboard" /> : <Login />}
    //     />
    //     <Route
    //       path="/dashboard"
    //       element={isLoggedIn && !isSessionExpired ? <Dashboard /> : <Navigate to="/login" />}
    //     />
    //     <Route
    //       path="/profile"
    //       element={isLoggedIn && !isSessionExpired ? <Profile /> : <Navigate to="/login" />}
    //     />
    //   </Routes>
    // </Router>

    <Router>
     
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
     <nav>
        <ul>
          <li>
            <Link to="/">Login</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
  </Router>
  );
};

export default App;
