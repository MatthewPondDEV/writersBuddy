import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";

export default function DeleteArcModal({
  showModal,
  setViewNumber,
  handleClose,
  currentArcId,
  id,
}) {
  const serverRoute = import.meta.env.VITE_MAIN_API_ROUTE
  async function deleteArc() {
    const response = await fetch(`${serverRoute}/deleteArc`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, currentArcId }),
      credentials: "include",
    });

    if (response.ok) {
      setViewNumber("3");
      window.location.reload();
    } else {
      alert("Failed to delete land");
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
        <Modal.Title>Delete Arc</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="text-center py-4">
          Are you sure you want to delete this arc from your project?
        </h5>
        <div className="d-flex justify-content-end border-top ">
          <Button variant="secondary me-3 mt-3" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger mt-3" onClick={deleteArc}>
            Delete
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
