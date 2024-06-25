import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function SaveChatModal({ handleClose, showModal, currentChat, tracker }) {
  const [title, setTitle] = useState("");

  const createNote = async () => {
    const create = await fetch("http://localhost:5000/createNewNote", {
      method: "Post",
      body: JSON.stringify({ title, chatName: currentChat[1] ? currentChat[1] : "Brainstorm Chat", content: JSON.stringify(currentChat), tracker: JSON.stringify(tracker) }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (create.ok) {
      handleClose()
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      className="mt-5"
    >
      <Modal.Header closeButton>
        <Modal.Title>Would you like to save this chat?</Modal.Title>
      </Modal.Header>
      <span className='mx-3'>This chat will be saved as a note</span>
      <Modal.Body>
        <Form onSubmit={createNote}>
          <Form.Group className="mb-4">
            <Form.Label>Title:</Form.Label>
            <Form.Control
              type="title"
              placeholder={
                'Title of this note'
              }
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-end border-top ">
            <Button variant="secondary me-3 mt-3" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary mt-3" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
