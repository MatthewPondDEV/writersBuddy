import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ClearChatModal({ handleClose, showModal, setCurrentChat, setTracker }) {

  function clearChat() {
     setCurrentChat(["Let's brainstorm! What can I help you with today?"]);
     setTracker(['res'])
     handleClose()
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
        <Modal.Title>Do you want to clear the current chat?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <div className="d-flex justify-content-end">
            <Button variant="secondary me-3 mt-3" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger mt-3" onClick={clearChat}>
              Clear Chat
            </Button>
          </div>
      </Modal.Body>
    </Modal>
  );
}
