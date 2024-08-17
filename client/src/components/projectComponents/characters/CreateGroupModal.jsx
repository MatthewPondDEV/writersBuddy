import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";


export default function CreateGroupModal({showModal, handleClose, setViewNumber, id, setCurrentGroupId}) {
    const [groupName, setGroupName] = useState('')
    const serverRoute = import.meta.env.VITE_MAIN_API_ROUTE
    
    async function createGroup(event) {
      event.preventDefault();
      const response = await fetch(`${serverRoute}/createGroup`, {
        method: "PUT",
        body: JSON.stringify({ groupName, id }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const idResponse = await fetch(
          `${serverRoute}/getGroupId/${id}`,
          {
            credentials: "include",
          }
        );

        const group = await idResponse.json();
        console.log(group);
        setCurrentGroupId(group._id);
        setViewNumber("13");
        setGroupName("");
        handleClose();
        window.location.reload();
      }
    }
    
    return (
      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        className="mt-5"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create a new group or organization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createGroup}>
            <Form.Group className="mb-4">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="title"
                placeholder={"Name of group or organization"}
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
              />
              <Form.Text muted>
                What is the name of this group? Think "Yakuza", "The Temptations", "Knights of the Round Table"
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