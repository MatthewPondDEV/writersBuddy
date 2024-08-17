import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useState } from "react";

export default function SaveChatModal({ handleClose, showModal, currentChat }) {
  const [title, setTitle] = useState("");

  const createNote = async (e) => {
    e.preventDefault()
    let content = JSON.parse(window.sessionStorage.getItem("currentChat"))
    for (let i = 0; i < content.length; i++) {
      if (content[i].role === 'assistant') {
        content[i] = `<h4>Chat: ${content[i].content}<br></h4>`
      } else {
        content[i] = `<h4>User: ${content[i].content}<br></h4>`
    }
  }
    content = content.join(' ')

    const create = await fetch(`${serverRoute}/saveChat`, {
      method: "Post",
      body: JSON.stringify({ title, content, currentChat }),
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
