import React, { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./chat/Notification";

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <Navbar className="mb-4 bg-dark " style={{ height: "3.75rem" }}>
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none ">
            ChatApp
          </Link>
        </h2>
        <span className="text-warning">{ user ? `Logged in as ${user?.name}` : `Please Login or Register` }</span>
        <Nav>
          <Stack direction="horizontal" gap={3}>
            {user && (
              <>
              <Notification />
                <Link
                  onClick={() => logoutUser()}
                  to="/login"
                  className="link-light text-decoration-none "
                >
                  Logout
                </Link>
              </>
            )}

            {!user && (
              <>
                <Link to="/login" className="link-light text-decoration-none ">
                  LogIn
                </Link>
                <Link
                  to="/register"
                  className="link-light text-decoration-none "
                >
                  Register
                </Link>
              </>
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
