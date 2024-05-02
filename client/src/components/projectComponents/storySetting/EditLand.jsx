import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import DeleteLandModal from "./DeleteLandModal";


export default function EditLands({
  projectInfo,
  setViewNumber,
  _id,
  currentLandId,
}) {
  const [files, setFiles] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [terrain, setTerrain] = useState("");
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState("");
  const [wildlife, setWildlife] = useState("");
  const [pictures, setPictures] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleClose = () => setShowDeleteModal(false);
  const handleOpen = () => setShowDeleteModal(true);

  useEffect(() => {
    if (projectInfo._id) {
      projectInfo.setting.lands.forEach((land) => {
        if (currentLandId === land._id) {
          setName(land.name);
          setDescription(land.description);
          setTerrain(land.terrain);
          setLocation(land.location);
          setPictures(land.pictures);
          setWeather(land.weather);
          setWildlife(land.wildlife);
        }
      });
    }
  }, [currentLandId, projectInfo._id]);
  
  async function updateLand(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("name", name);
    data.set("description", description);
    data.set("terrain", terrain);
    data.set("location", location);
    data.set("weather", weather);
    data.set("wildlife", wildlife);
    data.set("landId", currentLandId);
    data.set("id", _id);
    if (files?.[0]) {
      data.set("files", files?.[0]);
    }
    const response = await fetch("http://localhost:5000/updateLand", {
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
      <DeleteLandModal showModal={showDeleteModal}
        handleClose={handleClose}
        currentLandId={currentLandId}
        id={_id}
        setViewNumber={setViewNumber}
        />
      <div className="d-flex justify-content-between mt-4">
        <h5 className="mx-2">Lands & Areas</h5>
        <Button variant="primary" onClick={handleOpen}>
          <i class="bi bi-trash"></i> Delete Land
        </Button>
      </div>
      <Container>
        <Row className="my-5">
          <Col xs={12}>
            <h1 className="my-5 text-center">{name}</h1>
            <div className="d-flex justify-content-center justify-content-space between flex-wrap">
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
            <Form className="my-4" onSubmit={updateLand}>
              <Form.Group className="mb-3">
                <Form.Label>Name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={"Land Name"}
                  value={name}
                  onChange={(ev) => setName(ev.target.value)}
                />
                <Form.Text muted>Name of the country</Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="5"
                  max-rows="16"
                  placeholder={"Description"}
                  value={description}
                  onChange={(ev) => setDescription(ev.target.value)}
                />
                <Form.Text muted>
                  What is the capital city of the country?
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Terrain:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="4"
                  max-rows="8"
                  placeholder={"Terrain"}
                  value={terrain}
                  onChange={(ev) => setTerrain(ev.target.value)}
                />
                <Form.Text muted>
                  What is the population of the country?
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
                  If someone were to ask you where in your story's universe this
                  country is located, how would you tell them where it is? Give
                  a description showing that.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Weather:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  max-rows="6"
                  placeholder={"Weather"}
                  value={weather}
                  onChange={(ev) => setWeather(ev.target.value)}
                />
                <Form.Text muted>
                  Describe the general weather of the country. Is it tropical?
                  Rainy? Cold? Does the area experience four seasons?
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
                  Describe the general wildlife of the country. What type of
                  animals/plants exist there, if at all?
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
