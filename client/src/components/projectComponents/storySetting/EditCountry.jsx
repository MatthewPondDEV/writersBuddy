import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import Image from "react-bootstrap/Image";
import DeleteCountryModal from "./DeleteCountryModal";
import { set } from "mongoose";

export default function EditCountry({
  projectInfo,
  setViewNumber,
  currentCountryId,
  _id,
  setIsUpdated
}) {
  const serverRoute = import.meta.env.VITE_MAIN_API_ROUTE
  const [loadData, setLoadData] = useState(false);
  const [files, setFiles] = useState("");
  const [name, setName] = useState(" ");
  const [borders, setBorders] = useState(" ");
  const [capital, setCapital] = useState(" ");
  const [culture, setCulture] = useState(" ");
  const [economy, setEconomy] = useState(" ");
  const [food, setFood] = useState(" ");
  const [location, setLocation] = useState(" ");
  const [population, setPopulation] = useState(" ");
  const [pictures, setPictures] = useState([]);
  const [weather, setWeather] = useState(" ");
  const [wildlife, setWildlife] = useState(" ");
  const [cities, setCities] = useState([
    {
      name: "City 1",
      architecture: "",
      characteristics: "",
      crime: "",
      culture: "",
      economy: "",
      food: "",
      location: "",
      population: "",
      province: "",
      size: "",
      technology: "",
      terrain: "",
      weather: "",
      wildlife: "",
    },
  ]);

  const [landmarks, setLandmarks] = useState([
    {
      name: "Landmark 1",
      description: "",
      location: "",
      picture: "",
    },
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleClose = () => setShowDeleteModal(false);
  const handleOpen = () => setShowDeleteModal(true);

  useEffect(() => {
    if (projectInfo?.setting?.countries) {
      const country = projectInfo.setting.countries.find(c => c._id === currentCountryId);
      
      if (country) {
        setName(country.name || '');
        setBorders(country.borders || '');
        setCapital(country.capital || '');
        setCities(country.cities || []);
        setLandmarks(country.landmarks || []);
        setCulture(country.culture || '');
        setEconomy(country.economy || '');
        setFood(country.food || '');
        setLocation(country.location || '');
        setPictures(country.pictures || []);
        setPopulation(country.population || '');
        setWeather(country.weather || '');
        setWildlife(country.wildlife || '');
        setLoadData(true)
      }
    }
  }, [currentCountryId, projectInfo]);

  async function uploadPicture(ev) {
    ev.preventDefault();
      if (files?.[0]) {
      const response = await fetch(`${serverRoute}/s3url`, {
        method: 'GET',
        credentials: 'include'
      })
      if (response.ok) {
       const url = await response.json()
       const bucketUpload = await fetch(url, {
        method: 'PUT',
        headers: {
          "Content-Type": 'multipart/form-data'
        },
        body: files?.[0]
       })
       if (bucketUpload.ok) {
          const imageURL = url.split('?')[0]
          setPictures((prev) => [...prev, imageURL]);
          updateCountry(imageURL)
       }
      }
    } else {
    updateCountry()
    }
  }



async function updateCountry(imageURL) {

    // Create a JavaScript object with the data
    const data = {
        name: name,
        borders: borders,
        capital: capital,
        cities: JSON.stringify(cities), // Convert arrays/objects to JSON strings
        landmarks: JSON.stringify(landmarks),
        culture: culture,
        economy: economy,
        food: food,
        location: location,
        population: population,
        weather: weather,
        wildlife: wildlife,
        countryId: currentCountryId,
        id: _id,
        picture: imageURL ? imageURL : null
    };

    // Convert the object to a JSON string
    const jsonData = JSON.stringify(data);

    // Perform the fetch request
    const response = await fetch(`${serverRoute}/updateCountry`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData,
        credentials: 'include',
    });

    // Check if the request was successful
    if (response.ok) {
        setLoadData(false)
        setIsUpdated(false)
    } else {
        // Handle the error if the response is not OK
        console.error('Failed to update country:', response.statusText);
    }
}

  const handleCityChange = (cityIndex, field, value) => {
    setCities((prevCities) => {
      const newCities = [...prevCities];
      newCities[cityIndex] = {
        ...newCities[cityIndex],
        [field]: value,
      };
      return newCities;
    });
  };
  const addNewCity = () => {
    setCities((prevCities) => [
      ...prevCities,
      {
        name: "New City",
        architecture: "",
        characteristics: "",
        crime: "",
        culture: "",
        economy: "",
        food: "",
        location: "",
        population: "",
        province: "",
        size: "",
        technology: "",
        terrain: "",
        weather: "",
        wildlife: "",
      },
    ]);
  };

  const deleteCity = (cityIndex) => {
    setCities((prevCities) =>
      prevCities.filter((_, index) => index !== cityIndex)
    );
  };

  const handleLandmarkChange = (landmarkIndex, field, value) => {
    setLandmarks((prevLandmarks) => {
      const newLandmarks = [...prevLandmarks];
      newLandmarks[landmarkIndex] = {
        ...newLandmarks[landmarkIndex],
        [field]: value,
      };
      return newLandmarks;
    });
  };

  const addNewLandmark = () => {
    setLandmarks((prevLandmarks) => [
      ...prevLandmarks,
      {
        name: "New Landmark",
        description: "",
        location: "",
        picture: "",
      },
    ]);
  };

  const deleteLandmark = (landmarkIndex) => {
    setLandmarks((prevLandmarks) =>
      prevLandmarks.filter((_, index) => index !== landmarkIndex)
    );
  };

  return (
    <Col id="papyrus" xs={12} xxl={9}>
      <DeleteCountryModal
        showModal={showDeleteModal}
        handleClose={handleClose}
        currentCountryId={currentCountryId}
        id={_id}
        setViewNumber={setViewNumber}
      />
      <div className="d-flex justify-content-between mt-4">
        <h5 className="mx-2">Countries</h5>
        <Button variant="primary" onClick={handleOpen}>
          <i className="bi bi-trash"></i> Delete Country
        </Button>
      </div>
      <Container>
        <Row className="my-5">
          <Col xs={12}>
            <h1 className="my-5 text-center">{name}</h1>
            <div className="d-flex justify-content-center flex-wrap">
              {pictures[0] &&
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
                ))}
            </div>
            <Form className="my-4" onSubmit={uploadPicture}>
              <Row>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Country Name"}
                      value={name}
                      onChange={(ev) => setName(ev.target.value)}
                    />
                    <Form.Text muted>Name of the country</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Capital City:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Capital City"}
                      value={capital}
                      onChange={(ev) => setCapital(ev.target.value)}
                    />
                    <Form.Text muted>
                      What is the capital city of the country?
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Population:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Population"}
                      value={population}
                      onChange={(ev) => setPopulation(ev.target.value)}
                    />
                    <Form.Text muted>
                      What is the population of the country?
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Bordering Lands/Waters:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="2"
                      max-rows="4"
                      placeholder={"Bordering lands or waters"}
                      value={borders}
                      onChange={(ev) => setBorders(ev.target.value)}
                    />
                    <Form.Text muted>
                      What are the borders of this country? Describe in terms of
                      North, South, East, and West. Is the country bordering
                      bodies of water or other lands?
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
                      If someone were to ask you where in your story's universe
                      this country is located, how would you tell them where it
                      is? Give a description showing that.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Culture:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      max-rows="8"
                      placeholder={"Culture"}
                      value={culture}
                      onChange={(ev) => setCulture(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the culture of the country. How do people
                      normally dress? What is their music like?
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Economy:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="5"
                      max-rows="10"
                      placeholder={"Country Economy"}
                      value={economy}
                      onChange={(ev) => setEconomy(ev.target.value)}
                    />
                    <Form.Text muted>
                      What is the state of this country's economy? How do people
                      mainly make their money? Is wealth disperse or held by one
                      entity or person? Is their a cash system or digital
                      currency? Or even a barter system? Describe how money
                      generally flows in and out of this country and how
                      boisterous or stagnant it is.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Food:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="6"
                      max-rows="12"
                      placeholder={"Country's Food"}
                      value={food}
                      onChange={(ev) => setFood(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the food in the country? Is it very different
                      from area to area within the country? What plants and
                      vegetables grow there and are popular? Any delicacies?
                      What animals do people mainly eat, if at all? Do people
                      eat with their hands, chopsticks, forks, etc...?
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
                      Describe the general weather of the country. Is it
                      tropical? Rainy? Cold? Does the area experience four
                      seasons?
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
                </Col>
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
                <Col xs={12} md={6} className="mt-4">
                  <h2>Cities</h2>
                  <Accordion
                    className="border-bottom border-top border-dark"
                    flush
                  >
                    {cities.length > 0 &&
                      cities.map((city, cityIndex) => (
                        <Accordion.Item
                          key={cityIndex}
                          eventKey={cityIndex.toString()}
                          className="border-bottom"
                        >
                          <Accordion.Header>{city.name}</Accordion.Header>
                          <Accordion.Body className="border-top">
                            <div className="text-end">
                              <Button
                                variant="primary mb-2"
                                onClick={() => deleteCity(cityIndex)}
                              >
                                <i className="bi bi-trash"></i> Delete City
                              </Button>
                            </div>
                            {/* City Name */}
                            <Form.Group className="mb-3">
                              <Form.Label>Name:</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder=""
                                value={city.name}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "name",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>Name of the city</Form.Text>
                            </Form.Group>

                            {/* Province */}
                            <Form.Group className="mb-3">
                              <Form.Label>Province:</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder=""
                                value={city.province}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "province",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>
                                What province is this city located
                              </Form.Text>
                            </Form.Group>

                            {/* Population */}
                            <Form.Group className="mb-3">
                              <Form.Label>Population:</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder=""
                                value={city.population}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "population",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>City population</Form.Text>
                            </Form.Group>

                            {/* Size */}
                            <Form.Group className="mb-3">
                              <Form.Label>Size:</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder=""
                                value={city.size}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "size",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>Size of the city</Form.Text>
                            </Form.Group>

                            {/* Location */}
                            <Form.Group className="mb-3">
                              <Form.Label>Location:</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder=""
                                value={city.location}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "location",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>
                                Geographical location of the city
                              </Form.Text>
                            </Form.Group>

                            {/* Architecture */}
                            <Form.Group className="mb-3">
                              <Form.Label>Architecture:</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows="3"
                                placeholder=""
                                value={city.architecture}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "architecture",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>
                                Architectural style of the city
                              </Form.Text>
                            </Form.Group>

                            {/* Characteristics */}
                            <Form.Group className="mb-3">
                              <Form.Label>Characteristics:</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows="4"
                                placeholder=""
                                value={city.characteristics}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "characteristics",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>
                                Key characteristics of the city. What is the
                                quality of life in this city? Add any
                                miscellaneous details here as well.
                              </Form.Text>
                            </Form.Group>

                            {/* Culture */}
                            <Form.Group className="mb-3">
                              <Form.Label>Culture:</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows="4"
                                placeholder=""
                                value={city.culture}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "culture",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>
                                Cultural aspects of the city
                              </Form.Text>
                            </Form.Group>

                            {/* Crime */}
                            <Form.Group className="mb-3">
                              <Form.Label>Crime:</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows="3"
                                placeholder=""
                                value={city.crime}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "crime",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>
                                Crime rate in the city
                              </Form.Text>
                            </Form.Group>

                            {/* Food */}
                            <Form.Group className="mb-3">
                              <Form.Label>Food:</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows="3"
                                placeholder=""
                                value={city.food}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "food",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>
                                Food culture in the city
                              </Form.Text>
                            </Form.Group>

                            {/* Economy */}
                            <Form.Group className="mb-3">
                              <Form.Label>Economy:</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows="3"
                                placeholder=""
                                value={city.economy}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "economy",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>
                                Economic factors of the city
                              </Form.Text>
                            </Form.Group>

                            {/* Technology */}
                            <Form.Group className="mb-3">
                              <Form.Label>Technology:</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows="3"
                                placeholder=""
                                value={city.technology}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "technology",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>
                                Technological aspects of the city
                              </Form.Text>
                            </Form.Group>

                            {/* Wildlife */}
                            <Form.Group className="mb-3">
                              <Form.Label>Wildlife:</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows="3"
                                placeholder=""
                                value={city.wildlife}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "wildlife",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>Wildlife in the city</Form.Text>
                            </Form.Group>

                            {/* Terrain */}
                            <Form.Group className="mb-3">
                              <Form.Label>Terrain:</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows="3"
                                placeholder=""
                                value={city.terrain}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "terrain",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>Terrain of the city</Form.Text>
                            </Form.Group>

                            {/* Weather */}
                            <Form.Group className="mb-3">
                              <Form.Label>Weather:</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows="3"
                                placeholder=""
                                value={city.weather}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "weather",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>
                                Typical weather conditions
                              </Form.Text>
                            </Form.Group>

                            {/* Wildlife */}
                            <Form.Group className="mb-3">
                              <Form.Label>Wildlife:</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows="3"
                                placeholder=""
                                value={city.wildlife}
                                onChange={(ev) =>
                                  handleCityChange(
                                    cityIndex,
                                    "wildlife",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>Wildlife in the city</Form.Text>
                            </Form.Group>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                  </Accordion>
                  <Button variant="primary my-3" onClick={addNewCity}>
                    + Add New City
                  </Button>
                </Col>
                <Col xs={12} md={6} className="mt-4">
                  <h2>Landmarks</h2>
                  <Accordion
                    className="border-bottom border-top border-dark"
                    flush
                  >
                    {landmarks.length > 0 &&
                      landmarks.map((landmark, landmarkIndex) => (
                        <Accordion.Item
                          key={landmarkIndex}
                          eventKey={landmarkIndex.toString()}
                          className="border-bottom"
                        >
                          <Accordion.Header>{landmark.name}</Accordion.Header>
                          <Accordion.Body>
                            <div className="text-end">
                              <Button
                                variant="primary mb-2"
                                onClick={() => deleteLandmark(landmarkIndex)}
                              >
                                <i className="bi bi-trash"></i> Delete Landmark
                              </Button>
                            </div>
                            {/* Landmark Name */}
                            <Form.Group className="mb-3">
                              <Form.Label>Name:</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder=""
                                value={landmark.name}
                                onChange={(ev) =>
                                  handleLandmarkChange(
                                    landmarkIndex,
                                    "name",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>Name of the landmark</Form.Text>
                            </Form.Group>

                            {/* Landmark Description */}
                            <Form.Group className="mb-3">
                              <Form.Label>Description:</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows="4"
                                placeholder=""
                                value={landmark.description}
                                onChange={(ev) =>
                                  handleLandmarkChange(
                                    landmarkIndex,
                                    "description",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>
                                Description of the landmark
                              </Form.Text>
                            </Form.Group>

                            {/* Landmark Location */}
                            <Form.Group className="mb-3">
                              <Form.Label>Location:</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder=""
                                value={landmark.location}
                                onChange={(ev) =>
                                  handleLandmarkChange(
                                    landmarkIndex,
                                    "location",
                                    ev.target.value
                                  )
                                }
                              />
                              <Form.Text muted>
                                Location of the landmark
                              </Form.Text>
                            </Form.Group>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                  </Accordion>
                  <Button variant="primary my-3" onClick={addNewLandmark}>
                    + Add New Landmark
                  </Button>
                </Col>
              </Row>
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
