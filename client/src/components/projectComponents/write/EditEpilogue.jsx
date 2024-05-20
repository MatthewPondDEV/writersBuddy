import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import 'react-quill/dist/quill.snow.css'
import TipTap from "../../Tiptap";

export default function EditEpilogue({projectInfo, setViewNumber, id}) {
const [epilogue, setEpilogue] = useState("");

useEffect(() => {
  if (projectInfo._id) setEpilogue(projectInfo.write.epilogue);
}, [projectInfo._id]);

async function update() {
  const data = new FormData();
  data.set('epilogue', epilogue)
  data.set("id", id);
  const response = await fetch("http://localhost:5000/updateEpilogue", {
    method: "PUT",
    body: data,
    credentials: "include",
  });
  if (response.ok) {
    alert("Successfully saved");
  }
}

    return (
      <Col id="papyrus" xs={12} xxl={9}>
        <h5 className="mt-4 mx-2">Epilogue</h5>
        <Container>
          <Row className="my-5">
            <Col xs={12}>
              <h1 className="text-center my-5">{projectInfo.title} Epilogue</h1>
              <Form onSubmit={update}>
                <div>
                  <TipTap content = {epilogue} onChange={setEpilogue} id = {id} />
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