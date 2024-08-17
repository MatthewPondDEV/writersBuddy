import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import avatarLogo from "../../../cssImages/blankAvatar.png";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import DeleteCharacterModal from "./DeleteCharacterModal";

export default function EditCharacter({
  projectInfo,
  setViewNumber,
  _id,
  currentCharacterId,
}) {
  const serverRoute = import.meta.env.VITE_MAIN_API_ROUTE
  const [files, setFiles] = useState("");
  const [name, setName] = useState(" ");
  const [abilities, setAbilities] = useState("");
  const [birthDate, setBirthDate] = useState(Date);
  const [birthPlace, setBirthPlace] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [clothes, setClothes] = useState("");
  const [characterType, setCharacterType] = useState("");
  const [childhood, setChildhood] = useState("");
  const [criminalRecord, setCriminalRecord] = useState("");
  const [development, setDevelopment] = useState("");
  const [dreams, setDreams] = useState("");
  const [education, setEducation] = useState("");
  const [employment, setEmployment] = useState("");
  const [eyesight, setEyesight] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [family, setFamily] = useState([
    { bondDescription: "", name: "", relation: "" },
  ]);
  const [fears, setFears] = useState("");
  const [gender, setGender] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [hairstyle, setHairstyle] = useState("");
  const [handedness, setHandedness] = useState("");
  const [height, setHeight] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [moneyHabits, setMoneyHabits] = useState("");
  const [motivations, setMotivations] = useState("");
  const [personality, setPersonality] = useState("");
  const [pets, setPets] = useState("");
  const [physicalDistinctions, setPhysicalDistinctions] = useState("");
  const [picture, setPicture] = useState("");
  const [relationships, setRelationships] = useState("");
  const [romanticHistory, setRomanticHistory] = useState("");
  const [skills, setSkills] = useState("");
  const [strengths, setStrengths] = useState("");
  const [voice, setVoice] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [weight, setWeight] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleClose = () => setShowDeleteModal(false);
  const handleOpen = () => setShowDeleteModal(true);

  useEffect(() => {
    if (projectInfo._id) {
      projectInfo.characters.forEach((character) => {
        if (currentCharacterId === character._id) {
          setName(character.name);
          setAbilities(character.abilities);
          setBirthDate(dayjs(character.birthDate).add(1, "day"));
          setBirthPlace(character.birthPlace);
          setBodyType(character.bodyType);
          setClothes(character.clothes);
          setCharacterType(character.characterType);
          setChildhood(character.childhood);
          setCriminalRecord(character.criminalRecord);
          setDevelopment(character.development);
          setDreams(character.dreams);
          setEducation(character.education);
          setEmployment(character.employment);
          setEyesight(character.eyesight);
          setEyeColor(character.eyeColor);
          setFamily(character.family);
          setFears(character.fears);
          setGender(character.gender);
          setHairColor(character.hairColor);
          setHairstyle(character.hairstyle);
          setHandedness(character.handedness);
          setHeight(character.height);
          setHobbies(character.hobbies);
          setMedicalHistory(character.medicalHistory);
          setMoneyHabits(character.moneyHabits);
          setMotivations(character.motivations);
          setPersonality(character.personality);
          setPets(character.pets);
          setPhysicalDistinctions(character.physicalDistinctions);
          setPicture(character.picture);
          setRelationships(character.relationships);
          setRomanticHistory(character.romanticHistory);
          setGender(character.gender);
          setSkills(character.skills);
          setStrengths(character.strengths);
          setVoice(character.voice);
          setWeaknesses(character.weaknesses);
          setWeight(character.weight);
        }
      });
    }
  }, [currentCharacterId, projectInfo._id]);

  // Define a function to handle changes in the family array
  const handleFamilyChange = (index, field, value) => {
    // Create a copy of the family array
    const updatedFamily = [...family];

    // Update the specific field for the family member at the given index
    updatedFamily[index] = {
      ...updatedFamily[index],
      [field]: value,
    };

    // Set the updated family array using the setFamily function
    setFamily(updatedFamily);
  };

  const addNewFamilyMember = () => {
    const updatedFamily = [...family];
    updatedFamily.push({ bondDescription: "", name: "", relation: "" });
    setFamily(updatedFamily);
  };

  async function updateCharacter(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("name", name);
    data.set("abilities", abilities);
    data.set("birthDate", birthDate);
    data.set("birthPlace", birthPlace);
    data.set("bodyType", bodyType);
    data.set("clothes", clothes);
    data.set("characterType", characterType);
    data.set("childhood", childhood);
    data.set("criminalRecord", criminalRecord);
    data.set("development", development);
    data.set("dreams", dreams);
    data.set("education", education);
    data.set("employment", employment);
    data.set("eyesight", eyesight);
    data.set("eyeColor", eyeColor);
    data.set("fears", fears);
    data.set("gender", gender);
    data.set("hairColor", hairColor);
    data.set("hairstyle", hairstyle);
    data.set("handedness", handedness);
    data.set("height", height);
    data.set("hobbies", hobbies);
    data.set("medicalHistory", medicalHistory);
    data.set("moneyHabits", moneyHabits);
    data.set("motivations", motivations);
    data.set("personality", personality);
    data.set("pets", pets);
    data.set("physicalDistinctions", physicalDistinctions);
    data.set("relationships", relationships);
    data.set("romanticHistory", romanticHistory);
    data.set("skills", skills);
    data.set("strengths", strengths);
    data.set("voice", voice);
    data.set("weaknesses", weaknesses);
    data.set("weight", weight);
    data.set("characterId", currentCharacterId);
    data.set("id", _id);
    if (files?.[0]) {
      data.set("files", files?.[0]);
    }
    if (family?.[0]) {
      data.set("family", JSON.stringify(family)); // Assuming it's an array of objects
    }

    const response = await fetch(`${serverRoute}/updateCharacter`, {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      window.location.reload(); // You might want to handle the response in a more specific way
    }
  }

  return (
    <Col id="papyrus" xs={12} xxl={9}>
      <DeleteCharacterModal
        showModal={showDeleteModal}
        handleClose={handleClose}
        currentCharacterId={currentCharacterId}
        id={_id}
        setViewNumber={setViewNumber}
      />
      <div className="d-flex justify-content-between mt-4">
        <h5 className="mx-2">Characters</h5>
        <Button variant="primary" onClick={handleOpen}>
          <i className= "bi bi-trash"></i> Delete Character
        </Button>
      </div>
      <Container>
        <Row className="my-5">
          <Col xs={12}>
            <h1 className="my-5 text-center">{name}</h1>
            <div className="d-flex justify-content-center">
              {picture ? (
                <Image
                  src={`${serverRoute}/${picture}`}
                  alt="Avatar"
                  style={{ height: "300px", borderRadius: "60%" }}
                />
              ) : (
                <Image
                  className="text-center"
                  src={avatarLogo}
                  alt="character picture"
                  style={{ height: "250px" }}
                />
              )}
            </div>
            <Form className="my-5" onSubmit={updateCharacter}>
              <Row>
                <h1 className="my-3">Basic Info/Characteristics</h1>
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Name:
                      <Form.Control
                        type="text"
                        placeholder={"Character Name"}
                        value={name}
                        onChange={(ev) => setName(ev.target.value)}
                      />
                    </Form.Label>
                  </Form.Group>
                  <Form.Group key={"inline-radio"} className="mb-3">
                    <Form.Label>
                      Character Type:{" "}
                      <h5 className="d-inline"> {characterType}</h5>
                    </Form.Label>
                    <Form.Check
                      label="Main Protagonist"
                      name="group1"
                      type={"radio"}
                      value={"Main Protagonist"}
                      onChange={(ev) => setCharacterType(ev.target.value)}
                      id={`inline-radio-1`}
                    />
                    <Form.Check
                      label="Major Supporting Protagonist"
                      name="group1"
                      type={"radio"}
                      value={"Major Supporting Protagonist"}
                      onChange={(ev) => setCharacterType(ev.target.value)}
                      id={`inline-radio-2`}
                    />
                    <Form.Check
                      label="Minor Supporting Protagonist"
                      name="group1"
                      type={"radio"}
                      value={"Minor Supporting Protagonist"}
                      onChange={(ev) => setCharacterType(ev.target.value)}
                      id={`inline-radio-3`}
                    />
                    <Form.Check
                      label="Major Antagonist"
                      name="group1"
                      type={"radio"}
                      value={"Major Antagonist"}
                      onChange={(ev) => setCharacterType(ev.target.value)}
                      id={`inline-radio-4`}
                    />
                    <Form.Check
                      label="Minor Antagonist"
                      name="group1"
                      type={"radio"}
                      value={"Minor Antagonist"}
                      onClick={(ev) => setCharacterType(ev.target.value)}
                      id={`inline-radio-5`}
                    />
                    <Form.Check
                      className="mb-1"
                      label="Tertiary"
                      name="group1"
                      type={"radio"}
                      value={"Tertiary"}
                      onClick={(ev) => setCharacterType(ev.target.value)}
                      id={`inline-radio-6`}
                    />
                    <Form.Text muted>
                      Specify the character type (e.g., protagonist,
                      antagonist).
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Birth Date:
                      <h5 className="d-inline ms-1">
                        {birthDate && dayjs(birthDate).format("MMM DD, YYYY")}
                      </h5>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={birthDate}
                      onChange={(ev) => setBirthDate(ev.target.value)}
                    />
                    <Form.Text muted>Date of birth.</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Birth Place:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Birth Place"}
                      value={birthPlace}
                      onChange={(ev) => setBirthPlace(ev.target.value)}
                    />
                    <Form.Text muted>Place of birth.</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Gender"}
                      value={gender}
                      onChange={(ev) => setGender(ev.target.value)}
                    />
                    <Form.Text muted>Character's gender.</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Height:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Height"}
                      value={height}
                      onChange={(ev) => setHeight(ev.target.value)}
                    />
                    <Form.Text muted>Specify the character's height.</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Weight:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Weight"}
                      value={weight}
                      onChange={(ev) => setWeight(ev.target.value)}
                    />
                    <Form.Text muted>Specify the character's weight.</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Handedness:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Handedness"}
                      value={handedness}
                      onChange={(ev) => setHandedness(ev.target.value)}
                    />
                    <Form.Text muted>
                      Specify the character's handedness i.e (right, left, or
                      ambidextrous).
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Eyesight:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Eyesight"}
                      value={eyesight}
                      onChange={(ev) => setEyesight(ev.target.value)}
                    />
                    <Form.Text muted>
                      Specify the character's eyesight condition.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Eye Color:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Eye Color"}
                      value={eyeColor}
                      onChange={(ev) => setEyeColor(ev.target.value)}
                    />
                    <Form.Text muted>
                      Specify the character's eyesight condition.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Body Type:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Body Type"}
                      value={bodyType}
                      onChange={(ev) => setBodyType(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the character's body type.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Clothes:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      placeholder={"Clothes"}
                      value={clothes}
                      onChange={(ev) => setClothes(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the character's usual attire.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Hairstyle:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Hairstyle"}
                      value={hairstyle}
                      onChange={(ev) => setHairstyle(ev.target.value)}
                    />
                    <Form.Text muted>
                      Specify the character's hairstyle.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Hair Color:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Hair Color"}
                      value={hairColor}
                      onChange={(ev) => setHairColor(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the character's hair color.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Physical Distinctions:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      placeholder={"Physical Distinctions"}
                      value={physicalDistinctions}
                      onChange={(ev) =>
                        setPhysicalDistinctions(ev.target.value)
                      }
                    />
                    <Form.Text muted>
                      Describe any physical distinctions of the character.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Voice:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Voice"}
                      value={voice}
                      onChange={(ev) => setVoice(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the sound of the character's voice.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <h1 className="my-4">Abilities</h1>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Abilities/Powers:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      placeholder={"Abilities/Powers"}
                      value={abilities}
                      onChange={(ev) => setAbilities(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the character's abilities or special powers if
                      they have any.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Skills:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      placeholder={"Skills"}
                      value={skills}
                      onChange={(ev) => setSkills(ev.target.value)}
                    />
                    <Form.Text muted>
                      Mention the character's skills. This will include anything
                      skillful that they are good at.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Strengths:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      placeholder={"Strengths"}
                      value={strengths}
                      onChange={(ev) => setStrengths(ev.target.value)}
                    />
                    <Form.Text muted>
                      Specify the character's strengths.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Weaknesses:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      placeholder={"Weaknesses"}
                      value={weaknesses}
                      onChange={(ev) => setWeaknesses(ev.target.value)}
                    />
                    <Form.Text muted>
                      Specify the character's weaknesses.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <h1 className="my-3">Persona</h1>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Personality:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      placeholder={"Personality"}
                      value={personality}
                      onChange={(ev) => setPersonality(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the character's personality.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Dreams:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      placeholder={"Dreams"}
                      value={dreams}
                      onChange={(ev) => setDreams(ev.target.value)}
                    />
                    <Form.Text muted>
                      Mention the character's dreams or aspirations.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Development:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      placeholder={"Development"}
                      value={development}
                      onChange={(ev) => setDevelopment(ev.target.value)}
                    />
                    <Form.Text muted>
                      How do you want this character to develop as the story
                      goes on? What changes will take place in him?
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Motivations:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      placeholder={"Motivations"}
                      value={motivations}
                      onChange={(ev) => setMotivations(ev.target.value)}
                    />
                    <Form.Text muted>
                      Mention the character's motivations.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Fears:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      placeholder={"Fears"}
                      value={fears}
                      onChange={(ev) => setFears(ev.target.value)}
                    />
                    <Form.Text muted>Specify the character's fears.</Form.Text>
                  </Form.Group>
                </Col>
                <h1 className="my-3">Life</h1>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hobbies:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      placeholder={"Hobbies"}
                      value={hobbies}
                      onChange={(ev) => setHobbies(ev.target.value)}
                    />
                    <Form.Text muted>
                      Mention the character's hobbies.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Relationships:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="4"
                      placeholder={"Relationships"}
                      value={relationships}
                      onChange={(ev) => setRelationships(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the character's relationships with others. Who is
                      he closest with? How does he go about his relationships?
                      How much does he value people?
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Employment:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Employment"}
                      value={employment}
                      onChange={(ev) => setEmployment(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the character's employment history.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Pets:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Pets"}
                      value={pets}
                      onChange={(ev) => setPets(ev.target.value)}
                    />
                    <Form.Text muted>
                      Mention the character's pets, if any.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Money Habits:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Money Habits"}
                      value={moneyHabits}
                      onChange={(ev) => setMoneyHabits(ev.target.value)}
                    />
                    <Form.Text muted>
                      Specify the character's money habits.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <h1 className="my-3">History</h1>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Childhood:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      placeholder={"Childhood"}
                      value={childhood}
                      onChange={(ev) => setChildhood(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the character's childhood.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Romantic History:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      placeholder={"Romantic History"}
                      value={romanticHistory}
                      onChange={(ev) => setRomanticHistory(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the character's romantic history.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Medical History:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      placeholder={"Medical History"}
                      value={medicalHistory}
                      onChange={(ev) => setMedicalHistory(ev.target.value)}
                    />
                    <Form.Text muted>
                      Describe the character's medical history.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Education:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      placeholder={"Education"}
                      value={education}
                      onChange={(ev) => setEducation(ev.target.value)}
                    />
                    <Form.Text muted>
                      Specify the character's educational background.
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Criminal Record:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="3"
                      placeholder={"Criminal Record"}
                      value={criminalRecord}
                      onChange={(ev) => setCriminalRecord(ev.target.value)}
                    />
                    <Form.Text muted>
                      Specify any criminal record the character may have.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <h1 className="my-3">Family Members</h1>
                <Form.Group className="my-3">
                  <Row>
                    {family.length > 0 &&
                      family.map((member, index) => (
                        <Col md={6} key={member._id}>
                          <h2>{member.name}</h2>
                          <Form.Label>Name: </Form.Label>
                          <Form.Control
                            className="mb-2"
                            type="text"
                            placeholder={"Name"}
                            value={member.name}
                            onChange={(ev) =>
                              handleFamilyChange(index, "name", ev.target.value)
                            }
                          />
                          <Form.Label>Relation: </Form.Label>
                          <Form.Control
                            type="text"
                            className="mb-2"
                            placeholder={'"Father", "Mother", "Cousin"'}
                            value={member.relation}
                            onChange={(ev) =>
                              handleFamilyChange(
                                index,
                                "relation",
                                ev.target.value
                              )
                            }
                          />
                          <Form.Label>Bond description: </Form.Label>
                          <Form.Control
                            as="textarea"
                            rows="3"
                            className="mb-2"
                            placeholder={
                              "How good or bad is the relationship between this person and your character?"
                            }
                            value={member.bondDescription}
                            onChange={(ev) =>
                              handleFamilyChange(
                                index,
                                "bondDescription",
                                ev.target.value
                              )
                            }
                          />
                          <div>
                            <Button
                              variant="primary my-3"
                              size="sm"
                              onClick={async () => {
                                if (index === 0) {
                                  await setFamily(family.shift());
                                } else if (index === family.length - 1) {
                                  await setFamily(family.pop());
                                } else {
                                  await setFamily(family.splice(index, 1));
                                }
                                setFamily(family);
                              }}
                            >
                              Delete
                            </Button>
                          </div>
                        </Col>
                      ))}
                    <div>
                      <Button
                        variant="primary my-3"
                        onClick={addNewFamilyMember}
                      >
                        + Add new family member
                      </Button>
                    </div>
                  </Row>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Picture:</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(ev) => setFiles(ev.target.files)}
                  />
                  <Form.Text muted>
                    Provide a link to a picture of the character.
                  </Form.Text>
                </Form.Group>
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
