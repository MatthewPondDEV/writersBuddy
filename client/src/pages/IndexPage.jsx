import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Login from "../components/Login";
import Register from "../components/Register";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import mangaImg from "../cssImages/Manga4.jpeg";
import novelImg from "../cssImages/Novel1.jpeg";
import playwriteImg from "../cssImages/Play-write.jpeg";
import shortStoryImg from "../cssImages/ShortStory1.jpeg";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../cssImages/logo.png";
import instagram from "../cssImages/icons/instagram.png";
import facebook from "../cssImages/icons/facebook.png";
import pinterest from "../cssImages/icons/pinterest.png";
import twitter from "../cssImages/icons/twitter.png";
import tiktok from "../cssImages/icons/tiktok.png";
import { GoogleLogin } from "@react-oauth/google";

export default function IndexPage() {
  const [loggedInRedirect, setLoggedInRedirect] = useState(false);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [loadLogin, setLoadLogin] = useState(false);
  const [loadRegister, setLoadRegister] = useState(false);
  const [logOrReg, setLogOrReg] = useState(true);

  useEffect(() => {
    const loginCheck = async () => {
      const response = await fetch("http://localhost:4000/profile", {
        credentials: "include",
      });

      const userInfo = await response.json();

      if (userInfo.id) {
        setUserInfo(userInfo);
        setLoggedInRedirect(true);
      }
    };
    loginCheck();
  }, []);

  useEffect(() => {
    const element = document.getElementById("create-or-login");
    if (element) {
      element.style.display = logOrReg ? "flex" : "none";
    }
  }, [logOrReg]);

  if (loggedInRedirect) {
    return <Navigate to={"/home"} />;
  }

  const handleGoogleSuccess = async (response) => {
    // Send the response token to your backend to authenticate the user
    const res = await fetch("http://localhost:4000/auth/google/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ id_token: response.credential }),
    });

    const data = await res.json();
    if (data.user.id) {
      setUserInfo(data.user);
      setLoggedInRedirect(true);
    }
  };

  const handleGoogleError = (error) => {
    console.log('google error')
    console.error("Google Sign-In Error:", error);
  };

  return (
    <Container fluid>
      <Row
        style={{
          background: "linear-gradient(to bottom right,#fffff2,#ffbd59)",
        }}
      >
        <Navbar className="justify-content-space-between">
          <Container>
            <Navbar.Brand href="/">
              <Image src={logo} width="80px" rounded />
            </Navbar.Brand>
            <Col className="d-none d-lg-block text-end" id="head-icons">
              <Image src={instagram} className="my-4 mx-2" width="4%" />
              <Image src={facebook} className="my-4 mx-2" width="4%" />
              <Image src={pinterest} className="my-4 mx-2" width="4%" />
              <Image src={twitter} className="my-4 mx-2" width="4%" />
              <Image src={tiktok} className="my-4 mx-2" width="4%" />
            </Col>
          </Container>
        </Navbar>
      </Row>
      <Row sm md id="index-background">
        <Col xl={2}></Col>
        <Col className="text-white">
          <div className="mt-5 text-left" style={{ display: "inline-block" }}>
            <h1
              className="mt-4 display-2"
              style={{
                textShadow: "1px 1px 6px #FAF9F6, 1px 1px 10px #ccc",
                display: "inline-block",
                borderRadius: "10px",
              }}
            >
              Bring your stories to life
            </h1>
            <p
              className="mt-1"
              style={{
                background: "rgba(0, 0, 0, 0.75)",
                padding: "6px",
                borderRadius: "5px",
              }}
            >
              <strong>Writer's buddy</strong> is here to help you brainstorm,
              organize, and craft your next novel, manga, or short-story. The
              perfect buddy for story-tellers.
            </p>
          </div>
        </Col>
        <Col sm={12} md={12} lg={5} xl={4} xxl={3} className="text-white">
          <div
            style={{
              background: "rgba(0, 0, 0, 0.75)",
              boxShadow: "0 0 15px #ffffff",
              borderRadius: "20px",
            }}
            className="my-5 mx-3 text-center"
          >
            <div
              id="create-or-login"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <span className="m-3 mt-4">Login or create account to begin</span>
              <Button
                variant="primary"
                className="mb-4 mx-5 orange"
                size="md"
                onClick={() => {
                  setLoadLogin(true);
                  setLogOrReg(false);
                }}
              >
                Login
              </Button>
              <Button
                variant="primary mx-5 mb-4"
                size="md"
                onClick={() => {
                  setLoadRegister(true);
                  setLogOrReg(false);
                }}
              >
                Create Account
              </Button>
              <span> - or - </span>
              <div className="mx-5 my-4 d-flex justify-content-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onFailure={handleGoogleError}
                />
              </div>
            </div>
            {loadLogin && (
              <>
                <Login />
                <Button
                  variant="link"
                  onClick={() => {
                    setLoadLogin(false);
                    setLogOrReg(true);
                  }}
                >
                  {" "}
                  Go Back
                </Button>
              </>
            )}
            {loadRegister && (
              <>
                <Register
                  setLoadRegister={setLoadRegister}
                  setLoadLogin={setLoadLogin}
                />
                <Button
                  variant="link"
                  onClick={() => {
                    setLoadRegister(false);
                    setLogOrReg(true);
                  }}
                >
                  Go Back
                </Button>
              </>
            )}
          </div>
        </Col>
        <Col xl={1}></Col>
      </Row>

      <Row id="index-row" className="py-3" style={{ background: "#fffff2" }}>
        <Col xs={12}>
          <h1 className="text-center mb-4">Plan your next</h1>
        </Col>
        <Col xs={12} sm={6} xxl={3} className="text-center mt-3">
          <h3>Manga/Comic</h3>
          <Image
            src={mangaImg}
            className="my-3 rounded-circle"
            style={{
              height: "300px",
              boxShadow: "0 0 15px #ffffff",
              width: "85%",
            }}
          />
        </Col>
        <Col xs={12} sm={6} xxl={3} className="text-center mt-3">
          <h3>Novel</h3>
          <Image
            src={novelImg}
            className="my-3 rounded-circle"
            style={{
              height: "300px",
              boxShadow: "0 0 15px #ffffff",
              width: "85%",
            }}
          />
        </Col>
        <Col xs={12} sm={6} xxl={3} className="text-center mt-3">
          <h3>Play-write</h3>
          <Image
            src={playwriteImg}
            className="my-3 rounded-circle"
            style={{
              height: "300px",
              boxShadow: "0 0 15px #ffffff",
              width: "85%",
            }}
          />
        </Col>
        <Col xs={12} sm={6} xxl={3} className="text-center mt-3">
          <h3>Short Story</h3>
          <Image
            src={shortStoryImg}
            className="my-3 rounded-circle"
            style={{
              height: "300px",
              boxShadow: "0 0 15px #ffffff",
              width: "85%",
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}
