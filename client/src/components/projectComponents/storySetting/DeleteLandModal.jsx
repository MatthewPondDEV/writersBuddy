import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";

export default function DeleteLandModal({
  showModal,
  setViewNumber,
  handleClose,
  currentLandId,
  id,
}) {
  async function deleteLand() {
    const response = await fetch("http://localhost:5000/deleteLand", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, currentLandId }),
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
        <Modal.Title>Delete Land/Area</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="text-center py-4">
          Are you sure you want to delete this land/area from your project?
        </h5>
        <div className="d-flex justify-content-end border-top ">
          <Button variant="secondary me-3 mt-3" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger mt-3" onClick={deleteLand}>
            Delete
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
