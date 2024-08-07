import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/esm/Image";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import { useState, useEffect } from "react";
import DeleteArcModal from "./DeleteArcModal";

export default function EditArc({
  projectInfo,
  setViewNumber,
  _id,
  currentArcId,
}) {
  const [files, setFiles] = useState("");
  const [name, setName] = useState("");
  const [chapters, setChapters] = useState("");
  const [protagonists, setProtagonists] = useState([{ name: "" }]);
  const [antagonists, setAntagonists] = useState([{ name: "" }]);
  const [tertiary, setTertiary] = useState([{ name: "" }]);
  const [foreshadowing, setForeshadowing] = useState("");
  const [twists, setTwists] = useState("");
  const [picture, setPicture] = useState("");
  const [characterDevelopment, setCharacterDevelopment] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [development, setDevelopment] = useState("");
  const [obstacles, setObstacles] = useState([""]);
  const [resolution, setResolution] = useState("");
  const [subplots, setSubplots] = useState([
    {
      name: "New Subplot",
      chapters: "",
      introduction: "",
      development: "",
      obstacles: [""],
      resolution: "",
    },
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleClose = () => setShowDeleteModal(false);
  const handleOpen = () => setShowDeleteModal(true);

  useEffect(() => {
  if (projectInfo._id) {
    // Find the arc that matches the currentArcId
    const arc = projectInfo.plot.arcs.find((arc) => currentArcId === arc._id);

    if (arc) {
      setName(arc.name || ""); // Default to an empty string if undefined
      setChapters(arc.chapters || ""); // Default to an empty string if undefined
      setForeshadowing(arc.foreshadowing || ""); // Default to an empty string if undefined
      setTwists(arc.twists || ""); // Default to an empty string if undefined
      setPicture(arc.picture || ""); // Default to an empty string or appropriate default
      setCharacterDevelopment(arc.characterDevelopment || ""); // Default to an empty string if undefined
      setIntroduction(arc.introduction || ""); // Default to an empty string if undefined
      setDevelopment(arc.development || ""); // Default to an empty string if undefined
      setResolution(arc.resolution || ""); // Default to an empty string if undefined

      // Ensure that obstacles is always an array, even if empty
      setObstacles(Array.isArray(arc.obstacles) ? arc.obstacles : []);

      // Ensure that subplots is always an array, even if empty
      setSubplots(Array.isArray(arc.subplots) ? arc.subplots : []);

      // Ensure that protagonists is always an array, even if empty
      setProtagonists(Array.isArray(arc.protagonists) ? arc.protagonists : []);

      // Ensure that antagonists is always an array, even if empty
      setAntagonists(Array.isArray(arc.antagonists) ? arc.antagonists : []);
    }
  }
}, [currentArcId, projectInfo._id]);

  async function updateArc(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("id", _id);
    data.set("arcId", currentArcId);
    data.set("files", files?.[0]);
    data.set("name", name);
    data.set("chapters", chapters);
    data.set("foreshadowing", foreshadowing);
    data.set("twists", twists);
    data.set("characterDevelopment", characterDevelopment);
    data.set("introduction", introduction);
    data.set("development", development);
    data.set("resolution", resolution);

    // Stringify arrays before appending to FormData
    data.set("protagonists", JSON.stringify(protagonists));
    data.set("antagonists", JSON.stringify(antagonists));
    data.set("tertiary", JSON.stringify(tertiary));
    data.set("obstacles", JSON.stringify(obstacles));
    data.set("subplots", JSON.stringify(subplots));

    const response = await fetch("http://localhost:5000/updateArc", {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      window.location.reload();
    }
  }

  const handleObstacleChange = (index, value) => {
    const newObstacles = [...obstacles];
    newObstacles[index] = value || ""; // Ensure value is not undefined
    setObstacles(newObstacles);
  };
  const addObstacle = () => {
    setObstacles([...obstacles, ""]);
  };

  const updateProtagonistName = (index, value) => {
    const updatedProtagonists = [...protagonists];
    updatedProtagonists[index].name = value;
    setProtagonists(updatedProtagonists);
  };

  const updateAntagonistName = (index, value) => {
    const updatedAntagonists = [...antagonists];
    updatedAntagonists[index].name = value;
    setAntagonists(updatedAntagonists);
  };

  const updateTertiaryName = (index, value) => {
    const updatedTertiary = [...tertiary];
    if (updatedTertiary[index]) {
      updatedTertiary[index].name = value || ""; // Ensure value is not undefined
      setTertiary(updatedTertiary);
    }
  };

  const addNewProtagonist = () => {
    setProtagonists([...protagonists, { name: "" }]);
  };

  const addNewAntagonist = () => {
    setAntagonists([...antagonists, { name: "" }]);
  };

  const addNewTertiary = () => {
    setTertiary([...tertiary, { name: "" }]);
  };

  const deleteItem = (index, setArray) => {
    setArray((prevArray) => {
      const newArray = [...prevArray];
      newArray.splice(index, 1);
      return newArray;
    });
  };

  const addNewSubplot = () => {
    setSubplots((prevSubplots) => [
      ...prevSubplots,
      {
        name: "New Subplot",
        chapters: "",
        introduction: "",
        development: "",
        obstacles: [""],
        resolution: "",
      },
    ]);
  };

  const deleteSubplot = (index) => {
    setSubplots((prevSubplots) => {
      const updatedSubplots = [...prevSubplots];
      updatedSubplots.splice(index, 1);
      return updatedSubplots;
    });
  };

  const deleteSubplotObstacle = (subplotIndex, obstacleIndex) => {
    setSubplots((prevSubplots) => {
      const updatedSubplots = [...prevSubplots];
      updatedSubplots[subplotIndex].obstacles.splice(obstacleIndex, 1);
      return updatedSubplots;
    });
  };
  const addSubplotObstacle = (subplotIndex) => {
    setSubplots((prevSubplots) => {
      const updatedSubplots = [...prevSubplots];
      updatedSubplots[subplotIndex].obstacles.push("");
      return updatedSubplots;
    });
  };

  const handleSubplotChange = (index, field, value) => {
    const updatedSubplots = [...subplots];
    if (updatedSubplots[index]) {
      updatedSubplots[index][field] = value || ""; // Ensure value is not undefined
      setSubplots(updatedSubplots);
    }
  };

  return (
    <Col id="papyrus" xs={12} xxl={9}>
      <DeleteArcModal
        showModal={showDeleteModal}
        handleClose={handleClose}
        currentArcId={currentArcId}
        id={_id}
        setViewNumber={setViewNumber}
      />
      <div className="d-flex justify-content-between mt-4">
        <h5 className="mx-2">Story Arcs</h5>
        <Button variant="primary" onClick={handleOpen}>
          <i className="bi bi-trash"></i> Delete Arc
        </Button>
      </div>
      <Container>
        <Row className="my-5" id="edit-arc">
          <Col xs={12}>
            <h1 className="my-5 text-center">{name}</h1>
            <div className="text-center">
              {picture && (
                <Image
                  src={`http://localhost:5000/${picture}`}
                  alt="Avatar"
                  style={{
                    height: "300px",
                    borderRadius: "20%",
                  }}
                  className="m-5"
                />
              )}
            </div>
            <Form className="my-5" onSubmit={updateArc}>
              <Row>
                <Col xs={12} md={6}>
                  <h2>Basic Info</h2>
                  <Form.Group className="mb-3">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Arc Name"}
                      value={name}
                      onChange={(ev) => setName(ev.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Chapters:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={"Arc Chapters"}
                      value={chapters}
                      onChange={(ev) => setChapters(ev.target.value)}
                    />
                    <Form.Text muted>
                      What are the span of chapters that will be this arc?
                      (example: 'Chapters 10-20')
                    </Form.Text>
                  </Form.Group>
                  <h2 className="my-4">Characters</h2>
                  <Accordion className="border-top border-dark mb-4" flush>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Protagonists</Accordion.Header>
                      <Accordion.Body>
                        <Button
                          variant="primary my-1"
                          onClick={addNewProtagonist}
                        >
                          + Add New Protagonist
                        </Button>
                        {protagonists.map((character, index) => (
                          <Form.Group key={character._id}>
                            <h5 className="my-1">{character.name}</h5>
                            <div className="d-flex justify-content-between">
                              <Form.Control
                                type="text"
                                className="w-75"
                                placeholder={"Character Name"}
                                value={character.name}
                                onChange={(ev) =>
                                  updateProtagonistName(index, ev.target.value)
                                }
                              />
                              <Button
                                variant="primary mb-1"
                                onClick={() =>
                                  deleteItem(index, setProtagonists)
                                }
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </Form.Group>
                        ))}
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>Antagonists</Accordion.Header>
                      <Accordion.Body>
                        <Button
                          variant="primary my-1"
                          onClick={addNewAntagonist}
                        >
                          + Add New Antagonist
                        </Button>
                        {antagonists.map((character, index) => (
                          <Form.Group key={character._id}>
                            <h5 className="my-1">{character.name}</h5>
                            <div className="d-flex justify-content-between">
                              <Form.Control
                                type="text"
                                className="w-75"
                                placeholder={"Character Name"}
                                value={character.name}
                                onChange={(ev) =>
                                  updateAntagonistName(index, ev.target.value)
                                }
                              />
                              <Button
                                variant="primary mb-1"
                                onClick={() =>
                                  deleteItem(index, setAntagonists)
                                }
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </Form.Group>
                        ))}
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" className="border-bottom">
                      <Accordion.Header>Tertiary Characters</Accordion.Header>
                      <Accordion.Body>
                        <Button variant="primary my-1" onClick={addNewTertiary}>
                          + Add New Tertiary Character
                        </Button>
                        {tertiary.map((character, index) => (
                          <Form.Group key={character._id}>
                            <h5 className="my-1">{character.name}</h5>
                            <div className="d-flex justify-content-between">
                              <Form.Control
                                type="text"
                                className="w-75"
                                placeholder={"Character Name"}
                                value={character.name}
                                onChange={(ev) =>
                                  updateTertiaryName(index, ev.target.value)
                                }
                              />
                              <Button
                                variant="primary mb-1"
                                onClick={() => deleteItem(index, setTertiary)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </Form.Group>
                        ))}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Col>
                <Col xs={12} md={6}>
                  <h2 className="mb-4">Plot Summary</h2>
                  <Accordion flush className="border-top border-dark mb-4">
                    <Accordion.Item eventKey="0" className="border-bottom">
                      <Accordion.Header>Introduction</Accordion.Header>
                      <Accordion.Body>
                        <Form.Group className="mb-3">
                          <Form.Control
                            type="summary"
                            as="textarea"
                            placeholder={``}
                            value={introduction}
                            rows="12"
                            max-rows="25"
                            onChange={(ev) => setIntroduction(ev.target.value)}
                          />
                          <Form.Text muted>
                            The introduction sets the stage for the entire
                            narrative, providing a foundation for the reader's
                            journey through the story. It must captivate the
                            reader's attention with an engaging opening that
                            leaves them eager to continue. This section should
                            also establish the setting, providing enough context
                            about the time, place, and environment of the story.
                            Introduce key characters, offering a glimpse into
                            who they are without revealing everything. Set the
                            tone and atmosphere to convey the mood of the
                            narrative, whether it's light-hearted, suspenseful,
                            or somber. Present the central conflict or inciting
                            incident, the event that propels the plot forward.
                            Additionally, it should establish the narrative
                            voice, indicating whether it's first-person,
                            third-person, or omniscient, and the style and
                            perspective it employs. Lastly, the introduction
                            should raise questions or intrigue the reader,
                            leaving them curious about what will unfold next,
                            while avoiding overwhelming them with excessive
                            information or backstory. This opening can also
                            incorporate foreshadowing and subtly hint at events
                            or revelations that will come to pass later in the
                            story, adding depth and intrigue for attentive
                            readers.
                          </Form.Text>
                        </Form.Group>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" className="border-bottom">
                      <Accordion.Header>Development</Accordion.Header>
                      <Accordion.Body>
                        <Form.Group className="mb-3">
                          <Form.Control
                            type="summary"
                            as="textarea"
                            placeholder={``}
                            value={development}
                            rows="12"
                            max-rows="25"
                            onChange={(ev) => setDevelopment(ev.target.value)}
                          />
                          <Form.Text muted>
                            The development stage is a crucial phase that
                            advances the story and engages the audience. It
                            focuses on character growth and interaction,
                            allowing them to face challenges and evolve in
                            response to unfolding events. Complications and
                            obstacles are introduced, creating tension and
                            driving the plot forward. This stage maintains or
                            increases suspense and momentum, keeping the
                            audience invested in the story. It also provides an
                            opportunity for further world-building and setting
                            details, enriching the reader's or viewer's
                            experience. Foreshadowing and subtle clues can be
                            employed to intrigue the audience and create
                            anticipation for future events. The Development
                            stage ensures balanced pacing and structure,
                            contributing to the overall integrity of the
                            narrative. It aligns with the established theme and
                            tone, evoking emotions and deepening the audience's
                            engagement. Overall, this stage sets the stage for
                            the subsequent twist and conclusion stages, ensuring
                            that the story remains engaging and compelling.
                          </Form.Text>
                        </Form.Group>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" className="border-bottom">
                      <Accordion.Header>Obstacles</Accordion.Header>
                      <Accordion.Body>
                        <Accordion>
                          {obstacles.length > 0 &&
                            obstacles.map((obstacle, index) => (
                              <Accordion.Item
                                key={obstacle._id}
                                className="border-bottom"
                              >
                                <Accordion.Header>
                                  Obstacle {index + 1}
                                </Accordion.Header>
                                <Accordion.Body>
                                  <Form.Group className="mt-3">
                                    <Form.Control
                                      as="textarea"
                                      rows="10"
                                      placeholder={""}
                                      value={obstacle}
                                      onChange={(ev) =>
                                        handleObstacleChange(
                                          index,
                                          ev.target.value
                                        )
                                      }
                                    />
                                  </Form.Group>
                                  <div>
                                    <Button
                                      variant="primary my-3"
                                      size="sm"
                                      onClick={() => {
                                        setObstacles((prevObstacles) => {
                                          // Create a new array excluding the item at the current index
                                          return prevObstacles.filter(
                                            (_, i) => i !== index
                                          );
                                        });
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </Accordion.Body>
                              </Accordion.Item>
                            ))}
                        </Accordion>
                        <Form.Text muted>
                          The Obstacle stage introduces a significant and
                          unexpected turn of events in the story. This twist
                          disrupts the audience's expectations, leading to
                          heightened tension and intrigue. It may reveal hidden
                          information, intensify conflicts, and prompt
                          characters to adapt to the new circumstances. The
                          twist often alters character dynamics and alliances,
                          necessitating a reevaluation of goals and objectives.
                          It adds depth and complexity to the narrative,
                          preparing the groundwork for the final resolution.
                          Ultimately, the "obstacle" stage is a pivotal moment
                          that injects new energy into the story, keeping the
                          audience engaged and eager to see how the narrative
                          will unfold. It plays a crucial role in creating a
                          compelling and well-rounded storytelling experience.
                          Don't be afraid to add several obstacles if you wish
                          to have many twists in your story.
                        </Form.Text>
                        <div>
                          <Button variant="primary my-3" onClick={addObstacle}>
                            + Add new obstacle
                          </Button>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3" className="border-bottom">
                      <Accordion.Header>Resolution</Accordion.Header>
                      <Accordion.Body>
                        <Form.Group className="my-3">
                          <Form.Control
                            type="summary"
                            as="textarea"
                            placeholder={``}
                            value={resolution}
                            rows="8"
                            max-rows="25"
                            onChange={(ev) => setResolution(ev.target.value)}
                          />
                          <Form.Text muted>
                            The Resolution stage marks the conclusion of the
                            narrative. It resolves conflicts, providing closure
                            for characters' personal journeys and arcs. Subplots
                            and secondary storylines find clarity and closure,
                            addressing any lingering questions introduced
                            earlier. The stage often reinforces the story's
                            underlying message or moral lesson. It reveals the
                            consequences of characters' actions and decisions,
                            shaping their outcomes and the world around them.
                            The narrative may return to a state of stability or
                            establish a new sense of normalcy. Characters
                            reflect on their journeys, acknowledging their
                            growth and lessons learned. The resolution stage
                            aims to leave the audience with a feeling of
                            satisfaction and fulfillment, tying up loose ends
                            and providing a complete conclusion. Additionally,
                            it may offer a glimpse into the characters'
                            potential futures beyond the scope of the story.
                            This final act ensures a lasting emotional impact,
                            leaving a sense of resonance and reflection for both
                            characters and the audience.
                          </Form.Text>
                        </Form.Group>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <h2 className="my-4">Key Details</h2>
                  <Accordion className="border-top border-dark mb-4" flush>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Foreshadowing</Accordion.Header>
                      <Accordion.Body>
                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            rows="6"
                            placeholder="Foreshadowing"
                            value={foreshadowing}
                            onChange={(ev) => setForeshadowing(ev.target.value)}
                          />
                          <Form.Text muted>
                            Will you use foreshadowing in your story? Effective
                            foreshadowing in storytelling involves subtly
                            incorporating clues through symbols, dialogue, and
                            character reactions to hint at future events.
                            Authors can utilize narrative tone, timing, and the
                            Chekhov's Gun principle to strategically place
                            foreshadowing elements, creating a multi-layered and
                            engaging narrative. Well-executed foreshadowing
                            strikes a balance between providing enough
                            information to engage readers and maintaining an
                            element of surprise, fostering anticipation and
                            enhancing the overall reading experience. Write here
                            how you will incorporate foreshadowing in your
                            project.
                          </Form.Text>
                        </Form.Group>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>Twists</Accordion.Header>
                      <Accordion.Body>
                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            rows="6"
                            placeholder="Twists"
                            value={twists}
                            onChange={(ev) => setTwists(ev.target.value)}
                          />
                          <Form.Text muted>
                            Describe here how you want to incorporate any
                            unexpected twists in your story arc. These twists
                            should leave the reader surprised and intrigued,
                            while also providing a sense of irony. This can also
                            run hand-in-hand with your foreshadowing, as well as
                            the obstacles portion of your plot summary.
                          </Form.Text>
                        </Form.Group>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" className="border-bottom">
                      <Accordion.Header>Character Development</Accordion.Header>
                      <Accordion.Body>
                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            rows="12"
                            placeholder="Character Development"
                            value={characterDevelopment}
                            onChange={(ev) =>
                              setCharacterDevelopment(ev.target.value)
                            }
                          />
                          <Form.Text muted>
                            Describe how you want your characters to develop in
                            this arc. What state of mind will your main
                            characters be in after the arc is completed? Are
                            there any characters that you really want to show
                            how they've changed?
                          </Form.Text>
                        </Form.Group>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Col>
                <Col xs={12}>
                  <h2 className="my-4">Subplots</h2>
                  <Accordion
                    className="border-bottom border-top border-dark"
                    flush
                  >
                    {subplots.map((subplot, subplotIndex) => (
                      <Accordion.Item
                        key={subplot._id}
                        eventKey={subplotIndex.toString()}
                        className="border-bottom"
                      >
                        <Accordion.Header>{subplot.name}</Accordion.Header>
                        <Accordion.Body>
                          <Form.Group className="mb-3">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder=""
                              value={subplot.name}
                              onChange={(ev) =>
                                handleSubplotChange(
                                  subplotIndex,
                                  "name",
                                  ev.target.value
                                )
                              }
                            />
                            <Form.Text muted>Name of Subplot</Form.Text>
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Chapters:</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder=""
                              value={subplot.chapters}
                              onChange={(ev) =>
                                handleSubplotChange(
                                  subplotIndex,
                                  "chapters",
                                  ev.target.value
                                )
                              }
                            />
                            <Form.Text muted>
                              Which chapter or chapters will contain this
                              subplot?
                            </Form.Text>
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Introduction:</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows="4"
                              placeholder=""
                              value={subplot.introduction}
                              onChange={(ev) =>
                                handleSubplotChange(
                                  subplotIndex,
                                  "introduction",
                                  ev.target.value
                                )
                              }
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Development:</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows="4"
                              placeholder=""
                              value={subplot.development}
                              onChange={(ev) =>
                                handleSubplotChange(
                                  subplotIndex,
                                  "development",
                                  ev.target.value
                                )
                              }
                            />
                          </Form.Group>
                          {subplot.obstacles.length > 0 &&
                            subplot.obstacles.map((obstacle, obstacleIndex) => (
                              <Form.Group className="mt-3" key={obstacle._id}>
                                <Form.Label>Obstacle:</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows="4"
                                  placeholder=""
                                  value={obstacle}
                                  onChange={(ev) =>
                                    handleSubplotChange(
                                      subplotIndex,
                                      "obstacles",
                                      [
                                        ...subplot.obstacles.slice(
                                          0,
                                          obstacleIndex
                                        ),
                                        ev.target.value,
                                        ...subplot.obstacles.slice(
                                          obstacleIndex + 1
                                        ),
                                      ]
                                    )
                                  }
                                />
                                {obstacleIndex > 0 && (
                                  <div>
                                    <Button
                                      variant="primary my-3"
                                      size="sm"
                                      onClick={() =>
                                        deleteSubplotObstacle(
                                          subplotIndex,
                                          obstacleIndex
                                        )
                                      }
                                    >
                                      Delete Obstacle
                                    </Button>
                                  </div>
                                )}
                              </Form.Group>
                            ))}
                          <div>
                            <Button
                              variant="primary my-3"
                              onClick={() => addSubplotObstacle(subplotIndex)}
                            >
                              + Add New Obstacle
                            </Button>
                          </div>
                          <Form.Group className="my-3">
                            <Form.Label>Resolution:</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows="4"
                              placeholder=""
                              value={subplot.resolution}
                              onChange={(ev) =>
                                handleSubplotChange(
                                  subplotIndex,
                                  "resolution",
                                  ev.target.value
                                )
                              }
                            />
                          </Form.Group>
                          <Button
                            variant="primary my-3"
                            size="sm"
                            onClick={() => deleteSubplot(subplotIndex)}
                          >
                            Delete Subplot
                          </Button>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                    <Button variant="primary my-3" onClick={addNewSubplot}>
                      + Add Subplot
                    </Button>
                  </Accordion>
                  <Form.Group className="my-3">
                    <Form.Label>Picture:</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(ev) => setFiles(ev.target.files)}
                    />
                    <Form.Text muted>
                      Upload a cover picture of this story arc.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <div className="text-center mt-3">
                  <Button variant="primary w-75 mt-5" size="lg" type="submit">
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
