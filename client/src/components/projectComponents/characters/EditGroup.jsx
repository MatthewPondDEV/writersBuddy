import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import lionPic from "../../../cssImages/Lion-pride.jpg";
import avatarLogo from "../../../cssImages/blankAvatar.png";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import DeleteGroupModal from "./DeleteGroupModal";

export default function EditGroup({
  projectInfo,
  setViewNumber,
  _id,
  currentGroupId,
  setIsUpdated
}) {
  const serverRoute = import.meta.env.VITE_MAIN_API_ROUTE
  const [files, setFiles] = useState("");
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [capital, setCapital] = useState("");
  const [connections, setConnections] = useState("");
  const [description, setDescription] = useState("");
  const [established, setEstablished] = useState(new Date());
  const [location, setLocation] = useState("");
  const [notableMembers, setNotableMembers] = useState("");
  const [pictures, setPictures] = useState([]);
  const [size, setSize] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleClose = () => setShowDeleteModal(false);
  const handleOpen = () => setShowDeleteModal(true);

  useEffect(() => {
    if (projectInfo?.groups) {
      const group = projectInfo.groups.find(g => g._id === currentGroupId);
      
      if (group) {
        setName(group.name || '');
        setBusiness(group.business || '');
        setCapital(group.capital || ''); 
        setConnections(group.connections || '');
        setDescription(group.description || '');
        setEstablished(
          group.established ? dayjs(group.established).add(1, 'day') : dayjs()
        );
        setLocation(group.location || '');
        setNotableMembers(group.notableMembers || '');
        setPictures(group.pictures || []);
        setSize(group.size || 0); // Assuming size is a number
      }
    }
  }, [currentGroupId, projectInfo]);

    async function uploadPicture(ev) {
    ev.preventDefault();
    if (files?.[0]) {
      const response = await fetch(`${serverRoute}/s3url`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const url = await response.json();
        const bucketUpload = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: files?.[0],
        });
        if (bucketUpload.ok) {
          const imageURL = url.split("?")[0];
          setPictures((prev) => [...prev, imageURL]);
          updateGroup(imageURL);
        }
      }
    } else {
      updateGroup();
    }
  }

async function updateGroup(imageURL) {

  // Create a JavaScript object with the data
  const payload = {
    name: name,
    business: business,
    capital: capital,
    connections: connections,
    description: description,
    established: established,
    location: location,
    notableMembers: notableMembers,
    size: size,
    id: _id,
    groupId: currentGroupId,
    picture: imageURL ? imageURL : null
  };

  // Convert the object to a JSON string
  const response = await fetch(`${serverRoute}/updateGroup`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"  // Set the Content-Type header to application/json
    },
    body: JSON.stringify(payload),  // Send the JSON payload as a string
    credentials: "include"  // Include credentials if needed
  });

  if (response.ok) {
    setIsUpdated(false);
  }
}

  return (
    <Col id="papyrus" xs={12} xxl={9}>
      <DeleteGroupModal
        showModal={showDeleteModal}
        handleClose={handleClose}
        currentGroupId={currentGroupId}
        id={_id}
        setViewNumber={setViewNumber}
      />
      <div className="d-flex justify-content-between mt-4">
        <h5 className="mx-2">Groups & Organizations</h5>
        <Button variant="primary" onClick={handleOpen}>
          <i className="bi bi-trash"></i> Delete Group
        </Button>
      </div>
      <Container>
        <Row className="my-5">
          <Col xs={12}>
            <h1 className="my-5 text-center">{name}</h1>
            <div className="d-flex justify-content-center flex-wrap">
              {pictures[0] ? (
                pictures.map((picture) => (
                  <Col key={picture} xs={12} md={6} className="text-center">
                    <Image
                      src={picture}
                      alt="Avatar"
                      style={{
                        height: "300px",
                        width: "70%",
                        borderRadius: "50%",
                      }}
                      className="mx-5"
                    />
                  </Col>
                ))
              ) : (
                <Image
                  className="text-center"
                  src={lionPic}
                  alt="character picture"
                  style={{ height: "300px", borderRadius: "60%" }}
                />
              )}
            </div>
            <Form className="my-5" onSubmit={uploadPicture}>
              <Row>
                <h1 className="my-3">Basic Info</h1>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Group Name"}
                      value={name}
                      onChange={(ev) => setName(ev.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Business:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Business"}
                      value={business}
                      onChange={(ev) => setBusiness(ev.target.value)}
                    />
                    <Form.Text muted>Describe the group's business.</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Capital:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Capital"}
                      value={capital}
                      onChange={(ev) => setCapital(ev.target.value)}
                    />
                    <Form.Text muted>Specify the group's capital.</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Connections:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Connections"}
                      value={connections}
                      onChange={(ev) => setConnections(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the group's connections.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      placeholder={"Description"}
                      value={description}
                      onChange={(ev) => setDescription(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the group in more detail.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Established:
                      <h5 className="d-inline ms-1">
                        {established &&
                          dayjs(established).format("MMM DD, YYYY")}
                      </h5>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={established}
                      onChange={(ev) => setEstablished(ev.target.value)}
                    />
                    <Form.Text muted>
                      Specify when the group was established.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Location:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Location"}
                      value={location}
                      onChange={(ev) => setLocation(ev.target.value)}
                    />
                    <Form.Text muted>Specify the group's location.</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Notable Members:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Notable Members"}
                      value={notableMembers}
                      onChange={(ev) => setNotableMembers(ev.target.value)}
                    />
                    <Form.Text muted>
                      Specify any notable members of the group.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Size:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Size"}
                      value={size}
                      onChange={(ev) => setSize(ev.target.value)}
                    />
                    <Form.Text muted>Specify the size of the group.</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Picture:</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(ev) => setFiles(ev.target.files)}
                    />
                    <Form.Text muted>Upload a picture of the group.</Form.Text>
                  </Form.Group>
                </Col>
                <div className="text-center my-3">
                  <Button variant="primary w-75 mt-4" size="lg" type="submit">
                    Save Changes
                  </Button>
                </div>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
