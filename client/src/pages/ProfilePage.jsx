import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Sidebar from "../components/Sidebar";
import Button from "react-bootstrap/Button";
import Header from "../components/Header";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const initialUserData = {
    email: "",
    username: "",
    name: "",
    profilePicture: "",
    age: 0,
    bio: "",
    experience: "",
    favoriteBooks: "",
    favoriteAuthors: "",
    goals: "",
    preferredGenre: "",
    socialMediaLinks: {
      facebook: "",
      instagram: "",
      tiktok: "",
      pinterest: "",
      twitter: "",
    },
  };

  const [userData, setUserData] = useState(initialUserData);

  return (
    <Container fluid>
      <Header />
      <Row>
        <Sidebar />
        <Col xs={12} xxl={10}>
          <h1 className="my-5 text-center">Profile</h1>
        </Col>
      </Row>
    </Container>
  );
}
