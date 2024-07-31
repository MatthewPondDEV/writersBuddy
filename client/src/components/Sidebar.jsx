import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../cssImages/logo.png";
import { useEffect } from "react";
import { UserContext } from "../UserContext";
import { useContext } from "react";
import { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { Navigate } from "react-router-dom";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Sidebar() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [loggedOutRedirect, setLoggedOutRedirect] = useState(false);
  const [logCheck, setLogCheck] = useState(false);

  setInterval(() => {
    setLogCheck(false);
  }, 15 * 60 * 1000 + 50);

  useEffect(() => {
    const loginCheck = async () => {
      const response = await fetch("http://localhost:5000/profile", {
        credentials: "include",
      });

      const userInfo = await response.json();

      if (userInfo.error) {
        setLoggedOutRedirect(true);
        setUserInfo(null)
      } else if (userInfo.id) {
        setUserInfo(userInfo);
        setLogCheck(true);
      }
    };
    loginCheck();
  }, [logCheck]);

  if (loggedOutRedirect === true) {

    return <Navigate to={"/"} />;
  }

  async function logout() {
    await fetch("http://localhost:5000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null)
    setLoggedOutRedirect(true);;
  }

  return (
    <Col xs={12} xxl={2} className="bg-light">
      <Navbar
        key={true}
        expand="xxl"
        className="bg-light w-100 flex-xxl-column align-items-start"
      >
        <Navbar.Brand>
          <Link to="/home">
            <Image src={logo} width="100px" rounded />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls={`offcanvasNavbar-expand-true`}
          className="mt-4"
        />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-xxl`}
          aria-labelledby={`offcanvasNavbarLabel-expand-xxl`}
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-xxl`}>
              <Image
                src={logo}
                width="100px"
                className="text-center m-3"
                rounded
              />
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav id="sidebar">
              <Stack className="mt-4 px-3" id="nav-buttons">
                <Row className="border-top border-bottom border-dark mb-2 py-3">
                  <Col xs={12}>
                    <Nav.Link
                      href="/manageProjects"
                      className="py-4 text-start"
                    >
                      {" "}
                      <i className="bi bi-journal-text mx-2"></i> Projects
                    </Nav.Link>
                  </Col>
                  <Col xs={12}>
                    <Nav.Link href="/notes" className="py-4 text-start">
                      {" "}
                      <i className="bi bi-pencil-square mx-2"></i> Notes
                    </Nav.Link>
                  </Col>
                  <Col xs={12}>
                    <Nav.Link href="/brainstorm" className="py-4 text-start">
                      {" "}
                      <i className="bi bi-lightbulb mx-2"></i> Brainstorm
                    </Nav.Link>
                  </Col>
                  <Col xs={12}>
                    <Nav.Link href="/profile" className="py-4 text-start">
                      <i className="bi bi-person-circle mx-2"></i> Profile
                    </Nav.Link>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12}>
                    <Nav.Link
                      onClick={logout}
                      className="py-4 mt-2 text-center"
                    >
                      Logout
                    </Nav.Link>
                  </Col>
                </Row>
              </Stack>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Navbar>
    </Col>
  );
}
