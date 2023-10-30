// src/components/Login.js

// import React, { useState } from "react";
import { Form, Input, Button } from "antd";
// import { useEffect } from "react";
// import { GoogleLogin } from '@react-oauth/google';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    
const [form] = Form.useForm();
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
  return (
    <div>
      <h2>Login</h2>
      <Form form={form}>
        <Form.Item>
          <Button onClick={() => login()}>Sign in with Google  </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
