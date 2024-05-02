import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';

export default function CreateBodyOfWaterModal({showModal,handleClose, id, setViewNumber, setIsUpdated, setCurrentBodyOfWaterId}) {
    const [bodyOfWaterName, setBodyOfWaterName] = useState('')

    async function createBodyOfWater(event) {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/createBodyOfWater', {
            method: 'PUT',
            body: JSON.stringify({bodyOfWaterName, id}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        })
        if (response.ok) {
          setIsUpdated(false)

        const idResponse = await fetch(`http://localhost:5000/getBodyOfWaterId/${id}`, {
            credentials: 'include',
        })

            const bodyOfWater = await idResponse.json()
            setCurrentBodyOfWaterId(bodyOfWater._id)
            setViewNumber('9')
            setBodyOfWaterName('')
            handleClose()
            window.location.reload()
    }
    }
    
    return (
        <Modal
        show = {showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={true}
        className='mt-5'
        >
        <Modal.Header closeButton>
          <Modal.Title>Create a new Body of Water</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createBodyOfWater}>
            <Form.Group className="mb-4">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="title"
                placeholder = {'Name of the body of water you specify'}
                value={bodyOfWaterName}
                onChange={event => setBodyOfWaterName(event.target.value)}
              />
              <Form.Text muted>
                What is the name of the body of water? Think "Atlantic Ocean, Dead Sea, Rend Lake, Mississippi River"
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