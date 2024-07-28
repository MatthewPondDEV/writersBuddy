import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";

export default function EditPlotOverview({ projectInfo, setViewNumber, _id }) {
  const [introduction, setIntroduction] = useState("");
  const [development, setDevelopment] = useState("");
  const [obstacles, setObstacles] = useState([""]);
  const [resolution, setResolution] = useState("");
  const [files, setFiles] = useState("");
  const [loadData, setLoadData] = useState(false);

  function startLoad() {
    const t = setTimeout(() => {
      if (!loadData && projectInfo._id) {
        setIntroduction(projectInfo.plot.summary.introduction);
        setDevelopment(projectInfo.plot.summary.development);
        setResolution(projectInfo.plot.summary.resolution);
        if (projectInfo.plot.summary.obstacles.length > 0) {
          setObstacles(projectInfo.plot.summary.obstacles);
        }
        setLoadData(true);
      }
    }, 200);

    if (loadData) {
      clearTimeout(t);
    }
  }
  startLoad();

  const handleInputChange = (index, value) => {
    const newObstacles = [...obstacles];
    newObstacles[index] = value;
    setObstacles(newObstacles);
  };

  const addObstacle = () => {
    setObstacles([...obstacles, ""]);
  };

  async function updatePlotSummary(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.set("introduction", introduction);
    data.set("development", development);
    data.set("obstacles".JSON.stringify(obstacles));
    data.set("resolution", resolution);
    data.set("id", _id);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    const response = await fetch("http://localhost:5000/editPlotOverview", {
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
      <h5 className="mt-4 mx-2">Plot Overview</h5>
      <Container>
        <Row className="my-5">
          <Col xs={12}>
            <h1 className="my-5 text-center">
              {projectInfo.title} Plot Overview
            </h1>
            <Form className="my-4" onSubmit={updatePlotSummary}>
              <Form.Group className="mb-3">
                <Form.Label>Introduction:</Form.Label>
                <Form.Control
                  type="summary"
                  as="textarea"
                  placeholder={``}
                  value={introduction}
                  rows="8"
                  max-rows="25"
                  onChange={(ev) => setIntroduction(ev.target.value)}
                />
                <Form.Text muted>
                  The introduction sets the stage for the entire narrative,
                  providing a foundation for the reader's journey through the
                  story. It must captivate the reader's attention with an
                  engaging opening that leaves them eager to continue. This
                  section should also establish the setting, providing enough
                  context about the time, place, and environment of the story.
                  Introduce key characters, offering a glimpse into who they are
                  without revealing everything. Set the tone and atmosphere to
                  convey the mood of the narrative, whether it's light-hearted,
                  suspenseful, or somber. Present the central conflict or
                  inciting incident, the event that propels the plot forward.
                  Additionally, it should establish the narrative voice,
                  indicating whether it's first-person, third-person, or
                  omniscient, and the style and perspective it employs. Lastly,
                  the introduction should raise questions or intrigue the
                  reader, leaving them curious about what will unfold next,
                  while avoiding overwhelming them with excessive information or
                  backstory. This opening can also incorporate foreshadowing and
                  subtly hint at events or revelations that will come to pass
                  later in the story, adding depth and intrigue for attentive
                  readers.
                </Form.Text>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Development:</Form.Label>
                <Form.Control
                  type="summary"
                  as="textarea"
                  placeholder={``}
                  value={development}
                  rows="8"
                  max-rows="25"
                  onChange={(ev) => setDevelopment(ev.target.value)}
                />
                <Form.Text muted>
                  The development stage is a crucial phase that advances the
                  story and engages the audience. It focuses on character growth
                  and interaction, allowing them to face challenges and evolve
                  in response to unfolding events. Complications and obstacles
                  are introduced, creating tension and driving the plot forward.
                  This stage maintains or increases suspense and momentum,
                  keeping the audience invested in the story. It also provides
                  an opportunity for further world-building and setting details,
                  enriching the reader's or viewer's experience. Foreshadowing
                  and subtle clues can be employed to intrigue the audience and
                  create anticipation for future events. The Development stage
                  ensures balanced pacing and structure, contributing to the
                  overall integrity of the narrative. It aligns with the
                  established theme and tone, evoking emotions and deepening the
                  audience's engagement. Overall, this stage sets the stage for
                  the subsequent twist and conclusion stages, ensuring that the
                  story remains engaging and compelling.
                </Form.Text>
              </Form.Group>
              {obstacles.length > 0 &&
                obstacles.map((obstacle, index) => (
                  <Form.Group className="mt-3" key={index}>
                    <Form.Label>Obstacle:</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows="6"
                      placeholder={""}
                      value={obstacle}
                      onChange={(ev) =>
                        handleInputChange(index, ev.target.value)
                      }
                    />
                    {index > 0 && (
                      <div>
                        <Button
                          variant="primary my-3"
                          size="sm"
                          onClick={() => {
                            // Create a copy of the obstacles array
                            const updatedObstacles = [...obstacles];

                            // Remove the obstacle at the given index
                            if (index === updatedObstacles.length - 1) {
                              updatedObstacles.pop();
                            } else {
                              updatedObstacles.splice(index, 1);
                            }

                            // Update the state with the new array
                            setObstacles(updatedObstacles);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </Form.Group>
                ))}
              <Form.Text muted>
                The Obstacle stage introduces a significant and unexpected turn
                of events in the story. This twist disrupts the audience's
                expectations, leading to heightened tension and intrigue. It may
                reveal hidden information, intensify conflicts, and prompt
                characters to adapt to the new circumstances. The twist often
                alters character dynamics and alliances, necessitating a
                reevaluation of goals and objectives. It adds depth and
                complexity to the narrative, preparing the groundwork for the
                final resolution. Ultimately, the "obstacle" stage is a pivotal
                moment that injects new energy into the story, keeping the
                audience engaged and eager to see how the narrative will unfold.
                It plays a crucial role in creating a compelling and
                well-rounded storytelling experience. Don't be afraid to add
                several obstacles if you wish to have many twists in your story.
              </Form.Text>
              <div>
                <Button variant="primary my-3" onClick={addObstacle}>
                  + Add new obstacle
                </Button>
              </div>
              <Form.Group className="my-3">
                <Form.Label>Resolution:</Form.Label>
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
                  The Resolution stage marks the conclusion of the narrative. It
                  resolves conflicts, providing closure for characters' personal
                  journeys and arcs. Subplots and secondary storylines find
                  clarity and closure, addressing any lingering questions
                  introduced earlier. The stage often reinforces the story's
                  underlying message or moral lesson. It reveals the
                  consequences of characters' actions and decisions, shaping
                  their outcomes and the world around them. The narrative may
                  return to a state of stability or establish a new sense of
                  normalcy. Characters reflect on their journeys, acknowledging
                  their growth and lessons learned. The resolution stage aims to
                  leave the audience with a feeling of satisfaction and
                  fulfillment, tying up loose ends and providing a complete
                  conclusion. Additionally, it may offer a glimpse into the
                  characters' potential futures beyond the scope of the story.
                  This final act ensures a lasting emotional impact, leaving a
                  sense of resonance and reflection for both characters and the
                  audience.
                </Form.Text>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </Col>
  );
}
