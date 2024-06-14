import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Sidebar from "../components/Sidebar";
import Button from "react-bootstrap/Button";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import Image from "react-bootstrap/Image";
import avatar from "../cssImages/blankAvatar.png";
import instagram from "../cssImages/icons/instagram.png";
import facebook from "../cssImages/icons/facebook.png";
import pinterest from "../cssImages/icons/pinterest.png";
import twitter from "../cssImages/icons/twitter.png";
import tiktok from "../cssImages/icons/tiktok.png";

export default function ProfilePage() {
  const initialUserData = {
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
  };

  const [userData, setUserData] = useState(initialUserData);

  return (
    <Container fluid>
      <Header />
      <Row>
        <Sidebar />
        <Col xs={12} xxl={10} id="profile-background">
          <h1 className="my-5 text-center">Profile</h1>
          <div className="m-2">
            {userData.profilePicture ? (
              <Image
                src={`http://localhost:5000/${userData.profilePicture}`}
                alt="Avatar"
                style={{ height: "100px", borderRadius: "60%" }}
              />
            ) : (
              <Image
                src={avatar}
                alt="Avatar"
                style={{ height: "100px", borderRadius: "60%" }}
              />
            )}
            <h2 className="my-1">{userData.name}</h2>
            <p>{userData.bio}</p>
            <h4 className="my-4 mt-5">
              Writing Experience: {userData.experience}
            </h4>
            <h4 className="my-4">Writing Goals:<br/> {userData.goals}</h4>
            <h4 className="my-4">
              Favorite Authors:<br/> {userData.favoriteAuthors}
            </h4>
            <h4 className="my-4">Favorite Books:<br/> {userData.favoriteBooks}</h4>
            <h4 className="my-4">Favorite Genre:<br/> {userData.favoriteGenre}</h4>
            <div className='text-center' style={{marginTop: '150px'}}>
              <h5>My Links</h5>
              <a href={userData.socialMediaLinks.instagram}><Image src={instagram} className="m-4 mb-5" width="20px" /></a>
              <a href={userData.socialMediaLinks.facebook}><Image src={facebook} className="m-4 mb-5" width="20px" /></a>
              <a href={userData.socialMediaLinks.pinterest}><Image src={pinterest} className="m-4 mb-5" width="20px" /></a>
              <a href={userData.socialMediaLinks.twitter}><Image src={twitter} className="m-4 mb-5" width="20px" /></a>
              <a href={userData.socialMediaLinks.tiktok}><Image src={tiktok} className="m-4 mb-5" width="20px" /></a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
