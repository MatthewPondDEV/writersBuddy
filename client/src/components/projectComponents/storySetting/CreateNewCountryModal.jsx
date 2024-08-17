import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';

export default function CreateNewCountryModal({showModal,handleClose, id, setViewNumber, setIsUpdated, setCurrentCountryId}) {
    const [countryName,setCountryName] = useState('')
    const serverRoute = import.meta.env.VITE_MAIN_API_ROUTE
    async function createCountry(event) {
        event.preventDefault();
        const response = await fetch(`${serverRoute}/createCountry`, {
            method: 'PUT',
            body: JSON.stringify({countryName, id}),
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
        })
        if (response.ok) {
          setIsUpdated(false)

        const idResponse = await fetch(`${serverRoute}/getCountryId/${id}`, {
            credentials: 'include',
        })

            const country = await idResponse.json()
            setCurrentCountryId(country._id)
            setViewNumber('5')
            setCountryName('')
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
          <Modal.Title>Create a new Country or Territory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createCountry}>
            <Form.Group className="mb-4">
              <Form.Label>Name:</Form.Label>
              <Form.Control
                type="title"
                placeholder = {'Name of the Country, Land, Kingdom or Province you specify'}
                value={countryName}
                onChange={event => setCountryName(event.target.value)}
              />
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