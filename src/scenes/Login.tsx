import {Button} from "antd";
import React from "react";
import { loginUrl } from '../services/commonVariables';

const Login: React.FC = () => {

    const login = () => {
        window.location.href = loginUrl;

    }
    const src =
        "https://res.cloudinary.com/dwldehfnr/video/upload/v1698683188/goldeni-frontend/xy9lis5g5rkd11q3azfh.mp4";
    return (
        <div className="landing-page">
            <video autoPlay loop muted className="background-video">
                <source src={src} type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
            <Button ghost className="sign-in-button" onClick={() => login()}>
                Sign in with Google
            </Button>

            <div className="home-content-container">
                <div className="home-content">
                    <img
                        src="https://res.cloudinary.com/dwldehfnr/image/upload/v1698754847/goldeni-frontend/dlzyi4azchasou9li4tz.png"
                        alt="Your Logo" className="main-logo"/>
                    <p className="tag_line">
                        ~ Your Visionary Companion for Safe and Smart Navigation ~
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
