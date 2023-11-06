import React, { useEffect } from "react";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./scenes/Login";
import Dashboard from "./scenes/Dashboard";

const App: React.FC = () => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const sessionExpiration = localStorage.getItem("sessionExpiration");
  const isSessionExpired = sessionExpiration ? new Date().getTime() > parseInt(sessionExpiration) : true;

  useEffect(() => {
    // Get the current URL
    const url = window.location.href;

    // Create a URL object to parse the URL
    const urlObject = new URL(url);
    const hash= urlObject.hash
    let idToken:any;
    if (hash){
      if (new URLSearchParams(hash).get('id_token')){
        idToken = new URLSearchParams(hash).get('id_token');
    
        }else{
        idToken = new URLSearchParams(hash).get('#id_token');
    
        }
        // console.log('id Token:', idToken);
        if (idToken){
        //Create sessions
        localStorage.setItem("idToken", idToken);
        localStorage.setItem("loggedIn", "true");
        const expirationTime = (new Date().getTime() + 3600000).toString(); // 1 hour in milliseconds
        localStorage.setItem("sessionExpiration", expirationTime);
    
        // Remove all parameters after the hash mark
        const newHash = '';
    
        // Update the URL with the new hash
        urlObject.hash = newHash;
        window.history.replaceState(null, '', urlObject.toString());
    
        // Reload the page
        window.location.reload();
        }
    }
    
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
