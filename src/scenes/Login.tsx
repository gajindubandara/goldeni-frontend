import { Button } from "antd";
import React from "react";
// import { useGoogleLogin } from "@react-oauth/google";
// import { useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  // const navigate = useNavigate();
  // const [user, setUser] = useState<any | null>(null);
  // const login = useGoogleLogin({
  //   onSuccess: (codeResponse) => setUser(codeResponse),
  //   onError: (error) => console.log("Login Failed:", error),
  // });

  const login = () => {
    // Redirect the user to the Cognito-hosted authentication page
window.location.href = 'https://goldeni.auth.ap-southeast-1.amazoncognito.com/login?client_id=2ch8tjlfbqpa6nbf19ak670lrs&response_type=token&scope=email+openid+profile&redirect_uri=https%3A%2F%2Fgoldeni.s3.ap-southeast-1.amazonaws.com%2Findex.html';
// window.location.href = 'https://goldeni.auth.ap-southeast-1.amazoncognito.com/login?client_id=2ch8tjlfbqpa6nbf19ak670lrs&response_type=token&scope=email+openid+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000';

  }

  // useEffect(() => {
  //   if (user) {
  //     axios
  //       .get(
  //         `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${user.access_token}`,
  //             Accept: "application/json",
  //           },
  //         }
  //       )
  //       .then((res) => {
  //         // setProfile(res.data);
  //         localStorage.setItem("userData", JSON.stringify(res.data));
  //         localStorage.setItem("loggedIn", "true");
  //         const expirationTime = (new Date().getTime() + 3600000).toString(); // 1 hour in milliseconds
  //         localStorage.setItem("sessionExpiration", expirationTime);
  //         // console.log(res);
  //         // window.location.href = "/index.html#/";
  //         navigate('/');
  //         window.location.reload();
  //         // navigate('/dashboard');
  //         // window.location.href = window.location.href.split('#')[0] + '#/dashboard';
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }, [navigate, user]);

  const src =
    "https://res.cloudinary.com/dwldehfnr/video/upload/v1698683188/goldeni-frontend/xy9lis5g5rkd11q3azfh.mp4";
  return (
    <div className="landing-page">
      <video autoPlay loop muted className="background-video">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Button ghost className="sign-in-button" onClick={() => login()}>
        Sign in with Google
      </Button>

      <div className="home-content-container">
        <div className="home-content">
          <img src="https://res.cloudinary.com/dwldehfnr/image/upload/v1698754847/goldeni-frontend/dlzyi4azchasou9li4tz.png" alt="Your Logo" className="main-logo" />
          <p className="tag_line">
            ~ Your Visionary Companion for Safe and Smart Navigation ~
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
