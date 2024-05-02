import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";

export default function CreateArcModal({
  showModal,
  setViewNumber,
  id,
  handleClose,
  setCurrentArcId,
}) {
  const [arcName, setArcName] = useState("");

  async function createArc(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:5000/createArc", {
      method: "PUT",
      body: JSON.stringify({ arcName, id }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      const idResponse = await fetch(`http://localhost:5000/getArcId/${id}`, {
        credentials: "include",
      });

      const arc = await idResponse.json();
      console.log(arc);
      setCurrentArcId(arc._id);
      setViewNumber("19");
      setArcName("");
      handleClose();
      window.location.reload();
    }
  }

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      className="mt-5"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create a new story Arc</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={createArc}>
          <Form.Group className="mb-4">
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="title"
              placeholder={'Think "Shibuya Arc", "Black Swordsmith Arc", ...'}
              value={arcName}
              onChange={(ev) => setArcName(ev.target.value)}
            />
            <Form.Text muted>
              Story arcs are parts of your overall project that help you to
              highlight and break down different stories within your overall
              story. They will still follow the traditional story path of
              introduction, development, obstacles, and resolution(In Japan,
              this method of storytelling is known as ki-sho-ten-ketsu).
            </Form.Text>
          </Form.Group>
          <div className="d-flex justify-content-end border-top ">
            <Button variant="secondary me-3 mt-3" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary mt-3" type="submit">
              Create
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
