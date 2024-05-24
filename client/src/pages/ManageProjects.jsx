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
      <Container>
        <Row>
          <h1 className="my-5 text-center">My Projects</h1>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}
