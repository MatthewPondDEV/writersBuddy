import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";

export default function DeleteGroupModal({showModal, setViewNumber, handleClose, currentGroupId, id}) {
    const serverRoute = import.meta.env.VITE_MAIN_API_ROUTE
    async function deleteGroup() {
            const response = await fetch(`${serverRoute}/deleteGroup`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id, currentGroupId }),
              credentials: 'include'
            });

            if (response.ok) {
                setViewNumber('3')
                window.location.reload()
            } else {
                alert('Failed to delete group')
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
          <Modal.Title>Delete Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h5 className='py-4 text-center'>Are you sure you want to delete this group from your project?</h5>
            <div className="d-flex justify-content-end border-top ">
              <Button variant="secondary me-3 mt-3" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="danger mt-3" onClick={deleteGroup}>
                Delete
              </Button>
            </div>
        </Modal.Body>
      </Modal>
    );
}