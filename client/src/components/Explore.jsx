import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import CreateProjectModal from "./projectComponents/CreateProjectModal";
import { useState } from "react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function Explore() {
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");

  const handleClose = () => setShowCreateProjectModal(false);
  const handleShow = () => setShowCreateProjectModal(true);

  useEffect(() => {
    async function fetchProjects() {
      const response = await fetch("http://localhost:5000/getProjects", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const userProjects = await response.json();
        setProjects(userProjects);
      } else {
        console.log(response)
      }
    }

    fetchProjects();
  }, []);

  if (projectId) {
    return <Navigate to={`/project/${projectId}`} />;
  }

  return (
    <Col xs={12} xxl={10} id="explore-col">
      <Row style={{ background: "rgba(0, 0, 0, 0.7)", height: "100%" }}>
        <Col xs={12} xl={6} className="d-flex flex-column align-items-center">
          <div className="mx-5 mt-5 p-5 text-white text-center">
            <Button
              variant="outline-primary text-white mb-3"
              size="lg"
              onClick={handleShow}
            >
              Create New Project
            </Button>
            <p className="display-6">
              Begin writing your next screenwrite, novel, short story, or manga
            </p>
          </div>
        </Col>
        <Col xs={12} xl={6} className="d-flex justify-content-center">
          <div id="table-div" className="border border-white mt-5">
            <Table
  hover
  className="text-start bg-none"
  style={{ border: "none" }}
>
  <thead className="text-center display-6">
    <tr>
      <th
        style={{
          color: "white",
          borderBottom: "none",
        }}
      >
        Continue a saved project
      </th>
    </tr>
  </thead>
  <tbody>
    {projects.length > 0 ? (
      projects.map((project, index) => (
        <tr key={index}>
          <td>
            <Button
              variant="outline-primary w-100 text-white border-white"
              onClick={() => setProjectId(project._id)}
            >
              {project.title}
            </Button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="1">No projects available</td>
      </tr>
    )}
    <tr>
      <td className="text-start">
        <Button
          variant="outline-primary border-light text-white w-100"
          onClick={handleShow}
        >
          + Create New
        </Button>
      </td>
    </tr>
  </tbody>
</Table>
          </div>
        </Col>
        <Col xs={12} xl={6} className="d-flex justify-content-center">
          <div className="m-5 p-5 text-white text-center w-75">
            <Link to='/brainstorm'>
            <Button variant="outline-primary text-white mb-3" size="lg">
              Brainstorm
            </Button>
            </Link>
            <p className="display-6">
              Writer's block? Use the brainstorm feature to get back on track
            </p>
          </div>
        </Col>
        <Col xs={12} xl={6} className="d-flex justify-content-center">
          <div className="m-5 p-5 text-white text-center w-75">
            <Link to="/notes">
              <Button variant="outline-primary text-white mb-3" size="lg">
                Notes
              </Button> 
            </Link>
            <p className="display-6">
              Jot your daily thoughts in your notes to help develop new stories
              and ideas
            </p>
          </div>
        </Col>
      </Row>
      <CreateProjectModal
        handleClose={handleClose}
        showModal={showCreateProjectModal}
      />
    </Col>
  );
}
