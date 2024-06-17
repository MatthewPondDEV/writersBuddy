import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Sidebar from "../components/Sidebar";
import Button from "react-bootstrap/Button";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import avatar from "../cssImages/blankAvatar.png";
import instagram from "../cssImages/icons/instagram.png";
import facebook from "../cssImages/icons/facebook.png";
import pinterest from "../cssImages/icons/pinterest.png";
import twitter from "../cssImages/icons/twitter.png";
import tiktok from "../cssImages/icons/tiktok.png";

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    user_id: "",
    name: "",
    profilePicture: "",
    bio: "",
    experience: "",
    favoriteBooks: "",
    favoriteAuthors: "",
    favoriteGenre: "",
    goals: "",
    socialMediaLinks: {
      facebook: "",
      instagram: "",
      tiktok: "",
      pinterest: "",
      twitter: "",
    },
  });
  const [files, setFiles] = useState("");
  const [showEdit, setShowEdit] = useState(true);

  // Handler to update userDataEdited when any input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the input field is in socialMediaLinks, update it nested
    if (name.startsWith("socialMediaLinks.")) {
      const socialMediaField = name.split(".")[1];
      setUserData({
        ...userData,
        socialMediaLinks: {
          ...userData.socialMediaLinks,
          [socialMediaField]: value,
        },
      });
    } else {
      setUserData({
        ...userData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("user_id", userData.user_id);
    data.set("name", userDataEdited.name);
    data.set("files", files?.[0])
    data.set("bio", userData.bio);
    data.set("experience", userData.experience);
    data.set("favoriteBooks", userData.favoriteBooks);
    data.set("favoriteAuthors", userData.favoriteAuthors);
    data.set("favoriteGenre", userData.favoriteGenre);
    data.set("goals", userData.goals);
    data.set("socialMediaLinks.instagram", userData.socialMediaLinks.instagram);
    data.set("socialMediaLinks.facebook", userData.socialMediaLinks.facebook);
    data.set("socialMediaLinks.pinterest", userData.socialMediaLinks.pinterest);
    data.set("socialMediaLinks.twitter", userData.socialMediaLinks.twitter);
    data.set("socialMediaLinks.tiktok", userData.socialMediaLinks.tiktok);

    const response = await fetch("http://localhost:5000/updateProfileInfo", {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      window.location.reload();
    }
  };

  return (
    <>
      <Container fluid>
        <Header />
        <Row id="profile-background">
          <Sidebar />
          {!showEdit ? (
            <Col xs={12} xxl={10}>
              <h1 className="mt-5 mx-1">Profile</h1>
              <div className="m-3 mb-5">
                {userData.profilePicture ? (
                  <Image
                    src={`http://localhost:5000/${userData.profilePicture}`}
                    alt="Avatar"
                    className="mt-5"
                    style={{ height: "100px", borderRadius: "60%" }}
                  />
                ) : (
                  <Image
                    src={avatar}
                    alt="Avatar"
                    className="mt-5"
                    style={{ height: "100px", borderRadius: "60%" }}
                  />
                )}
                <h2 className="my-1">{userData.name}</h2>
                <p>{userData.bio}</p>
                <a href={userData.socialMediaLinks.instagram}>
                  <Image src={instagram} className="me-4" width="20px" />
                </a>
                <a href={userData.socialMediaLinks.facebook}>
                  <Image src={facebook} className="mx-4" width="20px" />
                </a>
                <a href={userData.socialMediaLinks.pinterest}>
                  <Image src={pinterest} className="mx-4" width="20px" />
                </a>
                <a href={userData.socialMediaLinks.twitter}>
                  <Image src={twitter} className="mx-4" width="20px" />
                </a>
                <a href={userData.socialMediaLinks.tiktok}>
                  <Image src={tiktok} className="mx-4" width="20px" />
                </a>
                <h4 className="my-4">
                  Writing Experience: {userData.experience}
                </h4>
                <h4 className="my-4">
                  Writing Goals:
                  <br /> {userData.goals}
                </h4>
                <h4 className="my-4">
                  Favorite Authors:
                  <br /> {userData.favoriteAuthors}
                </h4>
                <h4 className="my-4">
                  Favorite Books:
                  <br /> {userData.favoriteBooks}
                </h4>
                <h4 className="my-4">
                  Favorite Genre:
                  <br /> {userData.favoriteGenre}
                </h4>
              </div>
            </Col>
          ) : (
            <>
              <Col xs={12} lg={6} xxl={5}>
                <h1 className="mt-5 mx-1">Profile</h1>
                <div className="m-3 mb-5 pe-3">
                  <h2 className="mt-5">{userData.name}</h2>
                  {userData.profilePicture ? (
                    <Image
                      src={`http://localhost:5000/${userData.profilePicture}`}
                      alt="Avatar"
                      className="mt-2"
                      style={{ height: "100px", borderRadius: "60%" }}
                    />
                  ) : (
                    <Image
                      src={avatar}
                      alt="Avatar"
                      className="mt-2"
                      style={{ height: "100px", borderRadius: "60%" }}
                    />
                  )}
                  <p>{userData.bio}</p>
                  <a href={userData.socialMediaLinks.instagram}>
                    <Image src={instagram} className="me-4 mb-4" width="20px" />
                  </a>
                  <a href={userData.socialMediaLinks.facebook}>
                    <Image src={facebook} className="mx-4 mb-4" width="20px" />
                  </a>
                  <a href={userData.socialMediaLinks.pinterest}>
                    <Image src={pinterest} className="mx-4 mb-4" width="20px" />
                  </a>
                  <a href={userData.socialMediaLinks.twitter}>
                    <Image src={twitter} className="mx-4 mb-4" width="20px" />
                  </a>
                  <a href={userData.socialMediaLinks.tiktok}>
                    <Image src={tiktok} className="mx-4 mb-4" width="20px" />
                  </a>
                  <h4 className="my-4">
                    Writing Experience: {userData.experience}
                  </h4>
                  <h4 className="my-4">
                    Writing Goals:
                    <br /> {userData.goals}
                  </h4>
                  <h4 className="my-4">
                    Favorite Authors:
                    <br /> {userData.favoriteAuthors}
                  </h4>
                  <h4 className="my-4">
                    Favorite Books:
                    <br /> {userData.favoriteBooks}
                  </h4>
                  <h4 className="my-4">
                    Favorite Genre:
                    <br /> {userData.favoriteGenre}
                  </h4>
                </div>
              </Col>
              <Col className="pe-4">
                <h1 className="mx-1 mt-5">Edit Profile</h1>
                <Form className="my-5 mx-3 me-5">
                  <Form.Group className="mb-3">
                    <Form.Label>Name: </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Your name here"
                      name="name"
                      value={userData.name}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Profile Picture: </Form.Label>
                    <Form.Control
                      type="file"
                      value={userData.profilePicture}
                      onChange={(e) => setFiles(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Bio: </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows='5'
                      placeholder="Your bio here"
                      name="bio"
                      value={userData.bio}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Experience: </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Your experience here"
                      name="experience"
                      value={userData.experience}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Favorite Books: </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Your favorite books"
                      name="favoriteBooks"
                      value={userData.favoriteBooks}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Favorite Authors: </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Your favorite authors"
                      name="favoriteAuthors"
                      value={userData.favoriteAuthors}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Favorite Genre: </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Your favorite genre"
                      name="favoriteGenre"
                      value={userData.favoriteGenre}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Goals: </Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Your goals here"
                      name="goals"
                      value={userData.goals}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Social Links: </Form.Label>
                    <Form.Text
                      muted
                      style={{
                        display: "block",
                        marginTop: "0",
                        marginBottom: "10px",
                      }}
                    >
                      Paste the links to your social media accounts here
                    </Form.Text>
                    <Form.Control
                      type="text"
                      placeholder="Instagram Link"
                      name="socialMediaLinks.instagram"
                      value={userData.socialMediaLinks.instagram}
                      onChange={(e) => handleChange(e)}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Facebook Link"
                      name="socialMediaLinks.facebook"
                      value={userData.socialMediaLinks.facebook}
                      onChange={(e) => handleChange(e)}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Pinterest Link"
                      name="socialMediaLinks.pinterest"
                      value={userData.socialMediaLinks.pinterest}
                      onChange={(e) => handleChange(e)}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Twitter Link"
                      name="socialMediaLinks.twitter"
                      value={userData.socialMediaLinks.twitter}
                      onChange={(e) => handleChange(e)}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Tiktok Link"
                      name="socialMediaLinks.tiktok"
                      value={userData.socialMediaLinks.tiktok}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </Form>
              </Col>
            </>
          )}
        </Row>
      </Container>
    </>
  );
}
