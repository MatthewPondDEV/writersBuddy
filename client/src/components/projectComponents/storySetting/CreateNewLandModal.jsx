import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';

export default function CreateNewLandModal({showModal,handleClose, id, setViewNumber, setIsUpdated, setCurrentLandId}) {
    const [landName,setLandName] = useState('')
    const serverRoute = import.meta.env.VITE_MAIN_API_ROUTE
    async function createLand(event) {
        event.preventDefault();
        const response = await fetch(`${serverRoute}/createLand`, {
            method: 'PUT',
            body: JSON.stringify({landName, id}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        })
        if (response.ok) {
          setIsUpdated(false)

        const idResponse = await fetch(`${serverRoute}/getLandId/${id}`, {
            credentials: 'include',
        })

            const land = await idResponse.json()
            setCurrentLandId(land._id)
            setViewNumber('7')
            setLandName('')
            handleClose()
            window.location.reload()
    }
    }


    return (
        <Modal
        show = {showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className='mt-5'
        >
        <Modal.Header closeButton>
          <Modal.Title>Create a new Land/Desert/Jungle/Area</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createLand}>
            <Form.Group className="mb-4">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="title"
                placeholder = {'Name of the Area you specify'}
                value={landName}
                onChange={event => setLandName(event.target.value)}
              />
              <Form.Text muted>
                Use this field to describe any area in your setting that would generally not be thought of as a place people inhabit to live, but still plays a role in your story. Think "Sahara Desert, Death Star, the Shadow Realm"
              </Form.Text>
            </Form.Group>
            <div className='d-flex justify-content-end border-top '>
            <Button variant="secondary me-3 mt-3" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary mt-3" type="submit">Create</Button>
          </div>
          </Form>
        </Modal.Body>
      </Modal>
    )
}