import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";

export default function DeleteProjectModal({
  showModal,
  handleClose,
  id,
  setUpdated
}) {
  async function deleteProject() {
    const deleteFunction = await fetch('http://localhost:5000/deleteProject', {
      method:'Delete',
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json"},
      credentials: 'include',
    })

    if (deleteFunction.ok) {
        setUpdated(false)
        handleClose()
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
        <Modal.Title>Delete Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className='text-center py-4'>
          Are you sure you want to delete this entire project? Once it is deleted, it can not be recovered.
        </h5>
        <div className="d-flex justify-content-end border-top ">
          <Button variant="secondary me-3 mt-3" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger mt-3" onClick={() => {
            deleteProject(id)
          }}>
            Delete
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}