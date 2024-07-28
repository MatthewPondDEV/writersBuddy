import CreateProjectModal from "../components/projectComponents/CreateProjectModal";
import DeleteProjectModal from "../components/projectComponents/DeleteProjectModal";
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
import Sidebar from "../components/Sidebar";

export default function ManagePojects() {
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [updated, setUpdated] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const handleClose = () => setShowCreateProjectModal(false);
  const handleShow = () => setShowCreateProjectModal(true);

  const deleteHandleClose = () => setShowDeleteProjectModal(false);
  const deleteHandleShow = () => setShowDeleteProjectModal(true);

  useEffect(() => {
    async function fetchProjects() {
      const response = await fetch("http://localhost:5000/getProjects", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const userProjects = await response.json();
        setProjects(userProjects);
        setUpdated(true);
      } else {
        alert("failed to load projects");
      }
    }

    fetchProjects();
  }, [updated]);

  if (projectId && redirect) {
    return <Navigate to={`/project/${projectId}`} />;
  }

  return (
    <Container fluid>
      <Header />
      <Row>
        <Sidebar />
        <Col xs={12} xxl={10} id="papyrus">
          <h1 className="my-5 text-center">My Projects</h1>
          <Col className="mx-3 my-5 py-5 px-3" id="manage-projects">
            {projects.length > 0 &&
              projects.map((project, index) => (
                  <div key = {index} className="border-bottom border-dark">
                    <Row className="my-4">
                      <Col xs={12} md={6} xl={8}>
                        <Row>
                          <Col xs={12} xl={6} className="p-3 text-center">
                            <h2 className="mt-3">{project.title}</h2>
                            <div className="mt-3">
                              <Button
                                variant="primary m-1"
                                onClick={() => {
                                  setProjectId(project._id);
                                  setRedirect(true);
                                }}
                              >
                                <i className="bi bi-pencil-square"> Edit</i>
                              </Button>
                              <Button
                                variant="danger m-1"
                                onClick={() => {
                                  setDeleteId(project._id);
                                  deleteHandleShow();
                                }}
                              >
                                <i className="bi bi-trash">Delete</i>
                              </Button>
                            </div>
                          </Col>
                          <Col xs={12} xl={6} className="py-3 text-center">
                            {project.cover ? (
                              <Image
                                src={`http://localhost:5000/${project.cover}`}
                                alt="Avatar"
                                style={{
                                  maxHeight: "300px",
                                  maxWidth: "250px",
                                }}
                              />
                            ) : (
                              <Image
                                className="text-center"
                                src={mangaPic}
                                alt="character picture"
                                style={{
                                  maxHeight: "300px",
                                  maxWidth: "250px",
                                }}
                              />
                            )}
                          </Col>
                        </Row>
                      </Col>
                      <Col
                        xs={12}
                        md={6}
                        xl={4}
                        className="py-3 pe-2 d-flex justify-content-center align-items-center"
                      >
                        <p className='me-4 text-center'>{project.summary}</p>
                      </Col>
                    </Row>
                  </div>
              ))}
            <Col
              xs={12}
              className="pt-5 d-flex justify-content-center align-items-center"
            >
              <Button
                variant="primary text-center"
                size="lg"
                onClick={handleShow}
              >
                + Create New Project
              </Button>
            </Col>
          </Col>
        </Col>
      </Row>
      <CreateProjectModal
        handleClose={handleClose}
        showModal={showCreateProjectModal}
      />
      <DeleteProjectModal
        handleClose={deleteHandleClose}
        showModal={showDeleteProjectModal}
        id={deleteId}
        setUpdated={setUpdated}
      />
    </Container>
  );
}
