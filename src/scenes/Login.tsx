import {Button} from "antd";
import React from "react";
import {landingPageIcon, landingPageVideo, loginUrl} from '../services/commonVariables';

const Login: React.FC = () => {

    const login = () => {
        window.location.href = loginUrl;

    }

    return (
        <div className="landing-page">
            <video autoPlay loop muted className="background-video">
                <source src={landingPageVideo} type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
            <Button ghost className="sign-in-button" onClick={() => login()}>
                Sign in with Google
            </Button>

            <div className="home-content-container">
                <div className="home-content">
                    <img
                        src={landingPageIcon}
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
