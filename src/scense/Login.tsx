// src/components/Login.js

// import React, { useState } from "react";
import { Button } from "antd";
// import { useEffect } from "react";
// import { GoogleLogin } from '@react-oauth/google';
import {  useGoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
const [ user, setUser ] = useState<any | null>(null); 
// const [profile, setProfile] = useState<any | null>(null); // Initialize with null or specify the actual type


    // const logOut = () => {
    //     googleLogout();
    //     setProfile(null);
    // };

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        // setProfile(res.data);
                        localStorage.setItem("userData", JSON.stringify(res.data));
                        localStorage.setItem("loggedIn", "true");
                        const expirationTime = (new Date().getTime() + 60000).toString(); // 1 hour in milliseconds
                        localStorage.setItem("sessionExpiration", expirationTime);
                        // console.log(res);
                        window.location.href = "/dashboard";
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );

    const src ="https://res.cloudinary.com/dwldehfnr/video/upload/v1698683188/goldeni-frontend/xy9lis5g5rkd11q3azfh.mp4";
  // "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4";
  return (
    <div className="landing-page">
       {/* <video autoPlay loop muted>
        <source src={src} type="video/mp4"/>
        Your browser does not support the video tag.
      </video> */}
      {/* <video autoPlay loop muted controls>
      <source src={src} type="video/mp4" />
      Sorry, your browser doesn't support embedded videos.
    </video> */}
{/* 
    <div className="content">
        <h1>Welcome to My Website</h1>
        <p>This is some content over the video background.</p>
    </div> */}
    <video autoPlay muted loop className="background-video">
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <img src="https://res.cloudinary.com/dwldehfnr/image/upload/v1698684559/goldeni-frontend/wwujztdjc4wfbqe2ajjr.png" className="logo" alt="Your Logo" />
    {/* <button className="sign-in-button">Sign In</button> */}
    {/* <GoogleButton className="sign-in-button"
  onClick={() => login()}/> */}
   <Button className="sign-in-button" onClick={() => login()}>Sign in with Google  </Button>

<div className="content">
  <div className="title_box">
        <span className="title">Golden </span><span className="i_color">i</span>
        <p className="tag_line"> ~ Your Visionary Companion for Safe and Smart Navigation ~</p>
        </div>
    </div>
  </div>
    // <div>
    //   <h2>Login</h2>
    //   <Form form={form}>
    //     <Form.Item>
    //       <Button onClick={() => login()}>Sign in with Google  </Button>
    //     </Form.Item>
    //   </Form>
    // </div>
  );
};

export default Login;
