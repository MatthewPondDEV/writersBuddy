import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../cssImages/logo.png";
import { useEffect } from "react";
import { UserContext } from "../../UserContext";
import { useContext } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Stack from "react-bootstrap/Stack";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProjectSidebar({
  setProjectInfo,
  isUpdated,
  projectInfo,
  setViewNumber,
  setShowCreateCharacterModal,
  setShowCreateCountryModal,
  setShowCreateLandModal,
  setCurrentLandId,
  setCurrentCountryId,
  setCurrentBodyOfWaterId,
  setShowBodyOfWaterModal,
  setCurrentCharacterId,
  setCurrentGroupId,
  setShowGroupModal,
  setShowArcModal,
  setCurrentArcId,
  setShowChapterModal,
  setCurrentChapterId,
}) {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [loadData, setLoadData] = useState(false);
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
        setUserInfo(null);
      } else if (userInfo.id) {
        setUserInfo(userInfo);
        setLogCheck(true);
      }
    };
    loginCheck();
  }, [logCheck]);

  function logout() {
    fetch("http://localhost:5000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
    setProjectInfo(null);
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (loggedOutRedirect === true) {
    alert("Must log in or create account to use the application");
    return <Navigate to={"/"} />;
  }

  return (
    <Col xs={12} xxl={3} className="bg-light" id="project-sidebar">
      <Container fluid className="bg-light">
        <Row>
          <Col className="bg-light">
            <Navbar
              key={true}
              expand="xxl"
              id="project-nav"
              className="bg-light vh-100 w-100 flex-xxl-column align-items-start"
            >
              <Navbar.Brand href="/home">
                <Image src={logo} width="100px" rounded />
              </Navbar.Brand>
              <Navbar.Toggle
                aria-controls={`offcanvasNavbar-expand-true`}
                className="mt-4"
                onClick={handleShow}
              />
              <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-xxl`}
                aria-labelledby={`offcanvasNavbarLabel-expand-xxl`}
                placement="start"
                className="bg-light"
                show={show}
                onHide={handleClose}
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-xxl`}>
                    <Link to="/home">
                      <Image
                        src={logo}
                        width="100px"
                        className="text-center m-3"
                        rounded
                      />
                    </Link>
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav id="sidebar">
                    <Stack className="mt-1">
                      <Row>
                        <Col xs={12} id="project-nav">
                          <h2 className="my-3 text-center">
                            {projectInfo.title}
                          </h2>
                          <Button
                            variant="none"
                            className="border-top border-bottom w-100 text-start p-3"
                            onClick={() => {
                              setViewNumber(0);
                              handleClose();
                            }}
                          >
                            Overview
                          </Button>
                          <Accordion flush alwaysOpen>
                            <Accordion.Item eventKey="0">
                              <Accordion.Header>Setting</Accordion.Header>
                              <Accordion.Body>
                                <Button
                                  variant="none"
                                  className="border-top w-100 text-start p-3"
                                  onClick={() => {
                                    setViewNumber(3);
                                    handleClose();
                                  }}
                                >
                                  General
                                </Button>
                                <Accordion.Item eventKey="4">
                                  <Accordion.Header>
                                    Countries/Kingdoms
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <>
                                      {projectInfo._id &&
                                        projectInfo.setting.countries.map(
                                          (country) => (
                                            <Button
                                              {...country}
                                              key={country._id}
                                              variant="none"
                                              className="w-100 text-start p-3"
                                              onClick={() => {
                                                setCurrentCountryId(
                                                  country._id
                                                );
                                                setViewNumber("5");
                                                handleClose();
                                              }}
                                            >
                                              {country.name}
                                            </Button>
                                          )
                                        )}
                                    </>
                                    <Button
                                      variant="outline-primary mt-2"
                                      onClick={() =>
                                        setShowCreateCountryModal(true)
                                      }
                                    >
                                      Create New Country/Kingdom
                                    </Button>
                                  </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="7">
                                  <Accordion.Header>
                                    Lands/Deserts/Jungles/Areas
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <>
                                      {projectInfo._id &&
                                        projectInfo.setting.lands.map(
                                          (land) => (
                                            <Button
                                              {...land}
                                              key={land._id}
                                              variant="none"
                                              className="border-top w-100 text-start p-3"
                                              onClick={() => {
                                                setCurrentLandId(land._id);
                                                setViewNumber("7");
                                                handleClose("");
                                              }}
                                            >
                                              {land.name}
                                            </Button>
                                          )
                                        )}
                                    </>
                                    <Button
                                      variant="outline-primary mt-2"
                                      onClick={() =>
                                        setShowCreateLandModal(true)
                                      }
                                    >
                                      Create New Land/Area
                                    </Button>
                                  </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="8">
                                  <Accordion.Header>
                                    Bodies of Water
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <>
                                      {projectInfo._id &&
                                        projectInfo.setting.bodiesOfWater.map(
                                          (body) => (
                                            <Button
                                              {...body}
                                              key={body._id}
                                              variant="none"
                                              className="border-top w-100 text-start p-3"
                                              onClick={() => {
                                                setCurrentBodyOfWaterId(
                                                  body._id
                                                );
                                                setViewNumber("9");
                                                handleClose();
                                              }}
                                            >
                                              {body.name}
                                            </Button>
                                          )
                                        )}
                                    </>
                                    <Button
                                      variant="outline-primary mt-2"
                                      onClick={() =>
                                        setShowBodyOfWaterModal(true)
                                      }
                                    >
                                      Create New Body of Water
                                    </Button>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                              <Accordion.Header>Characters</Accordion.Header>
                              <Accordion.Body>
                                <Accordion.Item eventKey="6">
                                  <Accordion.Header>
                                    Protagonists
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <Accordion.Item eventKey="13">
                                      <Accordion.Header>Major</Accordion.Header>
                                      <Accordion.Body>
                                        <>
                                          {projectInfo._id &&
                                            projectInfo.characters.map(
                                              (character) => {
                                                if (
                                                  character.characterType ===
                                                    "Main Protagonist" ||
                                                  character.characterType ===
                                                    "Major Supporting Protagonist"
                                                ) {
                                                  return (
                                                    <Button
                                                      key={character._id}
                                                      variant="none"
                                                      className="w-100 text-start p-3"
                                                      onClick={() => {
                                                        setCurrentCharacterId(
                                                          character._id
                                                        );
                                                        setViewNumber("11");
                                                        handleClose();
                                                      }}
                                                    >
                                                      {character.name}
                                                    </Button>
                                                  );
                                                }
                                                return null; // Ensure to return null for characters that don't match
                                              }
                                            )}
                                        </>
                                      </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="9">
                                      <Accordion.Header>Minor</Accordion.Header>
                                      <Accordion.Body>
                                        <>
                                          {projectInfo._id &&
                                            projectInfo.characters.map(
                                              (character) => {
                                                if (
                                                  character.characterType ===
                                                  "Minor Supporting Protagonist"
                                                ) {
                                                  return (
                                                    <Button
                                                      key={character._id}
                                                      variant="none"
                                                      className="border-top w-100 text-start p-3"
                                                      onClick={() => {
                                                        setCurrentCharacterId(
                                                          character._id
                                                        );
                                                        setViewNumber("11");
                                                        handleClose();
                                                      }}
                                                    >
                                                      {character.name}
                                                    </Button>
                                                  );
                                                }
                                                return null; // Ensure to return null for characters that don't match
                                              }
                                            )}
                                        </>
                                      </Accordion.Body>
                                    </Accordion.Item>
                                  </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="10">
                                  <Accordion.Header>
                                    Antagonists
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <Accordion.Item eventKey="14">
                                      <Accordion.Header>Major</Accordion.Header>
                                      <Accordion.Body>
                                        <>
                                          {projectInfo._id &&
                                            projectInfo.characters.map(
                                              (character) => {
                                                if (
                                                  character.characterType ===
                                                  "Major Antagonist"
                                                ) {
                                                  return (
                                                    <Button
                                                      key={character._id}
                                                      variant="none"
                                                      className="border-top w-100 text-start p-3"
                                                      onClick={() => {
                                                        setCurrentCharacterId(
                                                          character._id
                                                        );
                                                        setViewNumber("11");
                                                        handleClose();
                                                      }}
                                                    >
                                                      {character.name}
                                                    </Button>
                                                  );
                                                }
                                                return null; // Ensure to return null for characters that don't match
                                              }
                                            )}
                                        </>
                                      </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="11">
                                      <Accordion.Header>Minor</Accordion.Header>
                                      <Accordion.Body>
                                        <>
                                          {projectInfo._id &&
                                            projectInfo.characters.map(
                                              (character) => {
                                                if (
                                                  character.characterType ===
                                                  "Minor Antagonist"
                                                ) {
                                                  return (
                                                    <Button
                                                      key={character._id}
                                                      variant="none"
                                                      className="border-top w-100 text-start p-3"
                                                      onClick={() => {
                                                        setCurrentCharacterId(
                                                          character._id
                                                        );
                                                        setViewNumber("11");
                                                        handleClose();
                                                      }}
                                                    >
                                                      {character.name}
                                                    </Button>
                                                  );
                                                }
                                                return null; // Ensure to return null for characters that don't match
                                              }
                                            )}
                                        </>
                                      </Accordion.Body>
                                    </Accordion.Item>
                                  </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="12" className="mb-2">
                                  <Accordion.Header>Tertiary</Accordion.Header>
                                  <Accordion.Body>
                                    <>
                                      {projectInfo._id &&
                                        projectInfo.characters.map(
                                          (character) => {
                                            if (
                                              character.characterType ===
                                                "Tertiary" ||
                                              !character.characterType
                                            ) {
                                              return (
                                                <Button
                                                  key={character._id}
                                                  variant="none"
                                                  className="border-top w-100 text-start p-3"
                                                  onClick={() => {
                                                    setCurrentCharacterId(
                                                      character._id
                                                    );
                                                    setViewNumber("11");
                                                    handleClose();
                                                  }}
                                                >
                                                  {character.name}
                                                </Button>
                                              );
                                            }
                                            return null; // Ensure to return null for characters that don't match
                                          }
                                        )}
                                    </>
                                  </Accordion.Body>
                                </Accordion.Item>
                                <Button
                                  variant="outline-primary"
                                  onClick={() =>
                                    setShowCreateCharacterModal(true)
                                  }
                                >
                                  Create New Character
                                </Button>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="20">
                              <Accordion.Header>
                                Groups/Organizations
                              </Accordion.Header>
                              <Accordion.Body>
                                <>
                                  {projectInfo._id &&
                                    projectInfo.groups.map((group) => {
                                      return (
                                        <Button
                                          key={group._id}
                                          variant="none"
                                          className="border-top w-100 text-start p-3"
                                          onClick={() => {
                                            setCurrentGroupId(group._id);
                                            setViewNumber("13");
                                            handleClose();
                                          }}
                                        >
                                          {group.name}
                                        </Button>
                                      );
                                    })}
                                </>
                                <Button
                                  variant="outline-primary"
                                  onClick={() => setShowGroupModal(true)}
                                >
                                  Create New Group/Organization
                                </Button>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Button
                              variant="none"
                              className="border-bottom w-100 text-start p-3"
                              onClick={() => {
                                setViewNumber("15");
                                handleClose();
                              }}
                            >
                              Themes
                            </Button>
                            <Accordion.Item eventKey="3">
                              <Accordion.Header>Plot</Accordion.Header>
                              <Accordion.Body>
                                <Button
                                  variant="none"
                                  className="border-top w-100 text-start p-3"
                                  onClick={() => {
                                    setViewNumber("17");
                                    handleClose();
                                  }}
                                >
                                  Overview
                                </Button>
                                <Accordion.Item eventKey="16">
                                  <Accordion.Header>
                                    Arcs/Books
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <>
                                      {projectInfo._id &&
                                        projectInfo.plot.arcs.map((arc) => (
                                          <Button
                                            key={arc._id}
                                            variant="none"
                                            className="border-top w-100 text-start p-3"
                                            onClick={() => {
                                              setCurrentArcId(arc._id);
                                              setViewNumber("19");
                                              handleClose();
                                            }}
                                          >
                                            {arc.name}
                                          </Button>
                                        ))}
                                    </>
                                    <Button
                                      variant="outline-primary mt-2"
                                      onClick={() => setShowArcModal(true)}
                                    >
                                      Create new Arc
                                    </Button>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="5">
                              <Accordion.Header className="border-bottom">
                                Write
                              </Accordion.Header>
                              <Accordion.Body>
                                <Button
                                  variant="none"
                                  className="border-top w-100 text-start p-3"
                                  onClick={() => {
                                    setViewNumber("21");
                                    handleClose();
                                  }}
                                >
                                  Prologue
                                </Button>
                                <Button
                                  variant="none"
                                  className="border-top w-100 text-start p-3"
                                  onClick={() => {
                                    setViewNumber("23");
                                    handleClose();
                                  }}
                                >
                                  Epilogue
                                </Button>
                                <Accordion.Item eventKey="17">
                                  <Accordion.Header>Chapters</Accordion.Header>
                                  <Accordion.Body>
                                    <>
                                      {projectInfo._id &&
                                        projectInfo.write.chapters.map(
                                          (chapter, index) => (
                                            <Button
                                              key={chapter._id}
                                              variant="none"
                                              className="border-top w-100 text-start p-3"
                                              onClick={() => {
                                                setCurrentChapterId(
                                                  chapter._id
                                                );
                                                setViewNumber("25");
                                                handleClose();
                                              }}
                                            >
                                              {`Chapter ${chapter.chapterNumber}` +
                                                ": " +
                                                `${chapter.title}`}
                                            </Button>
                                          )
                                        )}
                                    </>
                                    <Button
                                      variant="outline-primary mt-2"
                                      onClick={() => setShowChapterModal(true)}
                                    >
                                      Create new chapter
                                    </Button>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </Col>
                      </Row>
                      <Row
                        id="nav-buttons"
                        className="border-top border-dark mt-3 py-2"
                      >
                        <Col xs={12}>
                          <Nav.Link
                            href="/manageProjects"
                            className="py-4 mx-2 text-start"
                          >
                            {" "}
                            <i className="bi bi-journal-text mx-2"></i> Projects
                          </Nav.Link>
                        </Col>
                        <Col xs={12}>
                          <Nav.Link
                            href="/notes"
                            className="py-4 mx-2 text-start"
                          >
                            {" "}
                            <i className="bi bi-pencil-square mx-2"></i> Notes
                          </Nav.Link>
                        </Col>
                        <Col xs={12}>
                          <Nav.Link
                            href="/brainstorm"
                            className="py-4 mx-2 text-start"
                          >
                            {" "}
                            <i className="bi bi-lightbulb mx-2"></i> Brainstorm
                          </Nav.Link>
                        </Col>
                        <Col xs={12}>
                          <Nav.Link
                            href="/profile"
                            className="py-4 mx-2 text-start"
                          >
                            <i className="bi bi-person-circle mx-2"></i> Profile
                          </Nav.Link>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={12} className="border-top border-dark mb-2">
                          <Nav.Link
                            href="/"
                            onClick={logout}
                            id="logout-button"
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
        </Row>
      </Container>
    </Col>
  );
}
