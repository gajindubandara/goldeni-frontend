import React, { useState, useEffect } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import {Link,useLocation} from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';
import {decodeIdToken} from "../services/decodeService";
import { routes } from "../services/routeService";

const { Content, Sider,Footer } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const breadcrumbItems = location.pathname.split("/").filter((item) => item);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("sessionExpiration");
    localStorage.removeItem("userData");
    // window.location.href = "/";
    navigate('/login');
    window.location.reload();

  };
  const [userData, setUser] = useState({
    email: '',
    name: '',
    picture: '',
  });

  useEffect(() => {
    const userData = decodeIdToken();
    if (userData) {
      setUser(userData);
    }

    const { isAdmin } = userData || {};
    // Handling when isAdmin is true
    if (isAdmin) {
      // Perform actions for an admin user
      console.log('User is an admin');
    }
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
      breakpoint="lg"
      collapsedWidth="0"
      width={200} theme="dark">
        <div className="navLogo">
        <img src="https://res.cloudinary.com/dwldehfnr/image/upload/v1698754847/goldeni-frontend/dlzyi4azchasou9li4tz.png" alt="Logo" />
        </div>
        <Menu mode="vertical" theme="dark" defaultSelectedKeys={[location.pathname]}>
          {routes.map((route) => (
              <Menu.Item key={route.path}>
                <Link to={route.path}>{route.name}</Link>
              </Menu.Item>
          ))}
          <Menu.Item key="/logout" onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
      <Content className="site-layout" style={{ padding: '0 15px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Golden i</Breadcrumb.Item>
          {breadcrumbItems.map((item, index) => (
            <Breadcrumb.Item key={index}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
            </Breadcrumb.Item>
            ))}
        </Breadcrumb>
        <div style={{ padding: 24, background: "#fff", minHeight: '85vh' }}>
            {children}
          </div>
      </Content>
      <Footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {/* <Avatar src={userData.picture} /> */}
            <span style={{ marginLeft: '8px' }}>{userData.email}</span>
          </div>
          <div>©2023, Golden i</div>
        </Footer>
      {/* <Footer style={{ textAlign: 'center' }}>©2023, Golden i</Footer> */}
      </Layout>
    </Layout>
  );
};

export default AppLayout;
