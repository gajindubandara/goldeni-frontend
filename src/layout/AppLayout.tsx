import React from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Content, Sider,Header,Footer } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const breadcrumbItems = location.pathname.split("/").filter((item) => item);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider 
      breakpoint="lg" // Specify the breakpoint at which Sider collapses
      collapsedWidth="0" // Width when collapsed (0 means it disappears)
      width={200} theme="dark">
        <div className="navLogo">
        <img src="https://www.yorkstonguesthouse.co.uk/wp-content/uploads/2017/09/Rectangle-1920x1080-Placeholder.png" alt="Logo" />
        </div>
        <Menu mode="vertical" theme="dark" defaultSelectedKeys={[location.pathname]}>
          <Menu.Item key="/dashboard">
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/profile">
            <Link to="/profile">Profile</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
      <Content className="site-layout" style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Golden i</Breadcrumb.Item>
          {breadcrumbItems.map((item, index) => (
            <Breadcrumb.Item key={index}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
            </Breadcrumb.Item>
            ))}
        </Breadcrumb>
        <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            {children}
          </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
