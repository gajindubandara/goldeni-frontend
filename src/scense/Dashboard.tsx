import React from "react";
import { Row, Col, Card } from "antd";
import AppLayout from "../layout/AppLayout";

const Dashboard: React.FC = () => {
  
  return (
    <AppLayout>
      <h2>Dashboard</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Card 1" style={{ marginBottom: 16 }}>
            {/* Content for Card 1 */}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card 2" style={{ marginBottom: 16 }}>
            {/* Content for Card 2 */}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Card 3" style={{ marginBottom: 16 }}>
            {/* Content for Card 3 */}
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
  // return (
  //   <div>
      // <h2>Dashboard</h2>
      // <p>email: {userData.email}</p>
      // <p>family name: {userData.family_name}</p>
      // <p>given name: {userData.given_name}</p>
      // <p>id: {userData.id}</p>
      // <p>locale: {userData.locale}</p>
      // <p> name: {userData.name}</p>
      // <p>verified email: {userData.verified_email}</p>
      // <Avatar size={64} src={userData.picture} />
      
      
      

      // <Button onClick={logOut}>Log out</Button>
      // {/* Add your dashboard content here */}
  //   </div>
  // );
};

export default Dashboard;
