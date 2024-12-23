import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";

export default function EditTheme({ projectInfo, _id, setViewNumber, setIsUpdated }) {
  const serverRoute = import.meta.env.VITE_MAIN_API_ROUTE
  const [primary, setPrimary] = useState({
    name: "Primary Theme",
    description: "",
    plan: "",
  });
  const [secondary, setSecondary] = useState([
    { name: "Secondary Theme", description: "", plan: "" },
  ]);

  const handlePrimaryChange = (field, value) => {
    setPrimary((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Define a function to handle changes in the secondary array
  const handleSecondaryChange = (index, field, value) => {
    // Create a copy of the secondary array
    const updated = [...secondary];

    // Update the specific field for the secondary theme at the given index
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setSecondary(updated);
  };

  const addNewTheme = () => {
    const updated = [...secondary];
    updated.push({ bondDescription: "", name: "", relation: "" });
    setSecondary(updated);
  };

  useEffect(() => {
    if (projectInfo._id) {
      setPrimary({
        name: projectInfo.themes.primary?.name || "Primary Theme",
        description: projectInfo.themes.primary?.description || "",
        plan: projectInfo.themes.primary?.plan || "",
      });
      setSecondary(projectInfo.themes.secondary || []);
    }
  }, [projectInfo._id]);

  async function updateThemes(ev) {
  ev.preventDefault();

  const payload = {
    primary: primary,
    id: _id,
    secondary: secondary ? JSON.stringify(secondary) : undefined
  };

  const jsonPayload = JSON.stringify(payload);

  try {
    const response = await fetch(`${serverRoute}/updateThemes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json" 
      },
      body: jsonPayload,  
      credentials: "include"  
    });

    // Check if the response was successful
    if (response.ok) {
      setIsUpdated(false);
    } else {
      console.error('Update failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error updating themes:', error);
  }
}

  return (
    <Col id="papyrus" xs={12} xxl={9}>
      <h5 className="mt-4 mx-2">Themes</h5>
      <Container>
        <Row className="my-5">
          <Form onSubmit={updateThemes}>
            <Row>
              <Col xs={12}>
                <h1 className="text-center my-5">{projectInfo.title} Themes</h1>
                <h1 className="my-5">Primary</h1>

                <Form.Group className="my-2">
                  <h3>{primary.name}</h3>
                  <Form.Label>Name: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={
                      '"You have no enemies. No one has enemies" - Vinland Saga'
                    }
                    value={primary.name || ''
                    }
                    onChange={(ev) =>
                      handlePrimaryChange("name", ev.target.value)
                    }
                  />
                  <Form.Text muted className="">
                    Name your theme with a sentence or phrase.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="my-2">
                  <Form.Label>Description: </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="6"
                    placeholder={"Description of your theme"}
                    value={primary.description || ''}
                    onChange={(ev) =>
                      handlePrimaryChange("description", ev.target.value)
                    }
                  />
                  <Form.Text muted>
                    Describe what the name of your theme means in detail.
                  </Form.Text>
                </Form.Group>
                <Form.Group className="my-2">
                  <Form.Label>Plan: </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="6"
                    placeholder={
                      "Plan for showing this theme through your storytelling."
                    }
                    value={primary.plan || ''}
                    onChange={(ev) =>
                      handlePrimaryChange("plan", ev.target.value)
                    }
                  />
                  <Form.Text muted>
                    How do you plan to convey this theme by telling your story?
                    What scenes or moments will the audience read that show this
                    theme?
                  </Form.Text>
                </Form.Group>
              </Col>
              <h1 className="my-3 mt-5">Secondary</h1>
              {secondary.length > 0 &&
                secondary.map((theme, index) => (
                  <Col md={6} key={theme._id}>
                    <Form.Group className="my-2">
                      <h3>{theme.name}</h3>
                      <Form.Label>Name: </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={
                          '"You have no enemies. No one has enemies" - Vinland Saga'
                        }
                        value={theme.name || ''}
                        onChange={(ev) =>
                          handleSecondaryChange(index, "name", ev.target.value)
                        }
                      />
                      <Form.Text muted className="">
                        Name your theme with a sentence or phrase.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="my-2">
                      <Form.Label>Description: </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="6"
                        placeholder={"Description of your theme"}
                        value={theme.description || ''}
                        onChange={(ev) =>
                          handleSecondaryChange(
                            index,
                            "description",
                            ev.target.value
                          )
                        }
                      />
                      <Form.Text muted>
                        Describe what the name of your theme means in detail.
                      </Form.Text>
                    </Form.Group>
                    <Form.Group className="my-2">
                      <Form.Label>Plan: </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows="6"
                        placeholder={
                          "Plan for showing this theme through your storytelling."
                        }
                        value={theme.plan || ''}
                        onChange={(ev) =>
                          handleSecondaryChange(index, "plan", ev.target.value)
                        }
                      />
                      <Form.Text muted>
                        How do you plan to convey this theme by telling your
                        story? What scenes or moments will the audience read
                        that show this theme?
                      </Form.Text>
                    </Form.Group>
                    <Button
                      variant="primary my-3"
                      size="sm"
                      onClick={() => {
                        const updated = [...secondary];
                        if (index === 0) {
                          updated.shift();
                        } else if (index === updated.length - 1) {
                          updated.pop();
                        } else {
                          updated.splice(index, 1);
                        }
                        setSecondary(updated);
                      }}
                    >
                      Delete
                    </Button>
                  </Col>
                ))}
              <div>
                <Button variant="primary my-3" onClick={addNewTheme}>
                  + Add new secondary theme
                </Button>
              </div>
              <div className="text-center my-5">
                <Button variant="primary w-75 mt-4" size="lg" type="submit">
                  Save Changes
                </Button>
              </div>
            </Row>
          </Form>
        </Row>
      </Container>
    </Col>
  );
}
