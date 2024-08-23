import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import TipTap from "../../Tiptap";

export default function EditPrologue({projectInfo, setIsUpdated, id}) {
  const [prologue, setPrologue] = useState('')
  const serverRoute = import.meta.env.VITE_MAIN_API_ROUTE

  useEffect(() => {
      if (projectInfo._id) setPrologue(projectInfo.write.prologue)
  }, [projectInfo._id])

async function update(ev) {
  ev.preventDefault();
  const payload = {
    prologue: prologue,
    id: id
  };

  const jsonPayload = JSON.stringify(payload);

  try {
    const response = await fetch(`${serverRoute}/updatePrologue`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: jsonPayload,
      credentials: "include"
    });

    if (response.ok) {
      setIsUpdated(false);
    } else {
      console.error('Update failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error updating:', error);
  }
}
  return (
    <Col id="papyrus" xs={12} xxl={9}>
      <h5 className="mt-4 mx-2">Prologue</h5>
      <Container>
        <Row className="my-5">
          <Col xs={12}>
            <h1 className="text-center my-5">{projectInfo.title} Prologue</h1>
            <Form onSubmit={update}>
              <div>
                <TipTap content = {prologue} onChange={setPrologue} id = {id}/>
              </div>
              <div className="text-center my-5">
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
