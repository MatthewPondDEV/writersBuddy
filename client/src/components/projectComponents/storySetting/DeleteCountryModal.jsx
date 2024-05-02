import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";

export default function DeleteCountryModal({
  showModal,
  setViewNumber,
  handleClose,
  currentCountryId,
  id,
}) {
  async function deleteCountry() {
    const response = await fetch("http://localhost:5000/deleteCountry", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, currentCountryId }),
      credentials: "include",
    });

    if (response.ok) {
      setViewNumber("3");
      window.location.reload();
    } else {
      alert("Failed to delete country");
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
        <Modal.Title>Delete Country</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="text-center py-4">
          Are you sure you want to delete this country from your project?
        </h5>
        <div className="d-flex justify-content-end border-top ">
          <Button variant="secondary me-3 mt-3" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger mt-3" onClick={deleteCountry}>
            Delete
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
