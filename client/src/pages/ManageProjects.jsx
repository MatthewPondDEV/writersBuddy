import CreateProjectModal from "../components/projectComponents/CreateProjectModal";
import { useState } from "react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../components/Header";
import mangaPic from "../cssImages/Manga5.jpeg";
import Image from "react-bootstrap/Image";

export default function ManagePojects() {
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      const response = await fetch("http://localhost:5000/getProjects", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const userProjects = await response.json();
        setProjects(userProjects);
        console.log(userProjects);
      } else {
        alert("failed to load projects");
      }
    }

    fetchProjects();
  }, []);

  if (projectId) {
    return <Navigate to={`/project/${projectId}`} />;
  }

  return (
    <>
      <Header />
      <Container fluid id="papyrus">
        <Row>
          <h1 className="my-5 text-center">My Projects</h1>
          <Col xs={12}>
            <Row className="m-5 p-5" id="manage-projects">
              {projects.length &&
                projects.map((project) => {
                  return (
                    <div className="border-bottom border-dark">
                      <Row>
                        <Col xs={12} md={6} xl={8}>
                          <Row>
                            <Col xs={12} xl={6} className="p-3 text-center">
                              <h2 className="mt-3">{project.title}</h2>
                              <div className="mt-3">
                                <Button
                                  variant="primary mx-1"
                                  onClick={() => setProjectId(project._id)}
                                >
                                  <i className="bi bi-pencil-square mx-2">
                                    {" "}
                                    Edit
                                  </i>
                                </Button>
                                <Button variant="danger mx-1">
                                  <i className="bi bi-trash">Delete</i>
                                </Button>
                              </div>
                            </Col>
                            <Col xs={12} xl={6} className="p-3 text-center">
                              {project.cover ? (
                                <Image
                                  src={`http://localhost:5000/${project.cover}`}
                                  alt="Avatar"
                                  style={{
                                    height: "300px",
                                    borderRadius: "60%",
                                  }}
                                />
                              ) : (
                                <Image
                                  className="text-center"
                                  src={mangaPic}
                                  alt="character picture"
                                  style={{ height: "150px" }}
                                />
                              )}
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={12} md={6} xl={4} className="p-3 text-center">
                          <p>dsfsdafgsbvfgxbnfhgnhf</p>
                        </Col>
                      </Row>
                    </div>
                  );
                })}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
