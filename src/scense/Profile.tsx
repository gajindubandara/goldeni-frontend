import React from "react";
import { Avatar, Button } from "antd";
import AppLayout from "../layout/AppLayout";
import { googleLogout } from "@react-oauth/google";

const Profile: React.FC = () => {
    // Retrieve the userData object from session
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  console.log(userData)

  const logOut = () => {
    googleLogout();
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("sessionExpiration");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };
  
  return (
    <AppLayout>S
      <h1>Profile</h1>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar size={64} src={userData.picture} />
        <div style={{ marginLeft: 16 }}>
          <p>email: {userData.email}</p>
          <p>family name: {userData.family_name}</p>
          <p>given name: {userData.given_name}</p>
          <p>id: {userData.id}</p>
          <p>locale: {userData.locale}</p>
          <p> name: {userData.name}</p>
          <p>verified email: {userData.verified_email}</p>
          {/* <Avatar size={64} src={userData.picture} /> */}

          <Button onClick={logOut}>Log out</Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
