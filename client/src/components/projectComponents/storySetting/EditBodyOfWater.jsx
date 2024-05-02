import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Image from "react-bootstrap/esm/Image";
import DeleteBodyOfWaterModal from "./DeleteBodyOfWaterModal";

export default function EditBodyOfWater({
  _id,
  projectInfo,
  setViewNumber,
  currentBodyOfWaterId,
}) {
  const [files, setFiles] = useState("");
  const [name, setName] = useState(" ");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [pictures, setPictures] = useState([]);
  const [size, setSize] = useState("");
  const [wildlife, setWildlife] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleClose = () => setShowDeleteModal(false);
  const handleOpen = () => setShowDeleteModal(true);

  useEffect(() => {
    if (projectInfo._id) {
      projectInfo.setting.bodiesOfWater.forEach((water) => {
        if (currentBodyOfWaterId === water._id) {
          setName(water.name);
          setDescription(water.description);
          setLocation(water.location);
          setSize(water.size);
          setWildlife(water.wildlife);
        }
      });
    }
  }, [currentBodyOfWaterId, projectInfo._id]);

  async function updateBodyOfWater(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("name", name);
    data.set("location", location);
    data.set("wildlife", wildlife);
    data.set("description", description);
    data.set("size", size);
    data.set("id", _id);
    data.set("bodyOfWaterId", currentBodyOfWaterId);
    if (files?.[0]) {
      data.set("files", files?.[0]);
    }

    const response = await fetch("http://localhost:5000/updateBodyOfWater", {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      window.location.reload();
    }
  }

  return (
    <Col id="papyrus" xs={12} xxl={9}>
      <DeleteBodyOfWaterModal
        showModal={showDeleteModal}
        handleClose={handleClose}
        currentBodyOfWaterId={currentBodyOfWaterId}
        id={_id}
        setViewNumber={setViewNumber}
      />
      <div className="d-flex justify-content-between mt-4">
        <h5 className="mx-2">Bodies of Water</h5>
        <Button variant="primary" onClick={handleOpen}>
          <i class="bi bi-trash"></i> Delete Body of Water
        </Button>
      </div>
      <Container>
        <Row className="my-5">
          <Col xs={12}>
            <h1 className="my-5 text-center">{name}</h1>
            <div className="d-flex justify-content-center flex-wrap">
              {pictures[0] &&
                pictures.map((picture) => (
                  <Col xs={12} md={6} className="text-center">
                    <Image
                      src={`http://localhost:5000/${picture}`}
                      alt="Avatar"
                      style={{
                        height: "300px",
                        width: "70%",
                        borderRadius: "50%",
                      }}
                      className="mx-5"
                    />
                  </Col>
                ))}
            </div>
            <Form className="my-4" onSubmit={updateBodyOfWater}>
              <Form.Group className="mb-3">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={"Body of Water Name"}
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                />
                <Form.Text muted>Name of the country</Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Size:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={"Size"}
                  value={size}
                  onChange={(ev) => setSize(ev.target.value)}
                />
                <Form.Text muted>
                  How big is this Body of Water overall? Is it a small pond or
                  something as large as the Atlantic Ocean?
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="4"
                  max-rows="8"
                  placeholder={"Country location"}
                  value={location}
                  onChange={(ev) => setLocation(ev.target.value)}
                />
                <Form.Text muted>
                  Where is this body of water located in your story's universe?
                  What borders does it have?
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  max-rows="6"
                  placeholder={
                    '"The Dead Sea has a salt level content of 34.5%, making it uninhabitable for any creature, and that is why it is named the Dead Sea...."'
                  }
                  value={description}
                  onChange={(ev) => setDescription(ev.target.value)}
                />
                <Form.Text muted>
                  Give a description of the body of water here that would help
                  you picture its characteristics. Also list any key details
                  that that are specific and unique.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Wildlife:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  max-rows="6"
                  placeholder={"Wildlife"}
                  value={wildlife}
                  onChange={(ev) => setWildlife(ev.target.value)}
                />
                <Form.Text muted>
                  Describe the general wildlife of the body of water. What type
                  of animals/plants exist there, if at all?
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Pictures:</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(ev) => setFiles(ev.target.files)}
                />
                <Form.Text muted>
                  Upload any pictures or drawings that describes the above
                  information. To upload multiple files, hold CTRL or SHIFT
                  before clicking your pictures.
                </Form.Text>
              </Form.Group>
              <div className="text-center my-3">
                <Button variant="primary w-75 mt-4" size="lg" type="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
