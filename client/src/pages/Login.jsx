import React from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";

const Login = () => {
  return (
    <div>
      <Form>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>LogIn</h2>
              <Form.Control type="email" placeholder="Email"/>
              <Form.Control type="password" placeholder="Password"/>
              <Button variant="primary" type="submit">Register</Button>
              <Alert variant="danger" className="h-25 "><p>An error occured</p></Alert>
            </Stack>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Login;
