// src/components/Login.js

// import React, { useState } from "react";
import { Button } from "antd";
// import { useEffect } from "react";
// import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import axios from "axios";

const Login: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  // const [profile, setProfile] = useState<any | null>(null); // Initialize with null or specify the actual type

  // const logOut = () => {
  //     googleLogout();
  //     setProfile(null);
  // };

  // const navigate = useNavigate()

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          // setProfile(res.data);
          localStorage.setItem("userData", JSON.stringify(res.data));
          localStorage.setItem("loggedIn", "true");
          const expirationTime = (new Date().getTime() + 60000).toString(); // 1 hour in milliseconds
          localStorage.setItem("sessionExpiration", expirationTime);
          // console.log(res);
          window.location.href = "/index.html#/";
          // navigate('/dashboard');
          // window.location.href = window.location.href.split('#')[0] + '#/dashboard';
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const src =
    "https://res.cloudinary.com/dwldehfnr/video/upload/v1698683188/goldeni-frontend/xy9lis5g5rkd11q3azfh.mp4";
  return (
    <div className="landing-page">
      <video autoPlay loop muted className="background-video">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* <img src="https://res.cloudinary.com/dwldehfnr/image/upload/v1698684559/goldeni-frontend/wwujztdjc4wfbqe2ajjr.png" className="logo" alt="Your Logo" /> */}

      <Button ghost className="sign-in-button" onClick={() => login()}>
        Sign in with Google
      </Button>

      <div className="home-content-container">
        <div className="home-content">
          {/* <span className="title">Golden </span> */}
          <img src="https://res.cloudinary.com/dwldehfnr/image/upload/v1698754847/goldeni-frontend/dlzyi4azchasou9li4tz.png" alt="Your Logo" className="main-logo" />
          {/* <span className="i_color">i</span> */}
          <p className="tag_line">
            {" "}
            ~ Your Visionary Companion for Safe and Smart Navigation ~
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
